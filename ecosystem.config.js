/**
 * PM2 Ecosystem Config — Anabella Luna
 *
 * Procesos:
 *   - backend:          API Express principal (puerto 4000)
 *   - ai-worker:        Worker para ejecuciones AI asíncronas + health checks
 *   - metrics-worker:   Sync periódico métricas Meta Ads + anomaly detection
 *   - scheduler-worker: Schedulers separados del proceso API (evita duplicación)
 *
 * NOTA sobre scheduler-worker:
 *   Una vez habilitado, remover del backend/server.js las llamadas:
 *     initReportScheduler()
 *     initAutomationScheduler()
 *     initRewardsScheduler()
 *     initTaskAutomationScheduler()
 *   Esto evita ejecución doble si se escala el backend a múltiples instancias.
 */

module.exports = {
  apps: [
    // ── API Principal ────────────────────────────────────────────────────────
    {
      name: 'backend',
      script: './backend/server.js',
      cwd: '/var/www/anabella',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      error_file: '/var/log/anabella/backend-error.log',
      out_file:   '/var/log/anabella/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 5000,
      max_restarts: 10,
      min_uptime: '10s',
    },

    // ── AI Worker ────────────────────────────────────────────────────────────
    {
      name: 'ai-worker',
      script: './backend/workers/ai-worker.js',
      cwd: '/var/www/anabella',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/anabella/ai-worker-error.log',
      out_file:   '/var/log/anabella/ai-worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 10000,
      max_restarts: 5,
    },

    // ── Metrics Worker ───────────────────────────────────────────────────────
    {
      name: 'metrics-worker',
      script: './backend/workers/metrics-worker.js',
      cwd: '/var/www/anabella',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/anabella/metrics-worker-error.log',
      out_file:   '/var/log/anabella/metrics-worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 15000,
      max_restarts: 5,
    },

    // ── Scheduler Worker ─────────────────────────────────────────────────────
    // instances: SIEMPRE 1 — evita schedulers duplicados en escala horizontal
    {
      name: 'scheduler-worker',
      script: './backend/workers/scheduler-worker.js',
      cwd: '/var/www/anabella',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '256M',
      env: {
        NODE_ENV: 'production',
      },
      error_file: '/var/log/anabella/scheduler-worker-error.log',
      out_file:   '/var/log/anabella/scheduler-worker-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 10000,
      max_restarts: 5,
    },

    // ── AI Gateway (Python) ─────────────────────────────────────────────────
    // Capa cognitiva: agentes especializados, event consumer, semantic memory
    // Requiere: Python 3.12+, pip install (ver ai-gateway/pyproject.toml)
    // Requiere: Redis, PostgreSQL+pgvector (ver setup-ai-infra.sh)
    {
      name: 'ai-gateway',
      script: '/var/www/anabella/ai-gateway/venv/bin/uvicorn',
      args: 'app.main:app --host 0.0.0.0 --port 8100',
      cwd: '/var/www/anabella/ai-gateway',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        PYTHONUNBUFFERED: '1',
      },
      error_file: '/var/log/anabella/ai-gateway-error.log',
      out_file:   '/var/log/anabella/ai-gateway-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 10000,
      max_restarts: 5,
    },

    // ── AI Worker ARQ (Python) ──────────────────────────────────────────────
    // Worker asíncrono: embeddings batch, análisis de leads, reportes, workflows
    // Requiere: mismas dependencias que ai-gateway
    {
      name: 'ai-worker-arq',
      script: '/var/www/anabella/ai-gateway/venv/bin/arq',
      args: 'queues.worker.WorkerSettings',
      cwd: '/var/www/anabella/ai-gateway',
      interpreter: 'none',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '512M',
      env: {
        PYTHONUNBUFFERED: '1',
      },
      error_file: '/var/log/anabella/ai-worker-arq-error.log',
      out_file:   '/var/log/anabella/ai-worker-arq-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      restart_delay: 10000,
      max_restarts: 5,
    },

    // evolution-api es gestionada directamente por deploy.sh (build + pm2 start)
  ],
};
