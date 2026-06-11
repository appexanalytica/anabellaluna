"""
Redis Streams Consumer — Lee eventos de negocio del backend Node.js.

El backend publica eventos tipados en el stream 'events:business'.
Este consumer los lee en tiempo real y los rutea a los agentes correspondientes.

Consumer group: 'ai-gateway'
Permite que múltiples instancias del AI Gateway escalen horizontalmente
sin procesar el mismo evento dos veces.
"""

from __future__ import annotations

import asyncio
import json
import logging
from dataclasses import dataclass, field
from typing import Any, Callable, Coroutine

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger(__name__)

STREAM_KEY = "events:business"
GROUP_NAME = "ai-gateway"
CONSUMER_NAME = "worker-1"
BLOCK_MS = 5000  # Esperar hasta 5s por nuevos eventos
BATCH_SIZE = 10


@dataclass
class BusinessEvent:
    """Evento de negocio del backend Node.js."""

    event_id: str
    event_type: str
    timestamp: str
    service_origin: str
    correlation_id: str
    user_id: str
    agent_id: str
    payload: dict[str, Any]
    stream_id: str = ""  # Redis stream ID para ACK

    @classmethod
    def from_stream(cls, stream_id: str, data: dict[str, str]) -> BusinessEvent:
        payload_raw = data.get("payload", "{}")
        try:
            payload = json.loads(payload_raw)
        except json.JSONDecodeError:
            payload = {"raw": payload_raw}

        return cls(
            event_id=data.get("event_id", ""),
            event_type=data.get("event_type", "unknown"),
            timestamp=data.get("timestamp", ""),
            service_origin=data.get("service_origin", ""),
            correlation_id=data.get("correlation_id", ""),
            user_id=data.get("user_id", ""),
            agent_id=data.get("agent_id", ""),
            payload=payload,
            stream_id=stream_id,
        )


# Type alias para handlers
EventHandler = Callable[[BusinessEvent], Coroutine[Any, Any, None]]


@dataclass
class EventConsumer:
    """Consumer de Redis Streams con registro de handlers por event_type."""

    _handlers: dict[str, list[EventHandler]] = field(default_factory=dict)
    _wildcard_handlers: list[EventHandler] = field(default_factory=list)
    _redis: aioredis.Redis | None = None
    _running: bool = False

    def on(self, event_type: str, handler: EventHandler) -> None:
        """Registra un handler para un tipo de evento específico."""
        self._handlers.setdefault(event_type, []).append(handler)

    def on_all(self, handler: EventHandler) -> None:
        """Registra un handler que recibe TODOS los eventos."""
        self._wildcard_handlers.append(handler)

    async def start(self) -> None:
        """Conecta a Redis y crea el consumer group si no existe."""
        self._redis = aioredis.from_url(
            settings.redis_url,
            decode_responses=True,
        )

        # Crear consumer group (idempotente)
        try:
            await self._redis.xgroup_create(STREAM_KEY, GROUP_NAME, id="0", mkstream=True)
            logger.info("Consumer group '%s' created on stream '%s'", GROUP_NAME, STREAM_KEY)
        except aioredis.ResponseError as e:
            if "BUSYGROUP" in str(e):
                logger.info("Consumer group '%s' already exists", GROUP_NAME)
            else:
                raise

        self._running = True
        logger.info(
            "Event consumer started — stream=%s group=%s consumer=%s",
            STREAM_KEY, GROUP_NAME, CONSUMER_NAME,
        )

    async def stop(self) -> None:
        """Detiene el consumer y cierra la conexión."""
        self._running = False
        if self._redis:
            await self._redis.aclose()
            self._redis = None
        logger.info("Event consumer stopped")

    async def run(self) -> None:
        """
        Loop principal — lee eventos del stream y los despacha a handlers.
        Diseñado para correr como asyncio.Task en background.
        """
        if not self._redis:
            raise RuntimeError("Consumer not started — call start() first")

        while self._running:
            try:
                # Leer batch de eventos del consumer group
                results = await self._redis.xreadgroup(
                    groupname=GROUP_NAME,
                    consumername=CONSUMER_NAME,
                    streams={STREAM_KEY: ">"},
                    count=BATCH_SIZE,
                    block=BLOCK_MS,
                )

                if not results:
                    continue

                for _stream_name, messages in results:
                    for stream_id, data in messages:
                        event = BusinessEvent.from_stream(stream_id, data)

                        try:
                            await self._dispatch(event)
                            # ACK: confirmar que el evento fue procesado
                            await self._redis.xack(STREAM_KEY, GROUP_NAME, stream_id)
                        except Exception:
                            logger.exception(
                                "Failed to process event %s (type=%s) — will retry",
                                event.event_id, event.event_type,
                            )
                            # No ACK → Redis re-entregará este evento

            except aioredis.ConnectionError:
                logger.warning("Redis connection lost — reconnecting in 5s...")
                await asyncio.sleep(5)
            except Exception:
                logger.exception("Unexpected error in event consumer loop")
                await asyncio.sleep(1)

    async def _dispatch(self, event: BusinessEvent) -> None:
        """Despacha un evento a todos los handlers registrados."""
        handlers = list(self._wildcard_handlers)
        handlers.extend(self._handlers.get(event.event_type, []))

        # También matchear prefijos: 'client.*' handlers reciben client.created
        prefix = event.event_type.rsplit(".", 1)[0] + ".*"
        handlers.extend(self._handlers.get(prefix, []))

        if not handlers:
            logger.debug("No handlers for event type '%s' — skipping", event.event_type)
            return

        logger.info(
            "Dispatching event %s (type=%s) to %d handler(s)",
            event.event_id[:8], event.event_type, len(handlers),
        )

        for handler in handlers:
            try:
                await handler(event)
            except Exception:
                logger.exception(
                    "Handler %s failed for event %s",
                    handler.__name__, event.event_type,
                )


# Singleton
event_consumer = EventConsumer()
