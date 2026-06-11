"""
Dynamic Context Builder — Construye contexto para agentes en runtime.

Nunca usar prompts estáticos gigantes. El contexto debe construirse
dinámicamente según:
  - Usuario / agente
  - Intención detectada
  - Estado actual del negocio
  - Historial semántico relevante
  - Prioridad y urgencia
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from memory.semantic import search as semantic_search
from tools.crm_client import crm_client

logger = logging.getLogger(__name__)


@dataclass
class AgentContext:
    """Contexto construido dinámicamente para un agente."""

    intent: str = ""
    agent_id: str = ""
    user_id: str = ""
    operational_state: dict[str, Any] = field(default_factory=dict)
    relevant_history: list[dict[str, Any]] = field(default_factory=list)
    entity_context: dict[str, Any] = field(default_factory=dict)
    available_tools: list[str] = field(default_factory=list)
    constraints: list[str] = field(default_factory=list)

    def to_system_section(self) -> str:
        """Convierte el contexto en una sección para el system prompt."""
        parts = []

        if self.operational_state:
            parts.append("## ESTADO OPERACIONAL ACTUAL")
            for k, v in self.operational_state.items():
                parts.append(f"- {k}: {v}")

        if self.entity_context:
            parts.append("\n## CONTEXTO DE LA ENTIDAD")
            for k, v in self.entity_context.items():
                parts.append(f"- {k}: {v}")

        if self.relevant_history:
            parts.append("\n## HISTORIAL RELEVANTE")
            for item in self.relevant_history[:5]:
                parts.append(f"- [{item.get('entity_type', '?')}] {item.get('content', '')[:200]}")

        if self.constraints:
            parts.append("\n## RESTRICCIONES")
            for c in self.constraints:
                parts.append(f"- {c}")

        return "\n".join(parts)


class ContextBuilder:
    """Construye contexto dinámico para agentes IA."""

    async def build(
        self,
        *,
        intent: str = "",
        agent_id: str = "",
        user_id: str = "",
        entity_type: str | None = None,
        entity_id: str | None = None,
        query_embedding: list[float] | None = None,
    ) -> AgentContext:
        """
        Construye el contexto completo para un agente.

        1. Detecta intención (si no viene)
        2. Carga estado operacional del CRM
        3. Recupera historial semántico relevante
        4. Carga datos de la entidad específica (si aplica)
        """
        ctx = AgentContext(intent=intent, agent_id=agent_id, user_id=user_id)

        # 1. Estado operacional (paralelo)
        try:
            if agent_id:
                stats = await crm_client.get_agent_dashboard_stats(agent_id)
            else:
                stats = await crm_client.get_dashboard_stats()
            ctx.operational_state = self._extract_key_metrics(stats)
        except Exception as e:
            logger.warning("Could not fetch operational state: %s", e)

        # 2. Historial semántico (si hay embedding de la query)
        if query_embedding:
            try:
                results = await semantic_search(
                    query_embedding,
                    entity_type=entity_type,
                    agent_id=agent_id,
                    top_k=5,
                    min_similarity=0.65,
                )
                ctx.relevant_history = results
            except Exception as e:
                logger.warning("Semantic search failed: %s", e)

        # 3. Contexto de entidad específica
        if entity_type and entity_id:
            try:
                ctx.entity_context = await self._load_entity(entity_type, entity_id)
            except Exception as e:
                logger.warning("Could not load entity %s/%s: %s", entity_type, entity_id, e)

        # 4. Constraints según permisos
        ctx.constraints = self._default_constraints()

        return ctx

    async def build_for_chat(
        self,
        message: str,
        *,
        agent_id: str = "",
        user_id: str = "",
    ) -> AgentContext:
        """Shortcut para contexto de chat."""
        intent = self._detect_intent(message)
        return await self.build(intent=intent, agent_id=agent_id, user_id=user_id)

    def _detect_intent(self, message: str) -> str:
        """Detección rápida de intención basada en keywords."""
        msg = message.lower()
        if any(w in msg for w in ("propiedad", "inmueble", "departamento", "casa", "terreno", "precio")):
            return "property_analysis"
        if any(w in msg for w in ("lead", "cliente", "contacto", "seguimiento")):
            return "lead_management"
        if any(w in msg for w in ("tarea", "pendiente", "vencida", "asignar")):
            return "task_management"
        if any(w in msg for w in ("reporte", "resumen", "ejecutivo", "dashboard", "métrica")):
            return "executive_report"
        if any(w in msg for w in ("mercado", "zona", "tendencia", "competencia")):
            return "market_analysis"
        if any(w in msg for w in ("cita", "visita", "agenda", "calendario")):
            return "scheduling"
        if any(w in msg for w in ("operación", "venta", "alquiler", "reserva")):
            return "deal_management"
        return "general"

    def _extract_key_metrics(self, stats: dict) -> dict[str, Any]:
        """Extrae métricas clave del dashboard para el contexto."""
        result = {}
        for key in (
            "totalClientes", "totalPropiedades", "totalOperaciones",
            "totalCitas", "totalTareas", "citasHoy", "tareasVencidas",
            "leadsSinSeguimiento", "conversionRate",
        ):
            if key in stats:
                result[key] = stats[key]
        return result

    async def _load_entity(self, entity_type: str, entity_id: str) -> dict[str, Any]:
        """Carga datos de una entidad específica del CRM."""
        if entity_type == "client":
            return await crm_client.get_cliente(entity_id)
        elif entity_type == "property":
            return await crm_client.get_propiedad(entity_id)
        return {}

    def _default_constraints(self) -> list[str]:
        return [
            "No ejecutar acciones destructivas sin aprobación humana",
            "No modificar datos financieros ni permisos de usuarios",
            "Responder siempre en español rioplatense",
            "Ser conciso — los agentes inmobiliarios están ocupados",
        ]


# Singleton
context_builder = ContextBuilder()
