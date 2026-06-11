"""
Semantic Search — Búsqueda semántica sobre memoria vectorial.

Wrapper sobre memory.semantic.search() que agrega:
  - Generación automática de embedding de la query
  - Filtrado por relevancia
  - Enriquecimiento de resultados
  - Logging de queries para analytics
"""

from __future__ import annotations

import logging
from typing import Any

from embeddings.service import embedding_service
from memory.semantic import search as vector_search

logger = logging.getLogger(__name__)


async def semantic_search(
    query: str,
    *,
    entity_type: str | None = None,
    agent_id: str | None = None,
    top_k: int = 5,
    min_similarity: float = 0.7,
) -> list[dict[str, Any]]:
    """
    Búsqueda semántica completa: query → embedding → pgvector search.

    Args:
        query: Texto en lenguaje natural
        entity_type: Filtrar por tipo de entidad (client, property, conversation, etc.)
        agent_id: Filtrar por agente propietario
        top_k: Máximo de resultados
        min_similarity: Umbral mínimo de similitud coseno

    Returns:
        Lista de resultados ordenados por relevancia descendente.
    """
    # 1. Generar embedding de la query
    query_embedding = await embedding_service.embed_text(query)

    # 2. Buscar en pgvector
    results = await vector_search(
        query_embedding,
        entity_type=entity_type,
        agent_id=agent_id,
        top_k=top_k,
        min_similarity=min_similarity,
    )

    logger.info(
        "Semantic search: query='%s' entity_type=%s results=%d",
        query[:50], entity_type, len(results),
    )

    return results


async def find_similar_clients(
    description: str,
    *,
    agent_id: str | None = None,
    top_k: int = 5,
) -> list[dict[str, Any]]:
    """Encuentra clientes similares a una descripción textual."""
    return await semantic_search(
        description,
        entity_type="client",
        agent_id=agent_id,
        top_k=top_k,
        min_similarity=0.65,
    )


async def find_similar_properties(
    description: str,
    *,
    agent_id: str | None = None,
    top_k: int = 5,
) -> list[dict[str, Any]]:
    """Encuentra propiedades similares a una descripción textual."""
    return await semantic_search(
        description,
        entity_type="property",
        agent_id=agent_id,
        top_k=top_k,
        min_similarity=0.65,
    )


async def find_relevant_conversations(
    query: str,
    *,
    agent_id: str | None = None,
    top_k: int = 3,
) -> list[dict[str, Any]]:
    """Encuentra conversaciones previas relevantes a una query."""
    return await semantic_search(
        query,
        entity_type="conversation",
        agent_id=agent_id,
        top_k=top_k,
        min_similarity=0.6,
    )
