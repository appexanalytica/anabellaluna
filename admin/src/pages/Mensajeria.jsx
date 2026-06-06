import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useStateContext } from '../contexts/ContextProvider';
import whatsappService from '../services/whatsappService';
import WhatsAppSidebar from '../components/whatsapp/WhatsAppSidebar';
import WhatsAppChat from '../components/whatsapp/WhatsAppChat';
import WhatsAppContactInfo from '../components/whatsapp/WhatsAppContactInfo';

const Mensajeria = () => {
  const { currentMode } = useStateContext();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  const isDark = currentMode === 'Dark';

  // Load initial data
  useEffect(() => {
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

  return (
    <div className={`flex ${isDark ? 'bg-main-dark-bg' : 'bg-gray-50'}`} style={{ height: 'calc(100vh - 64px)' }}>
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
        loading={loading}
        templates={templates}
      />
      <WhatsAppContactInfo
        conversation={selectedConversation}
        contact={selectedConversation?.contact}
        onLinkCliente={handleLinkCliente}
      />
    </div>
  );
};

export default Mensajeria;
