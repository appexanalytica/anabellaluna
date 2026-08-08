import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaComments, FaHome, FaSync, FaCheck } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';

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

const mapEnquiry = (item) => {
  const meta = item.metadata || {};
  const contact = meta.contact || {};
  const property = meta.property || {};
  return {
    id: item._id,
    origen: 'activity',
    nombre: contact.fullName || meta.clientName || 'Sin nombre',
    mensaje: item.notes || (item.type === 'visit_scheduled' ? 'Solicitud de visita' : 'Consulta web'),
    rol: item.type === 'visit_scheduled' ? 'Visita programada' : 'Consulta de propiedad',
    icono: item.type === 'visit_scheduled' ? '📅' : '🏠',
    propiedad: property.title || meta.propertyTitle || '',
    leida: !!meta.read,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  };
};

const mapContactMessage = (item) => ({
  id: item._id,
  origen: 'contacto',
  nombre: item.nombre || 'Sin nombre',
  mensaje: item.asunto ? `${item.asunto} — ${item.mensaje || ''}` : (item.mensaje || ''),
  rol: 'Formulario de contacto',
  icono: '✉️',
  propiedad: '',
  leida: !!item.leido,
  createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
});

const markReadApi = (item, read) => (
  item.origen === 'contacto'
    ? crmService.contactMessages.markRead(item.id, read)
    : crmService.activities.markRead(item.id, read)
);

// Dropdown de la burbuja de mensajes del navbar: preview de las consultas del sitio
const ConsultasDropdown = ({ onUnreadChange }) => {
  const { currentColor, setIsClicked, initialState } = useStateContext();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const notifyUnread = useCallback((list) => {
    if (onUnreadChange) onUnreadChange(list.filter((i) => !i.leida).length);
  }, [onUnreadChange]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [activities, contactos] = await Promise.all([
        crmService.activities.getAll().catch(() => []),
        crmService.contactMessages.getAll().catch(() => []),
      ]);
      const merged = [
        ...(Array.isArray(activities) ? activities : [])
          .filter((a) => a.type === 'enquiry' || a.type === 'visit_scheduled')
          .map(mapEnquiry),
        ...(Array.isArray(contactos) ? contactos : []).map(mapContactMessage),
      ].sort((a, b) => b.createdAt - a.createdAt);
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

  const abrirConsulta = async (item) => {
    if (!item.leida) {
      markReadApi(item, true).catch(() => {});
      setItems((prev) => {
        const next = prev.map((i) => (i.id === item.id && i.origen === item.origen ? { ...i, leida: true } : i));
        notifyUnread(next);
        return next;
      });
    }
    setIsClicked(initialState);
    navigate(`/consultas?id=${item.id}&origen=${item.origen}`);
  };

  const marcarTodas = async () => {
    const pendientes = items.filter((i) => !i.leida);
    if (pendientes.length === 0) return;
    await Promise.all(pendientes.map((i) => markReadApi(i, true).catch(() => {})));
    setItems((prev) => {
      const next = prev.map((i) => ({ ...i, leida: true }));
      notifyUnread(next);
      return next;
    });
  };

  const preview = items.slice(0, 20);

  return (
    <div className="nav-item fixed inset-x-4 top-20 mx-auto md:absolute md:inset-x-auto md:right-40 md:top-16 md:mx-0 bg-white dark:bg-[#42464D] p-6 rounded-lg max-w-96 w-auto md:w-96 shadow-xl z-50">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaComments className="text-2xl" style={{ color: currentColor }} />
            {noLeidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {noLeidas > 99 ? '99+' : noLeidas}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-lg dark:text-gray-200">Consultas</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{noLeidas} sin leer</p>
          </div>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          title="Actualizar"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaSync className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
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
            <div
              key={`${item.origen}-${item.id}`}
              onClick={() => abrirConsulta(item)}
              className={`border-l-4 p-3 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                item.leida
                  ? 'bg-gray-50 dark:bg-gray-800/40 border-gray-300 dark:border-gray-600 opacity-70'
                  : item.origen === 'contacto'
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-xl leading-none pt-0.5">{item.icono}</div>
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
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-600 flex items-center justify-between">
        <button
          type="button"
          onClick={marcarTodas}
          disabled={noLeidas === 0}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 flex items-center gap-1"
        >
          <FaCheck className="text-xs" /> Marcar todas como leídas
        </button>
        <button
          type="button"
          className="text-sm font-medium"
          style={{ color: currentColor }}
          onClick={() => { setIsClicked(initialState); navigate('/consultas'); }}
        >
          Ver todas →
        </button>
      </div>
    </div>
  );
};

export default ConsultasDropdown;
