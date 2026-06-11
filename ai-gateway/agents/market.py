"""
Market Intelligence Agent — Análisis de mercado inmobiliario.

Se activa:
  - Por schedule (semanal, lunes 6 AM)
  - Por chat (consultas sobre mercado, zonas, tendencias)

Analiza:
  - Tendencias de precios por zona
  - Comportamiento de la demanda
  - Zonas calientes vs frías
  - Comparativas de mercado
  - Estacionalidad

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


class MarketIntelligenceAgent(BaseAgent):
    name = "market_intelligence"
    description = "Analiza tendencias de mercado, zonas y comportamiento de demanda"

    triggers = []  # Schedule + chat driven

    schedule = "0 6 * * 1"  # Lunes a las 6 AM

    system_prompt = """Sos el agente de inteligencia de mercado de Anabella Luna, una inmobiliaria argentina.

Tu rol es analizar datos del portafolio de propiedades y clientes para detectar tendencias de mercado.

DATOS QUE RECIBÍS:
- Propiedades activas con precios, ubicaciones, tipos
- Clientes y sus preferencias (si disponibles)
- Operaciones cerradas/en curso

ANÁLISIS QUE GENERÁS:
Devolvé un JSON con esta estructura exacta:
{
  "market_overview": "Resumen en 2-3 oraciones del estado del mercado basado en los datos del portafolio",
  "zone_analysis": [
    {
      "zone": "nombre de la zona/barrio",
      "property_count": N,
      "avg_price_usd": N,
      "demand_level": "alta" | "media" | "baja",
      "trend": "al_alza" | "estable" | "a_la_baja",
      "observation": "Nota breve"
    }
  ],
  "property_type_analysis": [
    {
      "type": "departamento" | "casa" | "terreno" | "oficina" | "local" | "otro",
      "count": N,
      "avg_price": N,
      "demand_vs_supply": "exceso_demanda" | "equilibrio" | "exceso_oferta"
    }
  ],
  "opportunities": [
    {
      "description": "Descripción de la oportunidad",
      "zone": "zona relevante",
      "estimated_impact": "alto" | "medio" | "bajo"
    }
  ],
  "risks": [
    {
      "description": "Descripción del riesgo",
      "mitigation": "Qué hacer"
    }
  ],
  "recommendations": ["recomendación 1", "recomendación 2"]
}

REGLAS:
- Basá tu análisis SOLO en los datos del portafolio de Anabella Luna — no inventes datos de mercado externo
- Si una zona tiene pocas propiedades (<3), no saques conclusiones sobre tendencias
- Priorizá zonas con más propiedades activas
- Los precios son en la moneda especificada (generalmente USD o ARS)
- Sé realista — es un portafolio de una inmobiliaria, no el mercado completo
- Respondé SOLO con el JSON, sin texto extra"""

    async def analyze(self, event: BusinessEvent) -> AgentResult:
        """Market agent no reacciona a eventos individuales."""
        return AgentResult(agent_name=self.name, output="Market agent is schedule/chat driven")

    async def run_scheduled(self) -> AgentResult:
        """Análisis semanal del portafolio como proxy de mercado."""
        async with trace_agent(self.name, tags=["scheduled", "weekly_market"]) as trace:
            trace.log_input("Weekly market analysis")

            try:
                propiedades = await self.crm.search_propiedades(limit=100)
                operaciones = await self.crm.list_operaciones()
                dashboard = await self.crm.get_dashboard_stats()
            except Exception as e:
                trace.log_error(f"Failed to fetch CRM data: {e}")
                return AgentResult(
                    agent_name=self.name,
                    success=False,
                    error=f"Cannot reach backend: {e}",
                )

            context = self._build_market_context(propiedades, operaciones, dashboard)

            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": context},
            ]

            response = await chat_completion(messages, temperature=0.2, max_tokens=2000)

            trace.log_llm_call(
                model=response["model"],
                input_messages=messages,
                output_text=response["content"],
                tokens_input=response["tokens_input"],
                tokens_output=response["tokens_output"],
                latency_ms=response["latency_ms"],
            )

            analysis = self._parse_market_analysis(response["content"])
            trace.log_output(f"Market analysis: {len(analysis.get('zone_analysis', []))} zones, "
                           f"{len(analysis.get('opportunities', []))} opportunities")

            # Notificaciones para oportunidades de alto impacto
            notifications = []
            for opp in analysis.get("opportunities", []):
                if opp.get("estimated_impact") == "alto":
                    notifications.append({
                        "title": f"[Mercado] Oportunidad detectada — {opp.get('zone', 'General')}",
                        "message": opp.get("description", ""),
                        "priority": "media",
                        "actionable": True,
                        "suggested_action": opp.get("description", "Evaluar oportunidad"),
                    })

            if analysis.get("market_overview"):
                notifications.append({
                    "title": "[IA] Reporte Semanal de Mercado",
                    "message": analysis["market_overview"],
                    "priority": "baja",
                    "actionable": False,
                })

            return AgentResult(
                agent_name=self.name,
                output=response["content"],
                insights=[{
                    "type": "market_analysis",
                    "entity_type": "market",
                    **analysis,
                }],
                notifications=notifications,
                metrics={
                    "zones_analyzed": len(analysis.get("zone_analysis", [])),
                    "opportunities": len(analysis.get("opportunities", [])),
                    "tokens_used": response["tokens_input"] + response["tokens_output"],
                    "latency_ms": response["latency_ms"],
                },
            )

    async def run_chat(self, message: str, *, user_id: str = "", agent_id: str = "") -> AgentResult:
        """Responde consultas sobre mercado con datos del portafolio."""
        async with trace_agent(self.name, user_id=user_id) as trace:
            trace.log_input(message)

            try:
                propiedades = await self.crm.search_propiedades(limit=50)
            except Exception:
                propiedades = []

            summary = self._summarize_portfolio(propiedades)
            enriched_prompt = (
                f"{self.system_prompt}\n\n"
                f"## DATOS ACTUALES DEL PORTAFOLIO\n{summary}"
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

    def _build_market_context(
        self,
        propiedades: list[dict],
        operaciones: list[dict],
        dashboard: dict,
    ) -> str:
        """Construye contexto del mercado para análisis semanal."""
        parts = [
            "Analizá el estado del portafolio de Anabella Luna como proxy del mercado local.\n",
            f"## PORTAFOLIO: {len(propiedades)} propiedades activas",
        ]

        # Agrupar por zona
        by_zone: dict[str, list[dict]] = {}
        for p in propiedades:
            zone = p.get("barrio") or p.get("zona") or p.get("localidad", "Sin zona")
            by_zone.setdefault(zone, []).append(p)

        parts.append("\n## PROPIEDADES POR ZONA")
        for zone, props in sorted(by_zone.items(), key=lambda x: -len(x[1])):
            prices = [p.get("precio", 0) for p in props if p.get("precio")]
            avg_price = sum(prices) / len(prices) if prices else 0
            types = set(p.get("tipoPropiedad", "?") for p in props)
            parts.append(
                f"- {zone}: {len(props)} propiedades, "
                f"precio promedio: {avg_price:,.0f}, "
                f"tipos: {', '.join(types)}"
            )

        # Agrupar por tipo
        by_type: dict[str, int] = {}
        for p in propiedades:
            tipo = p.get("tipoPropiedad", "otro")
            by_type[tipo] = by_type.get(tipo, 0) + 1

        parts.append("\n## POR TIPO DE PROPIEDAD")
        for tipo, count in sorted(by_type.items(), key=lambda x: -x[1]):
            parts.append(f"- {tipo}: {count}")

        # Operaciones
        if operaciones:
            parts.append(f"\n## OPERACIONES: {len(operaciones)}")
            estados = {}
            for op in operaciones:
                estado = op.get("estado", "?")
                estados[estado] = estados.get(estado, 0) + 1
            for estado, count in estados.items():
                parts.append(f"- {estado}: {count}")

        # Dashboard general
        if dashboard:
            parts.append("\n## MÉTRICAS GENERALES")
            for key in ("totalClientes", "totalPropiedades", "leadsSinSeguimiento"):
                if key in dashboard:
                    parts.append(f"- {key}: {dashboard[key]}")

        return "\n".join(parts)

    def _summarize_portfolio(self, propiedades: list[dict]) -> str:
        """Resumen rápido del portafolio para chat."""
        by_type: dict[str, int] = {}
        by_zone: dict[str, int] = {}
        prices = []
        for p in propiedades:
            tipo = p.get("tipoPropiedad", "otro")
            by_type[tipo] = by_type.get(tipo, 0) + 1
            zone = p.get("barrio") or p.get("zona", "?")
            by_zone[zone] = by_zone.get(zone, 0) + 1
            if p.get("precio"):
                prices.append(p["precio"])

        avg_price = sum(prices) / len(prices) if prices else 0
        lines = [
            f"Total propiedades: {len(propiedades)}",
            f"Precio promedio: {avg_price:,.0f}",
            f"Por tipo: {json.dumps(by_type)}",
            f"Top zonas: {json.dumps(dict(sorted(by_zone.items(), key=lambda x: -x[1])[:10]))}",
        ]
        return "\n".join(lines)

    def _parse_market_analysis(self, llm_response: str) -> dict[str, Any]:
        """Parsea el JSON de análisis de mercado."""
        try:
            start = llm_response.find("{")
            end = llm_response.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(llm_response[start:end])
        except json.JSONDecodeError:
            pass

        return {
            "market_overview": llm_response[:500] if llm_response else "No se pudo generar el análisis",
            "zone_analysis": [],
            "property_type_analysis": [],
            "opportunities": [],
            "risks": [],
            "recommendations": [],
        }
