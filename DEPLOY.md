# 🚀 Guía de Despliegue a Producción

## 📁 Estructura del Proyecto

```
react admin app/
├── CRM-Admin/          # Frontend (React)
├── backend/            # Backend (Node.js + Express)
├── netlify.toml        # Configuración Netlify
└── DEPLOY.md          # Esta guía
```

## 🎯 Módulos Separados - Listos para Producción

### 📦 Frontend (CRM-Admin)
- **Framework**: React 17 + Syncfusion
- **Puerto Dev**: 3000
- **Build**: `npm run build`
- **Deploy**: Netlify, Vercel, AWS S3

### 🔧 Backend (API)
- **Framework**: Node.js + Express
- **Puerto**: 4000
- **Deploy**: Heroku, Railway, AWS EC2, DigitalOcean

---

## 🛠️ Configuración para Desarrollo

### 1️⃣ Backend

```bash
# Ir a la carpeta backend
cd backend

# Instalar dependencias
npm install

# Copiar archivo de entorno
cp .env.example .env

# Editar .env con tus credenciales
# - MONGODB_URI
# - JWT_SECRET
# - CLOUDINARY_*

# Iniciar servidor de desarrollo
npm run dev
```

### 2️⃣ Frontend

```bash
# Ir a la carpeta frontend
cd CRM-Admin

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

---

## 🚀 Despliegue a Producción

### 🌐 Frontend en Netlify

1. **Build Command**: `npm run build`
2. **Publish Directory**: `build`
3. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://tu-backend.com
   ```

### 🖥️ Backend en Railway/Heroku

#### Railway (Recomendado)
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar proyecto
cd backend
railway init

# Agregar variables de entorno
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="tu_secreto_largo"
railway variables set PORT=4000

# Deploy
railway up
```

#### Heroku
```bash
# Login
heroku login

# Crear app
cd backend
heroku create nombre-de-tu-app

# Agregar MongoDB (Opcional)
heroku addons:create mongolab

# Configurar variables
heroku config:set JWT_SECRET="tu_secreto_largo"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

---

## 🔐 Variables de Entorno

### Backend (.env)
```env
# Servidor
PORT=4000
NODE_ENV=production

# Base de Datos
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Autenticación
JWT_SECRET=tu_secreto_super_largo_y_seguro_2024

# Cloudinary (Opcional)
CLOUDINARY_CLOUD_NAME=tu_cloud
CLOUDINARY_API_KEY=tu_key
CLOUDINARY_API_SECRET=tu_secret
```

### Frontend (.env)
```env
REACT_APP_API_URL=https://tu-backend-api.com
```

---

## 📊 MongoDB Setup (Producción)

### MongoDB Atlas (Recomendado - Gratis)

1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear cuenta gratuita
3. Crear nuevo cluster (M0 Free)
4. Crear usuario de base de datos
5. Whitelist IP (0.0.0.0/0 para acceso desde cualquier lugar)
6. Obtener connection string
7. Reemplazar en MONGODB_URI

---

## ✅ Checklist Pre-Deploy

### Backend
- [ ] Dependencias instaladas
- [ ] .env configurado correctamente
- [ ] MongoDB funcional
- [ ] JWT_SECRET es seguro
- [ ] CORS configurado para frontend
- [ ] Puerto configurado (process.env.PORT)

### Frontend
- [ ] REACT_APP_API_URL apunta al backend correcto
- [ ] Build exitoso (`npm run build`)
- [ ] Rutas SPA configuradas (netlify.toml)
- [ ] Variables de entorno en Netlify

---

## 🧪 Testing Pre-Deploy

```bash
# Backend
cd backend
npm start
# Test: http://localhost:4000/health

# Frontend (otra terminal)
cd CRM-Admin
npm start
# Test: http://localhost:3000
```

---

## 📈 Monitoreo Post-Deploy

### Backend
- Verificar logs en Railway/Heroku
- Monitorear uso de MongoDB
- Revisar tiempos de respuesta

### Frontend
- Verificar build en Netlify
- Comprobar todas las rutas
- Test de API connectivity

---

## 🆘 Troubleshooting

### Error: Cannot connect to backend
```
✅ Verificar REACT_APP_API_URL
✅ Comprobar CORS en backend
✅ Verificar que backend esté activo
```

### Error: MongoDB connection failed
```
✅ Verificar MONGODB_URI
✅ Comprobar whitelist IP en Atlas
✅ Verificar usuario/contraseña
```

### Error: JWT authentication failed
```
✅ Verificar JWT_SECRET consistente
✅ Comprobar token en localStorage
✅ Verificar headers de autorización
```

---

## 📞 Soporte

- Backend Issues: Revisar logs en servidor
- Frontend Issues: Consola del navegador (F12)
- Database Issues: MongoDB Atlas logs

---

**¡Listo para producción! 🎉**
