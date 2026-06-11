"""
Base Model Provider — Abstracción para proveedores de LLM.

Define la interfaz que todos los proveedores deben implementar:
  - chat_completion: Generación de texto
  - Streaming (futuro)
  - Tool calling
  - Metadata y costos

Proveedores implementados:
  - OpenRouter (openrouter.py) — default, multi-modelo
  - Anthropic (anthropic.py) — directo a Claude
  - Gemini (gemini.py) — Google AI
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

logger = logging.getLogger(__name__)


@dataclass
class LLMResponse:
    """Respuesta estandarizada de cualquier proveedor de LLM."""

    content: str = ""
    tool_calls: list[dict[str, Any]] | None = None
    model: str = ""
    provider: str = ""
    tokens_input: int = 0
    tokens_output: int = 0
    cost_usd: float = 0.0
    latency_ms: int = 0
    finish_reason: str = "stop"
    raw_response: Any = None  # Respuesta cruda del proveedor


class BaseModelProvider(ABC):
    """Interfaz abstracta para proveedores de LLM."""

    name: str = "base"
    default_model: str = ""
    supports_tools: bool = True
    supports_streaming: bool = False

    @abstractmethod
    async def chat_completion(
        self,
        messages: list[dict[str, str]],
        *,
        model: str | None = None,
        temperature: float = 0.3,
        max_tokens: int = 2048,
        tools: list[dict] | None = None,
        tool_choice: str | None = None,
    ) -> LLMResponse:
        """
        Genera una respuesta de chat.

        Args:
            messages: Lista de mensajes [{role, content}]
            model: Override del modelo default
            temperature: Creatividad (0-1)
            max_tokens: Máximo de tokens de salida
            tools: Definiciones de tools para function calling
            tool_choice: Estrategia de selección de tool

        Returns:
            LLMResponse estandarizada
        """
        ...

    async def health_check(self) -> bool:
        """Verifica si el proveedor está disponible."""
        try:
            response = await self.chat_completion(
                [{"role": "user", "content": "ping"}],
                max_tokens=5,
            )
            return bool(response.content)
        except Exception:
            return False

    def get_info(self) -> dict[str, Any]:
        """Retorna información sobre el proveedor."""
        return {
            "name": self.name,
            "default_model": self.default_model,
            "supports_tools": self.supports_tools,
            "supports_streaming": self.supports_streaming,
        }


# ── Provider Registry ─────────────────────────────────────────────────────────

_providers: dict[str, BaseModelProvider] = {}
_default_provider: str = "openrouter"


def register_provider(provider: BaseModelProvider) -> None:
    """Registra un proveedor de LLM."""
    _providers[provider.name] = provider
    logger.info("Registered LLM provider: %s (model=%s)", provider.name, provider.default_model)


def get_provider(name: str | None = None) -> BaseModelProvider:
    """Obtiene un proveedor por nombre (o el default)."""
    provider_name = name or _default_provider
    if provider_name not in _providers:
        raise ValueError(
            f"Provider '{provider_name}' not found. Available: {list(_providers.keys())}"
        )
    return _providers[provider_name]


def set_default_provider(name: str) -> None:
    """Cambia el proveedor default."""
    global _default_provider
    if name not in _providers:
        raise ValueError(f"Provider '{name}' not registered")
    _default_provider = name
    logger.info("Default LLM provider set to: %s", name)


def list_providers() -> list[dict[str, Any]]:
    """Lista todos los proveedores registrados."""
    return [p.get_info() for p in _providers.values()]
