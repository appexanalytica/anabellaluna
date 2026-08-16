"""
Operational Intelligence Agent — Detección proactiva de problemas operacionales.

Este agente corre de forma autónoma (scheduled + event-driven) y detecta:
  - Leads olvidados (sin seguimiento > N días)
  - Tareas vencidas
  - Propiedades estancadas (sin actividad > 30 días)
  - Agentes inactivos
  - Cuellos de botella en el pipeline

Opera en modo SUGGEST-FIRST: genera notificaciones y sugerencias,
no ejecuta acciones automáticas.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from agents.base import AgentResult, BaseAgent
from events.consumer import BusinessEvent
from observability.langfuse_client import trace_agent
from providers.openai_provider import chat_completion

logger = logging.getLogger(__name__)


class OperationalIntelligenceAgent(BaseAgent):
    name = "operational_intelligence"
    description = "Detecta problemas operacionales y sugiere acciones correctivas"

    triggers = [
        "task.status_changed",  # Detectar tareas vencidas
        "client.created",       # Iniciar tracking de seguimiento
    ]

    schedule = "0 */2 * * *"  # Cada 2 horas

    system_prompt = """Sos el agente de inteligencia operacional de Anabella Luna, una inmobiliaria.

Tu rol es analizar el estado operacional del CRM y detectar problemas que requieren atención.

REGLAS:
- Siempre respondé en español rioplatense
- Sé conciso y directo — los agentes inmobiliarios están ocupados
- Priorizá por impacto: leads calientes sin respuesta > tareas vencidas > propiedades estancadas
- No inventes datos — usá solo la información que recibís
- Cada insight debe tener: qué pasa, por qué importa, qué hacer

FORMATO DE RESPUESTA:
Para cada problema detectado, devolvé un JSON con esta estructura:
{
  "insights": [
    {
      "type": "stale_lead" | "overdue_task" | "inactive_property" | "inactive_agent",
      "severity": "critical" | "warning" | "info",
      "title": "Título corto del problema",
      "description": "Explicación breve",
      "affected_entity": {"type": "client|property|task|agent", "id": "xxx", "name": "xxx"},
      "suggested_action": "Qué debería hacer el agente",
      "agent_id": "ID del agente responsable"
    }
  ]
}

Si no hay problemas, devolvé {"insights": []}."""

    async def analyze(self, event: BusinessEvent) -> AgentResult:
        """Reacciona a eventos específicos."""
        if event.event_type == "task.status_changed":
            return await self._check_overdue_context(event)
        return AgentResult(agent_name=self.name, output="Event acknowledged")

    async def run_scheduled(self) -> AgentResult:
        """
        Análisis periódico completo del estado operacional.
        Corre cada 2 horas automáticamente.
        """
        async with trace_agent(self.name, tags=["scheduled"]) as trace:
            trace.log_input("Scheduled operational analysis")

            try:
                # 1. Recopilar estado actual desde el backend
                tareas = await self.crm.list_tareas(status="pendiente")
                clientes = await self.crm.search_clientes(limit=50)
                dashboard = await self.crm.get_dashboard_stats()
            except Exception as e:
                trace.log_error(f"Failed to fetch CRM data: {e}")
                return AgentResult(
                    agent_name=self.name,
                    success=False,
                    error=f"Cannot reach backend: {e}",
                )

            # 2. Detectar tareas vencidas
            overdue_tasks = self._find_overdue_tasks(tareas)

            # 3. Detectar leads sin seguimiento reciente
            stale_leads = self._find_stale_leads(clientes)

            # Si no hay problemas detectados, no llamar al LLM
            total_issues = len(overdue_tasks) + len(stale_leads)
            if total_issues == 0:
                trace.log_output("No operational issues detected")
                return AgentResult(
                    agent_name=self.name,
                    output="Sin problemas operacionales detectados",
                    metrics={"issues_found": 0},
                )

            # 4. Pedir al LLM que analice y priorice
            context = self._build_analysis_context(
                overdue_tasks=overdue_tasks,
                stale_leads=stale_leads,
                dashboard=dashboard,
            )

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

            # 5. Parsear insights y generar notificaciones
            insights = self._parse_insights(response["content"])
            notifications = [
                {
                    "title": f"[IA] {i['title']}",
                    "message": f"{i['description']}\n\nSugerencia: {i['suggested_action']}",
                    "priority": "alta" if i["severity"] == "critical" else "media",
                    "agent_id": i.get("agent_id", ""),
                    "actionable": True,
                    "suggested_action": i["suggested_action"],
                    "metadata": {"insight_type": i["type"], "severity": i["severity"]},
                }
                for i in insights
            ]

            trace.log_output(f"{len(insights)} insights generated")

            return AgentResult(
                agent_name=self.name,
                output=response["content"],
                insights=insights,
                notifications=notifications,
                metrics={
                    "issues_found": total_issues,
                    "insights_generated": len(insights),
                    "overdue_tasks": len(overdue_tasks),
                    "stale_leads": len(stale_leads),
                    "tokens_used": response["tokens_input"] + response["tokens_output"],
                    "latency_ms": response["latency_ms"],
                },
            )

    # ── Detección de problemas ──────────────────────────────────────────────

    def _find_overdue_tasks(self, tareas: list[dict]) -> list[dict]:
        """Encuentra tareas con fecha vencida que siguen pendientes."""
        now = datetime.now(timezone.utc)
        overdue = []
        for t in tareas:
            due = t.get("dueDate")
            if not due:
                continue
            try:
                due_dt = datetime.fromisoformat(str(due).replace("Z", "+00:00"))
                if due_dt < now and t.get("status") in ("pendiente", "en_progreso"):
                    overdue.append(t)
            except (ValueError, TypeError):
                continue
        return overdue[:20]  # Limitar para no saturar el prompt

    def _find_stale_leads(self, clientes: list[dict], days: int = 7) -> list[dict]:
        """Encuentra clientes sin actualización reciente."""
        now = datetime.now(timezone.utc)
        stale = []
        for c in clientes:
            updated = c.get("updatedAt") or c.get("createdAt")
            if not updated:
                continue
            try:
                updated_dt = datetime.fromisoformat(str(updated).replace("Z", "+00:00"))
                diff_days = (now - updated_dt).days
                if diff_days >= days:
                    stale.append({**c, "_days_stale": diff_days})
            except (ValueError, TypeError):
                continue
        # Ordenar por más abandonados primero
        stale.sort(key=lambda x: x.get("_days_stale", 0), reverse=True)
        return stale[:15]

    # ── Contexto para el LLM ───────────────────────────────────────────────

    def _build_analysis_context(
        self,
        *,
        overdue_tasks: list[dict],
        stale_leads: list[dict],
        dashboard: dict,
    ) -> str:
        parts = ["Analizá el estado operacional actual del CRM y generá insights accionables.\n"]

        if overdue_tasks:
            parts.append(f"## TAREAS VENCIDAS ({len(overdue_tasks)})")
            for t in overdue_tasks[:10]:
                parts.append(
                    f"- [{t.get('priority', 'media')}] {t.get('title', 'Sin título')} "
                    f"(vence: {t.get('dueDate', '?')}, asignado: {t.get('assigneeName', t.get('assigneeId', '?'))})"
                )

        if stale_leads:
            parts.append(f"\n## LEADS SIN SEGUIMIENTO ({len(stale_leads)})")
            for c in stale_leads[:10]:
                parts.append(
                    f"- {c.get('nombre', 'Sin nombre')} — {c.get('_days_stale', 0)} días sin actividad "
                    f"(agente: {c.get('agenteId', 'sin asignar')})"
                )

        if dashboard:
            parts.append("\n## MÉTRICAS GENERALES")
            for key in ("totalClientes", "totalPropiedades", "totalOperaciones", "totalCitas"):
                if key in dashboard:
                    parts.append(f"- {key}: {dashboard[key]}")

        return "\n".join(parts)

    # ── Parsear respuesta del LLM ───────────────────────────────────────────

    def _parse_insights(self, llm_response: str) -> list[dict]:
        """Extrae la lista de insights del JSON del LLM."""
        import json

        # Intentar parsear JSON del response
        try:
            # Buscar bloque JSON en la respuesta
            start = llm_response.find("{")
            end = llm_response.rfind("}") + 1
            if start >= 0 and end > start:
                data = json.loads(llm_response[start:end])
                return data.get("insights", [])
        except json.JSONDecodeError:
            pass

        # Fallback: retornar la respuesta como un insight genérico
        if llm_response.strip():
            return [{
                "type": "general",
                "severity": "info",
                "title": "Análisis operacional",
                "description": llm_response[:500],
                "suggested_action": "Revisar el análisis completo",
            }]

        return []

    async def _check_overdue_context(self, event: BusinessEvent) -> AgentResult:
        """Chequeo rápido en contexto de evento de tarea."""
        if event.payload.get("completed"):
            return AgentResult(agent_name=self.name, output="Task completed — no action needed")

        new_status = event.payload.get("new_status", "")
        if new_status in ("completada", "cancelada"):
            return AgentResult(agent_name=self.name, output="Task resolved")

        return AgentResult(
            agent_name=self.name,
            output=f"Task status changed to '{new_status}' — monitoring",
        )
