/**
 * AI Gateway Service — HTTP client for the cognitive AI Gateway.
 */

import { api, getAuthHeaders } from '../config/api';
import API_CONFIG from '../config/api';

const BASE = '/ai-gateway';

export const aiGatewayService = {
  chat: (message, options = {}) =>
    api.post(`${BASE}/chat`, {
      message,
      target_agent: options.target_agent || null,
    }),

  chatStream: async (message, { target_agent, onMessage, onError, onDone } = {}) => {
    const url = `${API_CONFIG.baseURL || 'http://localhost:4000'}${BASE}/chat`;
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

      // El stream SSE se corta con el `done` del reader, no por condición previa.
      // eslint-disable-next-line no-constant-condition
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
            try {
              const data = JSON.parse(line.slice(6));
              if (eventType === 'message' && onMessage) onMessage(data);
              if (eventType === 'error' && onError) onError(data.error || 'Unknown error');
              if (eventType === 'done' && onDone) onDone();
            } catch { /* ignore */ }
          }
        }
      }
      if (onDone) onDone();
    } catch (err) {
      if (onError) onError(err.message);
    }
  },

  getHealth: () => api.get(`${BASE}/health`),
  getAgents: () => api.get(`${BASE}/agents`),
  runAgent: (agentName) => api.post(`${BASE}/agents/${agentName}/run`),
  getSuggestions: ({ unreadOnly = true, limit = 50 } = {}) =>
    api.get(`${BASE}/suggestions?unread_only=${unreadOnly}&limit=${limit}`),
  getMetrics: () => api.get(`${BASE}/metrics`),
  getWorkflows: () => api.get(`${BASE}/workflows`),
  runWorkflow: (workflowName) => api.post(`${BASE}/workflows/${workflowName}/run`),
};

export default aiGatewayService;
