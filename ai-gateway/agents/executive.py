"""
Executive Intelligence Agent — Resúmenes ejecutivos y análisis estratégico.

Se activa:
  - Por schedule (diario a las 7 AM)
  - Por chat (cuando el usuario pide resúmenes o análisis)

Genera:
  - Resumen ejecutivo del día/semana
  - Análisis de tendencias
  - KPIs y métricas clave
  - Alertas estratégicas
  - Forecast simplificado

Opera en modo SUGGEST-FIRST.
"""

from __future__ import annotations

import json
import logging
from typing import Any

from agents.base import AgentResult, BaseAgent
from events.consumer import BusinessEvent
from observability.langfuse_client import trace_agent
from providers.openrouter import chat_completion

logger = logging.getLogger(__name__)


class ExecutiveIntelligenceAgent(BaseAgent):
    name = "executive_intelligence"
    description = "Genera resúmenes ejecutivos, análisis estratégico y forecasting"

    triggers = []  # Principalmente schedule + chat

    schedule = "0 7 * * *"  # Diario a las 7 AM

    system_prompt = """Sos el agente de inteligencia ejecutiva de Anabella Luna, una inmobiliaria argentina.

Tu rol es generar resúmenes ejecutivos concisos y accionables para la dirección.

DATOS QUE RECIBÍS:
- Métricas del dashboard (clientes, propiedades, operaciones, citas, tareas)
- Estado actual del pipeline
- Tareas vencidas y pendientes
- Actividad reciente

FORMATO DE RESPUESTA:
Devolvé un JSON con esta estructura exacta:
{
  "executive_summary": "Resumen en 2-3 oraciones del estado general",
  "kpis": {
    "conversion_rate": {"value": "X%", "trend": "up" | "down" | "stable"},
    "active_leads": {"value": N, "trend": "up" | "down" | "stable"},
    "pending_tasks": {"value": N, "trend": "up" | "down" | "stable"},
    "properties_active": {"value": N, "trend": "up" | "down" | "stable"}
  },
  "alerts": [
    {
      "severity": "critical" | "warning" | "info",
      "message": "Descripción de la alerta",
      "suggested_action": "Qué hacer"
    }
  ],
  "opportunities": ["oportunidad 1", "oportunidad 2"],
  "risks": ["riesgo 1", "riesgo 2"],
  "forecast_note": "Nota breve sobre tendencia esperada"
}

REGLAS:
- Sé conciso — los directivos no leen párrafos largos
- Priorizá información accionable sobre estadísticas generales
- Si hay tareas vencidas críticas, ponerlas primero en alerts
- Los trends comparan con el estado anterior (si disponible), si no, marcar "stable"
- No inventes datos — si no hay suficiente info para un KPI, omitirlo
- Respondé SOLO con el JSON, sin texto extra"""

    async def analyze(self, event: BusinessEvent) -> AgentResult:
        """Los eventos no son el trigger principal de este agente."""
        return AgentResult(agent_name=self.name, output="Executive agent is schedule/chat driven")

    async def run_scheduled(self) -> AgentResult:
        """Genera resumen ejecutivo diario."""
        async with trace_agent(self.name, tags=["scheduled", "daily_report"]) as trace:
            trace.log_input("Daily executive summary")

            try:
                dashboard = await self.crm.get_dashboard_stats()
                tareas = await self.crm.list_tareas(status="pendiente")
                clientes = await self.crm.search_clientes(limit=30)
                operaciones = await self.crm.list_operaciones()
            except Exception as e:
                trace.log_error(f"Failed to fetch CRM data: {e}")
                return AgentResult(
                    agent_name=self.name,
                    success=False,
                    error=f"Cannot reach backend: {e}",
                )

            context = self._build_daily_context(dashboard, tareas, clientes, operaciones)

            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": context},
            ]

            response = await chat_completion(messages, temperature=0.2, max_tokens=1500)

            trace.log_llm_call(
                model=response["model"],
                input_messages=messages,
                output_text=response["content"],
                tokens_input=response["tokens_input"],
                tokens_output=response["tokens_output"],
                latency_ms=response["latency_ms"],
            )

            report = self._parse_report(response["content"])
            trace.log_output(f"Executive report generated — {len(report.get('alerts', []))} alerts")

            # Generar notificaciones para alertas críticas
            notifications = []
            for alert in report.get("alerts", []):
                if alert.get("severity") in ("critical", "warning"):
                    notifications.append({
                        "title": f"[Reporte Ejecutivo] {alert['message'][:80]}",
                        "message": f"{alert['message']}\n\nSugerencia: {alert.get('suggested_action', 'Revisar')}",
                        "priority": "alta" if alert["severity"] == "critical" else "media",
                        "actionable": True,
                        "suggested_action": alert.get("suggested_action", ""),
                    })

            # Notificación del resumen ejecutivo
            if report.get("executive_summary"):
                notifications.append({
                    "title": "[IA] Resumen Ejecutivo del Día",
                    "message": report["executive_summary"],
                    "priority": "baja",
                    "actionable": False,
                })

            return AgentResult(
                agent_name=self.name,
                output=response["content"],
                insights=[{
                    "type": "executive_report",
                    "entity_type": "business",
                    **report,
                }],
                notifications=notifications,
                metrics={
                    "alerts_count": len(report.get("alerts", [])),
                    "tokens_used": response["tokens_input"] + response["tokens_output"],
                    "latency_ms": response["latency_ms"],
                },
            )

    async def run_chat(self, message: str, *, user_id: str = "", agent_id: str = "") -> AgentResult:
        """Responde preguntas ejecutivas con datos en tiempo real."""
        async with trace_agent(self.name, user_id=user_id) as trace:
            trace.log_input(message)

            # Obtener datos frescos
            try:
                dashboard = await self.crm.get_dashboard_stats()
            except Exception:
                dashboard = {}

            enriched_prompt = (
                f"{self.system_prompt}\n\n"
                f"## DATOS ACTUALES DEL DASHBOARD\n"
                f"{json.dumps(dashboard, indent=2, default=str)[:2000]}"
            )

            messages = [
                {"role": "system", "content": enriched_prompt},
                {"role": "user", "content": message},
            ]

            response = await chat_completion(messages, temperature=0.3, max_tokens=2000)

            trace.log_llm_call(
                model=response["model"],
                input_messages=messages,
                output_text=response["content"],
                tokens_input=response["tokens_input"],
                tokens_output=response["tokens_output"],
                latency_ms=response["latency_ms"],
            )

            trace.log_output(response["content"])

            return AgentResult(
                agent_name=self.name,
                output=response["content"],
                metrics={
                    "tokens_input": response["tokens_input"],
                    "tokens_output": response["tokens_output"],
                    "latency_ms": response["latency_ms"],
                },
            )

    def _build_daily_context(
        self,
        dashboard: dict,
        tareas: list[dict],
        clientes: list[dict],
        operaciones: list[dict],
    ) -> str:
        """Construye el contexto para el reporte ejecutivo diario."""
        from datetime import datetime, timezone

        now = datetime.now(timezone.utc)
        overdue_count = 0
        for t in tareas:
            due = t.get("dueDate")
            if due:
                try:
                    due_dt = datetime.fromisoformat(str(due).replace("Z", "+00:00"))
                    if due_dt < now:
                        overdue_count += 1
                except (ValueError, TypeError):
                    pass

        parts = [
            "Generá el resumen ejecutivo diario de Anabella Luna.\n",
            "## MÉTRICAS DEL DASHBOARD",
        ]

        for key, label in [
            ("totalClientes", "Total clientes"),
            ("totalPropiedades", "Total propiedades"),
            ("totalOperaciones", "Total operaciones"),
            ("totalCitas", "Total citas"),
            ("totalTareas", "Total tareas"),
            ("citasHoy", "Citas hoy"),
            ("tareasVencidas", "Tareas vencidas"),
            ("leadsSinSeguimiento", "Leads sin seguimiento"),
        ]:
            if key in dashboard:
                parts.append(f"- {label}: {dashboard[key]}")

        parts.append(f"\n## ESTADO OPERACIONAL")
        parts.append(f"- Tareas pendientes: {len(tareas)}")
        parts.append(f"- Tareas vencidas: {overdue_count}")
        parts.append(f"- Clientes activos (últimos 50): {len(clientes)}")
        parts.append(f"- Operaciones: {len(operaciones)}")

        if operaciones:
            estados = {}
            for op in operaciones:
                estado = op.get("estado", "desconocido")
                estados[estado] = estados.get(estado, 0) + 1
            parts.append(f"- Operaciones por estado: {json.dumps(estados)}")

        return "\n".join(parts)

    def _parse_report(self, llm_response: str) -> dict[str, Any]:
        """Parsea el JSON del reporte ejecutivo."""
        try:
            start = llm_response.find("{")
            end = llm_response.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(llm_response[start:end])
        except json.JSONDecodeError:
            pass

        return {
            "executive_summary": llm_response[:500] if llm_response else "No se pudo generar el reporte",
            "kpis": {},
            "alerts": [],
            "opportunities": [],
            "risks": [],
            "forecast_note": "",
        }
