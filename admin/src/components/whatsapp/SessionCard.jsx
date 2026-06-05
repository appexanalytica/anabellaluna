import React from 'react';

const WhatsAppLogoCircle = () => (
  <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path d="M24.0025 10C16.2712 10 10 16.2694 10 23.9975C10 26.5369 10.6931 28.9194 11.9131 30.9644L10.075 38L17.3319 36.2006C19.3019 37.3069 21.575 37.9444 24.0025 37.9444C31.7338 37.9444 38 31.675 38 23.9469C38 20.1956 36.5094 16.7081 34.0644 14.1506C31.6194 11.5931 28.0206 10 24.0025 10Z" fill="white" />
    <path d="M24.0025 12.5C17.5512 12.5 12.5 17.5494 12.5 23.9975C12.5 26.3581 13.1931 28.5575 14.3944 30.4069L13 36L18.7525 34.6319C20.5319 35.7019 22.695 36.4444 24.9981 36.4444C31.4494 36.4444 36.5 31.3956 36.5 23.9469C36.5 20.4219 35.1319 17.205 32.8 14.8469C30.4675 12.4894 27.4012 12.5 24.0025 12.5ZM19.845 18.3219C20.1 18.3219 20.3631 18.3131 20.5894 18.3219C20.8525 18.3312 21.1069 18.4675 21.305 18.9712C21.5406 19.555 22.0681 20.9731 22.1444 21.1294C22.2206 21.285 22.2663 21.4681 22.1625 21.6788C22.0588 21.8894 22.005 22.0175 21.8494 22.1988C21.6938 22.38 21.5206 22.6063 21.38 22.7469C21.2244 22.9025 21.0625 23.07 21.24 23.3806C21.4181 23.6906 22.0613 24.7531 23.03 25.62C24.2813 26.7338 25.3438 27.0969 25.6538 27.2525C25.9631 27.4081 26.1469 27.3844 26.325 27.185C26.5025 26.985 27.1188 26.2681 27.3238 25.9581C27.5288 25.6481 27.7344 25.6994 28.02 25.8094C28.3063 25.9194 29.7244 26.6194 30.0338 26.775C30.3438 26.9306 30.5469 27.0088 30.6231 27.13C30.7 27.2519 30.7 27.8413 30.4644 28.53C30.2294 29.2194 29.025 29.8363 28.44 29.9156C27.855 29.9956 27.2325 30.0331 25.7413 29.455C23.6181 28.6488 22.12 27.14 21.04 25.7775C20.1963 24.7175 19.44 23.3081 19.1131 21.99C18.7863 20.6725 18.9131 19.5744 19.1869 18.9806C19.3869 18.5406 19.5906 18.3219 19.845 18.3219Z" fill="#25D366" />
  </svg>
);

const QRIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3h7v7H3V3zm1 1v5h5V4H4zm1 1h3v3H5V5zM14 3h7v7h-7V3zm1 1v5h5V4h-5zm1 1h3v3h-3V5zM3 14h7v7H3v-7zm1 1v5h5v-5H4zm1 1h3v3H5v-3zM14 14h2v2h-2v-2zm3 0h2v2h-2v-2zm-3 3h2v2h-2v-2zm3 0h2v2h-2v-2zm3-3h1v7h-4v-2h-1v2h-1v-5h2v-1h3v-1zm-1 1v1h1v-1h-1z" />
  </svg>
);

const STATUS_CONFIG = {
  CONNECTED: {
    label: 'Conectado',
    color: '#25d366',
    bgColor: '#f0fff4',
    textColor: '#15803d',
    pulse: true,
  },
  WAITING_QR: {
    label: 'Esperando QR',
    color: '#eab308',
    bgColor: '#fefce8',
    textColor: '#854d0e',
    pulse: false,
  },
  DISCONNECTED: {
    label: 'Desconectado',
    color: '#9ca3af',
    bgColor: '#f9fafb',
    textColor: '#4b5563',
    pulse: false,
  },
  ERROR: {
    label: 'Error',
    color: '#ef4444',
    bgColor: '#fef2f2',
    textColor: '#991b1b',
    pulse: false,
  },
  CREATED: {
    label: 'Creado',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    textColor: '#1d4ed8',
    pulse: false,
  },
  BLOCKED: {
    label: 'Bloqueado',
    color: '#f97316',
    bgColor: '#fff7ed',
    textColor: '#9a3412',
    pulse: false,
  },
};

function formatTimestamp(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

const SessionCard = ({ session, onDelete, onStop, onStart, onShowQr, isOwner }) => {
  const status = session.status || 'CREATED';
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.DISCONNECTED;

  const displayTitle = session.displayName || session.sessionName || 'Sin nombre';
  const displayPhone =
    status === 'WAITING_QR'
      ? 'Esperando QR...'
      : session.phone || 'Sin número';

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border flex flex-col overflow-hidden"
      style={{ borderColor: '#e9edef' }}
    >
      {/* Card body */}
      <div className="p-5 flex-1">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <WhatsAppLogoCircle />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm">{displayTitle}</p>
            <p className="text-gray-500 text-xs mt-0.5 truncate">{displayPhone}</p>

            {/* Status badge */}
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: statusCfg.bgColor, color: statusCfg.textColor }}
            >
              {statusCfg.pulse ? (
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: statusCfg.color }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: statusCfg.color }}
                  />
                </span>
              ) : status === 'WAITING_QR' ? (
                <span style={{ color: statusCfg.color }}><QRIcon /></span>
              ) : (
                <span
                  className="inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: statusCfg.color }}
                />
              )}
              {statusCfg.label}
            </div>
          </div>
        </div>

        {/* Timestamp */}
        {session.updatedAt && (
          <p className="text-xs text-gray-400 mt-3">
            Actualizado: {formatTimestamp(session.updatedAt)}
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div
        className="px-5 py-3 flex items-center gap-2 border-t"
        style={{ backgroundColor: '#f0f2f5', borderColor: '#e9edef' }}
      >
        {/* Action buttons based on status */}
        {status === 'WAITING_QR' && (
          <button
            type="button"
            onClick={() => onShowQr && onShowQr(session.sessionName)}
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#eab308' }}
          >
            Ver QR
          </button>
        )}

        {status === 'CONNECTED' && (
          <button
            type="button"
            onClick={() => onStop && onStop(session.sessionName)}
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors bg-gray-500 hover:bg-gray-600"
          >
            Desconectar
          </button>
        )}

        {(status === 'DISCONNECTED' || status === 'ERROR') && (
          <button
            type="button"
            onClick={() => onStart && onStart(session.sessionName)}
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#25d366' }}
          >
            Reconectar
          </button>
        )}

        {(status === 'CREATED') && (
          <button
            type="button"
            onClick={() => onShowQr && onShowQr(session.sessionName)}
            className="flex-1 text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#3b82f6' }}
          >
            Ver QR
          </button>
        )}

        {/* Delete button — only for owner */}
        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete && onDelete(session.sessionName)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg text-white transition-colors bg-red-500 hover:bg-red-600"
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default SessionCard;
