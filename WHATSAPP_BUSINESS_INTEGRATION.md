# WhatsApp Business Integration — Mensajería Interna

> Módulo de mensajería estilo WhatsApp Web integrado en Admin y CRM.
> **Migrado de Meta Cloud API a Evolution API (QR-based, multi-sesión)** — Sprint 1 completado 2026-06-04.

---

## Estado general

| Fase | Descripción | Estado |
|------|-------------|--------|
| 1 | Backend: Modelos de datos | ✅ Completado |
| 2 | Backend: WhatsApp Service + Webhook | ✅ Completado |
| 3 | Backend: Rutas API internas | ✅ Completado |
| 4 | Backend: Socket.IO eventos WhatsApp | ✅ Completado |
| 5 | Frontend: Layout 3 columnas + Sidebar | ✅ Completado |
| 6 | Frontend: Área de conversación + Burbujas | ✅ Completado |
| 7 | Frontend: Input bar (texto, media, templates) | ✅ Completado |
| 8 | Frontend: Panel de info de contacto/CRM | ✅ Completado |
| 9 | Frontend: Servicio API cliente | ✅ Completado |
| 10 | Integración CRM: vinculación contactos | ✅ Completado |
| 11 | Broadcast / envío masivo | ✅ Completado |
| 12 | Gestión de templates | ✅ Completado |
| **Sprint 1** | **Migración a Evolution API + Multi-Proveedor** | **✅ Completado (2026-06-04)** |

---

## Arquitectura

```
Meta Cloud API (WhatsApp)
        │  webhook POST /whatsapp/webhook
        ▼
backend/routes/whatsapp.js
        │
backend/services/whatsappService.js
        │
   ┌────┴────────────────────┐
   │                         │
MongoDB                   Socket.IO
(WhatsAppMessage,          │
 WhatsAppConversation,     ▼
 WhatsAppContact,    Admin/CRM Frontend
 WhatsAppTemplate)   (Mensajeria.jsx refactored)
```

---

## Variables de entorno requeridas

Agregar al archivo `backend/.env`:

```env
# WhatsApp Business API (Meta Cloud API)
WHATSAPP_ACCESS_TOKEN=       # Token de acceso permanente de la app de Meta
WHATSAPP_PHONE_NUMBER_ID=    # ID del número de teléfono en Meta Business
WHATSAPP_BUSINESS_ACCOUNT_ID= # ID de la cuenta de WhatsApp Business
WHATSAPP_WEBHOOK_VERIFY_TOKEN= # Token secreto para verificar el webhook (lo defines vos)
```

---

## Archivos creados

### Backend

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `backend/models/WhatsAppConversation.js` | Conversación con un contacto externo | ✅ |
| `backend/models/WhatsAppMessage.js` | Mensaje individual con status Meta | ✅ |
| `backend/models/WhatsAppContact.js` | Contacto de WhatsApp (puede linkearse a Cliente CRM) | ✅ |
| `backend/models/WhatsAppTemplate.js` | Plantillas aprobadas por Meta | ✅ |
| `backend/services/whatsappService.js` | Envío de mensajes, descarga de media, sync de templates | ✅ |
| `backend/routes/whatsapp.js` | Webhook + API interna REST | ✅ |

### Frontend (Admin)

| Archivo | Descripción | Estado |
|---------|-------------|--------|
| `admin/src/pages/Mensajeria.jsx` | Refactor completo — layout WhatsApp Web | ✅ |
| `admin/src/components/whatsapp/WhatsAppSidebar.jsx` | Lista de conversaciones con filtros y búsqueda | ✅ |
| `admin/src/components/whatsapp/WhatsAppChat.jsx` | Área de conversación con burbujas | ✅ |
| `admin/src/components/whatsapp/WhatsAppInputBar.jsx` | Composer: texto, media, emojis, templates | ✅ |
| `admin/src/components/whatsapp/MessageBubble.jsx` | Burbuja con tipo, status (ticks), timestamps | ✅ |
| `admin/src/components/whatsapp/WhatsAppContactInfo.jsx` | Panel derecho: info del cliente + CRM link | ✅ |
| `admin/src/components/whatsapp/WhatsAppTemplateSelector.jsx` | Modal para seleccionar templates Meta | ✅ |
| `admin/src/services/whatsappService.js` | API client para el módulo WhatsApp | ✅ |

---

## API Routes (Backend)

```
# Webhook Meta
GET  /whatsapp/webhook          → verificación del webhook (Meta challenge)
POST /whatsapp/webhook          → mensajes entrantes + status updates

# Conversaciones
GET  /whatsapp/conversations                    → lista con último mensaje + unread count
GET  /whatsapp/conversations/:id/messages       → historial paginado
PATCH /whatsapp/conversations/:id/assign        → asignar a agente
PATCH /whatsapp/conversations/:id/read         → marcar como leído
PATCH /whatsapp/conversations/:id/label        → agregar etiqueta

# Envío de mensajes
POST /whatsapp/conversations/:id/send          → enviar texto / media / template

# Contactos
GET  /whatsapp/contacts                        → lista de contactos
POST /whatsapp/contacts/:id/link-cliente       → vincular a Cliente CRM
POST /whatsapp/contacts                        → crear contacto manualmente

# Templates
GET  /whatsapp/templates                       → plantillas aprobadas por Meta
POST /whatsapp/templates/sync                  → sincronizar con Meta API

# Broadcast
POST /whatsapp/broadcast                       → envío masivo con template

# Estadísticas
GET  /whatsapp/stats                           → métricas (volumen, tiempos de respuesta)
```

---

## Socket.IO — Eventos WhatsApp

```js
// Servidor → Cliente (frontend)
'whatsapp:message'          // nuevo mensaje entrante (en tiempo real)
'whatsapp:status'           // actualización de status (sent/delivered/read)
'whatsapp:conversation_new' // nuevo contacto escribió por primera vez

// Cliente → Servidor (no necesario, se usa REST para envíos)
```

---

## Modelos de datos

### WhatsAppConversation
```js
{
  contactId,          // ref WhatsAppContact
  clienteId,          // ref Cliente (CRM) — null si no está vinculado
  assignedAgentId,    // ref Agente
  status: 'open' | 'closed' | 'pending',
  windowExpiresAt,    // ventana de 24h de Meta
  unreadCount,
  lastMessage: { content, type, direction, timestamp },
  labels: [String],
  metadata: {}
}
```

### WhatsAppMessage
```js
{
  conversationId,     // ref WhatsAppConversation
  contactId,          // ref WhatsAppContact
  waMessageId,        // ID devuelto por Meta (para tracking de status)
  direction: 'inbound' | 'outbound',
  type: 'text' | 'image' | 'document' | 'audio' | 'video' | 'template' | 'interactive' | 'sticker',
  content: {
    text,
    mediaUrl,         // URL interna (MinIO/Cloudinary, descargado de Meta)
    mediaId,          // ID de Meta (original)
    caption,
    filename,
    templateName,
    templateParams: [],
  },
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed',
  statusAt: { sent, delivered, read },
  agentId,            // quién lo envió (si es outbound)
  errorDetails,       // detalles si status='failed'
}
```

### WhatsAppContact
```js
{
  phoneNumber,        // con código de país, sin +
  displayName,
  profilePicUrl,
  clienteId,          // ref Cliente CRM (null si no vinculado)
  isBlocked,
  firstContactAt,
  lastContactAt,
}
```

### WhatsAppTemplate
```js
{
  metaTemplateId,
  name,
  language,
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION',
  status: 'APPROVED' | 'PENDING' | 'REJECTED',
  components: [],     // header, body, footer, buttons
  syncedAt,
}
```

---

## Consideraciones técnicas importantes

### Ventana de 24 horas (Customer Service Window)
Meta solo permite mensajes de texto libre durante las 24 horas siguientes al último mensaje del cliente.
Después de ese período, **solo se pueden enviar templates aprobados**.
La UI debe mostrar un banner cuando la ventana esté por vencer o cerrada.

### HTTPS obligatorio para el webhook
Meta requiere HTTPS para el endpoint del webhook. Asegurarse de que el backend esté expuesto con SSL.

### Descarga de media
Meta no almacena los archivos multimedia indefinidamente. El webhook recibe un `media_id`.
El servicio debe descargar el archivo inmediatamente y guardarlo en MinIO/Cloudinary.

### Rate limits de Meta
- Tier 1: 1.000 conversaciones únicas por día
- El tier sube automáticamente según el volumen y calidad de las conversaciones

### Templates — aprobación previa
Cualquier template debe enviarse a revisión por Meta y ser aprobado antes de usarse.
El proceso tarda entre 24 y 72 horas. Mínimo recomendado para arrancar:
1. Template de bienvenida/contacto inicial
2. Template de seguimiento de propiedad
3. Template de confirmación de cita

---

## Setup paso a paso (Meta Developer Console)

1. Ir a [Meta for Developers](https://developers.facebook.com) → Crear app → Tipo: Business
2. Agregar producto: **WhatsApp**
3. En **Getting Started**: elegir o crear una cuenta de WhatsApp Business
4. Obtener `Phone Number ID` y `WhatsApp Business Account ID`
5. Generar un **System User Token** permanente desde Business Manager
6. Configurar el **Webhook**:
   - URL: `https://tu-dominio.com/whatsapp/webhook`
   - Verify Token: el valor de `WHATSAPP_WEBHOOK_VERIFY_TOKEN` en tu `.env`
   - Suscribir a: `messages`, `message_deliveries`, `message_reads`

---

## Dependencias

### Backend (agregar a `backend/package.json`)
```bash
npm install axios form-data  # ya pueden estar instalados
```

### Frontend Admin (opcional, si se quiere audio player)
```bash
# No se requieren dependencias nuevas obligatorias
# Emoji picker nativo con input de texto es suficiente para MVP
```

---

## Progreso del desarrollo

### Sesión 1 — 2026-06-04
- [x] Planificación completa documentada
- [x] Creado archivo de progreso `WHATSAPP_BUSINESS_INTEGRATION.md`
- [x] Backend: Modelos de datos (WhatsAppContact, WhatsAppConversation, WhatsAppMessage, WhatsAppTemplate)
- [x] Backend: WhatsApp Service (sendTextMessage, sendTemplateMessage, sendMediaMessage, downloadMedia, markAsRead, getTemplates)
- [x] Backend: Rutas + Webhook (GET/POST /webhook, conversaciones, contactos, templates, broadcast, stats)
- [x] Backend: Registro en server.js (`app.use('/whatsapp', whatsappRoutes)`)
- [x] Backend: Socket.IO — función `emitToAll` agregada a socket.js
- [x] Frontend: Refactor Mensajeria.jsx (tabs WhatsApp / Chat Interno, layout 3 columnas)
- [x] Frontend: Componentes WhatsApp (WhatsAppSidebar, WhatsAppChat, WhatsAppInputBar, MessageBubble, WhatsAppContactInfo, WhatsAppTemplateSelector)
- [x] Frontend: whatsappService.js (API client completo)

---

*Documento actualizado automáticamente durante el desarrollo.*
