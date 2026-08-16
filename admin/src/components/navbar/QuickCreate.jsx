import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaCalendarAlt, FaPlus, FaTasks, FaUser } from 'react-icons/fa';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

/**
 * Creación rápida desde cualquier pantalla.
 *
 * Navega a la pantalla correspondiente con `?nuevo=1`, que es la señal que cada
 * página usa para abrir su formulario de alta.
 */
const ACCIONES = [
  { label: 'Propiedad', icono: <FaBuilding />, ruta: '/propiedades?nuevo=1' },
  { label: 'Cliente', icono: <FaUser />, ruta: '/clientes?nuevo=1' },
  { label: 'Cita', icono: <FaCalendarAlt />, ruta: '/citas?nuevo=1' },
  { label: 'Tarea', icono: <FaTasks />, ruta: '/citas?nuevo=tarea' },
];

const QuickCreate = ({ abierto, onToggle, onClose, currentColor }) => {
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    const onClickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickFuera);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickFuera);
    };
  }, [abierto, onClose]);

  return (
    <div className="relative" ref={ref}>
      <TooltipComponent content="Crear nuevo" position="BottomCenter">
        <button
          type="button"
          onClick={onToggle}
          aria-haspopup="menu"
          aria-expanded={abierto}
          aria-label="Crear nuevo"
          className="flex items-center justify-center w-10 h-10 rounded-xl text-white transition-transform hover:scale-105"
          style={{ backgroundColor: currentColor }}
        >
          <FaPlus />
        </button>
      </TooltipComponent>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#42464D] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50"
        >
          {ACCIONES.map((a) => (
            <button
              key={a.label}
              type="button"
              role="menuitem"
              onClick={() => { onClose(); navigate(a.ruta); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-gray-400">{a.icono}</span> {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickCreate;
