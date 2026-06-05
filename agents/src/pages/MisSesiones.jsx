import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';
import whatsappService from '../services/whatsappService';
import SessionCard from '../components/whatsapp/SessionCard';
import QRModal from '../components/whatsapp/QRModal';

const MisSesiones = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [qrModal, setQrModal] = useState(null); // sessionName | null
  const socketRef = useRef(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await whatsappService.getSessions();
      const list = Array.isArray(data) ? data : data?.sessions || [];
      setSessions(list);
    } catch (err) {
      toast.error('Error al cargar tus sesiones de WhatsApp');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Socket.IO — eventos en tiempo real
  useEffect(() => {
    let socket = null;
    try {
      // eslint-disable-next-line global-require
      const io = require('socket.io-client');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
      const token = localStorage.getItem('authToken');
      socket = io(API_URL, { auth: { token }, transports: ['websocket'] });
      socketRef.current = socket;

      socket.on('whatsapp:session_status', (payload) => {
        const { sessionName, status } = payload || {};
        if (!sessionName) return;
        setSessions((prev) =>
          prev.map((s) =>
            s.sessionName === sessionName
              ? { ...s, status, updatedAt: new Date().toISOString() }
              : s
          )
        );
      });

      socket.on('whatsapp:session_connected', (payload) => {
        const { sessionName, phone, displayName } = payload || {};
        if (!sessionName) return;
        setSessions((prev) =>
          prev.map((s) =>
            s.sessionName === sessionName
              ? { ...s, status: 'CONNECTED', phone: phone || s.phone, displayName: displayName || s.displayName, updatedAt: new Date().toISOString() }
              : s
          )
        );
        setQrModal((current) => {
          if (current === sessionName) {
            toast.success(`WhatsApp conectado: ${phone || sessionName}`);
            return null;
          }
          return current;
        });
      });

      socket.on('whatsapp:session_disconnected', (payload) => {
        const { sessionName } = payload || {};
        if (!sessionName) return;
        setSessions((prev) =>
          prev.map((s) =>
            s.sessionName === sessionName
              ? { ...s, status: 'DISCONNECTED', updatedAt: new Date().toISOString() }
              : s
          )
        );
      });
    } catch (err) {
      // Socket not available — graceful degradation
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const handleCreateSession = async () => {
    setCreating(true);
    try {
      const data = await whatsappService.createSession();
      const newSession = data?.session || data;
      if (newSession && newSession.sessionName) {
        setSessions((prev) => [newSession, ...prev]);
        setQrModal(newSession.sessionName);
        toast.success('Sesión creada. Escaneá el QR para conectar.');
      } else {
        toast.info('Sesión creada. Actualizando lista...');
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
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionName === sessionName
            ? { ...s, status: 'DISCONNECTED', updatedAt: new Date().toISOString() }
            : s
        )
      );
      toast.success('Sesión desconectada');
    } catch (err) {
      toast.error(`Error al desconectar: ${err.message}`);
    }
  };

  const handleStart = async (sessionName) => {
    try {
      await whatsappService.startSession(sessionName);
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionName === sessionName
            ? { ...s, status: 'WAITING_QR', updatedAt: new Date().toISOString() }
            : s
        )
      );
      setQrModal(sessionName);
      toast.info('Reconectando... Escaneá el QR');
    } catch (err) {
      toast.error(`Error al reconectar: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f0f2f5' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis números de WhatsApp</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Conectá tu número personal o corporativo para gestionar tus conversaciones
          </p>
        </div>
        <button
          type="button"
          onClick={handleCreateSession}
          disabled={creating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
          style={{ backgroundColor: '#25d366' }}
        >
          {creating ? (
            <>
              <span
                className="w-4 h-4 rounded-full border-2 border-white/30 animate-spin"
                style={{ borderTopColor: 'white' }}
              />
              Creando...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              Conectar número
            </>
          )}
        </button>
      </div>

      {/* Sessions grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div
            className="w-10 h-10 rounded-full border-4 border-gray-200 animate-spin"
            style={{ borderTopColor: '#25d366' }}
          />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#e9edef' }}
          >
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#25D366" />
              <path d="M24.0025 10C16.2712 10 10 16.2694 10 23.9975C10 26.5369 10.6931 28.9194 11.9131 30.9644L10.075 38L17.3319 36.2006C19.3019 37.3069 21.575 37.9444 24.0025 37.9444C31.7338 37.9444 38 31.675 38 23.9469C38 20.1956 36.5094 16.7081 34.0644 14.1506C31.6194 11.5931 28.0206 10 24.0025 10Z" fill="white" />
              <path d="M24.0025 12.5C17.5512 12.5 12.5 17.5494 12.5 23.9975C12.5 26.3581 13.1931 28.5575 14.3944 30.4069L13 36L18.7525 34.6319C20.5319 35.7019 22.695 36.4444 24.9981 36.4444C31.4494 36.4444 36.5 31.3956 36.5 23.9469C36.5 20.4219 35.1319 17.205 32.8 14.8469C30.4675 12.4894 27.4012 12.5 24.0025 12.5Z" fill="#25D366" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No tenés números conectados</h3>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Conectá tu número de WhatsApp para empezar a gestionar tus conversaciones desde el CRM.
          </p>
          <button
            type="button"
            onClick={handleCreateSession}
            disabled={creating}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
            style={{ backgroundColor: '#25d366' }}
          >
            + Conectar número
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* QR Modal */}
      {qrModal && (
        <QRModal
          sessionName={qrModal}
          onClose={() => setQrModal(null)}
          onConnected={() => {
            setSessions((prev) =>
              prev.map((s) =>
                s.sessionName === qrModal
                  ? { ...s, status: 'CONNECTED', updatedAt: new Date().toISOString() }
                  : s
              )
            );
            toast.success('WhatsApp conectado exitosamente');
          }}
        />
      )}
    </div>
  );
};

export default MisSesiones;
