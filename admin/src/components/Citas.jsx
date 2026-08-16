import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaSync, FaUser } from 'react-icons/fa';

import NavPanel from './navbar/NavPanel';
import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';

/**
 * Panel de Citas de la navbar.
 *
 * Muestra lo inmediato: lo que queda de hoy y las próximas 24 h. Las citas
 * canceladas nunca aparecen (el enum del modelo es 'Cancelada', y las consultas
 * viejas comparaban contra 'cancelada' en minúscula, así que las contaban).
 */

const ESTADOS_CANCELADA = ['Cancelada', 'cancelada'];

const formatHora = (fecha) => {
  const d = new Date(fecha);
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const dia = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  if (dia.getTime() === hoy.getTime()) return `Hoy ${hora}`;
  if (dia.getTime() === hoy.getTime() + 86400000) return `Mañana ${hora}`;
  return `${d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} ${hora}`;
};

const Citas = ({ onClose }) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const citas = await crmService.citas.getAll();
      const ahora = new Date();
      const en24h = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

      const proximas = (Array.isArray(citas) ? citas : [])
        .filter((c) => !ESTADOS_CANCELADA.includes(c.estado))
        .filter((c) => {
          const fecha = new Date(c.fecha);
          return fecha >= ahora && fecha <= en24h;
        })
        .map((c) => ({
          id: c._id,
          titulo: c.titulo || c.tipo || 'Cita',
          fecha: c.fecha,
          ubicacion: c.ubicacion || '',
          cliente: c.metadata?.clienteNombre || c.clienteNombre || '',
          notas: c.notas || '',
        }))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      setItems(proximas);
    } catch (err) {
      console.error('Error cargando citas:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const abrir = () => { onClose(); navigate('/citas'); };

  return (
    <NavPanel
      titulo="Citas"
      subtitulo={items.length === 0 ? 'Sin citas en las próximas 24 h' : `${items.length} en las próximas 24 h`}
      icono={<FaCalendarAlt className="text-2xl flex-shrink-0" style={{ color: currentColor }} />}
      onClose={onClose}
      acciones={(
        <button
          type="button"
          onClick={cargar}
          disabled={loading}
          title="Actualizar"
          aria-label="Actualizar citas"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaSync className={`text-gray-500 ${loading ? 'animate-spin' : ''}`} />
        </button>
      )}
      footer={(
        <button
          type="button"
          className="w-full py-2 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: currentColor, color: 'white' }}
          onClick={abrir}
        >
          Ver la agenda completa →
        </button>
      )}
    >
      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: currentColor }} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-10">
          <FaCalendarAlt className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No hay citas próximas</p>
          <p className="text-xs text-gray-400 mt-1">Las de más adelante están en la agenda</p>
        </div>
      ) : (
        items.map((cita) => (
          <button
            key={cita.id}
            type="button"
            onClick={abrir}
            className="w-full text-left bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500 p-3 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4 className="font-bold text-sm dark:text-gray-200 truncate">{cita.titulo}</h4>
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-300 flex-shrink-0">
                {formatHora(cita.fecha)}
              </span>
            </div>
            {cita.cliente && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                <FaUser className="flex-shrink-0" /> {cita.cliente}
              </p>
            )}
            {cita.ubicacion && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1 truncate">
                <FaMapMarkerAlt className="flex-shrink-0" /> {cita.ubicacion}
              </p>
            )}
            {cita.notas && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{cita.notas}</p>
            )}
          </button>
        ))
      )}
    </NavPanel>
  );
};

export default Citas;
