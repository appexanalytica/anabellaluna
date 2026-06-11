"""
Property Intelligence Agent — Análisis de propiedades inmobiliarias.

Se activa cuando:
  - Se publica una propiedad (property.published)
  - Se actualiza una propiedad (property.updated)
  - Se crea una propiedad (property.created)

Analiza:
  - Pricing competitivo (¿el precio es coherente con la zona?)
  - Engagement (visitas, consultas)
  - Optimización del listing (fotos, descripción, datos faltantes)
  - Tiempo en el mercado vs promedio de la zona

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


class PropertyIntelligenceAgent(BaseAgent):
    name = "property_intelligence"
    description = "Analiza propiedades, pricing y optimización de listings"

    triggers = [
        "property.created",
        "property.updated",
        "property.published",
    ]

    schedule = "0 8 * * *"  # Diario a las 8 AM

    system_prompt = """Sos el agente de inteligencia de propiedades de Anabella Luna, una inmobiliaria argentina.

Tu rol es analizar cada propiedad y generar insights accionables para mejorar su rendimiento.

DATOS QUE RECIBÍS:
- Detalles de la propiedad (tipo, precio, ubicación, características)
- Métricas de engagement (visitas, consultas, si las hay)
- Tiempo en el mercado
- Estado de publicación

ANÁLISIS QUE GENERÁS:
Devolvé un JSON con esta estructura exacta:
{
  "pricing_analysis": {
    "assessment": "competitivo" | "por_encima" | "por_debajo" | "sin_datos",
    "confidence": 0-100,
    "reasoning": "Explicación breve"
  },
  "listing_quality": {
    "score": 0-100,
    "missing_fields": ["campo1", "campo2"],
    "suggestions": ["mejora 1", "mejora 2"]
  },
  "engagement_status": "activo" | "bajo" | "sin_actividad" | "nuevo",
  "recommended_actions": ["acción 1", "acción 2"],
  "priority": "alta" | "media" | "baja",
  "summary": "Resumen ejecutivo en 1-2 oraciones"
}

REGLAS:
- Sé objetivo con el pricing — si no tenés datos de zona, decilo
- Priorizá listings con problemas de calidad (sin fotos, sin descripción)
- Los listings nuevos (<7 días) tienen prioridad media por defecto
- Propiedades sin actividad >30 días son prioridad alta
- Respondé SOLO con el JSON, sin texto extra"""

    async def analyze(self, event: BusinessEvent) -> AgentResult:
        """Analiza una propiedad basada en el evento recibido."""
        property_id = event.payload.get("property_id", "")
        if not property_id:
            return AgentResult(agent_name=self.name, output="No property_id in event")

        async with trace_agent(self.name, user_id=event.user_id) as trace:
            trace.log_input(f"Analyze property: {property_id} (event: {event.event_type})")

            # 1. Obtener datos completos de la propiedad
            try:
                propiedad = await self.crm.get_propiedad(property_id)
            except Exception as e:
                trace.log_error(f"Failed to fetch property {property_id}: {e}")
                return AgentResult(
                    agent_name=self.name,
                    success=False,
                    error=f"Cannot fetch property: {e}",
                )

            # 2. Construir contexto
            context = self._build_context(propiedad, event)

            # 3. LLM analysis
            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": context},
            ]

            response = await chat_completion(messages, temperature=0.2, max_tokens=1000)

            trace.log_llm_call(
                model=response["model"],
                input_messages=messages,
                output_text=response["content"],
                tokens_input=response["tokens_input"],
                tokens_output=response["tokens_output"],
                latency_ms=response["latency_ms"],
            )

            # 4. Parsear resultado
            analysis = self._parse_analysis(response["content"])
            trace.log_output(f"Quality: {analysis.get('listing_quality', {}).get('score', '?')} | Priority: {analysis.get('priority', '?')}")

            # 5. Generar notificaciones
            notifications = self._build_notifications(propiedad, analysis, event)

            return AgentResult(
                agent_name=self.name,
                output=response["content"],
                insights=[{
                    "type": "property_analysis",
                    "entity_id": property_id,
                    "entity_type": "property",
                    **analysis,
                }],
                notifications=notifications,
                metrics={
                    "listing_quality_score": analysis.get("listing_quality", {}).get("score", 0),
                    "tokens_used": response["tokens_input"] + response["tokens_output"],
                    "latency_ms": response["latency_ms"],
                },
            )

    async def run_scheduled(self) -> AgentResult:
        """Revisión diaria de propiedades publicadas sin actividad."""
        async with trace_agent(self.name, tags=["scheduled"]) as trace:
            trace.log_input("Scheduled property review")

            try:
                propiedades = await self.crm.search_propiedades(limit=50)
            except Exception as e:
                trace.log_error(f"Failed to fetch properties: {e}")
                return AgentResult(agent_name=self.name, success=False, error=str(e))

            inactive = self._find_inactive_properties(propiedades)

            if not inactive:
                trace.log_output("No inactive properties found")
                return AgentResult(
                    agent_name=self.name,
                    output="Sin propiedades inactivas detectadas",
                    metrics={"inactive_count": 0},
                )

            # Generar notificaciones para propiedades inactivas
            notifications = []
            for prop in inactive[:10]:
                notifications.append({
                    "title": f"Propiedad sin actividad: {prop.get('titulo', prop.get('direccion', 'Sin título'))}",
                    "message": f"Esta propiedad lleva {prop.get('_days_inactive', '?')} días sin actividad. "
                               f"Revisá el precio y la calidad del listing.",
                    "priority": "alta" if prop.get("_days_inactive", 0) > 60 else "media",
                    "agent_id": prop.get("agentId", ""),
                    "actionable": True,
                    "suggested_action": "Revisar precio y mejorar fotos/descripción",
                })

            trace.log_output(f"{len(inactive)} inactive properties found")

            return AgentResult(
                agent_name=self.name,
                output=f"{len(inactive)} propiedades inactivas detectadas",
                notifications=notifications,
                metrics={"inactive_count": len(inactive)},
            )

    def _build_context(self, propiedad: dict, event: BusinessEvent) -> str:
        """Construye el contexto para el LLM."""
        parts = [
            f"## PROPIEDAD: {propiedad.get('titulo', propiedad.get('direccion', 'Sin título'))}",
            f"- Tipo: {propiedad.get('tipoPropiedad', 'no especificado')}",
            f"- Operación: {propiedad.get('tipoOperacion', 'no especificado')}",
            f"- Precio: {propiedad.get('precio', 'no especificado')} {propiedad.get('moneda', 'USD')}",
            f"- Ubicación: {propiedad.get('direccion', 'no especificada')}",
            f"- Barrio/Zona: {propiedad.get('barrio', propiedad.get('zona', 'no especificado'))}",
            f"- Superficie total: {propiedad.get('superficieTotal', '?')} m²",
            f"- Superficie cubierta: {propiedad.get('superficieCubierta', '?')} m²",
            f"- Ambientes: {propiedad.get('ambientes', '?')}",
            f"- Dormitorios: {propiedad.get('dormitorios', '?')}",
            f"- Baños: {propiedad.get('banos', '?')}",
            f"- Cochera: {propiedad.get('cochera', False)}",
            f"- Fotos: {len(propiedad.get('fotos', []))} imágenes",
            f"- Descripción: {'Sí' if propiedad.get('descripcion') else 'No tiene'}",
            f"- Publicada: {propiedad.get('publicada', False)}",
            f"- Creada: {propiedad.get('createdAt', '?')}",
            f"- Actualizada: {propiedad.get('updatedAt', '?')}",
            f"- Agente: {propiedad.get('agentId', 'sin asignar')}",
            f"\n## EVENTO",
            f"- Tipo: {event.event_type}",
            f"- Timestamp: {event.timestamp}",
        ]

        return "\n".join(parts)

    def _parse_analysis(self, llm_response: str) -> dict[str, Any]:
        """Parsea el JSON de análisis del LLM."""
        try:
            start = llm_response.find("{")
            end = llm_response.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(llm_response[start:end])
        except json.JSONDecodeError:
            pass

        return {
            "pricing_analysis": {"assessment": "sin_datos", "confidence": 0, "reasoning": "No se pudo analizar"},
            "listing_quality": {"score": 50, "missing_fields": [], "suggestions": []},
            "engagement_status": "sin_actividad",
            "recommended_actions": [],
            "priority": "media",
            "summary": llm_response[:500] if llm_response else "No se pudo generar análisis",
        }

    def _build_notifications(
        self, propiedad: dict, analysis: dict, event: BusinessEvent
    ) -> list[dict[str, Any]]:
        """Genera notificaciones según el análisis."""
        notifications = []
        quality = analysis.get("listing_quality", {})
        quality_score = quality.get("score", 50)
        priority = analysis.get("priority", "media")
        prop_title = propiedad.get("titulo", propiedad.get("direccion", "Propiedad"))
        agent_id = propiedad.get("agentId", event.agent_id)

        # Listing de baja calidad
        if quality_score < 40:
            missing = ", ".join(quality.get("missing_fields", [])[:5])
            notifications.append({
                "title": f"Listing incompleto: {prop_title}",
                "message": f"Score de calidad: {quality_score}/100. "
                           f"Campos faltantes: {missing}. "
                           f"{analysis.get('summary', '')}",
                "priority": "alta",
                "agent_id": agent_id,
                "actionable": True,
                "suggested_action": "Completar información y agregar fotos",
            })

        # Pricing por encima del mercado
        pricing = analysis.get("pricing_analysis", {})
        if pricing.get("assessment") == "por_encima" and pricing.get("confidence", 0) > 60:
            notifications.append({
                "title": f"Precio elevado: {prop_title}",
                "message": f"{pricing.get('reasoning', 'El precio parece estar por encima del promedio de zona.')}",
                "priority": "media",
                "agent_id": agent_id,
                "actionable": True,
                "suggested_action": "Evaluar ajuste de precio",
                "metadata": {"pricing_confidence": pricing.get("confidence", 0)},
            })

        return notifications

    def _find_inactive_properties(self, propiedades: list[dict], days: int = 30) -> list[dict]:
        """Encuentra propiedades publicadas sin actividad reciente."""
        from datetime import datetime, timezone

        now = datetime.now(timezone.utc)
        inactive = []
        for p in propiedades:
            if not p.get("publicada", False):
                continue
            updated = p.get("updatedAt") or p.get("createdAt")
            if not updated:
                continue
            try:
                updated_dt = datetime.fromisoformat(str(updated).replace("Z", "+00:00"))
                diff_days = (now - updated_dt).days
                if diff_days >= days:
                    inactive.append({**p, "_days_inactive": diff_days})
            except (ValueError, TypeError):
                continue
        inactive.sort(key=lambda x: x.get("_days_inactive", 0), reverse=True)
        return inactive[:20]
