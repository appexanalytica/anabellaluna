"""
OpenRouter LLM Provider — Acceso a múltiples modelos via API OpenAI-compatible.

Modelos soportados via OpenRouter:
  - openai/gpt-4o-mini (default, rápido y barato)
  - anthropic/claude-3-haiku
  - anthropic/claude-3.5-sonnet
  - google/gemini-pro
  - etc.
"""

from __future__ import annotations

import logging
import time
from typing import Any

from openai import AsyncOpenAI

from app.config import settings

logger = logging.getLogger(__name__)

_client: AsyncOpenAI | None = None


def get_openai_client() -> AsyncOpenAI:
    """Retorna el cliente OpenAI configurado para OpenRouter."""
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            api_key=settings.openrouter_api_key,
            base_url=settings.openrouter_base_url,
            default_headers={
                "HTTP-Referer": "https://anabellaluna.com.ar",
                "X-Title": "Anabella Luna AI Gateway",
            },
        )
    return _client


async def chat_completion(
    messages: list[dict[str, str]],
    *,
    model: str | None = None,
    temperature: float = 0.3,
    max_tokens: int = 2048,
    tools: list[dict] | None = None,
    tool_choice: str | None = None,
) -> dict[str, Any]:
    """
    Llama al LLM via OpenRouter y retorna la respuesta completa.

    Returns:
        {
            "content": str,
            "tool_calls": list | None,
            "model": str,
            "tokens_input": int,
            "tokens_output": int,
            "cost_usd": float,
            "latency_ms": int,
            "finish_reason": str,
        }
    """
    client = get_openai_client()
    used_model = model or settings.openrouter_model

    kwargs: dict[str, Any] = {
        "model": used_model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    if tools:
        kwargs["tools"] = tools
    if tool_choice:
        kwargs["tool_choice"] = tool_choice

    start = time.monotonic()
    response = await client.chat.completions.create(**kwargs)
    latency_ms = int((time.monotonic() - start) * 1000)

    choice = response.choices[0]
    usage = response.usage

    result = {
        "content": choice.message.content or "",
        "tool_calls": None,
        "model": response.model or used_model,
        "tokens_input": usage.prompt_tokens if usage else 0,
        "tokens_output": usage.completion_tokens if usage else 0,
        "cost_usd": 0.0,
        "latency_ms": latency_ms,
        "finish_reason": choice.finish_reason or "stop",
    }

    if choice.message.tool_calls:
        result["tool_calls"] = [
            {
                "id": tc.id,
                "function": {
                    "name": tc.function.name,
                    "arguments": tc.function.arguments,
                },
            }
            for tc in choice.message.tool_calls
        ]

    logger.info(
        "LLM call: model=%s tokens=%d+%d latency=%dms",
        result["model"], result["tokens_input"], result["tokens_output"], latency_ms,
    )

    return result
