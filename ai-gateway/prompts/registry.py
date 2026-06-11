"""
Prompt Registry — Registro versionado de prompts.

Permite:
  - Registrar prompts con nombre y versión
  - Cargar prompts desde archivos de templates
  - Renderizar prompts con variables
  - Historial de versiones para A/B testing
  - Integración con Langfuse para tracking de prompt performance
"""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

logger = logging.getLogger(__name__)

TEMPLATES_DIR = Path(__file__).parent / "templates"


@dataclass
class PromptVersion:
    """Una versión específica de un prompt."""

    name: str
    version: int
    template: str
    description: str = ""
    variables: list[str] = field(default_factory=list)
    metadata: dict[str, Any] = field(default_factory=dict)

    def render(self, **kwargs: Any) -> str:
        """Renderiza el prompt reemplazando variables."""
        result = self.template
        for key, value in kwargs.items():
            placeholder = f"{{{{{key}}}}}"
            result = result.replace(placeholder, str(value))
        return result


class PromptRegistry:
    """Registro centralizado de prompts versionados."""

    def __init__(self) -> None:
        self._prompts: dict[str, dict[int, PromptVersion]] = {}
        self._active_versions: dict[str, int] = {}

    def register(
        self,
        name: str,
        template: str,
        *,
        version: int = 1,
        description: str = "",
        variables: list[str] | None = None,
        metadata: dict[str, Any] | None = None,
        set_active: bool = True,
    ) -> PromptVersion:
        """Registra un prompt con un nombre y versión."""
        prompt = PromptVersion(
            name=name,
            version=version,
            template=template,
            description=description,
            variables=variables or [],
            metadata=metadata or {},
        )

        if name not in self._prompts:
            self._prompts[name] = {}

        self._prompts[name][version] = prompt

        if set_active or name not in self._active_versions:
            self._active_versions[name] = version

        logger.debug("Registered prompt: %s v%d", name, version)
        return prompt

    def get(self, name: str, *, version: int | None = None) -> PromptVersion | None:
        """Obtiene un prompt por nombre y versión (default: activa)."""
        versions = self._prompts.get(name)
        if not versions:
            return None

        if version is not None:
            return versions.get(version)

        active_version = self._active_versions.get(name)
        if active_version and active_version in versions:
            return versions[active_version]

        # Fallback: última versión
        return versions[max(versions.keys())]

    def render(self, name: str, *, version: int | None = None, **kwargs: Any) -> str:
        """Renderiza un prompt por nombre con las variables dadas."""
        prompt = self.get(name, version=version)
        if not prompt:
            raise ValueError(f"Prompt '{name}' not found in registry")
        return prompt.render(**kwargs)

    def set_active_version(self, name: str, version: int) -> None:
        """Establece la versión activa de un prompt."""
        if name not in self._prompts or version not in self._prompts[name]:
            raise ValueError(f"Prompt '{name}' version {version} not found")
        self._active_versions[name] = version

    def list_prompts(self) -> list[dict[str, Any]]:
        """Lista todos los prompts registrados."""
        result = []
        for name, versions in self._prompts.items():
            active = self._active_versions.get(name)
            result.append({
                "name": name,
                "active_version": active,
                "versions": sorted(versions.keys()),
                "description": versions.get(active, next(iter(versions.values()))).description,
            })
        return result

    def load_from_directory(self, directory: Path | str | None = None) -> int:
        """
        Carga prompts desde archivos .txt en un directorio de templates.

        Formato de archivo:
          - Nombre del archivo = nombre del prompt
          - Primera línea: # Descripción (opcional)
          - Resto: template del prompt

        Returns:
            Número de prompts cargados.
        """
        dir_path = Path(directory) if directory else TEMPLATES_DIR
        if not dir_path.exists():
            logger.debug("Templates directory not found: %s", dir_path)
            return 0

        count = 0
        for file_path in sorted(dir_path.glob("*.txt")):
            try:
                content = file_path.read_text(encoding="utf-8")
                lines = content.strip().split("\n")

                description = ""
                if lines and lines[0].startswith("#"):
                    description = lines[0].lstrip("#").strip()
                    template = "\n".join(lines[1:]).strip()
                else:
                    template = content.strip()

                # Extraer variables {{var}}
                import re
                variables = re.findall(r"\{\{(\w+)\}\}", template)

                name = file_path.stem
                self.register(
                    name,
                    template,
                    description=description,
                    variables=variables,
                )
                count += 1

            except Exception as e:
                logger.warning("Failed to load prompt template %s: %s", file_path.name, e)

        logger.info("Loaded %d prompt templates from %s", count, dir_path)
        return count


# Singleton
prompt_registry = PromptRegistry()


# ── Pre-register core prompts ────────────────────────────────────────────────

def register_core_prompts() -> None:
    """Registra los prompts base del sistema."""

    prompt_registry.register(
        "system_base",
        (
            "Sos un asistente de IA de Anabella Luna, una inmobiliaria argentina.\n"
            "Tu rol: {{role}}\n\n"
            "REGLAS:\n"
            "- Siempre respondé en español rioplatense\n"
            "- Sé conciso y directo\n"
            "- No inventes datos\n"
            "- Si no sabés algo, decilo\n"
            "- Priorizá información accionable\n\n"
            "{{context}}"
        ),
        description="Prompt base del sistema con rol y contexto dinámico",
        variables=["role", "context"],
    )

    prompt_registry.register(
        "chat_with_context",
        (
            "{{system_prompt}}\n\n"
            "## CONTEXTO ACTUAL\n"
            "{{retrieval_context}}\n\n"
            "## HISTORIAL DE CONVERSACIÓN\n"
            "{{conversation_history}}"
        ),
        description="Prompt de chat con contexto de retrieval inyectado",
        variables=["system_prompt", "retrieval_context", "conversation_history"],
    )

    prompt_registry.register(
        "analysis_output_format",
        (
            "Analizá la siguiente información y generá un reporte estructurado.\n\n"
            "DATOS:\n{{data}}\n\n"
            "FORMATO DE RESPUESTA: JSON con esta estructura:\n{{json_schema}}\n\n"
            "Respondé SOLO con el JSON, sin texto extra."
        ),
        description="Template para solicitar análisis con output JSON estructurado",
        variables=["data", "json_schema"],
    )
