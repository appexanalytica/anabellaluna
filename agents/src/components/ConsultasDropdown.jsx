import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaHome, FaSync, FaCheck } from 'react-icons/fa';
import NavPanel from './navbar/NavPanel';
import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';
import API_CONFIG from '../config/api';

const formatTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  const diffHours = Math.floor((now - date) / 3600000);
  const diffDays = Math.floor((now - date) / 86400000);
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

// Preview corto para el dropdown
const truncate = (text, max = 90) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
};

const mapActivity = (item) => {
  const meta = item.metadata || {};
  const contact = meta.contact || {};
  const property = meta.property || {};
  return {
    id: item._id || item.id,
    nombre: contact.fullName || meta.clientName || 'Sin nombre',
    mensaje: item.notes || (item.type === 'visit_scheduled' ? 'Solicitud de visita' : 'Consulta web'),
    rol: item.type === 'visit_scheduled' ? 'Visita programada' : 'Consulta de propiedad',
    icono: item.type === 'visit_scheduled' ? '📅' : '🏠',
    propiedad: property.title || meta.propertyTitle || '',
    cover: property.coverUrl || '',
    leida: !!meta.read,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  };
};

/**
 * Miniatura de la propiedad consultada.
 *
 * La portada llega en `metadata.property.coverUrl` como ruta pública
 * (/public/media/:id), así que se puede pedir sin token. Si la consulta es
 * vieja o la propiedad no tiene fotos, cae en el ícono de siempre.
 */
const Miniatura = ({ cover, icono }) => {
  const [fallo, setFallo] = useState(false);
  const src = cover && !fallo
    ? (String(cover).startsWith('http') ? cover : `${API_CONFIG.baseURL}${cover}`)
    : '';

  if (!src) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl flex-shrink-0">
        {icono}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFallo(true)}
      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
    />
  );
};

// Dropdown de la burbuja de mensajes del navbar: preview de las consultas del sitio
const ConsultasDropdown = ({ onUnreadChange, onClose }) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const notifyUnread = useCallback((list) => {
    if (onUnreadChange) onUnreadChange(list.filter((i) => !i.leida).length);
  }, [onUnreadChange]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [enquiries, visits] = await Promise.all([
        crmService.activities.getAll({ type: 'enquiry' }).catch(() => []),
        crmService.activities.getAll({ type: 'visit_scheduled' }).catch(() => []),
      ]);
      const merged = []
        .concat(Array.isArray(enquiries) ? enquiries.map(mapActivity) : [])
        .concat(Array.isArray(visits) ? visits.map(mapActivity) : [])
        .sort((a, b) => b.createdAt - a.createdAt);
      setItems(merged);
      notifyUnread(merged);
    } catch (e) {
      console.error('Error cargando consultas:', e);
    } finally {
      setLoading(false);
    }
  }, [notifyUnread]);

  useEffect(() => { load(); }, [load]);

  const noLeidas = items.filter((i) => !i.leida).length;

  const abrirConsulta = (item) => {
    if (!item.leida) {
      crmService.activities.markRead(item.id, true).catch(() => {});
      setItems((prev) => {
        const next = prev.map((i) => (i.id === item.id ? { ...i, leida: true } : i));
        notifyUnread(next);
        return next;
      });
    }
    onClose();
    navigate(`/crm/consultas?id=${item.id}`);
  };

  const marcarTodas = async () => {
    const pendientes = items.filter((i) => !i.leida);
    if (pendientes.length === 0) return;
    await Promise.all(pendientes.map((i) => crmService.activities.markRead(i.id, true).catch(() => {})));
    setItems((prev) => {
      const next = prev.map((i) => ({ ...i, leida: true }));
      notifyUnread(next);
      return next;
    });
  };

  const preview = items.slice(0, 20);

  return (
    <NavPanel
      titulo="Consultas"
      subtitulo={noLeidas > 0 ? `${noLeidas} sin leer` : 'Todo respondido'}
      icono={(
        <div className="relative flex-shrink-0">
          <FaComments className="text-2xl" style={{ color: currentColor }} />
          {noLeidas > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">
              {noLeidas > 99 ? '99+' : noLeidas}
            </span>
          )}
        </div>
      )}
      onClose={onClose}
      acciones={(
        <button
          type="button"
          onClick={load}
          disabled={loading}
          title="Actualizar"
          aria-label="Actualizar consultas"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaSync className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}
      footer={(
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={marcarTodas}
            disabled={noLeidas === 0}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <FaCheck className="text-xs" /> Marcar todas
          </button>
          <button
            type="button"
            className="text-sm font-medium"
            style={{ color: currentColor }}
            onClick={() => { onClose(); navigate('/crm/consultas'); }}
          >
            Ver todas →
          </button>
        </div>
      )}
    >
      <>
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: currentColor }} />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8">
            <FaComments className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No hay consultas</p>
          </div>
        ) : (
          preview.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => abrirConsulta(item)}
              className={`w-full text-left border-l-4 p-3 rounded-lg hover:shadow-md transition-all ${
                item.leida
                  ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600 opacity-70'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <Miniatura cover={item.cover} icono={item.icono} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h4 className="font-bold text-sm dark:text-gray-200 truncate">{item.nombre}</h4>
                    {!item.leida && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">{item.rol}</p>
                  {item.propiedad && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mb-1">
                      <FaHome className="flex-shrink-0" /> {item.propiedad}
                    </p>
                  )}
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{truncate(item.mensaje)}</p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(item.createdAt)}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </>
    </NavPanel>
  );
};

export default ConsultasDropdown;
