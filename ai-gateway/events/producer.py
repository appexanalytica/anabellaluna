"""
Event Producer — Publica eventos desde el AI Gateway al stream de Redis.

Permite que el AI Gateway publique eventos propios que el backend
u otros servicios pueden consumir:
  - ai.insight_generated
  - ai.suggestion_sent
  - ai.workflow_completed
  - ai.anomaly_detected

Usa el mismo stream 'events:business' para mantener un único bus de eventos.
"""

from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger(__name__)

STREAM_KEY = "events:business"
MAX_STREAM_LEN = 10000

_redis: aioredis.Redis | None = None


async def connect() -> None:
    """Conecta al Redis para publicar eventos."""
    global _redis
    _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    logger.info("Event producer connected (Redis)")


async def disconnect() -> None:
    """Cierra la conexión."""
    global _redis
    if _redis:
        await _redis.aclose()
        _redis = None


def _client() -> aioredis.Redis:
    if not _redis:
        raise RuntimeError("Event producer not connected")
    return _redis


async def publish_event(
    event_type: str,
    payload: dict[str, Any],
    *,
    correlation_id: str = "",
    user_id: str = "",
    agent_id: str = "",
) -> str:
    """
    Publica un evento al stream de Redis.

    Args:
        event_type: Tipo de evento (ej: 'ai.insight_generated')
        payload: Datos del evento
        correlation_id: ID de correlación para tracing
        user_id: ID del usuario relacionado
        agent_id: ID del agente relacionado

    Returns:
        Stream ID del mensaje publicado
    """
    event_id = str(uuid4())

    event_data = {
        "event_id": event_id,
        "event_type": event_type,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service_origin": "ai-gateway",
        "correlation_id": correlation_id or event_id,
        "user_id": user_id,
        "agent_id": agent_id,
        "payload": json.dumps(payload, default=str),
    }

    try:
        stream_id = await _client().xadd(
            STREAM_KEY,
            event_data,
            maxlen=MAX_STREAM_LEN,
        )
        logger.debug(
            "Published event: type=%s id=%s stream_id=%s",
            event_type, event_id[:8], stream_id,
        )
        return stream_id
    except Exception as e:
        logger.warning("Failed to publish event %s: %s", event_type, e)
        return ""


async def publish_event_async(
    event_type: str,
    payload: dict[str, Any],
    **kwargs: Any,
) -> None:
    """
    Fire-and-forget: publica evento sin esperar resultado.
    Los errores se loguean pero no se propagan.
    """
    try:
        await publish_event(event_type, payload, **kwargs)
    except Exception:
        pass


# ── Convenience methods ───────────────────────────────────────────────────────

async def emit_insight(
    agent_name: str,
    insight_type: str,
    data: dict[str, Any],
    *,
    agent_id: str = "",
) -> str:
    """Emite un evento de insight generado por IA."""
    return await publish_event(
        "ai.insight_generated",
        {
            "ai_agent": agent_name,
            "insight_type": insight_type,
            **data,
        },
        agent_id=agent_id,
    )


async def emit_suggestion(
    agent_name: str,
    title: str,
    message: str,
    *,
    target_agent_id: str = "",
    priority: str = "media",
) -> str:
    """Emite un evento de sugerencia de IA."""
    return await publish_event(
        "ai.suggestion_sent",
        {
            "ai_agent": agent_name,
            "title": title,
            "message": message,
            "priority": priority,
            "target_agent_id": target_agent_id,
        },
        agent_id=target_agent_id,
    )


async def emit_workflow_completed(
    workflow_name: str,
    result: dict[str, Any],
) -> str:
    """Emite un evento de workflow completado."""
    return await publish_event(
        "ai.workflow_completed",
        {
            "workflow": workflow_name,
            **result,
        },
    )


async def emit_anomaly(
    metric: str,
    current_value: float,
    expected_value: float,
    *,
    severity: str = "warning",
) -> str:
    """Emite un evento de anomalía detectada."""
    return await publish_event(
        "ai.anomaly_detected",
        {
            "metric": metric,
            "current_value": current_value,
            "expected_value": expected_value,
            "severity": severity,
        },
    )
