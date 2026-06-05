# Arquitectura WhatsApp Multi-Proveedor — Anabella Luna

> Versión: 1.0 | Fecha: 2026-06-05
> Sistema centralizado ERP + CRM + Mensajería WhatsApp con capa de abstracción `WhatsappProvider`

---

## Decisión arquitectural clave

| Item | Decisión |
|------|----------|
| Proveedor inicial | **Evolution API** (conexión por QR, sin Meta Business) |
| Abstracción | `WhatsappProvider` interface — el dominio nunca habla con Evolution directamente |
| Sesiones | Multi-sesión: admin puede conectar N números, cada agente puede conectar el suyo |
| Chat interno | **Eliminado** — WhatsApp reemplaza toda la mensajería |
| Ventana de 24h | No aplica con Evolution API (QR-based, no tiene restricción de plantillas) |

---

## Estructura de carpetas (backend)

```
backend/
├── domain/                          # Núcleo del negocio — sin dependencias externas
│   ├── entities/
│   │   ├── WhatsappSession.js       # Entidad sesión
│   │   ├── WhatsappConversation.js  # Entidad conversación
│   │   ├── WhatsappMessage.js       # Entidad mensaje
│   │   ├── WhatsappContact.js       # Entidad contacto
│   │   └── User.js                 # Entidad usuario/agente
│   ├── interfaces/
│   │   └── WhatsappProvider.js     # ← INTERFAZ CENTRAL (contrato)
│   └── repositories/
│       ├── ISessionRepository.js
│       ├── IConversationRepository.js
│       └── IMessageRepository.js
│
├── application/                     # Casos de uso — orquestan dominio e infraestructura
│   ├── whatsapp/
│   │   ├── CreateSession.js
│   │   ├── DeleteSession.js
│   │   ├── GetQrCode.js
│   │   ├── SendMessage.js
│   │   ├── ReceiveMessage.js
│   │   ├── ListConversations.js
│   │   └── AssignConversation.js
│   └── crm/
│       ├── LinkContactToCliente.js
│       └── CreateLeadFromWhatsApp.js
│
├── infrastructure/                  # Implementaciones concretas
│   ├── providers/
│   │   ├── EvolutionProvider.js     # Adaptador Evolution API ← implementa WhatsappProvider
│   │   ├── WPPConnectProvider.js    # Futuro — misma interfaz
│   │   └── CloudAPIProvider.js     # Futuro — misma interfaz
│   ├── db/
│   │   ├── models/
│   │   │   ├── WhatsAppSessionModel.js
│   │   │   ├── WhatsAppConversationModel.js
│   │   │   ├── WhatsAppMessageModel.js
│   │   │   └── WhatsAppContactModel.js
│   │   └── repositories/
│   │       ├── MongoSessionRepository.js
│   │       ├── MongoConversationRepository.js
│   │       └── MongoMessageRepository.js
│   └── redis/
│       └── RedisEventBus.js
│
├── adapters/                        # HTTP — routers Express
│   ├── http/
│   │   ├── whatsapp/
│   │   │   ├── sessionRoutes.js     # CRUD sesiones + QR
│   │   │   ├── webhookRoutes.js     # Webhook Evolution (sin auth)
│   │   │   ├── conversationRoutes.js
│   │   │   └── messageRoutes.js
│   │   └── crm/
│   │       └── contactRoutes.js
│   └── socket/
│       └── whatsappSocket.js        # Eventos Socket.IO WhatsApp
│
└── services/
    └── ProviderFactory.js           # Instancia el proveedor correcto según config
```

---

## La interfaz `WhatsappProvider`

```javascript
// backend/domain/interfaces/WhatsappProvider.js

/**
 * Contrato que TODOS los proveedores de WhatsApp deben implementar.
 * El dominio y los casos de uso SOLO hablan con esta interfaz.
 * NUNCA importar EvolutionProvider directamente desde fuera de infrastructure/.
 */
class WhatsappProvider {
  // ── Gestión de sesiones ────────────────────────────────────────────────────

  /** Crea una nueva sesión en el proveedor */
  async createSession(sessionName, userId) { throw new Error('Not implemented'); }

  /** Elimina la sesión del proveedor */
  async deleteSession(sessionName) { throw new Error('Not implemented'); }

  /** Inicia la sesión (si fue detenida) */
  async startSession(sessionName) { throw new Error('Not implemented'); }

  /** Detiene la sesión sin eliminarla */
  async stopSession(sessionName) { throw new Error('Not implemented'); }

  /** Devuelve el QR code como base64 string */
  async getQrCode(sessionName) { throw new Error('Not implemented'); }

  /** Devuelve el estado de la sesión */
  async getSessionStatus(sessionName) { throw new Error('Not implemented'); }

  // ── Envío de mensajes ──────────────────────────────────────────────────────

  /** Envía texto plano */
  async sendText(sessionName, to, text) { throw new Error('Not implemented'); }

  /** Envía una imagen con caption opcional */
  async sendImage(sessionName, to, imageUrl, caption) { throw new Error('Not implemented'); }

  /** Envía un documento */
  async sendDocument(sessionName, to, documentUrl, filename, caption) { throw new Error('Not implemented'); }

  /** Envía un audio */
  async sendAudio(sessionName, to, audioUrl) { throw new Error('Not implemented'); }

  /** Envía un video */
  async sendVideo(sessionName, to, videoUrl, caption) { throw new Error('Not implemented'); }

  // ── Lectura y gestión de chats ─────────────────────────────────────────────

  /** Obtiene lista de contactos de la sesión */
  async getContacts(sessionName) { throw new Error('Not implemented'); }

  /** Obtiene lista de chats de la sesión */
  async getChats(sessionName) { throw new Error('Not implemented'); }

  /** Archiva un chat */
  async archiveChat(sessionName, chatId) { throw new Error('Not implemented'); }

  /** Marca mensajes como leídos */
  async markAsRead(sessionName, chatId) { throw new Error('Not implemented'); }

  // ── Eventos (callbacks) ────────────────────────────────────────────────────

  /** Registro de handler para mensajes entrantes */
  onMessage(handler) { throw new Error('Not implemented'); }

  /** Registro de handler para ACKs (enviado/entregado/leído) */
  onMessageAck(handler) { throw new Error('Not implemented'); }

  /** Registro de handler para presencia (online/escribiendo) */
  onPresence(handler) { throw new Error('Not implemented'); }

  /** Registro de handler para cambios de estado de conexión */
  onConnectionState(handler) { throw new Error('Not implemented'); }
}

module.exports = WhatsappProvider;
```

---

## Adaptador `EvolutionProvider`

```javascript
// backend/infrastructure/providers/EvolutionProvider.js

const WhatsappProvider = require('../../domain/interfaces/WhatsappProvider');

/**
 * Implementación para Evolution API.
 * Toda la comunicación HTTP con Evolution queda encapsulada aquí.
 * Ningún otro módulo del sistema debe hacer llamadas directas a Evolution.
 */
class EvolutionProvider extends WhatsappProvider {
  constructor() {
    super();
    this.baseUrl = process.env.EVOLUTION_API_URL;   // ej: http://localhost:8080
    this.apiKey  = process.env.EVOLUTION_API_KEY;
  }

  _headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
    };
  }

  async _request(method, path, body = null) {
    const url = `${this.baseUrl}${path}`;
    const opts = {
      method,
      headers: this._headers(),
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Evolution API error [${res.status}]: ${err.message || JSON.stringify(err)}`);
    }
    return res.json().catch(() => null);
  }

  // ── Sesiones ───────────────────────────────────────────────────────────────

  async createSession(sessionName) {
    return this._request('POST', '/instance/create', {
      instanceName: sessionName,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    });
  }

  async deleteSession(sessionName) {
    return this._request('DELETE', `/instance/delete/${sessionName}`);
  }

  async startSession(sessionName) {
    return this._request('GET', `/instance/connect/${sessionName}`);
  }

  async stopSession(sessionName) {
    return this._request('DELETE', `/instance/logout/${sessionName}`);
  }

  async getQrCode(sessionName) {
    const data = await this._request('GET', `/instance/connect/${sessionName}`);
    return data?.base64 || data?.qrcode?.base64 || null;
  }

  async getSessionStatus(sessionName) {
    const data = await this._request('GET', `/instance/connectionState/${sessionName}`);
    return data?.instance?.state || 'DISCONNECTED';
  }

  // ── Mensajes ───────────────────────────────────────────────────────────────

  async sendText(sessionName, to, text) {
    return this._request('POST', `/message/sendText/${sessionName}`, {
      number: to,
      text,
    });
  }

  async sendImage(sessionName, to, imageUrl, caption = '') {
    return this._request('POST', `/message/sendMedia/${sessionName}`, {
      number: to,
      mediatype: 'image',
      media: imageUrl,
      caption,
    });
  }

  async sendDocument(sessionName, to, documentUrl, filename, caption = '') {
    return this._request('POST', `/message/sendMedia/${sessionName}`, {
      number: to,
      mediatype: 'document',
      media: documentUrl,
      fileName: filename,
      caption,
    });
  }

  async sendAudio(sessionName, to, audioUrl) {
    return this._request('POST', `/message/sendWhatsAppAudio/${sessionName}`, {
      number: to,
      audio: audioUrl,
    });
  }

  async sendVideo(sessionName, to, videoUrl, caption = '') {
    return this._request('POST', `/message/sendMedia/${sessionName}`, {
      number: to,
      mediatype: 'video',
      media: videoUrl,
      caption,
    });
  }

  // ── Chats y contactos ──────────────────────────────────────────────────────

  async getContacts(sessionName) {
    return this._request('GET', `/chat/findContacts/${sessionName}`);
  }

  async getChats(sessionName) {
    return this._request('GET', `/chat/findChats/${sessionName}`);
  }

  async archiveChat(sessionName, chatId) {
    return this._request('PUT', `/chat/archiveChat/${sessionName}`, {
      chat: chatId,
      archive: true,
    });
  }

  async markAsRead(sessionName, chatId) {
    return this._request('PUT', `/chat/markMessageAsRead/${sessionName}`, {
      readMessages: [{ id: chatId }],
    });
  }

  // ── Eventos (webhook — Evolution llama a tus endpoints) ───────────────────
  // Evolution no usa callbacks in-process — llama a tu webhook HTTP.
  // Estos métodos no aplican para Evolution; el webhook handler los procesa.

  onMessage(handler) { this._messageHandler = handler; }
  onMessageAck(handler) { this._ackHandler = handler; }
  onPresence(handler) { this._presenceHandler = handler; }
  onConnectionState(handler) { this._connectionHandler = handler; }
}

module.exports = EvolutionProvider;
```

---

## ProviderFactory — instanciación dinámica

```javascript
// backend/services/ProviderFactory.js

const EvolutionProvider = require('../infrastructure/providers/EvolutionProvider');

/**
 * El resto del sistema obtiene el proveedor activo SOLO a través de esta factory.
 * Para cambiar de Evolution a WPPConnect: cambiar WHATSAPP_PROVIDER en .env.
 */
function getWhatsappProvider() {
  const provider = process.env.WHATSAPP_PROVIDER || 'evolution';

  switch (provider) {
    case 'evolution':
      return new EvolutionProvider();
    // case 'wppconnect':
    //   return new WPPConnectProvider();
    // case 'cloudapi':
    //   return new CloudAPIProvider();
    default:
      throw new Error(`Unknown WhatsApp provider: ${provider}`);
  }
}

// Singleton — una instancia por proceso
let _instance = null;
function getProvider() {
  if (!_instance) _instance = getWhatsappProvider();
  return _instance;
}

module.exports = { getProvider };
```

---

## Modelo `WhatsAppSession` (actualizado para multi-sesión)

```javascript
// backend/models/WhatsAppSession.js
{
  sessionName: String,          // nombre único en Evolution (ej: "agente_juan_personal")
  userId: ObjectId,             // ref User (admin o agente propietario)
  agentId: ObjectId,            // ref Agente (null si es del admin)
  provider: String,             // 'evolution' | 'wppconnect' | 'cloudapi'
  phone: String,                // número conectado (disponible post-conexión)
  displayName: String,          // nombre WhatsApp
  status: {
    type: String,
    enum: ['CREATED','WAITING_QR','CONNECTED','DISCONNECTED','BLOCKED','ERROR'],
    default: 'CREATED',
  },
  isDefault: Boolean,           // sesión principal del usuario
  qrCodeBase64: String,         // QR actual (TTL: 30s, luego se regenera)
  lastSeen: Date,
  metadata: Object,             // datos adicionales del proveedor
}
```

---

## Flujo completo: mensaje entrante

```
1. Cliente envía mensaje desde su WhatsApp
        │
2. Evolution API → POST /whatsapp/webhook/evolution
        │
3. webhookRoutes.js — sin auth, verifica apikey header
        │
4. ReceiveMessage.js (caso de uso)
   ├── Busca/crea WhatsAppContact por número
   ├── Busca/crea WhatsAppConversation para (contactId, sessionName)
   ├── Asigna conversación al propietario de la sesión (agentId)
   ├── Descarga media si aplica → guarda en MinIO
   ├── Crea WhatsAppMessage en MongoDB
   └── Publica evento en Redis: 'whatsapp:new_message'
        │
5. Redis Event → Socket.IO handler
   ├── Emite 'whatsapp:message' a sala del agente asignado: user:{userId}
   └── Emite a sala admin si admin está subscripto
        │
6. Frontend React recibe el evento en tiempo real
   └── Actualiza lista de conversaciones y área de chat
```

---

## Flujo: conexión de una nueva sesión por QR

```
1. Admin/Agente hace click en "Conectar número"
        │
2. POST /whatsapp/sessions  → CreateSession.js
   ├── Crea registro WhatsAppSession en MongoDB (status: CREATED)
   └── Llama provider.createSession(sessionName)
        │
3. GET /whatsapp/sessions/:name/qr → GetQrCode.js
   └── Llama provider.getQrCode(sessionName)
        │
4. Frontend muestra QR como imagen (base64)
   └── Polling cada 5s hasta que status cambie a CONNECTED
        │
5. Usuario escanea QR con su teléfono
        │
6. Evolution → POST /whatsapp/webhook/evolution
   └── Evento: connection.update → status: CONNECTED + phone number
        │
7. Backend actualiza WhatsAppSession: status=CONNECTED, phone=..., displayName=...
        │
8. Socket.IO emite 'whatsapp:session_connected' al usuario
        │
9. Frontend cierra el modal de QR y muestra sesión activa
```

---

## Nuevas rutas API (sesiones)

```
# Sesiones — requiere authenticateToken
GET    /whatsapp/sessions              → listar mis sesiones (admin ve todas, agente ve las suyas)
POST   /whatsapp/sessions              → crear nueva sesión (llama a Evolution)
GET    /whatsapp/sessions/:name/qr     → obtener QR en base64
GET    /whatsapp/sessions/:name/status → estado de la sesión
DELETE /whatsapp/sessions/:name        → eliminar sesión
POST   /whatsapp/sessions/:name/stop   → desconectar sin eliminar
POST   /whatsapp/sessions/:name/start  → reconectar sesión existente

# Webhook Evolution — SIN auth, Evolution llama aquí
POST   /whatsapp/webhook/evolution     → mensajes entrantes, ACKs, connection updates

# Conversaciones — filtradas por agente (admin ve todas)
GET    /whatsapp/conversations                    → lista (filtra por agentId si no es admin)
GET    /whatsapp/conversations/:id/messages       → historial paginado
POST   /whatsapp/conversations/:id/send           → enviar mensaje
PATCH  /whatsapp/conversations/:id/assign         → reasignar a otro agente (solo admin)
PATCH  /whatsapp/conversations/:id/read           → marcar como leído
PATCH  /whatsapp/conversations/:id/status         → open/closed/pending
```

---

## Control de acceso (RBAC para WhatsApp)

| Acción | Admin | Agente |
|--------|-------|--------|
| Ver todas las sesiones | ✅ | ❌ (solo las propias) |
| Crear sesión | ✅ | ✅ |
| Eliminar sesión ajena | ✅ | ❌ |
| Ver todas las conversaciones | ✅ | ❌ (solo las de sus sesiones) |
| Reasignar conversación | ✅ | ❌ |
| Ver mensajes de conversación ajena | ✅ | ❌ |
| Enviar mensaje desde sesión ajena | ❌ | ❌ |

---

## Variables de entorno a agregar en `backend/.env`

```env
# WhatsApp Provider
WHATSAPP_PROVIDER=evolution

# Evolution API
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=tu_clave_evolution
EVOLUTION_WEBHOOK_SECRET=secreto_para_validar_webhook
```

---

## Instalación de Evolution API (Ubuntu 24.04, sin Docker)

```bash
# 1. Clonar y configurar
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api
cp .env.example .env
# Editar .env: AUTHENTICATION_API_KEY, DATABASE_URL, etc.

# 2. Instalar dependencias
npm install

# 3. Build
npm run build

# 4. Configurar PM2
pm2 start dist/main.js --name evolution-api

# 5. Configurar Nginx proxy para Evolution
# /etc/nginx/sites-available/evolution
server {
    listen 443 ssl;
    server_name evolution.anabellaluna.com.ar;
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Roadmap de implementación

### Sprint 1 — Core (semana 1-2) ✅ COMPLETADO (2026-06-04)
- [x] `backend/domain/interfaces/WhatsappProvider.js` — interfaz base con todos los métodos
- [x] `backend/infrastructure/providers/EvolutionProvider.js` — implementación Evolution API
- [x] `backend/services/ProviderFactory.js` — singleton con `getProvider()` / `resetProvider()`
- [x] `backend/models/WhatsAppSession.js` — schema con status enum, índices, qrCodeBase64
- [x] `backend/routes/whatsappSessions.js` — CRUD sesiones + QR + start/stop con RBAC
- [x] `backend/routes/whatsapp.js` — webhook Evolution (`POST /webhook/evolution`) + rutas API actualizadas
- [x] `backend/services/whatsappService.js` — reescrito para delegar al provider (eliminado Meta API)
- [x] `backend/models/WhatsAppConversation.js` — campo `sessionName` agregado
- [x] `backend/socket.js` — función `emitToRoom` agregada y exportada
- [x] `backend/server.js` — ruta `/whatsapp/sessions` registrada antes de `/whatsapp`
- [x] Lógica de asignación automática al propietario de la sesión (via `sessionName` en conversación)
- [x] Socket.IO: eventos `whatsapp:session_created`, `whatsapp:session_deleted`, `whatsapp:session_status`, `whatsapp:session_qr`, `whatsapp:message`, `whatsapp:status`

### Sprint 2 — UI Sesiones (semana 2-3) ✅ COMPLETADO
- [x] `admin/src/pages/WhatsAppSesiones.jsx` — gestión de sesiones con QR
- [x] `admin/src/components/whatsapp/QRModal.jsx` — modal QR con polling
- [x] `admin/src/components/whatsapp/SessionCard.jsx` — tarjeta de sesión con estado
- [x] `agents/src/pages/MisSesiones.jsx` — gestión de sesiones propias para agentes
- [x] `admin/src/services/whatsappService.js` — extendido con endpoints de sesiones
- [x] `agents/src/services/whatsappService.js` — extendido con endpoints de sesiones
- [x] `admin/src/App.js` — ruta `/whatsapp-sesiones` agregada
- [x] `admin/src/components/Sidebar.jsx` — ítem "Sesiones WA" agregado
- [x] `agents/src/App.js` — ruta `/crm/mis-sesiones` agregada
- [x] `agents/src/components/Sidebar.jsx` — ítem "Mi WhatsApp" agregado

### Sprint 3 — Permisos y filtros (semana 3) ✅ COMPLETADO (2026-06-05)
- [x] Helpers RBAC en `routes/whatsapp.js`: `isAdmin()`, `getRequestUserId()`, `getOwnedSessionNames()`, `canAccessConversation()`
- [x] `GET /whatsapp/conversations` — agente solo ve conversaciones de sus sesiones; admin ve todas
- [x] `GET /conversations/:id/messages` — verifica que el agente tenga acceso a la conversación
- [x] `POST /conversations/:id/send` — verifica acceso antes de enviar
- [x] `PATCH /conversations/:id/assign` — restringido a admin
- [x] `WhatsAppSidebar` — corregido mismatch `contact` vs `contactId` (populate); badge de sesión activo; búsqueda incluye sessionName
- [x] Sidebar sincronizado entre admin y agents apps

### Sprint 4 — Futuros proveedores
- [ ] `WPPConnectProvider.js` — misma interfaz, distinta implementación
- [ ] `CloudAPIProvider.js` — para migrar a API oficial si se necesita

---

## Migración desde Meta Cloud API

El sistema actual usa `Meta Cloud API` (webhook de Meta, templates obligatorios, ventana de 24h).
Con `EvolutionProvider` (QR-based):
- No hay restricción de 24h
- No se necesita cuenta Meta Business verificada
- No hay templates obligatorios
- Se pueden conectar números personales y corporativos

**Los modelos de MongoDB son compatibles** — solo cambia el backend de provider.
El frontend no necesita cambios de fondo (ya no hay lógica de templates/ventana).

---

## Eventos Socket.IO (actualizados)

```javascript
// Servidor → Cliente
'whatsapp:message'              // nuevo mensaje (entrante o saliente)
'whatsapp:status'               // ACK: sent/delivered/read
'whatsapp:conversation_new'     // nueva conversación iniciada
'whatsapp:session_connected'    // sesión QR conectada exitosamente
'whatsapp:session_disconnected' // sesión desconectada
'whatsapp:session_qr'          // nuevo QR disponible (para polling)
```

---

*Documento actualizado: 2026-06-05*
