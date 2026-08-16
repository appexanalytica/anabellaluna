import React, { useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';

/**
 * Contenedor común de los desplegables de la navbar.
 *
 * Unifica el posicionamiento (antes había dos patrones distintos: uno que se
 * desbordaba en mobile y otro responsive) y agrega lo que faltaba en todos:
 * rol de diálogo, cierre con Escape y botón de cerrar visible.
 */
const NavPanel = ({ titulo, subtitulo, icono, acciones, onClose, children, footer }) => {
  const ref = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="false"
      aria-label={titulo}
      className="nav-item fixed inset-x-3 top-20 mx-auto md:absolute md:inset-x-auto md:right-6 md:top-16 md:mx-0 bg-white dark:bg-[#42464D] rounded-2xl w-auto max-w-md md:w-96 shadow-2xl border border-gray-100 dark:border-gray-700 z-50 flex flex-col max-h-[75vh]"
    >
      <div className="flex items-start justify-between gap-3 p-5 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          {icono}
          <div className="min-w-0">
            <p className="font-semibold text-lg dark:text-gray-200 leading-tight">{titulo}</p>
            {subtitulo && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{subtitulo}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {acciones}
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <MdClose />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-2 space-y-2">{children}</div>

      {footer && (
        <div className="px-5 py-3 border-t dark:border-gray-600">{footer}</div>
      )}
    </div>
  );
};

export default NavPanel;
