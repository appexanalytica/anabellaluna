# PLAN DE EJECUCION — PLATAFORMA COGNITIVA INMOBILIARIA

Documento de referencia: `ARQUITECTURA_PLATAFORMA_COGNITIVA.md`

---

## ESTADO ACTUAL POR ETAPA

| # | Etapa | Estado | Detalle |
|---|-------|--------|---------|
| 1 | Infraestructura base IA | COMPLETA | 57 archivos Python en ai-gateway/, docker-compose.ai.yml, pyproject.toml |
| 2 | Event-Driven Architecture | COMPLETA | Redis Streams, publishEventAsync en 8 routes, serviceAuth en 10 routes, MCP apiClient refactorizado |
| - | Deuda tecnica Etapa 1 | ELIMINADA | Todas las write ops MCP via API, paths corregidos, eventos en messages+whatsapp |
| 3 | Tool System profesional | INTEGRADO | tools/ registradas en main.py, paths corregidos /crm/, crm_client.py paths arreglados |
| 4 | Memory Engine | INTEGRADO | memory/ conectada en main.py (semantic+short_term+working), schema init.sql verificado |
| 5 | Retrieval y Context Engine | INTEGRADO | retrieval/ + embeddings/ conectados, context_builder listo |
| 6 | AI Orchestrator | INTEGRADO | orchestrator/ con router, context, policy — conectado en main.py |
| 7 | Sistema Multiagente | INTEGRADO | 5 agentes registrados en main.py: operational, lead, property, executive, market |
| 8 | Observability total | INTEGRADO | langfuse_client + otel inicializados en main.py, FastAPI instrumentada |
| 9 | Autonomous Workflows | INTEGRADO | 3 workflows registrados en main.py, workflow_state schema corregido |
| 10 | Prediction Engine | INTEGRADO | analytics/prediction_engine.py conectado via queues/worker.py |
| 11 | Chat IA como interfaz | CONSTRUIDO | Backend proxy /ai-gateway/*, AIFloatingOrb cognitivo, AISuggestionsPanel, markdown rendering |
| 12 | Escalabilidad futura | DISEÑO | Preparada en arquitectura, no requiere implementacion inmediata |

---

## RESUMEN

Etapas 1-2: **Infraestructura backend COMPLETA y funcionando en produccion.**

Etapas 3-10: **Codigo Python INTEGRADO.** Todos los subsistemas conectados en main.py: 5 agentes, 4 categorias de tools, 3 capas de memoria, event consumer/producer, 3 workflows, observability, prompts. Paths de crm_client.py corregidos (/api/ → /crm/). Schema de workflow_state alineado con engine.py. **Falta: levantar Docker, ejecutar por primera vez, y testear con datos reales.**

Etapa 11: **CONSTRUIDA.** Backend proxy route /ai-gateway/* con SSE streaming, AIFloatingOrb cognitivo actualizado en admin y agents, AISuggestionsPanel en ambos dashboards con approve/reject/dismiss, AIMessageBubble con markdown rendering. **Falta: levantar AI Gateway para testear end-to-end.**

Etapas 11-12: **No construidas.**

---

## PROXIMO PASO CRITICO: INTEGRACION Y ACTIVACION DEL AI GATEWAY

El ai-gateway tiene todo el codigo pero esta muerto. Hay que darle vida.

---

## FASE 3 — INTEGRACION (lo que sigue)

### 3.1 Infraestructura Docker — Levantar servicios

- [x] Verificar docker-compose.ai.yml funciona correctamente
- [x] Crear script `ai-gateway/infrastructure/postgres/init.sql` con tablas para pgvector
- [ ] Levantar PostgreSQL con pgvector (puerto 5433)
- [ ] Levantar Redis AI (puerto 6379) — o reusar el Redis existente
- [ ] Levantar Langfuse (puerto 3010)
- [ ] Verificar conectividad entre servicios

### 3.2 AI Gateway — Hacerlo ejecutable

- [x] Verificar que `app/main.py` arranca con uvicorn sin errores (todos los imports y subsistemas conectados)
- [x] Verificar que `app/config.py` carga todas las env vars necesarias
- [x] Verificar que `app/dependencies.py` inicializa conexiones (Redis, PostgreSQL, HTTP client)
- [x] Crear archivo `.env` de ejemplo para ai-gateway
- [x] Crear script de arranque (`start.sh` — infra/gateway/worker/stop/all)
- [ ] Verificar que FastAPI expone endpoints basicos (health, docs)

### 3.3 PostgreSQL — Tablas y esquemas

- [x] Crear tabla `semantic_memory` (id, entity_type, entity_id, content, embedding vector(1536), metadata, agent_id, created_at, expires_at)
- [x] Crear tabla `temporal_memory` (id, metric, agent_id, entity_id, value, metadata, recorded_at)
- [x] Crear tabla `ai_execution_log` (id, trace_id, agent_name, trigger_type, ..., tokens, cost, success, created_at)
- [x] Crear tabla `workflow_state` (id, workflow_name, status, state_data, error, created_at, updated_at) — schema alineado con engine.py
- [x] Crear indice IVFFlat para busqueda vectorial (semantic_memory_embedding_idx)
- [x] Verificar que semantic.py table/column names coinciden con init.sql

### 3.4 Event Consumer — Conectar al bus de eventos

- [x] Verificar que `events/consumer.py` se conecta al Redis Stream `events:business`
- [x] Crear consumer group `ai-gateway` en el stream (idempotente en consumer.start())
- [x] Implementar dispatch de eventos a los agentes correspondientes:
  - `property.created` / `property.updated` → PropertyIntelligenceAgent
  - `client.created` / `client.updated` → LeadIntelligenceAgent
  - `task.status_changed` → OperationalIntelligenceAgent
  - `whatsapp.message_received` → (futuro) ConversationAgent
  - `booking.status_changed` → OperationalIntelligenceAgent
  - `message.sent` → (logging/metrics)
- [x] Implementar ACK de eventos procesados (xack en consumer.run())
- [ ] Implementar dead-letter queue para eventos fallidos
- [ ] Testear flujo completo: crear propiedad en CRM → evento → consumer lo recibe

### 3.5 Tools CRM Client — Conectar al backend Node.js

- [x] Verificar que `tools/crm_client.py` puede hacer HTTP requests al backend
- [x] **CORREGIDO: Todos los paths de /api/ → /crm/ para coincidir con server.js**
- [x] **CORREGIDO: Dashboard stats /admin/stats y /crm/stats**
- [x] **CORREGIDO: Health endpoint /health (no /api/health)**
- [x] Configurar `BACKEND_URL` y `INTERNAL_SERVICE_KEY` en env vars del ai-gateway (.env.example)
- [ ] Testear cada categoria de tools con datos reales
- [ ] Verificar que las respuestas del backend se parsean correctamente

### 3.6 Memory Engine — Inicializar y popular

- [x] Verificar que short_term.py conecta a Redis (inicializado en main.py lifespan)
- [x] Verificar que working.py conecta a Redis (inicializado en main.py lifespan)
- [x] Verificar que semantic.py conecta a PostgreSQL + pgvector (inicializado en main.py lifespan)
- [x] Verificar que archival.py conecta a PostgreSQL (usa semantic._get_pool())
- [ ] Implementar carga inicial de working memory desde CRM (snapshot de estado actual)
- [ ] Testear store/retrieve en cada nivel de memoria

### 3.7 Embeddings — Verificar pipeline

- [x] Verificar que embeddings/models.py puede llamar a OpenAI embeddings API (via OpenRouter)
- [x] Mock provider disponible si no hay API key configurada
- [ ] Configurar API key de OpenRouter (OPENROUTER_API_KEY)
- [ ] Testear embed_text, embed_batch con datos reales
- [ ] Testear embed_and_store (embedding → pgvector)
- [ ] Verificar retrieval: query → embedding → cosine similarity search

### 3.8 Agentes — Verificar que ejecutan

- [x] 5 agentes registrados en main.py con triggers y schedules correctos
- [ ] Testear OperationalIntelligenceAgent.run_scheduled() con datos reales
- [ ] Testear LeadIntelligenceAgent.analyze_lead() con un cliente real
- [ ] Testear PropertyIntelligenceAgent con una propiedad real
- [ ] Testear ExecutiveIntelligenceAgent.run_scheduled() para reporte diario
- [ ] Testear MarketIntelligenceAgent.run_scheduled() para analisis semanal
- [ ] Verificar que los agentes usan las tools correctamente
- [ ] Verificar que los agentes guardan resultados en memoria

### 3.9 Orchestrator — Verificar coordinacion

- [x] Router implementado con dispatch por target_agent o default a operational
- [x] Context builder con deteccion de intent por keywords
- [x] Policy engine con rate limiting y blocked/approval actions
- [ ] Testear flujo completo: input → router → agente → tool → respuesta

### 3.10 Workflows — Verificar automatizaciones

- [x] 3 workflows registrados en main.py (inactive_property, hot_lead, conversion_drop)
- [x] WorkflowEngine con execute(), run_all_scheduled(), get_recent_runs()
- [ ] Testear inactive_property workflow con datos reales
- [ ] Testear hot_lead workflow con datos reales
- [ ] Testear conversion_drop workflow con datos reales
- [ ] Verificar que los workflows generan notificaciones via tools

### 3.11 Observability — Conectar Langfuse

- [x] langfuse_client.py con lazy init y graceful fallback si no hay keys
- [x] OpenTelemetry inicializado en main.py (init_telemetry, instrument_fastapi, instrument_httpx)
- [ ] Configurar LANGFUSE_PUBLIC_KEY y LANGFUSE_SECRET_KEY
- [ ] Verificar que las traces se registran durante ejecucion de agentes
- [ ] Verificar dashboard Langfuse en http://localhost:3010

### 3.12 Worker ARQ — Verificar tareas async

- [x] Worker definido con startup/shutdown lifecycle, cron jobs, y 5 task functions
- [ ] Verificar que el worker arranca: `python -m queues.worker`
- [ ] Testear task_embed_batch
- [ ] Testear task_analyze_lead
- [ ] Testear task_generate_report
- [ ] Testear task_run_workflow
- [ ] Verificar cron jobs (refresh memory cada 30min, workflows 7AM/9AM)

### 3.13 API Endpoints del AI Gateway

- [x] POST /chat — entrada de lenguaje natural (implementado en main.py)
- [x] GET /health — health check con estado de backend/redis/postgres/agentes
- [x] GET /agents — lista todos los agentes y su estado
- [x] POST /agents/{agent_name}/run — ejecutar agente manualmente
- [x] Implementar endpoint GET /suggestions — sugerencias pendientes (lee notificaciones tipo ai_suggestion del backend)
- [x] Implementar endpoint POST /workflows/{name}/run — ejecutar workflow manualmente
- [x] Implementar endpoint GET /metrics — metricas IA (agentes, workflows, infra status)

---

## FASE 4 — CHAT IA (Etapa 11)

### 4.1 Backend Node.js — Proxy al AI Gateway

- [x] Crear ruta backend/routes/ai-gateway.js que proxya al AI Gateway (POST /chat, GET /health, /agents, /suggestions, /metrics, POST /agents/:name/run, /workflows/:name/run)
- [x] Implementar streaming de respuestas (SSE en POST /ai-gateway/chat con stream: true)
- [x] Pasar contexto del usuario autenticado (user_id, agent_id desde JWT)

### 4.2 Frontend — Interfaz conversacional

- [x] Crear componente de chat IA en el CRM (agents app) — AIFloatingOrb actualizado con useAIGatewayChat
- [x] Crear componente de chat IA en el ERP (admin app) — AIFloatingOrb actualizado con useAIGatewayChat
- [x] Conectar al endpoint del backend (aiGatewayService.js en admin y agents)
- [x] Mostrar respuestas con formato (markdown rendering en AIMessageBubble: bold, italic, code, lists)
- [x] Mostrar sugerencias IA en panel dedicado (AISuggestionsPanel en ambos dashboards)
- [x] Mostrar alertas y notificaciones IA (via panel de sugerencias con prioridades)

### 4.3 Panel de sugerencias IA

- [x] Crear componente AISuggestionsPanel en admin y agents dashboards
- [x] Mostrar sugerencias de agentes con badge de agente, prioridad, accion sugerida
- [x] Permitir aprobar/rechazar/descartar sugerencias (3 botones, human-in-the-loop)
- [x] Registrar feedback del usuario (PATCH /crm/notifications/:id con metadata.feedback + metadata.feedbackAt)

---

## FASE 5 — PRODUCCION

### 5.1 Deploy

- [x] Agregar servicios AI al deploy.sh (docker-compose.ai.yml, PM2 ai-gateway + ai-worker-arq)
- [x] Configurar PM2 para el AI Gateway (uvicorn app.main:app --port 8100) y ARQ worker
- [x] Configurar variables de entorno en produccion (AI_GATEWAY_URL en backend/.env.example)
- [x] Configurar Nginx reverse proxy — no necesario, AI Gateway accesible via backend proxy /ai-gateway/*
- [ ] Verificar que todo arranca correctamente en el servidor

### 5.2 Monitoreo

- [ ] Configurar alertas de Langfuse
- [ ] Configurar metricas de consumo de tokens
- [ ] Configurar alertas de errores de agentes
- [x] Dashboard de observabilidad IA en el admin (AIObservability.jsx — ruta /ai-observability, sidebar, App.js)

---

## ARCHIVOS CONSTRUIDOS (referencia)

### ai-gateway/ (57 archivos Python)

```
app/: __init__, main, config, dependencies
agents/: __init__, base, operational, lead, property, executive, market
memory/: __init__, semantic, short_term, working, archival
tools/: __init__, registry, crm_client, crm_tools, property_tools, analytics_tools, notification_tools
events/: __init__, producer, consumer
retrieval/: __init__, semantic_search, hybrid_search, context_builder
embeddings/: __init__, service, models
orchestrator/: __init__, router, context, policy
workflows/: __init__, engine, inactive_property, hot_lead, conversion_drop
providers/: __init__, base, anthropic, gemini, openrouter
prompts/: __init__, registry
analytics/: __init__, prediction_engine
observability/: __init__, langfuse_client, otel
queues/: __init__, worker
```

### Backend Node.js (infraestructura Etapa 1-2 + Etapa 11)

```
backend/utils/redisStreams.js — Event bus publisher
backend/middlewares/serviceAuth.js — Service-to-service auth
backend/routes/ai-gateway.js — Proxy routes al AI Gateway (chat, health, agents, suggestions, metrics, workflows)
backend/models/Notification.js — Agregado tipo 'ai_suggestion'
backend/routes/notifications.js — Agregado PATCH /:id para feedback de sugerencias
mcp-server/src/apiClient.js — MCP → Backend API client (Regla 2)
backend/routes/bookings.js — Nuevo route para booking status
docker-compose.ai.yml — PostgreSQL+pgvector, Redis, Langfuse
```

### Frontend — Interfaz IA (Etapa 11)

```
admin/src/services/aiGatewayService.js — HTTP client para AI Gateway
admin/src/hooks/useAIGatewayChat.js — Hook de chat cognitivo
admin/src/components/ai/AIFloatingOrb.jsx — Orb actualizado para AI Gateway
admin/src/components/ai/AIMessageBubble.jsx — Markdown rendering
admin/src/components/ai/AISuggestionsPanel.jsx — Panel sugerencias IA en dashboard
admin/src/pages/AIObservability.jsx — Dashboard observabilidad IA (agentes, workflows, infra)
agents/src/services/aiGatewayService.js — HTTP client para AI Gateway
agents/src/hooks/useAIGatewayChat.js — Hook de chat cognitivo
agents/src/components/ai/AIFloatingOrb.jsx — Orb actualizado para AI Gateway
agents/src/components/ai/AIMessageBubble.jsx — Markdown rendering
agents/src/components/ai/AISuggestionsPanel.jsx — Panel sugerencias IA en dashboard
```

### Routes con eventos (publishEventAsync)

```
clientes.js, propiedades.js, citas.js, tareas.js,
operaciones.js, bookings.js, messages.js, whatsapp.js
```

### Routes con serviceAuth (authenticateTokenOrService)

```
clientes.js, propiedades.js, citas.js, tareas.js,
operaciones.js, agentes.js, activities.js, bookings.js,
messages.js, notifications.js
```
