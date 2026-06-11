"""
Semantic Memory Engine — pgvector.

Almacena y recupera embeddings para:
  - Conversaciones pasadas con clientes
  - Preferencias y comportamiento de leads
  - Resúmenes de análisis previos de IA
  - Notas internas enriquecidas

Búsqueda semántica por cosine similarity.
"""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any
from uuid import uuid4

import asyncpg

from app.config import settings

logger = logging.getLogger(__name__)

_pool: asyncpg.Pool | None = None

# Convertir URL de SQLAlchemy a asyncpg nativo
def _get_dsn() -> str:
    return settings.database_url.replace("postgresql+asyncpg://", "postgresql://")


async def connect() -> None:
    """Inicializa el pool de conexiones a PostgreSQL."""
    global _pool
    if _pool is not None:
        return
    _pool = await asyncpg.create_pool(
        _get_dsn(),
        min_size=2,
        max_size=10,
    )
    logger.info("Semantic memory connected — PostgreSQL pool ready")


async def disconnect() -> None:
    """Cierra el pool de conexiones."""
    global _pool
    if _pool:
        await _pool.close()
        _pool = None


def _get_pool() -> asyncpg.Pool:
    if not _pool:
        raise RuntimeError("Semantic memory not connected — call connect() first")
    return _pool


# ── Store ───────────────────────────────────────────────────────────────────

async def store(
    entity_type: str,
    entity_id: str,
    content: str,
    embedding: list[float],
    *,
    agent_id: str = "",
    metadata: dict[str, Any] | None = None,
    ttl_days: int | None = None,
) -> str:
    """
    Almacena un embedding en la memoria semántica.

    Args:
        entity_type: 'conversation', 'client', 'property', 'note', etc.
        entity_id: ID del objeto (MongoDB ObjectId como string)
        content: Texto original del que se generó el embedding
        embedding: Vector de floats (ej: 1536 dims para ada-002)
        agent_id: ID del agente propietario
        metadata: Info extra como JSON
        ttl_days: Si se especifica, el registro expira en N días

    Returns:
        UUID del registro creado
    """
    pool = _get_pool()
    record_id = str(uuid4())
    expires_at = None
    if ttl_days:
        expires_at = datetime.utcnow().replace(microsecond=0)
        expires_at = expires_at.replace(day=expires_at.day + ttl_days) if ttl_days < 28 else None

    embedding_str = "[" + ",".join(str(v) for v in embedding) + "]"

    await pool.execute(
        """
        INSERT INTO semantic_memory (id, entity_type, entity_id, content, embedding, agent_id, metadata, expires_at)
        VALUES ($1, $2, $3, $4, $5::vector, $6, $7::jsonb, $8)
        """,
        record_id,
        entity_type,
        entity_id,
        content,
        embedding_str,
        agent_id or None,
        _json_str(metadata),
        expires_at,
    )

    logger.debug("Stored semantic memory: type=%s entity=%s", entity_type, entity_id)
    return record_id


# ── Search ──────────────────────────────────────────────────────────────────

async def search(
    query_embedding: list[float],
    *,
    entity_type: str | None = None,
    agent_id: str | None = None,
    top_k: int = 5,
    min_similarity: float = 0.7,
) -> list[dict[str, Any]]:
    """
    Búsqueda semántica por cosine similarity.

    Returns:
        Lista de {id, entity_type, entity_id, content, similarity, metadata}
        ordenada por relevancia descendente.
    """
    pool = _get_pool()
    embedding_str = "[" + ",".join(str(v) for v in query_embedding) + "]"

    # Construir filtros dinámicamente
    conditions = ["(expires_at IS NULL OR expires_at > NOW())"]
    params: list[Any] = [embedding_str, top_k]
    param_idx = 3

    if entity_type:
        conditions.append(f"entity_type = ${param_idx}")
        params.append(entity_type)
        param_idx += 1

    if agent_id:
        conditions.append(f"agent_id = ${param_idx}")
        params.append(agent_id)
        param_idx += 1

    where = " AND ".join(conditions)

    rows = await pool.fetch(
        f"""
        SELECT
            id, entity_type, entity_id, content, metadata,
            1 - (embedding <=> $1::vector) AS similarity
        FROM semantic_memory
        WHERE {where}
        ORDER BY embedding <=> $1::vector
        LIMIT $2
        """,
        *params,
    )

    results = []
    for row in rows:
        sim = float(row["similarity"])
        if sim < min_similarity:
            continue
        results.append({
            "id": row["id"],
            "entity_type": row["entity_type"],
            "entity_id": row["entity_id"],
            "content": row["content"],
            "similarity": round(sim, 4),
            "metadata": row["metadata"],
        })

    return results


# ── Temporal Memory ─────────────────────────────────────────────────────────

async def record_metric(
    metric: str,
    value: float,
    *,
    agent_id: str = "",
    entity_id: str = "",
    metadata: dict[str, Any] | None = None,
) -> None:
    """
    Registra un valor en la memoria temporal (series de tiempo).

    Args:
        metric: Nombre de la métrica, ej: 'conversion_rate', 'avg_response_time'
        value: Valor numérico
    """
    pool = _get_pool()
    await pool.execute(
        """
        INSERT INTO temporal_memory (metric, agent_id, entity_id, value, metadata)
        VALUES ($1, $2, $3, $4, $5::jsonb)
        """,
        metric,
        agent_id or None,
        entity_id or None,
        value,
        _json_str(metadata),
    )


async def get_metric_history(
    metric: str,
    *,
    agent_id: str | None = None,
    days: int = 30,
    limit: int = 100,
) -> list[dict[str, Any]]:
    """Retorna historial de una métrica para análisis de tendencia."""
    pool = _get_pool()

    conditions = ["metric = $1", f"recorded_at > NOW() - INTERVAL '{days} days'"]
    params: list[Any] = [metric, limit]
    param_idx = 3

    if agent_id:
        conditions.append(f"agent_id = ${param_idx}")
        params.append(agent_id)
        param_idx += 1

    where = " AND ".join(conditions)

    rows = await pool.fetch(
        f"""
        SELECT metric, agent_id, entity_id, value, metadata, recorded_at
        FROM temporal_memory
        WHERE {where}
        ORDER BY recorded_at DESC
        LIMIT $2
        """,
        *params,
    )

    return [
        {
            "metric": row["metric"],
            "agent_id": row["agent_id"],
            "value": float(row["value"]) if row["value"] else 0,
            "recorded_at": row["recorded_at"].isoformat(),
            "metadata": row["metadata"],
        }
        for row in rows
    ]


# ── Helpers ─────────────────────────────────────────────────────────────────

def _json_str(data: dict | None) -> str:
    import json
    return json.dumps(data or {})
