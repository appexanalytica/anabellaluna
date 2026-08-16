import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaExclamationTriangle, FaSync, FaTasks } from 'react-icons/fa';

import NavPanel from './navbar/NavPanel';
import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';

/**
 * Panel de Tareas de la navbar: sólo lo accionable.
 *
 * Antes listaba el backlog completo mezclado con citas y con solicitudes de
 * visita, que ya viven en sus propios paneles. Acá van únicamente las tareas
 * vencidas y las que vencen hoy.
 */

// Estados en los que una tarea deja de requerir acción ('done' y 'Close' son legado).
const ESTADOS_CERRADOS = ['completada', 'cancelada', 'done', 'Close'];

const estaAbierta = (t) => !ESTADOS_CERRADOS.includes(t.status)
  && !ESTADOS_CERRADOS.includes(t.kanbanColumn)
  && t.completed !== true;

const estiloPrioridad = (prioridad) => {
  const estilos = {
    urgente: { fondo: 'bg-red-50 dark:bg-red-900/20', borde: 'border-red-600', chip: 'bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-200' },
    alta: { fondo: 'bg-red-50 dark:bg-red-900/20', borde: 'border-red-500', chip: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
    media: { fondo: 'bg-amber-50 dark:bg-amber-900/20', borde: 'border-amber-500', chip: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    baja: { fondo: 'bg-emerald-50 dark:bg-emerald-900/20', borde: 'border-emerald-500', chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  };
  return estilos[String(prioridad || '').toLowerCase()] || estilos.media;
};

const formatVencimiento = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const d = new Date(fecha);
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const dia = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  if (dia.getTime() === hoy.getTime()) return `Hoy ${hora}`;
  if (dia < hoy) return `Venció el ${d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}`;
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

const capitalizar = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const Tareas = ({ onClose }) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const tareas = await crmService.tareas.getAll();
      const ahora = new Date();
      const finDeHoy = new Date(ahora); finDeHoy.setHours(23, 59, 59, 999);

      const accionables = (Array.isArray(tareas) ? tareas : [])
        .filter(estaAbierta)
        .filter((t) => t.dueDate && new Date(t.dueDate) <= finDeHoy)
        .map((t) => ({
          id: t._id,
          titulo: t.title || 'Sin título',
          descripcion: t.description || t.summary || '',
          prioridad: t.priority || 'media',
          vencimiento: t.dueDate,
          vencida: new Date(t.dueDate) < new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate()),
          responsable: t.assigneeName || t.agente || '',
        }))
        .sort((a, b) => new Date(a.vencimiento) - new Date(b.vencimiento));

      setItems(accionables);
    } catch (err) {
      console.error('Error cargando tareas:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const vencidas = items.filter((i) => i.vencida).length;
  const deHoy = items.length - vencidas;

  const abrir = (ruta) => { onClose(); navigate(ruta); };

  return (
    <NavPanel
      titulo="Tareas"
      subtitulo={items.length === 0 ? 'Nada pendiente para hoy' : `${vencidas} vencidas · ${deHoy} para hoy`}
      icono={<FaTasks className="text-2xl flex-shrink-0" style={{ color: currentColor }} />}
      onClose={onClose}
      acciones={(
        <button
          type="button"
          onClick={cargar}
          disabled={loading}
          title="Actualizar"
          aria-label="Actualizar tareas"
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
          onClick={() => abrir('/crm/citas')}
        >
          Ver todas las tareas →
        </button>
      )}
    >
      {loading && items.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: currentColor }} />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-10">
          <FaTasks className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Sin tareas vencidas ni para hoy</p>
          <p className="text-xs text-gray-400 mt-1">Las que venzan más adelante están en la agenda</p>
        </div>
      ) : (
        items.map((item) => {
          const estilo = estiloPrioridad(item.prioridad);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => abrir('/crm/citas')}
              className={`w-full text-left ${estilo.fondo} border-l-4 ${estilo.borde} p-3 rounded-lg hover:shadow-md transition-all`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-bold text-sm dark:text-gray-200">{item.titulo}</h4>
                {item.vencida && <FaExclamationTriangle className="text-red-500 flex-shrink-0 mt-0.5" />}
              </div>
              {item.descripcion && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">{item.descripcion}</p>
              )}
              <div className="flex items-center justify-between gap-2">
                <span className={`flex items-center gap-1 text-xs ${item.vencida ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                  <FaClock /> {formatVencimiento(item.vencimiento)}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estilo.chip}`}>
                  {capitalizar(item.prioridad)}
                </span>
              </div>
              {item.responsable && (
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{item.responsable}</p>
              )}
            </button>
          );
        })
      )}
    </NavPanel>
  );
};

export default Tareas;
