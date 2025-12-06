# Document# Backend API - CRM Admin

API backend completa para CRM Inmobiliario con gestión de documentos, autenticación JWT, y operaciones CRUD completas.

## Inicio Rápido

Desde la carpeta `backend` sigue estos pasos.

En sistemas Unix / WSL / macOS:

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno (copiar y editar)
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor de desarrollo (con nodemon)
npm run dev

# Iniciar servidor en producción
npm start
```

En Windows (cmd.exe):

```cmd
REM Instalar dependencias
npm install

REM Copiar .env.example a .env
copy .env.example .env
REM Edita .env con notepad .env o el editor que prefieras

REM Iniciar servidor de desarrollo
npm run dev

REM Iniciar servidor en producción
npm start
```

## Endpoints Disponibles

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Login usuario

### CRM
- `GET/POST/PUT/DELETE /crm/propiedades` - Gestión de propiedades
- `GET/POST/PUT/DELETE /crm/clientes` - Gestión de clientes
- `GET/POST/PUT/DELETE /crm/agentes` - Gestión de agentes
- `GET/POST/PUT/DELETE /crm/operaciones` - Gestión de ventas
- `GET/POST/PUT/DELETE /crm/citas` - Gestión de citas
- `GET/POST/PUT/DELETE /crm/tareas` - Gestión de tareas

### Documentos
- `GET/POST/PUT/DELETE /documents` - Gestión de documentos
- `GET /documents/:id/versions` - Versionado

### Health Check
- `GET /health` - Estado del servidor

## Variables de entorno

Crear `.env` a partir de `.env.example` y configurar los valores:

- `MONGODB_URI` - URI de conexión a MongoDB (ej: mongodb+srv://user:pass@cluster/...)
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - credenciales de Cloudinary (opcional en dev)
- `JWT_SECRET` - secreto para firmar tokens JWT (cámbialo en producción)
- `PORT` - puerto donde correrá el server (por defecto 4000)
- `NODE_ENV` - `development` o `production`

## Puerto: 4000

Endpoints principales
- GET /health — estado del servicio
- GET /documents?q=buscar — lista de documentos (opcional q para buscar)
- POST /documents — subir archivos (form-data, campo `files`)
- GET /documents/:id/download — descargar documento por id
- DELETE /documents/:id — eliminar documento por id
- POST /webhook/crm — webhook ejemplo para integrar con CRM

Ejemplos curl
- Listar:

  curl http://localhost:4000/documents

- Subir (multipart):

  curl -F "files=@/ruta/al/archivo.pdf" http://localhost:4000/documents

- Descargar:

  curl -O http://localhost:4000/documents/1/download

Ejecución (desarrollo)

1. Entrar a la carpeta `backend`.
2. Copiar `.env.example` a `.env` y rellenar variables (MONGODB_URI, CLOUDINARY_*, JWT_SECRET).
3. Ejecutar `npm install`.
4. Iniciar con `npm run dev`.

### Generar token JWT rápido (pruebas)

Si quieres crear un token JWT para pruebas sin pasar por el endpoint de login, puedes generar uno rápido en Node (en la máquina de desarrollo):

```node
const jwt = require('jsonwebtoken');
const token = jwt.sign({ sub: 'test-user-id', username: 'dev', role: 'admin' }, process.env.JWT_SECRET || 'please-change-this-secret', { expiresIn: '8h' });
console.log(token);
```

Pega ese token en la cabecera `Authorization: Bearer <token>` para probar rutas protegidas.

## Notas sobre Cloudinary y MongoDB

- Si no configuras Cloudinary en desarrollo, las rutas de subida devolverán error al intentar subir; puedes mockear o usar `uploads/` local temporalmente.
- Para pruebas automatizadas recomendamos `mongodb-memory-server`.

## Siguientes pasos recomendados

- Crear `.env` con credenciales reales para desarrollo.
- Añadir seed de datos (`node seed.js`).
- Implementar rutas CRUD faltantes para entidades CRM (propiedades, clientes, agentes, operaciones, citas) — esto está planificado en el roadmap del proyecto.

Despliegue en producción con Docker (multi-stage)

- Construir imagen:

  docker build -t document-backend:latest .

- Ejecutar contenedor (ejemplo):

  docker run -e MONGODB_URI="..." -e CLOUDINARY_CLOUD_NAME="..." -e CLOUDINARY_API_KEY="..." -e CLOUDINARY_API_SECRET="..." -e JWT_SECRET="..." -p 4000:4000 document-backend:latest

Notas
- Este backend está preparado para usar Cloudinary para archivos y MongoDB para metadata. Asegúrate de proporcionar las credenciales en `.env` o variables de entorno.
- Para producción, usar `npm ci --omit=dev` en el Dockerfile (ya configurado) y no incluir `node_modules` en la imagen final de forma local.
