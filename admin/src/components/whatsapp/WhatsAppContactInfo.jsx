import React, { useState, useEffect } from 'react';
import { FiLink, FiUser, FiClock, FiTag, FiUserCheck, FiXCircle, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import whatsappService from '../../services/whatsappService';

const CountdownTimer = ({ expiresAt }) => {
  const [display, setDisplay] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;
    const update = () => {
      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) {
        setDisplay('Vencida');
        setExpired(true);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setDisplay(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      setExpired(false);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return <span className="text-gray-400 text-sm">Sin datos</span>;

  return (
    <span
      className="font-mono text-sm font-semibold"
      style={{ color: expired ? '#ef4444' : display && parseInt(display) < 1 ? '#f97316' : '#25d366' }}
    >
      {display}
    </span>
  );
};

const WhatsAppContactInfo = ({ conversation, contact, onLinkCliente }) => {
  const [labels, setLabels] = useState([]);
  const [newLabel, setNewLabel] = useState('');
  const [editingLabels, setEditingLabels] = useState(false);
  const [savingLabel, setSavingLabel] = useState(false);
  const [closingConv, setClosingConv] = useState(false);

  useEffect(() => {
    if (conversation?.labels) {
      setLabels(conversation.labels);
    }
  }, [conversation]);

  if (!conversation) {
    return (
      <div
        className="flex items-center justify-center h-full text-gray-400"
        style={{ width: '300px', borderLeft: '1px solid #e9edef', backgroundColor: '#fff' }}
      >
        <div className="text-center px-4">
          <FiUser size={36} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Seleccioná una conversación</p>
        </div>
      </div>
    );
  }

  const contactData = contact || conversation.contact || {};
  const displayName = contactData.displayName || contactData.phoneNumber || 'Desconocido';
  const initial = displayName.charAt(0).toUpperCase();
  const hasCliente = conversation.clienteId || contactData.clienteId;

  const handleAddLabel = async () => {
    const trimmed = newLabel.trim();
    if (!trimmed || labels.includes(trimmed)) return;
    const updated = [...labels, trimmed];
    setSavingLabel(true);
    try {
      await whatsappService.updateLabel(conversation._id, updated);
      setLabels(updated);
      setNewLabel('');
      toast.success('Etiqueta agregada');
    } catch {
      toast.error('Error al guardar etiqueta');
    } finally {
      setSavingLabel(false);
    }
  };

  const handleRemoveLabel = async (label) => {
    const updated = labels.filter((l) => l !== label);
    try {
      await whatsappService.updateLabel(conversation._id, updated);
      setLabels(updated);
    } catch {
      toast.error('Error al eliminar etiqueta');
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = conversation.status === 'closed' ? 'open' : 'closed';
    setClosingConv(true);
    try {
      await whatsappService.updateStatus(conversation._id, newStatus);
      toast.success(newStatus === 'closed' ? 'Conversación cerrada' : 'Conversación abierta');
    } catch {
      toast.error('Error al cambiar estado');
    } finally {
      setClosingConv(false);
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ width: '300px', borderLeft: '1px solid #e9edef', backgroundColor: '#fff' }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-3 border-b border-gray-100"
        style={{ backgroundColor: '#f0f2f5' }}
      >
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Info del contacto</p>
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center py-6 px-4 border-b border-gray-100">
        {contactData.profilePicUrl ? (
          <img
            src={contactData.profilePicUrl}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover mb-3"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3"
            style={{ backgroundColor: '#25d366' }}
          >
            {initial}
          </div>
        )}
        <h3 className="font-semibold text-gray-800 text-sm text-center">{displayName}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{contactData.phoneNumber || ''}</p>
      </div>

      {/* CRM Link */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <FiLink size={14} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">CRM</span>
        </div>
        {hasCliente ? (
          <a
            href={`/clientes?id=${hasCliente}`}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiExternalLink size={14} />
            Ver cliente en CRM
          </a>
        ) : (
          <button
            onClick={onLinkCliente}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors border"
            style={{ borderColor: '#25d366', color: '#25d366' }}
          >
            <FiUserCheck size={14} />
            Vincular a cliente CRM
          </button>
        )}
      </div>

      {/* Ventana 24h */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <FiClock size={14} className="text-gray-500" />
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ventana 24h</span>
        </div>
        <CountdownTimer expiresAt={conversation.windowExpiresAt} />
        {conversation.windowExpiresAt && (
          <p className="text-xs text-gray-400 mt-1">
            Vence: {new Date(conversation.windowExpiresAt).toLocaleString('es-AR')}
          </p>
        )}
      </div>

      {/* Labels */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FiTag size={14} className="text-gray-500" />
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Etiquetas</span>
          </div>
          <button
            onClick={() => setEditingLabels((v) => !v)}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            {editingLabels ? 'Listo' : 'Editar'}
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">
          {labels.map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}
            >
              {label}
              {editingLabels && (
                <button
                  onClick={() => handleRemoveLabel(label)}
                  className="ml-0.5 hover:text-red-500 transition-colors"
                >
                  ×
                </button>
              )}
            </span>
          ))}
          {labels.length === 0 && (
            <span className="text-xs text-gray-400">Sin etiquetas</span>
          )}
        </div>
        {editingLabels && (
          <div className="flex gap-1 mt-2">
            <input
              type="text"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
              placeholder="Nueva etiqueta"
              className="flex-1 px-2 py-1 rounded border border-gray-200 text-xs focus:outline-none focus:ring-1 focus:ring-green-300"
            />
            <button
              onClick={handleAddLabel}
              disabled={savingLabel}
              className="px-2 py-1 rounded text-white text-xs"
              style={{ backgroundColor: '#25d366' }}
            >
              {savingLabel ? '...' : 'Agregar'}
            </button>
          </div>
        )}
      </div>

      {/* Conversation status */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Estado</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
            style={{
              backgroundColor: conversation.status === 'open' ? '#e8f5e9'
                : conversation.status === 'pending' ? '#fff8e1'
                : '#ffebee',
              color: conversation.status === 'open' ? '#2e7d32'
                : conversation.status === 'pending' ? '#f57f17'
                : '#c62828',
            }}
          >
            {conversation.status === 'open' ? 'Abierta'
              : conversation.status === 'pending' ? 'Pendiente'
              : 'Cerrada'}
          </span>
        </div>
        <button
          onClick={handleToggleStatus}
          disabled={closingConv}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors border"
          style={
            conversation.status === 'closed'
              ? { borderColor: '#25d366', color: '#25d366' }
              : { borderColor: '#ef4444', color: '#ef4444' }
          }
        >
          {conversation.status === 'closed' ? (
            <><FiCheckCircle size={14} /> Abrir conversación</>
          ) : (
            <><FiXCircle size={14} /> Cerrar conversación</>
          )}
        </button>
      </div>
    </div>
  );
};

export default WhatsAppContactInfo;
