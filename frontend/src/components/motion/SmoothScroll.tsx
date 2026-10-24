import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, reducedMotion, ScrollTrigger } from "../../lib/motion";

/**
 * Scroll con inercia en el sitio público (Lenis sobre el ticker de GSAP, así ScrollTrigger lee
 * la misma posición). Mantiene el scroll nativo, así que el header fixed sigue funcionando.
 *
 * No corre con "reducir movimiento". Se pausa mientras un modal de Bootstrap bloquea el scroll
 * y no intercepta la rueda dentro de los visores con scroll propio (mapa, tour 360°) ni de los
 * elementos marcados con [data-lenis-prevent].
 */
const PREVENT = [
  "[data-lenis-prevent]",
  "[role='dialog']",
  ".modal",
  ".mapboxgl-map",
  ".virtual-tour",
  ".ps", // react-perfect-scrollbar
].join(", ");

export function SmoothScroll() {
  useEffect(() => {
    if (reducedMotion()) return;
    const lenis = new Lenis({
      anchors: true,
      prevent: (node) => node.closest?.(PREVENT) != null,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Bootstrap marca el body con .modal-open mientras hay un modal abierto.
    const sync = () => (document.body.classList.contains("modal-open") ? lenis.stop() : lenis.start());
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    sync();
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
