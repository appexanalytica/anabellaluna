#!/usr/bin/env bash
# ============================================================================
# Anabella Luna — AI Infrastructure Setup (native WSL, sin Docker)
# ============================================================================
# Instala y configura:
#   1. Redis 7
#   2. PostgreSQL 16 + pgvector
#   3. Langfuse self-hosted (Node.js)
#
# Uso:
#   chmod +x setup-ai-infra.sh
#   ./setup-ai-infra.sh
# ============================================================================

set -euo pipefail

# ── Colores ──────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# ── Variables (editables) ────────────────────────────────────────────────────
AI_DB_NAME="anabella_ai"
AI_DB_USER="ai_user"
AI_DB_PASS="$(openssl rand -hex 16)"

LANGFUSE_DB_NAME="langfuse"
LANGFUSE_DB_USER="langfuse"
LANGFUSE_DB_PASS="$(openssl rand -hex 16)"
LANGFUSE_SECRET="$(openssl rand -base64 32)"
LANGFUSE_SALT="$(openssl rand -base64 32)"
LANGFUSE_ENCRYPTION_KEY="$(openssl rand -hex 32)"

INTERNAL_SERVICE_KEY="$(openssl rand -hex 32)"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/ai.env"
INIT_SQL="$SCRIPT_DIR/ai-gateway/infrastructure/postgres/init.sql"

# ============================================================================
# 1. REDIS
# ============================================================================
info "Instalando Redis..."
if command -v redis-server &>/dev/null; then
  warn "Redis ya instalado: $(redis-server --version)"
else
  sudo apt-get update -qq
  sudo apt-get install -y redis-server
fi

sudo systemctl enable redis-server --now 2>/dev/null || sudo service redis-server start
redis-cli ping | grep -q PONG && info "Redis OK — PONG" || error "Redis no responde"

# ============================================================================
# 2. POSTGRESQL 16 + PGVECTOR
# ============================================================================
info "Instalando PostgreSQL 16..."
if command -v psql &>/dev/null; then
  PG_VERSION=$(psql --version | grep -oP '\d+' | head -1)
  warn "PostgreSQL ya instalado: versión $PG_VERSION"
else
  # Agregar repo oficial de PostgreSQL si no existe
  if [ ! -f /etc/apt/sources.list.d/pgdg.list ]; then
    sudo apt-get install -y curl ca-certificates gnupg
    curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/postgresql-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/postgresql-keyring.gpg] http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
    sudo apt-get update -qq
  fi
  sudo apt-get install -y postgresql-16
fi

# pgvector
info "Instalando pgvector..."
if dpkg -l | grep -q postgresql-16-pgvector 2>/dev/null; then
  warn "pgvector ya instalado"
else
  sudo apt-get install -y postgresql-16-pgvector
fi

sudo systemctl enable postgresql --now 2>/dev/null || sudo service postgresql start

# ── Crear usuarios y bases de datos ──────────────────────────────────────────
info "Configurando bases de datos..."

sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
-- AI Database
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${AI_DB_USER}') THEN
    CREATE ROLE ${AI_DB_USER} LOGIN PASSWORD '${AI_DB_PASS}';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${AI_DB_NAME} OWNER ${AI_DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${AI_DB_NAME}')
\gexec

-- Langfuse Database
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${LANGFUSE_DB_USER}') THEN
    CREATE ROLE ${LANGFUSE_DB_USER} LOGIN PASSWORD '${LANGFUSE_DB_PASS}';
  END IF;
END
\$\$;

SELECT 'CREATE DATABASE ${LANGFUSE_DB_NAME} OWNER ${LANGFUSE_DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${LANGFUSE_DB_NAME}')
\gexec
SQL

# Habilitar extensiones en la DB de AI
sudo -u postgres psql -d "${AI_DB_NAME}" -v ON_ERROR_STOP=1 <<SQL
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
GRANT ALL PRIVILEGES ON DATABASE ${AI_DB_NAME} TO ${AI_DB_USER};
GRANT ALL ON SCHEMA public TO ${AI_DB_USER};
SQL

# Ejecutar init.sql (tablas de semantic memory, etc.)
if [ -f "$INIT_SQL" ]; then
  info "Ejecutando init.sql..."
  sudo -u postgres psql -d "${AI_DB_NAME}" -f "$INIT_SQL"
else
  warn "No se encontró $INIT_SQL — skipping"
fi

info "PostgreSQL + pgvector OK"

# ============================================================================
# 3. LANGFUSE SELF-HOSTED
# ============================================================================
info "Configurando Langfuse..."

# Langfuse necesita Node.js >= 18
if ! command -v node &>/dev/null; then
  error "Node.js no encontrado. Instalalo primero: https://nodejs.org"
fi

# Crear un directorio para Langfuse
LANGFUSE_DIR="$SCRIPT_DIR/langfuse-local"
if [ ! -d "$LANGFUSE_DIR" ]; then
  mkdir -p "$LANGFUSE_DIR"
fi

# Crear script de arranque para Langfuse
cat > "$LANGFUSE_DIR/start-langfuse.sh" <<LANGFUSE_SCRIPT
#!/usr/bin/env bash
# Arrancar Langfuse self-hosted
export DATABASE_URL="postgresql://${LANGFUSE_DB_USER}:${LANGFUSE_DB_PASS}@localhost:5432/${LANGFUSE_DB_NAME}"
export NEXTAUTH_URL="http://localhost:3010"
export NEXTAUTH_SECRET="${LANGFUSE_SECRET}"
export SALT="${LANGFUSE_SALT}"
export ENCRYPTION_KEY="${LANGFUSE_ENCRYPTION_KEY}"
export TELEMETRY_ENABLED="false"
export PORT=3010

echo "Iniciando Langfuse en http://localhost:3010 ..."
npx langfuse
LANGFUSE_SCRIPT
chmod +x "$LANGFUSE_DIR/start-langfuse.sh"

info "Langfuse configurado. Iniciar con: ./langfuse-local/start-langfuse.sh"

# ============================================================================
# 4. GENERAR ai.env
# ============================================================================
info "Generando $ENV_FILE..."

cat > "$ENV_FILE" <<ENVFILE
# ============================================================================
# AI Infrastructure — Generado por setup-ai-infra.sh el $(date +%Y-%m-%d)
# ============================================================================

# ── PostgreSQL (semantic memory + pgvector) ──────────────────────────────────
POSTGRES_DB=${AI_DB_NAME}
POSTGRES_USER=${AI_DB_USER}
POSTGRES_PASSWORD=${AI_DB_PASS}
DATABASE_AI_URL=postgresql://${AI_DB_USER}:${AI_DB_PASS}@localhost:5432/${AI_DB_NAME}

# ── Redis ────────────────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ── Service Auth ─────────────────────────────────────────────────────────────
INTERNAL_SERVICE_KEY=${INTERNAL_SERVICE_KEY}

# ── Langfuse (self-hosted) ───────────────────────────────────────────────────
LANGFUSE_DB_NAME=${LANGFUSE_DB_NAME}
LANGFUSE_DB_USER=${LANGFUSE_DB_USER}
LANGFUSE_DB_PASSWORD=${LANGFUSE_DB_PASS}
LANGFUSE_URL=http://localhost:3010
LANGFUSE_SECRET=${LANGFUSE_SECRET}
LANGFUSE_SALT=${LANGFUSE_SALT}
LANGFUSE_ENCRYPTION_KEY=${LANGFUSE_ENCRYPTION_KEY}
ENVFILE

info "ai.env generado con secrets aleatorios"

# ============================================================================
# 5. RESUMEN
# ============================================================================
echo ""
echo "============================================================================"
echo -e "${GREEN} INFRAESTRUCTURA AI INSTALADA${NC}"
echo "============================================================================"
echo ""
echo "  Redis:         redis://localhost:6379"
echo "  PostgreSQL:    postgresql://${AI_DB_USER}:****@localhost:5432/${AI_DB_NAME}"
echo "  Langfuse DB:   postgresql://${LANGFUSE_DB_USER}:****@localhost:5432/${LANGFUSE_DB_NAME}"
echo "  Langfuse UI:   http://localhost:3010 (iniciar con ./langfuse-local/start-langfuse.sh)"
echo ""
echo "  ai.env:        $ENV_FILE"
echo ""
echo "  Agregar a backend/.env:"
echo "    REDIS_URL=redis://localhost:6379"
echo "    INTERNAL_SERVICE_KEY=${INTERNAL_SERVICE_KEY}"
echo "    DATABASE_AI_URL=postgresql://${AI_DB_USER}:${AI_DB_PASS}@localhost:5432/${AI_DB_NAME}"
echo ""
echo "============================================================================"
