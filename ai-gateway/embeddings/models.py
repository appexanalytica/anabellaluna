"""
Embedding Models — Abstracción de proveedores de embeddings.

Soporta múltiples backends:
  - OpenAI (text-embedding-ada-002 / text-embedding-3-small via OpenRouter)
  - Sentence Transformers (local, futuro)
  - Custom (extensible)

El proveedor se configura via variables de entorno.
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod

from app.config import settings

logger = logging.getLogger(__name__)


class EmbeddingProvider(ABC):
    """Interfaz abstracta para proveedores de embeddings."""

    name: str = "base"
    dimensions: int = 1536

    @abstractmethod
    async def embed(self, text: str) -> list[float]:
        """Genera embedding para un texto individual."""
        ...

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """
        Genera embeddings para un batch de textos.
        Implementación default: llama embed() secuencialmente.
        Override para batch nativo si el proveedor lo soporta.
        """
        results = []
        for text in texts:
            embedding = await self.embed(text)
            results.append(embedding)
        return results


class OpenAIEmbeddingProvider(EmbeddingProvider):
    """Proveedor de embeddings via API OpenAI-compatible (OpenRouter)."""

    name = "openai"
    dimensions = 1536

    def __init__(self, model: str = "openai/text-embedding-3-small") -> None:
        self._model = model
        self._client = None

    def _get_client(self):
        if self._client is None:
            from openai import AsyncOpenAI
            self._client = AsyncOpenAI(
                api_key=settings.openrouter_api_key,
                base_url=settings.openrouter_base_url,
            )
        return self._client

    async def embed(self, text: str) -> list[float]:
        """Genera embedding usando la API OpenAI-compatible."""
        client = self._get_client()
        # Truncar texto largo
        text = text[:8000]

        response = await client.embeddings.create(
            model=self._model,
            input=text,
        )

        embedding = response.data[0].embedding
        logger.debug("Embedding generated: model=%s dims=%d", self._model, len(embedding))
        return embedding

    async def embed_batch(self, texts: list[str]) -> list[list[float]]:
        """Batch nativo de OpenAI (más eficiente que secuencial)."""
        client = self._get_client()
        # Truncar textos largos
        truncated = [t[:8000] for t in texts]

        response = await client.embeddings.create(
            model=self._model,
            input=truncated,
        )

        # Ordenar por index para mantener correspondencia
        sorted_data = sorted(response.data, key=lambda x: x.index)
        return [d.embedding for d in sorted_data]


class MockEmbeddingProvider(EmbeddingProvider):
    """Proveedor mock para desarrollo y tests (no requiere API key)."""

    name = "mock"
    dimensions = 1536

    async def embed(self, text: str) -> list[float]:
        """Genera un embedding determinístico basado en el hash del texto."""
        import hashlib
        h = hashlib.sha256(text.encode()).hexdigest()
        # Generar vector pseudo-random pero determinístico
        values = []
        for i in range(0, self.dimensions * 2, 2):
            idx = i % len(h)
            val = int(h[idx:idx+2], 16) / 255.0 - 0.5
            values.append(val)
        # Normalizar
        norm = sum(v * v for v in values[:self.dimensions]) ** 0.5
        if norm > 0:
            values = [v / norm for v in values[:self.dimensions]]
        return values[:self.dimensions]


# ── Provider Factory ──────────────────────────────────────────────────────────

_provider: EmbeddingProvider | None = None


def get_embedding_provider() -> EmbeddingProvider:
    """Retorna el proveedor de embeddings configurado."""
    global _provider
    if _provider is None:
        if settings.openrouter_api_key:
            _provider = OpenAIEmbeddingProvider()
            logger.info("Using OpenAI embedding provider")
        else:
            _provider = MockEmbeddingProvider()
            logger.warning("No API key configured — using mock embedding provider")
    return _provider


def set_embedding_provider(provider: EmbeddingProvider) -> None:
    """Override del proveedor (para tests)."""
    global _provider
    _provider = provider
