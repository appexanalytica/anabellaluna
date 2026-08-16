import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

/**
 * Disparador de la búsqueda global.
 *
 * En pantallas anchas se muestra como un campo de búsqueda (aunque sea un
 * botón: el input real vive en el modal) para que se lea de un vistazo qué es;
 * abajo de `lg` colapsa a un botón circular del mismo alto que el resto de la
 * barra. El acento en hover/foco sale de `currentColor` del tema.
 */

// En Mac el atajo es ⌘K; mostrar "Ctrl" ahí confunde.
const esMac = typeof navigator !== 'undefined'
  && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || '');

const ATAJO = esMac ? '⌘K' : 'Ctrl K';

/** currentColor viene como hex del tema; lo necesitamos con alfa para el halo. */
const conAlfa = (hex, alfa) => {
  const limpio = String(hex || '').replace('#', '');
  if (limpio.length !== 6) return `rgba(100, 116, 139, ${alfa})`;
  const n = parseInt(limpio, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alfa})`;
};

const SearchTrigger = ({ onClick, currentColor }) => {
  const [resaltado, setResaltado] = useState(false);

  const estiloResaltado = resaltado
    ? { borderColor: conAlfa(currentColor, 0.55), boxShadow: `0 0 0 3px ${conAlfa(currentColor, 0.12)}` }
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setResaltado(true)}
      onMouseLeave={() => setResaltado(false)}
      onFocus={() => setResaltado(true)}
      onBlur={() => setResaltado(false)}
      title={`Buscar (${ATAJO})`}
      aria-label="Buscar"
      aria-keyshortcuts="Control+K Meta+K"
      className="flex items-center justify-center lg:justify-start gap-2.5 h-10 w-10 lg:w-64 lg:pl-3.5 lg:pr-1.5 rounded-full outline-none border border-gray-200/90 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm transition-all duration-200 hover:bg-white dark:hover:bg-gray-800 active:scale-[0.98]"
      style={estiloResaltado}
    >
      <FaSearch
        className="text-[13px] text-gray-400 dark:text-gray-500 transition-colors flex-shrink-0"
        style={resaltado ? { color: currentColor } : undefined}
      />
      <span className="hidden lg:block flex-1 text-left text-sm text-gray-400 dark:text-gray-500 truncate">
        Buscar…
      </span>
      <kbd className="hidden lg:block text-[10px] font-sans font-medium tracking-wide text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-700 rounded-md px-1.5 py-1 leading-none">
        {ATAJO}
      </kbd>
    </button>
  );
};

export default SearchTrigger;
