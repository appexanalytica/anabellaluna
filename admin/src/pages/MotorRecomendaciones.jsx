import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaMagic, FaSyncAlt, FaExclamationTriangle, FaBullseye, FaHome, FaClock } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
import matchingService from '../services/matchingService';

/**
 * Radar del motor de recomendaciones.
 *
 * No muestra matches sueltos: muestra lo que el cruce dice sobre el negocio.
 * Si la cobertura es baja, el problema es la captación, no el motor.
 */
const card = 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6';

const MotorRecomendaciones = () => {
  const { currentColor } = useStateContext();

  const [cobertura, setCobertura] = useState(null);
  const [demanda, setDemanda] = useState(null);
  const [huerfanas, setHuerfanas] = useState(null);
  const [oportunidades, setOportunidades] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reprocesando, setReprocesando] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    const [c, d, h, o] = await Promise.allSettled([
      matchingService.cobertura(),
      matchingService.demandaInsatisfecha({ limit: 12 }),
      matchingService.propiedadesHuerfanas({ limit: 12 }),
      matchingService.oportunidades({ limit: 12 }),
    ]);
    if (c.status === 'fulfilled') setCobertura(c.value);
    if (d.status === 'fulfilled') setDemanda(d.value);
    if (h.status === 'fulfilled') setHuerfanas(h.value);
    if (o.status === 'fulfilled') setOportunidades(o.value);

    const fallo = [c, d, h, o].find((r) => r.status === 'rejected');
    if (fallo) toast.error(fallo.reason?.message || 'No se pudo cargar el radar');
    setLoading(false);
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const reprocesar = async () => {
    setReprocesando(true);
    try {
      await matchingService.reprocesar({ limit: 1000 });
      toast.success('Reproceso iniciado. Puede tardar unos minutos.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReprocesando(false);
    }
  };

  const colorCobertura = (pct) => {
    if (pct >= 70) return '#2C6349';
    if (pct >= 40) return '#B45309';
    return '#B91C1C';
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight dark:text-gray-100 flex items-center gap-3">
            <FaMagic style={{ color: currentColor }} /> Motor de recomendaciones
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Qué dice el cruce entre lo que tenemos y lo que nos piden.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={cargar}
            disabled={loading}
            className="px-4 py-2 rounded-lg border dark:border-gray-600 dark:text-gray-200 flex items-center gap-2 disabled:opacity-50"
          >
            <FaSyncAlt className={loading ? 'animate-spin' : ''} /> Actualizar
          </button>
          <button
            type="button"
            onClick={reprocesar}
            disabled={reprocesando}
            className="px-4 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
            style={{ background: currentColor }}
          >
            {reprocesando ? 'Iniciando...' : 'Reprocesar perfiles'}
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500 dark:text-gray-400">Calculando el cruce completo...</p>}

      {!loading && (
        <div className="space-y-6">
          {/* Cobertura */}
          {cobertura && (
            <div className={card}>
              <h2 className="text-xl font-bold mb-1 dark:text-gray-100 flex items-center gap-2">
                <FaBullseye className="text-blue-500" /> Cobertura de cartera
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Qué parte de los clientes tiene al menos una propiedad para mostrarle.
                Si es baja, el problema es la captación, no el motor.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-4xl font-bold" style={{ color: colorCobertura(cobertura.coberturaPorcentaje) }}>
                    {cobertura.coberturaPorcentaje}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">de los clientes con match</p>
                </div>
                <div>
                  <p className="text-4xl font-bold dark:text-gray-100">{cobertura.clientesConMatch}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">de {cobertura.totalClientes} clientes</p>
                </div>
                <div>
                  <p className="text-4xl font-bold dark:text-gray-100">{cobertura.totalPropiedades}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">propiedades disponibles</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-amber-600">{cobertura.clientesSinNadaQueMostrar}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">sin nada que mostrarles</p>
                </div>
              </div>

              {!cobertura.cotizacion?.configurada && (
                <p className="text-sm p-3 rounded-lg bg-amber-50 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                  Sin cotización del dólar cargada, las propiedades en pesos no se comparan con
                  presupuestos en dólares. El número real de cobertura puede ser más alto.
                </p>
              )}

              {cobertura.porAgente?.length > 0 && (
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                        <th className="py-2">Agente</th>
                        <th className="py-2 text-right">Clientes</th>
                        <th className="py-2 text-right">Con match</th>
                        <th className="py-2 text-right">Cobertura</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cobertura.porAgente.map((a) => (
                        <tr key={a.agenteId} className="border-b dark:border-gray-700 dark:text-gray-200">
                          <td className="py-2 font-mono text-xs">{a.agenteId === 'sin_asignar' ? 'Sin asignar' : a.agenteId}</td>
                          <td className="py-2 text-right tabular-nums">{a.clientes}</td>
                          <td className="py-2 text-right tabular-nums">{a.conMatch}</td>
                          <td className="py-2 text-right tabular-nums font-semibold" style={{ color: colorCobertura(a.coberturaPorcentaje) }}>
                            {a.coberturaPorcentaje}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Oportunidades sin acción */}
          {oportunidades?.oportunidades?.length > 0 && (
            <div className={card}>
              <h2 className="text-xl font-bold mb-1 dark:text-gray-100 flex items-center gap-2">
                <FaClock className="text-red-500" /> Matches fuertes sin accionar
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                El sistema los mostró hace más de {oportunidades.horas} horas y nadie los movió.
              </p>
              <div className="space-y-2">
                {oportunidades.oportunidades.map((o) => (
                  <div key={o.id} className="flex items-start gap-3 p-3 rounded-lg border dark:border-gray-700">
                    <span className="text-lg font-bold text-red-600 tabular-nums w-10 shrink-0">{o.score}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold dark:text-gray-100">{o.titulo || `${o.propiedad.titulo} para ${o.cliente.nombre}`}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {o.cliente.nombre} · {o.propiedad.titulo} · {o.diasSinAccion} días sin acción
                        {o.cruzado && ' · match cruzado entre agentes'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demanda insatisfecha */}
          {demanda && (
            <div className={card}>
              <h2 className="text-xl font-bold mb-1 dark:text-gray-100 flex items-center gap-2">
                <FaHome className="text-green-600" /> Demanda insatisfecha
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Lo que nos están pidiendo y no tenemos. {demanda.clientesSinMatch} de {demanda.totalClientes} clientes
                sin ninguna propiedad para mostrarles. Esta es la guía de captación.
              </p>

              {demanda.grupos?.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                        <th className="py-2">Operación</th>
                        <th className="py-2">Zona</th>
                        <th className="py-2">Tipo</th>
                        <th className="py-2">Rango</th>
                        <th className="py-2 text-right">Clientes</th>
                        <th className="py-2">Quiénes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {demanda.grupos.map((g, i) => (
                        <tr key={i} className="border-b dark:border-gray-700 dark:text-gray-200">
                          <td className="py-2 capitalize">{g.operacion}</td>
                          <td className="py-2">{g.zona}</td>
                          <td className="py-2 capitalize">{g.tipo}</td>
                          <td className="py-2 whitespace-nowrap">{g.banda}</td>
                          <td className="py-2 text-right font-bold tabular-nums">{g.clientes}</td>
                          <td className="py-2 text-xs text-gray-500 dark:text-gray-400">{(g.nombres || []).join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Todos los clientes tienen algo para ver. Buena señal.</p>
              )}
            </div>
          )}

          {/* Propiedades huérfanas */}
          {huerfanas && (
            <div className={card}>
              <h2 className="text-xl font-bold mb-1 dark:text-gray-100 flex items-center gap-2">
                <FaExclamationTriangle className="text-amber-500" /> Propiedades sin ningún match
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Publicadas hace más de {huerfanas.dias} días y no le sirven a nadie de la cartera.
                Revisar precio, datos o fotos. Total: {huerfanas.total}.
              </p>

              {huerfanas.propiedades?.length ? (
                <div className="space-y-2">
                  {huerfanas.propiedades.map((p) => (
                    <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg border dark:border-gray-700">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold dark:text-gray-100">{p.titulo}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {[p.tipo, p.barrio, p.precio ? `${p.moneda} ${Number(p.precio).toLocaleString('es-AR')}` : 'sin precio']
                            .filter(Boolean).join(' · ')}
                          {p.diasPublicada !== null ? ` · ${p.diasPublicada} días publicada` : ''}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">{(p.motivos || []).join(' · ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">Toda la cartera le sirve a alguien.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MotorRecomendaciones;
