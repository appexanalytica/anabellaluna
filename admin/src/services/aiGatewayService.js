/**
 * AI Gateway Service — HTTP client for the cognitive AI Gateway.
 *
 * Communicates with the AI Gateway (Python/FastAPI) through the backend proxy
 * at /ai-gateway/*. Provides chat, agent management, suggestions, and metrics.
 */

import API_CONFIG, { api, apiRequest, getAuthHeaders } from '../config/api';

const BASE = '/ai-gateway';

export const aiGatewayService = {
  // ── Chat ─────────────────────────────────────────────────────────────────────

  /**
   * Send a message to the AI Gateway (standard JSON response).
   * @param {string} message - The user's message
   * @param {object} options - { target_agent }
   * @returns {Promise<{ agent, response, insights, metrics }>}
   */
  chat: (message, options = {}) =>
    api.post(`${BASE}/chat`, {
      message,
      target_agent: options.target_agent || null,
    }),

  /**
   * Send a message with SSE streaming.
   * Returns an async generator that yields events.
   * @param {string} message
   * @param {object} options - { target_agent, onMessage, onError, onDone }
   */
  chatStream: async (message, { target_agent, onMessage, onError, onDone } = {}) => {
    const url = `${(typeof API_CONFIG !== 'undefined' ? API_CONFIG.baseURL : '')
      || 'http://localhost:4000'}${BASE}/chat`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          message,
          target_agent: target_agent || null,
          stream: true,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        if (onError) onError(errText);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        let eventType = '';
        for (const line of lines) {
          if (line.startsWith('event: ')) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            try {
              const data = JSON.parse(dataStr);
              if (eventType === 'message' && onMessage) onMessage(data);
              if (eventType === 'error' && onError) onError(data.error || 'Unknown error');
              if (eventType === 'done' && onDone) onDone();
            } catch {
              // ignore non-JSON data lines
            }
          }
        }
      }

      if (onDone) onDone();
    } catch (err) {
      if (onError) onError(err.message);
    }
  },

  // ── Health ───────────────────────────────────────────────────────────────────

  getHealth: () => api.get(`${BASE}/health`),

  // ── Agents ───────────────────────────────────────────────────────────────────

  getAgents: () => api.get(`${BASE}/agents`),

  runAgent: (agentName) => api.post(`${BASE}/agents/${agentName}/run`),

  // ── Suggestions ──────────────────────────────────────────────────────────────

  getSuggestions: ({ unreadOnly = true, limit = 50 } = {}) =>
    api.get(`${BASE}/suggestions?unread_only=${unreadOnly}&limit=${limit}`),

  // ── Metrics ──────────────────────────────────────────────────────────────────

  getMetrics: () => api.get(`${BASE}/metrics`),

  // ── Workflows ────────────────────────────────────────────────────────────────

  getWorkflows: () => api.get(`${BASE}/workflows`),

  runWorkflow: (workflowName) => api.post(`${BASE}/workflows/${workflowName}/run`),
};

export default aiGatewayService;
