"""
Langfuse integration — LLM observability.

Registra automáticamente:
  - prompts y contextos enviados al LLM
  - tools ejecutadas y sus resultados
  - tokens consumidos y costos
  - latencia y errores
  - reasoning de cada agente

Toda decisión IA queda auditable.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

from app.config import settings

logger = logging.getLogger(__name__)

_langfuse = None


def get_langfuse():
    """Retorna el cliente Langfuse singleton (lazy init)."""
    global _langfuse
    if _langfuse is not None:
        return _langfuse

    if not settings.langfuse_public_key or not settings.langfuse_secret_key:
        logger.warning("Langfuse keys not configured — observability disabled")
        return None

    try:
        from langfuse import Langfuse

        _langfuse = Langfuse(
            public_key=settings.langfuse_public_key,
            secret_key=settings.langfuse_secret_key,
            host=settings.langfuse_host,
        )
        logger.info("Langfuse connected — host=%s", settings.langfuse_host)
        return _langfuse
    except Exception as e:
        logger.error("Failed to initialize Langfuse: %s", e)
        return None


def shutdown_langfuse() -> None:
    """Flush pending events and close client."""
    global _langfuse
    if _langfuse:
        try:
            _langfuse.flush()
            _langfuse.shutdown()
        except Exception:
            pass
        _langfuse = None


@asynccontextmanager
async def trace_agent(
    agent_name: str,
    *,
    user_id: str = "",
    session_id: str = "",
    tags: list[str] | None = None,
    metadata: dict[str, Any] | None = None,
) -> AsyncGenerator[AgentTrace, None]:
    """
    Context manager para trazar la ejecución completa de un agente.

    Usage:
        async with trace_agent("operational_intelligence", user_id="abc") as trace:
            trace.log_input("Analizar leads sin seguimiento")
            result = await agent.run(...)
            trace.log_output(result)
            trace.log_tool("search_clientes", input={...}, output={...})
    """
    lf = get_langfuse()
    trace_obj = AgentTrace(agent_name)

    if lf:
        try:
            trace_obj._lf_trace = lf.trace(
                name=agent_name,
                user_id=user_id or None,
                session_id=session_id or None,
                tags=tags or [],
                metadata=metadata or {},
            )
        except Exception as e:
            logger.warning("Langfuse trace creation failed: %s", e)

    try:
        yield trace_obj
    except Exception as e:
        trace_obj.log_error(str(e))
        raise
    finally:
        trace_obj.finalize()


class AgentTrace:
    """Wrapper sobre Langfuse trace con fallback a logging."""

    def __init__(self, agent_name: str) -> None:
        self.agent_name = agent_name
        self._lf_trace: Any = None
        self._current_span: Any = None

    def log_input(self, input_text: str, *, metadata: dict | None = None) -> None:
        logger.info("[%s] Input: %s", self.agent_name, input_text[:200])
        if self._lf_trace:
            try:
                self._lf_trace.update(input=input_text, metadata=metadata or {})
            except Exception:
                pass

    def log_output(self, output_text: str, *, metadata: dict | None = None) -> None:
        logger.info("[%s] Output: %s", self.agent_name, output_text[:200])
        if self._lf_trace:
            try:
                self._lf_trace.update(output=output_text, metadata=metadata or {})
            except Exception:
                pass

    def log_tool(
        self, tool_name: str, *, input: dict | None = None, output: Any = None, duration_ms: int = 0
    ) -> None:
        logger.info("[%s] Tool: %s", self.agent_name, tool_name)
        if self._lf_trace:
            try:
                span = self._lf_trace.span(name=f"tool:{tool_name}", input=input or {})
                span.end(output=output, metadata={"duration_ms": duration_ms})
            except Exception:
                pass

    def log_llm_call(
        self,
        model: str,
        *,
        input_messages: list[dict] | None = None,
        output_text: str = "",
        tokens_input: int = 0,
        tokens_output: int = 0,
        cost_usd: float = 0.0,
        duration_ms: int = 0,
    ) -> None:
        logger.info(
            "[%s] LLM: model=%s tokens=%d+%d cost=$%.4f",
            self.agent_name, model, tokens_input, tokens_output, cost_usd,
        )
        if self._lf_trace:
            try:
                gen = self._lf_trace.generation(
                    name="llm_call",
                    model=model,
                    input=input_messages or [],
                    output=output_text,
                    usage={
                        "input": tokens_input,
                        "output": tokens_output,
                        "total": tokens_input + tokens_output,
                    },
                    metadata={"cost_usd": cost_usd, "duration_ms": duration_ms},
                )
                gen.end()
            except Exception:
                pass

    def log_error(self, error: str) -> None:
        logger.error("[%s] Error: %s", self.agent_name, error)
        if self._lf_trace:
            try:
                self._lf_trace.update(
                    status_message=error,
                    level="ERROR",
                    metadata={"error": error},
                )
            except Exception:
                pass

    def finalize(self) -> None:
        lf = get_langfuse()
        if lf:
            try:
                lf.flush()
            except Exception:
                pass
