"""
Anthropic Provider — Acceso directo a Claude sin pasar por OpenRouter.

Útil para:
  - Reducir latencia (un hop menos)
  - Acceder a features específicas de Claude (extended thinking, etc.)
  - Fallback si OpenRouter tiene problemas

Requiere ANTHROPIC_API_KEY en las variables de entorno.
"""

from __future__ import annotations

import logging
import time
from typing import Any

from app.config import settings
from providers.base import BaseModelProvider, LLMResponse

logger = logging.getLogger(__name__)


class AnthropicProvider(BaseModelProvider):
    name = "anthropic"
    default_model = "claude-sonnet-4-20250514"
    supports_tools = True
    supports_streaming = False  # Por ahora

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or getattr(settings, "anthropic_api_key", "")
        self._client = None

    def _get_client(self):
        if self._client is None:
            try:
                from anthropic import AsyncAnthropic
                self._client = AsyncAnthropic(api_key=self._api_key)
            except ImportError:
                raise RuntimeError("anthropic package not installed — run: pip install anthropic")
        return self._client

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
        """Llama a la API de Anthropic directamente."""
        client = self._get_client()
        used_model = model or self.default_model

        # Separar system message de los demás
        system_content = ""
        chat_messages = []
        for msg in messages:
            if msg["role"] == "system":
                system_content += msg["content"] + "\n"
            else:
                chat_messages.append(msg)

        kwargs: dict[str, Any] = {
            "model": used_model,
            "messages": chat_messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
        }

        if system_content.strip():
            kwargs["system"] = system_content.strip()

        if tools:
            # Convertir formato OpenAI → Anthropic
            kwargs["tools"] = self._convert_tools(tools)

        if tool_choice:
            kwargs["tool_choice"] = {"type": tool_choice}

        start = time.monotonic()
        response = await client.messages.create(**kwargs)
        latency_ms = int((time.monotonic() - start) * 1000)

        # Extraer contenido
        content = ""
        tool_calls = None

        for block in response.content:
            if block.type == "text":
                content += block.text
            elif block.type == "tool_use":
                if tool_calls is None:
                    tool_calls = []
                tool_calls.append({
                    "id": block.id,
                    "function": {
                        "name": block.name,
                        "arguments": block.input if isinstance(block.input, str) else str(block.input),
                    },
                })

        result = LLMResponse(
            content=content,
            tool_calls=tool_calls,
            model=response.model,
            provider="anthropic",
            tokens_input=response.usage.input_tokens,
            tokens_output=response.usage.output_tokens,
            cost_usd=self._estimate_cost(
                response.usage.input_tokens,
                response.usage.output_tokens,
                used_model,
            ),
            latency_ms=latency_ms,
            finish_reason=response.stop_reason or "end_turn",
            raw_response=response,
        )

        logger.info(
            "Anthropic call: model=%s tokens=%d+%d latency=%dms",
            result.model, result.tokens_input, result.tokens_output, latency_ms,
        )

        return result

    def _convert_tools(self, openai_tools: list[dict]) -> list[dict]:
        """Convierte tools de formato OpenAI a formato Anthropic."""
        anthropic_tools = []
        for tool in openai_tools:
            fn = tool.get("function", {})
            anthropic_tools.append({
                "name": fn.get("name", ""),
                "description": fn.get("description", ""),
                "input_schema": fn.get("parameters", {}),
            })
        return anthropic_tools

    def _estimate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Estima costo basado en pricing de Anthropic."""
        # Pricing aproximado (actualizar según modelo)
        pricing = {
            "claude-sonnet-4-20250514": (3.0, 15.0),    # per 1M tokens
            "claude-haiku-4-5-20251001": (0.80, 4.0),
        }
        input_price, output_price = pricing.get(model, (3.0, 15.0))
        return (input_tokens * input_price + output_tokens * output_price) / 1_000_000
