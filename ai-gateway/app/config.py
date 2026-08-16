"""
Configuración centralizada del AI Gateway.

Usa pydantic-settings para cargar desde variables de entorno o .env.
Toda configuración sensible vive en variables de entorno, nunca hardcodeada.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Backend Node.js ─────────────────────────────────────────────────────
    backend_url: str = "http://localhost:4000"
    internal_service_key: str = ""

    # ── PostgreSQL + pgvector ───────────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://ai_user:change_me@localhost:5433/anabella_ai"

    # ── Redis ───────────────────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379"

    # ── LLM Provider ───────────────────────────────────────────────────────
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    openai_base_url: str = "https://api.openai.com/v1"
    openai_embedding_model: str = "text-embedding-3-small"

    # ── Langfuse ────────────────────────────────────────────────────────────
    langfuse_public_key: str = ""
    langfuse_secret_key: str = ""
    langfuse_host: str = "http://localhost:3010"

    # ── Gateway ─────────────────────────────────────────────────────────────
    ai_gateway_port: int = 8100
    log_level: str = "info"
    environment: str = "development"

    # ── Rate limits ─────────────────────────────────────────────────────────
    max_concurrent_agents: int = 5
    max_tool_calls_per_request: int = 10
    agent_timeout_seconds: int = 60

    @property
    def is_production(self) -> bool:
        return self.environment == "production"


settings = Settings()
