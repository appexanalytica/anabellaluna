"""
Base Agent — Clase base para todos los agentes especializados.

Cada agente hereda de BaseAgent y define:
  - name: identificador único
  - system_prompt: instrucciones del agente
  - tools: funciones que puede ejecutar
  - triggers: event types que activan al agente (para modo autónomo)
  - schedule: cron expression (para agentes periódicos)

Todos los agentes operan en modo suggest-first por defecto.
"""

from __future__ import annotations

import logging
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

from events.consumer import BusinessEvent
from observability.langfuse_client import trace_agent
from providers.openrouter import chat_completion
from tools.crm_client import crm_client

logger = logging.getLogger(__name__)


@dataclass
class AgentResult:
    """Resultado estandarizado de la ejecución de un agente."""

    agent_name: str
    success: bool = True
    output: str = ""
    insights: list[dict[str, Any]] = field(default_factory=list)
    notifications: list[dict[str, Any]] = field(default_factory=list)
    metrics: dict[str, Any] = field(default_factory=dict)
    error: str | None = None


class BaseAgent(ABC):
    """Clase base para agentes especializados del AI Gateway."""

    name: str = "base"
    description: str = ""
    system_prompt: str = ""
    triggers: list[str] = []
    schedule: str | None = None  # cron expression, ej: "0 * * * *"
    mode: str = "suggest"  # "suggest" | "autonomous" (futuro)

    def __init__(self) -> None:
        self.crm = crm_client
        self.logger = logging.getLogger(f"agent.{self.name}")

    async def handle_event(self, event: BusinessEvent) -> AgentResult | None:
        """
        Procesa un evento de negocio.
        Retorna None si el agente decide no actuar.
        """
        if not self._should_handle(event):
            return None

        self.logger.info("Handling event %s (type=%s)", event.event_id[:8], event.event_type)

        async with trace_agent(self.name, user_id=event.user_id) as trace:
            trace.log_input(f"Event: {event.event_type} | Payload: {event.payload}")
            try:
                result = await self.analyze(event)
                trace.log_output(result.output)

                # En modo suggest-first: generar notificaciones, no ejecutar acciones
                if result.notifications and self.mode == "suggest":
                    for notif in result.notifications:
                        await self._send_suggestion(notif)

                return result
            except Exception as e:
                trace.log_error(str(e))
                return AgentResult(
                    agent_name=self.name,
                    success=False,
                    error=str(e),
                )

    @abstractmethod
    async def analyze(self, event: BusinessEvent) -> AgentResult:
        """Lógica principal del agente — implementar en subclases."""
        ...

    async def run_scheduled(self) -> AgentResult:
        """
        Ejecución periódica del agente (si tiene schedule).
        Override en subclases que necesiten análisis proactivo.
        """
        return AgentResult(agent_name=self.name, output="No scheduled task defined")

    async def run_chat(self, message: str, *, user_id: str = "", agent_id: str = "") -> AgentResult:
        """
        Procesa un mensaje de chat del usuario.
        Los agentes pueden override esto para personalizar su respuesta.
        """
        async with trace_agent(self.name, user_id=user_id) as trace:
            trace.log_input(message)

            messages = [
                {"role": "system", "content": self.system_prompt},
                {"role": "user", "content": message},
            ]

            response = await chat_completion(messages, temperature=0.3)
            trace.log_llm_call(
                model=response["model"],
                input_messages=messages,
                output_text=response["content"],
                tokens_input=response["tokens_input"],
                tokens_output=response["tokens_output"],
                latency_ms=response["latency_ms"],
            )

            trace.log_output(response["content"])

            return AgentResult(
                agent_name=self.name,
                output=response["content"],
                metrics={
                    "tokens_input": response["tokens_input"],
                    "tokens_output": response["tokens_output"],
                    "latency_ms": response["latency_ms"],
                },
            )

    def _should_handle(self, event: BusinessEvent) -> bool:
        """Chequea si este agente debe procesar el evento."""
        if not self.triggers:
            return False
        for trigger in self.triggers:
            if trigger.endswith(".*"):
                prefix = trigger[:-2]
                if event.event_type.startswith(prefix):
                    return True
            elif event.event_type == trigger:
                return True
        return False

    async def _send_suggestion(self, notification: dict[str, Any]) -> None:
        """Envía una sugerencia como notificación al backend."""
        try:
            await self.crm.create_notification({
                "tipo": "ai_suggestion",
                "titulo": notification.get("title", f"[{self.name}] Sugerencia"),
                "mensaje": notification.get("message", ""),
                "prioridad": notification.get("priority", "media"),
                "destinatarioId": notification.get("agent_id", ""),
                "metadata": {
                    "ai_agent": self.name,
                    "actionable": notification.get("actionable", False),
                    "suggested_action": notification.get("suggested_action", ""),
                    **notification.get("metadata", {}),
                },
            })
            self.logger.info("Suggestion sent: %s", notification.get("title", ""))
        except Exception as e:
            self.logger.warning("Failed to send suggestion: %s", e)
