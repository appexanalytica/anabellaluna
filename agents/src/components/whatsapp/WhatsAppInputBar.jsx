import React, { useState, useRef, useCallback } from 'react';
import { FiSend, FiSmile, FiLayout } from 'react-icons/fi';
import WhatsAppTemplateSelector from './WhatsAppTemplateSelector';

const EMOJI_LIST = ['😀','😂','😊','😍','😎','👍','🙏','❤️','🎉','✅','📱','💬','🏠','🔑','📋','💰','🤝','📞','📅','⭐'];

const WhatsAppInputBar = ({ onSend, windowOpen = true, templates = [] }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [sending, setSending] = useState(false);
  const textareaRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = 'auto';
    const maxH = 5 * 24; // 5 lines * ~24px each
    ta.style.height = Math.min(ta.scrollHeight, maxH) + 'px';
  };

  const handleSend = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      await onSend({ type: 'text', content: { text: trimmed } });
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  }, [text, onSend, sending]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji) => {
    setText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleTemplateSelect = async (templatePayload) => {
    setShowTemplateSelector(false);
    setSending(true);
    try {
      await onSend({
        type: 'template',
        content: {
          templateName: templatePayload.templateName,
          templateLanguage: templatePayload.templateLanguage,
          templateComponents: templatePayload.templateComponents,
        },
      });
    } catch (err) {
      console.error('Error sending template:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {showTemplateSelector && (
        <WhatsAppTemplateSelector
          templates={templates}
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      <div
        className="flex-shrink-0 relative"
        style={{ backgroundColor: '#f0f2f5', borderTop: '1px solid #e9edef' }}
      >
        {/* Emoji picker */}
        {showEmojiPicker && windowOpen && (
          <div
            className="absolute bottom-full left-0 mb-1 p-3 bg-white rounded-xl shadow-lg z-10"
            style={{ border: '1px solid #e9edef' }}
          >
            <div className="grid grid-cols-10 gap-1">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiSelect(emoji)}
                  className="text-xl hover:scale-125 transition-transform p-0.5"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {windowOpen ? (
          /* Open window — full composer */
          <div className="flex items-end gap-2 px-3 py-2">
            {/* Emoji button */}
            <button
              onClick={() => setShowEmojiPicker((v) => !v)}
              className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors mb-0.5"
              title="Emojis"
            >
              <FiSmile size={20} className="text-gray-500" />
            </button>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleTextChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribí un mensaje"
              rows={1}
              className="flex-1 resize-none rounded-lg px-4 py-2.5 text-sm focus:outline-none"
              style={{
                border: '1px solid #e9edef',
                backgroundColor: '#fff',
                fontSize: '14px',
                lineHeight: '24px',
                minHeight: '42px',
                maxHeight: '120px',
                overflowY: 'auto',
                color: '#303030',
              }}
            />

            {/* Template button */}
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="flex-shrink-0 p-2 rounded-full hover:bg-gray-200 transition-colors mb-0.5"
              title="Enviar template"
            >
              <FiLayout size={20} className="text-gray-500" />
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors mb-0.5 disabled:opacity-40"
              style={{
                backgroundColor: text.trim() && !sending ? '#25d366' : '#b0bec5',
                cursor: text.trim() && !sending ? 'pointer' : 'not-allowed',
              }}
              title="Enviar"
            >
              <FiSend size={18} className="text-white" style={{ marginLeft: '2px' }} />
            </button>
          </div>
        ) : (
          /* Closed window — only template */
          <div className="flex items-center gap-3 px-4 py-3">
            <div
              className="flex-1 px-4 py-2.5 rounded-lg text-sm text-gray-400 cursor-not-allowed"
              style={{ backgroundColor: '#e9edef', border: '1px solid #d1d7db', fontSize: '14px' }}
            >
              La ventana de respuesta ha expirado
            </div>
            <button
              onClick={() => setShowTemplateSelector(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium transition-colors flex-shrink-0"
              style={{ backgroundColor: '#25d366' }}
            >
              <FiLayout size={16} />
              Enviar template
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WhatsAppInputBar;
