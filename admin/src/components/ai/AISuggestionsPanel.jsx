import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../config/api';

const PRIORITY_COLORS = {
  urgente: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', darkBg: '#2d1a1a', darkBorder: '#7f1d1d', darkText: '#fca5a5' },
  alta:    { bg: '#fff7ed', border: '#fdba74', text: '#ea580c', darkBg: '#2d1f0e', darkBorder: '#7c2d12', darkText: '#fdba74' },
  media:   { bg: '#eff6ff', border: '#93c5fd', text: '#2563eb', darkBg: '#0f1d2d', darkBorder: '#1e3a5f', darkText: '#93c5fd' },
  baja:    { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', darkBg: '#0f2117', darkBorder: '#14532d', darkText: '#86efac' },
};

const AISuggestionsPanel = ({ currentMode, limit = 10 }) => {
  const isDark = currentMode === 'Dark';
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get(`/crm/notifications?tipo=ai_suggestion&leida=false&limite=${limit}`);
      setSuggestions(data.items || data || []);
    } catch (err) {
      console.error('[AISuggestions] Failed to load:', err.message);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchSuggestions();
    const interval = setInterval(fetchSuggestions, 60000);
    return () => clearInterval(interval);
  }, [fetchSuggestions]);

  const handleAction = async (id, feedback) => {
    setActionLoading(id);
    try {
      // Save feedback
      await api.patch(`/crm/notifications/${id}`, {
        feedback,
        status: feedback,
      });
      // Mark as read
      await api.put(`/crm/notifications/${id}/read`);
      // Remove from list
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('[AISuggestions] Action failed:', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getAgentLabel = (suggestion) => {
    const agent = suggestion.metadata?.ai_agent || '';
    if (!agent) return 'AI';
    return agent.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getPriorityStyle = (prioridad) => {
    const p = PRIORITY_COLORS[prioridad] || PRIORITY_COLORS.media;
    return {
      bg: isDark ? p.darkBg : p.bg,
      border: isDark ? p.darkBorder : p.border,
      text: isDark ? p.darkText : p.text,
    };
  };

  if (loading && suggestions.length === 0) {
    return (
      <div style={{
        padding: 24,
        borderRadius: 16,
        background: isDark ? '#1e293b' : '#fff',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🧠</span>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>
            Sugerencias IA
          </h3>
        </div>
        <div style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: 13 }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: 20,
      borderRadius: 16,
      background: isDark ? '#1e293b' : '#fff',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
      boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🧠</span>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>
            Sugerencias IA
          </h3>
          {suggestions.length > 0 && (
            <span style={{
              padding: '2px 8px',
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 600,
              background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)',
              color: isDark ? '#a5b4fc' : '#6366f1',
            }}>
              {suggestions.length}
            </span>
          )}
        </div>
        <button
          onClick={fetchSuggestions}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: isDark ? '#64748b' : '#94a3b8',
            fontSize: 13,
            padding: '4px 8px',
            borderRadius: 6,
          }}
          title="Actualizar"
        >
          ⟳
        </button>
      </div>

      {suggestions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '24px 16px',
          color: isDark ? '#475569' : '#94a3b8',
        }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Sin sugerencias pendientes</div>
          <div style={{ fontSize: 11, marginTop: 4 }}>
            Los agentes IA generan sugerencias automáticamente
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {suggestions.map((suggestion) => {
            const ps = getPriorityStyle(suggestion.prioridad);
            const isActioning = actionLoading === suggestion._id;
            const actionable = suggestion.metadata?.actionable;
            const suggestedAction = suggestion.metadata?.suggested_action;

            return (
              <div
                key={suggestion._id}
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: ps.bg,
                  border: `1px solid ${ps.border}`,
                  opacity: isActioning ? 0.6 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Header: agent + priority */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 600,
                    padding: '2px 7px',
                    borderRadius: 8,
                    background: isDark ? 'rgba(155,109,255,0.15)' : 'rgba(107,61,232,0.08)',
                    color: isDark ? '#c084fc' : '#7c3aed',
                  }}>
                    {getAgentLabel(suggestion)}
                  </span>
                  <span style={{
                    fontSize: 10,
                    fontWeight: 500,
                    color: ps.text,
                    textTransform: 'uppercase',
                  }}>
                    {suggestion.prioridad}
                  </span>
                </div>

                {/* Title */}
                <div style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isDark ? '#e2e8f0' : '#1e293b',
                  marginBottom: 4,
                }}>
                  {suggestion.titulo}
                </div>

                {/* Message */}
                <div style={{
                  fontSize: 12,
                  color: isDark ? '#94a3b8' : '#64748b',
                  lineHeight: 1.5,
                  marginBottom: suggestedAction || actionable ? 8 : 0,
                }}>
                  {suggestion.mensaje}
                </div>

                {/* Suggested action */}
                {suggestedAction && (
                  <div style={{
                    fontSize: 11,
                    color: isDark ? '#818cf8' : '#4f46e5',
                    fontWeight: 500,
                    marginBottom: 8,
                    padding: '4px 8px',
                    borderRadius: 6,
                    background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)',
                  }}>
                    Acción sugerida: {suggestedAction}
                  </div>
                )}

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleAction(suggestion._id, 'dismissed')}
                    disabled={isActioning}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                      background: 'transparent',
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontSize: 11,
                      cursor: isActioning ? 'not-allowed' : 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Descartar
                  </button>
                  <button
                    onClick={() => handleAction(suggestion._id, 'rejected')}
                    disabled={isActioning}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: '1px solid #fca5a5',
                      background: isDark ? 'rgba(239,68,68,0.1)' : '#fef2f2',
                      color: isDark ? '#fca5a5' : '#dc2626',
                      fontSize: 11,
                      cursor: isActioning ? 'not-allowed' : 'pointer',
                      fontWeight: 500,
                    }}
                  >
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleAction(suggestion._id, 'approved')}
                    disabled={isActioning}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 6,
                      border: 'none',
                      background: isDark
                        ? 'linear-gradient(135deg, #6b3de8, #9b6dff)'
                        : 'linear-gradient(135deg, #6b3de8, #9b6dff)',
                      color: '#fff',
                      fontSize: 11,
                      cursor: isActioning ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    Aprobar
                  </button>
                </div>

                {/* Timestamp */}
                <div style={{
                  fontSize: 10,
                  color: isDark ? '#475569' : '#cbd5e1',
                  marginTop: 6,
                  textAlign: 'right',
                }}>
                  {suggestion.createdAt
                    ? new Date(suggestion.createdAt).toLocaleString('es-AR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                      })
                    : ''}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AISuggestionsPanel;
