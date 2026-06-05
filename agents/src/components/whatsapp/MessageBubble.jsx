import React, { useState } from 'react';
import { FiFile, FiDownload, FiAlertCircle, FiLayout } from 'react-icons/fi';
import { FaCheck, FaCheckDouble, FaTimes } from 'react-icons/fa';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const StatusIcon = ({ status, errorDetails }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (status === 'pending' || status === 'sent') {
    return <FaCheck className="text-xs" style={{ color: '#9e9e9e' }} />;
  }
  if (status === 'delivered') {
    return <FaCheckDouble className="text-xs" style={{ color: '#9e9e9e' }} />;
  }
  if (status === 'read') {
    return <FaCheckDouble className="text-xs" style={{ color: '#53bdeb' }} />;
  }
  if (status === 'failed') {
    return (
      <span
        className="relative inline-flex"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <FaTimes className="text-xs text-red-500 cursor-help" />
        {showTooltip && errorDetails && (
          <span className="absolute bottom-5 right-0 bg-gray-800 text-white text-xs rounded px-2 py-1 w-48 z-10 shadow-lg">
            {errorDetails}
          </span>
        )}
      </span>
    );
  }
  return null;
};

const MessageBubble = ({ message, isOutbound }) => {
  const { type, content, status, errorDetails, createdAt } = message;

  const bubbleStyle = isOutbound
    ? { backgroundColor: '#dcf8c6', borderRadius: '8px 8px 0 8px', alignSelf: 'flex-end' }
    : { backgroundColor: '#ffffff', borderRadius: '8px 8px 8px 0', alignSelf: 'flex-start', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' };

  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <p style={{ fontSize: '14px', color: '#303030', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {content?.text || ''}
          </p>
        );

      case 'image':
        return (
          <div>
            {content?.mediaUrl ? (
              <img
                src={content.mediaUrl}
                alt={content?.caption || 'Imagen'}
                className="rounded max-w-full"
                style={{ maxHeight: '200px', objectFit: 'cover' }}
              />
            ) : (
              <div className="flex items-center justify-center bg-gray-200 rounded" style={{ width: '200px', height: '150px' }}>
                <span className="text-gray-500 text-sm">Imagen</span>
              </div>
            )}
            {content?.caption && (
              <p style={{ fontSize: '13px', color: '#303030', marginTop: '4px' }}>{content.caption}</p>
            )}
          </div>
        );

      case 'document':
        return (
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded" style={{ minWidth: '200px' }}>
            <FiFile className="text-blue-500 flex-shrink-0" size={24} />
            <span style={{ fontSize: '13px', color: '#303030', flex: 1, wordBreak: 'break-all' }}>
              {content?.filename || 'Documento'}
            </span>
            {content?.mediaUrl && (
              <a
                href={content.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                title="Descargar"
              >
                <FiDownload size={16} />
              </a>
            )}
          </div>
        );

      case 'audio':
        return (
          <div style={{ minWidth: '200px' }}>
            {content?.mediaUrl ? (
              <audio controls style={{ width: '100%', maxWidth: '250px' }}>
                <source src={content.mediaUrl} />
                Tu navegador no soporta audio.
              </audio>
            ) : (
              <div className="bg-gray-100 rounded p-2 text-sm text-gray-500">Audio no disponible</div>
            )}
          </div>
        );

      case 'video':
        return (
          <div>
            {content?.mediaUrl ? (
              <video controls style={{ maxWidth: '250px', maxHeight: '200px', borderRadius: '4px' }}>
                <source src={content.mediaUrl} />
                Tu navegador no soporta video.
              </video>
            ) : (
              <div className="bg-gray-100 rounded p-2 text-sm text-gray-500">Video no disponible</div>
            )}
            {content?.caption && (
              <p style={{ fontSize: '13px', color: '#303030', marginTop: '4px' }}>{content.caption}</p>
            )}
          </div>
        );

      case 'template':
        return (
          <div className="flex items-start gap-2 p-2 bg-gray-50 rounded border border-gray-200" style={{ minWidth: '180px' }}>
            <FiLayout className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p style={{ fontSize: '12px', color: '#666', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Template
              </p>
              <p style={{ fontSize: '14px', color: '#303030' }}>
                {content?.templateName || 'Plantilla'}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <p style={{ fontSize: '14px', color: '#303030' }}>
            {content?.text || `[${type}]`}
          </p>
        );
    }
  };

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'} mb-1`}>
      <div style={{ maxWidth: '70%', position: 'relative' }}>
        {/* Bubble */}
        <div style={{ ...bubbleStyle, padding: '6px 10px 4px 10px', display: 'inline-block', maxWidth: '100%' }}>
          {/* Tail */}
          {isOutbound ? (
            <span style={{
              position: 'absolute',
              bottom: 0,
              right: -6,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 0 8px 8px',
              borderColor: 'transparent transparent #dcf8c6 transparent',
            }} />
          ) : (
            <span style={{
              position: 'absolute',
              bottom: 0,
              left: -6,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 8px 8px 0',
              borderColor: 'transparent #ffffff transparent transparent',
            }} />
          )}

          {renderContent()}

          {/* Footer: time + status */}
          <div className={`flex items-center gap-1 mt-1 ${isOutbound ? 'justify-end' : 'justify-start'}`}>
            <span style={{ fontSize: '11px', color: '#999', whiteSpace: 'nowrap' }}>
              {formatTime(createdAt)}
            </span>
            {isOutbound && (
              <StatusIcon status={status} errorDetails={errorDetails} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
