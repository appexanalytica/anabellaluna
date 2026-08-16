# Plan de reconstrucción de la Navbar (Admin + Agentes)

> Relevamiento y plan de modificaciones. Estado: **aprobado, en implementación**.
> Fecha: 2026-08-15 · Alcance: `admin/src/components/Navbar.jsx`, `agents/src/components/Navbar.jsx`,
> paneles asociados (`Propiedades`, `Tareas`, `Alertas`, `ConsultasDropdown`, `RewardsPanel`),
> y los endpoints que los alimentan (`/crm/navbar-summary`, `/admin/notifications/*`, `/crm/notifications/*`).

## Decisiones tomadas (2026-08-15)

- **Propiedades sale de la navbar.** Queda en el sidebar. Se elimina el botón y el panel.
- **Tareas y Citas van separados**, cada uno con su badge y su panel.
- **Recompensas sale de la navbar** (agentes): se eliminan el trofeo y el `RewardsPanel`. La página
  `/crm/recompensas` queda intacta y `rewards.recordLogin()` se mueve a `App.js` para no romper la racha de logins.
- **Push real**: se implementa el disparador que hoy falta. El aviso in-app se silencia cuando la pestaña está visible
  para no duplicar. En iOS sólo funciona con la PWA instalada (iOS 16.4+), ya detectado por el hook.
- **Elementos nuevos aprobados**: menú de perfil con Cerrar sesión · búsqueda global Ctrl+K · botón "+ Nuevo" ·
  chip de próxima cita (sólo agentes).
- **Indicadores de estado** (WhatsApp, "actualizado hace X", SLA de consultas): postergados.
- **Alcance de la entrega**: el plan completo, Fases 0 a 6.

---

## 1. Diagnóstico

### A. Los contadores están mal calculados (backend)

| # | Problema | Dónde | Efecto visible |
|---|---|---|---|
| A1 | Se cuentan tareas "pendientes" con `kanbanColumn: { $ne: 'done' }`, pero **`'done'` no existe**: las columnas reales son `pendiente · en_progreso · en_revision · completada · cancelada` (`admin/src/pages/Tareas.jsx:29`) | `backend/routes/crm.js:29-46`, `backend/routes/adminNotifications.js:88-92` | El badge de Tareas incluye tareas **completadas y canceladas**. Nunca baja. |
| A2 | Se filtra por `fechaVencimiento`, campo que **no existe** en el modelo (`Tarea` usa `dueDate`) | `backend/routes/crm.js:38`, `adminNotifications.js:90` y `:235` | `tareas.hoy` siempre da 0 → el punto rojo "hoy" nunca aparece; en admin las alertas de "tarea vencida" **nunca se generan**. |
| A3 | Citas: `estado: { $ne: 'cancelada' }` en minúscula, pero el enum es `'Cancelada'` (`backend/models/Cita.js:13`) | `crm.js:52,60`, `adminNotifications.js:93-94` | Las citas canceladas **se siguen contando** como pendientes. |
| A4 | `tareas.total = tareasPendientes + citasPendientes`, y `citasPendientes` son **todas** las citas futuras sin límite temporal | ídem | Badge permanente de dos dígitos que no representa nada accionable. |
| A5 | El badge de Propiedades es `propiedades.disponibles` (inventario) | `Navbar.jsx:192` (admin), `:239` (agents) | Un badge rojo de "87" que nunca llega a cero. No es una notificación. |

### B. Contadores duplicados ("los contadores repiten")

Un mismo hecho de negocio se cuenta en 2 o 3 lugares:

- **B1** Una consulta web suma en el badge de **Consultas** (Activity sin leer) **y además** genera una `Notification` tipo `consulta_web` que suma en el badge de **Alertas**. (`adminNotifications.js:143-163`, `notifications.js:382-403`)
- **B2** Una `visit_scheduled` suma en **Consultas**, aparece en el panel de **Tareas** (`admin/src/components/Tareas.jsx:90-106`) y genera notificación → hasta 3 lugares.
- **B3** Tareas vencidas y "citas de hoy" generan notificaciones → cuentan en **Alertas** además del badge de **Tareas**.
- **B4** El dedupe `alreadyNotified()` sólo mira **el día actual** (`createdAt: { $gte: todayStart }`). Un ítem que sigue sin leer o vencido genera **una notificación nueva cada día, para siempre**. El panel se llena de copias del mismo aviso.

### C. El centro de Alertas no funciona como centro de notificaciones

- **C1** Al abrir el panel se marca **todo como leído automáticamente** (`admin/src/components/Alertas.jsx:68-70`, `agents/.../Alertas.jsx:72-73`). Consecuencias: nunca ves cuál es nueva; el contador interno queda fijo en `0`; el botón "Marcar todas como leídas" está **permanentemente deshabilitado**; el punto rojo por ítem nunca se renderiza.
- **C2** La navbar pone el badge en `0` de forma optimista al hacer click, aunque la request falle (`Navbar.jsx:164` y `:195` admin).
- **C3** La notificación nativa (`new Notification(...)`, `Navbar.jsx:85-93`) dispara con `prevNoLeidas` inicializado en `0` → **suena en cada recarga de página** ("Tenés 5 nuevas notificaciones"), y vuelve a sonar cada vez que el panel resetea el contador y el poll lo vuelve a subir.
- **C4** No hay canal en vivo: sólo polling de 30 s. La infra de eventos (Redis Streams) y de web-push existe pero nada publica hacia la navbar.

### D. Notificaciones que llevan a lugares que no existen

- **D1** Admin → "Ver más" navega a `/clientes-crm?id=…` (`admin/src/components/Alertas.jsx:173`). **Esa ruta no existe** (es `/clientes`, `admin/src/App.js:414`) → cae en el wildcard → vuelve al dashboard.
- **D2** Agentes → notificación de operación con `accionUrl: '/ventas'` (`backend/routes/notifications.js:470`) → el panel lo prefija a `/crm/ventas`, que **no existe** (la ruta es `operaciones`) → wildcard → `/` → **pantalla de login**.
- **D3** Las notificaciones `consulta_web` llevan `entidadTipo: 'cliente'` con `entidadId = Activity._id` (`adminNotifications.js:157-160`, `notifications.js:397-400`) → "Ver más" abre la ficha de clientes filtrada por un id **que no es un cliente**. Debería ir a `/consultas?id=…&origen=activity`.
- **D4** El panel de Alertas de agentes ofrece "Configurar alertas" y "Ver Centro de Automatización" (`agents/.../Alertas.jsx:223,236`), pero esas alertas se generan por un job hardcodeado en backend: **desde ahí no se configura nada de esto**. Promesa falsa.
- **D5** `NotificationPrompt` pide activar notificaciones push prometiendo "alertas en tiempo real", pero **ningún evento de negocio dispara un push**: `backend/routes/push.js` sólo expone `/test`, `/send` y `/send-role` manuales; nadie los llama.

### E. Miniaturas e identidad

- **E1** La navbar de **admin** lee `authService.getCurrentUser()` en el render, sin estado y **sin escuchar el evento `userUpdated`** que sí emite `admin/src/services/authService.js:109`. Resultado: cambiás tu foto o tu nombre en Mi Perfil y la navbar sigue mostrando el anterior hasta recargar. La de agentes sí lo escucha (`agents/.../Navbar.jsx:79-85`) — hay que igualar.
- **E2** `style={{ ringColor: currentColor }}` (ambas apps, avatar de escritorio) **no es una propiedad CSS válida**: React la descarta y el anillo se pinta con el color por defecto de Tailwind, no con el color del tema.
- **E3** El `<img>` del avatar no tiene `onError` → si el base64 está corrupto o vacío se ve el ícono de imagen rota en vez del avatar por defecto.
- **E4** Los paneles usan **emoji en lugar de miniaturas reales**: 🏠 / 📅 / ✉️ en Consultas, y un emoji por tipo en Propiedades. La portada real existe (`coverUrl`, `backend/routes/propiedades.js:69`) pero **se sirve autenticada**: hay que bajarla con `Authorization` y convertirla a blob, como ya hace `admin/src/pages/Propiedades.jsx:806-834`. Un `<img src>` directo da 401 y se ve rota.
- **E5** El panel de Tareas de agentes mapea `titulo / descripcion / prioridad / fechaVencimiento` (`agents/src/components/Tareas.jsx:70-84`) pero el modelo tiene `title / description / priority / dueDate` → **todas las filas muestran "Sin título" y "Sin fecha"**.

### F. Estructura y UX de la navbar

- **F1** `handleClick` no togglea (`contexts/ContextProvider.js:39` en ambas apps): hacer click de nuevo en el mismo ícono **no cierra** el panel.
- **F2** Desktop y mobile no coinciden: admin en mobile tiene Propiedades pero **no** Tareas; agentes en mobile tiene Tareas pero **no** Propiedades ni Logros.
- **F3** Dos patrones de contenedor distintos: `Alertas` y `Consultas` usan el responsive `fixed inset-x-4 top-20 … max-w-96`; `Propiedades`, `Tareas` y `RewardsPanel` usan `absolute right-5 w-96` → en mobile se desbordan y quedan tapados por la barra superior.
- **F4** `window.location.href` en los paneles de Propiedades/Tareas de admin y Tareas de agentes → **recarga completa** de la SPA en cada navegación.
- **F5** Código muerto: `Notification.jsx` y `UserProfile.jsx` se exportan pero **no se renderizan en ninguna de las dos apps**; el `initialState` arrastra claves del template original (`chat`, `cart`, `userProfile`, `notification`).
- **F6** `RewardsPanel onClose={() => handleClick('')}` (`agents/.../Navbar.jsx:322`) crea una clave espuria `''` en el estado.
- **F7** Accesibilidad: paneles son `div` con `onClick` (sin `role`, sin `aria-label`, sin cerrar con `Escape`, sin foco atrapado); los badges no tienen `aria-live`.
- **F8** Cada panel vuelve a pedir `navbar.getSummary()` al abrirse (`Propiedades.jsx:38`, `Tareas.jsx:49`) además del poll de 30 s de la navbar → llamadas redundantes.

---

## 2. Modelo objetivo

**Regla única: la navbar sólo muestra eventos accionables sin leer, y cada evento pertenece a un solo grupo.**

| Grupo | Qué cuenta | Badge |
|---|---|---|
| **Consultas** | Leads del sitio: consultas de propiedad + solicitudes de visita + formulario de contacto, sin leer | Rojo |
| **Tareas** | Sólo tareas **vencidas** + **de hoy**. Nunca el backlog completo | Ámbar |
| **Citas** | Sólo citas de **hoy** + las **próximas 24 h**, excluyendo canceladas | Violeta |
| **Alertas** | Sistema y negocio que **no** está representado en otro badge: operaciones nuevas, contratos por vencer, cambios de estado de propiedad, metas | Rojo, con punto extra si hay urgentes |
| **Perfil** | Menú: Mi Perfil · Seguridad · Tema · Cerrar sesión | Sin badge |
| **Buscar / + Nuevo** | Acciones, no estado | Sin badge |

Fuera de la navbar: **Propiedades** (vive en el sidebar) y **Logros** (vive en `/crm/recompensas`).

Todos los números salen de **un único endpoint** por app, calculado por **un helper compartido** para que admin y agentes no vuelvan a divergir.

```js
// GET /crm/navbar-summary  y  GET /admin/notifications/navbar-summary
{
  consultas: { noLeidas, propiedades, contacto },
  tareas:    { vencidas, hoy, total },                 // total = vencidas + hoy
  citas:     { hoy, proximas24h, total },              // total = hoy + proximas24h
  alertas:   { noLeidas, urgentes },
  proximaCita: { id, titulo, fecha } | null,           // sólo agentes, para el chip
  updatedAt
}
```

`alertas.noLeidas` **excluye** los tipos `consulta_web`, `tarea` y `cita`, que ya viven en Consultas y Agenda. Eso mata la duplicación de raíz.

---

## 3. Plan por fases

### Fase 0 — Contrato y cálculo correcto (backend) · base de todo
1. Crear `backend/services/navbarSummary.js` con la lógica única (scope por agente o admin) y consumirlo desde `crm.js:18` y `adminNotifications.js:69`.
2. Corregir los filtros: `dueDate` en vez de `fechaVencimiento`; `status`/`kanbanColumn` contra los estados reales (`completada`, `cancelada` fuera); citas con `estado: { $nin: ['Cancelada', 'cancelada'] }`.
3. Definir "agenda" = vencidas + de hoy (tareas y citas), no el backlog completo.
4. Devolver el shape v2 manteniendo las claves viejas una release para no romper nada en caliente.
5. Tests de integración del endpoint con datos sembrados (tarea completada, cita cancelada, consulta leída → no cuentan).

### Fase 1 — Generación de notificaciones sin ruido (backend)
1. Dedupe **por entidad de forma permanente** (sacar `createdAt: { $gte: todayStart }` de `alreadyNotified`); para los digest diarios usar una clave explícita `daily:YYYY-MM-DD`.
2. Sacar del badge de Alertas los tipos que ya tienen dueño (`consulta_web`, `tarea`, `cita`) — se siguen guardando como historial, pero no inflan el contador.
3. `reporte_diario` deja de contar como no leído (es un informe, no una alerta).
4. Mapa de rutas por app y corrección de `accionUrl`:
   - admin → `/clientes`, `/consultas`, `/citas`, `/propiedades`, `/operaciones`
   - agentes → `/crm/…` con **`operaciones`** (no `ventas`)
   - `consulta_web` → `entidadTipo: 'consulta'`, `accionUrl: /consultas?id=<activityId>&origen=activity`
   - test que valide que **todo `accionUrl` generado existe** en la tabla de rutas de la app.
5. Mover la generación al `automationScheduler` (cron cada 5 min) y sacar el `POST /generate` disparado desde cada montaje de navbar: hoy, N pestañas abiertas = N generadores compitiendo.

### Fase 2 — Navbar unificada (frontend, admin + agentes)
1. Hook `useNavbarSummary()` compartido: un solo poll (60 s), pausa con `visibilitychange`, refetch al volver al foco, y contexto para que los paneles **no** vuelvan a pedir el summary.
2. `NavButton`: badge con `aria-live="polite"` y `aria-label` descriptivo; `handleClick` pasa a **toggle**.
3. Mismo set de ítems en desktop y mobile: `Inicio · Buscar · +Nuevo · Tareas · Citas · Consultas · Alertas · Perfil`
   (agentes suma el chip de próxima cita). Se eliminan el botón de Propiedades y el trofeo de Logros.
4. Unificar todos los paneles al contenedor responsive de Alertas/Consultas; `role="dialog"`, cierre con `Escape`, foco inicial.
5. Reemplazar `window.location.href` por `navigate()` en los paneles que lo usan.
6. Limpieza: borrar `Notification.jsx`, `UserProfile.jsx`, `Propiedades.jsx` y `RewardsPanel.jsx` de la navbar,
   más las claves `chat/cart/userProfile/notification/propiedades/rewards` del `initialState`.
7. **Menú de perfil**: el avatar abre un dropdown con Mi Perfil · Seguridad · Tema · **Cerrar sesión**
   (hoy cerrar sesión sólo existe dentro de la página Mi Perfil).
8. **Búsqueda global `Ctrl+K` / `⌘K`**: modal con resultados de propiedades, clientes y operaciones,
   navegable con flechas y Enter. Backend nuevo: `GET /search?q=`.
9. **Botón "+ Nuevo"**: dropdown con Propiedad · Cliente · Cita · Tarea, que navega a la pantalla con el formulario abierto.
10. **Chip de próxima cita** (agentes): `15:30 · Depto Belgrano`, tomado de `proximaCita` del summary.

### Fase 3 — Panel de Alertas de verdad
1. **No** marcar todo como leído al abrir. Se marca al hacer click en cada alerta, más un botón explícito "Marcar todas".
2. El contador del panel se deriva de la lista, no queda hardcodeado en `0`.
3. El badge de la navbar baja **cuando el servidor confirma**, no antes.
4. Notificación nativa: sólo para eventos posteriores a la primera carga, deduplicada por id de notificación (`Set` en `sessionStorage`), limitada a `prioridad ∈ {alta, urgente}` y con tope de frecuencia.
5. Separador "Nuevas / Anteriores" y estado vacío que explique qué va a aparecer ahí.

### Fase 4 — Miniaturas e identidad
1. Navbar de admin: `useState` + listener de `userUpdated`, igual que agentes.
2. Reemplazar `ringColor` por algo válido (`boxShadow: 0 0 0 2px ${currentColor}`).
3. `onError` en cada `<img>` → avatar por defecto; tamaño fijo para evitar saltos de layout.
4. Componente `AuthedImage` reutilizable (fetch con token → blob → `revokeObjectURL` al desmontar), extraído del patrón ya existente en `admin/src/pages/Propiedades.jsx:806-834`, para mostrar **portadas reales** de propiedad en los paneles de Propiedades y Consultas, con fallback a ícono.
5. Corregir el mapeo de campos del panel de Tareas de agentes (`title`, `dueDate`, `priority`, `description`).

### Fase 5 — Push real (esto es lo que hoy "no notifica")
1. Polling a 60 s + refetch al volver al foco (baja ruido y carga).
2. `backend/services/pushService.js` con `sendToUser(agenteId, payload)`, y disparador en la creación de
   notificaciones de prioridad `alta`/`urgente`. Hoy `backend/routes/push.js` sólo tiene endpoints manuales
   que nadie llama: la infra (VAPID, `/subscribe`, handler `push` del `sw.js`) ya está, falta el gatillo.
3. El aviso in-app se silencia si `document.visibilityState === 'visible'` para no duplicar con el push.
4. Requiere generar las claves VAPID (`npx web-push generate-vapid-keys`) y cargarlas en el `.env` del server.
   Sin claves, el push degrada a silencio sin romper nada.
5. Canal SSE sobre el event bus Redis: queda para una fase posterior.

### Fase 6 — Verificación
Checklist por app: badge = largo de la lista · abrir/cerrar con el mismo ícono · marcar leído persiste tras recargar · **cada "Ver más" cae en una pantalla real** · paridad mobile/desktop · dark mode · sin errores de consola · entrada en `changelog.json` (cuadro de Novedades) antes de commitear.
