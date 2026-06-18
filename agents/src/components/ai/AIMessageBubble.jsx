import React from 'react';

function formatTime(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Lightweight inline markdown renderer for assistant messages.
 * Handles: **bold**, *italic*, `code`, ```code blocks```, - lists, numbered lists.
 */
function renderMarkdown(text, isDark) {
  if (!text) return null;

  const lines = text.split('\n');
  const elements = [];
  let inCodeBlock = false;
  let codeLines = [];
  let key = 0;

  const processInline = (line) => {
    const parts = [];
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('`')) {
        parts.push(
          <code key={`c${match.index}`} style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            padding: '1px 5px',
            borderRadius: 4,
            fontSize: '0.9em',
            fontFamily: 'monospace',
          }}>
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('**')) {
        parts.push(<strong key={`b${match.index}`}>{token.slice(2, -2)}</strong>);
      } else if (token.startsWith('*')) {
        parts.push(<em key={`i${match.index}`}>{token.slice(1, -1)}</em>);
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return parts.length > 0 ? parts : [line];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trimStart().startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={key++} style={{
            background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
            padding: '8px 10px',
            borderRadius: 8,
            fontSize: 11,
            fontFamily: 'monospace',
            overflowX: 'auto',
            margin: '4px 0',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.4,
          }}>
            {codeLines.join('\n')}
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      elements.push(<div key={key++} style={{ height: 5 }} />);
      continue;
    }

    if (/^[\s]*[-•]\s/.test(line)) {
      const content = line.replace(/^[\s]*[-•]\s/, '');
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: 5, paddingLeft: 4, margin: '1px 0' }}>
          <span style={{ opacity: 0.5, flexShrink: 0 }}>•</span>
          <span>{processInline(content)}</span>
        </div>
      );
      continue;
    }

    if (/^\s*\d+[.)]\s/.test(line)) {
      const num = line.match(/^\s*(\d+)/)[1];
      const content = line.replace(/^\s*\d+[.)]\s/, '');
      elements.push(
        <div key={key++} style={{ display: 'flex', gap: 5, paddingLeft: 4, margin: '1px 0' }}>
          <span style={{ opacity: 0.6, flexShrink: 0, fontWeight: 600, fontSize: '0.9em' }}>{num}.</span>
          <span>{processInline(content)}</span>
        </div>
      );
      continue;
    }

    elements.push(<div key={key++} style={{ margin: '1px 0' }}>{processInline(line)}</div>);
  }

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre key={key++} style={{
        background: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)',
        padding: '8px 10px',
        borderRadius: 8,
        fontSize: 11,
        fontFamily: 'monospace',
        overflowX: 'auto',
        margin: '4px 0',
        whiteSpace: 'pre-wrap',
      }}>
        {codeLines.join('\n')}
      </pre>
    );
  }

  return elements;
}

const AIMessageBubble = ({ message, isDark, currentMode }) => {
  const isUser = message.role === 'user';
  const dark = isDark !== undefined ? isDark : currentMode === 'Dark';
  const failed = Boolean(message.metadata?.failed);
  const pending = Boolean(message.metadata?.pending);

  if (!message.content && message.role !== 'tool') return null;

  const bubbleBase = {
    maxWidth: '78%',
    padding: '9px 12px',
    borderRadius: 18,
    fontSize: 13,
    lineHeight: 1.5,
    wordBreak: 'break-word',
    boxShadow: dark ? 'none' : '0 1px 2px rgba(15, 23, 42, 0.04)',
  };

  const userBubble = {
    ...bubbleBase,
    background: failed ? '#ef4444' : '#2563eb',
    color: '#fff',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 6,
    opacity: pending ? 0.72 : 1,
  };

  const assistantBubble = {
    ...bubbleBase,
    background: dark ? '#1f2937' : '#fff',
    color: dark ? '#e2e8f0' : '#1e293b',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 6,
    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
  };

  const toolBubble = {
    ...bubbleBase,
    background: dark ? '#17251a' : '#f0fdf4',
    color: dark ? '#86efac' : '#166534',
    alignSelf: 'flex-start',
    border: `1px solid ${dark ? '#166534' : '#bbf7d0'}`,
    fontSize: 12,
  };

  const style = isUser ? userBubble : (message.role === 'tool' ? toolBubble : assistantBubble);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={style}>
        {message.role === 'tool' && (
          <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 3 }}>
            {message.toolCall?.toolName || 'tool'}
          </div>
        )}
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
        ) : (
          <div>{renderMarkdown(message.content, dark)}</div>
        )}
      </div>
      <div style={{ fontSize: 10, color: dark ? '#64748b' : '#94a3b8', marginTop: 2, paddingLeft: isUser ? 0 : 4 }}>
        {formatTime(message.createdAt)}
        {pending && <span style={{ marginLeft: 5 }}>enviando</span>}
        {failed && <span style={{ marginLeft: 5 }}>no enviado</span>}
      </div>
    </div>
  );
};

export default AIMessageBubble;
