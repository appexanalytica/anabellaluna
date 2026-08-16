import React, { useState } from 'react';
import { FaWhatsapp, FaCalendarPlus, FaTimes, FaExternalLinkAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const BANDAS = {
  fuerte:      { label: 'Match fuerte', color: '#2C6349', bg: 'rgba(44,99,73,0.10)' },
  buena:       { label: 'Buena opción', color: '#35637F', bg: 'rgba(53,99,127,0.10)' },
  alternativa: { label: 'Alternativa',  color: '#6B736D', bg: 'rgba(107,115,109,0.10)' },
};

const NOMBRE_DIM = {
  precio: 'Precio',
  ubicacion: 'Zona',
  tipologia: 'Tipología',
  superficie: 'Superficie',
  semantico: 'Perfil',
  senales: 'Comportamiento',
  rentabilidad: 'Rentabilidad',
  costoTotal: 'Costo total',
};

const money = (valor, moneda) => {
  if (!valor) return 'Sin precio';
  return `${moneda || 'USD'} ${Number(valor).toLocaleString('es-AR')}`;
};

/**
 * Una recomendación: el puntaje, por qué encaja, qué no cumple y qué hacer.
 *
 * Las objeciones se muestran siempre. Un panel que solo dice cosas lindas es
 * un folleto; uno que avisa "no tiene cochera" es un colega.
 */
const MatchCard = ({ match, direccion = 'cliente_a_propiedad', onFeedback, onAbrir }) => {
  const [abierto, setAbierto] = useState(false);
  const [ocupado, setOcupado] = useState(false);

  const rec = match.recomendacion;
  const banda = BANDAS[match.bucket] || BANDAS.alternativa;
  const esParaCliente = direccion === 'cliente_a_propiedad';
  const foco = esParaCliente ? match.propiedad : match.cliente;

  const cruzado = !!(match.propiedad?.agenteId && match.cliente?.agenteId
    && match.propiedad.agenteId !== match.cliente.agenteId);

  const accion = async (status, motivo) => {
    if (!rec?.id || !onFeedback) return;
    setOcupado(true);
    try {
      await onFeedback(rec.id, status, motivo);
    } finally {
      setOcupado(false);
    }
  };

  const copiarWhatsapp = async () => {
    if (!rec?.mensajeWhatsapp) return;
    try {
      await navigator.clipboard.writeText(rec.mensajeWhatsapp);
    } catch { /* si el navegador lo bloquea, el texto igual está a la vista */ }
    accion('sent');
  };

  const descartar = () => {
    const motivo = window.prompt('¿Por qué la descartás? Sirve para no volver a sugerirla.');
    if (motivo === null) return;
    accion('descartado', motivo);
  };

  const dims = Object.entries(match.breakdown || {}).filter(([, d]) => d.aplica);

  return (
    <div className="border dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900">
      <div className="flex items-start gap-4">
        {/* Puntaje */}
        <div
          className="flex flex-col items-center justify-center rounded-lg px-3 py-2 shrink-0"
          style={{ background: banda.bg, minWidth: 68 }}
        >
          <span className="text-2xl font-bold leading-none" style={{ color: banda.color }}>
            {match.score}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide mt-1" style={{ color: banda.color }}>
            {banda.label}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold dark:text-gray-100 leading-snug">
            {rec?.titulo || (esParaCliente ? foco.titulo : foco.nombre)}
          </h4>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {esParaCliente ? (
              <>
                {[foco.tipo, foco.barrio || foco.ciudad].filter(Boolean).join(' · ')}
                {' — '}
                {money(foco.precio, foco.moneda)}
              </>
            ) : (
              <>
                {[foco.tipoCliente, (foco.zonas || []).join(', ')].filter(Boolean).join(' · ')}
                {foco.presupuesto ? ` — presupuesto ${money(foco.presupuesto, foco.moneda)}` : ''}
              </>
            )}
          </p>

          {cruzado && (
            <p className="text-xs mt-1 px-2 py-0.5 rounded inline-block bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
              Captada por otro agente — coordinar antes de mostrar
            </p>
          )}

          {match.yaVista && (
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">Ya la vio</p>
          )}
        </div>
      </div>

      {/* Por qué encaja */}
      {rec?.porQue?.length > 0 && (
        <ul className="mt-3 space-y-1">
          {rec.porQue.map((razon, i) => (
            <li key={i} className="text-sm dark:text-gray-200 flex gap-2">
              <span style={{ color: banda.color }}>·</span>
              <span>{razon}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Objeciones */}
      {rec?.objeciones?.length > 0 && (
        <div className="mt-3 pl-3 border-l-2 border-amber-400">
          {rec.objeciones.map((obj, i) => (
            <p key={i} className="text-sm text-gray-600 dark:text-gray-300">{obj}</p>
          ))}
        </div>
      )}

      {rec?.accionSugerida && (
        <p className="mt-3 text-sm font-semibold dark:text-gray-100">{rec.accionSugerida}</p>
      )}

      {/* Desglose */}
      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 hover:underline"
      >
        {abierto ? <FaChevronUp /> : <FaChevronDown />}
        Cómo se calculó
        {match.cobertura < 70 && (
          <span className="ml-2 text-amber-600 dark:text-amber-400">
            · datos incompletos ({match.cobertura}% del criterio)
          </span>
        )}
      </button>

      {abierto && (
        <div className="mt-2 space-y-1">
          {dims.map(([nombre, d]) => (
            <div key={nombre} className="flex items-center gap-2 text-xs">
              <span className="w-28 shrink-0 text-gray-500 dark:text-gray-400">{NOMBRE_DIM[nombre] || nombre}</span>
              <div className="flex-1 h-1.5 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div className="h-full rounded" style={{ width: `${Math.round(d.score * 100)}%`, background: banda.color }} />
              </div>
              <span className="w-10 text-right tabular-nums text-gray-500 dark:text-gray-400">
                {d.puntos}/{d.peso}
              </span>
              {d.detalle && <span className="hidden md:inline text-gray-400 dark:text-gray-500">{d.detalle}</span>}
            </div>
          ))}
          {rec?.explicadoPor === 'plantilla' && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 pt-1">
              Texto generado sin IA (la API no respondió). El puntaje es el mismo.
            </p>
          )}
        </div>
      )}

      {/* Acciones */}
      {rec?.id && (
        <div className="mt-4 flex flex-wrap gap-2">
          {rec.mensajeWhatsapp && (
            <button
              type="button"
              onClick={copiarWhatsapp}
              disabled={ocupado}
              title={rec.mensajeWhatsapp}
              className="px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              <FaWhatsapp /> Copiar mensaje
            </button>
          )}
          <button
            type="button"
            onClick={() => accion('visita_agendada')}
            disabled={ocupado}
            className="px-3 py-1.5 text-sm rounded-lg border dark:border-gray-600 dark:text-gray-200 flex items-center gap-2 disabled:opacity-50"
          >
            <FaCalendarPlus /> Marcar visita
          </button>
          {onAbrir && (
            <button
              type="button"
              onClick={() => onAbrir(foco)}
              className="px-3 py-1.5 text-sm rounded-lg border dark:border-gray-600 dark:text-gray-200 flex items-center gap-2"
            >
              <FaExternalLinkAlt /> Abrir
            </button>
          )}
          <button
            type="button"
            onClick={descartar}
            disabled={ocupado}
            className="px-3 py-1.5 text-sm rounded-lg text-gray-500 dark:text-gray-400 flex items-center gap-2 disabled:opacity-50"
          >
            <FaTimes /> Descartar
          </button>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
