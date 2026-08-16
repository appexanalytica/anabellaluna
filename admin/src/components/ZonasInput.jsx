import React, { useState } from 'react';

/**
 * Zonas de interés — selección múltiple por chips.
 *
 * Los clientes reales miran dos o tres zonas, no una. La primera es la
 * principal: el motor de recomendaciones le da un plus a esa.
 *
 * Se escribe una zona y se agrega con Enter o con coma. Pegar una lista
 * separada por comas también funciona.
 */
const ZonasInput = ({ zonas = [], onChange, placeholder = 'Palermo, Belgrano, Recoleta' }) => {
  const [draft, setDraft] = useState('');

  const lista = Array.isArray(zonas) ? zonas : [];

  const agregar = (raw) => {
    const nuevas = String(raw || '')
      .split(',')
      .map((z) => z.trim())
      .filter(Boolean);

    if (!nuevas.length) return;

    const yaEstan = new Set(lista.map((z) => z.toLowerCase()));
    const merged = [...lista];
    for (const z of nuevas) {
      if (!yaEstan.has(z.toLowerCase())) {
        merged.push(z);
        yaEstan.add(z.toLowerCase());
      }
    }

    onChange(merged);
    setDraft('');
  };

  const quitar = (index) => {
    onChange(lista.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      agregar(draft);
      return;
    }
    if (e.key === 'Backspace' && !draft && lista.length) {
      quitar(lista.length - 1);
    }
  };

  return (
    <div>
      {lista.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {lista.map((zona, index) => (
            <span
              key={`${zona}-${index}`}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                index === 0
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
              }`}
              title={index === 0 ? 'Zona principal' : 'Zona alternativa'}
            >
              {zona}
              <button
                type="button"
                onClick={() => quitar(index)}
                className="ml-1 font-bold opacity-60 hover:opacity-100"
                aria-label={`Quitar ${zona}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => agregar(draft)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
      />
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Enter o coma para agregar cada zona. La primera es la principal.
      </p>
    </div>
  );
};

export default ZonasInput;
