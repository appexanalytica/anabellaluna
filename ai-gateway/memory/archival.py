"""
Archival Memory — Histórico comprimido.

Almacena resúmenes comprimidos de:
  - Análisis previos de agentes
  - Conversaciones archivadas
  - Tendencias históricas
  - Decisiones importantes

Sin expiración — persistente en PostgreSQL.
Comprime información para no ocupar espacio excesivo.
"""

from __future__ import annotations

import json
import logging
from typing import Any

import asyncpg

from memory.semantic import _get_pool, _json_str

logger = logging.getLogger(__name__)


async def archive_analysis(
    agent_name: str,
    analysis_type: str,
    summary: str,
    *,
    entity_id: str = "",
    entity_type: str = "",
    full_result: dict[str, Any] | None = None,
    metrics: dict[str, Any] | None = None,
) -> str:
    """
    Archiva el resultado de un análisis de agente.

    Guarda una versión comprimida (summary) + metadata.
    El full_result se guarda en JSONB para consulta posterior.
    """
    pool = _get_pool()

    row = await pool.fetchrow(
        """
        INSERT INTO ai_execution_log
            (trace_id, agent_name, trigger_type, trigger_event, input_summary, output_summary,
             tokens_input, tokens_output, cost_usd, success)
        VALUES
            (gen_random_uuid()::text, $1, 'archival', $2, $3, $4, $5, $6, $7, true)
        RETURNING id
        """,
        agent_name,
        analysis_type,
        json.dumps({
            "entity_type": entity_type,
            "entity_id": entity_id,
            "metrics": metrics or {},
        }),
        summary[:2000],
        (metrics or {}).get("tokens_input", 0),
        (metrics or {}).get("tokens_output", 0),
        (metrics or {}).get("cost_usd", 0.0),
    )

    record_id = str(row["id"])
    logger.debug("Archived analysis: agent=%s type=%s id=%s", agent_name, analysis_type, record_id)
    return record_id


async def archive_execution(
    agent_name: str,
    trigger_type: str,
    *,
    trigger_event: str = "",
    input_summary: str = "",
    output_summary: str = "",
    tokens_input: int = 0,
    tokens_output: int = 0,
    cost_usd: float = 0.0,
    latency_ms: int | None = None,
    success: bool = True,
    error_message: str | None = None,
    user_id: str = "",
    agent_id: str = "",
) -> str:
    """
    Archiva una ejecución completa de un agente (exitosa o fallida).

    A diferencia de archive_analysis(), registra trigger_type real
    ('scheduled', 'event', 'user_chat'), latencia y errores.
    """
    pool = _get_pool()

    row = await pool.fetchrow(
        """
        INSERT INTO ai_execution_log
            (trace_id, agent_name, trigger_type, trigger_event, user_id, agent_id,
             input_summary, output_summary, tokens_input, tokens_output,
             cost_usd, latency_ms, success, error_message)
        VALUES
            (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9,
             $10::float8, $11, $12, $13)
        RETURNING id
        """,
        agent_name,
        trigger_type,
        trigger_event,
        user_id,
        agent_id,
        input_summary[:2000],
        output_summary[:2000],
        tokens_input,
        tokens_output,
        float(cost_usd),
        latency_ms,
        success,
        error_message,
    )

    record_id = str(row["id"])
    logger.debug(
        "Archived execution: agent=%s trigger=%s success=%s id=%s",
        agent_name, trigger_type, success, record_id,
    )
    return record_id


async def get_archived_analyses(
    agent_name: str | None = None,
    *,
    analysis_type: str | None = None,
    days: int = 90,
    limit: int = 20,
) -> list[dict[str, Any]]:
    """Recupera análisis archivados."""
    pool = _get_pool()

    conditions = [f"created_at > NOW() - INTERVAL '{days} days'"]
    params: list[Any] = [limit]
    idx = 2

    if agent_name:
        conditions.append(f"agent_name = ${idx}")
        params.append(agent_name)
        idx += 1

    if analysis_type:
        conditions.append(f"trigger_event = ${idx}")
        params.append(analysis_type)
        idx += 1

    where = " AND ".join(conditions)

    rows = await pool.fetch(
        f"""
        SELECT id, agent_name, trigger_event AS analysis_type,
               input_summary, output_summary,
               tokens_input, tokens_output, cost_usd,
               created_at
        FROM ai_execution_log
        WHERE {where}
        ORDER BY created_at DESC
        LIMIT $1
        """,
        *params,
    )

    return [
        {
            "id": str(row["id"]),
            "agent_name": row["agent_name"],
            "analysis_type": row["analysis_type"],
            "input": row["input_summary"],
            "output": row["output_summary"],
            "tokens": row["tokens_input"] + row["tokens_output"],
            "cost_usd": float(row["cost_usd"]) if row["cost_usd"] else 0,
            "created_at": row["created_at"].isoformat(),
        }
        for row in rows
    ]


async def archive_conversation_summary(
    conversation_id: str,
    summary: str,
    *,
    user_id: str = "",
    agent_id: str = "",
    message_count: int = 0,
) -> str:
    """Archiva el resumen comprimido de una conversación cerrada."""
    return await archive_analysis(
        agent_name="system",
        analysis_type="conversation_archive",
        summary=summary,
        entity_id=conversation_id,
        entity_type="conversation",
        metrics={
            "user_id": user_id,
            "agent_id": agent_id,
            "message_count": message_count,
        },
    )
