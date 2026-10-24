import { useEffect, useRef, useState } from 'react';
import { gsap, partirNumero, reducedMotion, setIf, useGSAP } from '../../lib/motion';

/**
 * Animaciones del panel. El contrato son atributos data-*, igual que en el sitio
 * público, así marcar una pantalla no obliga a importar nada:
 *
 *  - [data-panel-card]  tarjeta o bloque que entra escalonado al aparecer
 *  - [data-count-auto]  cifra que cuenta desde cero respetando su formato ("$1.2M")
 *  - [data-panel-view]  contenedor de la vista, que entra al cambiar de pantalla
 *
 * Todo sale por reducedMotion(): con "reducir movimiento" la pantalla queda
 * quieta y legible, que en una herramienta de trabajo importa más que el efecto.
 */

/** Elementos que todavía no se animaron (el hook se re-corre cuando llegan datos). */
const pendientes = (els, marcar = true) => {
  const left = Array.from(els).filter((el) => !el.hasAttribute('data-revealed'));
  if (marcar) left.forEach((el) => el.setAttribute('data-revealed', ''));
  return left;
};

/**
 * Entrada escalonada de las tarjetas y conteo de las cifras dentro de `scope`.
 * `key` cambia cuando llegan datos nuevos para enganchar lo que recién se pintó.
 */
export function usePanelReveal(scope, key = '') {
  useGSAP(
    () => {
      if (reducedMotion()) return undefined;
      const q = gsap.utils.selector(scope);

      // Sin ScrollTrigger a propósito. Atar esto al scroll dejaba tarjetas en
      // blanco y cifras clavadas en cero: cuando el panel vuelve a pintarse con
      // los datos de la API, los triggers quedan con medidas viejas y no
      // disparan nunca. En una herramienta de trabajo, un dato que no se ve es
      // mucho peor que una animación que no se ve, así que todo entra al montar.
      const tarjetas = pendientes(q('[data-panel-card]'));
      if (tarjetas.length) {
        gsap.fromTo(
          tarjetas,
          { autoAlpha: 0, y: 14 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            // `amount` reparte el escalonado en medio segundo total, haya 4
            // tarjetas o 40: así una pantalla larga no tarda en completarse.
            stagger: { amount: 0.4 },
            ease: 'power2.out',
            clearProps: 'all',
          },
        );
      }

      const restaurar = [];
      pendientes(q('[data-count-auto]')).forEach((el) => {
        const n = partirNumero(el.textContent);
        if (!n) return;
        restaurar.push(() => { el.textContent = n.original; });
        const contador = { value: 0 };
        el.textContent = `${n.prefijo}0${n.sufijo}`;
        gsap.to(contador, {
          value: n.valor,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${n.prefijo}${contador.value.toFixed(n.decimales)}${n.sufijo}`;
          },
          // El texto definitivo es el que calculó la pantalla, no el del tween.
          onComplete: () => { el.textContent = n.original; },
        });
      });

      // Si la animación queda a mitad (cambio de pantalla, recarga en caliente),
      // el panel vuelve a su estado normal: nada invisible, ningún cero falso.
      return () => {
        setIf(tarjetas, { clearProps: 'all' });
        restaurar.forEach((fn) => fn());
      };
    },
    { scope, dependencies: [key], revertOnUpdate: true },
  );
}

/**
 * Cambio de vista: el contenido entra de abajo al navegar entre pantallas del
 * panel. Es corto a propósito (0.35 s) — acá se cambia de pantalla todo el día.
 */
export function usePageTransition(scope, pathname) {
  const primera = useRef(true);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      // La primera pantalla ya la pintó el navegador: animarla sería un parpadeo.
      if (primera.current) {
        primera.current = false;
        return;
      }
      gsap.fromTo(
        scope.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', clearProps: 'transform,opacity,visibility' },
      );
    },
    { scope, dependencies: [pathname] },
  );
}

/**
 * Cifra suelta que cuenta sola, para pantallas que no usan usePanelReveal.
 * Devuelve el ref que hay que poner en el elemento del número.
 */
export function useContador(valor) {
  const ref = useRef(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el || reducedMotion()) return;
      const n = partirNumero(el.textContent);
      if (!n) return;
      const contador = { value: 0 };
      gsap.to(contador, {
        value: n.valor,
        duration: 1.1,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = `${n.prefijo}${contador.value.toFixed(n.decimales)}${n.sufijo}`;
        },
        onComplete: () => { el.textContent = n.original; },
      });
    },
    { dependencies: [valor] },
  );
  return ref;
}

/**
 * Igual que en el sitio: cuando el contenido llega de la API después del primer
 * render, este contador cambia y las entradas se enganchan a lo nuevo.
 */
const ANIMADOS = '[data-panel-card], [data-count-auto]';

export function useContentKey(scope) {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const root = scope.current;
    if (!root || reducedMotion()) return undefined;
    let timer = 0;
    const tieneAnimados = (node) =>
      node instanceof HTMLElement && (node.matches(ANIMADOS) || node.querySelector(ANIMADOS) != null);
    const observer = new MutationObserver((records) => {
      if (!records.some((r) => Array.from(r.addedNodes).some(tieneAnimados))) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setKey((k) => k + 1), 120);
    });
    observer.observe(root, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [scope]);
  return key;
}

/**
 * Entrada de marca de la pantalla de login: el logo se descubre con una máscara
 * (el SVG original, sin redibujarlo) y el formulario sube detrás.
 */
export function useLoginIntro(scope) {
  useGSAP(
    () => {
      if (reducedMotion()) return undefined;
      const q = gsap.utils.selector(scope);
      const logo = q('[data-login-logo]');
      const piezas = q('[data-login-step]');
      const todo = [...logo, ...piezas];
      if (!todo.length) return undefined;

      // `from` y no `fromTo`: el estado final es el natural de la pantalla, así que
      // cualquier cosa que interrumpa la animación deja el login legible, no en blanco.
      // clearProps borra hasta el último estilo inline al terminar.
      const tweens = [];
      if (logo.length) {
        tweens.push(gsap.from(logo, {
          clipPath: 'inset(0% 0% 100% 0%)',
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power2.inOut',
          clearProps: 'all',
        }));
      }
      if (piezas.length) {
        tweens.push(gsap.from(piezas, {
          autoAlpha: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.07,
          delay: logo.length ? 0.35 : 0,
          ease: 'power2.out',
          clearProps: 'all',
        }));
      }

      // Seguro: si algo deja la animación a mitad de camino (una pestaña en segundo
      // plano al cargar, el doble montaje de desarrollo), a los 2 s se limpia todo
      // y la pantalla queda como si no hubiera habido animación.
      const seguro = window.setTimeout(() => {
        tweens.forEach((t) => t.progress(1));
        gsap.set(todo, { clearProps: 'all' });
      }, 2000);

      return () => {
        window.clearTimeout(seguro);
        gsap.set(todo, { clearProps: 'all' });
      };
    },
    { scope },
  );
}
