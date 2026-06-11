"""
Workflow Engine — Motor de workflows autónomos.

Ejecuta flujos de trabajo multi-paso con:
  - Persistencia de estado en PostgreSQL (workflow_state)
  - Retry automático en caso de fallo
  - Timeout configurable
  - Auditoría completa en Langfuse

Los workflows se registran y se ejecutan periódicamente o por eventos.
Cada workflow define su propia lógica de detección y acción.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any
from uuid import uuid4

from memory.semantic import _get_pool
from observability.langfuse_client import trace_agent
from orchestrator.policy import policy_engine

logger = logging.getLogger(__name__)


class WorkflowStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    PAUSED = "paused"


@dataclass
class WorkflowResult:
    """Resultado de la ejecución de un workflow."""

    workflow_name: str
    status: WorkflowStatus
    items_processed: int = 0
    items_detected: int = 0
    actions_taken: list[dict[str, Any]] = field(default_factory=list)
    notifications_sent: int = 0
    error: str | None = None
    duration_ms: int = 0


class BaseWorkflow(ABC):
    """Clase base para workflows autónomos."""

    name: str = "base_workflow"
    description: str = ""
    schedule: str | None = None  # cron expression
    max_retries: int = 2
    timeout_seconds: int = 120

    def __init__(self) -> None:
        self.logger = logging.getLogger(f"workflow.{self.name}")

    async def execute(self) -> WorkflowResult:
        """
        Ejecuta el workflow completo con tracking y policy enforcement.
        """
        # Evaluar política
        policy = policy_engine.evaluate_workflow(self.name)
        if not policy.allowed:
            return WorkflowResult(
                workflow_name=self.name,
                status=WorkflowStatus.FAILED,
                error=policy.reason,
            )

        start = time.monotonic()

        async with trace_agent(f"workflow:{self.name}", tags=["workflow"]) as trace:
            trace.log_input(f"Executing workflow: {self.name}")

            # Guardar estado inicial
            run_id = str(uuid4())
            await self._save_state(run_id, WorkflowStatus.RUNNING)

            try:
                result = await asyncio.wait_for(
                    self.run(),
                    timeout=self.timeout_seconds,
                )
                result.duration_ms = int((time.monotonic() - start) * 1000)

                await self._save_state(run_id, result.status, result=result)
                trace.log_output(
                    f"Workflow completed: detected={result.items_detected} "
                    f"actions={len(result.actions_taken)} duration={result.duration_ms}ms"
                )

                return result

            except asyncio.TimeoutError:
                error = f"Workflow timed out after {self.timeout_seconds}s"
                self.logger.error(error)
                trace.log_error(error)
                await self._save_state(run_id, WorkflowStatus.FAILED, error=error)
                return WorkflowResult(
                    workflow_name=self.name,
                    status=WorkflowStatus.FAILED,
                    error=error,
                    duration_ms=int((time.monotonic() - start) * 1000),
                )

            except Exception as e:
                error = str(e)
                self.logger.exception("Workflow %s failed", self.name)
                trace.log_error(error)
                await self._save_state(run_id, WorkflowStatus.FAILED, error=error)
                return WorkflowResult(
                    workflow_name=self.name,
                    status=WorkflowStatus.FAILED,
                    error=error,
                    duration_ms=int((time.monotonic() - start) * 1000),
                )

    @abstractmethod
    async def run(self) -> WorkflowResult:
        """Lógica principal del workflow — implementar en subclases."""
        ...

    async def _save_state(
        self,
        run_id: str,
        status: WorkflowStatus,
        *,
        result: WorkflowResult | None = None,
        error: str | None = None,
    ) -> None:
        """Persiste el estado del workflow en PostgreSQL."""
        try:
            pool = _get_pool()
            state_data = {}
            if result:
                state_data = {
                    "items_processed": result.items_processed,
                    "items_detected": result.items_detected,
                    "actions_taken": len(result.actions_taken),
                    "notifications_sent": result.notifications_sent,
                }

            await pool.execute(
                """
                INSERT INTO workflow_state (id, workflow_name, status, state_data, error)
                VALUES ($1, $2, $3, $4::jsonb, $5)
                ON CONFLICT (id) DO UPDATE SET
                    status = $3, state_data = $4::jsonb, error = $5, updated_at = NOW()
                """,
                run_id,
                self.name,
                status.value,
                json.dumps(state_data),
                error,
            )
        except Exception as e:
            self.logger.warning("Failed to save workflow state: %s", e)


class WorkflowEngine:
    """Motor que gestiona y ejecuta workflows registrados."""

    def __init__(self) -> None:
        self._workflows: dict[str, BaseWorkflow] = {}
        self._running = False

    def register(self, workflow: BaseWorkflow) -> None:
        """Registra un workflow."""
        self._workflows[workflow.name] = workflow
        logger.info("Registered workflow: %s", workflow.name)

    def get(self, name: str) -> BaseWorkflow | None:
        return self._workflows.get(name)

    def list_workflows(self) -> list[dict[str, Any]]:
        """Lista todos los workflows registrados."""
        return [
            {
                "name": w.name,
                "description": w.description,
                "schedule": w.schedule,
                "max_retries": w.max_retries,
                "timeout_seconds": w.timeout_seconds,
            }
            for w in self._workflows.values()
        ]

    async def run_workflow(self, name: str) -> WorkflowResult:
        """Ejecuta un workflow por nombre."""
        workflow = self._workflows.get(name)
        if not workflow:
            return WorkflowResult(
                workflow_name=name,
                status=WorkflowStatus.FAILED,
                error=f"Workflow '{name}' not found",
            )
        return await workflow.execute()

    async def run_all_scheduled(self) -> list[WorkflowResult]:
        """Ejecuta todos los workflows con schedule."""
        results = []
        for workflow in self._workflows.values():
            if workflow.schedule:
                result = await workflow.execute()
                results.append(result)
        return results

    async def get_recent_runs(self, workflow_name: str | None = None, limit: int = 10) -> list[dict]:
        """Consulta ejecuciones recientes desde PostgreSQL."""
        try:
            pool = _get_pool()
            if workflow_name:
                rows = await pool.fetch(
                    """
                    SELECT id, workflow_name, status, state_data, error, created_at, updated_at
                    FROM workflow_state
                    WHERE workflow_name = $1
                    ORDER BY created_at DESC LIMIT $2
                    """,
                    workflow_name, limit,
                )
            else:
                rows = await pool.fetch(
                    """
                    SELECT id, workflow_name, status, state_data, error, created_at, updated_at
                    FROM workflow_state
                    ORDER BY created_at DESC LIMIT $1
                    """,
                    limit,
                )
            return [
                {
                    "id": str(row["id"]),
                    "workflow_name": row["workflow_name"],
                    "status": row["status"],
                    "state_data": row["state_data"],
                    "error": row["error"],
                    "created_at": row["created_at"].isoformat() if row["created_at"] else None,
                    "updated_at": row["updated_at"].isoformat() if row["updated_at"] else None,
                }
                for row in rows
            ]
        except Exception as e:
            logger.warning("Failed to query workflow runs: %s", e)
            return []


# Singleton
workflow_engine = WorkflowEngine()
