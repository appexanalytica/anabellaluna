import React, { useState, useMemo } from 'react';
import { FiSearch } from 'react-icons/fi';

const WhatsAppLogo = ({ size = 22 }) => (
  <img src="/whatsapp.svg" width={size} height={size} alt="WhatsApp" />
);

const TABS = [
  { key: 'all', label: 'Todas' },
  { key: 'open', label: 'Abiertas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'closed', label: 'Cerradas' },
];

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `hace ${diffMins} min`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `hace ${diffDays}d`;
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
};

const ConversationItem = ({ conv, isSelected, onSelect }) => {
  // El backend devuelve contactId como objeto populate (puede venir como contact o contactId)
  const contact = conv.contactId || conv.contact || {};
  const displayName = contact.displayName || contact.phoneNumber || 'Desconocido';
  const initial = displayName.charAt(0).toUpperCase();
  const lastMsg = conv.lastMessage;
  const preview = lastMsg?.content?.text || lastMsg?.content || (lastMsg?.type ? `[${lastMsg.type}]` : 'Sin mensajes');
  const truncated = typeof preview === 'string' && preview.length > 40 ? preview.substring(0, 40) + '…' : (preview || 'Sin mensajes');

  return (
    <div
      onClick={() => onSelect(conv)}
      className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 hover:bg-gray-50"
      style={{ backgroundColor: isSelected ? '#f0f2f5' : undefined }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {contact.profilePicUrl ? (
          <img
            src={contact.profilePicUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg"
            style={{ backgroundColor: '#25d366' }}
          >
            {initial}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm text-gray-900 truncate">{displayName}</span>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
            {formatRelativeTime(lastMsg?.timestamp || conv.updatedAt)}
          </span>
        </div>
        {conv.sessionName && (
          <span className="text-xs text-green-600 truncate block" style={{ fontSize: '11px' }}>
            {conv.sessionName}
          </span>
        )}
        <p className="text-xs text-gray-500 truncate mt-0.5">{truncated}</p>
      </div>

      {/* Unread badge */}
      {conv.unreadCount > 0 && (
        <span
          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
          style={{ backgroundColor: '#25d366', minWidth: '20px' }}
        >
          {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
        </span>
      )}
    </div>
  );
};

const WhatsAppSidebar = ({ conversations = [], selectedId, onSelect, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const filtered = useMemo(() => {
    let result = conversations;

    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter((c) => c.status === activeTab);
    }

    // Filter by search (contactId viene de populate, también soporta contact legacy)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((c) => {
        const contact = c.contactId || c.contact || {};
        const name = contact.displayName?.toLowerCase() || '';
        const phone = contact.phoneNumber?.toLowerCase() || '';
        const session = c.sessionName?.toLowerCase() || '';
        return name.includes(term) || phone.includes(term) || session.includes(term);
      });
    }

    return result;
  }, [conversations, activeTab, searchTerm]);

  return (
    <div className="flex flex-col h-full" style={{ width: '350px', borderRight: '1px solid #e9edef', backgroundColor: '#fff' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0"
        style={{ backgroundColor: '#f0f2f5', borderBottom: '1px solid #e9edef' }}
      >
        <div className="flex items-center gap-2">
          <WhatsAppLogo size={24} />
          <span className="font-semibold text-gray-800 text-sm">WhatsApp Business</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 flex-shrink-0" style={{ backgroundColor: '#f0f2f5' }}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Buscar o iniciar nueva conversación"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none bg-white"
            style={{ border: '1px solid #e9edef', fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex-1 py-2 text-xs font-medium transition-colors"
            style={{
              color: activeTab === tab.key ? '#25d366' : '#667781',
              borderBottom: activeTab === tab.key ? '2px solid #25d366' : '2px solid transparent',
              backgroundColor: 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <WhatsAppLogo size={40} />
            <p className="text-sm">No hay conversaciones</p>
            {searchTerm && (
              <p className="text-xs mt-1">Sin resultados para "{searchTerm}"</p>
            )}
          </div>
        ) : (
          filtered.map((conv) => (
            <ConversationItem
              key={conv._id}
              conv={conv}
              isSelected={selectedId === conv._id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default WhatsAppSidebar;
