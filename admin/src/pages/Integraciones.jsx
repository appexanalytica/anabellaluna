import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { confirmToast } from '../utils/confirmToast';
import { FaGoogle, FaCheck, FaTimes, FaCopy, FaEye, FaEyeSlash, FaSave, FaTrash, FaExternalLinkAlt, FaStar, FaRegStar, FaSync, FaUnlink, FaRss, FaCog, FaCode, FaKey } from 'react-icons/fa';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';
import whatsappService from '../services/whatsappService';
import SessionCard from '../components/whatsapp/SessionCard';
import QRModal from '../components/whatsapp/QRModal';
import useSocket from '../hooks/useSocket';

const API_URL = process.env.REACT_APP_API_URL
  || (typeof window !== 'undefined' && !['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'https://api.anabellaluna.com.ar'
    : 'http://localhost:4000');
const getAuthToken = () => localStorage.getItem('authToken');

const STARS = [0, 1, 2, 3, 4, 5];
const STAR_LABELS = ['free', 'bronze', 'silver', 'gold', 'gold_special', 'gold_premium'];

const Integraciones = () => {
  const { currentColor, currentMode } = useStateContext();
  const isDark = currentMode === 'Dark';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showMLSecret, setShowMLSecret] = useState(false);
  const [copied, setCopied] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [mlMessage, setMLMessage] = useState({ type: '', text: '' });
  const [mlSaving, setMLSaving] = useState(false);

  const [googleOAuth, setGoogleOAuth] = useState({
    clientId: '',
    clientSecret: '',
    hasCredentials: false,
    redirectUri: '',
  });

  const [mlConfig, setMLConfig] = useState({
    clientId: '',
    clientSecret: '',
    redirectUri: '',
    webhookUrl: '',
    hasCredentials: false,
    isAuthenticated: false,
    userId: null,
  });

  useEffect(() => {
    loadGoogleOAuthConfig();
    loadMLConfig();
  }, []);

  const loadGoogleOAuthConfig = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/config/google-oauth`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setGoogleOAuth({
          clientId: data.clientId || '',
          clientSecret: data.clientSecret || '',
          hasCredentials: data.hasCredentials || false,
          redirectUri: data.redirectUri || '',
        });
      }
    } catch (err) {
      console.error('Error loading Google OAuth config:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveGoogleOAuth = async () => {
    if (!googleOAuth.clientId || !googleOAuth.clientSecret) {
      setMessage({ type: 'error', text: 'Client ID y Client Secret son requeridos' });
      return;
    }
    
    setSaving(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/config/google-oauth`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: googleOAuth.clientId,
          clientSecret: googleOAuth.clientSecret,
        }),
      });
      
      if (res.ok) {
        setMessage({ type: 'success', text: 'Credenciales guardadas correctamente' });
        setGoogleOAuth(prev => ({ ...prev, hasCredentials: true }));
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setSaving(false);
    }
  };

  const deleteGoogleOAuth = async () => {
    if (!(await confirmToast('¿Eliminar las credenciales de Google OAuth? Los agentes no podrán conectar sus calendarios.'))) {
      return;
    }
    
    setSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/config/google-oauth`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        setGoogleOAuth({ clientId: '', clientSecret: '', hasCredentials: false, redirectUri: googleOAuth.redirectUri });
        setMessage({ type: 'success', text: 'Credenciales eliminadas' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al eliminar' });
    } finally {
      setSaving(false);
    }
  };

  const loadMLConfig = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/ml/config`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMLConfig({
          clientId: data.clientId || '',
          clientSecret: data.clientSecret || '',
          redirectUri: data.redirectUri || '',
          webhookUrl: data.webhookUrl || '',
          hasCredentials: data.hasCredentials || false,
          isAuthenticated: data.isAuthenticated || false,
          userId: data.userId || null,
        });
      }
    } catch (err) {
      console.error('Error loading ML config:', err);
    }
  };

  const saveMLConfig = async () => {
    if (!mlConfig.clientId || !mlConfig.redirectUri) {
      setMLMessage({ type: 'error', text: 'Client ID y Redirect URI son requeridos' });
      return;
    }
    if (!mlConfig.hasCredentials && !mlConfig.clientSecret) {
      setMLMessage({ type: 'error', text: 'Client Secret es requerido al configurar por primera vez' });
      return;
    }
    setMLSaving(true);
    setMLMessage({ type: '', text: '' });
    try {
      const token = getAuthToken();
      const body = {
        clientId: mlConfig.clientId,
        redirectUri: mlConfig.redirectUri,
        webhookUrl: mlConfig.webhookUrl,
      };
      // Only send secret if user typed a new one (not the masked placeholder)
      if (mlConfig.clientSecret && mlConfig.clientSecret !== '••••••••') {
        body.clientSecret = mlConfig.clientSecret;
      } else if (!mlConfig.hasCredentials) {
        setMLMessage({ type: 'error', text: 'Client Secret es requerido' });
        setMLSaving(false);
        return;
      } else {
        // Keep existing secret — send a dummy that the backend will ignore
        // We must send something, so re-fetch real and re-save not needed;
        // instead skip update of secret by sending empty and handle server-side.
        // Conservative: require user to re-enter secret when updating.
        setMLMessage({ type: 'error', text: 'Para actualizar las credenciales, ingresá el Client Secret nuevamente' });
        setMLSaving(false);
        return;
      }
      const res = await fetch(`${API_URL}/admin/ml/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setMLMessage({ type: 'success', text: 'Credenciales guardadas correctamente' });
        setMLConfig(prev => ({ ...prev, hasCredentials: true, clientSecret: '••••••••' }));
      } else {
        const data = await res.json();
        setMLMessage({ type: 'error', text: data.error || 'Error al guardar' });
      }
    } catch (err) {
      setMLMessage({ type: 'error', text: 'Error de conexión' });
    } finally {
      setMLSaving(false);
    }
  };

  const deleteMLConfig = async () => {
    if (!(await confirmToast('¿Eliminar las credenciales de Mercado Libre? Las propiedades dejarán de sincronizarse.'))) return;
    setMLSaving(true);
    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/admin/ml/config`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      setMLConfig({ clientId: '', clientSecret: '', redirectUri: '', webhookUrl: '', hasCredentials: false, isAuthenticated: false, userId: null });
      setMLMessage({ type: 'success', text: 'Credenciales eliminadas' });
    } catch (err) {
      setMLMessage({ type: 'error', text: 'Error al eliminar' });
    } finally {
      setMLSaving(false);
    }
  };

  const connectML = () => {
    window.location.href = `${API_URL}/admin/ml/auth`;
  };

  const disconnectML = async () => {
    if (!(await confirmToast('¿Desconectar la cuenta de Mercado Libre? Las credenciales se conservarán.'))) return;
    setMLSaving(true);
    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/admin/ml/disconnect`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      setMLConfig(prev => ({ ...prev, isAuthenticated: false, userId: null }));
      setMLMessage({ type: 'success', text: 'Desconectado de Mercado Libre' });
    } catch (err) {
      setMLMessage({ type: 'error', text: 'Error al desconectar' });
    } finally {
      setMLSaving(false);
    }
  };

  // ── WhatsApp Sessions ───────────────────────────────────────
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [waCreating, setWaCreating] = useState(false);
  const [qrModal, setQrModal] = useState(null);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await whatsappService.getSessions();
      setSessions(Array.isArray(data) ? data : data?.sessions || []);
    } catch {
      toast.error('Error al cargar sesiones de WhatsApp');
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  useSocket({
    'whatsapp:session_status': ({ sessionName, status: s } = {}) => {
      if (!sessionName) return;
      setSessions((prev) => prev.map((sess) => sess.sessionName === sessionName ? { ...sess, status: s, updatedAt: new Date().toISOString() } : sess));
    },
    'whatsapp:session_connected': ({ sessionName, phone, displayName } = {}) => {
      if (!sessionName) return;
      setSessions((prev) => prev.map((sess) => sess.sessionName === sessionName ? { ...sess, status: 'CONNECTED', phone: phone || sess.phone, displayName: displayName || sess.displayName, updatedAt: new Date().toISOString() } : sess));
      if (qrModal === sessionName) { setQrModal(null); toast.success(`WhatsApp conectado: ${phone || sessionName}`); }
    },
    'whatsapp:session_disconnected': ({ sessionName } = {}) => {
      if (!sessionName) return;
      setSessions((prev) => prev.map((sess) => sess.sessionName === sessionName ? { ...sess, status: 'DISCONNECTED', updatedAt: new Date().toISOString() } : sess));
    },
  });

  const handleCreateSession = async () => {
    setWaCreating(true);
    try {
      const data = await whatsappService.createSession();
      const newSession = data?.session || data;
      if (newSession?.sessionName) {
        setSessions((prev) => [newSession, ...prev]);
        setQrModal(newSession.sessionName);
        toast.success('Sesión creada. Escaneá el QR para conectar.');
      } else { await loadSessions(); }
    } catch (err) { toast.error(`Error al crear sesión: ${err.message}`); }
    finally { setWaCreating(false); }
  };

  const handleWaDelete = async (sessionName) => {
    if (!window.confirm(`¿Eliminar la sesión "${sessionName}"?`)) return;
    try {
      await whatsappService.deleteSession(sessionName);
      setSessions((prev) => prev.filter((s) => s.sessionName !== sessionName));
      toast.success('Sesión eliminada');
    } catch (err) { toast.error(`Error al eliminar: ${err.message}`); }
  };

  const handleWaStop = async (sessionName) => {
    try {
      await whatsappService.stopSession(sessionName);
      setSessions((prev) => prev.map((s) => s.sessionName === sessionName ? { ...s, status: 'DISCONNECTED', updatedAt: new Date().toISOString() } : s));
      toast.success('Sesión desconectada');
    } catch (err) { toast.error(`Error al desconectar: ${err.message}`); }
  };

  const handleWaStart = async (sessionName) => {
    try {
      await whatsappService.startSession(sessionName);
      setSessions((prev) => prev.map((s) => s.sessionName === sessionName ? { ...s, status: 'WAITING_QR', updatedAt: new Date().toISOString() } : s));
      setQrModal(sessionName);
      toast.info('Reconectando... Escaneá el QR');
    } catch (err) { toast.error(`Error al reconectar: ${err.message}`); }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  // ── Portales Inmobiliarios ──────────────────────────────────
  const [portalesList, setPortalesList] = useState([]);
  const [portalesLoading, setPortalesLoading] = useState(false);
  const [portalModal, setPortalModal] = useState(null);
  const [portalForm, setPortalForm] = useState({
    enabled: false,
    inmobiliariaNombre: '',
    contactEmail: '',
    contactPhone: '',
    accountId: '',
    accountEmail: '',
  });
  const [portalSaving, setPortalSaving] = useState(false);
  const [portalPreview, setPortalPreview] = useState('');

  const loadPortales = useCallback(async () => {
    setPortalesLoading(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/portales`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPortalesList(Array.isArray(data.portales) ? data.portales : []);
      }
    } catch (err) {
      console.error('Error loading portales:', err);
    } finally {
      setPortalesLoading(false);
    }
  }, []);

  useEffect(() => { loadPortales(); }, [loadPortales]);

  const buildFeedUrl = (portal) => (
    portal && portal.feedToken
      ? `${API_URL}/public/feeds/${portal.key}.xml?token=${portal.feedToken}`
      : ''
  );

  const openPortalModal = async (portal) => {
    setPortalPreview('');
    setPortalModal(portal);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/portales/${portal.key}/config`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPortalForm({
          enabled: !!data.enabled,
          inmobiliariaNombre: data.inmobiliariaNombre || '',
          contactEmail: data.contactEmail || '',
          contactPhone: data.contactPhone || '',
          accountId: data.accountId || '',
          accountEmail: data.accountEmail || '',
        });
        setPortalModal({ ...portal, feedToken: data.feedToken || '', stats: data.stats || {} });
      }
    } catch (err) {
      toast.error('Error al cargar la configuración del portal');
    }
  };

  const savePortal = async () => {
    if (!portalModal) return;
    setPortalSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/portales/${portalModal.key}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(portalForm),
      });
      if (res.ok) {
        const data = await res.json();
        setPortalModal((prev) => ({ ...prev, feedToken: data.config.feedToken || '' }));
        toast.success(`Configuración de ${portalModal.nombre} guardada`);
        await loadPortales();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al guardar');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setPortalSaving(false);
    }
  };

  const togglePortal = async (portal) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/portales/${portal.key}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ enabled: !portal.enabled }),
      });
      if (res.ok) {
        toast.success(`${portal.nombre} ${portal.enabled ? 'desactivado' : 'activado'}`);
        await loadPortales();
      }
    } catch (err) {
      toast.error('Error al cambiar el estado del portal');
    }
  };

  const regeneratePortalToken = async () => {
    if (!portalModal) return;
    if (!(await confirmToast('¿Regenerar el token del feed? La URL anterior dejará de funcionar y deberás informarla nuevamente al portal.'))) return;
    setPortalSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/portales/${portalModal.key}/regenerate-token`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPortalModal((prev) => ({ ...prev, feedToken: data.feedToken }));
        toast.success('Token regenerado');
        await loadPortales();
      }
    } catch (err) {
      toast.error('Error al regenerar el token');
    } finally {
      setPortalSaving(false);
    }
  };

  const deletePortal = async () => {
    if (!portalModal) return;
    if (!(await confirmToast(`¿Eliminar la configuración de ${portalModal.nombre}? El feed dejará de estar disponible.`))) return;
    setPortalSaving(true);
    try {
      const token = getAuthToken();
      await fetch(`${API_URL}/admin/portales/${portalModal.key}/config`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Configuración eliminada');
      setPortalModal(null);
      await loadPortales();
    } catch (err) {
      toast.error('Error al eliminar');
    } finally {
      setPortalSaving(false);
    }
  };

  const previewPortalFeed = async () => {
    if (!portalModal) return;
    setPortalSaving(true);
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_URL}/admin/portales/${portalModal.key}/preview`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPortalPreview(data.xml || '');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Error al generar la vista previa');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setPortalSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen px-6 lg:px-8 pt-4 pb-6 ${isDark ? 'bg-main-dark-bg' : 'bg-gray-50'}`}>
        <div className="mb-6">
          <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FaGoogle className="text-blue-500" /> Integraciones
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Configuración de servicios externos</p>
        </div>
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: currentColor }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-6 lg:px-8 pt-4 pb-6 ${isDark ? 'bg-main-dark-bg' : 'bg-gray-50'}`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <FaGoogle className="text-blue-500" /> Integraciones
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Configuración de servicios externos</p>
      </div>
      
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Google Calendar OAuth Configuration */}
      <div className={`rounded-2xl p-6 border mb-6 ${isDark ? 'bg-secondary-dark-bg border-gray-700/50' : 'bg-white border-gray-100 shadow-md'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <FaGoogle className="text-2xl text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold dark:text-gray-200">Google Calendar</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Configuración central OAuth para sincronización de calendarios de agentes
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            googleOAuth.hasCredentials 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
          }`}>
            {googleOAuth.hasCredentials ? <><FaCheck className="inline mr-1" /> Configurado</> : <><FaTimes className="inline mr-1" /> No configurado</>}
          </span>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">📋 Instrucciones:</h4>
          <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
            <li>Ir a <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-900">Google Cloud Console <FaExternalLinkAlt className="inline text-xs" /></a></li>
            <li>Crear o seleccionar un proyecto</li>
            <li>Habilitar la API de Google Calendar</li>
            <li>Crear credenciales OAuth 2.0 (tipo "Web Application")</li>
            <li>Agregar la URI de redirección (abajo) a "Authorized redirect URIs"</li>
            <li>Copiar el Client ID y Client Secret aquí</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Redirect URI (copiar a Google Console)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={googleOAuth.redirectUri}
                readOnly
                className="flex-1 px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 text-sm"
              />
              <button
                onClick={() => copyToClipboard(googleOAuth.redirectUri, 'redirect')}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Copiar"
              >
                {copied === 'redirect' ? <FaCheck className="text-green-600" /> : <FaCopy className="dark:text-gray-300" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client ID *
            </label>
            <input
              type="text"
              value={googleOAuth.clientId}
              onChange={(e) => setGoogleOAuth(prev => ({ ...prev, clientId: e.target.value }))}
              placeholder="xxxxxx.apps.googleusercontent.com"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Secret *
            </label>
            <div className="flex gap-2">
              <input
                type={showSecret ? 'text' : 'password'}
                value={googleOAuth.clientSecret}
                onChange={(e) => setGoogleOAuth(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder="GOCSPX-xxxxxx"
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title={showSecret ? 'Ocultar' : 'Mostrar'}
              >
                {showSecret ? <FaEyeSlash className="dark:text-gray-300" /> : <FaEye className="dark:text-gray-300" />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={saveGoogleOAuth}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: currentColor }}
            >
              <FaSave /> {saving ? 'Guardando...' : 'Guardar Credenciales'}
            </button>
            {googleOAuth.hasCredentials && (
              <button
                onClick={deleteGoogleOAuth}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <FaTrash /> Eliminar
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t dark:border-gray-700">
          <h4 className="font-semibold dark:text-gray-200 mb-2">💡 ¿Cómo funciona?</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Una vez configuradas las credenciales aquí, los <strong>agentes solo necesitan hacer clic en "Conectar Google Calendar"</strong> desde su panel de Integraciones.
            No necesitan configurar nada más. Sus calendarios personales de Google se sincronizarán automáticamente con las citas del CRM.
          </p>
        </div>
      </div>

      {/* ── WhatsApp Sessions ─────────────────────────────────────────────── */}
      <div className={`rounded-2xl p-6 border mb-6 ${isDark ? 'bg-secondary-dark-bg border-gray-700/50' : 'bg-white border-gray-100 shadow-md'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e9fbe9' }}>
            <img src="/whatsapp.svg" width="28" height="28" alt="WhatsApp" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold dark:text-gray-200">WhatsApp</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Gestioná los números de WhatsApp conectados al sistema
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            sessions.some((s) => s.status === 'CONNECTED')
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}>
            {sessions.filter((s) => s.status === 'CONNECTED').length}/{sessions.length} conectadas
          </span>
        </div>

        {sessionsLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-7 h-7 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: '#25d366' }} />
          </div>
        ) : sessions.length === 0 ? (
          <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              📱 No hay sesiones de WhatsApp. Creá una para conectar un número al sistema.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.sessionName || session._id}
                session={session}
                isOwner
                onDelete={handleWaDelete}
                onStop={handleWaStop}
                onStart={handleWaStart}
                onShowQr={(name) => setQrModal(name)}
              />
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCreateSession}
            disabled={waCreating}
            className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-60"
            style={{ backgroundColor: '#25d366' }}
          >
            {waCreating ? <><FaSync className="animate-spin" /> Creando...</> : <>+ Nueva sesión</>}
          </button>
          <button
            type="button"
            onClick={loadSessions}
            disabled={sessionsLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FaSync className={sessionsLoading ? 'animate-spin' : ''} /> Actualizar
          </button>
        </div>
      </div>

      {/* ── Mercado Libre Integration ───────────────────────────────────────── */}
      <div className={`rounded-2xl p-6 border mb-6 ${isDark ? 'bg-secondary-dark-bg border-gray-700/50' : 'bg-white border-gray-100 shadow-md'}`}>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
            <span className="text-2xl">🛒</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold dark:text-gray-200">Mercado Libre</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Publicación automática de propiedades al cambiar el estado a publicado
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            mlConfig.isAuthenticated
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : mlConfig.hasCredentials
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
          }`}>
            {mlConfig.isAuthenticated
              ? (<><FaCheck className="inline mr-1" /> Conectado</>)
              : mlConfig.hasCredentials
                ? (<><FaSync className="inline mr-1" /> Credenciales OK — sin token</>)
                : (<><FaTimes className="inline mr-1" /> No configurado</>)}
          </span>
        </div>

        {mlMessage.text && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            mlMessage.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {mlMessage.text}
          </div>
        )}

        {/* Credentials form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID *</label>
            <input
              type="text"
              value={mlConfig.clientId}
              onChange={(e) => setMLConfig(prev => ({ ...prev, clientId: e.target.value }))}
              placeholder="Número de App ID de Mercado Libre"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Client Secret {mlConfig.hasCredentials ? '(dejar en blanco mantiene el existente — reingresá para cambiar)' : '*'}
            </label>
            <div className="flex gap-2">
              <input
                type={showMLSecret ? 'text' : 'password'}
                value={mlConfig.clientSecret}
                onChange={(e) => setMLConfig(prev => ({ ...prev, clientSecret: e.target.value }))}
                placeholder={mlConfig.hasCredentials ? '••••••••' : 'Secret de la app ML'}
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <button
                onClick={() => setShowMLSecret(!showMLSecret)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {showMLSecret ? <FaEyeSlash className="dark:text-gray-300" /> : <FaEye className="dark:text-gray-300" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Redirect URI * (configurar en ML Developers)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mlConfig.redirectUri}
                onChange={(e) => setMLConfig(prev => ({ ...prev, redirectUri: e.target.value }))}
                placeholder="https://api.anabellaluna.com.ar/admin/ml/callback"
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <button
                onClick={() => copyToClipboard(mlConfig.redirectUri, 'mlRedirect')}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Copiar"
              >
                {copied === 'mlRedirect' ? <FaCheck className="text-green-600" /> : <FaCopy className="dark:text-gray-300" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook URL (opcional — para notificaciones de ML)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={mlConfig.webhookUrl}
                onChange={(e) => setMLConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                placeholder="https://api.anabellaluna.com.ar/admin/ml/webhook"
                className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
              <button
                onClick={() => copyToClipboard(mlConfig.webhookUrl, 'mlWebhook')}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Copiar"
              >
                {copied === 'mlWebhook' ? <FaCheck className="text-green-600" /> : <FaCopy className="dark:text-gray-300" />}
              </button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={saveMLConfig}
            disabled={mlSaving}
            className="flex items-center gap-2 px-6 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
            style={{ backgroundColor: currentColor }}
          >
            <FaSave /> {mlSaving ? 'Guardando...' : 'Guardar Credenciales'}
          </button>
          {mlConfig.hasCredentials && !mlConfig.isAuthenticated && (
            <button
              onClick={connectML}
              disabled={mlSaving}
              className="flex items-center gap-2 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FaSync /> Conectar cuenta ML
            </button>
          )}
          {mlConfig.isAuthenticated && (
            <button
              onClick={disconnectML}
              disabled={mlSaving}
              className="flex items-center gap-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FaUnlink /> Desconectar
            </button>
          )}
          {mlConfig.hasCredentials && (
            <button
              onClick={deleteMLConfig}
              disabled={mlSaving}
              className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <FaTrash /> Eliminar
            </button>
          )}
        </div>

        {/* Listing type legend */}
        <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-yellow-50'}`}>
          <h4 className="font-semibold text-sm mb-3 dark:text-gray-200">⭐ Estrellas → Tipo de publicación ML</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {STARS.map((n) => (
              <div key={n} className="flex items-center gap-2 text-xs">
                <div className="flex">
                  {STARS.slice(0, 5).map((i) => (
                    i < n
                      ? <FaStar key={i} className="text-yellow-400" />
                      : <FaRegStar key={i} className="text-gray-400" />
                  ))}
                </div>
                <span className={`font-mono ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{STAR_LABELS[n]}</span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3 text-gray-500 dark:text-gray-400">
            Las estrellas se asignan desde el detalle de cada propiedad en el ERP. El tipo de publicación
            se actualiza automáticamente en ML cuando se cambia.
          </p>
        </div>

        {mlConfig.isAuthenticated && mlConfig.userId && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Cuenta conectada: User ID {mlConfig.userId}
          </p>
        )}
      </div>

      {qrModal && (
        <QRModal
          sessionName={qrModal}
          onClose={() => setQrModal(null)}
          onConnected={() => {
            setSessions((prev) => prev.map((s) => s.sessionName === qrModal ? { ...s, status: 'CONNECTED', updatedAt: new Date().toISOString() } : s));
            toast.success('WhatsApp conectado exitosamente');
          }}
        />
      )}

      {/* ── Portales Inmobiliarios ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4 mt-8">
        <div>
          <h3 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <FaRss style={{ color: currentColor }} /> Portales Inmobiliarios
          </h3>
          <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Sindicación automática de propiedades publicadas mediante feeds XML que cada portal consume
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          portalesList.some((p) => p.enabled)
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
        }`}>
          {portalesList.filter((p) => p.enabled).length}/{portalesList.length} activos
        </span>
      </div>

      {portalesLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: currentColor }}></div>
        </div>
      ) : (
        [1, 2].map((fase) => (
          <div key={fase} className="mb-6">
            <h4 className={`text-sm font-semibold uppercase tracking-wide mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {fase === 1 ? 'Portales nacionales' : 'Portales regionales'}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portalesList.filter((p) => p.fase === fase).map((p) => (
                <div
                  key={p.key}
                  className={`rounded-2xl p-5 border transition-shadow ${
                    isDark
                      ? 'bg-secondary-dark-bg border-gray-700/50 hover:border-indigo-500/30'
                      : 'bg-white border-gray-100 shadow-md hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.nombre.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{p.nombre}</h3>
                        <a href={p.sitio} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <FaExternalLinkAlt className="text-xs" />
                        </a>
                      </div>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{p.descripcion}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      p.enabled
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      {p.enabled ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono ${isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {p.formato === 'trovit' ? 'Feed Trovit' : 'Feed XML'}
                    </span>
                  </div>
                  {p.stats && p.stats.lastPulledAt && (
                    <p className={`text-xs mb-3 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Último acceso del portal: {new Date(p.stats.lastPulledAt).toLocaleString('es-AR')} ({p.stats.pullCount} lecturas)
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openPortalModal(p)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-white transition-all shadow-sm hover:shadow-md"
                      style={{ backgroundColor: currentColor }}
                    >
                      <FaCog /> Configurar
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePortal(p)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                        p.enabled
                          ? 'border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20'
                          : 'border-green-300 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20'
                      }`}
                    >
                      {p.enabled ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* ── Modal de configuración de portal ───────────────────────────────── */}
      {portalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPortalModal(null)}
        >
          <div
            className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 ${isDark ? 'bg-secondary-dark-bg' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                style={{ backgroundColor: portalModal.color }}
              >
                {portalModal.nombre.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{portalModal.nombre}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{portalModal.descripcion}</p>
              </div>
              <button
                type="button"
                onClick={() => setPortalModal(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            <div className={`rounded-lg p-4 mb-5 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <h4 className={`font-semibold text-sm mb-2 ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
                📋 Cómo habilitar la integración
                {' '}
                <a href={portalModal.docsUrl} target="_blank" rel="noopener noreferrer" className="underline font-normal">
                  (documentación oficial <FaExternalLinkAlt className="inline text-xs" />)
                </a>
              </h4>
              <ol className={`text-sm space-y-1 list-decimal list-inside ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                {(portalModal.pasos || []).map((paso, i) => (
                  <li key={i}>{paso}</li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-between mb-5">
              <div>
                <p className={`font-medium text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Estado del feed</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Al activarlo se genera la URL que el portal consultará periódicamente
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPortalForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative w-12 h-6 rounded-full transition-colors ${portalForm.enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${portalForm.enabled ? 'left-6' : 'left-0.5'}`}></span>
              </button>
            </div>

            {portalModal.feedToken ? (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL del feed (entregar al portal)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={buildFeedUrl(portalModal)}
                    readOnly
                    className="flex-1 px-4 py-2 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(buildFeedUrl(portalModal), `feed-${portalModal.key}`)}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="Copiar URL"
                  >
                    {copied === `feed-${portalModal.key}` ? <FaCheck className="text-green-600" /> : <FaCopy className="dark:text-gray-300" />}
                  </button>
                  <button
                    type="button"
                    onClick={regeneratePortalToken}
                    disabled={portalSaving}
                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    title="Regenerar token"
                  >
                    <FaKey className="dark:text-gray-300" />
                  </button>
                </div>
              </div>
            ) : (
              <div className={`mb-5 p-3 rounded-lg text-sm ${isDark ? 'bg-yellow-900/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
                Guardá la configuración con el feed activado para generar la URL del feed.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de la inmobiliaria</label>
                <input
                  type="text"
                  value={portalForm.inmobiliariaNombre}
                  onChange={(e) => setPortalForm((prev) => ({ ...prev, inmobiliariaNombre: e.target.value }))}
                  placeholder="Anabella Luna Propiedades"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">ID / usuario en el portal</label>
                <input
                  type="text"
                  value={portalForm.accountId}
                  onChange={(e) => setPortalForm((prev) => ({ ...prev, accountId: e.target.value }))}
                  placeholder="Identificador de la cuenta (opcional)"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de la cuenta en el portal</label>
                <input
                  type="email"
                  value={portalForm.accountEmail}
                  onChange={(e) => setPortalForm((prev) => ({ ...prev, accountEmail: e.target.value }))}
                  placeholder="cuenta@inmobiliaria.com (opcional)"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email de contacto (en el feed)</label>
                <input
                  type="email"
                  value={portalForm.contactEmail}
                  onChange={(e) => setPortalForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  placeholder="consultas@inmobiliaria.com"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono de contacto (en el feed)</label>
                <input
                  type="text"
                  value={portalForm.contactPhone}
                  onChange={(e) => setPortalForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  placeholder="+54 9 11 ..."
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
                />
              </div>
            </div>

            {portalPreview && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Vista previa del feed (primeras 3 propiedades)
                </label>
                <pre className="text-xs p-3 rounded-lg overflow-x-auto max-h-64 bg-gray-900 text-green-300">
                  {portalPreview}
                </pre>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={savePortal}
                disabled={portalSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50"
                style={{ backgroundColor: currentColor }}
              >
                <FaSave /> {portalSaving ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={previewPortalFeed}
                disabled={portalSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <FaCode /> Vista previa del feed
              </button>
              <button
                type="button"
                onClick={deletePortal}
                disabled={portalSaving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 ml-auto"
              >
                <FaTrash /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integraciones;
