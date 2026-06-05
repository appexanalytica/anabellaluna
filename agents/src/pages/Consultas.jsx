import React, { useEffect, useMemo, useState } from 'react';

import { FaEnvelope, FaCalendarCheck, FaPhone, FaHome, FaSync, FaUser, FaClock, FaSearch } from 'react-icons/fa';

import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';

const Consultas = () => {
  const { currentMode } = useStateContext();

  // Property inquiries state
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const normalized = useMemo(() => (Array.isArray(items) ? items : []).map((it) => {
    const md = it && it.metadata ? it.metadata : {};
    const contact = md.contact || {};
    const prop = md.property || {};
    return {
      id: it._id || it.id,
      createdAt: it.createdAt || it.updatedAt,
      type: it.type || '',
      notes: it.notes || '',
      contact: {
        fullName: contact.fullName || '',
        email: contact.email || '',
        phone: contact.phone || '',
      },
      property: {
        title: prop.title || '',
        slug: prop.slug || '',
        id: prop.id || it.propertyId || '',
      },
    };
  }), [items]);

  const filteredItems = useMemo(() => {
    let result = normalized;
    if (filter === 'enquiry') result = result.filter((r) => r.type === 'enquiry');
    if (filter === 'visit') result = result.filter((r) => r.type === 'visit_scheduled');
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter((r) => r.contact.fullName.toLowerCase().includes(term)
        || r.contact.email.toLowerCase().includes(term)
        || r.property.title.toLowerCase().includes(term)
        || r.notes.toLowerCase().includes(term));
    }
    return result;
  }, [normalized, filter, searchTerm]);

  const stats = useMemo(() => ({
    total: normalized.length,
    enquiries: normalized.filter((r) => r.type === 'enquiry').length,
    visits: normalized.filter((r) => r.type === 'visit_scheduled').length,
  }), [normalized]);

  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      const enquiries = await crmService.activities.getAll({ type: 'enquiry' });
      const visits = await crmService.activities.getAll({ type: 'visit_scheduled' });
      const merged = []
        .concat(Array.isArray(enquiries) ? enquiries : [])
        .concat(Array.isArray(visits) ? visits : []);
      merged.sort((a, b) => {
        const ta = new Date(a.createdAt || a.updatedAt || 0).getTime();
        const tb = new Date(b.createdAt || b.updatedAt || 0).getTime();
        return tb - ta;
      });
      setItems(merged);
    } catch (e) {
      setError(e?.message || 'Error al cargar consultas');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

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


  return (
    <div className={`min-h-screen px-6 lg:px-8 pt-4 pb-6 ${currentMode === 'Dark' ? 'bg-main-dark-bg' : 'bg-gray-50'}`}>
      <div className="mb-6">
        <h2 className={`text-lg font-semibold flex items-center gap-2 ${currentMode === 'Dark' ? 'text-white' : 'text-gray-900'}`}>
          <FaEnvelope className="text-blue-500" /> Consultas y Mensajes
        </h2>
        <p className={`text-sm mt-1 ${currentMode === 'Dark' ? 'text-gray-400' : 'text-gray-500'}`}>Gestión de consultas entrantes</p>
      </div>

      {(
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              onClick={() => setFilter('all')}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                filter === 'all'
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              } ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-50 to-blue-100'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</p>
                </div>
                <div className={`p-3 rounded-full ${currentMode === 'Dark' ? 'bg-blue-900/50' : 'bg-blue-500'}`}>
                  <FaEnvelope className="text-xl text-white" />
                </div>
              </div>
            </div>

            <div
              onClick={() => setFilter('enquiry')}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                filter === 'enquiry'
                  ? 'ring-2 ring-purple-500 shadow-lg'
                  : 'hover:shadow-md'
              } ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-purple-50 to-purple-100'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Consultas</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.enquiries}</p>
                </div>
                <div className={`p-3 rounded-full ${currentMode === 'Dark' ? 'bg-purple-900/50' : 'bg-purple-500'}`}>
                  <FaEnvelope className="text-xl text-white" />
                </div>
              </div>
            </div>

            <div
              onClick={() => setFilter('visit')}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                filter === 'visit'
                  ? 'ring-2 ring-green-500 shadow-lg'
                  : 'hover:shadow-md'
              } ${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gradient-to-br from-green-50 to-green-100'}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Visitas Programadas</p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.visits}</p>
                </div>
                <div className={`p-3 rounded-full ${currentMode === 'Dark' ? 'bg-green-900/50' : 'bg-green-500'}`}>
                  <FaCalendarCheck className="text-xl text-white" />
                </div>
              </div>
            </div>
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
                className={`rounded-xl overflow-hidden transition-all hover:shadow-lg ${
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
                    <div>
                      <span className={`font-semibold ${
                        row.type === 'visit_scheduled'
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-purple-700 dark:text-purple-300'
                      }`}
                      >
                        {row.type === 'visit_scheduled' ? 'Solicitud de Visita' : 'Consulta'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FaClock className="text-xs" />
                    {formatDate(row.createdAt)}
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
                            <FaEnvelope className="text-xs" /> {row.contact.email}
                          </p>
                          )}
                          {row.contact.phone && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <FaPhone className="text-xs" /> {row.contact.phone}
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
                        <p className={`text-sm leading-relaxed p-3 rounded-lg ${
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
                {searchTerm || filter !== 'all' ? 'No se encontraron resultados' : 'No hay consultas todavía'}
              </p>
              {(searchTerm || filter !== 'all') && (
              <button
                type="button"
                onClick={() => { setSearchTerm(''); setFilter('all'); }}
                className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
              >
                Limpiar filtros
              </button>
              )}
            </div>
            )}
          </div>
        </>
      )}

    </div>
  );
};

export default Consultas;
