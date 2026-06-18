/**
 * useAIGatewayChat — React hook for chatting with the cognitive AI Gateway.
 *
 * Unlike useAIChat (which uses the MCP-based system with conversations stored
 * in MongoDB), this hook communicates directly with the AI Gateway multi-agent
 * system. Messages are kept in local state only (the AI Gateway is stateless
 * per request — context comes from its own memory layers).
 */

import { useState, useCallback, useRef } from 'react';
import aiGatewayService from '../services/aiGatewayService';

function generateId() {
  return `gw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useAIGatewayChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastAgent, setLastAgent] = useState(null);
  const sendingRef = useRef(false);

  const sendMessage = useCallback(async (text, { targetAgent } = {}) => {
    const cleanText = String(text || '').trim();
    if (!cleanText || sendingRef.current) return null;

    setError(null);
    sendingRef.current = true;
    setLoading(true);

    // Add user message
    const userMsg = {
      _id: generateId(),
      role: 'user',
      content: cleanText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await aiGatewayService.chat(cleanText, {
        target_agent: targetAgent,
      });

      const assistantMsg = {
        _id: generateId(),
        role: 'assistant',
        content: result.response || '',
        agent: result.agent || '',
        insights: result.insights || [],
        metrics: result.metrics || {},
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setLastAgent(result.agent || null);

      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      sendingRef.current = false;
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setLastAgent(null);
  }, []);

  return {
    messages,
    loading,
    error,
    lastAgent,
    sendMessage,
    clearMessages,
  };
}

export default useAIGatewayChat;
