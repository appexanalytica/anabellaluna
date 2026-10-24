import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * Punto único de GSAP para el panel.
 *
 * El panel es una herramienta de trabajo, no una pieza editorial: acá va el
 * subconjunto del paquete de animaciones que ayuda a leer la pantalla (entradas
 * escalonadas, cifras que cuentan, cambio de vista) y queda afuera todo lo que
 * agrega espera entre clic y clic (scroll con inercia, cortina de marca en cada
 * navegación, parallax). Esos viven solo en el sitio público.
 *
 * Tampoco se usa ScrollTrigger: las entradas atadas al scroll dejaban tarjetas
 * invisibles cuando la pantalla se repintaba con los datos de la API.
 */
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };

/** Respeta "reducir movimiento" del sistema: sin animaciones, todo queda quieto y visible. */
export function reducedMotion() {
  return typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Mouse o trackpad (no pantallas táctiles): ahí tiene sentido el hover. */
export function finePointer() {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** gsap.set que no se queja cuando la lista viene vacía. */
export function setIf(els, vars) {
  if (els && els.length) gsap.set(els, vars);
}

/**
 * Separa un valor ya formateado ("$1.2M", "45%", "12") en lo que se puede contar
 * y lo que lo rodea. Así el contador anima el número sin romper el formato que
 * ya calculó la pantalla.
 */
export function partirNumero(texto) {
  const match = String(texto ?? '').match(/-?\d[\d.,]*/);
  if (!match) return null;
  const crudo = match[0];
  const normalizado = crudo.replace(/\./g, '#').replace(/,/g, '.').replace(/#/g, '');
  const valor = Number(normalizado);
  if (!Number.isFinite(valor) || valor === 0) return null;
  return {
    valor,
    decimales: (normalizado.split('.')[1] || '').length,
    prefijo: String(texto).slice(0, match.index),
    sufijo: String(texto).slice(match.index + crudo.length),
    original: String(texto),
  };
}
