"""
Notification Tools — Envío de alertas y notificaciones.

Tools registradas:
  - send_notification: Enviar notificación a un agente
  - send_ai_suggestion: Enviar sugerencia de IA (prioridad baja)

Todas las notificaciones pasan por el backend via CRM client.
Rate limitadas por el Policy Engine.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from orchestrator.policy import policy_engine
from tools.crm_client import crm_client
from tools.registry import tool_registry


# ── Parameter Models ──────────────────────────────────────────────────────────

class SendNotificationParams(BaseModel):
    titulo: str = Field(..., description="Título de la notificación")
    mensaje: str = Field(..., description="Contenido de la notificación")
    destinatario_id: str = Field(..., description="ID del agente destinatario")
    prioridad: str = Field("media", description="Prioridad: baja, media, alta, urgente")
    tipo: str = Field("info", description="Tipo: info, warning, ai_suggestion, task_reminder")


class SendAISuggestionParams(BaseModel):
    titulo: str = Field(..., description="Título de la sugerencia")
    mensaje: str = Field(..., description="Contenido de la sugerencia")
    destinatario_id: str = Field("", description="ID del agente destinatario (vacío = todos)")
    suggested_action: Optional[str] = Field(None, description="Acción sugerida")
    agent_name: str = Field("system", description="Nombre del agente IA que genera la sugerencia")


# ── Tool Handlers ─────────────────────────────────────────────────────────────

async def _send_notification(
    titulo: str,
    mensaje: str,
    destinatario_id: str,
    prioridad: str = "media",
    tipo: str = "info",
):
    """Envía una notificación al backend."""
    # Evaluar política de rate limiting
    policy = policy_engine.evaluate_notification(agent_name="tool:send_notification")
    if not policy.allowed:
        return {"error": policy.reason, "sent": False}

    result = await crm_client.create_notification({
        "tipo": tipo,
        "titulo": titulo,
        "mensaje": mensaje,
        "prioridad": prioridad,
        "destinatarioId": destinatario_id,
    })

    return {"sent": True, "notification": result}


async def _send_ai_suggestion(
    titulo: str,
    mensaje: str,
    destinatario_id: str = "",
    suggested_action: str | None = None,
    agent_name: str = "system",
):
    """Envía una sugerencia de IA como notificación."""
    policy = policy_engine.evaluate_notification(agent_name=f"ai:{agent_name}")
    if not policy.allowed:
        return {"error": policy.reason, "sent": False}

    data = {
        "tipo": "ai_suggestion",
        "titulo": f"[IA] {titulo}",
        "mensaje": mensaje,
        "prioridad": "baja",
        "metadata": {
            "ai_agent": agent_name,
            "actionable": bool(suggested_action),
            "suggested_action": suggested_action or "",
        },
    }
    if destinatario_id:
        data["destinatarioId"] = destinatario_id

    result = await crm_client.create_notification(data)
    return {"sent": True, "notification": result}


# ── Registration ──────────────────────────────────────────────────────────────

def register_notification_tools() -> None:
    """Registra todas las notification tools en el registry global."""

    tool_registry.register(
        "send_notification",
        "Enviar una notificación a un agente inmobiliario",
        SendNotificationParams,
        _send_notification,
        category="notification",
        requires_approval=True,
        is_read_only=False,
    )

    tool_registry.register(
        "send_ai_suggestion",
        "Enviar una sugerencia generada por IA como notificación de baja prioridad",
        SendAISuggestionParams,
        _send_ai_suggestion,
        category="notification",
        requires_approval=False,
        is_read_only=False,
    )
