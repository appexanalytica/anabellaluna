"""
Retrieval Context Builder — Construye contexto enriquecido para agentes.

Combina múltiples fuentes de información:
  - Búsqueda semántica (conversaciones previas, notas)
  - Working memory (estado operacional)
  - Short-term memory (sesión actual)
  - Datos del CRM (entidades relevantes)

Produce un bloque de texto optimizado para el system prompt del agente.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from memory.short_term import get_conversation_context, get_recent_actions
from memory.working import get_dashboard_snapshot, get_agent_activity
from retrieval.semantic_search import semantic_search

logger = logging.getLogger(__name__)


@dataclass
class RetrievalContext:
    """Contexto construido por el retrieval pipeline."""

    semantic_results: list[dict[str, Any]] = field(default_factory=list)
    conversation_history: list[dict] = field(default_factory=list)
    recent_actions: list[dict] = field(default_factory=list)
    dashboard_state: dict[str, Any] | None = None
    agent_activity: dict[str, Any] | None = None
    extra: dict[str, Any] = field(default_factory=dict)

    def to_context_string(self, max_length: int = 3000) -> str:
        """Serializa el contexto a un string para insertar en prompts."""
        parts = []

        if self.dashboard_state:
            parts.append("## ESTADO DEL NEGOCIO")
            for k, v in list(self.dashboard_state.items())[:10]:
                parts.append(f"- {k}: {v}")

        if self.agent_activity:
            parts.append("\n## ACTIVIDAD DEL AGENTE")
            for k, v in list(self.agent_activity.items())[:5]:
                parts.append(f"- {k}: {v}")

        if self.semantic_results:
            parts.append(f"\n## INFORMACIÓN RELEVANTE ({len(self.semantic_results)} resultados)")
            for r in self.semantic_results[:5]:
                similarity = r.get("similarity", 0)
                content = r.get("content", "")[:200]
                parts.append(f"- [{r.get('entity_type', '?')}] (sim={similarity:.2f}) {content}")

        if self.conversation_history:
            parts.append(f"\n## CONVERSACIÓN RECIENTE ({len(self.conversation_history)} msgs)")
            for msg in self.conversation_history[-5:]:
                role = msg.get("role", "user")
                content = msg.get("content", "")[:150]
                parts.append(f"- {role}: {content}")

        if self.recent_actions:
            parts.append(f"\n## ACCIONES RECIENTES ({len(self.recent_actions)})")
            for action in self.recent_actions[-3:]:
                parts.append(f"- {action.get('type', '?')}: {action.get('description', '')[:100]}")

        result = "\n".join(parts)
        return result[:max_length]

    @property
    def has_context(self) -> bool:
        return bool(
            self.semantic_results
            or self.conversation_history
            or self.dashboard_state
            or self.agent_activity
        )


class RetrievalContextBuilder:
    """Construye contexto enriquecido combinando múltiples fuentes."""

    async def build(
        self,
        query: str,
        *,
        user_id: str = "",
        agent_id: str = "",
        conversation_id: str = "",
        include_semantic: bool = True,
        include_history: bool = True,
        include_state: bool = True,
        semantic_top_k: int = 5,
    ) -> RetrievalContext:
        """
        Pipeline completo de retrieval.

        1. Busca contexto semántico relevante a la query
        2. Recupera historial de conversación (short-term)
        3. Recupera acciones recientes del usuario
        4. Carga estado operacional (working memory)
        5. Carga actividad del agente
        """
        ctx = RetrievalContext()

        # 1. Búsqueda semántica
        if include_semantic and query:
            try:
                ctx.semantic_results = await semantic_search(
                    query,
                    agent_id=agent_id or None,
                    top_k=semantic_top_k,
                    min_similarity=0.6,
                )
            except Exception as e:
                logger.warning("Semantic search failed: %s", e)

        # 2. Historial de conversación
        if include_history and conversation_id:
            try:
                ctx.conversation_history = await get_conversation_context(conversation_id)
            except Exception as e:
                logger.warning("Failed to get conversation history: %s", e)

        # 3. Acciones recientes
        if include_history and user_id:
            try:
                ctx.recent_actions = await get_recent_actions(user_id)
            except Exception as e:
                logger.warning("Failed to get recent actions: %s", e)

        # 4. Estado operacional
        if include_state:
            try:
                ctx.dashboard_state = await get_dashboard_snapshot()
            except Exception as e:
                logger.warning("Failed to get dashboard state: %s", e)

        # 5. Actividad del agente
        if include_state and agent_id:
            try:
                ctx.agent_activity = await get_agent_activity(agent_id)
            except Exception as e:
                logger.warning("Failed to get agent activity: %s", e)

        logger.debug(
            "Retrieval context built: semantic=%d history=%d actions=%d state=%s",
            len(ctx.semantic_results),
            len(ctx.conversation_history),
            len(ctx.recent_actions),
            bool(ctx.dashboard_state),
        )

        return ctx

    async def build_for_chat(
        self,
        message: str,
        *,
        user_id: str = "",
        agent_id: str = "",
        conversation_id: str = "",
    ) -> RetrievalContext:
        """Shortcut para contexto de chat con defaults sensatos."""
        return await self.build(
            message,
            user_id=user_id,
            agent_id=agent_id,
            conversation_id=conversation_id,
            include_semantic=True,
            include_history=True,
            include_state=True,
            semantic_top_k=3,
        )


# Singleton
retrieval_context_builder = RetrievalContextBuilder()
