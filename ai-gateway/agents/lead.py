"""
Lead Intelligence Agent — Scoring y análisis de leads.

Se activa cuando:
  - Se crea un nuevo lead (client.created)
  - Se actualiza un lead (client.updated, client.stage_changed)

Calcula:
  - Probabilidad de cierre (0-100)
  - Nivel de urgencia
  - Riesgo de abandono
  - Recomendaciones de seguimiento

Opera en modo SUGGEST-FIRST: no modifica datos, solo genera insights.
"""

from __future__ import annotations

import logging
from typing import Any

from agents.base import AgentResult, BaseAgent
from events.consumer import BusinessEvent
from observability.langfuse_client import trace_agent
from providers.openrouter import chat_completion

logger = logging.getLogger(__name__)


class LeadIntelligenceAgent(BaseAgent):
    name = "lead_intelligence"
    description = "Analiza y puntúa leads, detecta riesgo de abandono"

    triggers = [
        "client.created",
        "client.updated",
        "client.stage_changed",
    ]

    system_prompt = """Sos el agente de inteligencia de leads de Anabella Luna, una inmobiliaria argentina.

Tu rol es analizar cada lead y generar un scoring basado en la información disponible.

DATOS QUE RECIBÍS:
- Perfil del cliente (nombre, email, teléfono, notas, fecha de creación)
- Etapa actual en el pipeline
- Historial de actividad (si disponible)
- Contexto del evento que activó el análisis

SCORING:
Generá un JSON con esta estructura exacta:
{
  "score": 0-100,
  "urgency": "alta" | "media" | "baja",
  "abandonment_risk": "alto" | "medio" | "bajo",
  "analysis": "Explicación breve de por qué este score",
  "recommended_actions": ["acción 1", "acción 2"],
  "tags": ["tag1", "tag2"]
}

CRITERIOS DE SCORING:
- Tiene email Y teléfono: +20pts
- Tiene notas detalladas: +15pts
- Creado hace menos de 24h: +10pts (lead fresco)
- Etapa avanzada (Calificado, Propuesta): +25pts
- Sin seguimiento > 3 días: -15pts
- Sin email ni teléfono: -20pts (no contactable)

REGLAS:
- Sé objetivo — no inflar scores
- Priorizá leads contactables y frescos
- Si faltan datos, indicalo en el análisis
- Respondé SOLO con el JSON, sin texto extra"""

    async def analyze(self, event: BusinessEvent) -> AgentResult:
        """Analiza un lead basado en el evento recibido."""
        client_id = event.payload.get("client_id", "")
        if not client_id:
            return AgentResult(agent_name=self.name, output="No client_id in event")

        async with trace_agent(self.name, user_id=event.user_id) as trace:
            trace.log_input(f"Analyze lead: {client_id} (event: {event.event_type})")

            # 1. Obtener datos completos del cliente
            try:
                cliente = await self.crm.get_cliente(client_id)
            except Exception as e:
                trace.log_error(f"Failed to fetch client {client_id}: {e}")
                return AgentResult(
                    agent_name=self.name,
                    success=False,
                    error=f"Cannot fetch client: {e}",
                )

            # 2. Construir contexto
            context = self._build_context(cliente, event)

            # 3. LLM scoring
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": context},
            ]

            response = await chat_completion(messages, temperature=0.1, max_tokens=800)

            trace.log_llm_call(
                model=response["model"],
                input_messages=messages,
                output_text=response["content"],
                tokens_input=response["tokens_input"],
                tokens_output=response["tokens_output"],
                latency_ms=response["latency_ms"],
            )

            # 4. Parsear scoring
            scoring = self._parse_scoring(response["content"])
            trace.log_output(f"Score: {scoring.get('score', '?')} | Risk: {scoring.get('abandonment_risk', '?')}")

            # 5. Generar notificaciones para leads de alto valor o riesgo
            notifications = self._build_notifications(cliente, scoring, event)

            return AgentResult(
                agent_name=self.name,
                output=response["content"],
                insights=[{
                    "type": "lead_scoring",
                    "entity_id": client_id,
                    "entity_type": "client",
                    **scoring,
                }],
                notifications=notifications,
                metrics={
                    "score": scoring.get("score", 0),
                    "tokens_used": response["tokens_input"] + response["tokens_output"],
                    "latency_ms": response["latency_ms"],
                },
            )

    def _build_context(self, cliente: dict, event: BusinessEvent) -> str:
        """Construye el contexto para el LLM."""
        meta = cliente.get("metadata", {})
        parts = [
            f"## LEAD: {cliente.get('nombre', 'Sin nombre')}",
            f"- Email: {cliente.get('email', 'no proporcionado')}",
            f"- Teléfono: {cliente.get('telefono', 'no proporcionado')}",
            f"- Dirección: {cliente.get('direccion', 'no proporcionada')}",
            f"- Notas: {cliente.get('notas', 'sin notas')}",
            f"- Creado: {cliente.get('createdAt', '?')}",
            f"- Actualizado: {cliente.get('updatedAt', '?')}",
            f"- Etapa pipeline: {meta.get('estado', 'Lead')}",
            f"- Fuente: {meta.get('fuenteOrigen', 'desconocida')}",
            f"- Fidelizado: {cliente.get('fidelizado', False)}",
            f"- Agente asignado: {cliente.get('agenteId', 'sin asignar')}",
            f"\n## EVENTO",
            f"- Tipo: {event.event_type}",
            f"- Timestamp: {event.timestamp}",
        ]

        if event.event_type == "client.stage_changed":
            parts.append(f"- Etapa anterior → nueva: {event.payload.get('stage', '?')}")

        return "\n".join(parts)

    def _parse_scoring(self, llm_response: str) -> dict[str, Any]:
        """Parsea el JSON de scoring del LLM."""
        import json

        try:
            start = llm_response.find("{")
            end = llm_response.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(llm_response[start:end])
        except json.JSONDecodeError:
            pass

        return {
            "score": 50,
            "urgency": "media",
            "abandonment_risk": "medio",
            "analysis": llm_response[:500] if llm_response else "No se pudo generar scoring",
            "recommended_actions": [],
            "tags": [],
        }

    def _build_notifications(
        self, cliente: dict, scoring: dict, event: BusinessEvent
    ) -> list[dict[str, Any]]:
        """Genera notificaciones según el scoring."""
        notifications = []
        score = scoring.get("score", 50)
        risk = scoring.get("abandonment_risk", "medio")
        client_name = cliente.get("nombre", "Lead")
        agent_id = cliente.get("agenteId", event.agent_id)

        # Lead de alto valor (score >= 80)
        if score >= 80 and event.event_type == "client.created":
            notifications.append({
                "title": f"Lead caliente: {client_name} (score {score})",
                "message": f"{scoring.get('analysis', '')}\n\nAcciones: {', '.join(scoring.get('recommended_actions', []))}",
                "priority": "alta",
                "agent_id": agent_id,
                "actionable": True,
                "suggested_action": "Contactar dentro de las próximas 2 horas",
            })

        # Lead en riesgo de abandono
        if risk == "alto":
            notifications.append({
                "title": f"Riesgo de abandono: {client_name}",
                "message": f"Score: {score}/100. {scoring.get('analysis', '')}",
                "priority": "alta",
                "agent_id": agent_id,
                "actionable": True,
                "suggested_action": "Hacer seguimiento urgente",
            })

        return notifications
