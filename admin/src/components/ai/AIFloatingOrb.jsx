import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import AIMessageBubble from './AIMessageBubble';
import { useStateContext } from '../../contexts/ContextProvider';
import aiGatewayService from '../../services/aiGatewayService';
import { useAIGatewayChat } from '../../hooks/useAIGatewayChat';
import orbSvg from '../../assets/ai_orb.svg';

// ── Orb button ────────────────────────────────────────────────────────────────

const OrbButton = ({ onClick, isOpen, pulse }) => (
  <button
    onClick={onClick}
    title="Asistente AI Cognitivo"
    style={{
      position:        'fixed',
      bottom:          24,
      right:           24,
      width:           64,
      height:          64,
      borderRadius:    '50%',
      border:          'none',
      padding:         0,
      cursor:          'pointer',
      background:      'transparent',
      zIndex:          9999,
      boxShadow:       isOpen
        ? '0 0 0 3px #9b6dff, 0 8px 32px rgba(107,61,232,0.55)'
        : '0 4px 24px rgba(107,61,232,0.45)',
      transition:      'box-shadow 0.3s, transform 0.2s',
      transform:       isOpen ? 'scale(1.08)' : 'scale(1)',
      outline:         'none',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = isOpen ? 'scale(1.08)' : 'scale(1)'; }}
  >
    <img
      src={orbSvg}
      alt="AI"
      style={{ width: 64, height: 64, display: 'block', borderRadius: '50%' }}
      draggable={false}
    />
    {pulse && !isOpen && (
      <span style={{
        position:     'absolute',
        top:          2,
        right:        2,
        width:        12,
        height:       12,
        borderRadius: '50%',
        background:   '#22c55e',
        border:       '2px solid #fff',
        animation:    'orbPulse 2s infinite',
      }} />
    )}
  </button>
);

// ── Agent badge ──────────────────────────────────────────────────────────────

const AgentBadge = ({ name, isDark }) => {
  if (!name) return null;
  const label = name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 10,
      fontSize: 10,
      fontWeight: 600,
      background: isDark ? 'rgba(155,109,255,0.15)' : 'rgba(107,61,232,0.08)',
      color: isDark ? '#c084fc' : '#7c3aed',
      marginBottom: 4,
    }}>
      {label}
    </span>
  );
};

// ── Floating chat panel ───────────────────────────────────────────────────────

const FloatingChat = ({ onClose, isDark }) => {
  const { messages, loading, error, lastAgent, sendMessage, clearMessages } = useAIGatewayChat();

  const [input, setInput] = useState('');
  const [viewportReady, setViewportReady] = useState(true);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);
  const nearBottomRef = useRef(true);

  useLayoutEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    if (nearBottomRef.current || loading) {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length, loading]);

  useLayoutEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 110)}px`;
  }, [input]);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleMessagesScroll = () => {
    const el = messagesRef.current;
    if (!el) return;
    nearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 96;
  };

  const handleSend = useCallback(async (e) => {
    e && e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput('');
    nearBottomRef.current = true;
    await sendMessage(text);
    inputRef.current?.focus();
  }, [input, loading, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const bg = isDark ? '#0f172a' : '#fff';
  const border = isDark ? 'rgba(155,109,255,0.25)' : 'rgba(107,61,232,0.18)';
  const inputBg = isDark ? '#1e293b' : '#f8fafc';
  const textCol = isDark ? '#e2e8f0' : '#1e293b';

  return (
    <div style={{
      position:      'fixed',
      bottom:        100,
      right:         24,
      width:         400,
      maxWidth:      'calc(100vw - 32px)',
      height:        560,
      maxHeight:     'calc(100vh - 120px)',
      zIndex:        9998,
      display:       'flex',
      flexDirection: 'column',
      borderRadius:  18,
      overflow:      'hidden',
      background:    bg,
      border:        `1px solid ${border}`,
      boxShadow:     '0 24px 64px rgba(107,61,232,0.22), 0 4px 16px rgba(0,0,0,0.18)',
      animation:     'orbSlideIn 0.22s cubic-bezier(.34,1.56,.64,1)',
    }}>

      {/* Header */}
      <div style={{
        padding:        '14px 18px',
        background:     isDark
          ? 'linear-gradient(135deg, #1e1040 0%, #2d1b6e 100%)'
          : 'linear-gradient(135deg, #6b3de8 0%, #9b6dff 100%)',
        display:        'flex',
        alignItems:     'center',
        gap:            12,
        flexShrink:     0,
      }}>
        <img src={orbSvg} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
            Asistente Cognitivo
          </div>
          <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11, marginTop: 1 }}>
            {loading ? 'Analizando...' : lastAgent ? lastAgent.replace(/_/g, ' ') : 'Multi-agente'}
          </div>
        </div>
        <button
          onClick={clearMessages}
          title="Nueva conversación"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: 6,
            width: 28,
            height: 28,
            cursor: 'pointer',
            color: '#fff',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginRight: 4,
          }}
        >⟳</button>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: 'none',
            borderRadius: '50%',
            width: 28,
            height: 28,
            cursor: 'pointer',
            color: '#fff',
            fontSize: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >×</button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
      ref={messagesRef}
      onScroll={handleMessagesScroll}
      >
        {messages.length === 0 && !loading && (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: isDark ? '#475569' : '#94a3b8',
            textAlign: 'center',
            padding: '24px 16px',
            gap: 10,
          }}>
            <img src={orbSvg} alt="" style={{ width: 52, height: 52, opacity: 0.8 }} />
            <div style={{ fontWeight: 600, fontSize: 14, color: isDark ? '#94a3b8' : '#64748b' }}>
              Plataforma Cognitiva
            </div>
            <div style={{ fontSize: 12, lineHeight: 1.5, maxWidth: 280 }}>
              5 agentes especializados analizan tu negocio en tiempo real.
              Preguntá sobre leads, propiedades, métricas o tareas pendientes.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 }}>
              {[
                '¿Qué leads están calientes?',
                'Resumen operativo del día',
                'Propiedades estancadas',
                '¿Cómo está la conversión?',
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); setTimeout(() => inputRef.current?.focus(), 50); }}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 20,
                    border: `1px solid ${isDark ? 'rgba(155,109,255,0.3)' : 'rgba(107,61,232,0.2)'}`,
                    background: isDark ? 'rgba(155,109,255,0.08)' : 'rgba(107,61,232,0.05)',
                    color: isDark ? '#c084fc' : '#6b3de8',
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >{s}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg._id}>
            {msg.role === 'assistant' && msg.agent && (
              <AgentBadge name={msg.agent} isDark={isDark} />
            )}
            <AIMessageBubble
              message={msg}
              currentMode={isDark ? 'Dark' : 'Light'}
            />
            {msg.role === 'assistant' && msg.insights && msg.insights.length > 0 && (
              <div style={{
                marginBottom: 8,
                padding: '6px 10px',
                borderRadius: 10,
                background: isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.06)',
                border: `1px solid ${isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.15)'}`,
                fontSize: 11,
                color: isDark ? '#93c5fd' : '#2563eb',
              }}>
                <strong>Insights:</strong>{' '}
                {msg.insights.map((ins, i) => (
                  <span key={i}>{ins.title || ins.message || JSON.stringify(ins)}{i < msg.insights.length - 1 ? ' · ' : ''}</span>
                ))}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px' }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#9b6dff',
                animation: 'orbBounce 1.2s infinite',
                animationDelay: `${i * 0.18}s`,
                display: 'inline-block',
              }} />
            ))}
          </div>
        )}

        {error && (
          <div style={{
            padding: '8px 12px', borderRadius: 8,
            background: isDark ? '#2d1a1a' : '#fef2f2',
            border: '1px solid #fca5a5',
            color: isDark ? '#fca5a5' : '#dc2626',
            fontSize: 12, alignSelf: 'flex-start', maxWidth: '85%',
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '10px 12px',
        borderTop: `1px solid ${border}`,
        background: inputBg,
        display: 'flex',
        gap: 8,
        alignItems: 'flex-end',
        flexShrink: 0,
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Preguntá al asistente cognitivo..."
          disabled={loading}
          rows={1}
          style={{
            flex: 1,
            background: isDark ? '#0f172a' : '#fff',
            border: `1px solid ${isDark ? 'rgba(155,109,255,0.2)' : '#e2e8f0'}`,
            borderRadius: 18,
            padding: '9px 12px',
            fontSize: 13,
            color: textCol,
            resize: 'none',
            minHeight: 38,
            maxHeight: 100,
            outline: 'none',
            lineHeight: 1.5,
            fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            border: 'none',
            background: loading || !input.trim()
              ? (isDark ? '#334155' : '#e2e8f0')
              : 'linear-gradient(135deg, #6b3de8, #9b6dff)',
            color: loading || !input.trim()
              ? (isDark ? '#64748b' : '#94a3b8')
              : '#fff',
            cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          {loading ? '...' : '↑'}
        </button>
      </div>
    </div>
  );
};

// ── Main export ───────────────────────────────────────────────────────────────

const AIFloatingOrb = () => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === 'Dark';

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((v) => !v);
  };

  return (
    <>
      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.4; }
        }
        @keyframes orbSlideIn {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes orbBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>

      <OrbButton onClick={handleToggle} isOpen={isOpen} pulse={true} />

      {isOpen && (
        <FloatingChat
          onClose={() => setIsOpen(false)}
          isDark={isDark}
        />
      )}
    </>
  );
};

export default AIFloatingOrb;
