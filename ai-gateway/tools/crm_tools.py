"""
CRM Tools — Definiciones de tools para operaciones del CRM.

Tools registradas:
  - search_clientes: Buscar clientes
  - get_cliente_detail: Detalle de un cliente
  - create_cliente: Crear cliente (requires_approval)
  - update_cliente: Actualizar cliente (requires_approval)
  - list_tareas: Listar tareas
  - create_tarea: Crear tarea (requires_approval)
  - list_citas: Listar citas
  - create_cita: Crear cita (requires_approval)
  - list_operaciones: Listar operaciones

Todas las operaciones pasan por el CRM client HTTP — nunca acceso directo a MongoDB.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from tools.crm_client import crm_client
from tools.registry import tool_registry


# ── Parameter Models ──────────────────────────────────────────────────────────

class SearchClientesParams(BaseModel):
    query: Optional[str] = Field(None, description="Texto de búsqueda (nombre, email, teléfono)")
    agente_id: Optional[str] = Field(None, description="Filtrar por agente asignado")
    limit: int = Field(20, description="Máximo de resultados", ge=1, le=100)


class GetClienteParams(BaseModel):
    cliente_id: str = Field(..., description="ID del cliente")


class CreateClienteParams(BaseModel):
    nombre: str = Field(..., description="Nombre completo del cliente")
    email: Optional[str] = Field(None, description="Email del cliente")
    telefono: Optional[str] = Field(None, description="Teléfono del cliente")
    direccion: Optional[str] = Field(None, description="Dirección del cliente")
    notas: Optional[str] = Field(None, description="Notas sobre el cliente")
    agente_id: Optional[str] = Field(None, description="ID del agente a asignar")


class UpdateClienteParams(BaseModel):
    cliente_id: str = Field(..., description="ID del cliente a actualizar")
    nombre: Optional[str] = Field(None, description="Nuevo nombre")
    email: Optional[str] = Field(None, description="Nuevo email")
    telefono: Optional[str] = Field(None, description="Nuevo teléfono")
    notas: Optional[str] = Field(None, description="Notas actualizadas")


class ListTareasParams(BaseModel):
    agente_id: Optional[str] = Field(None, description="Filtrar por agente asignado")
    status: Optional[str] = Field(None, description="Filtrar por estado: pendiente, en_progreso, completada")


class CreateTareaParams(BaseModel):
    title: str = Field(..., description="Título de la tarea")
    description: Optional[str] = Field(None, description="Descripción detallada")
    assignee_id: Optional[str] = Field(None, description="ID del agente asignado")
    due_date: Optional[str] = Field(None, description="Fecha de vencimiento (ISO 8601)")
    priority: str = Field("media", description="Prioridad: baja, media, alta, urgente")


class ListCitasParams(BaseModel):
    agente_id: Optional[str] = Field(None, description="Filtrar por agente")


class CreateCitaParams(BaseModel):
    cliente_id: str = Field(..., description="ID del cliente")
    propiedad_id: Optional[str] = Field(None, description="ID de la propiedad a visitar")
    fecha: str = Field(..., description="Fecha y hora (ISO 8601)")
    tipo: str = Field("visita", description="Tipo: visita, reunión, llamada")
    notas: Optional[str] = Field(None, description="Notas sobre la cita")
    agente_id: Optional[str] = Field(None, description="ID del agente")


class ListOperacionesParams(BaseModel):
    agente_id: Optional[str] = Field(None, description="Filtrar por agente")


# ── Tool Handlers ─────────────────────────────────────────────────────────────

async def _search_clientes(query: str | None = None, agente_id: str | None = None, limit: int = 20):
    return await crm_client.search_clientes(query=query, agente_id=agente_id, limit=limit)


async def _get_cliente_detail(cliente_id: str):
    return await crm_client.get_cliente(cliente_id)


async def _create_cliente(
    nombre: str,
    email: str | None = None,
    telefono: str | None = None,
    direccion: str | None = None,
    notas: str | None = None,
    agente_id: str | None = None,
):
    data = {"nombre": nombre}
    if email:
        data["email"] = email
    if telefono:
        data["telefono"] = telefono
    if direccion:
        data["direccion"] = direccion
    if notas:
        data["notas"] = notas
    if agente_id:
        data["agenteId"] = agente_id
    return await crm_client.create_cliente(data)


async def _update_cliente(
    cliente_id: str,
    nombre: str | None = None,
    email: str | None = None,
    telefono: str | None = None,
    notas: str | None = None,
):
    data = {}
    if nombre:
        data["nombre"] = nombre
    if email:
        data["email"] = email
    if telefono:
        data["telefono"] = telefono
    if notas:
        data["notas"] = notas
    return await crm_client.update_cliente(cliente_id, data)


async def _list_tareas(agente_id: str | None = None, status: str | None = None):
    return await crm_client.list_tareas(agente_id=agente_id, status=status)


async def _create_tarea(
    title: str,
    description: str | None = None,
    assignee_id: str | None = None,
    due_date: str | None = None,
    priority: str = "media",
):
    data = {"title": title, "priority": priority}
    if description:
        data["description"] = description
    if assignee_id:
        data["assigneeId"] = assignee_id
    if due_date:
        data["dueDate"] = due_date
    return await crm_client.create_tarea(data)


async def _list_citas(agente_id: str | None = None):
    return await crm_client.list_citas(agente_id=agente_id)


async def _create_cita(
    cliente_id: str,
    fecha: str,
    tipo: str = "visita",
    propiedad_id: str | None = None,
    notas: str | None = None,
    agente_id: str | None = None,
):
    data = {"clienteId": cliente_id, "fecha": fecha, "tipo": tipo}
    if propiedad_id:
        data["propiedadId"] = propiedad_id
    if notas:
        data["notas"] = notas
    if agente_id:
        data["agenteId"] = agente_id
    return await crm_client.create_cita(data)


async def _list_operaciones(agente_id: str | None = None):
    return await crm_client.list_operaciones(agente_id=agente_id)


# ── Registration ──────────────────────────────────────────────────────────────

def register_crm_tools() -> None:
    """Registra todas las CRM tools en el registry global."""

    tool_registry.register(
        "search_clientes",
        "Buscar clientes por nombre, email o teléfono",
        SearchClientesParams,
        _search_clientes,
        category="crm",
        is_read_only=True,
    )

    tool_registry.register(
        "get_cliente_detail",
        "Obtener datos completos de un cliente por su ID",
        GetClienteParams,
        _get_cliente_detail,
        category="crm",
        is_read_only=True,
    )

    tool_registry.register(
        "create_cliente",
        "Crear un nuevo cliente/lead en el CRM",
        CreateClienteParams,
        _create_cliente,
        category="crm",
        requires_approval=True,
        is_read_only=False,
    )

    tool_registry.register(
        "update_cliente",
        "Actualizar datos de un cliente existente",
        UpdateClienteParams,
        _update_cliente,
        category="crm",
        requires_approval=True,
        is_read_only=False,
    )

    tool_registry.register(
        "list_tareas",
        "Listar tareas pendientes, opcionalmente filtradas por agente o estado",
        ListTareasParams,
        _list_tareas,
        category="crm",
        is_read_only=True,
    )

    tool_registry.register(
        "create_tarea",
        "Crear una nueva tarea asignada a un agente",
        CreateTareaParams,
        _create_tarea,
        category="crm",
        requires_approval=True,
        is_read_only=False,
    )

    tool_registry.register(
        "list_citas",
        "Listar citas programadas, opcionalmente filtradas por agente",
        ListCitasParams,
        _list_citas,
        category="crm",
        is_read_only=True,
    )

    tool_registry.register(
        "create_cita",
        "Agendar una nueva cita (visita, reunión o llamada)",
        CreateCitaParams,
        _create_cita,
        category="crm",
        requires_approval=True,
        is_read_only=False,
    )

    tool_registry.register(
        "list_operaciones",
        "Listar operaciones inmobiliarias (ventas, alquileres)",
        ListOperacionesParams,
        _list_operaciones,
        category="crm",
        is_read_only=True,
    )
