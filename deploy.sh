#!/bin/bash
set -eo pipefail

# ═══════════════════════════════════════════════════════════
#  AnabellaLuna — Script de Deploy Completo
#  Uso:  bash /var/www/anabella/deploy.sh
#        bash /var/www/anabella/deploy.sh --skip-frontend
#        bash /var/www/anabella/deploy.sh --only backend
#        bash /var/www/anabella/deploy.sh --only admin
#        bash /var/www/anabella/deploy.sh --only agents
#        bash /var/www/anabella/deploy.sh --only frontend
# ═══════════════════════════════════════════════════════════

PROJECT_DIR="/var/www/anabella"
LOGFILE="$PROJECT_DIR/deploy.log"

# Toda la salida (stdout+stderr) va a la terminal Y al log
exec > >(tee -a "$LOGFILE") 2>&1

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()   { echo -e "${GREEN}  ✔ $1${NC}"; }
warn() { echo -e "${YELLOW}  ⚠ $1${NC}"; }
fail() { echo -e "${RED}  ✖ $1${NC}"; exit 1; }

# ── Parsear argumentos ──────────────────────────────────────
SKIP_FRONTEND=false
ONLY=""
for i in "$@"; do
  if [ "$prev" = "--only" ]; then
    ONLY="$i"
  fi
  case $i in
    --skip-frontend) SKIP_FRONTEND=true ;;
    --only) ;;
  esac
  prev="$i"
done

should_run() {
  local component="$1"
  if [ -n "$ONLY" ]; then
    [ "$ONLY" = "$component" ] && return 0 || return 1
  fi
  if [ "$SKIP_FRONTEND" = true ] && [ "$component" != "backend" ]; then
    return 1
  fi
  return 0
}

# ══════════════════════════════════════════════════════════════
echo ""
log "═══════════════════════════════════════════════════"
log "  DEPLOY AnabellaLuna — $(date '+%Y-%m-%d %H:%M:%S')"
log "═══════════════════════════════════════════════════"

# ── 1. Git Pull ──────────────────────────────────────────────
log "📥 Descargando últimos cambios..."
cd "$PROJECT_DIR"
git stash --include-untracked 2>/dev/null || true
git pull origin main || fail "git pull falló"
ok "Código actualizado"

# ── 1b. Fix permisos ───────────────────────────────────────────
log "🔐 Corrigiendo permisos de archivos..."
chmod -R u+w "$PROJECT_DIR" 2>/dev/null || true
ok "Permisos corregidos"

# ── 2. Backend ───────────────────────────────────────────────
if should_run "backend"; then
  log "🔧 Backend — Instalando dependencias..."
  cd "$PROJECT_DIR/backend"
  npm install --no-audit --no-fund || fail "npm install backend falló"
  ok "Dependencias del backend instaladas"

  log "🔄 Backend — Gestionando procesos PM2..."
  cd "$PROJECT_DIR"

  # Función para reiniciar o iniciar un proceso PM2
  restart_or_start_pm2() {
    local name="$1"
    local script="$2"
    local cwd="$3"
    if pm2 describe "$name" > /dev/null 2>&1; then
      pm2 restart "$name" --update-env
      ok "PM2 '$name' reiniciado"
    else
      pm2 start "$script" --name "$name" --cwd "$cwd"
      ok "PM2 '$name' iniciado"
    fi
  }

  # Si existe ecosystem.config.js, usarlo; si no, iniciar manualmente
  if [ -f "$PROJECT_DIR/ecosystem.config.js" ]; then
    # Iniciar todos los procesos definidos en ecosystem.config.js
    if pm2 describe backend > /dev/null 2>&1; then
      # Ya existe al menos un proceso — recargar todos
      pm2 reload ecosystem.config.js --update-env 2>/dev/null \
        || pm2 restart ecosystem.config.js --update-env
    else
      # Primera vez — iniciar todos
      pm2 start ecosystem.config.js
    fi
    ok "Todos los procesos PM2 gestionados con ecosystem.config.js"
  else
    # Fallback: iniciar manualmente si no hay ecosystem.config.js
    restart_or_start_pm2 "backend"          "backend/server.js"            "$PROJECT_DIR"
    restart_or_start_pm2 "ai-worker"        "backend/workers/ai-worker.js" "$PROJECT_DIR"
    restart_or_start_pm2 "scheduler-worker" "backend/workers/scheduler-worker.js" "$PROJECT_DIR"
  fi

  pm2 save 2>/dev/null
  ok "Estado PM2 guardado"

  # ── Evolution API — setup automático + restart ────────────
  EVOLUTION_DIR="$PROJECT_DIR/evolution-api"
  BACKEND_ENV="$PROJECT_DIR/backend/.env"

  if [ -d "$EVOLUTION_DIR" ] && [ -f "$EVOLUTION_DIR/package.json" ]; then
    log "Evolution API — instalando dependencias..."
    cd "$EVOLUTION_DIR"
    npm install --no-audit --no-fund || warn "Evolution API npm install falló"

    # Generar .env de Evolution si no existe
    if [ ! -f "$EVOLUTION_DIR/.env" ]; then
      log "Evolution API — generando .env..."

      EVOLUTION_API_KEY=$(grep -E '^EVOLUTION_API_KEY=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '[:space:]')
      BACKEND_PUBLIC_URL=$(grep -E '^BACKEND_PUBLIC_URL=' "$BACKEND_ENV" 2>/dev/null | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '[:space:]')
      WEBHOOK_URL="${BACKEND_PUBLIC_URL}/whatsapp/webhook/evolution"

      cat > "$EVOLUTION_DIR/.env" <<EOF
SERVER_TYPE=http
SERVER_PORT=8080
SERVER_URL=${BACKEND_PUBLIC_URL}
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,PATCH,DELETE
CORS_CREDENTIALS=true
LOG_LEVEL=ERROR,WARN,INFO
LOG_COLOR=true
LOG_BAILEYS=error
DEL_INSTANCE=false
DATABASE_PROVIDER=sqlite
DATABASE_CONNECTION_URI=file:${EVOLUTION_DIR}/evolution.db
DATABASE_CONNECTION_CLIENT_NAME=evolution_api
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true
DATABASE_SAVE_DATA_HISTORIC=true
CACHE_REDIS_ENABLED=false
CACHE_LOCAL_ENABLED=false
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true
WEBHOOK_GLOBAL_ENABLED=true
WEBHOOK_GLOBAL_URL=${WEBHOOK_URL}
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false
WEBHOOK_GLOBAL_WEBHOOK_BASE64=false
WEBHOOK_EVENTS_QRCODE_UPDATED=true
WEBHOOK_EVENTS_MESSAGES_UPSERT=true
WEBHOOK_EVENTS_MESSAGES_UPDATED=true
WEBHOOK_EVENTS_CONNECTION_UPDATE=true
WEBHOOK_EVENTS_APPLICATION_STARTUP=false
CONFIG_SESSION_PHONE_CLIENT=AnabellaLuna
CONFIG_SESSION_PHONE_NAME=Chrome
QRCODE_LIMIT=30
EOF
      ok "Evolution API .env generado"
    fi

    # Generar cliente Prisma (obligatorio antes del build)
    npm run db:generate || fail "Evolution API db:generate falló"
    npm run db:deploy   || warn "Evolution API db:deploy falló"
    npm run build       || fail "Evolution API build falló"

    # Iniciar o reiniciar en PM2
    if pm2 describe evolution-api > /dev/null 2>&1; then
      pm2 restart evolution-api --update-env
    else
      pm2 start "$EVOLUTION_DIR/dist/main.js" \
        --name "evolution-api" \
        --cwd "$EVOLUTION_DIR" \
        --max-memory-restart 512M \
        --restart-delay 5000 \
        --max-restarts 10 \
        -- --max-old-space-size=512
    fi
    pm2 save 2>/dev/null
    ok "Evolution API lista"
    cd "$PROJECT_DIR"
  fi
fi

# ── 3. Admin (ERP) ──────────────────────────────────────────
if should_run "admin"; then
  log "🏗️  Admin (ERP) — Instalando dependencias..."
  cd "$PROJECT_DIR/admin"
  npm install --no-audit --no-fund || fail "npm install admin falló"
  ok "Dependencias admin instaladas"

  log "🏗️  Admin (ERP) — Compilando..."
  NODE_ENV=production DISABLE_ESLINT_PLUGIN=true npm run build || fail "Admin build falló"
  ok "Admin build completado → admin/build/"
fi

# ── 4. Agents (CRM) ─────────────────────────────────────────
if should_run "agents"; then
  log "🏗️  Agents (CRM) — Instalando dependencias..."
  cd "$PROJECT_DIR/agents"
  npm install --no-audit --no-fund || fail "npm install agents falló"
  ok "Dependencias agents instaladas"

  log "🏗️  Agents (CRM) — Compilando..."
  NODE_ENV=production DISABLE_ESLINT_PLUGIN=true npm run build || fail "Agents build falló"
  ok "Agents build completado → agents/build/"
fi

# ── 5. Frontend (Público) ───────────────────────────────────
if should_run "frontend"; then
  log "🏗️  Frontend (Público) — Instalando dependencias..."
  cd "$PROJECT_DIR/frontend"
  npm install --no-audit --no-fund || fail "npm install frontend falló"
  ok "Dependencias frontend instaladas"

  log "🏗️  Frontend (Público) — Compilando..."
  NODE_ENV=production npm run build || fail "Frontend build falló"
  ok "Frontend build completado → frontend/dist/"
fi

# ── 6. Resumen ───────────────────────────────────────────────
echo ""
log "═══════════════════════════════════════════════════"
log "  ✅ DEPLOY COMPLETADO — $(date '+%H:%M:%S')"
log "═══════════════════════════════════════════════════"

if should_run "backend"; then
  echo ""
  log "Estado PM2:"
  cd "$PROJECT_DIR"
  pm2 list
fi

echo ""
log "Log guardado en: $LOGFILE"
