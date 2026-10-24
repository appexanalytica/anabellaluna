import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * Punto único de GSAP para el sitio público. Los plugins se registran solo en el navegador.
 *
 * El sitio ya trae AOS para las entradas de scroll: conviven sin pelearse porque a cada
 * elemento que pasa a manos de GSAP se le saca el `data-aos`. Lo que sigue con `data-aos`
 * queda a cargo de AOS como antes.
 */
if (typeof window !== "undefined") gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, SplitText);

export { gsap, ScrollTrigger, Flip, SplitText, useGSAP };

/** Respeta "reducir movimiento" del sistema: sin animaciones, el contenido queda quieto y visible. */
export function reducedMotion(): boolean {
  return typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Mouse o trackpad (no pantallas táctiles): ahí tienen sentido el hover y el botón magnético. */
export function finePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

/*
 * Estado de la cortina (PageCurtain). Mientras tapa la pantalla, las animaciones de entrada de la
 * página esperan a que se levante; si no está tapando, arrancan en el acto.
 */
let covered = false;
let firstPage = true;
const waiting = new Set<() => void>();

export function setCurtainCovered(value: boolean) {
  covered = value;
  if (value) return;
  const queued = [...waiting];
  waiting.clear();
  queued.forEach((fn) => fn());
}

/** Si la cortina está tapando (intro o navegación): la entrada de la página se anima al levantarse. */
export function curtainCovered(): boolean {
  return covered;
}

/** Corre `fn` cuando la cortina se levanta (o ya). Devuelve cómo cancelarlo si la página se desmonta antes. */
export function afterReveal(fn: () => void): () => void {
  if (!covered) {
    fn();
    return () => {};
  }
  waiting.add(fn);
  return () => waiting.delete(fn);
}

/** True mientras no se navegó a otra página (la primera que pintó el navegador). */
export function isFirstPage(): boolean {
  return firstPage;
}

export function markNavigated() {
  firstPage = false;
}

/**
 * En la primera carga, lo que ya se ve en pantalla está pintado: ocultarlo para animarlo
 * produciría un parpadeo. Solo se animan los elementos que están más abajo.
 */
export function belowFold(els: Element[]): Element[] {
  if (!firstPage || covered) return els;
  return els.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
}
