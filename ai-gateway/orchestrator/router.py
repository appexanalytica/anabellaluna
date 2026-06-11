"""
AI Orchestrator — Coordina agentes especializados.

Responsabilidades:
  - Decidir qué agente procesa cada evento
  - Registrar agentes y sus triggers
  - Coordinar ejecuciones programadas (scheduled)
  - Despachar mensajes de chat al agente correcto
  - Controlar concurrencia y timeouts
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any

from agents.base import AgentResult, BaseAgent
from events.consumer import BusinessEvent, event_consumer

logger = logging.getLogger(__name__)


class Orchestrator:
    """Coordinador central de agentes IA."""

    def __init__(self) -> None:
        self._agents: dict[str, BaseAgent] = {}
        self._scheduled_tasks: list[asyncio.Task] = []

    def register(self, agent: BaseAgent) -> None:
        """Registra un agente y conecta sus triggers al event consumer."""
        self._agents[agent.name] = agent
        logger.info(
            "Registered agent: %s (triggers=%s, schedule=%s)",
            agent.name, agent.triggers, agent.schedule,
        )

        # Registrar handlers para cada trigger del agente
        for trigger in agent.triggers:
            event_consumer.on(trigger, self._make_handler(agent))

    def _make_handler(self, agent: BaseAgent):
        """Crea un handler async para un agente específico."""
        async def handler(event: BusinessEvent) -> None:
            try:
                result = await asyncio.wait_for(
                    agent.handle_event(event),
                    timeout=60.0,
                )
                if result and not result.success:
                    logger.warning(
                        "Agent %s failed for event %s: %s",
                        agent.name, event.event_type, result.error,
                    )
            except asyncio.TimeoutError:
                logger.error(
                    "Agent %s timed out processing event %s",
                    agent.name, event.event_type,
                )
            except Exception:
                logger.exception(
                    "Unhandled error in agent %s for event %s",
                    agent.name, event.event_type,
                )
        handler.__name__ = f"{agent.name}_handler"
        return handler

    async def start_scheduled(self) -> None:
        """Inicia las tareas programadas de todos los agentes con schedule."""
        for agent in self._agents.values():
            if agent.schedule:
                task = asyncio.create_task(
                    self._run_schedule_loop(agent),
                    name=f"schedule:{agent.name}",
                )
                self._scheduled_tasks.append(task)
                logger.info("Started scheduled task for agent: %s (%s)", agent.name, agent.schedule)

    async def stop_scheduled(self) -> None:
        """Detiene todas las tareas programadas."""
        for task in self._scheduled_tasks:
            task.cancel()
        if self._scheduled_tasks:
            await asyncio.gather(*self._scheduled_tasks, return_exceptions=True)
        self._scheduled_tasks.clear()

    async def _run_schedule_loop(self, agent: BaseAgent) -> None:
        """Loop de ejecución periódica para un agente."""
        interval = self._parse_schedule(agent.schedule)

        while True:
            try:
                await asyncio.sleep(interval)
                logger.info("Running scheduled analysis: %s", agent.name)
                result = await asyncio.wait_for(
                    agent.run_scheduled(),
                    timeout=120.0,
                )
                if result.notifications:
                    for notif in result.notifications:
                        await agent._send_suggestion(notif)

                logger.info(
                    "Scheduled %s completed: %d insights, %d notifications",
                    agent.name,
                    len(result.insights),
                    len(result.notifications),
                )
            except asyncio.CancelledError:
                break
            except Exception:
                logger.exception("Scheduled task %s failed", agent.name)
                await asyncio.sleep(60)  # Esperar antes de reintentar

    def _parse_schedule(self, cron_expr: str | None) -> int:
        """
        Convierte cron expression simplificada a segundos.
        Soporta: "0 */2 * * *" → cada 2 horas, "*/30 * * * *" → cada 30 min.
        Para producción usar una librería cron real.
        """
        if not cron_expr:
            return 3600  # Default: cada hora

        parts = cron_expr.split()
        if len(parts) >= 2:
            hour_part = parts[1]
            if hour_part.startswith("*/"):
                try:
                    return int(hour_part[2:]) * 3600
                except ValueError:
                    pass

            min_part = parts[0]
            if min_part.startswith("*/"):
                try:
                    return int(min_part[2:]) * 60
                except ValueError:
                    pass

        return 3600

    async def route_chat(
        self,
        message: str,
        *,
        user_id: str = "",
        agent_id: str = "",
        target_agent: str | None = None,
    ) -> AgentResult:
        """
        Rutea un mensaje de chat al agente apropiado.

        Si target_agent se especifica, va directo. Si no, se usa
        el agente operacional como default.
        """
        if target_agent and target_agent in self._agents:
            agent = self._agents[target_agent]
        else:
            # Default: operational intelligence
            agent = self._agents.get("operational_intelligence")
            if not agent:
                # Fallback: primer agente disponible
                agent = next(iter(self._agents.values()), None)

        if not agent:
            return AgentResult(
                agent_name="orchestrator",
                success=False,
                error="No agents available",
            )

        return await agent.run_chat(message, user_id=user_id, agent_id=agent_id)

    def get_agent_status(self) -> list[dict[str, Any]]:
        """Retorna estado de todos los agentes registrados."""
        return [
            {
                "name": agent.name,
                "description": agent.description,
                "triggers": agent.triggers,
                "schedule": agent.schedule,
                "mode": agent.mode,
            }
            for agent in self._agents.values()
        ]


# Singleton
orchestrator = Orchestrator()
