"""
Hot Lead Workflow — Detecta leads calientes sin respuesta.

Flujo:
  1. Consulta leads recientes (<48h)
  2. Verifica si tienen seguimiento (tareas, citas, notas)
  3. Genera alerta urgente para leads sin contacto
  4. Prioriza por data de contacto disponible

Schedule: Cada 4 horas.
"""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from tools.crm_client import crm_client
from workflows.engine import BaseWorkflow, WorkflowResult, WorkflowStatus

logger = logging.getLogger(__name__)

HOT_LEAD_HOURS = 48  # Leads creados en las últimas 48h
STALE_HOURS = 12     # Sin seguimiento en >12h = alerta


class HotLeadWorkflow(BaseWorkflow):
    name = "hot_lead_no_response"
    description = "Detecta leads calientes sin respuesta en las primeras 48 horas"
    schedule = "0 */4 * * *"  # Cada 4 horas
    timeout_seconds = 60

    async def run(self) -> WorkflowResult:
        """Detecta leads calientes sin seguimiento."""
        # 1. Obtener leads recientes
        try:
            clientes = await crm_client.search_clientes(limit=50)
        except Exception as e:
            return WorkflowResult(
                workflow_name=self.name,
                status=WorkflowStatus.FAILED,
                error=f"Cannot fetch clients: {e}",
            )

        # 2. Filtrar leads recientes sin seguimiento
        now = datetime.now(timezone.utc)
        hot_leads = []

        for c in clientes:
            created = c.get("createdAt")
            if not created:
                continue

            try:
                created_dt = datetime.fromisoformat(str(created).replace("Z", "+00:00"))
                hours_since_creation = (now - created_dt).total_seconds() / 3600

                if hours_since_creation > HOT_LEAD_HOURS:
                    continue  # No es un lead reciente

                # Verificar si tiene seguimiento
                updated = c.get("updatedAt")
                if updated:
                    updated_dt = datetime.fromisoformat(str(updated).replace("Z", "+00:00"))
                    hours_since_update = (now - updated_dt).total_seconds() / 3600
                else:
                    hours_since_update = hours_since_creation

                # Si no fue actualizado después de la creación, es un lead sin seguimiento
                if hours_since_update >= STALE_HOURS:
                    hot_leads.append({
                        **c,
                        "_hours_since_creation": round(hours_since_creation, 1),
                        "_hours_since_update": round(hours_since_update, 1),
                        "_contactable": bool(c.get("email") or c.get("telefono")),
                    })

            except (ValueError, TypeError):
                continue

        if not hot_leads:
            return WorkflowResult(
                workflow_name=self.name,
                status=WorkflowStatus.COMPLETED,
                items_processed=len(clientes),
                items_detected=0,
            )

        # Priorizar: contactables primero, luego por tiempo
        hot_leads.sort(key=lambda x: (not x["_contactable"], -x["_hours_since_creation"]))

        # 3. Generar alertas
        actions = []
        notifications_sent = 0

        for lead in hot_leads[:15]:
            nombre = lead.get("nombre", "Lead sin nombre")
            agent_id = lead.get("agenteId", "")
            hours = lead["_hours_since_creation"]
            contactable = lead["_contactable"]

            priority = "alta" if contactable and hours > 24 else "media"

            contact_info = []
            if lead.get("telefono"):
                contact_info.append(f"Tel: {lead['telefono']}")
            if lead.get("email"):
                contact_info.append(f"Email: {lead['email']}")
            contact_str = " | ".join(contact_info) if contact_info else "Sin datos de contacto"

            try:
                await crm_client.create_notification({
                    "tipo": "ai_suggestion",
                    "titulo": f"[IA] Lead sin seguimiento: {nombre} ({hours:.0f}h)",
                    "mensaje": (
                        f"Este lead fue creado hace {hours:.0f} horas y no tiene seguimiento.\n"
                        f"Contacto: {contact_str}\n\n"
                        f"Sugerencia: {'Llamar o enviar WhatsApp inmediatamente' if contactable else 'Revisar datos de contacto'}"
                    ),
                    "prioridad": priority,
                    "destinatarioId": agent_id,
                    "metadata": {
                        "ai_agent": "workflow:hot_lead",
                        "client_id": lead.get("_id", ""),
                        "hours_since_creation": hours,
                        "contactable": contactable,
                        "actionable": True,
                        "suggested_action": "Contactar al lead",
                    },
                })
                notifications_sent += 1
                actions.append({
                    "type": "hot_lead_alert",
                    "client_id": lead.get("_id", ""),
                    "hours_since_creation": hours,
                    "agent_id": agent_id,
                })
            except Exception as e:
                self.logger.warning("Failed to send hot lead alert for %s: %s", lead.get("_id"), e)

        return WorkflowResult(
            workflow_name=self.name,
            status=WorkflowStatus.COMPLETED,
            items_processed=len(clientes),
            items_detected=len(hot_leads),
            actions_taken=actions,
            notifications_sent=notifications_sent,
        )
