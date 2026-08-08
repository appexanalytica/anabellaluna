import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaSync, FaGlobe, FaHome, FaEnvelope, FaPhone, FaCalendarAlt, FaCheck } from 'react-icons/fa';
import { useStateContext } from '../../contexts/ContextProvider';
import { crmService } from '../../services/crmService';

const formatTimeLabel = (date) => {
  if (!date) return '';
  const now = new Date();
  const diffMins = Math.floor((now - date) / 60000);
  const diffHours = Math.floor((now - date) / 3600000);
  const diffDays = Math.floor((now - date) / 86400000);
  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `${diffDays} días`;
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
};

// Consulta originada en una propiedad (Activity: enquiry / visit_scheduled)
const mapEnquiry = (item) => {
  const meta = item.metadata || {};
  const contact = meta.contact || {};
  const property = meta.property || {};
  return {
    id: item._id,
    origen: 'activity',
    nombre: contact.fullName || meta.clientName || 'Sin nombre',
    email: contact.email || meta.clientEmail || '',
    phone: contact.phone || meta.clientPhone || '',
    asunto: '',
    mensaje: item.notes || (item.type === 'visit_scheduled' ? 'Solicitud de visita' : 'Consulta web'),
    tipo: item.type,
    rol: item.type === 'visit_scheduled' ? 'Visita programada' : 'Consulta de propiedad',
    icono: item.type === 'visit_scheduled' ? '📅' : '🏠',
    propiedad: property.title || meta.propertyTitle || '',
    leida: !!meta.read,
    createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  };
};

// Mensaje del formulario de contacto del sitio (ContactMessage)
const mapContactMessage = (item) => ({
  id: item._id,
  origen: 'contacto',
  nombre: item.nombre || 'Sin nombre',
  email: item.email || '',
  phone: item.telefono || '',
  asunto: item.asunto || '',
  mensaje: item.mensaje || '',
  tipo: 'contact_form',
  rol: 'Formulario de contacto',
  icono: '✉️',
  propiedad: '',
  leida: !!item.leido,
  createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
});

// Cada origen tiene su propio endpoint para marcar leído
const markReadApi = (item, read) => (
  item.origen === 'contacto'
    ? crmService.contactMessages.markRead(item.id, read)
    : crmService.activities.markRead(item.id, read)
);

// Bandeja de consultas del sitio: enquiries de propiedades + formulario de contacto
const ConsultasWebPanel = ({ onUnreadChange }) => {
  const { currentColor } = useStateContext();
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const notifyUnread = useCallback((list) => {
    if (onUnreadChange) onUnreadChange(list.filter((e) => !e.leida).length);
  }, [onUnreadChange]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [activities, contactos] = await Promise.all([
        crmService.activities.getAll().catch(() => []),
        crmService.contactMessages.getAll().catch(() => []),
      ]);
      const mapped = [
        ...(Array.isArray(activities) ? activities : [])
          .filter((item) => item.type === 'enquiry' || item.type === 'visit_scheduled')
          .map(mapEnquiry),
        ...(Array.isArray(contactos) ? contactos : []).map(mapContactMessage),
      ].sort((a, b) => b.createdAt - a.createdAt);
      setEnquiries(mapped);
      notifyUnread(mapped);
    } catch (e) {
      console.error('Error cargando consultas del sitio:', e);
    } finally {
      setLoading(false);
    }
  }, [notifyUnread]);

  useEffect(() => { load(); }, [load]);

  const sameItem = (a, b) => a && b && a.id === b.id && a.origen === b.origen;

  const setRead = async (enquiry, read) => {
    try {
      await markReadApi(enquiry, read);
      setEnquiries((prev) => {
        const next = prev.map((e) => (sameItem(e, enquiry) ? { ...e, leida: read } : e));
        notifyUnread(next);
        return next;
      });
      setSelected((prev) => (sameItem(prev, enquiry) ? { ...prev, leida: read } : prev));
    } catch (e) {
      console.error('Error actualizando estado de lectura:', e);
    }
  };

  const openEnquiry = (enquiry) => {
    setSelected(enquiry);
    if (!enquiry.leida) setRead(enquiry, true);
  };

  const markAllRead = async () => {
    const pending = enquiries.filter((e) => !e.leida);
    if (pending.length === 0) return;
    await Promise.all(pending.map((e) => markReadApi(e, true).catch(() => {})));
    setEnquiries((prev) => {
      const next = prev.map((e) => ({ ...e, leida: true }));
      notifyUnread(next);
      return next;
    });
    setSelected((prev) => (prev ? { ...prev, leida: true } : prev));
  };

  const matchesFilter = (e) => {
    if (filter === 'unread') return !e.leida;
    if (filter === 'propiedades') return e.origen === 'activity';
    if (filter === 'contacto') return e.origen === 'contacto';
    return true;
  };

  const term = searchTerm.trim().toLowerCase();
  const visible = enquiries
    .filter(matchesFilter)
    .filter((e) => !term
      || e.nombre.toLowerCase().includes(term)
      || e.email.toLowerCase().includes(term)
      || e.propiedad.toLowerCase().includes(term)
      || e.asunto.toLowerCase().includes(term)
      || e.mensaje.toLowerCase().includes(term));
  const noLeidas = enquiries.filter((e) => !e.leida).length;

  return (
    <div className="flex flex-1 min-w-0 h-full">
      {/* Lista */}
      <div className="flex flex-col h-full flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700" style={{ width: '350px' }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">Consultas del sitio</span>
          <div className="flex items-center gap-1">
            {noLeidas > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                title="Marcar todas como leídas"
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <FaCheck className="text-sm text-gray-500" />
              </button>
            )}
            <button
              type="button"
              onClick={load}
              disabled={loading}
              title="Actualizar"
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <FaSync className={`text-sm text-gray-500 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email, asunto o propiedad…"
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm bg-white dark:bg-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'unread', label: `Sin leer${noLeidas > 0 ? ` (${noLeidas})` : ''}` },
            { key: 'propiedades', label: 'Propiedades' },
            { key: 'contacto', label: 'Contacto' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilter(tab.key)}
              className="flex-1 py-2 text-xs font-medium transition-colors"
              style={{
                color: filter === tab.key ? currentColor : '#667781',
                borderBottom: filter === tab.key ? `2px solid ${currentColor}` : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500">
              <FaGlobe className="text-3xl mb-2 opacity-50" />
              <p className="text-sm">No hay consultas</p>
            </div>
          ) : visible.map((enq) => (
            <div
              key={`${enq.origen}-${enq.id}`}
              onClick={() => openEnquiry(enq)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 dark:border-gray-700 transition-colors ${
                sameItem(selected, enq)
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : !enq.leida
                    ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="text-2xl w-10 h-10 flex items-center justify-center flex-shrink-0">{enq.icono}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{enq.nombre}</span>
                  <span className="text-xs text-gray-400 ml-1 flex-shrink-0">{formatTimeLabel(enq.createdAt)}</span>
                </div>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] my-0.5 ${
                  enq.tipo === 'visit_scheduled'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : enq.origen === 'contacto'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>{enq.rol}</span>
                {enq.propiedad && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
                    <FaHome className="flex-shrink-0" /> {enq.propiedad}
                  </p>
                )}
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {enq.asunto ? `${enq.asunto} — ${enq.mensaje}` : enq.mensaje}
                  </p>
                  {!enq.leida && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detalle */}
      <div className="flex-1 min-w-0 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {!selected ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
            <FaGlobe className="text-5xl mb-3 opacity-40" />
            <p className="text-sm">Elegí una consulta para ver el detalle</p>
          </div>
        ) : (
          <div className="p-6 space-y-4 max-w-3xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{selected.nombre}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{selected.rol}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                  <FaCalendarAlt /> {selected.createdAt.toLocaleString('es-AR')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setRead(selected, !selected.leida)}
                className="text-xs px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              >
                {selected.leida ? 'Marcar sin leer' : 'Marcar como leída'}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3">Contacto</h4>
              <div className="space-y-2 text-sm">
                {selected.email ? (
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="text-gray-400" />
                    <a href={`mailto:${selected.email}`} className="text-blue-500 hover:underline">{selected.email}</a>
                  </p>
                ) : null}
                {selected.phone ? (
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <FaPhone className="text-gray-400" />
                    <a href={`tel:${selected.phone}`} className="text-blue-500 hover:underline">{selected.phone}</a>
                  </p>
                ) : null}
                {!selected.email && !selected.phone && (
                  <p className="text-gray-400 text-sm">Sin datos de contacto</p>
                )}
              </div>
            </div>

            {selected.propiedad && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-2">Propiedad de interés</h4>
                <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <FaHome className="text-gray-400" /> {selected.propiedad}
                </p>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-2">Mensaje</h4>
              {selected.asunto && (
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">{selected.asunto}</p>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {selected.mensaje || 'Sin mensaje adicional'}
              </p>
            </div>

            {(selected.email || selected.phone) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-3">Responder</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.email && (
                    <a
                      href={`mailto:${selected.email}?subject=${encodeURIComponent(
                        selected.asunto
                          ? `Re: ${selected.asunto}`
                          : `Re: Consulta sobre ${selected.propiedad || 'propiedad'}`
                      )}`}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
                    >
                      <FaEnvelope /> Email
                    </a>
                  )}
                  {selected.phone && (
                    <a
                      href={`https://wa.me/${selected.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
                    >
                      <FaPhone /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultasWebPanel;
