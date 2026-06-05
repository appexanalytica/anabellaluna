#!/bin/bash
set -eo pipefail

# ═══════════════════════════════════════════════════════════
#  setup-evolution.sh — Instalación nativa de Evolution API v2
#  Ejecutar UNA SOLA VEZ en el servidor, ANTES del primer deploy.
#
#  Uso: bash /var/www/anabella/setup-evolution.sh
#
#  Requiere:
#    - Node.js 20+ (se instala automáticamente via NVM si no existe)
#    - PostgreSQL corriendo en localhost
#    - El archivo /var/www/anabella/backend/.env ya configurado
#      con EVOLUTION_API_KEY y EVOLUTION_DB_URI
# ═══════════════════════════════════════════════════════════

PROJECT_DIR="/var/www/anabella"
EVOLUTION_DIR="$PROJECT_DIR/evolution-api"
EVOLUTION_REPO="https://github.com/EvolutionAPI/evolution-api.git"
EVOLUTION_BRANCH="main"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${CYAN}[$(date '+%H:%M:%S')]${NC} $1"; }
ok()   { echo -e "${GREEN}  ✔ $1${NC}"; }
warn() { echo -e "${YELLOW}  ⚠ $1${NC}"; }
fail() { echo -e "${RED}  ✖ $1${NC}"; exit 1; }

echo ""
log "═══════════════════════════════════════════════════"
log "  SETUP Evolution API — $(date '+%Y-%m-%d %H:%M:%S')"
log "═══════════════════════════════════════════════════"

# ── 1. Verificar / instalar Node.js 20+ via NVM ──────────────
log "Verificando Node.js..."

if ! command -v node &>/dev/null || [ "$(node -e 'console.log(process.versions.node.split(".")[0])')" -lt 20 ]; then
  warn "Node.js 20+ no encontrado — instalando via NVM..."
  if ! command -v nvm &>/dev/null; then
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # shellcheck disable=SC1090
    source ~/.bashrc 2>/dev/null || source ~/.nvm/nvm.sh 2>/dev/null || true
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  fi
  nvm install 20
  nvm use 20
  ok "Node.js $(node -v) instalado"
else
  ok "Node.js $(node -v) OK"
fi

# ── 2. Verificar PM2 ──────────────────────────────────────────
if ! command -v pm2 &>/dev/null; then
  log "Instalando PM2..."
  npm install -g pm2
  ok "PM2 instalado"
else
  ok "PM2 $(pm2 -v) OK"
fi

# ── 3. Leer variables del backend .env ───────────────────────
BACKEND_ENV="$PROJECT_DIR/backend/.env"
if [ ! -f "$BACKEND_ENV" ]; then
  fail "No se encontró $BACKEND_ENV — configurar el backend .env primero"
fi

EVOLUTION_API_KEY=$(grep -E '^EVOLUTION_API_KEY=' "$BACKEND_ENV" | cut -d= -f2- | tr -d '"' | tr -d "'")
BACKEND_PUBLIC_URL=$(grep -E '^BACKEND_PUBLIC_URL=' "$BACKEND_ENV" | cut -d= -f2- | tr -d '"' | tr -d "'")

if [ -z "$EVOLUTION_API_KEY" ]; then
  fail "EVOLUTION_API_KEY no está configurado en $BACKEND_ENV"
fi

# SQLite — sin servidor de base de datos adicional
EVOLUTION_DB_URI="file:$EVOLUTION_DIR/evolution.db"
ok "Usando SQLite (sin dependencias externas de base de datos)"

# ── 5. Clonar / actualizar Evolution API ─────────────────────
if [ -d "$EVOLUTION_DIR/.git" ]; then
  log "Evolution API ya existe — actualizando..."
  cd "$EVOLUTION_DIR"
  git pull origin "$EVOLUTION_BRANCH" || warn "git pull falló — usando versión existente"
else
  log "Clonando Evolution API..."
  git clone --depth=1 --branch "$EVOLUTION_BRANCH" "$EVOLUTION_REPO" "$EVOLUTION_DIR" \
    || fail "No se pudo clonar Evolution API"
fi
ok "Código de Evolution API listo"

# ── 6. Instalar dependencias ──────────────────────────────────
log "Instalando dependencias de Evolution API..."
cd "$EVOLUTION_DIR"
npm install --no-audit --no-fund || fail "npm install falló"
ok "Dependencias instaladas"

# ── 7. Escribir .env de Evolution API ────────────────────────
log "Configurando Evolution API .env..."

WEBHOOK_GLOBAL_URL="${BACKEND_PUBLIC_URL:-https://api.anabellaluna.com.ar}/whatsapp/webhook/evolution"

cat > "$EVOLUTION_DIR/.env" <<EOF
# ── Generado por setup-evolution.sh — $(date '+%Y-%m-%d %H:%M:%S') ──

SERVER_TYPE=http
SERVER_PORT=8080
SERVER_URL=${BACKEND_PUBLIC_URL:-https://api.anabellaluna.com.ar}

CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,PATCH,DELETE
CORS_CREDENTIALS=true

LOG_LEVEL=ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS
LOG_COLOR=true
LOG_BAILEYS=error

DEL_INSTANCE=false

# Base de datos — SQLite (sin servidor externo)
DATABASE_PROVIDER=sqlite
DATABASE_CONNECTION_URI=${EVOLUTION_DB_URI}
DATABASE_CONNECTION_CLIENT_NAME=evolution_api

# Almacenamiento de sesiones en BD
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true
DATABASE_SAVE_DATA_LABELS=true
DATABASE_SAVE_DATA_HISTORIC=true

# Redis (opcional — si está disponible mejora la performance)
CACHE_REDIS_ENABLED=false
CACHE_REDIS_URI=redis://localhost:6379
CACHE_REDIS_PREFIX_KEY=evolution
CACHE_REDIS_SAVE_INSTANCES=false
CACHE_LOCAL_ENABLED=false

# Autenticación
AUTHENTICATION_TYPE=apikey
AUTHENTICATION_API_KEY=${EVOLUTION_API_KEY}
AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES=true

# Webhook global — todos los eventos se envían al backend
WEBHOOK_GLOBAL_ENABLED=true
WEBHOOK_GLOBAL_URL=${WEBHOOK_GLOBAL_URL}
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false
WEBHOOK_GLOBAL_WEBHOOK_BASE64=false
WEBHOOK_EVENTS_APPLICATION_STARTUP=false
WEBHOOK_EVENTS_QRCODE_UPDATED=true
WEBHOOK_EVENTS_MESSAGES_SET=false
WEBHOOK_EVENTS_MESSAGES_UPSERT=true
WEBHOOK_EVENTS_MESSAGES_UPDATED=true
WEBHOOK_EVENTS_MESSAGES_DELETE=false
WEBHOOK_EVENTS_SEND_MESSAGE=false
WEBHOOK_EVENTS_CONTACTS_SET=false
WEBHOOK_EVENTS_CONTACTS_UPSERT=false
WEBHOOK_EVENTS_CONTACTS_UPDATED=false
WEBHOOK_EVENTS_CHATS_SET=false
WEBHOOK_EVENTS_CHATS_UPSERT=false
WEBHOOK_EVENTS_CHATS_UPDATED=false
WEBHOOK_EVENTS_CHATS_DELETE=false
WEBHOOK_EVENTS_GROUPS_UPSERT=false
WEBHOOK_EVENTS_GROUPS_UPDATE=false
WEBHOOK_EVENTS_GROUP_PARTICIPANTS_UPDATE=false
WEBHOOK_EVENTS_CONNECTION_UPDATE=true
WEBHOOK_EVENTS_LABELS_EDIT=false
WEBHOOK_EVENTS_LABELS_ASSOCIATION=false
WEBHOOK_EVENTS_CALL=false
WEBHOOK_EVENTS_TYPEBOT_START=false
WEBHOOK_EVENTS_TYPEBOT_CHANGE_STATUS=false
WEBHOOK_EVENTS_ERRORS=false
WEBHOOK_EVENTS_ERRORS_WEBHOOK=

CONFIG_SESSION_PHONE_CLIENT=AnabellaLuna
CONFIG_SESSION_PHONE_NAME=Chrome

QRCODE_LIMIT=30
QRCODE_COLOR=#198754

# Integración: solo Baileys (WhatsApp personal/business sin API oficial)
INTEGRATION_OPENAI_ENABLED=false
INTEGRATION_TYPEBOT_ENABLED=false
EOF

ok ".env de Evolution API configurado"

# ── 8. Generar Prisma client y migrar BD ─────────────────────
log "Generando Prisma client y migrando base de datos..."
cd "$EVOLUTION_DIR"
npm run db:generate || fail "db:generate falló"
npm run db:deploy   || fail "db:deploy falló"
ok "Base de datos migrada"

# ── 9. Build ──────────────────────────────────────────────────
log "Compilando Evolution API..."
cd "$EVOLUTION_DIR"
npm run build || fail "build falló"
ok "Build completado"

# ── 10. Iniciar con PM2 ───────────────────────────────────────
log "Iniciando Evolution API con PM2..."
cd "$PROJECT_DIR"

if pm2 describe evolution-api > /dev/null 2>&1; then
  pm2 restart evolution-api --update-env
  ok "PM2 'evolution-api' reiniciado"
else
  pm2 start "$EVOLUTION_DIR/dist/main.js" \
    --name "evolution-api" \
    --cwd "$EVOLUTION_DIR" \
    --max-memory-restart 512M \
    --restart-delay 5000 \
    --max-restarts 10 \
    -- --max-old-space-size=512
  ok "PM2 'evolution-api' iniciado"
fi

pm2 save
ok "Estado PM2 guardado"

# ── 11. Verificar ────────────────────────────────────────────
sleep 3
log "Verificando Evolution API en http://localhost:8080..."
if curl -sf -H "apikey: $EVOLUTION_API_KEY" http://localhost:8080/server/info > /dev/null 2>&1; then
  ok "Evolution API respondiendo correctamente"
else
  warn "Evolution API no responde todavía — revisar: pm2 logs evolution-api"
fi

echo ""
log "═══════════════════════════════════════════════════"
log "  ✅ SETUP COMPLETADO"
log "═══════════════════════════════════════════════════"
log ""
log "  Evolution API:  http://localhost:8080"
log "  API Key:        $EVOLUTION_API_KEY"
log "  Webhook → backend: $WEBHOOK_GLOBAL_URL"
log ""
log "  Logs: pm2 logs evolution-api"
