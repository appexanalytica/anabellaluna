import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaRegClock } from 'react-icons/fa';

/**
 * Chip con la próxima cita del agente.
 *
 * Para alguien que trabaja en la calle vale más que cualquier badge: qué sigue
 * y a qué hora, sin abrir nada. Sale del mismo resumen de la navbar.
 */

/** "15:30" si es hoy, "Mañana 10:00" o "12 sep 10:00" si no. */
const formatCuando = (fecha) => {
  const d = new Date(fecha);
  const ahora = new Date();
  const hoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
  const dia = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const hora = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  if (dia.getTime() === hoy.getTime()) return hora;
  if (dia.getTime() === hoy.getTime() + 86400000) return `Mañana ${hora}`;
  return `${d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })} ${hora}`;
};

/** Minutos que faltan, para avisar cuando ya es inminente. */
const minutosRestantes = (fecha) => Math.round((new Date(fecha) - Date.now()) / 60000);

const ProximaCita = ({ cita, currentColor }) => {
  const navigate = useNavigate();
  if (!cita) return null;

  const restantes = minutosRestantes(cita.fecha);
  const inminente = restantes >= 0 && restantes <= 60;

  return (
    <button
      type="button"
      onClick={() => navigate('/crm/citas')}
      aria-label={`Próxima cita: ${cita.titulo} a las ${formatCuando(cita.fecha)}`}
      className={`hidden md:flex items-center gap-2 max-w-[16rem] px-3 py-1.5 rounded-xl border transition-colors ${
        inminente
          ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700'
          : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <FaRegClock
        className="flex-shrink-0"
        style={{ color: inminente ? '#F59E0B' : currentColor }}
      />
      <span className="min-w-0 text-left">
        <span className="block text-[11px] font-bold leading-tight text-gray-800 dark:text-gray-100">
          {formatCuando(cita.fecha)}
          {inminente && restantes > 0 && (
            <span className="ml-1 font-semibold text-amber-600 dark:text-amber-400">
              · en {restantes} min
            </span>
          )}
        </span>
        <span className="block text-[11px] text-gray-500 dark:text-gray-400 truncate">
          {cita.ubicacion ? (
            <>
              <FaMapMarkerAlt className="inline mr-1" />
              {cita.titulo} · {cita.ubicacion}
            </>
          ) : cita.titulo}
        </span>
      </span>
    </button>
  );
};

export default ProximaCita;
