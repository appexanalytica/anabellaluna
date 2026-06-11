"""
Property Tools — Definiciones de tools para operaciones con propiedades.

Tools registradas:
  - search_propiedades: Buscar propiedades
  - get_propiedad_detail: Detalle de una propiedad
  - get_propiedades_por_zona: Propiedades agrupadas por zona
  - compare_propiedades: Comparar 2-3 propiedades

Todas las operaciones pasan por el CRM client HTTP.
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field

from tools.crm_client import crm_client
from tools.registry import tool_registry


# ── Parameter Models ──────────────────────────────────────────────────────────

class SearchPropiedadesParams(BaseModel):
    query: Optional[str] = Field(None, description="Texto de búsqueda (dirección, tipo, zona)")
    agente_id: Optional[str] = Field(None, description="Filtrar por agente")
    limit: int = Field(20, description="Máximo de resultados", ge=1, le=100)


class GetPropiedadParams(BaseModel):
    propiedad_id: str = Field(..., description="ID de la propiedad")


class PropiedadesPorZonaParams(BaseModel):
    limit: int = Field(50, description="Máximo de propiedades a analizar", ge=1, le=200)


class ComparePropiedadesParams(BaseModel):
    propiedad_ids: list[str] = Field(
        ...,
        description="Lista de IDs de propiedades a comparar (2-5)",
        min_length=2,
        max_length=5,
    )


# ── Tool Handlers ─────────────────────────────────────────────────────────────

async def _search_propiedades(
    query: str | None = None,
    agente_id: str | None = None,
    limit: int = 20,
):
    return await crm_client.search_propiedades(query=query, agente_id=agente_id, limit=limit)


async def _get_propiedad_detail(propiedad_id: str):
    return await crm_client.get_propiedad(propiedad_id)


async def _get_propiedades_por_zona(limit: int = 50):
    """Agrupa propiedades activas por zona/barrio."""
    propiedades = await crm_client.search_propiedades(limit=limit)

    by_zone: dict[str, list[dict]] = {}
    for p in propiedades:
        zone = p.get("barrio") or p.get("zona") or p.get("localidad", "Sin zona")
        by_zone.setdefault(zone, []).append({
            "id": p.get("_id", ""),
            "titulo": p.get("titulo", p.get("direccion", "Sin título")),
            "tipo": p.get("tipoPropiedad", "?"),
            "precio": p.get("precio", 0),
            "moneda": p.get("moneda", "USD"),
            "publicada": p.get("publicada", False),
        })

    return {
        zone: {
            "count": len(props),
            "avg_price": sum(p["precio"] for p in props if p["precio"]) / max(1, len([p for p in props if p["precio"]])),
            "properties": props,
        }
        for zone, props in sorted(by_zone.items(), key=lambda x: -len(x[1]))
    }


async def _compare_propiedades(propiedad_ids: list[str]):
    """Compara propiedades lado a lado."""
    results = []
    for pid in propiedad_ids:
        try:
            prop = await crm_client.get_propiedad(pid)
            results.append({
                "id": pid,
                "titulo": prop.get("titulo", prop.get("direccion", "")),
                "tipo": prop.get("tipoPropiedad", ""),
                "operacion": prop.get("tipoOperacion", ""),
                "precio": prop.get("precio", 0),
                "moneda": prop.get("moneda", "USD"),
                "superficie_total": prop.get("superficieTotal", 0),
                "superficie_cubierta": prop.get("superficieCubierta", 0),
                "ambientes": prop.get("ambientes", 0),
                "dormitorios": prop.get("dormitorios", 0),
                "banos": prop.get("banos", 0),
                "cochera": prop.get("cochera", False),
                "zona": prop.get("barrio") or prop.get("zona", ""),
                "publicada": prop.get("publicada", False),
                "fotos": len(prop.get("fotos", [])),
            })
        except Exception:
            results.append({"id": pid, "error": "No se pudo obtener la propiedad"})

    return {"comparison": results, "count": len(results)}


# ── Registration ──────────────────────────────────────────────────────────────

def register_property_tools() -> None:
    """Registra todas las property tools en el registry global."""

    tool_registry.register(
        "search_propiedades",
        "Buscar propiedades por dirección, tipo, zona u otros criterios",
        SearchPropiedadesParams,
        _search_propiedades,
        category="property",
        is_read_only=True,
    )

    tool_registry.register(
        "get_propiedad_detail",
        "Obtener datos completos de una propiedad por su ID",
        GetPropiedadParams,
        _get_propiedad_detail,
        category="property",
        is_read_only=True,
    )

    tool_registry.register(
        "get_propiedades_por_zona",
        "Obtener propiedades agrupadas por zona/barrio con precio promedio",
        PropiedadesPorZonaParams,
        _get_propiedades_por_zona,
        category="property",
        is_read_only=True,
    )

    tool_registry.register(
        "compare_propiedades",
        "Comparar 2-5 propiedades lado a lado (precio, superficie, características)",
        ComparePropiedadesParams,
        _compare_propiedades,
        category="property",
        is_read_only=True,
    )
