import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaCheck, FaTimes, FaGoogle, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { confirmToast } from '../utils/confirmToast';
import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';
import whatsappService from '../services/whatsappService';
import SessionCard from '../components/whatsapp/SessionCard';
import QRModal from '../components/whatsapp/QRModal';

const Integraciones = () => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === 'Dark';

  // ── Google Calendar ─────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState({
    configured: false,
    connected: false,
    email: '',
    calendarId: 'primary',
  });

  const loadStatus = async () => {
    setLoading(true);
    setError('');
    try {
      const statusRes = await crmService.integrations.googleCalendar.status();
      setStatus({
        configured: !!statusRes?.configured,
        connected: !!statusRes?.connected,
        email: statusRes?.email || '',
        calendarId: statusRes?.calendarId || 'primary',
      });
    } catch (e) {
      setError(e?.message || 'No se pudo cargar el estado de integraciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
    const params = new URLSearchParams(window.location.search);
    if (params.get('googleCalendar') === 'connected') {
      setSuccess('¡Google Calendar conectado exitosamente!');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const connectGoogleCalendar = async () => {
    setConnecting(true);
    setError('');
    try {
      const res = await crmService.integrations.googleCalendar.getAuthUrl();
      const url = res && res.url ? String(res.url) : '';
      if (!url) throw new Error('No se pudo obtener la URL de autorización');
      window.location.href = url;
    } catch (e) {
      setError(e?.message || 'No se pudo iniciar la conexión con Google Calendar. Contacta al administrador.');
      setConnecting(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    if (!(await confirmToast('¿Desconectar Google Calendar?'))) return;
    setConnecting(true);
    setError('');
    try {
      await crmService.integrations.googleCalendar.disconnect();
      setSuccess('Calendario desconectado');
      await loadStatus();
    } catch (e) {
      setError(e?.message || 'No se pudo desconectar Google Calendar');
    } finally {
      setConnecting(false);
    }
  };

  // ── WhatsApp Sessions ───────────────────────────────────────
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [qrModal, setQrModal] = useState(null);
  const socketRef = useRef(null);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await whatsappService.getSessions();
      setSessions(Array.isArray(data) ? data : data?.sessions || []);
    } catch {
      toast.error('Error al cargar tus sesiones de WhatsApp');
    } finally {
      setSessionsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    let socket = null;
    try {
      // eslint-disable-next-line global-require
      const io = require('socket.io-client');
      const _isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
      const API_URL = _isLocal ? (process.env.REACT_APP_API_URL || 'http://localhost:4000') : 'https://api.anabellaluna.com.ar';
      const token = localStorage.getItem('authToken');
      socket = io(API_URL, { auth: { token }, transports: ['websocket'] });
      socketRef.current = socket;

      socket.on('whatsapp:session_status', ({ sessionName, status: s } = {}) => {
        if (!sessionName) return;
        setSessions((prev) => prev.map((sess) => sess.sessionName === sessionName ? { ...sess, status: s, updatedAt: new Date().toISOString() } : sess));
      });

      socket.on('whatsapp:session_connected', ({ sessionName, phone, displayName } = {}) => {
        if (!sessionName) return;
        setSessions((prev) => prev.map((sess) => sess.sessionName === sessionName ? { ...sess, status: 'CONNECTED', phone: phone || sess.phone, displayName: displayName || sess.displayName, updatedAt: new Date().toISOString() } : sess));
        setQrModal((cur) => { if (cur === sessionName) { toast.success(`WhatsApp conectado: ${phone || sessionName}`); return null; } return cur; });
      });

      socket.on('whatsapp:session_disconnected', ({ sessionName } = {}) => {
        if (!sessionName) return;
        setSessions((prev) => prev.map((sess) => sess.sessionName === sessionName ? { ...sess, status: 'DISCONNECTED', updatedAt: new Date().toISOString() } : sess));
      });
    } catch { /* graceful degradation */ }

    return () => { if (socket) socket.disconnect(); };
  }, []);

  const handleCreateSession = async () => {
    setCreating(true);
    try {
      const data = await whatsappService.createSession();
      const newSession = data?.session || data;
      if (newSession?.sessionName) {
        setSessions((prev) => [newSession, ...prev]);
        setQrModal(newSession.sessionName);
        toast.success('Sesión creada. Escaneá el QR para conectar.');
      } else {
        await loadSessions();
      }
    } catch (err) {
      toast.error(`Error al crear sesión: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (sessionName) => {
    if (!window.confirm(`¿Eliminar la sesión "${sessionName}"?`)) return;
    try {
      await whatsappService.deleteSession(sessionName);
      setSessions((prev) => prev.filter((s) => s.sessionName !== sessionName));
      toast.success('Sesión eliminada');
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
    }
  };

  const handleStop = async (sessionName) => {
    try {
      await whatsappService.stopSession(sessionName);
      setSessions((prev) => prev.map((s) => s.sessionName === sessionName ? { ...s, status: 'DISCONNECTED', updatedAt: new Date().toISOString() } : s));
      toast.success('Sesión desconectada');
    } catch (err) {
      toast.error(`Error al desconectar: ${err.message}`);
    }
  };

  const handleStart = async (sessionName) => {
    try {
      await whatsappService.startSession(sessionName);
      setSessions((prev) => prev.map((s) => s.sessionName === sessionName ? { ...s, status: 'WAITING_QR', updatedAt: new Date().toISOString() } : s));
      setQrModal(sessionName);
      toast.info('Reconectando... Escaneá el QR');
    } catch (err) {
      toast.error(`Error al reconectar: ${err.message}`);
    }
  };

  return (
    <div className={`min-h-screen px-6 lg:px-8 pt-4 pb-6 ${isDark ? 'bg-main-dark-bg' : 'bg-gray-50'}`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <FaGoogle className="text-blue-500" /> Integraciones
        </h2>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Conecta servicios externos</p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-4xl">

          {/* Google Calendar Card */}
          <div className={`rounded-2xl p-6 border ${isDark ? 'bg-secondary-dark-bg border-gray-700/50' : 'bg-white border-gray-100 shadow-md'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                <FaGoogle className="text-2xl text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold dark:text-gray-200">Google Calendar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sincroniza tus citas con tu calendario personal
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                status.connected
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
              >
                {status.connected ? <><FaCheck className="inline mr-1" /> Conectado</> : <><FaTimes className="inline mr-1" /> Desconectado</>}
              </span>
            </div>

            {status.connected && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="text-sm text-green-800 dark:text-green-300">
                  <div className="flex items-center gap-2 mb-1">
                    <FaCheck className="text-green-600" />
                    <span className="font-semibold">Calendario sincronizado</span>
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-400 ml-6">
                    {status.email && <div>Cuenta: {status.email}</div>}
                    <div>Calendario: {status.calendarId || 'principal'}</div>
                  </div>
                </div>
              </div>
            )}

            {!status.configured && (
              <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-300">
                  ⚠️ La integración con Google Calendar no está habilitada.
                  Contacta al administrador para activarla.
                </p>
              </div>
            )}

            {status.configured && !status.connected && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  📅 Conecta tu cuenta de Google para sincronizar automáticamente
                  las citas del CRM con tu calendario personal.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {status.configured && (
                <button
                  type="button"
                  disabled={connecting}
                  onClick={status.connected ? disconnectGoogleCalendar : connectGoogleCalendar}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    status.connected ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } ${connecting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {connecting ? (
                    <><FaSync className="animate-spin" /> Procesando...</>
                  ) : status.connected ? (
                    <><FaTimes /> Desconectar calendario</>
                  ) : (
                    <><FaGoogle /> Conectar con Google</>
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={loadStatus}
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <FaSync className={loading ? 'animate-spin' : ''} /> Actualizar estado
              </button>
            </div>
          </div>

          {/* WhatsApp Card */}
          <div className={`rounded-2xl p-6 border ${isDark ? 'bg-secondary-dark-bg border-gray-700/50' : 'bg-white border-gray-100 shadow-md'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#e9fbe9' }}>
                <img src="/whatsapp.svg" width="28" height="28" alt="WhatsApp" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold dark:text-gray-200">Mi WhatsApp</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Conecta tu número para gestionar conversaciones
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                sessions.some((s) => s.status === 'CONNECTED')
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}
              >
                {sessions.some((s) => s.status === 'CONNECTED')
                  ? <><FaCheck className="inline mr-1" /> Conectado</>
                  : <><FaTimes className="inline mr-1" /> Desconectado</>}
              </span>
            </div>

            {sessionsLoading ? (
              <div className="flex justify-center py-6">
                <div className="w-7 h-7 rounded-full border-4 border-gray-200 animate-spin" style={{ borderTopColor: '#25d366' }} />
              </div>
            ) : sessions.length === 0 ? (
              <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  📱 Conectá tu número de WhatsApp para empezar a gestionar tus conversaciones desde el CRM.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {sessions.map((session) => (
                  <SessionCard
                    key={session.sessionName || session._id}
                    session={session}
                    isOwner
                    onDelete={handleDelete}
                    onStop={handleStop}
                    onStart={handleStart}
                    onShowQr={(name) => setQrModal(name)}
                  />
                ))}
              </div>
            )}

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleCreateSession}
                disabled={creating}
                className="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ backgroundColor: '#25d366' }}
              >
                {creating ? (
                  <><span className="w-4 h-4 rounded-full border-2 border-white/30 animate-spin" style={{ borderTopColor: 'white' }} /> Conectando...</>
                ) : (
                  <>+ Conectar número</>
                )}
              </button>
              <button
                type="button"
                onClick={loadSessions}
                disabled={sessionsLoading}
                className="w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <FaSync className={sessionsLoading ? 'animate-spin' : ''} /> Actualizar estado
              </button>
            </div>
          </div>

        </div>
      )}

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
    </div>
  );
};

export default Integraciones;
