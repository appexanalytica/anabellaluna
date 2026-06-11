#!/usr/bin/env bash
# ============================================================================
# AI Gateway — Start script
# ============================================================================
#
# Uso:
#   ./start.sh              → Levanta infra Docker + AI Gateway (uvicorn)
#   ./start.sh infra        → Solo levanta infra Docker (postgres, redis, langfuse)
#   ./start.sh gateway      → Solo levanta AI Gateway (uvicorn)
#   ./start.sh worker       → Solo levanta ARQ worker (cron jobs + async tasks)
#   ./start.sh stop         → Para todo (Docker + procesos)
#
# Requisitos:
#   - Docker + docker-compose
#   - Python 3.12+
#   - .env configurado (cp .env.example .env)
# ============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
COMPOSE_FILE="$PROJECT_ROOT/docker-compose.ai.yml"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[AI-GW]${NC} $*"; }
warn() { echo -e "${YELLOW}[AI-GW]${NC} $*"; }
err()  { echo -e "${RED}[AI-GW]${NC} $*" >&2; }

# ── Check .env ──────────────────────────────────────────────────────────────

check_env() {
  if [ ! -f "$SCRIPT_DIR/.env" ]; then
    warn ".env not found — copying from .env.example"
    cp "$SCRIPT_DIR/.env.example" "$SCRIPT_DIR/.env"
    warn "Please edit $SCRIPT_DIR/.env with your API keys before running again."
    exit 1
  fi
}

# ── Docker infra ────────────────────────────────────────────────────────────

start_infra() {
  log "Starting AI infrastructure (PostgreSQL+pgvector, Redis, Langfuse)..."

  if ! command -v docker &>/dev/null; then
    err "Docker not found. Install Docker first."
    exit 1
  fi

  docker compose -f "$COMPOSE_FILE" up -d

  log "Waiting for services to be healthy..."
  sleep 5

  # Check PostgreSQL
  if docker exec anabella-ai-postgres pg_isready -U ai_user -d anabella_ai &>/dev/null; then
    log "PostgreSQL+pgvector  ✓  (port 5433)"
  else
    warn "PostgreSQL not ready yet — may need a few more seconds"
  fi

  # Check Redis
  if docker exec anabella-ai-redis redis-cli ping &>/dev/null; then
    log "Redis               ✓  (port 6379)"
  else
    warn "Redis not ready yet"
  fi

  # Check Langfuse
  if curl -sf http://localhost:3010 &>/dev/null; then
    log "Langfuse             ✓  (port 3010)"
  else
    warn "Langfuse starting — may take 30-60s on first run"
  fi

  log "Infrastructure ready."
}

stop_infra() {
  log "Stopping AI infrastructure..."
  docker compose -f "$COMPOSE_FILE" down
  log "Infrastructure stopped."
}

# ── AI Gateway (uvicorn) ────────────────────────────────────────────────────

start_gateway() {
  log "Starting AI Gateway on port 8100..."
  cd "$SCRIPT_DIR"
  exec uvicorn app.main:app --host 0.0.0.0 --port 8100 --reload
}

# ── ARQ Worker ──────────────────────────────────────────────────────────────

start_worker() {
  log "Starting ARQ worker..."
  cd "$SCRIPT_DIR"
  exec python -m queues.worker
}

# ── Stop everything ────────────────────────────────────────────────────────

stop_all() {
  stop_infra
  # Kill any running uvicorn/worker processes for this gateway
  pkill -f "uvicorn app.main:app" 2>/dev/null || true
  pkill -f "python -m queues.worker" 2>/dev/null || true
  log "All AI Gateway processes stopped."
}

# ── Main ────────────────────────────────────────────────────────────────────

case "${1:-all}" in
  infra)
    start_infra
    ;;
  gateway)
    check_env
    start_gateway
    ;;
  worker)
    check_env
    start_worker
    ;;
  stop)
    stop_all
    ;;
  all)
    check_env
    start_infra
    start_gateway
    ;;
  *)
    echo "Usage: $0 {infra|gateway|worker|stop|all}"
    exit 1
    ;;
esac
