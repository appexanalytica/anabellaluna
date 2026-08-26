import React, { useEffect } from 'react';
import { MdOutlineCancel, MdCheck } from 'react-icons/md';

import { themeColors } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

/**
 * Panel de apariencia.
 *
 * La apariencia se arma con dos ejes: el modo (claro/oscuro) que consume
 * Tailwind y la piel visual: `classic` es el diseño de siempre y `luminous` el
 * oscuro de acento cian → magenta. Acá se presentan combinados como temas
 * sueltos, que es como los piensa quien los elige.
 *
 * Luminous existe sólo en oscuro y trae su propio acento fijo, así que al
 * elegirlo el selector de color se apaga.
 */

const TEMAS = [
  {
    id: 'classic-Light',
    nombre: 'Clásico claro',
    detalle: 'El panel de siempre',
    mode: 'Light',
    skin: 'classic',
    muestra: {
      fondo: '#f3f4f6',
      tarjeta: '#ffffff',
      borde: 'rgba(15, 23, 42, 0.08)',
      linea: 'rgba(15, 23, 42, 0.16)',
    },
  },
  {
    id: 'classic-Dark',
    nombre: 'Clásico oscuro',
    detalle: 'Alto contraste',
    mode: 'Dark',
    skin: 'classic',
    muestra: {
      fondo: '#20232A',
      tarjeta: '#33373E',
      borde: 'rgba(255, 255, 255, 0.1)',
      linea: 'rgba(255, 255, 255, 0.28)',
    },
  },
  {
    id: 'luminous-Dark',
    nombre: 'Luminous',
    detalle: 'Negro y cian → magenta',
    mode: 'Dark',
    skin: 'luminous',
    acentoFijo: true,
    muestra: {
      fondo: '#000000',
      tarjeta: '#0e0e12',
      borde: 'rgba(255, 255, 255, 0.08)',
      linea: 'linear-gradient(90deg, #22d3ee, #f472d0)',
    },
  },
];

/** Maqueta en miniatura de cada tema: fondo, una barra y dos bloques. */
const Muestra = ({ muestra }) => (
  <div
    className="h-16 w-full rounded-xl p-2 flex flex-col gap-1.5 overflow-hidden"
    style={{ background: muestra.fondo }}
  >
    <div
      className="h-4 rounded-md"
      style={{ background: muestra.tarjeta, border: `1px solid ${muestra.borde}` }}
    />
    <div className="flex gap-1.5 flex-1">
      <div
        className="flex-1 rounded-md flex items-end p-1"
        style={{ background: muestra.tarjeta, border: `1px solid ${muestra.borde}` }}
      >
        <div className="h-1 w-2/3 rounded-full" style={{ background: muestra.linea }} />
      </div>
      <div
        className="w-5 rounded-md"
        style={{ background: muestra.tarjeta, border: `1px solid ${muestra.borde}` }}
      />
    </div>
  </div>
);

const ThemeSettings = () => {
  const {
    setColor, setTheme, currentMode, currentSkin, currentColor, setThemeSettings,
  } = useStateContext();

  const cerrar = () => setThemeSettings(false);

  useEffect(() => {
    const onKeyDown = (e) => { if (e.key === 'Escape') setThemeSettings(false); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [setThemeSettings]);

  const temaActivo = `${currentSkin}-${currentMode}`;
  const acentoFijo = TEMAS.some((t) => t.skin === currentSkin && t.acentoFijo);

  return (
    <div className="bg-half-transparent w-screen h-screen fixed nav-item top-0 right-0">
      {/* Clic afuera para cerrar */}
      <div className="absolute inset-0" onClick={cerrar} role="presentation" />

      <div className="relative float-right h-screen w-full max-w-sm overflow-y-auto bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Apariencia</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Elegí cómo se ve tu panel</p>
          </div>
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar apariencia"
            className="text-2xl p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MdOutlineCancel />
          </button>
        </div>

        <div className="p-5">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tema</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {TEMAS.map((tema) => {
              const activo = temaActivo === tema.id;
              return (
                <button
                  key={tema.id}
                  type="button"
                  onClick={() => setTheme(tema.mode, tema.skin)}
                  aria-pressed={activo}
                  className={`relative text-left p-2 rounded-2xl border-2 transition-all duration-200 ${
                    activo
                      ? 'shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  style={activo ? { borderColor: currentColor } : undefined}
                >
                  <Muestra muestra={tema.muestra} />
                  <div className="mt-2 px-1 pb-1">
                    <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                      {tema.nombre}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                      {tema.detalle}
                    </p>
                  </div>
                  {activo && (
                    <span
                      className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center text-white shadow"
                      style={{ backgroundColor: currentColor }}
                    >
                      <MdCheck className="text-sm" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-5 pb-6 pt-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Color de acento</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {acentoFijo
              ? 'Luminous trae su propio acento cian → magenta y no se cambia'
              : 'Se aplica a botones, íconos y al ítem activo del menú'}
          </p>
          <div className={`flex flex-wrap gap-3 mt-3 ${acentoFijo ? 'opacity-40 pointer-events-none' : ''}`}>
            {themeColors.map((item) => (
              <button
                key={item.name}
                type="button"
                title={item.name}
                disabled={acentoFijo}
                aria-label={`Color ${item.name}`}
                aria-pressed={item.color === currentColor}
                onClick={() => setColor(item.color)}
                className="h-9 w-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                style={{ backgroundColor: item.color }}
              >
                {item.color === currentColor && <MdCheck className="text-xl text-white" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;
