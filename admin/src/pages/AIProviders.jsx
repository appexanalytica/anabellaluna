import React, { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import aiService from '../services/aiService';
import { toast } from 'react-toastify';
import CotizacionCard from '../components/CotizacionCard';

const AIProviders = () => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === 'Dark';

  const [config,   setConfig]   = useState(null);
  const [form,     setForm]     = useState({});
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [metaForm, setMetaForm] = useState({ accessToken: '', adAccountId: '', appId: '' });
  const [metaInfo, setMetaInfo] = useState(null);
  const [usage,    setUsage]    = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      aiService.getProviders(),
      aiService.getMetaAdsConfig(),
      aiService.getUsageStats(30),
    ]).then(([cfg, meta, usageData]) => {
      setConfig(cfg);
      setForm({
        model:     cfg.openai?.model     || 'gpt-4o-mini',
        maxTokens: cfg.openai?.maxTokens || 4096,
        apiKey:    '',
      });
      setMetaInfo(meta);
      setUsage(usageData);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        defaultProvider: 'openai',
        openai: {
          enabled:   true,
          model:     form.model,
          maxTokens: form.maxTokens,
          ...(form.apiKey ? { apiKey: form.apiKey } : {}),
        },
      };
      await aiService.updateProviders(payload);
      toast.success('Configuración OpenAI guardada');
      const fresh = await aiService.getProviders();
      setConfig(fresh);
      setForm((f) => ({ ...f, apiKey: '' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMeta = async () => {
    setSaving(true);
    try {
      await aiService.updateMetaAdsConfig(metaForm);
      toast.success('Credenciales Meta Ads guardadas');
      const updated = await aiService.getMetaAdsConfig();
      setMetaInfo(updated);
      setMetaForm({ accessToken: '', adAccountId: '', appId: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const pStyle = {
    padding:    '24px 28px',
    background: isDark ? '#0f172a' : '#f8fafc',
    minHeight:  '100vh',
    color:      isDark ? '#e2e8f0' : '#1e293b',
  };

  const cardStyle = {
    background:   isDark ? '#1e293b' : '#fff',
    border:       isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
    borderRadius: 12,
    padding:      '20px 24px',
    marginBottom: 20,
  };

  const labelStyle = {
    display:      'block',
    fontSize:     12,
    fontWeight:   700,
    color:        isDark ? '#94a3b8' : '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
  };

  const inputStyle = {
    width:        '100%',
    padding:      '8px 12px',
    borderRadius: 8,
    border:       `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
    background:   isDark ? '#0f172a' : '#f8fafc',
    color:        isDark ? '#e2e8f0' : '#1e293b',
    fontSize:     13,
    boxSizing:    'border-box',
    marginBottom: 12,
  };


  if (loading) {
    return <div style={{ ...pStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando configuración...</div>;
  }

  return (
    <div style={pStyle}>
      <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: isDark ? '#f1f5f9' : '#0f172a' }}>
        Configuración AI
      </div>
      <div style={{ fontSize: 13, color: isDark ? '#64748b' : '#94a3b8', marginBottom: 28 }}>
        OpenAI es el proveedor de IA del sistema. Ingresá tu API key para activar el Copilot,
        las sugerencias y el motor de recomendaciones.
      </div>

      {/* OpenAI */}
      <div style={{ ...cardStyle, borderLeft: '3px solid #10a37f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>OpenAI</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: isDark ? 'rgba(16,163,127,0.15)' : '#ecfdf5', color: '#10a37f' }}>CLOUD API</span>
          {config?.openai?.keySource === 'env' && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: isDark ? 'rgba(234,179,8,0.1)' : '#fefce8', border: '1px solid #ca8a04', color: '#ca8a04' }}>
              ⚠ Key desde .env
            </span>
          )}
          {config?.openai?.keySource === 'db' && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: isDark ? 'rgba(34,197,94,0.1)' : '#f0fdf4', border: '1px solid #16a34a', color: '#16a34a' }}>
              ✓ Key configurada
            </span>
          )}
        </div>
        <div style={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8', marginBottom: 16 }}>
          La key se genera en{' '}
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noreferrer" style={{ color: '#10a37f' }}>platform.openai.com</a>.
          Modelo recomendado: <code style={{ background: isDark ? '#0f172a' : '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>gpt-4o-mini</code>
        </div>

        <label style={labelStyle}>API Key</label>
        <input
          type="password"
          style={inputStyle}
          placeholder={config?.openai?.hasKey ? '•••••••••••••••• (ya configurada)' : 'sk-...'}
          value={form.apiKey || ''}
          onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
        />

        <label style={labelStyle}>Modelo</label>
        <input
          type="text"
          style={inputStyle}
          placeholder="gpt-4o-mini"
          value={form.model || ''}
          onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
        />

        <label style={labelStyle}>Max Tokens</label>
        <input
          type="number"
          style={inputStyle}
          value={form.maxTokens || 4096}
          onChange={(e) => setForm((f) => ({ ...f, maxTokens: parseInt(e.target.value, 10) }))}
          min={256}
          max={32768}
        />

        <div style={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8', marginBottom: 4 }}>
          Modelo de embeddings (matching semántico):{' '}
          <code style={{ background: isDark ? '#0f172a' : '#f1f5f9', padding: '1px 5px', borderRadius: 4 }}>
            {config?.openai?.embeddingModel || 'text-embedding-3-small'}
          </code>
        </div>

        {config?.openai?.stats && (
          <div style={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8', marginTop: 4, padding: '8px 0' }}>
            Estado: <span style={{ fontWeight: 700, color: config.openai.stats.healthStatus === 'healthy' ? '#22c55e' : '#ef4444' }}>
              {config.openai.stats.healthStatus}
            </span>
            {' '}· Requests: <b>{config.openai.stats.totalRequests || 0}</b>
            {' '}· Errores: <b>{config.openai.stats.totalErrors || 0}</b>
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{ padding: '10px 28px', borderRadius: 9, border: 'none', background: '#10a37f', color: '#fff', fontWeight: 700, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, marginBottom: 28 }}
      >
        {saving ? 'Guardando...' : 'Guardar configuración OpenAI'}
      </button>

      {/* Motor de recomendaciones */}
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase', color: isDark ? '#64748b' : '#94a3b8', marginBottom: 12 }}>
        Motor de recomendaciones
      </div>
      <CotizacionCard isDark={isDark} />

      {/* Meta Ads */}
      <div style={cardStyle}>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>📘 Meta Ads</div>
        <div style={{ fontSize: 13, color: isDark ? '#64748b' : '#94a3b8', marginBottom: 16 }}>
          {metaInfo?.configured ? '✅ Credenciales configuradas. Ad Account: ' + metaInfo.adAccountId : '❌ No configurado'}
        </div>
        <label style={labelStyle}>Access Token</label>
        <input type="password" style={inputStyle} placeholder="EAAxxxxxxxx..." value={metaForm.accessToken} onChange={(e) => setMetaForm((f) => ({ ...f, accessToken: e.target.value }))} />
        <label style={labelStyle}>Ad Account ID</label>
        <input type="text" style={inputStyle} placeholder="act_123456789" value={metaForm.adAccountId} onChange={(e) => setMetaForm((f) => ({ ...f, adAccountId: e.target.value }))} />
        <label style={labelStyle}>App ID (opcional)</label>
        <input type="text" style={inputStyle} placeholder="123456789" value={metaForm.appId} onChange={(e) => setMetaForm((f) => ({ ...f, appId: e.target.value }))} />
        <button
          onClick={handleSaveMeta}
          disabled={saving || !metaForm.accessToken || !metaForm.adAccountId}
          style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#1877F2', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
        >
          Guardar Meta Ads
        </button>
      </div>

      {/* Usage Stats */}
      {usage && usage.providers && usage.providers.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>📊 Uso (últimos 30 días)</div>
          {usage.providers.map((p) => (
            <div key={p._id} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9' }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>{p._id}</div>
              <div style={{ display: 'flex', gap: 20, fontSize: 13, color: isDark ? '#94a3b8' : '#64748b' }}>
                <span>Requests: <b>{p.totalRequests}</b></span>
                <span>Tokens: <b>{p.totalTokens?.toLocaleString('es-AR')}</b></span>
                <span>Costo: <b>${(p.totalCost || 0).toFixed(4)} USD</b></span>
                <span>Errores: <b>{p.failureCount || 0}</b></span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIProviders;
