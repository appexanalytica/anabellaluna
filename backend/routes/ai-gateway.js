/**
 * AI Gateway Proxy — Routes that proxy requests to the AI Gateway (FastAPI).
 *
 * The AI Gateway runs as a separate Python service on port 8100 and provides
 * cognitive capabilities: multi-agent orchestration, semantic memory,
 * autonomous workflows, and AI-powered insights.
 *
 * This proxy:
 *   - Authenticates the user via JWT
 *   - Forwards the request to the AI Gateway with user context
 *   - Supports SSE streaming for chat responses
 *
 * Endpoints:
 *   POST /ai-gateway/chat          — Chat with AI agents (supports SSE)
 *   GET  /ai-gateway/health        — AI Gateway health check
 *   GET  /ai-gateway/agents        — List registered AI agents
 *   POST /ai-gateway/agents/:name/run — Run an agent manually
 *   GET  /ai-gateway/suggestions   — Get pending AI suggestions
 *   GET  /ai-gateway/metrics       — AI Gateway metrics
 *   GET  /ai-gateway/workflows     — List registered workflows
 *   POST /ai-gateway/workflows/:name/run — Run a workflow manually
 */

const express = require('express');
const { authenticateToken, requireRole } = require('../auth');
const { authenticateTokenOrService } = require('../middlewares/serviceAuth');

const router = express.Router();

const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'http://localhost:8100';

// ── Helper: proxy a request to the AI Gateway ──────────────────────────────

async function proxyToGateway(path, options = {}) {
  const url = `${AI_GATEWAY_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    const error = new Error(`AI Gateway ${res.status}: ${body}`);
    error.statusCode = res.status;
    throw error;
  }

  return res.json();
}

// ── POST /chat — Main chat endpoint with optional SSE streaming ────────────

router.post('/chat', authenticateToken, async (req, res) => {
  const { message, target_agent, stream } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'message is required' });
  }

  const userId = String(req.user.sub || req.user.id || '');
  const agenteId = String(req.user.agenteId || '');

  const payload = {
    message: message.trim(),
    user_id: userId,
    agent_id: agenteId,
    target_agent: target_agent || null,
  };

  // ── SSE streaming mode ────────────────────────────────────────────────
  if (stream) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
      const gatewayRes = await fetch(`${AI_GATEWAY_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!gatewayRes.ok) {
        const errBody = await gatewayRes.text();
        res.write(`event: error\ndata: ${JSON.stringify({ error: errBody })}\n\n`);
        return res.end();
      }

      // The AI Gateway currently returns a full JSON response (not streaming).
      // We wrap it as SSE events so the frontend gets a consistent interface.
      // When the AI Gateway adds true streaming, this proxy will pass through
      // the stream directly.
      const data = await gatewayRes.json();

      // Send the response as an SSE message
      res.write(`event: message\ndata: ${JSON.stringify({
        agent: data.agent,
        content: data.response,
        insights: data.insights || [],
        metrics: data.metrics || {},
      })}\n\n`);

      res.write('event: done\ndata: {}\n\n');
      return res.end();
    } catch (err) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
      return res.end();
    }
  }

  // ── Standard JSON response ────────────────────────────────────────────
  try {
    const data = await proxyToGateway('/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    res.json({
      agent: data.agent,
      response: data.response,
      insights: data.insights || [],
      metrics: data.metrics || {},
    });
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message });
  }
});

// ── GET /health — AI Gateway health ─────────────────────────────────────────

router.get('/health', async (req, res) => {
  try {
    const data = await proxyToGateway('/health');
    res.json(data);
  } catch (err) {
    res.status(502).json({
      status: 'unreachable',
      error: err.message,
    });
  }
});

// ── GET /agents — List AI agents ────────────────────────────────────────────

router.get('/agents', authenticateToken, async (req, res) => {
  try {
    const data = await proxyToGateway('/agents');
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message });
  }
});

// ── POST /agents/:name/run — Run an agent manually (admin only) ─────────────

router.post('/agents/:name/run', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const data = await proxyToGateway(`/agents/${encodeURIComponent(req.params.name)}/run`, {
      method: 'POST',
    });
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message });
  }
});

// ── GET /suggestions — Pending AI suggestions ──────────────────────────────

router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const unreadOnly = req.query.unread_only !== 'false';
    const limit = parseInt(req.query.limit) || 50;
    const data = await proxyToGateway(`/suggestions?unread_only=${unreadOnly}&limit=${limit}`);
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message });
  }
});

// ── GET /metrics — AI Gateway metrics (admin only) ──────────────────────────

router.get('/metrics', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const data = await proxyToGateway('/metrics');
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message });
  }
});

// ── GET /workflows — List workflows ─────────────────────────────────────────

router.get('/workflows', authenticateToken, async (req, res) => {
  try {
    // The AI Gateway doesn't have a dedicated /workflows endpoint,
    // but /metrics includes workflow info. We extract it.
    const data = await proxyToGateway('/metrics');
    res.json({
      workflows: data.workflows || {},
    });
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message });
  }
});

// ── POST /workflows/:name/run — Run a workflow manually (admin only) ────────

router.post('/workflows/:name/run', authenticateToken, requireRole('admin'), async (req, res) => {
  try {
    const data = await proxyToGateway(`/workflows/${encodeURIComponent(req.params.name)}/run`, {
      method: 'POST',
    });
    res.json(data);
  } catch (err) {
    res.status(err.statusCode || 502).json({ error: err.message });
  }
});

module.exports = router;
