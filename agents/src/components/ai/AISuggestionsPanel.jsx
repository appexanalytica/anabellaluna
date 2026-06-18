import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../config/api';

const PRIORITY_COLORS = {
  urgente: { bg: '#fef2f2', border: '#fca5a5', text: '#dc2626', darkBg: '#2d1a1a', darkBorder: '#7f1d1d', darkText: '#fca5a5' },
  alta:    { bg: '#fff7ed', border: '#fdba74', text: '#ea580c', darkBg: '#2d1f0e', darkBorder: '#7c2d12', darkText: '#fdba74' },
  media:   { bg: '#eff6ff', border: '#93c5fd', text: '#2563eb', darkBg: '#0f1d2d', darkBorder: '#1e3a5f', darkText: '#93c5fd' },
  baja:    { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', darkBg: '#0f2117', darkBorder: '#14532d', darkText: '#86efac' },
};

const AISuggestionsPanel = ({ isDark, limit = 8 }) => {
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
      await api.patch(`/crm/notifications/${id}`, { feedback, status: feedback });
      await api.put(`/crm/notifications/${id}/read`);
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error('[AISuggestions] Action failed:', err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getAgentLabel = (s) => {
    const agent = s.metadata?.ai_agent || '';
    if (!agent) return 'AI';
    return agent.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const getPriorityStyle = (p) => {
    const c = PRIORITY_COLORS[p] || PRIORITY_COLORS.media;
    return { bg: isDark ? c.darkBg : c.bg, border: isDark ? c.darkBorder : c.border, text: isDark ? c.darkText : c.text };
  };

  if (loading && suggestions.length === 0) {
    return (
      <div style={{ padding: 20, borderRadius: 14, background: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>🧠</span>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>Sugerencias IA</h3>
        </div>
        <div style={{ color: isDark ? '#64748b' : '#94a3b8', fontSize: 12 }}>Cargando...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16, borderRadius: 14, background: isDark ? '#1e293b' : '#fff', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`, boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🧠</span>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b' }}>Sugerencias IA</h3>
          {suggestions.length > 0 && (
            <span style={{ padding: '2px 7px', borderRadius: 10, fontSize: 10, fontWeight: 600, background: isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)', color: isDark ? '#a5b4fc' : '#6366f1' }}>
              {suggestions.length}
            </span>
          )}
        </div>
        <button onClick={fetchSuggestions} style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#64748b' : '#94a3b8', fontSize: 12, padding: '3px 6px' }} title="Actualizar">⟳</button>
      </div>

      {suggestions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '20px 12px', color: isDark ? '#475569' : '#94a3b8' }}>
          <div style={{ fontSize: 24, marginBottom: 6 }}>✨</div>
          <div style={{ fontSize: 12, fontWeight: 500 }}>Sin sugerencias pendientes</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {suggestions.map((s) => {
            const ps = getPriorityStyle(s.prioridad);
            const isActioning = actionLoading === s._id;
            return (
              <div key={s._id} style={{ padding: '10px 12px', borderRadius: 10, background: ps.bg, border: `1px solid ${ps.border}`, opacity: isActioning ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 7, background: isDark ? 'rgba(155,109,255,0.15)' : 'rgba(107,61,232,0.08)', color: isDark ? '#c084fc' : '#7c3aed' }}>
                    {getAgentLabel(s)}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 500, color: ps.text, textTransform: 'uppercase' }}>{s.prioridad}</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 3 }}>{s.titulo}</div>
                <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', lineHeight: 1.4, marginBottom: 6 }}>{s.mensaje}</div>
                <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                  <button onClick={() => handleAction(s._id, 'dismissed')} disabled={isActioning} style={{ padding: '3px 8px', borderRadius: 5, border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, background: 'transparent', color: isDark ? '#94a3b8' : '#64748b', fontSize: 10, cursor: 'pointer', fontWeight: 500 }}>Descartar</button>
                  <button onClick={() => handleAction(s._id, 'approved')} disabled={isActioning} style={{ padding: '3px 8px', borderRadius: 5, border: 'none', background: 'linear-gradient(135deg, #6b3de8, #9b6dff)', color: '#fff', fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>Aprobar</button>
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
