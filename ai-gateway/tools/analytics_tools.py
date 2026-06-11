"""
Analytics Tools — Métricas, KPIs y estadísticas.

Tools registradas:
  - get_dashboard_metrics: Métricas generales del dashboard
  - get_agent_metrics: Métricas por agente
  - get_conversion_funnel: Funnel de conversión
  - get_metric_history: Historial de una métrica temporal

Datos provienen del backend CRM y de la memoria temporal (PostgreSQL).
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from memory.semantic import get_metric_history
from tools.crm_client import crm_client
from tools.registry import tool_registry


# ── Parameter Models ──────────────────────────────────────────────────────────

class DashboardMetricsParams(BaseModel):
    agente_id: Optional[str] = Field(None, description="Si se especifica, métricas de ese agente")


class AgentMetricsParams(BaseModel):
    agente_id: str = Field(..., description="ID del agente")


class ConversionFunnelParams(BaseModel):
    agente_id: Optional[str] = Field(None, description="Filtrar por agente")


class MetricHistoryParams(BaseModel):
    metric: str = Field(..., description="Nombre de la métrica (ej: conversion_rate, avg_response_time)")
    agente_id: Optional[str] = Field(None, description="Filtrar por agente")
    days: int = Field(30, description="Últimos N días", ge=1, le=365)
    limit: int = Field(100, description="Máximo de registros", ge=1, le=1000)


# ── Tool Handlers ─────────────────────────────────────────────────────────────

async def _get_dashboard_metrics(agente_id: str | None = None):
    """Obtiene métricas generales del dashboard."""
    if agente_id:
        stats = await crm_client.get_agent_dashboard_stats(agente_id)
    else:
        stats = await crm_client.get_dashboard_stats()

    return {
        "total_clientes": stats.get("totalClientes", 0),
        "total_propiedades": stats.get("totalPropiedades", 0),
        "total_operaciones": stats.get("totalOperaciones", 0),
        "total_citas": stats.get("totalCitas", 0),
        "total_tareas": stats.get("totalTareas", 0),
        "citas_hoy": stats.get("citasHoy", 0),
        "tareas_vencidas": stats.get("tareasVencidas", 0),
        "leads_sin_seguimiento": stats.get("leadsSinSeguimiento", 0),
        "conversion_rate": stats.get("conversionRate", None),
        "raw": stats,
    }


async def _get_agent_metrics(agente_id: str):
    """Obtiene métricas específicas de un agente."""
    stats = await crm_client.get_agent_dashboard_stats(agente_id)
    tareas = await crm_client.list_tareas(agente_id=agente_id)
    citas = await crm_client.list_citas(agente_id=agente_id)

    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    overdue = 0
    for t in tareas:
        due = t.get("dueDate")
        if due:
            try:
                due_dt = datetime.fromisoformat(str(due).replace("Z", "+00:00"))
                if due_dt < now and t.get("status") in ("pendiente", "en_progreso"):
                    overdue += 1
            except (ValueError, TypeError):
                pass

    return {
        "agente_id": agente_id,
        "dashboard": stats,
        "tareas_pendientes": len([t for t in tareas if t.get("status") == "pendiente"]),
        "tareas_vencidas": overdue,
        "citas_total": len(citas),
        "citas_pendientes": len([c for c in citas if c.get("estado") == "programada"]),
    }


async def _get_conversion_funnel(agente_id: str | None = None):
    """Genera un funnel de conversión simplificado."""
    clientes = await crm_client.search_clientes(agente_id=agente_id, limit=100)

    stages = {
        "lead": 0,
        "contactado": 0,
        "calificado": 0,
        "propuesta": 0,
        "negociacion": 0,
        "cerrado_ganado": 0,
        "cerrado_perdido": 0,
        "otro": 0,
    }

    for c in clientes:
        stage = (c.get("metadata", {}).get("estado", "") or "lead").lower().replace(" ", "_")
        if stage in stages:
            stages[stage] += 1
        else:
            stages["otro"] += 1

    total = len(clientes)
    return {
        "total_leads": total,
        "funnel": stages,
        "conversion_rate": round(stages["cerrado_ganado"] / total * 100, 1) if total > 0 else 0,
        "loss_rate": round(stages["cerrado_perdido"] / total * 100, 1) if total > 0 else 0,
    }


async def _get_metric_history_handler(
    metric: str,
    agente_id: str | None = None,
    days: int = 30,
    limit: int = 100,
):
    """Obtiene historial de una métrica de la memoria temporal."""
    return await get_metric_history(metric, agent_id=agente_id, days=days, limit=limit)


# ── Registration ──────────────────────────────────────────────────────────────

def register_analytics_tools() -> None:
    """Registra todas las analytics tools en el registry global."""

    tool_registry.register(
        "get_dashboard_metrics",
        "Obtener métricas generales del dashboard (clientes, propiedades, tareas, citas, conversión)",
        DashboardMetricsParams,
        _get_dashboard_metrics,
        category="analytics",
        is_read_only=True,
    )

    tool_registry.register(
        "get_agent_metrics",
        "Obtener métricas específicas de un agente (tareas, citas, rendimiento)",
        AgentMetricsParams,
        _get_agent_metrics,
        category="analytics",
        is_read_only=True,
    )

    tool_registry.register(
        "get_conversion_funnel",
        "Obtener funnel de conversión de leads (etapas, tasas de conversión/pérdida)",
        ConversionFunnelParams,
        _get_conversion_funnel,
        category="analytics",
        is_read_only=True,
    )

    tool_registry.register(
        "get_metric_history",
        "Obtener historial temporal de una métrica (series de tiempo)",
        MetricHistoryParams,
        _get_metric_history_handler,
        category="analytics",
        is_read_only=True,
    )
