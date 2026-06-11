-- ============================================================================
-- AI Gateway — PostgreSQL init script
-- Se ejecuta automáticamente al crear el contenedor por primera vez.
-- ============================================================================

-- Extensión vectorial (pgvector)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Semantic Memory ───────────────────────────────────────────────────────────
-- Almacena embeddings de conversaciones, preferencias de clientes,
-- notas internas y resúmenes de IA para búsqueda semántica.

CREATE TABLE IF NOT EXISTS semantic_memory (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type  VARCHAR(50)  NOT NULL,  -- 'conversation', 'client', 'property', 'note'
  entity_id    VARCHAR(100) NOT NULL,
  content      TEXT         NOT NULL,
  embedding    vector(1536),            -- OpenAI text-embedding-ada-002 o Gemini
  metadata     JSONB        DEFAULT '{}',
  agent_id     VARCHAR(100),
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  expires_at   TIMESTAMPTZ              -- NULL = sin expiración
);

-- Índice vectorial para búsqueda semántica (cosine similarity)
CREATE INDEX IF NOT EXISTS semantic_memory_embedding_idx
  ON semantic_memory USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Índice para filtrado por tipo + agente
CREATE INDEX IF NOT EXISTS semantic_memory_entity_idx
  ON semantic_memory (entity_type, agent_id, created_at DESC);

-- ── Temporal Memory ───────────────────────────────────────────────────────────
-- Series de tiempo para métricas del negocio: conversiones, precios, actividad.

CREATE TABLE IF NOT EXISTS temporal_memory (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric      VARCHAR(100) NOT NULL,  -- 'conversion_rate', 'avg_price_zone_palermo', etc.
  agent_id    VARCHAR(100),
  entity_id   VARCHAR(100),           -- agente, zona, propiedad
  value       DECIMAL(20, 6),
  metadata    JSONB        DEFAULT '{}',
  recorded_at TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS temporal_memory_metric_idx
  ON temporal_memory (metric, agent_id, recorded_at DESC);

-- ── AI Executions Log ─────────────────────────────────────────────────────────
-- Registro de todas las ejecuciones del AI Gateway para trazabilidad.

CREATE TABLE IF NOT EXISTS ai_execution_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trace_id        VARCHAR(100)  NOT NULL,
  agent_name      VARCHAR(100)  NOT NULL,
  trigger_type    VARCHAR(50),          -- 'user_chat', 'scheduled', 'event'
  trigger_event   VARCHAR(100),
  user_id         VARCHAR(100),
  agent_id        VARCHAR(100),
  input_summary   TEXT,
  output_summary  TEXT,
  tools_used      JSONB         DEFAULT '[]',
  tokens_input    INTEGER       DEFAULT 0,
  tokens_output   INTEGER       DEFAULT 0,
  cost_usd        DECIMAL(10, 6) DEFAULT 0,
  latency_ms      INTEGER,
  success         BOOLEAN       DEFAULT TRUE,
  error_message   TEXT,
  created_at      TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ai_execution_log_agent_idx
  ON ai_execution_log (agent_name, created_at DESC);

-- TTL automático: limpiar logs > 90 días (ejecutar via cron o pg_cron)
-- DELETE FROM ai_execution_log WHERE created_at < NOW() - INTERVAL '90 days';

-- ── Workflow State ────────────────────────────────────────────────────────────
-- Estado de los workflows autónomos del AI Gateway.

CREATE TABLE IF NOT EXISTS workflow_state (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workflow_name VARCHAR(100)  NOT NULL,
  status        VARCHAR(30)   DEFAULT 'pending',  -- pending, running, completed, failed, paused
  state_data    JSONB         DEFAULT '{}',
  error         TEXT,
  created_at    TIMESTAMPTZ   DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS workflow_state_name_idx
  ON workflow_state (workflow_name, created_at DESC);

COMMIT;
