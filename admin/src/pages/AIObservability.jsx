import React, { useState, useEffect, useCallback } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import aiGatewayService from '../services/aiGatewayService';

const StatusDot = ({ ok }) => (
  <span style={{
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: ok ? '#22c55e' : '#ef4444',
    display: 'inline-block',
    marginRight: 8,
  }} />
);

const AIObservability = () => {
  const { currentMode } = useStateContext();
  const isDark = currentMode === 'Dark';

  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [runningAgent, setRunningAgent] = useState(null);
  const [runningWorkflow, setRunningWorkflow] = useState(null);
  const [runResult, setRunResult] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [m, h] = await Promise.all([
        aiGatewayService.getMetrics().catch(() => null),
        aiGatewayService.getHealth().catch(() => null),
      ]);
      setMetrics(m);
      setHealth(h);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleRunAgent = async (name) => {
    setRunningAgent(name);
    setRunResult(null);
    try {
      const result = await aiGatewayService.runAgent(name);
      setRunResult({ type: 'agent', name, ...result });
      loadData();
    } catch (err) {
      setRunResult({ type: 'agent', name, error: err.message });
    } finally {
      setRunningAgent(null);
    }
  };

  const handleRunWorkflow = async (name) => {
    setRunningWorkflow(name);
    setRunResult(null);
    try {
      const result = await aiGatewayService.runWorkflow(name);
      setRunResult({ type: 'workflow', name, ...result });
      loadData();
    } catch (err) {
      setRunResult({ type: 'workflow', name, error: err.message });
    } finally {
      setRunningWorkflow(null);
    }
  };

  const card = {
    padding: 20,
    borderRadius: 14,
    background: isDark ? '#1e293b' : '#fff',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}`,
    boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.06)',
  };

  const heading = {
    fontSize: 15,
    fontWeight: 700,
    color: isDark ? '#e2e8f0' : '#1e293b',
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const subText = {
    fontSize: 12,
    color: isDark ? '#94a3b8' : '#64748b',
  };

  const btnStyle = (disabled) => ({
    padding: '4px 10px',
    borderRadius: 6,
    border: 'none',
    background: disabled ? (isDark ? '#334155' : '#e5e7eb') : 'linear-gradient(135deg, #6b3de8, #9b6dff)',
    color: disabled ? (isDark ? '#64748b' : '#94a3b8') : '#fff',
    fontSize: 11,
    fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
  });

  if (loading && !metrics) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 16 }}>
          Observabilidad IA
        </h1>
        <div style={{ ...card, textAlign: 'center', padding: 40 }}>
          <div style={subText}>Conectando al AI Gateway...</div>
        </div>
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b', marginBottom: 16 }}>
          Observabilidad IA
        </h1>
        <div style={{ ...card, textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>⚠️</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#fca5a5' : '#dc2626', marginBottom: 4 }}>
            AI Gateway no disponible
          </div>
          <div style={subText}>{error}</div>
          <button onClick={loadData} style={{ ...btnStyle(false), marginTop: 12, padding: '6px 16px' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const infra = metrics?.infrastructure || {};
  const agents = metrics?.agents?.list || [];
  const workflows = metrics?.workflows?.list || [];
  const recentRuns = metrics?.workflows?.recent_runs || [];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#e2e8f0' : '#1e293b', margin: 0 }}>
          Observabilidad IA
        </h1>
        <button onClick={loadData} style={{ ...btnStyle(false), padding: '6px 14px' }}>
          Actualizar
        </button>
      </div>

      {/* Infrastructure Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Backend Node.js', ok: infra.backend },
          { label: 'Redis', ok: infra.redis },
          { label: 'PostgreSQL + pgvector', ok: infra.postgres },
          { label: 'AI Gateway', ok: health?.status === 'healthy' || health?.status === 'degraded' },
        ].map((svc) => (
          <div key={svc.label} style={{ ...card, padding: 14, display: 'flex', alignItems: 'center' }}>
            <StatusDot ok={svc.ok} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}>
                {svc.label}
              </div>
              <div style={{ ...subText, fontSize: 11 }}>
                {svc.ok ? 'Conectado' : 'Desconectado'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agents */}
      <div style={{ ...card, marginBottom: 16 }}>
        <h2 style={heading}>
          <span>🤖</span> Agentes IA ({agents.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {agents.map((agent) => (
            <div key={agent.name} style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)',
              border: `1px solid ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.1)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}>
                  {agent.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
                <button
                  onClick={() => handleRunAgent(agent.name)}
                  disabled={runningAgent === agent.name}
                  style={btnStyle(runningAgent === agent.name)}
                >
                  {runningAgent === agent.name ? '...' : 'Ejecutar'}
                </button>
              </div>
              <div style={subText}>{agent.description || 'Sin descripción'}</div>
              <div style={{ ...subText, fontSize: 10, marginTop: 4 }}>
                {agent.triggers?.length > 0 && <span>Triggers: {agent.triggers.join(', ')}</span>}
                {agent.schedule && <span style={{ marginLeft: 8 }}>Schedule: {agent.schedule}</span>}
              </div>
              <div style={{ ...subText, fontSize: 10 }}>
                Modo: {agent.mode || 'suggest'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workflows */}
      <div style={{ ...card, marginBottom: 16 }}>
        <h2 style={heading}>
          <span>⚡</span> Workflows ({workflows.length})
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
          {workflows.map((wf) => (
            <div key={wf.name} style={{
              padding: '10px 14px',
              borderRadius: 10,
              background: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.04)',
              border: `1px solid ${isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)'}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}>
                  {wf.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
                <button
                  onClick={() => handleRunWorkflow(wf.name)}
                  disabled={runningWorkflow === wf.name}
                  style={btnStyle(runningWorkflow === wf.name)}
                >
                  {runningWorkflow === wf.name ? '...' : 'Ejecutar'}
                </button>
              </div>
              <div style={subText}>{wf.description || 'Sin descripción'}</div>
              <div style={{ ...subText, fontSize: 10, marginTop: 4 }}>
                {wf.schedule && <span>Schedule: {wf.schedule}</span>}
                {wf.timeout_seconds && <span style={{ marginLeft: 8 }}>Timeout: {wf.timeout_seconds}s</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Workflow Runs */}
      {recentRuns.length > 0 && (
        <div style={{ ...card, marginBottom: 16 }}>
          <h2 style={heading}>
            <span>📋</span> Ejecuciones recientes
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb'}` }}>
                  {['Workflow', 'Estado', 'Detectados', 'Acciones', 'Error', 'Fecha'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left',
                      padding: '8px 10px',
                      fontWeight: 600,
                      color: isDark ? '#94a3b8' : '#64748b',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6'}` }}>
                    <td style={{ padding: '6px 10px', color: isDark ? '#e2e8f0' : '#1e293b' }}>
                      {(run.workflow_name || '').replace(/_/g, ' ')}
                    </td>
                    <td style={{ padding: '6px 10px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: 6,
                        fontSize: 10,
                        fontWeight: 600,
                        background: run.status === 'completed' ? '#dcfce7' : run.status === 'failed' ? '#fef2f2' : '#fef3c7',
                        color: run.status === 'completed' ? '#16a34a' : run.status === 'failed' ? '#dc2626' : '#d97706',
                      }}>
                        {run.status}
                      </span>
                    </td>
                    <td style={{ padding: '6px 10px', color: isDark ? '#94a3b8' : '#64748b' }}>
                      {run.state_data?.items_detected ?? '-'}
                    </td>
                    <td style={{ padding: '6px 10px', color: isDark ? '#94a3b8' : '#64748b' }}>
                      {run.state_data?.actions_taken ?? '-'}
                    </td>
                    <td style={{ padding: '6px 10px', color: '#ef4444', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {run.error || '-'}
                    </td>
                    <td style={{ padding: '6px 10px', color: isDark ? '#64748b' : '#94a3b8', whiteSpace: 'nowrap' }}>
                      {run.created_at
                        ? new Date(run.created_at).toLocaleString('es-AR', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                          })
                        : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Run Result */}
      {runResult && (
        <div style={{
          ...card,
          padding: 14,
          marginBottom: 16,
          background: runResult.error
            ? (isDark ? '#2d1a1a' : '#fef2f2')
            : (isDark ? '#0f2117' : '#f0fdf4'),
          border: `1px solid ${runResult.error ? '#fca5a5' : '#86efac'}`,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: isDark ? '#e2e8f0' : '#1e293b' }}>
            {runResult.type === 'agent' ? 'Agente' : 'Workflow'}: {runResult.name}
          </div>
          {runResult.error ? (
            <div style={{ fontSize: 12, color: '#ef4444' }}>Error: {runResult.error}</div>
          ) : (
            <div style={{ fontSize: 12, color: isDark ? '#86efac' : '#16a34a' }}>
              {runResult.output || runResult.status || 'Completado'}
              {runResult.insights_count > 0 && ` · ${runResult.insights_count} insights`}
              {runResult.notifications_sent > 0 && ` · ${runResult.notifications_sent} notificaciones`}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIObservability;
