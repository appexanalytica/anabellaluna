"""
ARQ Worker — Procesamiento asíncrono de tareas pesadas.

Tareas que se ejecutan en background via Redis queue:
  - Generación de embeddings en batch
  - Análisis profundo de leads
  - Generación de reportes ejecutivos
  - Workflows complejos

El worker corre como proceso separado: python -m queues.worker
"""

from __future__ import annotations

import logging
from typing import Any

from arq import cron
from arq.connections import RedisSettings

from app.config import settings

logger = logging.getLogger(__name__)


# ── Task definitions ──────────────────────────────────────────────────────────

async def task_embed_batch(ctx: dict, texts: list[str], entity_type: str, entity_ids: list[str]) -> dict:
    """Genera embeddings para un batch de textos y los almacena."""
    from embeddings.service import embedding_service

    results = []
    embeddings = await embedding_service.embed_batch(texts)

    for text, embedding, entity_id in zip(texts, embeddings, entity_ids):
        from memory.semantic import store as semantic_store
        record_id = await semantic_store(
            entity_type=entity_type,
            entity_id=entity_id,
            content=text[:2000],
            embedding=embedding,
        )
        results.append(record_id)

    logger.info("Batch embedding completed: %d items of type %s", len(results), entity_type)
    return {"embedded": len(results), "ids": results}


async def task_analyze_lead(ctx: dict, client_id: str) -> dict:
    """Análisis profundo de un lead con scoring y recomendaciones."""
    from tools.crm_client import crm_client
    from analytics.prediction_engine import prediction_engine

    client = await crm_client.get_cliente(client_id)
    result = await prediction_engine.score_lead(client)

    logger.info("Lead analysis completed: client=%s score=%.0f", client_id, result.value)
    return {
        "client_id": client_id,
        "score": result.value,
        "confidence": result.confidence,
        "explanation": result.explanation,
        "factors": result.factors,
    }


async def task_generate_report(ctx: dict, report_type: str = "daily") -> dict:
    """Genera un reporte ejecutivo en background."""
    from agents.executive import ExecutiveIntelligenceAgent

    agent = ExecutiveIntelligenceAgent()
    result = await agent.execute_scheduled()

    logger.info("Report generated: type=%s success=%s", report_type, result.success)
    return {
        "report_type": report_type,
        "success": result.success,
        "output": result.output[:2000],
        "metrics": result.metrics,
    }


async def task_run_workflow(ctx: dict, workflow_name: str) -> dict:
    """Ejecuta un workflow en background."""
    from workflows.engine import workflow_engine

    result = await workflow_engine.run_workflow(workflow_name)

    logger.info(
        "Workflow completed: name=%s status=%s items=%d",
        workflow_name, result.status.value, result.items_detected,
    )
    return {
        "workflow": workflow_name,
        "status": result.status.value,
        "items_detected": result.items_detected,
        "actions_taken": len(result.actions_taken),
        "notifications_sent": result.notifications_sent,
        "error": result.error,
        "duration_ms": result.duration_ms,
    }


async def task_refresh_working_memory(ctx: dict) -> dict:
    """Refresca la working memory desde el CRM."""
    from memory.working import refresh_all
    from tools.crm_client import crm_client

    await refresh_all(crm_client)
    logger.info("Working memory refreshed")
    return {"status": "ok"}


# ── Scheduled (cron) tasks ────────────────────────────────────────────────────

async def scheduled_refresh_memory(ctx: dict) -> None:
    """Refresca working memory cada 30 minutos."""
    await task_refresh_working_memory(ctx)


async def scheduled_run_workflows(ctx: dict) -> None:
    """Ejecuta workflows scheduled."""
    from workflows.engine import workflow_engine
    results = await workflow_engine.run_all_scheduled()
    logger.info("Scheduled workflows completed: %d", len(results))


# ── Startup / Shutdown ────────────────────────────────────────────────────────

async def startup(ctx: dict) -> None:
    """Inicializa conexiones al arrancar el worker."""
    from memory.semantic import connect as pg_connect
    from memory.short_term import connect as stm_connect
    from memory.working import connect as wm_connect
    from tools.crm_client import crm_client

    await pg_connect()
    await stm_connect()
    await wm_connect()
    await crm_client.start()

    logger.info("ARQ worker started — all connections initialized")


async def shutdown(ctx: dict) -> None:
    """Cierra conexiones al detener el worker."""
    from memory.semantic import disconnect as pg_disconnect
    from memory.short_term import disconnect as stm_disconnect
    from memory.working import disconnect as wm_disconnect
    from tools.crm_client import crm_client

    await crm_client.stop()
    await wm_disconnect()
    await stm_disconnect()
    await pg_disconnect()

    logger.info("ARQ worker stopped")


# ── Worker class (arq entrypoint) ─────────────────────────────────────────────

class WorkerSettings:
    """Configuración del worker arq."""

    # Redis connection
    redis_settings = RedisSettings.from_dsn(settings.redis_url)

    # Functions available to enqueue
    functions = [
        task_embed_batch,
        task_analyze_lead,
        task_generate_report,
        task_run_workflow,
        task_refresh_working_memory,
    ]

    # Cron jobs
    cron_jobs = [
        cron(scheduled_refresh_memory, minute={0, 30}),  # Cada 30 min
        cron(scheduled_run_workflows, hour={7, 9}, minute=0),  # 7 AM y 9 AM
    ]

    # Lifecycle
    on_startup = startup
    on_shutdown = shutdown

    # Config
    max_jobs = 5
    job_timeout = 300  # 5 min max por job
    queue_name = "ai-gateway:tasks"
