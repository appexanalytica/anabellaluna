/**
 * Credenciales precargadas en el formulario de login mientras se trabaja en local.
 *
 * Salen de `.env.development.local` (ignorado por git, nunca viaja al repo) y solo
 * existen en el build de desarrollo: en `npm run build` NODE_ENV es 'production' y
 * esto queda en cadenas vacías, así que el formulario sale limpio en el servidor.
 *
 * Los valores de arranque son los del seed del backend (backend/seed.js). Para usar
 * otros, editá admin/.env.development.local y reiniciá el dev server.
 */
const enDesarrollo = process.env.NODE_ENV === 'development';

export const devLogin = {
  activo: enDesarrollo && Boolean(process.env.REACT_APP_DEV_USER),
  username: enDesarrollo ? process.env.REACT_APP_DEV_USER || '' : '',
  password: enDesarrollo ? process.env.REACT_APP_DEV_PASS || '' : '',
};

export default devLogin;
