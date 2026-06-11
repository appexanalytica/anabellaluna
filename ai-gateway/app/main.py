"""
AI Gateway — FastAPI Application.

Cerebro cognitivo del sistema Anabella Luna.
Coordina agentes especializados, consume eventos de negocio,
y expone endpoints para chat e insights.

Startup:
    uvicorn app.main:app --host 0.0.0.0 --port 8100
"""

from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from app.config import settings

# ── Logging ─────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s [%(name)s] %(levelname)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("ai-gateway")


# ── Lifespan ────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup y shutdown del AI Gateway."""
    logger.info("Starting AI Gateway on port %d...", settings.ai_gateway_port)

    # 1. Conectar CRM client (HTTP → Node.js backend)
    from tools.crm_client import crm_client
    await crm_client.start()

    # 2. Conectar memory layers
    from memory.semantic import connect as connect_semantic
    from memory.short_term import connect as connect_stm
    from memory.working import connect as connect_wm

    try:
        await connect_semantic()
    except Exception as e:
        logger.warning("Semantic memory unavailable: %s — continuing without it", e)

    try:
        await connect_stm()
    except Exception as e:
        logger.warning("Short-term memory unavailable: %s — continuing without it", e)

    try:
        await connect_wm()
    except Exception as e:
        logger.warning("Working memory unavailable: %s — continuing without it", e)

    # 2b. Conectar event producer (Redis → outgoing AI events)
    from events.producer import connect as connect_producer
    try:
        await connect_producer()
    except Exception as e:
        logger.warning("Event producer unavailable: %s — AI events will not be published", e)

    # 2c. Registrar tools en el registry global
    from tools.crm_tools import register_crm_tools
    from tools.property_tools import register_property_tools
    from tools.analytics_tools import register_analytics_tools
    from tools.notification_tools import register_notification_tools

    register_crm_tools()
    register_property_tools()
    register_analytics_tools()
    register_notification_tools()
    logger.info("Tool registry initialized")

    # 2d. Registrar prompts base
    from prompts.registry import register_core_prompts
    register_core_prompts()

    # 2e. Inicializar OpenTelemetry
    from observability.otel import init_telemetry, instrument_fastapi, instrument_httpx
    init_telemetry()
    instrument_httpx()

    # 3. Registrar agentes
    from agents.executive import ExecutiveIntelligenceAgent
    from agents.lead import LeadIntelligenceAgent
    from agents.market import MarketIntelligenceAgent
    from agents.operational import OperationalIntelligenceAgent
    from agents.property import PropertyIntelligenceAgent
    from orchestrator.router import orchestrator

    orchestrator.register(OperationalIntelligenceAgent())
    orchestrator.register(LeadIntelligenceAgent())
    orchestrator.register(PropertyIntelligenceAgent())
    orchestrator.register(ExecutiveIntelligenceAgent())
    orchestrator.register(MarketIntelligenceAgent())

    # 3b. Registrar workflows
    from workflows.engine import workflow_engine
    from workflows.inactive_property import InactivePropertyWorkflow
    from workflows.hot_lead import HotLeadWorkflow
    from workflows.conversion_drop import ConversionDropWorkflow

    workflow_engine.register(InactivePropertyWorkflow())
    workflow_engine.register(HotLeadWorkflow())
    workflow_engine.register(ConversionDropWorkflow())
    logger.info("Workflow engine initialized — %d workflows", len(workflow_engine.list_workflows()))

    # 4. Iniciar event consumer (Redis Streams)
    from events.consumer import event_consumer
    consumer_task = None
    try:
        await event_consumer.start()
        consumer_task = asyncio.create_task(event_consumer.run(), name="event-consumer")
        logger.info("Event consumer started — listening to Redis Streams")
    except Exception as e:
        logger.warning("Event consumer failed to start: %s — events will not be processed", e)

    # 5. Iniciar scheduled tasks de agentes
    await orchestrator.start_scheduled()

    # 6. Health check del backend
    backend_ok = await crm_client.health()
    if backend_ok:
        logger.info("Backend Node.js reachable at %s", settings.backend_url)
    else:
        logger.warning("Backend Node.js NOT reachable at %s", settings.backend_url)

    logger.info("AI Gateway ready.")

    yield

    # ── Shutdown ────────────────────────────────────────────────────────────
    logger.info("Shutting down AI Gateway...")

    await orchestrator.stop_scheduled()

    if consumer_task:
        await event_consumer.stop()
        consumer_task.cancel()
        try:
            await consumer_task
        except asyncio.CancelledError:
            pass

    from memory.semantic import disconnect as disconnect_semantic
    await disconnect_semantic()

    from memory.short_term import disconnect as disconnect_stm
    await disconnect_stm()

    from memory.working import disconnect as disconnect_wm
    await disconnect_wm()

    from events.producer import disconnect as disconnect_producer
    await disconnect_producer()

    await crm_client.stop()

    from observability.langfuse_client import shutdown_langfuse
    shutdown_langfuse()

    logger.info("AI Gateway stopped.")


# ── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Anabella Luna AI Gateway",
    description="Cognitive layer for real estate ERP/CRM",
    version="0.1.0",
    lifespan=lifespan,
)

# Instrumentar FastAPI con OpenTelemetry (debe hacerse después de crear app)
try:
    from observability.otel import instrument_fastapi
    instrument_fastapi(app)
except Exception:
    pass


# ── Request/Response Models ─────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    user_id: str = ""
    agent_id: str = ""
    target_agent: str | None = None


class ChatResponse(BaseModel):
    agent: str
    response: str
    insights: list[dict] = []
    metrics: dict = {}


class HealthResponse(BaseModel):
    status: str
    backend: bool
    redis: bool
    postgres: bool
    agents: list[dict]


# ── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check completo del AI Gateway."""
    from tools.crm_client import crm_client
    from orchestrator.router import orchestrator

    backend_ok = await crm_client.health()

    # Check Redis
    redis_ok = False
    try:
        from events.consumer import event_consumer
        if event_consumer._redis:
            await event_consumer._redis.ping()
            redis_ok = True
    except Exception:
        pass

    # Check PostgreSQL
    pg_ok = False
    try:
        from memory.semantic import _pool
        if _pool:
            async with _pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            pg_ok = True
    except Exception:
        pass

    return HealthResponse(
        status="healthy" if backend_ok else "degraded",
        backend=backend_ok,
        redis=redis_ok,
        postgres=pg_ok,
        agents=orchestrator.get_agent_status(),
    )


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Endpoint de chat — rutea al agente apropiado.
    Puede ser llamado desde el frontend o desde el backend Node.js.
    """
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    from orchestrator.router import orchestrator

    result = await orchestrator.route_chat(
        req.message,
        user_id=req.user_id,
        agent_id=req.agent_id,
        target_agent=req.target_agent,
    )

    if not result.success:
        raise HTTPException(status_code=500, detail=result.error or "Agent failed")

    return ChatResponse(
        agent=result.agent_name,
        response=result.output,
        insights=result.insights,
        metrics=result.metrics,
    )


@app.get("/agents")
async def list_agents():
    """Lista todos los agentes registrados y su estado."""
    from orchestrator.router import orchestrator
    return {"agents": orchestrator.get_agent_status()}


@app.post("/agents/{agent_name}/run")
async def run_agent(agent_name: str):
    """
    Fuerza la ejecución scheduled de un agente.
    Útil para testing y análisis bajo demanda.
    """
    from orchestrator.router import orchestrator

    if agent_name not in orchestrator._agents:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_name}' not found")

    agent = orchestrator._agents[agent_name]
    result = await agent.execute_scheduled()

    # Enviar sugerencias si las hay
    if result.notifications:
        for notif in result.notifications:
            await agent._send_suggestion(notif)

    return {
        "agent": result.agent_name,
        "success": result.success,
        "output": result.output[:500],
        "insights_count": len(result.insights),
        "notifications_sent": len(result.notifications),
        "metrics": result.metrics,
    }


@app.get("/suggestions")
async def list_suggestions(unread_only: bool = True, limit: int = 50):
    """
    Sugerencias IA pendientes.
    Lee notificaciones de tipo 'ai_suggestion' del backend.
    """
    from tools.crm_client import crm_client

    try:
        data = await crm_client.list_notifications(
            tipo="ai_suggestion",
            leida=False if unread_only else None,
            limite=limit,
        )
        return data
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Backend unreachable: {e}")


@app.post("/workflows/{workflow_name}/run")
async def run_workflow(workflow_name: str):
    """
    Ejecuta un workflow manualmente por nombre.
    Útil para testing y ejecución bajo demanda.
    """
    from workflows.engine import workflow_engine

    wf = workflow_engine.get(workflow_name)
    if not wf:
        raise HTTPException(status_code=404, detail=f"Workflow '{workflow_name}' not found")

    result = await workflow_engine.run_workflow(workflow_name)

    return {
        "workflow": result.workflow_name,
        "status": result.status.value,
        "items_detected": result.items_detected,
        "items_processed": result.items_processed,
        "actions_taken": len(result.actions_taken),
        "notifications_sent": result.notifications_sent,
        "duration_ms": result.duration_ms,
        "error": result.error,
    }


@app.get("/metrics")
async def get_metrics():
    """
    Métricas del AI Gateway: agentes, workflows recientes, memoria.
    """
    from orchestrator.router import orchestrator
    from workflows.engine import workflow_engine
    from tools.crm_client import crm_client

    # Agent status
    agents = orchestrator.get_agent_status()

    # Registered workflows
    workflows = workflow_engine.list_workflows()

    # Recent workflow runs (last 20)
    recent_runs = await workflow_engine.get_recent_runs(limit=20)

    # Backend connectivity
    backend_ok = await crm_client.health()

    # Redis status
    redis_ok = False
    try:
        from events.consumer import event_consumer
        if event_consumer._redis:
            await event_consumer._redis.ping()
            redis_ok = True
    except Exception:
        pass

    # PostgreSQL status
    pg_ok = False
    try:
        from memory.semantic import _pool
        if _pool:
            async with _pool.acquire() as conn:
                await conn.fetchval("SELECT 1")
            pg_ok = True
    except Exception:
        pass

    return {
        "agents": {
            "total": len(agents),
            "list": agents,
        },
        "workflows": {
            "total": len(workflows),
            "list": workflows,
            "recent_runs": recent_runs,
        },
        "infrastructure": {
            "backend": backend_ok,
            "redis": redis_ok,
            "postgres": pg_ok,
        },
    }
