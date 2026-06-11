"""
Inactive Property Workflow — Detecta propiedades publicadas sin actividad.

Flujo:
  1. Consulta propiedades publicadas
  2. Filtra las que llevan >30 días sin actualización
  3. Genera notificaciones al agente responsable
  4. Sugiere acciones: ajustar precio, mejorar fotos, republicar

Schedule: Diario a las 9 AM.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from tools.crm_client import crm_client
from workflows.engine import BaseWorkflow, WorkflowResult, WorkflowStatus

logger = logging.getLogger(__name__)

INACTIVE_DAYS_THRESHOLD = 30
CRITICAL_DAYS_THRESHOLD = 60


class InactivePropertyWorkflow(BaseWorkflow):
    name = "inactive_property_detection"
    description = "Detecta propiedades publicadas sin actividad y notifica al agente responsable"
    schedule = "0 9 * * *"  # Diario a las 9 AM
    timeout_seconds = 90

    async def run(self) -> WorkflowResult:
        """Ejecuta la detección de propiedades inactivas."""
        # 1. Obtener propiedades
        try:
            propiedades = await crm_client.search_propiedades(limit=100)
        except Exception as e:
            return WorkflowResult(
                workflow_name=self.name,
                status=WorkflowStatus.FAILED,
                error=f"Cannot fetch properties: {e}",
            )

        # 2. Filtrar publicadas e inactivas
        now = datetime.now(timezone.utc)
        inactive = []

        for p in propiedades:
            if not p.get("publicada", False):
                continue

            updated = p.get("updatedAt") or p.get("createdAt")
            if not updated:
                continue

            try:
                updated_dt = datetime.fromisoformat(str(updated).replace("Z", "+00:00"))
                days_inactive = (now - updated_dt).days
                if days_inactive >= INACTIVE_DAYS_THRESHOLD:
                    inactive.append({**p, "_days_inactive": days_inactive})
            except (ValueError, TypeError):
                continue

        if not inactive:
            return WorkflowResult(
                workflow_name=self.name,
                status=WorkflowStatus.COMPLETED,
                items_processed=len(propiedades),
                items_detected=0,
            )

        # Ordenar por más inactivas primero
        inactive.sort(key=lambda x: x.get("_days_inactive", 0), reverse=True)

        # 3. Generar notificaciones
        actions = []
        notifications_sent = 0

        for prop in inactive[:20]:  # Máximo 20 notificaciones
            days = prop.get("_days_inactive", 0)
            titulo = prop.get("titulo", prop.get("direccion", "Sin título"))
            agent_id = prop.get("agentId", "")
            is_critical = days >= CRITICAL_DAYS_THRESHOLD

            suggestion = self._get_suggestion(prop, days)

            try:
                await crm_client.create_notification({
                    "tipo": "ai_suggestion",
                    "titulo": f"[IA] Propiedad {'CRÍTICA' if is_critical else 'inactiva'}: {titulo}",
                    "mensaje": (
                        f"Esta propiedad lleva {days} días sin actividad.\n\n"
                        f"Sugerencia: {suggestion}"
                    ),
                    "prioridad": "alta" if is_critical else "media",
                    "destinatarioId": agent_id,
                    "metadata": {
                        "ai_agent": "workflow:inactive_property",
                        "property_id": prop.get("_id", ""),
                        "days_inactive": days,
                        "actionable": True,
                        "suggested_action": suggestion,
                    },
                })
                notifications_sent += 1
                actions.append({
                    "type": "notification_sent",
                    "property_id": prop.get("_id", ""),
                    "days_inactive": days,
                    "agent_id": agent_id,
                })
            except Exception as e:
                self.logger.warning("Failed to send notification for property %s: %s", prop.get("_id"), e)

        return WorkflowResult(
            workflow_name=self.name,
            status=WorkflowStatus.COMPLETED,
            items_processed=len(propiedades),
            items_detected=len(inactive),
            actions_taken=actions,
            notifications_sent=notifications_sent,
        )

    def _get_suggestion(self, prop: dict, days_inactive: int) -> str:
        """Genera sugerencia contextual según el estado de la propiedad."""
        suggestions = []

        fotos = len(prop.get("fotos", []))
        if fotos < 3:
            suggestions.append("Agregar más fotos de calidad")

        if not prop.get("descripcion"):
            suggestions.append("Agregar descripción detallada")

        if days_inactive > CRITICAL_DAYS_THRESHOLD:
            suggestions.append("Considerar ajuste de precio")
            suggestions.append("Republicar con mejoras en el listing")
        else:
            suggestions.append("Revisar el precio comparado con propiedades similares")

        return ". ".join(suggestions) if suggestions else "Revisar y actualizar el listing"
