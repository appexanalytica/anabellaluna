"""
Policy Engine — Gobernanza IA.

Controla qué acciones pueden ejecutar los agentes, bloquea operaciones
peligrosas, limita autonomía y previene loops infinitos.

La IA NO puede:
  - Borrar propiedades/clientes automáticamente
  - Modificar pagos o estados financieros
  - Cambiar permisos de usuarios
  - Enviar mensajes masivos sin aprobación
  - Ejecutar más de N tool calls por request
  - Ejecutar workflows ilimitados
"""

from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field
from typing import Any

from app.config import settings

logger = logging.getLogger(__name__)


# ── Acciones bloqueadas ─────────────────────────────────────────────────────

BLOCKED_ACTIONS = frozenset({
    "delete_client",
    "delete_property",
    "delete_operation",
    "modify_payment",
    "change_permissions",
    "change_user_role",
    "send_mass_message",
    "delete_agent",
    "reset_password",
    "drop_database",
})

REQUIRES_APPROVAL = frozenset({
    "create_operation",
    "update_operation_status",
    "assign_agent",
    "send_notification_bulk",
    "update_price",
    "publish_property",
    "unpublish_property",
})

# Máximos por ventana de tiempo
MAX_TOOL_CALLS_PER_MINUTE = 30
MAX_LLM_CALLS_PER_MINUTE = 20
MAX_NOTIFICATIONS_PER_HOUR = 50
MAX_WORKFLOW_RUNS_PER_HOUR = 10


@dataclass
class PolicyViolation:
    """Detalle de una violación de política."""

    action: str
    reason: str
    severity: str  # "blocked" | "requires_approval" | "rate_limited"
    agent_name: str = ""
    timestamp: float = field(default_factory=time.time)


@dataclass
class PolicyResult:
    """Resultado de evaluación de política."""

    allowed: bool
    violations: list[PolicyViolation] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    @property
    def reason(self) -> str:
        if not self.violations:
            return ""
        return "; ".join(v.reason for v in self.violations)


class PolicyEngine:
    """Motor de políticas para gobernanza IA."""

    def __init__(self) -> None:
        self._tool_calls: list[float] = []
        self._llm_calls: list[float] = []
        self._notifications: list[float] = []
        self._workflow_runs: list[float] = []

    def evaluate_tool_call(
        self,
        tool_name: str,
        *,
        agent_name: str = "",
        agent_mode: str = "suggest",
    ) -> PolicyResult:
        """
        Evalúa si un tool call está permitido.
        Retorna PolicyResult con allowed=True/False.
        """
        violations = []
        warnings = []

        # 1. Bloquear acciones prohibidas
        if tool_name in BLOCKED_ACTIONS:
            violations.append(PolicyViolation(
                action=tool_name,
                reason=f"Action '{tool_name}' is permanently blocked by policy",
                severity="blocked",
                agent_name=agent_name,
            ))
            logger.warning("BLOCKED: agent=%s tried action=%s", agent_name, tool_name)
            return PolicyResult(allowed=False, violations=violations)

        # 2. Acciones que requieren aprobación humana
        if tool_name in REQUIRES_APPROVAL and agent_mode != "autonomous":
            violations.append(PolicyViolation(
                action=tool_name,
                reason=f"Action '{tool_name}' requires human approval in '{agent_mode}' mode",
                severity="requires_approval",
                agent_name=agent_name,
            ))
            logger.info("APPROVAL_REQUIRED: agent=%s action=%s", agent_name, tool_name)
            return PolicyResult(allowed=False, violations=violations)

        # 3. Rate limiting
        now = time.time()
        self._tool_calls = [t for t in self._tool_calls if now - t < 60]
        if len(self._tool_calls) >= MAX_TOOL_CALLS_PER_MINUTE:
            violations.append(PolicyViolation(
                action=tool_name,
                reason=f"Rate limit exceeded: {MAX_TOOL_CALLS_PER_MINUTE} tool calls/min",
                severity="rate_limited",
                agent_name=agent_name,
            ))
            return PolicyResult(allowed=False, violations=violations)

        self._tool_calls.append(now)

        # 4. Warnings (permitido pero anotado)
        if len(self._tool_calls) > MAX_TOOL_CALLS_PER_MINUTE * 0.8:
            warnings.append(f"Approaching tool call rate limit ({len(self._tool_calls)}/{MAX_TOOL_CALLS_PER_MINUTE}/min)")

        return PolicyResult(allowed=True, warnings=warnings)

    def evaluate_llm_call(self, *, agent_name: str = "") -> PolicyResult:
        """Evalúa si se puede hacer una llamada al LLM."""
        now = time.time()
        self._llm_calls = [t for t in self._llm_calls if now - t < 60]

        if len(self._llm_calls) >= MAX_LLM_CALLS_PER_MINUTE:
            return PolicyResult(
                allowed=False,
                violations=[PolicyViolation(
                    action="llm_call",
                    reason=f"LLM rate limit exceeded: {MAX_LLM_CALLS_PER_MINUTE}/min",
                    severity="rate_limited",
                    agent_name=agent_name,
                )],
            )

        self._llm_calls.append(now)
        return PolicyResult(allowed=True)

    def evaluate_notification(self, *, agent_name: str = "") -> PolicyResult:
        """Evalúa si se puede enviar una notificación."""
        now = time.time()
        self._notifications = [t for t in self._notifications if now - t < 3600]

        if len(self._notifications) >= MAX_NOTIFICATIONS_PER_HOUR:
            return PolicyResult(
                allowed=False,
                violations=[PolicyViolation(
                    action="send_notification",
                    reason=f"Notification rate limit: {MAX_NOTIFICATIONS_PER_HOUR}/hour",
                    severity="rate_limited",
                    agent_name=agent_name,
                )],
            )

        self._notifications.append(now)
        return PolicyResult(allowed=True)

    def evaluate_workflow(self, workflow_name: str, *, agent_name: str = "") -> PolicyResult:
        """Evalúa si se puede ejecutar un workflow."""
        now = time.time()
        self._workflow_runs = [t for t in self._workflow_runs if now - t < 3600]

        if len(self._workflow_runs) >= MAX_WORKFLOW_RUNS_PER_HOUR:
            return PolicyResult(
                allowed=False,
                violations=[PolicyViolation(
                    action=f"workflow:{workflow_name}",
                    reason=f"Workflow rate limit: {MAX_WORKFLOW_RUNS_PER_HOUR}/hour",
                    severity="rate_limited",
                    agent_name=agent_name,
                )],
            )

        self._workflow_runs.append(now)
        return PolicyResult(allowed=True)

    def get_allowed_tools(self, agent_mode: str = "suggest") -> list[str]:
        """Retorna lista de categorías de tools permitidas según el modo."""
        base = [
            "search_clientes", "get_cliente_detail", "list_clientes",
            "search_propiedades", "get_propiedad_detail",
            "list_citas", "list_tareas", "list_operaciones",
            "get_dashboard_metrics", "get_agent_metrics",
        ]

        if agent_mode == "suggest":
            base.extend([
                "create_tarea", "create_notification",
            ])
        elif agent_mode == "autonomous":
            base.extend([
                "create_tarea", "update_tarea_status",
                "create_cita", "update_cita",
                "create_notification", "create_cliente", "update_cliente",
            ])

        return base

    def get_stats(self) -> dict[str, Any]:
        """Estadísticas actuales del policy engine."""
        now = time.time()
        return {
            "tool_calls_last_min": len([t for t in self._tool_calls if now - t < 60]),
            "llm_calls_last_min": len([t for t in self._llm_calls if now - t < 60]),
            "notifications_last_hour": len([t for t in self._notifications if now - t < 3600]),
            "workflow_runs_last_hour": len([t for t in self._workflow_runs if now - t < 3600]),
            "limits": {
                "max_tool_calls_per_min": MAX_TOOL_CALLS_PER_MINUTE,
                "max_llm_calls_per_min": MAX_LLM_CALLS_PER_MINUTE,
                "max_notifications_per_hour": MAX_NOTIFICATIONS_PER_HOUR,
                "max_workflow_runs_per_hour": MAX_WORKFLOW_RUNS_PER_HOUR,
            },
        }


# Singleton
policy_engine = PolicyEngine()
