"""
Inyección de dependencias — FastAPI Depends.

Centraliza la creación y acceso a servicios compartidos:
  - CRM client (HTTP → Node.js)
  - Semantic memory (pgvector)
  - Redis client
  - Langfuse
  - Orchestrator

Todas las dependencias se resuelven via FastAPI Depends()
para facilitar testing y desacoplamiento.
"""

from __future__ import annotations

from functools import lru_cache
from typing import Annotated, AsyncGenerator

import redis.asyncio as aioredis
from fastapi import Depends

from app.config import Settings, settings


@lru_cache
def get_settings() -> Settings:
    return settings


async def get_redis(
    s: Annotated[Settings, Depends(get_settings)],
) -> AsyncGenerator[aioredis.Redis, None]:
    """Redis client para short-term memory y cache."""
    client = aioredis.from_url(s.redis_url, decode_responses=True)
    try:
        yield client
    finally:
        await client.aclose()


def get_crm_client():
    """CRM client singleton — ya inicializado en lifespan."""
    from tools.crm_client import crm_client
    return crm_client


def get_orchestrator():
    """Orchestrator singleton."""
    from orchestrator.router import orchestrator
    return orchestrator


def get_langfuse():
    """Langfuse client — puede ser None si no está configurado."""
    from observability.langfuse_client import get_langfuse as _get
    return _get()


# ── Type aliases para Depends ───────────────────────────────────────────────

SettingsDep = Annotated[Settings, Depends(get_settings)]
CRMClientDep = Annotated[object, Depends(get_crm_client)]
OrchestratorDep = Annotated[object, Depends(get_orchestrator)]
