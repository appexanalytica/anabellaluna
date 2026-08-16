import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBell, FaBirthdayCake, FaBuilding, FaCalendarAlt, FaChartLine, FaCheckCircle, FaCheckDouble,
  FaClipboardList, FaClock, FaDollarSign, FaExclamationTriangle, FaFileAlt, FaHandshake,
  FaInfoCircle, FaStar, FaTimesCircle, FaUserPlus,
} from 'react-icons/fa';

import NavPanel from './navbar/NavPanel';
import { useStateContext } from '../contexts/ContextProvider';
import notificationService from '../services/notificationService';

/**
 * Centro de alertas.
 *
 * Antes este panel marcaba todo como leído apenas se abría: nunca se veía cuál
 * era nueva, el contador quedaba clavado en 0 y "marcar todas" salía siempre
 * deshabilitado. Ahora se marca al abrir cada alerta o con el botón explícito,
 * y el badge de la navbar sólo baja cuando el servidor confirma.
 */

const ESTILOS = {
  bienvenida: { icon: <FaUserPlus />, fondo: 'bg-green-50 dark:bg-green-900/20', borde: 'border-green-500', texto: 'text-green-600 dark:text-green-400' },
  seguimiento_contacto: { icon: <FaClock />, fondo: 'bg-blue-50 dark:bg-blue-900/20', borde: 'border-blue-500', texto: 'text-blue-600 dark:text-blue-400' },
  cumpleanos: { icon: <FaBirthdayCake />, fondo: 'bg-pink-50 dark:bg-pink-900/20', borde: 'border-pink-500', texto: 'text-pink-600 dark:text-pink-400' },
  cumpleanos_contacto: { icon: <FaBirthdayCake />, fondo: 'bg-pink-50 dark:bg-pink-900/20', borde: 'border-pink-500', texto: 'text-pink-600 dark:text-pink-400' },
  seguimiento_propuesta: { icon: <FaFileAlt />, fondo: 'bg-purple-50 dark:bg-purple-900/20', borde: 'border-purple-500', texto: 'text-purple-600 dark:text-purple-400' },
  renovacion: { icon: <FaHandshake />, fondo: 'bg-orange-50 dark:bg-orange-900/20', borde: 'border-orange-500', texto: 'text-orange-600 dark:text-orange-400' },
  evento_especial: { icon: <FaStar />, fondo: 'bg-yellow-50 dark:bg-yellow-900/20', borde: 'border-yellow-500', texto: 'text-yellow-600 dark:text-yellow-400' },
  feedback: { icon: <FaCheckCircle />, fondo: 'bg-teal-50 dark:bg-teal-900/20', borde: 'border-teal-500', texto: 'text-teal-600 dark:text-teal-400' },
  inactividad: { icon: <FaExclamationTriangle />, fondo: 'bg-red-50 dark:bg-red-900/20', borde: 'border-red-500', texto: 'text-red-600 dark:text-red-400' },
  objetivo: { icon: <FaCalendarAlt />, fondo: 'bg-indigo-50 dark:bg-indigo-900/20', borde: 'border-indigo-500', texto: 'text-indigo-600 dark:text-indigo-400' },
  vencimiento_documento: { icon: <FaTimesCircle />, fondo: 'bg-orange-50 dark:bg-orange-900/20', borde: 'border-orange-500', texto: 'text-orange-600 dark:text-orange-400' },
  hito: { icon: <FaStar />, fondo: 'bg-amber-50 dark:bg-amber-900/20', borde: 'border-amber-500', texto: 'text-amber-600 dark:text-amber-400' },
  fecha_importante: { icon: <FaCalendarAlt />, fondo: 'bg-violet-50 dark:bg-violet-900/20', borde: 'border-violet-500', texto: 'text-violet-600 dark:text-violet-400' },
  sistema: { icon: <FaInfoCircle />, fondo: 'bg-gray-50 dark:bg-gray-900/20', borde: 'border-gray-500', texto: 'text-gray-600 dark:text-gray-400' },
  operacion_nueva: { icon: <FaDollarSign />, fondo: 'bg-green-50 dark:bg-green-900/20', borde: 'border-green-500', texto: 'text-green-600 dark:text-green-400' },
  agente_rendimiento: { icon: <FaChartLine />, fondo: 'bg-indigo-50 dark:bg-indigo-900/20', borde: 'border-indigo-500', texto: 'text-indigo-600 dark:text-indigo-400' },
  contrato_vencimiento: { icon: <FaTimesCircle />, fondo: 'bg-orange-50 dark:bg-orange-900/20', borde: 'border-orange-500', texto: 'text-orange-600 dark:text-orange-400' },
  propiedad_estado: { icon: <FaBuilding />, fondo: 'bg-emerald-50 dark:bg-emerald-900/20', borde: 'border-emerald-500', texto: 'text-emerald-600 dark:text-emerald-400' },
  meta_cumplida: { icon: <FaCheckCircle />, fondo: 'bg-green-50 dark:bg-green-900/20', borde: 'border-green-500', texto: 'text-green-600 dark:text-green-400' },
  reporte_diario: { icon: <FaClipboardList />, fondo: 'bg-slate-50 dark:bg-slate-900/20', borde: 'border-slate-500', texto: 'text-slate-600 dark:text-slate-400' },
};

const estiloDe = (tipo, prioridad) => {
  const base = ESTILOS[tipo] || ESTILOS.sistema;
  if (prioridad === 'urgente') {
    return { ...base, fondo: 'bg-red-50 dark:bg-red-900/20', borde: 'border-red-500', texto: 'text-red-600 dark:text-red-400' };
  }
  return base;
};

const formatTiempo = (fecha) => {
  if (!fecha) return '';
  const d = new Date(fecha);
  const mins = Math.floor((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Ahora';
  if (mins < 60) return `Hace ${mins} min`;
  const horas = Math.floor(mins / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.floor(horas / 24);
  if (dias === 1) return 'Ayer';
  if (dias < 7) return `Hace ${dias} días`;
  return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

const Alertas = ({ onClose, onUnreadChange }) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  const noLeidas = alertas.filter((a) => !a.leida).length;

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const respuesta = await notificationService.getNotifications({ limite: 20 });
      setAlertas(respuesta?.items || []);
    } catch (err) {
      console.error('Error cargando alertas:', err);
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const marcarUna = async (alerta) => {
    if (alerta.leida) return;
    try {
      await notificationService.markAsRead(alerta._id);
      setAlertas((prev) => {
        const siguiente = prev.map((a) => (a._id === alerta._id ? { ...a, leida: true } : a));
        if (onUnreadChange) onUnreadChange(siguiente.filter((a) => !a.leida).length);
        return siguiente;
      });
    } catch (err) {
      console.error('Error marcando la alerta como leída:', err);
    }
  };

  const marcarTodas = async () => {
    try {
      await notificationService.markAllAsRead();
      setAlertas((prev) => prev.map((a) => ({ ...a, leida: true })));
      if (onUnreadChange) onUnreadChange(0);
    } catch (err) {
      console.error('Error marcando todas como leídas:', err);
    }
  };

  const abrirAlerta = (alerta) => {
    marcarUna(alerta);
    if (!alerta.accionUrl) return;
    onClose();
    navigate(alerta.accionUrl);
  };

  return (
    <NavPanel
      titulo="Alertas"
      subtitulo={noLeidas > 0 ? `${noLeidas} sin leer` : 'Todo al día'}
      icono={(
        <div className="relative flex-shrink-0">
          <FaBell className="text-2xl" style={{ color: currentColor }} />
          {noLeidas > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">
              {noLeidas > 99 ? '99+' : noLeidas}
            </span>
          )}
        </div>
      )}
      onClose={onClose}
      acciones={noLeidas > 0 ? (
        <button
          type="button"
          onClick={marcarTodas}
          title="Marcar todas como leídas"
          aria-label="Marcar todas como leídas"
          className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FaCheckDouble />
        </button>
      ) : null}
      footer={(
        <button
          type="button"
          className="w-full py-2 rounded-lg font-medium transition-colors border"
          style={{ borderColor: currentColor, color: currentColor }}
          onClick={() => { onClose(); navigate('/automatizacion'); }}
        >
          Configurar automatizaciones →
        </button>
      )}
    >
      {loading && alertas.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: currentColor }} />
        </div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-10">
          <FaBell className="text-4xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No hay alertas</p>
          <p className="text-xs text-gray-400 mt-1">
            Acá aparecen operaciones nuevas, contratos por vencer y cambios de estado
          </p>
        </div>
      ) : (
        alertas.map((alerta) => {
          const estilo = estiloDe(alerta.tipo, alerta.prioridad);
          return (
            <button
              key={alerta._id}
              type="button"
              onClick={() => abrirAlerta(alerta)}
              className={`w-full text-left ${estilo.fondo} border-l-4 ${estilo.borde} p-3 rounded-lg hover:shadow-md transition-all ${alerta.leida ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-lg flex-shrink-0 mt-0.5 ${estilo.texto}`}>{estilo.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <h4 className={`text-sm dark:text-gray-200 ${alerta.leida ? 'font-medium' : 'font-bold'}`}>
                      {alerta.titulo}
                    </h4>
                    {!alerta.leida && (
                      <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">{alerta.mensaje}</p>
                  <span className="text-[11px] text-gray-500 dark:text-gray-400">
                    {formatTiempo(alerta.createdAt)}
                  </span>
                </div>
              </div>
            </button>
          );
        })
      )}
    </NavPanel>
  );
};

export default Alertas;
