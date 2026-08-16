import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../config/api';

/**
 * Cotización del dólar — la carga el admin a mano.
 *
 * Es lo que le permite al sistema comparar una propiedad publicada en pesos
 * con el presupuesto de un cliente en dólares. Sin este valor, el motor de
 * recomendaciones compara solo dentro de la misma moneda.
 */
const CotizacionCard = ({ isDark }) => {
  const [rate, setRate] = useState(null);
  const [valor, setValor] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const load = useCallback(async () => {
    try {
      const data = await api.get('/crm/cotizacion');
      setRate(data);
      if (data?.valor) setValor(String(data.valor));
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    const num = Number(String(valor).replace(',', '.'));
    if (!Number.isFinite(num) || num <= 0) {
      setMsg({ type: 'error', text: 'Ingresá un número mayor a cero' });
      return;
    }

    setSaving(true);
    setMsg({ type: '', text: '' });
    try {
      const data = await api.put('/crm/cotizacion', { valor: num });
      setRate(data);
      setMsg({ type: 'ok', text: 'Cotización actualizada' });
    } catch (err) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const cardStyle = {
    background:   isDark ? '#1e293b' : '#fff',
    border:       isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
    borderRadius: 12,
    padding:      '20px 24px',
    marginBottom: 20,
    borderLeft:   '3px solid #0ea5e9',
  };

  const labelStyle = {
    display:       'block',
    fontSize:      12,
    fontWeight:    700,
    color:         isDark ? '#94a3b8' : '#64748b',
    marginBottom:  4,
    textTransform: 'uppercase',
  };

  const inputStyle = {
    width:        220,
    padding:      '8px 12px',
    borderRadius: 8,
    border:       `1px solid ${isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0'}`,
    background:   isDark ? '#0f172a' : '#f8fafc',
    color:        isDark ? '#e2e8f0' : '#1e293b',
    fontSize:     14,
    boxSizing:    'border-box',
  };

  const estadoChip = () => {
    if (!rate) return null;
    if (!rate.configurada) {
      return (
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: isDark ? 'rgba(239,68,68,0.12)' : '#fef2f2', border: '1px solid #ef4444', color: '#ef4444' }}>
          Sin cargar
        </span>
      );
    }
    if (rate.vencida) {
      return (
        <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: isDark ? 'rgba(234,179,8,0.1)' : '#fefce8', border: '1px solid #ca8a04', color: '#ca8a04' }}>
          ⚠ Desactualizada — {rate.edadDias} días
        </span>
      );
    }
    return (
      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: isDark ? 'rgba(34,197,94,0.1)' : '#f0fdf4', border: '1px solid #16a34a', color: '#16a34a' }}>
        ✓ Al día
      </span>
    );
  };

  if (loading) {
    return <div style={cardStyle}>Cargando cotización...</div>;
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Cotización del dólar</span>
        {estadoChip()}
      </div>

      <div style={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8', marginBottom: 16, maxWidth: 620 }}>
        Cuántos pesos vale un dólar. Con esto el sistema puede comparar una propiedad
        publicada en pesos contra el presupuesto de un cliente en dólares. Cada
        recomendación guarda la cotización que usó, así los matches viejos se releen
        con los mismos números. Conviene actualizarla una vez por semana.
      </div>

      <label style={labelStyle}>Pesos por dólar</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <input
          type="number"
          style={inputStyle}
          placeholder="1250"
          value={valor}
          min={1}
          step="0.01"
          onChange={(e) => setValor(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          style={{
            padding: '9px 22px', borderRadius: 9, border: 'none', background: '#0ea5e9',
            color: '#fff', fontWeight: 700, fontSize: 13,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {rate?.configurada && (
        <div style={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8', marginTop: 12 }}>
          Última carga:{' '}
          <b>{rate.fecha ? new Date(rate.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—'}</b>
          {rate.actualizadaPor ? <> · por <b>{rate.actualizadaPor}</b></> : null}
        </div>
      )}

      {msg.text && (
        <div style={{ fontSize: 12, marginTop: 10, color: msg.type === 'error' ? '#ef4444' : '#16a34a' }}>
          {msg.text}
        </div>
      )}
    </div>
  );
};

export default CotizacionCard;
