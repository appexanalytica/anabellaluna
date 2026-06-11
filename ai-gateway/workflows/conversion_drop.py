"""
Conversion Drop Workflow — Detecta caídas en la tasa de conversión.

Flujo:
  1. Calcula tasa de conversión actual (leads → operaciones cerradas)
  2. Compara con historial (últimos 30 días)
  3. Si hay caída significativa (>20%), genera alerta
  4. Identifica posibles causas (leads sin seguimiento, tareas vencidas)

Schedule: Semanal, lunes a las 7 AM.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from memory.semantic import record_metric, get_metric_history
from tools.crm_client import crm_client
from workflows.engine import BaseWorkflow, WorkflowResult, WorkflowStatus

logger = logging.getLogger(__name__)

CONVERSION_DROP_THRESHOLD = 0.20  # 20% de caída para alertar


class ConversionDropWorkflow(BaseWorkflow):
    name = "conversion_drop_detection"
    description = "Detecta caídas significativas en la tasa de conversión"
    schedule = "0 7 * * 1"  # Lunes a las 7 AM
    timeout_seconds = 90

    async def run(self) -> WorkflowResult:
        """Analiza tendencia de conversión y alerta si hay caída."""
        # 1. Obtener datos actuales
        try:
            clientes = await crm_client.search_clientes(limit=100)
            operaciones = await crm_client.list_operaciones()
            dashboard = await crm_client.get_dashboard_stats()
        except Exception as e:
            return WorkflowResult(
                workflow_name=self.name,
                status=WorkflowStatus.FAILED,
                error=f"Cannot fetch CRM data: {e}",
            )

        # 2. Calcular tasa de conversión actual
        total_leads = len(clientes)
        closed_deals = len([
            op for op in operaciones
            if op.get("estado") in ("cerrada", "cerrado_ganado", "finalizada")
        ])

        current_rate = (closed_deals / total_leads * 100) if total_leads > 0 else 0

        # 3. Registrar métrica actual
        try:
            await record_metric(
                "conversion_rate",
                current_rate,
                metadata={
                    "total_leads": total_leads,
                    "closed_deals": closed_deals,
                },
            )
        except Exception as e:
            self.logger.warning("Failed to record metric: %s", e)

        # 4. Obtener historial para comparar
        try:
            history = await get_metric_history("conversion_rate", days=60, limit=10)
        except Exception:
            history = []

        # 5. Detectar caída
        previous_rates = [h["value"] for h in history if h.get("value")]
        avg_previous = sum(previous_rates) / len(previous_rates) if previous_rates else current_rate

        drop_detected = False
        drop_percentage = 0.0

        if avg_previous > 0 and current_rate < avg_previous:
            drop_percentage = (avg_previous - current_rate) / avg_previous
            drop_detected = drop_percentage >= CONVERSION_DROP_THRESHOLD

        # 6. Identificar posibles causas
        causes = self._identify_causes(clientes, operaciones, dashboard)

        actions = []
        notifications_sent = 0

        if drop_detected:
            # Generar alerta
            try:
                await crm_client.create_notification({
                    "tipo": "ai_suggestion",
                    "titulo": f"[IA] Caída de conversión detectada: {drop_percentage:.0%}",
                    "mensaje": (
                        f"La tasa de conversión actual ({current_rate:.1f}%) está "
                        f"{drop_percentage:.0%} por debajo del promedio histórico ({avg_previous:.1f}%).\n\n"
                        f"Posibles causas:\n"
                        + "\n".join(f"- {c}" for c in causes[:5])
                        + "\n\nSugerencia: Revisar pipeline y seguimiento de leads activos."
                    ),
                    "prioridad": "alta",
                    "metadata": {
                        "ai_agent": "workflow:conversion_drop",
                        "current_rate": round(current_rate, 2),
                        "average_rate": round(avg_previous, 2),
                        "drop_percentage": round(drop_percentage * 100, 1),
                        "actionable": True,
                        "suggested_action": "Revisar pipeline de conversión",
                    },
                })
                notifications_sent += 1
                actions.append({
                    "type": "conversion_drop_alert",
                    "current_rate": round(current_rate, 2),
                    "average_rate": round(avg_previous, 2),
                    "drop_percentage": round(drop_percentage * 100, 1),
                    "causes": causes[:5],
                })
            except Exception as e:
                self.logger.warning("Failed to send conversion drop alert: %s", e)

        return WorkflowResult(
            workflow_name=self.name,
            status=WorkflowStatus.COMPLETED,
            items_processed=total_leads,
            items_detected=1 if drop_detected else 0,
            actions_taken=actions,
            notifications_sent=notifications_sent,
        )

    def _identify_causes(
        self,
        clientes: list[dict],
        operaciones: list[dict],
        dashboard: dict,
    ) -> list[str]:
        """Identifica posibles causas de caída en conversión."""
        causes = []
        now = datetime.now(timezone.utc)

        # Leads sin seguimiento
        stale_count = 0
        for c in clientes:
            updated = c.get("updatedAt") or c.get("createdAt")
            if updated:
                try:
                    updated_dt = datetime.fromisoformat(str(updated).replace("Z", "+00:00"))
                    if (now - updated_dt).days > 7:
                        stale_count += 1
                except (ValueError, TypeError):
                    pass
        if stale_count > 5:
            causes.append(f"{stale_count} leads sin seguimiento en más de 7 días")

        # Tareas vencidas
        overdue = dashboard.get("tareasVencidas", 0)
        if overdue > 3:
            causes.append(f"{overdue} tareas vencidas pendientes")

        # Leads sin datos de contacto
        no_contact = len([c for c in clientes if not c.get("email") and not c.get("telefono")])
        if no_contact > 5:
            causes.append(f"{no_contact} leads sin datos de contacto")

        # Operaciones estancadas
        stalled_ops = len([
            op for op in operaciones
            if op.get("estado") in ("en_negociacion", "propuesta")
        ])
        if stalled_ops > 3:
            causes.append(f"{stalled_ops} operaciones en negociación/propuesta sin avance")

        if not causes:
            causes.append("No se identificaron causas claras — revisar manualmente")

        return causes
