import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBuilding, FaSearch, FaUser, FaHandshake } from 'react-icons/fa';

import { crmService } from '../../services/crmService';

/**
 * Búsqueda global (Ctrl+K / ⌘K).
 *
 * Un solo lugar para encontrar una propiedad por título o dirección, un cliente
 * por nombre, mail o teléfono, o una operación. Navegable con flechas y Enter.
 */

const GRUPOS = [
  { clave: 'propiedades', label: 'Propiedades', icono: <FaBuilding />, ruta: (id) => `/propiedades?id=${id}` },
  { clave: 'clientes', label: 'Clientes', icono: <FaUser />, ruta: (id) => `/clientes?id=${id}` },
  { clave: 'operaciones', label: 'Operaciones', icono: <FaHandshake />, ruta: (id) => `/operaciones?id=${id}` },
];

const DEBOUNCE_MS = 250;

const GlobalSearch = ({ abierto, onClose, currentColor }) => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [indice, setIndice] = useState(0);

  // Lista plana para poder moverse con las flechas entre grupos.
  const items = useMemo(() => {
    if (!resultados) return [];
    return GRUPOS.flatMap((g) => (resultados[g.clave] || []).map((r) => ({ ...r, grupo: g })));
  }, [resultados]);

  useEffect(() => {
    if (!abierto) return;
    setQ('');
    setResultados(null);
    setIndice(0);
    // El foco tiene que esperar a que el modal esté en el DOM.
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    // eslint-disable-next-line consistent-return
    return () => clearTimeout(t);
  }, [abierto]);

  useEffect(() => {
    if (!abierto) return undefined;
    const termino = q.trim();
    if (termino.length < 2) {
      setResultados(null);
      setBuscando(false);
      return undefined;
    }
    setBuscando(true);
    const t = setTimeout(async () => {
      try {
        const data = await crmService.search(termino);
        setResultados(data);
        setIndice(0);
      } catch {
        setResultados({ propiedades: [], clientes: [], operaciones: [] });
      } finally {
        setBuscando(false);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q, abierto]);

  const abrir = useCallback((item) => {
    if (!item) return;
    onClose();
    navigate(item.grupo.ruta(item.id));
  }, [navigate, onClose]);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndice((i) => Math.min(i + 1, Math.max(items.length - 1, 0)));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndice((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      abrir(items[indice]);
    }
  };

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center pt-[12vh] px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Búsqueda global"
        className="w-full max-w-xl bg-white dark:bg-[#42464D] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b dark:border-gray-600">
          <FaSearch className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Buscar propiedades, clientes u operaciones…"
            aria-label="Buscar"
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
          />
          <kbd className="hidden sm:block text-[10px] font-sans text-gray-400 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">
            Esc
          </kbd>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {q.trim().length < 2 && (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Escribí al menos 2 letras para buscar.
            </p>
          )}

          {q.trim().length >= 2 && buscando && (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">Buscando…</p>
          )}

          {q.trim().length >= 2 && !buscando && items.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Sin resultados para «{q.trim()}».
            </p>
          )}

          {!buscando && GRUPOS.map((g) => {
            const lista = resultados?.[g.clave] || [];
            if (!lista.length) return null;
            return (
              <div key={g.clave} className="py-1">
                <p className="px-4 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  {g.label}
                </p>
                {lista.map((r) => {
                  // La posición en la lista plana es la que sigue el teclado.
                  const posicion = items.findIndex((i) => i.grupo.clave === g.clave && i.id === r.id);
                  const activo = posicion === indice;
                  return (
                    <button
                      key={`${g.clave}-${r.id}`}
                      type="button"
                      onMouseEnter={() => setIndice(posicion)}
                      onClick={() => abrir({ ...r, grupo: g })}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        activo ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-700/60'
                      }`}
                    >
                      <span className="text-gray-400 flex-shrink-0" style={activo ? { color: currentColor } : {}}>
                        {g.icono}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                          {r.titulo}
                        </span>
                        {r.subtitulo && (
                          <span className="block text-xs text-gray-500 dark:text-gray-400 truncate">
                            {r.subtitulo}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
