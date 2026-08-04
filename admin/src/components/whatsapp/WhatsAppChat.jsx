import React, { useEffect, useRef, useState } from 'react';
import { FiLoader, FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { FaComments } from 'react-icons/fa';
import MessageBubble from './MessageBubble';
import WhatsAppInputBar from './WhatsAppInputBar';

const formatDateLabel = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const msgDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today - msgDay) / 86400000);

  if (diffDays === 0) return 'HOY';
  if (diffDays === 1) return 'AYER';
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });
};

const isSameDay = (a, b) => {
  const da = new Date(a);
  const db = new Date(b);
  return da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate();
};

const WindowBanner = ({ windowExpiresAt }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const update = () => {
      if (!windowExpiresAt) return;
      const diff = new Date(windowExpiresAt) - new Date();
      if (diff <= 0) {
        setTimeLeft('vencida');
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [windowExpiresAt]);

  if (!windowExpiresAt) return null;
  const expired = new Date(windowExpiresAt) < new Date();
  const expiresSoon = !expired && (new Date(windowExpiresAt) - new Date()) < 3600000;

  if (!expired && !expiresSoon) return null;

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 text-sm flex-shrink-0"
      style={{ backgroundColor: expired ? '#fff3cd' : '#fff8e1', borderBottom: '1px solid #ffe69c' }}
    >
      <FiAlertTriangle className={expired ? 'text-orange-600' : 'text-yellow-600'} size={14} />
      <span style={{ color: expired ? '#92400e' : '#78350f', fontSize: '13px' }}>
        {expired
          ? 'La ventana de respuesta libre está cerrada. Solo podés enviar templates aprobados.'
          : `La ventana de respuesta libre vence en ${timeLeft}. Aprovechá para responder libremente.`}
      </span>
    </div>
  );
};

const WhatsAppChat = ({ conversation, messages = [], onSendMessage, loading, templates = [], onDeleteConversation }) => {
  const messagesEndRef = useRef(null);
  const prevMessagesLen = useRef(0);

  useEffect(() => {
    if (messages.length !== prevMessagesLen.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      prevMessagesLen.current = messages.length;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="text-center text-gray-400">
          <FaComments size={60} className="mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-semibold mb-2 text-gray-500">Seleccioná una conversación</h3>
          <p className="text-sm">Elegí un contacto de la lista para ver los mensajes</p>
        </div>
      </div>
    );
  }

  const contact = conversation.contact || {};
  const displayName = contact.displayName || contact.phoneNumber || 'Desconocido';
  const initial = displayName.charAt(0).toUpperCase();
  const windowExpired = conversation.windowExpiresAt
    ? new Date(conversation.windowExpiresAt) < new Date()
    : false;

  // Group messages by day
  const groupedMessages = messages.reduce((acc, msg, idx) => {
    const prev = messages[idx - 1];
    if (!prev || !isSameDay(prev.createdAt, msg.createdAt)) {
      acc.push({ type: 'date', label: formatDateLabel(msg.createdAt), key: `date-${idx}` });
    }
    acc.push({ type: 'message', msg, key: msg._id || `msg-${idx}` });
    return acc;
  }, []);

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: '#efeae2', overflow: 'hidden' }}>
      {/* Chat Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{ backgroundColor: '#f0f2f5', borderBottom: '1px solid #e9edef' }}
      >
        {contact.profilePicUrl ? (
          <img
            src={contact.profilePicUrl}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
            style={{ backgroundColor: '#25d366' }}
          >
            {initial}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{displayName}</h3>
          <p className="text-xs text-gray-500 truncate">
            {contact.phoneNumber || ''}
            {conversation.status === 'closed' && (
              <span className="ml-2 px-1.5 py-0.5 rounded text-xs bg-gray-200 text-gray-600">Cerrada</span>
            )}
          </p>
        </div>
        {onDeleteConversation && (
          <button
            type="button"
            onClick={() => onDeleteConversation(conversation._id)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            title="Eliminar conversación"
          >
            <FiTrash2 size={14} />
            Eliminar
          </button>
        )}
      </div>

      {/* Window banner */}
      <WindowBanner windowExpiresAt={conversation.windowExpiresAt} />

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="animate-spin text-gray-400" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <FaComments size={40} className="mb-3 opacity-30" />
            <p className="text-sm">No hay mensajes aún</p>
            <p className="text-xs mt-1">Enviá el primer mensaje</p>
          </div>
        ) : (
          <>
            {groupedMessages.map((item) => {
              if (item.type === 'date') {
                return (
                  <div key={item.key} className="flex justify-center my-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: '#e1f2fb', color: '#54656f', fontSize: '12px' }}
                    >
                      {item.label}
                    </span>
                  </div>
                );
              }
              const isOutbound = item.msg.direction === 'outbound';
              return (
                <MessageBubble
                  key={item.key}
                  message={item.msg}
                  isOutbound={isOutbound}
                />
              );
            })}
            {loading && (
              <div className="flex justify-center py-2">
                <FiLoader className="animate-spin text-gray-400" size={20} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <WhatsAppInputBar
        onSend={onSendMessage}
        windowOpen={!windowExpired && conversation.status !== 'closed'}
        templates={templates}
      />
    </div>
  );
};

export default WhatsAppChat;
