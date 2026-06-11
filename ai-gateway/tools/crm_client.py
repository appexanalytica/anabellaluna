"""
CRM Client — HTTP client para llamar el backend Node.js.

Toda operación del AI Gateway sobre el sistema CRM/ERP pasa por este client.
Nunca se accede a MongoDB directamente.

Usa X-Service-Key para autenticación interna servicio-a-servicio.
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

# ── Timeout y retry config ──────────────────────────────────────────────────

TIMEOUT = httpx.Timeout(connect=5.0, read=15.0, write=10.0, pool=5.0)
MAX_RETRIES = 2


class CRMClient:
    """Cliente HTTP async para la API del backend Node.js."""

    def __init__(self) -> None:
        self._client: httpx.AsyncClient | None = None

    async def start(self) -> None:
        self._client = httpx.AsyncClient(
            base_url=settings.backend_url,
            headers={
                "X-Service-Key": settings.internal_service_key,
                "X-Service-Name": "ai-gateway",
                "Content-Type": "application/json",
            },
            timeout=TIMEOUT,
        )
        logger.info("CRM client started — backend=%s", settings.backend_url)

    async def stop(self) -> None:
        if self._client:
            await self._client.aclose()
            self._client = None

    @property
    def client(self) -> httpx.AsyncClient:
        if not self._client:
            raise RuntimeError("CRM client not started — call start() first")
        return self._client

    # ── Generic request ─────────────────────────────────────────────────────

    async def _request(
        self,
        method: str,
        path: str,
        *,
        json: dict | None = None,
        params: dict | None = None,
    ) -> Any:
        """Ejecuta request HTTP al backend con retry y logging."""
        last_error: Exception | None = None

        for attempt in range(1, MAX_RETRIES + 1):
            try:
                response = await self.client.request(
                    method,
                    path,
                    json=json,
                    params={k: v for k, v in (params or {}).items() if v is not None},
                )
                response.raise_for_status()
                return response.json()
            except httpx.HTTPStatusError as e:
                logger.warning(
                    "Backend %s %s → %s (attempt %d/%d)",
                    method, path, e.response.status_code, attempt, MAX_RETRIES,
                )
                last_error = e
                # No retry en 4xx (error de request, no transitorio)
                if 400 <= e.response.status_code < 500:
                    break
            except httpx.RequestError as e:
                logger.warning(
                    "Backend %s %s — connection error: %s (attempt %d/%d)",
                    method, path, str(e), attempt, MAX_RETRIES,
                )
                last_error = e

        raise last_error  # type: ignore[misc]

    # ── Clientes ────────────────────────────────────────────────────────────

    async def search_clientes(
        self, *, query: str | None = None, agente_id: str | None = None, limit: int = 20
    ) -> list[dict]:
        params = {"q": query, "agenteId": agente_id, "limit": str(limit)}
        return await self._request("GET", "/crm/clientes", params=params)

    async def get_cliente(self, cliente_id: str) -> dict:
        return await self._request("GET", f"/crm/clientes/{cliente_id}")

    async def create_cliente(self, data: dict) -> dict:
        return await self._request("POST", "/crm/clientes", json=data)

    async def update_cliente(self, cliente_id: str, data: dict) -> dict:
        return await self._request("PUT", f"/crm/clientes/{cliente_id}", json=data)

    # ── Propiedades ─────────────────────────────────────────────────────────

    async def search_propiedades(
        self, *, query: str | None = None, agente_id: str | None = None, limit: int = 20
    ) -> list[dict]:
        params = {"q": query, "agentId": agente_id, "limit": str(limit)}
        return await self._request("GET", "/crm/propiedades", params=params)

    async def get_propiedad(self, propiedad_id: str) -> dict:
        return await self._request("GET", f"/crm/propiedades/{propiedad_id}")

    # ── Citas ───────────────────────────────────────────────────────────────

    async def list_citas(self, *, agente_id: str | None = None) -> list[dict]:
        params = {"agenteId": agente_id}
        return await self._request("GET", "/crm/citas", params=params)

    async def create_cita(self, data: dict) -> dict:
        return await self._request("POST", "/crm/citas", json=data)

    # ── Tareas ──────────────────────────────────────────────────────────────

    async def list_tareas(self, *, agente_id: str | None = None, status: str | None = None) -> list[dict]:
        params = {"agenteId": agente_id, "status": status}
        return await self._request("GET", "/crm/tareas", params=params)

    async def create_tarea(self, data: dict) -> dict:
        return await self._request("POST", "/crm/tareas", json=data)

    # ── Operaciones ─────────────────────────────────────────────────────────

    async def list_operaciones(self, *, agente_id: str | None = None) -> list[dict]:
        params = {"agenteId": agente_id}
        return await self._request("GET", "/crm/operaciones", params=params)

    # ── Dashboard / Métricas ────────────────────────────────────────────────

    async def get_dashboard_stats(self) -> dict:
        return await self._request("GET", "/admin/stats")

    async def get_agent_dashboard_stats(self, agente_id: str) -> dict:
        return await self._request("GET", "/crm/stats", params={"agenteId": agente_id})

    # ── Notificaciones ──────────────────────────────────────────────────────

    async def list_notifications(
        self, *, tipo: str | None = None, leida: bool | None = None, limite: int = 50
    ) -> dict:
        params: dict = {"limite": str(limite)}
        if tipo:
            params["tipo"] = tipo
        if leida is not None:
            params["leida"] = str(leida).lower()
        return await self._request("GET", "/crm/notifications", params=params)

    async def create_notification(self, data: dict) -> dict:
        return await self._request("POST", "/crm/notifications", json=data)

    # ── Agentes ─────────────────────────────────────────────────────────────

    async def list_agentes(self) -> list[dict]:
        return await self._request("GET", "/crm/agentes")

    # ── Health check ────────────────────────────────────────────────────────

    async def health(self) -> bool:
        try:
            await self._request("GET", "/health")
            return True
        except Exception:
            return False


# Singleton
crm_client = CRMClient()
