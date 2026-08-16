import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { FaEnvelope, FaCalendarCheck, FaPhone, FaHome, FaSync, FaUser, FaClock, FaSearch, FaInbox, FaCheck, FaTrash } from 'react-icons/fa';

import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';

// Consultas que llegan del sitio sobre las propiedades del agente.
// El backend ya filtra por agenteId, así que cada agente ve solo las suyas.
const Consultas = () => {
  const { currentMode } = useStateContext();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [soloSinLeer, setSoloSinLeer] = useState(false);
  const [deletingId, setDeletingId] = useState('');
  const rowRefs = useRef({});

  // Consulta puntual abierta desde el dropdown del navbar
  const params = new URLSearchParams(location.search);
  const focusId = params.get('id') || '';

  const filteredItems = useMemo(() => {
    let result = items;
    if (filter === 'enquiry') result = result.filter((r) => r.type === 'enquiry');
    if (filter === 'visit') result = result.filter((r) => r.type === 'visit_scheduled');
    if (soloSinLeer) result = result.filter((r) => !r.leida);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((r) => r.contact.fullName.toLowerCase().includes(term)
        || r.contact.email.toLowerCase().includes(term)
        || r.property.title.toLowerCase().includes(term)
        || r.notes.toLowerCase().includes(term));
    }
    return result;
  }, [items, filter, soloSinLeer, searchTerm]);

  const stats = useMemo(() => ({
    total: items.length,
    enquiries: items.filter((r) => r.type === 'enquiry').length,
    visits: items.filter((r) => r.type === 'visit_scheduled').length,
    sinLeer: items.filter((r) => !r.leida).length,
  }), [items]);

  const mapActivity = (it) => {
    const md = it && it.metadata ? it.metadata : {};
    const contact = md.contact || {};
    const prop = md.property || {};
    return {
      id: it._id || it.id,
      createdAt: it.createdAt || it.updatedAt,
      type: it.type || '',
      notes: it.notes || '',
      leida: !!md.read,
      contact: {
        fullName: contact.fullName || md.clientName || '',
        email: contact.email || md.clientEmail || '',
        phone: contact.phone || md.clientPhone || '',
      },
      property: {
        title: prop.title || md.propertyTitle || '',
        slug: prop.slug || '',
        id: prop.id || it.propertyId || '',
      },
    };
  };

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [enquiries, visits] = await Promise.all([
        crmService.activities.getAll({ type: 'enquiry' }).catch(() => []),
        crmService.activities.getAll({ type: 'visit_scheduled' }).catch(() => []),
      ]);
      const merged = []
        .concat(Array.isArray(enquiries) ? enquiries.map(mapActivity) : [])
        .concat(Array.isArray(visits) ? visits.map(mapActivity) : []);
      merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setItems(merged);
    } catch (e) {
      setError(e?.message || 'Error al cargar consultas');
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Al llegar desde el dropdown, hacer scroll a la consulta elegida
  useEffect(() => {
    if (!focusId || items.length === 0) return;
    const node = rowRefs.current[focusId];
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focusId, items]);

  const toggleRead = async (row) => {
    const next = !row.leida;
    try {
      await crmService.activities.markRead(row.id, next);
      setItems((prev) => prev.map((r) => (r.id === row.id ? { ...r, leida: next } : r)));
    } catch (e) {
      setError(e?.message || 'No se pudo actualizar el estado de lectura');
    }
  };

  const markAllRead = async () => {
    const pending = items.filter((r) => !r.leida);
    if (pending.length === 0) return;
    await Promise.all(pending.map((r) => crmService.activities.markRead(r.id, true).catch(() => {})));
    setItems((prev) => prev.map((r) => ({ ...r, leida: true })));
  };

  // Borrado definitivo en la base: no hay papelera ni forma de recuperarlo
  const deleteRow = async (row) => {
    const quien = row.contact.fullName || 'esta consulta';
    if (!window.confirm(`¿Eliminar la consulta de ${quien}?\n\nSe borra de la base de datos y no se puede recuperar.`)) return;
    setDeletingId(row.id);
    setError('');
    try {
      await crmService.activities.delete(row.id);
      setItems((prev) => prev.filter((r) => r.id !== row.id));
    } catch (e) {
      setError(e?.message || 'No se pudo eliminar la consulta');
    } finally {
      setDeletingId('');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return 'Hace unos minutos';
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const statCards = [
    { key: 'all', label: 'Total', value: stats.total, ring: 'ring-blue-500', bg: 'from-blue-50 to-blue-100', icon: <FaInbox className="text-xl text-white" />, iconBg: currentMode === 'Dark' ? 'bg-blue-900/50' : 'bg-blue-500', valueColor: 'text-blue-600 dark:text-blue-400' },
    { key: 'enquiry', label: 'Consultas', value: stats.enquiries, ring: 'ring-purple-500', bg: 'from-purple-50 to-purple-100', icon: <FaEnvelope className="text-xl text-white" />, iconBg: currentMode === 'Dark' ? 'bg-purple-900/50' : 'bg-purple-500', valueColor: 'text-purple-600 dark:text-purple-400' },
    { key: 'visit', label: 'Visitas Programadas', value: stats.visits, ring: 'ring-green-500', bg: 'from-green-50 to-green-100', icon: <FaCalendarCheck className="text-xl text-white" />, iconBg: currentMode === 'Dark' ? 'bg-green-900/50' : 'bg-green-500', valueColor: 'text-green-600 dark:text-green-400' },
  ];

  return (
    <div className={`min-h-screen px-6 lg:px-8 pt-4 pb-6 ${currentMode === 'Dark' ? 'bg-main-dark-bg' : 'bg-gray-50'}`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${currentMode === 'Dark' ? 'text-white' : 'text-gray-900'}`}>
          <FaEnvelope className="text-blue-500" /> Consultas y Mensajes
        </h2>
        <p className={`text-sm mt-1 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Consultas y solicitudes de visita que llegan desde el sitio
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {statCards.map((card) => (
          <div
            key={card.key}
            onClick={() => setFilter(card.key)}
            className={`p-4 rounded-xl cursor-pointer transition-all ${
              filter === card.key ? `ring-2 ${card.ring} shadow-lg` : 'hover:shadow-md'
            } ${currentMode === 'Dark' ? 'bg-gray-800' : `bg-gradient-to-br ${card.bg}`}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
                <p className={`text-3xl font-bold ${card.valueColor}`}>{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.iconBg}`}>{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className={`flex-1 max-w-md relative ${currentMode === 'Dark' ? 'text-gray-100' : ''}`}>
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, email, propiedad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
              currentMode === 'Dark'
                ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSoloSinLeer((v) => !v)}
            className={`px-4 py-2.5 rounded-lg font-medium transition-colors border ${
              soloSinLeer
                ? 'bg-red-500 border-red-500 text-white'
                : currentMode === 'Dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sin leer{stats.sinLeer > 0 ? ` (${stats.sinLeer})` : ''}
          </button>
          <button
            type="button"
            onClick={markAllRead}
            disabled={stats.sinLeer === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors border disabled:opacity-50 ${
              currentMode === 'Dark'
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <FaCheck className="text-xs" /> Marcar todas
          </button>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors disabled:opacity-50"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Messages List */}
      <div className="space-y-4">
        {filteredItems.map((row) => (
          <div
            key={row.id}
            ref={(el) => { rowRefs.current[row.id] = el; }}
            className={`rounded-xl overflow-hidden transition-all hover:shadow-lg ${
              focusId === row.id ? 'ring-2 ring-blue-500' : ''
            } ${!row.leida ? 'border-l-4 border-l-red-500' : ''} ${
              currentMode === 'Dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'
            }`}
          >
            {/* Card Header */}
            <div className={`px-5 py-3 flex items-center justify-between ${
              row.type === 'visit_scheduled'
                ? (currentMode === 'Dark' ? 'bg-green-900/30 border-b border-green-800' : 'bg-green-50 border-b border-green-200')
                : (currentMode === 'Dark' ? 'bg-purple-900/30 border-b border-purple-800' : 'bg-purple-50 border-b border-purple-200')
            }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  row.type === 'visit_scheduled'
                    ? (currentMode === 'Dark' ? 'bg-green-800' : 'bg-green-500')
                    : (currentMode === 'Dark' ? 'bg-purple-800' : 'bg-purple-500')
                }`}
                >
                  {row.type === 'visit_scheduled'
                    ? <FaCalendarCheck className="text-white" />
                    : <FaEnvelope className="text-white" />}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    row.type === 'visit_scheduled'
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-purple-700 dark:text-purple-300'
                  }`}
                  >
                    {row.type === 'visit_scheduled' ? 'Solicitud de Visita' : 'Consulta'}
                  </span>
                  {!row.leida && (
                    <span className="text-[10px] font-bold uppercase tracking-wide bg-red-500 text-white px-2 py-0.5 rounded-full">
                      Sin leer
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaClock className="text-xs" />
                  {formatDate(row.createdAt)}
                </span>
                <button
                  type="button"
                  onClick={() => toggleRead(row)}
                  className="text-xs px-3 py-1 rounded-full border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-700 transition-colors"
                >
                  {row.leida ? 'Marcar sin leer' : 'Marcar leída'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteRow(row)}
                  disabled={deletingId === row.id}
                  title="Eliminar de la base de datos"
                  className="text-xs p-1.5 rounded-full border border-gray-300 dark:border-gray-600 text-gray-500 hover:text-red-600 hover:border-red-400 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  {deletingId === row.id
                    ? <FaSync className="animate-spin text-[11px]" />
                    : <FaTrash className="text-[11px]" />}
                </button>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Contacto
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      currentMode === 'Dark' ? 'bg-gray-700' : 'bg-gray-400'
                    }`}
                    >
                      {row.contact.fullName ? row.contact.fullName.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {row.contact.fullName || 'Sin nombre'}
                      </p>
                      {row.contact.email && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <FaEnvelope className="text-xs" />
                          <a href={`mailto:${row.contact.email}?subject=${encodeURIComponent(`Re: Consulta sobre ${row.property.title || 'propiedad'}`)}`} className="hover:underline">
                            {row.contact.email}
                          </a>
                        </p>
                      )}
                      {row.contact.phone && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <FaPhone className="text-xs" />
                          <a href={`tel:${row.contact.phone}`} className="hover:underline">{row.contact.phone}</a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Info */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Propiedad
                  </h4>
                  {row.property.title ? (
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        currentMode === 'Dark' ? 'bg-blue-900/50' : 'bg-blue-100'
                      }`}
                      >
                        <FaHome className="text-blue-500" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{row.property.title}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">Sin propiedad asociada</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-3 md:col-span-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Mensaje
                  </h4>
                  {row.notes ? (
                    <p className={`text-sm leading-relaxed p-3 rounded-lg whitespace-pre-wrap ${
                      currentMode === 'Dark' ? 'bg-gray-700/50 text-gray-300' : 'bg-gray-50 text-gray-700'
                    }`}
                    >
                      {row.notes}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">Sin mensaje</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredItems.length === 0 && (
          <div className={`text-center py-16 rounded-xl ${
            currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'
          }`}
          >
            <FaEnvelope className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {searchTerm || filter !== 'all' || soloSinLeer ? 'No se encontraron resultados' : 'No hay consultas todavía'}
            </p>
            {(searchTerm || filter !== 'all' || soloSinLeer) && (
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setFilter('all'); setSoloSinLeer(false); }}
                className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Consultas;
