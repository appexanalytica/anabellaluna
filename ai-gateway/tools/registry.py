"""
Tool Registry — Registro centralizado de tools con schemas Pydantic.

Cada tool se registra con:
  - name: identificador único
  - description: para el LLM
  - parameters: Pydantic model
  - handler: función async que ejecuta la tool
  - requires_approval: si necesita aprobación humana
  - category: agrupación lógica (crm, property, analytics, notification)

El registry genera automáticamente el formato OpenAI-compatible para tool calling.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable, Coroutine, Type

from pydantic import BaseModel

logger = logging.getLogger(__name__)


ToolHandler = Callable[..., Coroutine[Any, Any, Any]]


@dataclass
class ToolDefinition:
    """Definición completa de una tool."""

    name: str
    description: str
    parameters_model: Type[BaseModel]
    handler: ToolHandler
    category: str = "general"
    requires_approval: bool = False
    is_read_only: bool = True

    def to_openai_schema(self) -> dict[str, Any]:
        """Convierte la tool al formato OpenAI function calling."""
        schema = self.parameters_model.model_json_schema()
        # Limpiar keys que OpenAI no acepta
        schema.pop("title", None)
        for prop in schema.get("properties", {}).values():
            prop.pop("title", None)

        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": schema,
            },
        }


class ToolRegistry:
    """Registro centralizado de tools disponibles para los agentes."""

    def __init__(self) -> None:
        self._tools: dict[str, ToolDefinition] = {}

    def register(
        self,
        name: str,
        description: str,
        parameters_model: Type[BaseModel],
        handler: ToolHandler,
        *,
        category: str = "general",
        requires_approval: bool = False,
        is_read_only: bool = True,
    ) -> None:
        """Registra una tool nueva."""
        if name in self._tools:
            logger.warning("Tool '%s' already registered — overwriting", name)

        self._tools[name] = ToolDefinition(
            name=name,
            description=description,
            parameters_model=parameters_model,
            handler=handler,
            category=category,
            requires_approval=requires_approval,
            is_read_only=is_read_only,
        )
        logger.debug("Registered tool: %s (category=%s)", name, category)

    def get(self, name: str) -> ToolDefinition | None:
        """Obtiene una tool por nombre."""
        return self._tools.get(name)

    def list_tools(
        self,
        *,
        category: str | None = None,
        include_approval_required: bool = True,
    ) -> list[ToolDefinition]:
        """Lista tools filtradas por categoría."""
        tools = list(self._tools.values())
        if category:
            tools = [t for t in tools if t.category == category]
        if not include_approval_required:
            tools = [t for t in tools if not t.requires_approval]
        return tools

    def get_openai_tools(
        self,
        *,
        category: str | None = None,
        names: list[str] | None = None,
    ) -> list[dict[str, Any]]:
        """Retorna todas las tools en formato OpenAI para tool calling."""
        if names:
            tools = [self._tools[n] for n in names if n in self._tools]
        else:
            tools = self.list_tools(category=category)
        return [t.to_openai_schema() for t in tools]

    async def execute(self, name: str, arguments: dict[str, Any]) -> Any:
        """Ejecuta una tool por nombre con los argumentos dados."""
        tool = self._tools.get(name)
        if not tool:
            raise ValueError(f"Tool '{name}' not found in registry")

        # Validar argumentos con Pydantic
        validated = tool.parameters_model(**arguments)
        return await tool.handler(**validated.model_dump())

    def get_categories(self) -> list[str]:
        """Retorna lista de categorías únicas."""
        return sorted(set(t.category for t in self._tools.values()))

    def get_stats(self) -> dict[str, Any]:
        """Estadísticas del registry."""
        by_category: dict[str, int] = {}
        for t in self._tools.values():
            by_category[t.category] = by_category.get(t.category, 0) + 1
        return {
            "total_tools": len(self._tools),
            "by_category": by_category,
            "approval_required": sum(1 for t in self._tools.values() if t.requires_approval),
        }


# Singleton
tool_registry = ToolRegistry()
