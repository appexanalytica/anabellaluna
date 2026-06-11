"""
Embedding Service — Pipeline de generación de embeddings.

Genera embeddings para:
  - Contenido de conversaciones (para búsqueda semántica)
  - Notas de clientes
  - Descripciones de propiedades
  - Análisis previos de IA

Almacena en semantic_memory (pgvector).
Usa el modelo configurado via EmbeddingProvider.
"""

from __future__ import annotations

import hashlib
import logging
from typing import Any

from embeddings.models import get_embedding_provider
from memory.semantic import store as semantic_store

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Servicio centralizado de generación y almacenamiento de embeddings."""

    def __init__(self) -> None:
        self._cache: dict[str, list[float]] = {}  # In-memory cache por hash

    async def embed_text(self, text: str) -> list[float]:
        """
        Genera embedding para un texto.
        Usa cache en memoria para textos repetidos.
        """
        text_hash = self._hash(text)
        if text_hash in self._cache:
            return self._cache[text_hash]

        provider = get_embedding_provider()
        embedding = await provider.embed(text)

        # Cache (máximo 500 entries para no usar mucha RAM)
        if len(self._cache) < 500:
            self._cache[text_hash] = embedding

        return embedding

    async def embed_and_store(
        self,
        text: str,
        *,
        entity_type: str,
        entity_id: str,
        agent_id: str = "",
        metadata: dict[str, Any] | None = None,
        ttl_days: int | None = None,
    ) -> str:
        """
        Genera embedding y lo almacena en memoria semántica.

        Returns:
            UUID del registro creado en semantic_memory.
        """
        embedding = await self.embed_text(text)

        record_id = await semantic_store(
            entity_type=entity_type,
            entity_id=entity_id,
            content=text[:2000],  # Limitar contenido almacenado
            embedding=embedding,
            agent_id=agent_id,
            metadata=metadata,
            ttl_days=ttl_days,
        )

        logger.debug(
            "Embedded and stored: entity=%s/%s dims=%d",
            entity_type, entity_id, len(embedding),
        )
        return record_id

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """
        Genera embeddings para un batch de textos.
        Más eficiente que llamar embed_text uno por uno.
        """
        provider = get_embedding_provider()

        # Separar textos ya cacheados de los que necesitan embedding
        results: list[list[float] | None] = [None] * len(texts)
        to_embed: list[tuple[int, str]] = []

        for i, text in enumerate(texts):
            text_hash = self._hash(text)
            if text_hash in self._cache:
                results[i] = self._cache[text_hash]
            else:
                to_embed.append((i, text))

        if to_embed:
            # Generar embeddings para textos no cacheados
            new_texts = [t for _, t in to_embed]
            new_embeddings = await provider.embed_batch(new_texts)

            for (idx, text), embedding in zip(to_embed, new_embeddings):
                results[idx] = embedding
                text_hash = self._hash(text)
                if len(self._cache) < 500:
                    self._cache[text_hash] = embedding

        return results  # type: ignore[return-value]

    async def embed_conversation(
        self,
        conversation_id: str,
        messages: list[dict[str, str]],
        *,
        agent_id: str = "",
        user_id: str = "",
    ) -> str:
        """
        Genera embedding de una conversación completa (resumen comprimido).
        """
        # Construir texto de la conversación
        parts = []
        for msg in messages[-20:]:  # Últimos 20 mensajes
            role = msg.get("role", "user")
            content = msg.get("content", "")[:200]
            parts.append(f"{role}: {content}")

        conversation_text = "\n".join(parts)

        return await self.embed_and_store(
            conversation_text,
            entity_type="conversation",
            entity_id=conversation_id,
            agent_id=agent_id,
            metadata={"user_id": user_id, "message_count": len(messages)},
            ttl_days=90,
        )

    async def embed_client_profile(
        self,
        client_id: str,
        client_data: dict[str, Any],
        *,
        agent_id: str = "",
    ) -> str:
        """Genera embedding del perfil de un cliente para búsqueda semántica."""
        parts = [
            f"Cliente: {client_data.get('nombre', '')}",
            f"Email: {client_data.get('email', '')}",
            f"Teléfono: {client_data.get('telefono', '')}",
            f"Notas: {client_data.get('notas', '')}",
            f"Dirección: {client_data.get('direccion', '')}",
        ]
        text = " | ".join(p for p in parts if not p.endswith(": "))

        return await self.embed_and_store(
            text,
            entity_type="client",
            entity_id=client_id,
            agent_id=agent_id,
            metadata={"source": "profile"},
        )

    async def embed_property_listing(
        self,
        property_id: str,
        property_data: dict[str, Any],
        *,
        agent_id: str = "",
    ) -> str:
        """Genera embedding del listing de una propiedad."""
        parts = [
            f"{property_data.get('tipoPropiedad', '')} en {property_data.get('tipoOperacion', '')}",
            f"Ubicación: {property_data.get('direccion', '')} {property_data.get('barrio', '')}",
            f"Precio: {property_data.get('precio', '')} {property_data.get('moneda', 'USD')}",
            f"Superficie: {property_data.get('superficieTotal', '')}m²",
            f"{property_data.get('ambientes', '')} ambientes, {property_data.get('dormitorios', '')} dormitorios",
            f"Descripción: {(property_data.get('descripcion', '') or '')[:500]}",
        ]
        text = " | ".join(p for p in parts if p)

        return await self.embed_and_store(
            text,
            entity_type="property",
            entity_id=property_id,
            agent_id=agent_id,
            metadata={"source": "listing"},
        )

    def clear_cache(self) -> None:
        """Limpia el cache de embeddings en memoria."""
        self._cache.clear()

    @staticmethod
    def _hash(text: str) -> str:
        return hashlib.md5(text.encode()).hexdigest()


# Singleton
embedding_service = EmbeddingService()
