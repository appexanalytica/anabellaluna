import React, { useState, useEffect, useCallback } from 'react';
import { FaMagic, FaSyncAlt } from 'react-icons/fa';
import matchingService from '../../services/matchingService';
import MatchCard from './MatchCard';

/**
 * Panel de sugerencias del motor de recomendaciones.
 *
 * Sirve para las dos direcciones:
 *   tipo="cliente"    → qué propiedades mostrarle a este cliente
 *   tipo="propiedad"  → a qué clientes les sirve esta captación
 */
const MatchPanel = ({ tipo, entityId, limit = 8, onAbrir }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const esCliente = tipo === 'cliente';

  const cargar = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    setError('');
    try {
      const res = esCliente
        ? await matchingService.propiedadesParaCliente(entityId, { limit })
        : await matchingService.clientesParaPropiedad(entityId, { limit });
      setData(res);
    } catch (err) {
      setError(err.message || 'No se pudieron cargar las sugerencias');
    } finally {
      setLoading(false);
    }
  }, [entityId, esCliente, limit]);

  useEffect(() => { cargar(); }, [cargar]);

  const handleFeedback = async (recId, status, motivo) => {
    await matchingService.feedback(recId, status, motivo);
    if (status === 'descartado') {
      // Se saca de la lista al toque: ya no se va a volver a sugerir.
      setData((prev) => prev && ({
        ...prev,
        matches: prev.matches.filter((m) => m.recomendacion?.id !== recId),
      }));
    }
  };

  const titulo = esCliente ? 'Propiedades sugeridas' : 'Clientes para esta propiedad';
  const matches = data?.matches || [];
  const perfil = data?.perfil;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold dark:text-gray-100 flex items-center gap-2">
          <FaMagic className="text-purple-500" /> {titulo}
        </h3>
        <button
          type="button"
          onClick={cargar}
          disabled={loading}
          className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 hover:underline disabled:opacity-50"
        >
          <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {/* Avisos que cambian la lectura del resultado */}
      {data && !data.cotizacion?.configurada && (
        <div className="mb-4 text-sm p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          No hay cotización del dólar cargada: solo se comparan propiedades en la misma moneda
          que el presupuesto. Se carga en Configuración AI.
        </div>
      )}
      {data?.cotizacion?.vencida && (
        <div className="mb-4 text-sm p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          La cotización del dólar está desactualizada. Los precios convertidos pueden no reflejar el mercado.
        </div>
      )}
      {perfil?.faltantes?.length > 0 && (
        <div className="mb-4 text-sm p-3 rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
          <strong>Esta propiedad es difícil de matchear:</strong> {perfil.faltantes.join(', ')}.
          Completar esos datos la hace visible para el motor.
        </div>
      )}

      {loading && (
        <p className="text-gray-500 dark:text-gray-400 py-6 text-center">Buscando coincidencias...</p>
      )}

      {!loading && error && (
        <p className="text-red-500 py-6 text-center">{error}</p>
      )}

      {!loading && !error && matches.length === 0 && (
        <div className="py-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            {esCliente
              ? 'No hay propiedades en cartera que le sirvan a este cliente.'
              : 'Ningún cliente de la cartera está buscando algo así.'}
          </p>
          {esCliente && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Es información útil: eso es demanda que hoy no podemos cubrir.
            </p>
          )}
        </div>
      )}

      {!loading && matches.length > 0 && (
        <>
          <div className="space-y-3">
            {matches.map((m, i) => (
              <MatchCard
                key={m.recomendacion?.id || `${m.propiedad?.id}-${m.cliente?.id}-${i}`}
                match={m}
                direccion={esCliente ? 'cliente_a_propiedad' : 'propiedad_a_cliente'}
                onFeedback={handleFeedback}
                onAbrir={onAbrir}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
            {esCliente
              ? `${data.evaluadas} propiedades evaluadas`
              : `${data.evaluados} clientes evaluados`}
            {data?.cotizacion?.valor ? ` · dólar a $${data.cotizacion.valor}` : ''}
          </p>
        </>
      )}
    </div>
  );
};

export default MatchPanel;
