import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MdClose, MdAutoAwesome } from 'react-icons/md';
import { useStateContext } from '../contexts/ContextProvider';
import { APP_VERSION, APP_BUILD_DATE } from '../config/appVersion';
import { CHANGELOG_ENTRIES } from '../config/changelog';

const TYPE_STYLES = {
  nuevo: { label: 'Nuevo', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  mejora: { label: 'Mejora', className: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  arreglo: { label: 'Arreglo', className: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const formatEntryDate = (isoDate) => {
  const date = new Date(`${isoDate}T00:00:00`);
  return capitalize(date.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' }));
};

const formatBuildDate = (isoDateTime) => {
  const date = new Date(isoDateTime);
  const day = date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
  const time = date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} · ${time} hs`;
};

const ChangelogPanel = ({ onClose }) => {
  const { currentColor } = useStateContext();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="fixed z-[100] bottom-4 left-4 right-4 sm:right-auto sm:w-[400px] max-h-[78vh] flex flex-col rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-gray-800">
          <span
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white text-xl flex-shrink-0"
            style={{ backgroundColor: currentColor }}
          >
            <MdAutoAwesome />
          </span>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-lg leading-tight">Novedades</h2>
            <p className="text-gray-400 text-xs mt-1">
              {`Versión ${APP_VERSION} · Actualizado el ${formatBuildDate(APP_BUILD_DATE)}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full p-2 transition-colors text-xl flex-shrink-0"
            aria-label="Cerrar novedades"
          >
            <MdClose />
          </button>
        </div>

        {/* Lista de cambios */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {CHANGELOG_ENTRIES.map((entry) => (
            <div key={`${entry.date}-${entry.title}`} className="relative pl-4 border-l border-gray-800">
              <span
                className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: currentColor }}
              />
              <p className="text-gray-500 text-[11px] uppercase tracking-wider font-semibold">
                {formatEntryDate(entry.date)}
              </p>
              <h3 className="text-white font-semibold text-sm mt-1">{entry.title}</h3>
              <ul className="mt-2 space-y-2">
                {entry.items.map((item) => {
                  const style = TYPE_STYLES[item.type] || TYPE_STYLES.mejora;
                  return (
                    <li key={item.text} className="flex items-start gap-2">
                      <span className={`mt-0.5 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide flex-shrink-0 ${style.className}`}>
                        {style.label}
                      </span>
                      <p className="text-gray-300 text-sm leading-snug">{item.text}</p>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {CHANGELOG_ENTRIES.length === 0 && (
            <p className="text-gray-500 text-sm text-center py-6">
              Todavía no hay novedades registradas.
            </p>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
};

export default ChangelogPanel;
