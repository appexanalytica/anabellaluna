"""
Hybrid Search — Búsqueda combinada: keyword + semántica.

Combina:
  - Búsqueda exacta por keywords en el CRM (via API del backend)
  - Búsqueda semántica en pgvector (via embeddings)

El resultado final se fusiona y re-rankea por relevancia combinada.
"""

from __future__ import annotations

import logging
from typing import Any

from retrieval.semantic_search import semantic_search
from tools.crm_client import crm_client

logger = logging.getLogger(__name__)


async def hybrid_search_clients(
    query: str,
    *,
    agent_id: str | None = None,
    limit: int = 10,
    semantic_weight: float = 0.6,
) -> list[dict[str, Any]]:
    """
    Búsqueda híbrida de clientes: keyword + semántica.

    1. Busca en CRM por keyword (nombre, email, teléfono)
    2. Busca en pgvector por similitud semántica
    3. Fusiona y de-duplica resultados
    4. Re-rankea por score combinado

    Args:
        query: Texto de búsqueda
        agent_id: Filtrar por agente
        limit: Máximo de resultados
        semantic_weight: Peso de búsqueda semántica (0-1). Default 0.6.
    """
    keyword_weight = 1.0 - semantic_weight

    # Ejecutar ambas búsquedas
    keyword_results = []
    semantic_results = []

    try:
        keyword_results = await crm_client.search_clientes(
            query=query, agente_id=agent_id, limit=limit
        )
    except Exception as e:
        logger.warning("Keyword search failed: %s", e)

    try:
        semantic_results = await semantic_search(
            query,
            entity_type="client",
            agent_id=agent_id,
            top_k=limit,
            min_similarity=0.5,
        )
    except Exception as e:
        logger.warning("Semantic search failed: %s", e)

    # Fusionar resultados
    merged = _merge_results(
        keyword_results,
        semantic_results,
        keyword_weight=keyword_weight,
        semantic_weight=semantic_weight,
        id_field="_id",
        semantic_id_field="entity_id",
    )

    return merged[:limit]


async def hybrid_search_properties(
    query: str,
    *,
    agent_id: str | None = None,
    limit: int = 10,
    semantic_weight: float = 0.6,
) -> list[dict[str, Any]]:
    """
    Búsqueda híbrida de propiedades: keyword + semántica.
    """
    keyword_weight = 1.0 - semantic_weight

    keyword_results = []
    semantic_results = []

    try:
        keyword_results = await crm_client.search_propiedades(
            query=query, agente_id=agent_id, limit=limit
        )
    except Exception as e:
        logger.warning("Keyword search failed: %s", e)

    try:
        semantic_results = await semantic_search(
            query,
            entity_type="property",
            agent_id=agent_id,
            top_k=limit,
            min_similarity=0.5,
        )
    except Exception as e:
        logger.warning("Semantic search failed: %s", e)

    merged = _merge_results(
        keyword_results,
        semantic_results,
        keyword_weight=keyword_weight,
        semantic_weight=semantic_weight,
        id_field="_id",
        semantic_id_field="entity_id",
    )

    return merged[:limit]


def _merge_results(
    keyword_results: list[dict],
    semantic_results: list[dict],
    *,
    keyword_weight: float,
    semantic_weight: float,
    id_field: str = "_id",
    semantic_id_field: str = "entity_id",
) -> list[dict[str, Any]]:
    """
    Fusiona resultados de keyword y semántico, de-duplica y re-rankea.
    """
    scores: dict[str, dict[str, Any]] = {}

    # Asignar scores a keyword results (posición inversa)
    total_kw = len(keyword_results)
    for i, item in enumerate(keyword_results):
        item_id = str(item.get(id_field, ""))
        if not item_id:
            continue
        position_score = (total_kw - i) / total_kw  # 1.0 para el primero, decrece
        scores[item_id] = {
            "data": item,
            "keyword_score": position_score * keyword_weight,
            "semantic_score": 0.0,
            "source": "keyword",
        }

    # Asignar scores a semantic results
    for item in semantic_results:
        item_id = str(item.get(semantic_id_field, ""))
        if not item_id:
            continue
        similarity = item.get("similarity", 0.5)

        if item_id in scores:
            # Ya encontrado por keyword — sumar score semántico
            scores[item_id]["semantic_score"] = similarity * semantic_weight
            scores[item_id]["source"] = "hybrid"
        else:
            scores[item_id] = {
                "data": item,
                "keyword_score": 0.0,
                "semantic_score": similarity * semantic_weight,
                "source": "semantic",
            }

    # Calcular score combinado y ordenar
    ranked = sorted(
        scores.values(),
        key=lambda x: x["keyword_score"] + x["semantic_score"],
        reverse=True,
    )

    return [
        {
            **item["data"],
            "_search_score": round(item["keyword_score"] + item["semantic_score"], 4),
            "_search_source": item["source"],
        }
        for item in ranked
    ]
