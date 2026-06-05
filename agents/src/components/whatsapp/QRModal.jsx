import React, { useEffect, useState, useRef, useCallback } from 'react';
import whatsappService from '../../services/whatsappService';

const POLLING_INTERVAL_MS = 5000;
const TIMEOUT_MS = 60000;

const QRModal = ({ sessionName, onClose, onConnected }) => {
  const [qrBase64, setQrBase64] = useState(null);
  const [loadingQr, setLoadingQr] = useState(true);
  const [timedOut, setTimedOut] = useState(false);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const fetchQr = useCallback(async () => {
    try {
      const data = await whatsappService.getSessionQr(sessionName);
      if (!isMountedRef.current) return;
      const qr = data?.qr || data?.qrCode || data?.base64 || data?.qrcode || null;
      if (qr) {
        setQrBase64(qr);
        setLoadingQr(false);
        setError(null);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError('No se pudo obtener el QR. Reintentando...');
    }
  }, [sessionName]);

  const pollStatus = useCallback(async () => {
    try {
      const data = await whatsappService.getSessionStatus(sessionName);
      if (!isMountedRef.current) return;

      const status = data?.status || data?.state || data?.connectionStatus || '';

      if (status === 'CONNECTED' || status === 'open') {
        clearTimers();
        if (onConnected) onConnected();
        onClose();
        return;
      }

      const newQr = data?.qr || data?.qrCode || data?.base64 || null;
      if (newQr && newQr !== qrBase64) {
        setQrBase64(newQr);
        setLoadingQr(false);
      }
    } catch (err) {
      // silent — keep polling
    }
  }, [sessionName, onConnected, onClose, clearTimers, qrBase64]);

  const startPolling = useCallback(() => {
    clearTimers();
    setTimedOut(false);
    setLoadingQr(true);
    setError(null);

    fetchQr();

    intervalRef.current = setInterval(pollStatus, POLLING_INTERVAL_MS);

    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      setTimedOut(true);
    }, TIMEOUT_MS);
  }, [fetchQr, pollStatus, clearTimers]);

  useEffect(() => {
    isMountedRef.current = true;
    startPolling();

    return () => {
      isMountedRef.current = false;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionName]);

  const handleRegenerate = () => {
    startPolling();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ borderColor: '#e9edef' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: '#e9edef', backgroundColor: '#f0f2f5' }}
        >
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="24" cy="24" r="24" fill="#25D366" />
              <path d="M24.0025 10C16.2712 10 10 16.2694 10 23.9975C10 26.5369 10.6931 28.9194 11.9131 30.9644L10.075 38L17.3319 36.2006C19.3019 37.3069 21.575 37.9444 24.0025 37.9444C31.7338 37.9444 38 31.675 38 23.9469C38 20.1956 36.5094 16.7081 34.0644 14.1506C31.6194 11.5931 28.0206 10 24.0025 10Z" fill="white" />
              <path d="M24.0025 12.5C17.5512 12.5 12.5 17.5494 12.5 23.9975C12.5 26.3581 13.1931 28.5575 14.3944 30.4069L13 36L18.7525 34.6319C20.5319 35.7019 22.695 36.4444 24.9981 36.4444C31.4494 36.4444 36.5 31.3956 36.5 23.9469C36.5 20.4219 35.1319 17.205 32.8 14.8469C30.4675 12.4894 27.4012 12.5 24.0025 12.5Z" fill="#25D366" />
            </svg>
            <span className="font-semibold text-gray-900 text-sm">Conectar WhatsApp</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full w-7 h-7 flex items-center justify-center hover:bg-gray-200"
            aria-label="Cerrar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        {/* QR area */}
        <div className="flex flex-col items-center justify-center px-5 py-6">
          {loadingQr && !timedOut ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <div
                className="w-10 h-10 rounded-full border-4 border-gray-200 animate-spin"
                style={{ borderTopColor: '#25d366' }}
              />
              <p className="text-sm text-gray-500">Generando código QR...</p>
            </div>
          ) : timedOut && !qrBase64 ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-gray-500 text-center">Tiempo de espera agotado.</p>
              <button
                type="button"
                onClick={handleRegenerate}
                className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#25d366' }}
              >
                Regenerar QR
              </button>
            </div>
          ) : qrBase64 ? (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-white rounded-xl border" style={{ borderColor: '#e9edef' }}>
                <img
                  src={qrBase64.startsWith('data:') ? qrBase64 : `data:image/png;base64,${qrBase64}`}
                  alt="Código QR de WhatsApp"
                  className="w-52 h-52 object-contain"
                />
              </div>
              {timedOut && (
                <button
                  type="button"
                  onClick={handleRegenerate}
                  className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors mt-1"
                  style={{ backgroundColor: '#25d366' }}
                >
                  Regenerar QR
                </button>
              )}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <p className="text-sm text-red-500 text-center">{error}</p>
              <button
                type="button"
                onClick={handleRegenerate}
                className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: '#25d366' }}
              >
                Reintentar
              </button>
            </div>
          ) : null}

          {/* Instructions */}
          <div
            className="mt-4 w-full rounded-xl p-4 text-xs text-gray-600 space-y-1"
            style={{ backgroundColor: '#f0f2f5' }}
          >
            <p className="font-semibold text-gray-700 mb-2">Pasos para conectar:</p>
            <p>1. Abrí WhatsApp en tu teléfono</p>
            <p>2. Toca el menú de tres puntos (Android) o Configuracion (iPhone)</p>
            <p>3. Seleccioná <strong>Dispositivos vinculados</strong></p>
            <p>4. Toca <strong>Vincular dispositivo</strong> y escaneá este QR</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full text-sm font-medium px-4 py-2.5 rounded-xl text-gray-600 border transition-colors hover:bg-gray-50"
            style={{ borderColor: '#e9edef' }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRModal;
