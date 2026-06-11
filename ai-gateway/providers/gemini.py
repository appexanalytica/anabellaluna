"""
Gemini Provider — Acceso a Google Gemini.

Útil para:
  - Diversificar proveedores de LLM
  - Aprovechar contexto largo de Gemini (1M tokens)
  - Análisis de documentos grandes
  - Fallback alternativo

Requiere GEMINI_API_KEY en las variables de entorno.
"""

from __future__ import annotations

import logging
import time
from typing import Any

from app.config import settings
from providers.base import BaseModelProvider, LLMResponse

logger = logging.getLogger(__name__)


class GeminiProvider(BaseModelProvider):
    name = "gemini"
    default_model = "gemini-2.0-flash"
    supports_tools = True
    supports_streaming = False

    def __init__(self, api_key: str | None = None) -> None:
        self._api_key = api_key or getattr(settings, "gemini_api_key", "")
        self._client = None

    def _get_client(self):
        if self._client is None:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self._api_key)
                self._client = genai
            except ImportError:
                raise RuntimeError("google-generativeai not installed — run: pip install google-generativeai")
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
        """Llama a la API de Gemini."""
        genai = self._get_client()
        used_model = model or self.default_model

        # Separar system de chat messages
        system_instruction = ""
        chat_contents = []

        for msg in messages:
            if msg["role"] == "system":
                system_instruction += msg["content"] + "\n"
            elif msg["role"] == "user":
                chat_contents.append({"role": "user", "parts": [msg["content"]]})
            elif msg["role"] == "assistant":
                chat_contents.append({"role": "model", "parts": [msg["content"]]})

        # Crear modelo
        gen_config = genai.types.GenerationConfig(
            temperature=temperature,
            max_output_tokens=max_tokens,
        )

        model_instance = genai.GenerativeModel(
            model_name=used_model,
            system_instruction=system_instruction.strip() or None,
            generation_config=gen_config,
        )

        start = time.monotonic()

        # Gemini usa generate_content (sync) — ejecutar en executor para async
        import asyncio
        loop = asyncio.get_event_loop()

        # Construir prompt desde messages
        if len(chat_contents) == 1:
            prompt = chat_contents[0]["parts"][0]
            response = await loop.run_in_executor(
                None, lambda: model_instance.generate_content(prompt)
            )
        else:
            # Multi-turn chat
            chat = model_instance.start_chat(history=chat_contents[:-1])
            last_message = chat_contents[-1]["parts"][0]
            response = await loop.run_in_executor(
                None, lambda: chat.send_message(last_message)
            )

        latency_ms = int((time.monotonic() - start) * 1000)

        # Extraer contenido
        content = ""
        try:
            content = response.text
        except Exception:
            if response.candidates:
                for part in response.candidates[0].content.parts:
                    if hasattr(part, "text"):
                        content += part.text

        # Token counts
        tokens_input = 0
        tokens_output = 0
        if hasattr(response, "usage_metadata"):
            tokens_input = getattr(response.usage_metadata, "prompt_token_count", 0)
            tokens_output = getattr(response.usage_metadata, "candidates_token_count", 0)

        result = LLMResponse(
            content=content,
            tool_calls=None,  # TODO: implementar tool calling de Gemini
            model=used_model,
            provider="gemini",
            tokens_input=tokens_input,
            tokens_output=tokens_output,
            cost_usd=self._estimate_cost(tokens_input, tokens_output, used_model),
            latency_ms=latency_ms,
            finish_reason="stop",
            raw_response=response,
        )

        logger.info(
            "Gemini call: model=%s tokens=%d+%d latency=%dms",
            result.model, result.tokens_input, result.tokens_output, latency_ms,
        )

        return result

    def _estimate_cost(self, input_tokens: int, output_tokens: int, model: str) -> float:
        """Estima costo basado en pricing de Gemini."""
        pricing = {
            "gemini-2.0-flash": (0.075, 0.30),    # per 1M tokens
            "gemini-2.5-pro": (1.25, 10.0),
            "gemini-2.5-flash": (0.15, 0.60),
        }
        input_price, output_price = pricing.get(model, (0.075, 0.30))
        return (input_tokens * input_price + output_tokens * output_price) / 1_000_000
