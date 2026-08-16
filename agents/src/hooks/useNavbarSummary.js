import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Fuente única de los contadores de la navbar.
 *
 * - Un solo poll para toda la navbar: los paneles ya no vuelven a pedir el resumen.
 * - Se pausa cuando la pestaña no está visible y refresca al volver al foco,
 *   así no se consultan badges contra una pantalla que nadie está mirando.
 * - `aplicarLocal` permite que un panel corrija su propio contador al marcar
 *   algo como leído, sin esperar al siguiente ciclo.
 */

export const RESUMEN_VACIO = {
  consultas: { noLeidas: 0, propiedades: 0, contacto: 0 },
  tareas: { vencidas: 0, hoy: 0, total: 0 },
  citas: { hoy: 0, proximas24h: 0, total: 0 },
  alertas: { noLeidas: 0, urgentes: 0 },
  proximaCita: null,
};

const INTERVALO_MS = 60000;

/** Normaliza la respuesta del backend para que la navbar nunca lea undefined. */
function normalizar(data) {
  if (!data) return RESUMEN_VACIO;
  return {
    consultas: { ...RESUMEN_VACIO.consultas, ...(data.consultas || {}) },
    tareas: { ...RESUMEN_VACIO.tareas, ...(data.tareas || {}) },
    citas: { ...RESUMEN_VACIO.citas, ...(data.citas || {}) },
    alertas: { ...RESUMEN_VACIO.alertas, ...(data.alertas || {}) },
    proximaCita: data.proximaCita || null,
  };
}

/**
 * @param {() => Promise<object>} fetchSummary Llamada al endpoint de resumen.
 * @param {(err: Error) => boolean} [esErrorDeConexion] Para distinguir API caída de error real.
 */
export default function useNavbarSummary(fetchSummary, esErrorDeConexion) {
  const [summary, setSummary] = useState(RESUMEN_VACIO);
  const [apiOffline, setApiOffline] = useState(false);
  const [cargado, setCargado] = useState(false);
  const montado = useRef(true);

  const refrescar = useCallback(async () => {
    try {
      const data = await fetchSummary();
      if (!montado.current) return null;
      const normalizado = normalizar(data);
      setSummary(normalizado);
      setApiOffline(false);
      setCargado(true);
      return normalizado;
    } catch (err) {
      if (!montado.current) return null;
      if (esErrorDeConexion && esErrorDeConexion(err)) {
        setApiOffline(true);
      } else {
        console.error('Error cargando el resumen de la navbar:', err);
      }
      return null;
    }
  }, [fetchSummary, esErrorDeConexion]);

  /**
   * Corrección optimista de un contador puntual, p. ej. al marcar consultas
   * como leídas desde su panel. El próximo refresco lo sobrescribe con el
   * valor del servidor.
   */
  const aplicarLocal = useCallback((grupo, patch) => {
    setSummary((prev) => ({ ...prev, [grupo]: { ...prev[grupo], ...patch } }));
  }, []);

  useEffect(() => {
    montado.current = true;
    refrescar();

    let intervalo = null;
    const arrancar = () => {
      if (intervalo) return;
      intervalo = setInterval(refrescar, INTERVALO_MS);
    };
    const frenar = () => {
      if (!intervalo) return;
      clearInterval(intervalo);
      intervalo = null;
    };

    const onVisibilidad = () => {
      if (document.visibilityState === 'visible') {
        refrescar();
        arrancar();
      } else {
        frenar();
      }
    };

    if (document.visibilityState === 'visible') arrancar();
    document.addEventListener('visibilitychange', onVisibilidad);
    window.addEventListener('focus', refrescar);

    return () => {
      montado.current = false;
      frenar();
      document.removeEventListener('visibilitychange', onVisibilidad);
      window.removeEventListener('focus', refrescar);
    };
  }, [refrescar]);

  return { summary, apiOffline, cargado, refrescar, aplicarLocal };
}
