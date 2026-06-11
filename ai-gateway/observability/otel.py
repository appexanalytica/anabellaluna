"""
OpenTelemetry — Distributed tracing para el AI Gateway.

Instrumenta:
  - FastAPI (requests HTTP entrantes)
  - httpx (requests HTTP salientes al backend)
  - Custom spans para agentes, workflows, memory ops

Exporta traces a un collector OTLP (Jaeger, Grafana Tempo, etc).
En desarrollo, puede exportar a consola.
"""

from __future__ import annotations

import logging
from contextlib import contextmanager
from typing import Any, Generator

from app.config import settings

logger = logging.getLogger(__name__)

# Lazy imports para evitar crash si opentelemetry no está instalado
_tracer = None
_initialized = False


def init_telemetry() -> None:
    """Inicializa OpenTelemetry con el exportador configurado."""
    global _tracer, _initialized

    if _initialized:
        return

    try:
        from opentelemetry import trace
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace.export import (
            BatchSpanProcessor,
            ConsoleSpanExporter,
        )

        resource = Resource.create({
            "service.name": "ai-gateway",
            "service.version": "0.1.0",
            "deployment.environment": settings.environment,
        })

        provider = TracerProvider(resource=resource)

        # En desarrollo: exportar a consola
        # En producción: exportar a OTLP (Jaeger, Tempo, etc.)
        if settings.environment == "production":
            try:
                from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
                otlp_exporter = OTLPSpanExporter()
                provider.add_span_processor(BatchSpanProcessor(otlp_exporter))
                logger.info("OpenTelemetry: OTLP exporter configured")
            except Exception as e:
                logger.warning("OTLP exporter not available, falling back to console: %s", e)
                provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))
        else:
            # En desarrollo, solo loguear si el log level es debug
            if settings.log_level.lower() == "debug":
                provider.add_span_processor(BatchSpanProcessor(ConsoleSpanExporter()))

        trace.set_tracer_provider(provider)
        _tracer = trace.get_tracer("ai-gateway")
        _initialized = True

        logger.info("OpenTelemetry initialized — environment=%s", settings.environment)

    except ImportError:
        logger.warning("OpenTelemetry SDK not installed — tracing disabled")
        _initialized = True  # Marcar como inicializado para no reintentar


def instrument_fastapi(app) -> None:
    """Instrumenta la app FastAPI con OpenTelemetry."""
    try:
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        FastAPIInstrumentor.instrument_app(app)
        logger.info("FastAPI instrumented with OpenTelemetry")
    except ImportError:
        logger.debug("opentelemetry-instrumentation-fastapi not installed — skipping")


def instrument_httpx() -> None:
    """Instrumenta httpx (CRM client requests) con OpenTelemetry."""
    try:
        from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
        HTTPXClientInstrumentor().instrument()
        logger.info("httpx instrumented with OpenTelemetry")
    except ImportError:
        logger.debug("opentelemetry-instrumentation-httpx not installed — skipping")


@contextmanager
def trace_span(
    name: str,
    *,
    attributes: dict[str, Any] | None = None,
) -> Generator[Any, None, None]:
    """
    Context manager para crear un span de tracing.

    Usage:
        with trace_span("agent.analyze", attributes={"agent": "lead_intelligence"}):
            result = await agent.analyze(event)
    """
    if _tracer is None:
        yield None
        return

    from opentelemetry import trace

    with _tracer.start_as_current_span(name) as span:
        if attributes:
            for key, value in attributes.items():
                span.set_attribute(key, str(value))
        try:
            yield span
        except Exception as e:
            span.set_attribute("error", True)
            span.set_attribute("error.message", str(e))
            span.set_status(trace.StatusCode.ERROR, str(e))
            raise


def record_span_event(name: str, attributes: dict[str, Any] | None = None) -> None:
    """Registra un evento en el span activo."""
    if _tracer is None:
        return

    from opentelemetry import trace

    span = trace.get_current_span()
    if span and span.is_recording():
        span.add_event(name, attributes=attributes or {})


def set_span_attribute(key: str, value: Any) -> None:
    """Setea un atributo en el span activo."""
    if _tracer is None:
        return

    from opentelemetry import trace

    span = trace.get_current_span()
    if span and span.is_recording():
        span.set_attribute(key, str(value))


def get_tracer():
    """Retorna el tracer de OpenTelemetry (o None si no está inicializado)."""
    return _tracer
