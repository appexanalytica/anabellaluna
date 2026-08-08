import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPaperPlane, FaCircle, FaSearch, FaSync, FaUserPlus, FaComments } from 'react-icons/fa';
import { useStateContext } from '../../contexts/ContextProvider';
import chatService from '../../services/chatService';

const formatTimeLabel = (date) => {
  if (!date) return '';
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  const diffHours = Math.floor((now - date) / 3600000);
  const diffDays = Math.floor((now - date) / 86400000);
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `${diffDays} días`;
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
};

const Avatar = ({ nombre, avatar, size = 'w-11 h-11' }) => (
  avatar ? (
    <img src={avatar} alt={nombre} className={`${size} rounded-full object-cover`} />
  ) : (
    <div className={`${size} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold`}>
      {(nombre || '?').charAt(0).toUpperCase()}
    </div>
  )
);

// Bandeja de chat interno con agentes (Mensajería > Agentes)
const ChatAgentesPanel = ({ onUnreadChange }) => {
  const { currentColor } = useStateContext();
  const [conversations, setConversations] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const notifyUnread = useCallback((list) => {
    if (onUnreadChange) onUnreadChange(list.reduce((sum, c) => sum + (c.noLeidos || 0), 0));
  }, [onUnreadChange]);

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const [convs, agentList] = await Promise.all([
        chatService.getConversations().catch(() => []),
        chatService.getAgents().catch(() => []),
      ]);
      const mapped = (Array.isArray(convs) ? convs : [])
        .map((conv) => {
          const partner = conv.partner || {};
          const lastMsg = conv.lastMessage || {};
          return {
            id: partner._id || conv._id,
            partnerId: partner._id,
            nombre: partner.nombre || 'Agente',
            email: partner.email || '',
            avatar: partner.avatar || null,
            rol: partner.cargo || 'Agente',
            online: partner.online || false,
            ultimoMensaje: lastMsg.content || 'Sin mensajes',
            fecha: lastMsg.createdAt ? new Date(lastMsg.createdAt) : null,
            noLeidos: conv.unreadCount || 0,
          };
        })
        .sort((a, b) => (b.fecha?.getTime() || 0) - (a.fecha?.getTime() || 0));
      setConversations(mapped);
      notifyUnread(mapped);
      setAgents(Array.isArray(agentList) ? agentList : []);
    } catch (e) {
      console.error('Error cargando chats internos:', e);
    } finally {
      setLoading(false);
    }
  }, [notifyUnread]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const loadHistory = useCallback(async (partnerId) => {
    try {
      const history = await chatService.getHistory(partnerId, { limit: 50 });
      setMessages(Array.isArray(history) ? [...history].reverse() : []);
    } catch (e) {
      console.error('Error cargando historial:', e);
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openConversation = async (conv) => {
    setSelected(conv);
    setShowAgents(false);
    setMessages([]);
    if (!conv.partnerId) return;
    loadHistory(conv.partnerId);
    if (conv.noLeidos > 0) {
      try {
        await chatService.markAsRead(conv.partnerId);
        setConversations((prev) => {
          const next = prev.map((c) => (c.id === conv.id ? { ...c, noLeidos: 0 } : c));
          notifyUnread(next);
          return next;
        });
      } catch (e) {
        console.error('Error marcando como leído:', e);
      }
    }
  };

  const startChatWithAgent = (agent) => {
    const existing = conversations.find((c) => String(c.partnerId) === String(agent._id));
    if (existing) { openConversation(existing); return; }
    openConversation({
      id: agent._id,
      partnerId: agent._id,
      nombre: agent.nombre || agent.username || 'Agente',
      email: agent.email || '',
      avatar: agent.avatar || null,
      rol: agent.cargo || 'Agente',
      online: agent.online || false,
      ultimoMensaje: '',
      fecha: null,
      noLeidos: 0,
    });
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !selected?.partnerId || sending) return;
    setSending(true);
    try {
      await chatService.send(selected.partnerId, content, { receiverType: 'agent' });
      setDraft('');
      await loadHistory(selected.partnerId);
      loadConversations();
    } catch (e) {
      console.error('Error enviando mensaje:', e);
    } finally {
      setSending(false);
    }
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredConversations = term
    ? conversations.filter((c) => c.nombre.toLowerCase().includes(term) || c.email.toLowerCase().includes(term))
    : conversations;
  const filteredAgents = term
    ? agents.filter((a) => (a.nombre || a.username || '').toLowerCase().includes(term) || (a.email || '').toLowerCase().includes(term))
    : agents;

  return (
    <div className="flex flex-1 min-w-0 h-full">
      {/* Lista */}
      <div className="flex flex-col h-full flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700" style={{ width: '350px' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Chat con agentes</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setShowAgents((v) => !v)}
              title="Nueva conversación"
              className={`p-2 rounded-lg transition-colors ${showAgents ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              style={showAgents ? { color: currentColor } : {}}
            >
              <FaUserPlus className="text-sm text-gray-600 dark:text-gray-300" />
            </button>
            <button
              type="button"
              onClick={loadConversations}
              disabled={loading}
              title="Actualizar"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaSync className={`text-sm text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={showAgents ? 'Buscar agente…' : 'Buscar conversación…'}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {showAgents ? (
            filteredAgents.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">No hay agentes</div>
            ) : filteredAgents.map((agent) => (
              <div
                key={agent._id}
                onClick={() => startChatWithAgent(agent)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <Avatar nombre={agent.nombre || agent.username} avatar={agent.avatar} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{agent.nombre || agent.username}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{agent.cargo || agent.email || 'Agente'}</p>
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <FaComments className="text-3xl mb-2 opacity-50" />
              <p className="text-sm">No hay conversaciones</p>
              <button type="button" onClick={() => setShowAgents(true)} className="text-xs mt-2 underline" style={{ color: currentColor }}>
                Iniciar un chat
              </button>
            </div>
          ) : filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => openConversation(conv)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors ${
                selected?.id === conv.id ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <Avatar nombre={conv.nombre} avatar={conv.avatar} />
                {conv.online && <FaCircle className="absolute bottom-0 right-0 text-green-500 text-[9px]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{conv.nombre}</span>
                  <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{formatTimeLabel(conv.fecha)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.ultimoMensaje}</p>
                  {conv.noLeidos > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center flex-shrink-0">
                      {conv.noLeidos > 99 ? '99+' : conv.noLeidos}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversación */}
      <div className="flex-1 min-w-0 flex flex-col h-full bg-gray-50 dark:bg-gray-900">
        {!selected ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <FaComments className="text-5xl mb-3 opacity-40" />
            <p className="text-sm">Elegí una conversación para ver los mensajes</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <Avatar nombre={selected.nombre} avatar={selected.avatar} size="w-10 h-10" />
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selected.nombre}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {selected.online && <FaCircle className="text-green-500 text-[8px]" />}
                  {selected.online ? 'En línea' : selected.rol}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 dark:text-gray-500 py-10">
                  <FaComments className="text-3xl mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No hay mensajes aún</p>
                </div>
              ) : messages.map((msg, idx) => {
                const isOwn = String(msg.senderId) !== String(selected.partnerId);
                return (
                  <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm shadow-sm ${
                      isOwn ? 'text-white rounded-br-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none'
                    }`} style={isOwn ? { backgroundColor: currentColor } : {}}>
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                        {msg.createdAt ? formatTimeLabel(new Date(msg.createdAt)) : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Escribí un mensaje…"
                  className="flex-1 px-4 py-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={sending || !draft.trim()}
                  className="p-2.5 rounded-lg text-white disabled:opacity-40 transition-opacity"
                  style={{ backgroundColor: currentColor }}
                  title="Enviar"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatAgentesPanel;
