"""
Working Memory — Contexto operacional reciente.

TTL: 7 días.

Almacena snapshot del estado del negocio que se actualiza periódicamente:
  - Métricas del dashboard
  - Leads activos y su estado
  - Pipeline actual
  - Agentes y su actividad
"""

from __future__ import annotations

import json
import logging
from typing import Any

import redis.asyncio as aioredis

from app.config import settings

logger = logging.getLogger(__name__)

TTL_SECONDS = 7 * 24 * 3600  # 7 días

_redis: aioredis.Redis | None = None


async def connect() -> None:
    global _redis
    _redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    logger.info("Working memory connected (Redis)")


async def disconnect() -> None:
    global _redis
    if _redis:
        await _redis.aclose()
        _redis = None


def _client() -> aioredis.Redis:
    if not _redis:
        raise RuntimeError("Working memory not connected")
    return _redis


def _key(category: str) -> str:
    return f"wm:{category}"


# ── Operational snapshot ────────────────────────────────────────────────────

async def update_snapshot(category: str, data: dict[str, Any]) -> None:
    """Actualiza un snapshot del estado operacional."""
    await _client().set(_key(category), json.dumps(data), ex=TTL_SECONDS)
    logger.debug("Working memory updated: %s", category)


async def get_snapshot(category: str) -> dict[str, Any] | None:
    """Recupera un snapshot operacional."""
    raw = await _client().get(_key(category))
    if not raw:
        return None
    return json.loads(raw)


# ── Predefined snapshots ───────────────────────────────────────────────────

async def update_dashboard_snapshot(stats: dict) -> None:
    """Guarda snapshot del dashboard general."""
    await update_snapshot("dashboard", stats)


async def get_dashboard_snapshot() -> dict | None:
    return await get_snapshot("dashboard")


async def update_pipeline_snapshot(pipeline: dict) -> None:
    """Guarda snapshot del pipeline de leads."""
    await update_snapshot("pipeline", pipeline)


async def get_pipeline_snapshot() -> dict | None:
    return await get_snapshot("pipeline")


async def update_agent_activity(agent_id: str, activity: dict) -> None:
    """Guarda actividad reciente de un agente."""
    await update_snapshot(f"agent:{agent_id}", activity)


async def get_agent_activity(agent_id: str) -> dict | None:
    return await get_snapshot(f"agent:{agent_id}")


# ── Refresh from CRM ───────────────────────────────────────────────────────

async def refresh_all(crm_client) -> None:
    """
    Refresca todos los snapshots desde el backend.
    Llamar periódicamente (e.g., cada 30 min).
    """
    try:
        dashboard = await crm_client.get_dashboard_stats()
        await update_dashboard_snapshot(dashboard)

        agentes = await crm_client.list_agentes()
        await update_snapshot("agentes", {"agentes": agentes, "count": len(agentes)})

        logger.info("Working memory refreshed: dashboard + %d agentes", len(agentes))
    except Exception as e:
        logger.warning("Failed to refresh working memory: %s", e)
