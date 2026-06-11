"""
Short-Term Memory — Redis.

Sesiones activas y contexto inmediato.
TTL: 4 horas.

Almacena:
  - Estado de conversaciones activas
  - Últimas acciones del usuario
  - Cache de resultados recientes de tools
"""

from __future__ import annotations

import json
import logging
from typing import Any

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger(__name__)

TTL_SECONDS = 4 * 3600  # 4 horas

_redis: aioredis.Redis | None = None


async def connect() -> None:
    global _redis
    _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    logger.info("Short-term memory connected (Redis)")


async def disconnect() -> None:
    global _redis
    if _redis:
        await _redis.aclose()
        _redis = None


def _client() -> aioredis.Redis:
    if not _redis:
        raise RuntimeError("Short-term memory not connected")
    return _redis


def _key(namespace: str, session_id: str) -> str:
    return f"stm:{namespace}:{session_id}"


# ── Session state ───────────────────────────────────────────────────────────

async def get_session(session_id: str) -> dict[str, Any] | None:
    """Recupera el estado de una sesión activa."""
    raw = await _client().get(_key("session", session_id))
    if not raw:
        return None
    return json.loads(raw)


async def set_session(session_id: str, data: dict[str, Any]) -> None:
    """Guarda o actualiza el estado de una sesión."""
    await _client().set(_key("session", session_id), json.dumps(data), ex=TTL_SECONDS)


async def delete_session(session_id: str) -> None:
    await _client().delete(_key("session", session_id))


# ── Conversation context ───────────────────────────────────────────────────

async def get_conversation_context(conversation_id: str) -> list[dict]:
    """Recupera mensajes recientes de una conversación."""
    raw = await _client().get(_key("conv", conversation_id))
    if not raw:
        return []
    return json.loads(raw)


async def append_message(conversation_id: str, message: dict) -> None:
    """Agrega un mensaje al contexto de conversación (últimos 20)."""
    messages = await get_conversation_context(conversation_id)
    messages.append(message)
    # Mantener solo los últimos 20 mensajes en short-term
    messages = messages[-20:]
    await _client().set(_key("conv", conversation_id), json.dumps(messages), ex=TTL_SECONDS)


# ── Tool result cache ──────────────────────────────────────────────────────

async def cache_tool_result(tool_name: str, input_hash: str, result: Any, ttl: int = 300) -> None:
    """Cache de resultado de tool (default 5 min)."""
    key = f"stm:cache:{tool_name}:{input_hash}"
    await _client().set(key, json.dumps(result), ex=ttl)


async def get_cached_tool_result(tool_name: str, input_hash: str) -> Any | None:
    """Recupera resultado cacheado de tool."""
    key = f"stm:cache:{tool_name}:{input_hash}"
    raw = await _client().get(key)
    if not raw:
        return None
    return json.loads(raw)


# ── Last actions ────────────────────────────────────────────────────────────

async def record_action(user_id: str, action: dict) -> None:
    """Registra la última acción de un usuario (para contexto)."""
    key = _key("actions", user_id)
    actions_raw = await _client().get(key)
    actions = json.loads(actions_raw) if actions_raw else []
    actions.append(action)
    actions = actions[-10:]  # Últimas 10 acciones
    await _client().set(key, json.dumps(actions), ex=TTL_SECONDS)


async def get_recent_actions(user_id: str) -> list[dict]:
    """Recupera las acciones recientes de un usuario."""
    raw = await _client().get(_key("actions", user_id))
    if not raw:
        return []
    return json.loads(raw)
