import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUsers, FaGlobe } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
import whatsappService from '../services/whatsappService';
import notificationService from '../services/notificationService';
import WhatsAppSidebar from '../components/whatsapp/WhatsAppSidebar';
import WhatsAppChat from '../components/whatsapp/WhatsAppChat';
import WhatsAppContactInfo from '../components/whatsapp/WhatsAppContactInfo';
import ChatAgentesPanel from '../components/mensajeria/ChatAgentesPanel';
import ConsultasWebPanel from '../components/mensajeria/ConsultasWebPanel';

// WhatsApp está oculto: la integración sigue instalada y los datos intactos,
// pero no se está usando. Para volver a habilitarlo, poner WHATSAPP_ENABLED en true.
const WHATSAPP_ENABLED = false;

const WhatsAppLogo = ({ size = 22 }) => (
  <img src="/whatsapp.svg" width={size} height={size} alt="WhatsApp" />
);

const CHANNELS = [
  ...(WHATSAPP_ENABLED ? [{ key: 'whatsapp', label: 'WhatsApp', icon: <WhatsAppLogo size={22} /> }] : []),
  { key: 'agentes', label: 'Agentes', icon: <FaUsers size={20} /> },
  { key: 'web', label: 'Consultas', icon: <FaGlobe size={20} /> },
];

const VALID_CHANNELS = CHANNELS.map((c) => c.key);
const DEFAULT_CHANNEL = CHANNELS[0].key;

const Mensajeria = () => {
  const { currentMode, currentColor } = useStateContext();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  // Canal activo: whatsapp | agentes | web
  const requestedChannel = useMemo(() => {
    const fromState = location.state?.canal;
    const fromQuery = new URLSearchParams(location.search).get('canal');
    const candidate = fromState || fromQuery;
    return VALID_CHANNELS.includes(candidate) ? candidate : null;
  }, [location.state, location.search]);

  const [channel, setChannel] = useState(requestedChannel || DEFAULT_CHANNEL);
  const [agentesUnread, setAgentesUnread] = useState(0);
  const [webUnread, setWebUnread] = useState(0);
  const autoSelected = useRef(!!requestedChannel);

  const isDark = currentMode === 'Dark';

  // Si vienen desde el navbar sin canal explícito, abrir el que tenga pendientes
  useEffect(() => {
    if (requestedChannel) {
      setChannel(requestedChannel);
      autoSelected.current = true;
      return;
    }
    if (autoSelected.current) return;
    let cancelled = false;
    notificationService.getNavbarSummary()
      .then((summary) => {
        if (cancelled || autoSelected.current || !summary) return;
        autoSelected.current = true;
        const internos = summary.mensajes?.internosNoLeidos || 0;
        const consultas = summary.mensajes?.consultasNoLeidas ?? summary.consultas?.noLeidas ?? 0;
        if (internos > 0) setChannel('agentes');
        else if (consultas > 0) setChannel('web');
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [requestedChannel]);

  // Load initial data
  useEffect(() => {
    if (!WHATSAPP_ENABLED) return;
    const load = async () => {
      setLoading(true);
      try {
        const [convData, tplData] = await Promise.all([
          whatsappService.getConversations().catch(() => []),
          whatsappService.getTemplates().catch(() => []),
        ]);
        setConversations(Array.isArray(convData) ? convData : convData?.conversations || []);
        setTemplates(Array.isArray(tplData) ? tplData : tplData?.templates || []);
      } catch (err) {
        console.error('Error loading WhatsApp data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Socket.IO subscription
  useEffect(() => {
    if (!WHATSAPP_ENABLED) return undefined;
    let socket = null;
    try {
      // eslint-disable-next-line global-require
      const io = require('socket.io-client');
      const _isLocal = typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);
      const API_URL = _isLocal ? (process.env.REACT_APP_API_URL || 'http://localhost:4000') : 'https://api.anabellaluna.com.ar';
      const token = localStorage.getItem('authToken');
      socket = io(API_URL, { auth: { token }, transports: ['websocket'] });
      socketRef.current = socket;

      socket.on('whatsapp:message', ({ message: newMsg } = {}) => {
        if (!newMsg) return;
        setSelectedConversation((prev) => {
          if (prev && String(prev._id) === String(newMsg.conversationId)) {
            setMessages((msgs) => {
              if (msgs.some((m) => m._id === newMsg._id || (m.waMessageId && m.waMessageId === newMsg.waMessageId))) return msgs;
              return [...msgs, newMsg];
            });
          }
          return prev;
        });
        setConversations((convs) =>
          convs.map((c) =>
            String(c._id) === String(newMsg.conversationId) && newMsg.direction === 'inbound'
              ? { ...c, unreadCount: (c.unreadCount || 0) + 1, lastMessage: { content: newMsg.content?.text || newMsg.content?.caption || `[${newMsg.type}]`, type: newMsg.type, direction: newMsg.direction, timestamp: newMsg.createdAt } }
              : c
          )
        );
      });

      socket.on('whatsapp:status', ({ messageId, status }) => {
        setMessages((msgs) =>
          msgs.map((m) => (m._id === messageId || m.waMessageId === messageId ? { ...m, status } : m))
        );
      });

      socket.on('whatsapp:conversation_new', (conv) => {
        setConversations((prev) => [conv, ...prev.filter((c) => c._id !== conv._id)]);
      });
    } catch (err) {
      // Socket not available
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Load messages when conversation is selected
  useEffect(() => {
    if (!selectedConversation) {
      setMessages([]);
      return;
    }
    const load = async () => {
      setLoading(true);
      try {
        const data = await whatsappService.getMessages(selectedConversation._id, 1, 50);
        const msgs = Array.isArray(data) ? data : data?.messages || [];
        setMessages(msgs);
        whatsappService.markAsRead(selectedConversation._id).catch(() => {});
        setConversations((convs) =>
          convs.map((c) => (c._id === selectedConversation._id ? { ...c, unreadCount: 0 } : c))
        );
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedConversation]);

  const handleSendMessage = async (payload) => {
    if (!selectedConversation) return;
    try {
      const apiPayload = {
        type: payload.type || 'text',
        text: payload.content?.text,
        mediaUrl: payload.content?.mediaUrl,
        caption: payload.content?.caption,
        filename: payload.content?.filename,
      };
      const sent = await whatsappService.sendMessage(selectedConversation._id, apiPayload);
      const optimistic = {
        _id: sent?._id || `tmp-${Date.now()}`,
        conversationId: selectedConversation._id,
        direction: 'outbound',
        type: payload.type || 'text',
        content: payload.content,
        status: 'pending',
        createdAt: new Date().toISOString(),
        ...sent,
      };
      setMessages((msgs) => [...msgs, optimistic]);
      setConversations((convs) =>
        convs.map((c) =>
          c._id === selectedConversation._id
            ? { ...c, lastMessage: { content: payload.content, type: payload.type, direction: 'outbound', timestamp: new Date().toISOString() } }
            : c
        )
      );
    } catch (err) {
      toast.error('Error al enviar el mensaje');
      throw err;
    }
  };

  const handleDeleteConversation = async (convId) => {
    if (!window.confirm('¿Eliminar esta conversación y todos sus mensajes? Esta acción no se puede deshacer.')) return;
    try {
      await whatsappService.deleteConversation(convId);
      setConversations((prev) => prev.filter((c) => c._id !== convId));
      if (selectedConversation && selectedConversation._id === convId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      toast.success('Conversación eliminada');
    } catch (err) {
      toast.error(`Error al eliminar: ${err.message}`);
    }
  };

  const handleLinkCliente = () => {
    toast.info('Funcionalidad de vinculación CRM próximamente');
  };

  const whatsappUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const channelBadges = { whatsapp: whatsappUnread, agentes: agentesUnread, web: webUnread };

  return (
    <div className={`flex ${isDark ? 'bg-main-dark-bg' : 'bg-gray-50'}`} style={{ height: 'calc(100vh - 64px)' }}>
      {/* Selector de canal */}
      <div className="flex flex-col items-center gap-2 py-3 px-2 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        {CHANNELS.map((c) => {
          const active = channel === c.key;
          const badge = channelBadges[c.key] || 0;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setChannel(c.key)}
              title={c.label}
              className={`relative w-14 py-2 rounded-xl flex flex-col items-center gap-1 transition-colors ${
                active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              style={active ? { color: currentColor } : { color: '#6b7280' }}
            >
              {badge > 0 && (
                <span className="absolute top-0.5 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
              {c.icon}
              <span className="text-[10px] font-semibold leading-none">{c.label}</span>
            </button>
          );
        })}
      </div>

      {channel === 'whatsapp' && (
        <>
          <WhatsAppSidebar
            conversations={conversations}
            selectedId={selectedConversation?._id}
            onSelect={setSelectedConversation}
            onDelete={handleDeleteConversation}
          />
          <WhatsAppChat
            conversation={selectedConversation}
            messages={messages}
            onSendMessage={handleSendMessage}
            onDeleteConversation={handleDeleteConversation}
            loading={loading}
            templates={templates}
          />
          <WhatsAppContactInfo
            conversation={selectedConversation}
            contact={selectedConversation?.contact}
            onLinkCliente={handleLinkCliente}
          />
        </>
      )}

      {/* Los paneles quedan montados para mantener los contadores al día */}
      <div className={`flex-1 min-w-0 ${channel === 'agentes' ? 'flex' : 'hidden'}`}>
        <ChatAgentesPanel onUnreadChange={setAgentesUnread} />
      </div>
      <div className={`flex-1 min-w-0 ${channel === 'web' ? 'flex' : 'hidden'}`}>
        <ConsultasWebPanel onUnreadChange={setWebUnread} />
      </div>
    </div>
  );
};

export default Mensajeria;
