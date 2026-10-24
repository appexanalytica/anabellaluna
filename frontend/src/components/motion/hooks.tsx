import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  afterReveal,
  belowFold,
  curtainCovered,
  finePointer,
  gsap,
  isFirstPage,
  reducedMotion,
  ScrollTrigger,
  SplitText,
  useGSAP,
} from "../../lib/motion";

type Scope = RefObject<HTMLElement | null>;

/** Selectores que las entradas de scroll animan. */
const ANIMATED = "[data-card], [data-count], [data-reveal-heading]";

/**
 * Buena parte del sitio pinta sus tarjetas y cifras cuando contesta la API, después de que los
 * hooks ya corrieron. Este contador cambia cuando aparecen piezas nuevas dentro de `scope`, y se
 * usa como dependencia para que las entradas se enganchen también a esas. Lo ya revelado queda
 * marcado con data-revealed, así que no se reanima.
 */
export function useContentKey(scope: Scope): number {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const root = scope.current;
    if (!root || reducedMotion()) return;
    let timer = 0;
    const hasAnimated = (node: Node) =>
      node instanceof HTMLElement && (node.matches(ANIMATED) || node.querySelector(ANIMATED) != null);
    const observer = new MutationObserver((records) => {
      if (!records.some((r) => Array.from(r.addedNodes).some(hasAnimated))) return;
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
 * Portada: la foto entra con un zoom-out lento, el título sube línea por línea desde una
 * máscara y, al bajar, la foto se desplaza más lento que la página (parallax).
 */
export function useHeroMotion(scope: Scope) {
  useGSAP(
    (_, contextSafe) => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(scope);
      const media = q("[data-hero-media]")[0];
      if (media) {
        gsap.to(media, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
      }
      if (isFirstPage() && !curtainCovered()) return;
      set(q("[data-hero-title], [data-hero-extra]"), { autoAlpha: 0 });
      return afterReveal(
        contextSafe!(() => {
          if (media) gsap.fromTo(media, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "power2.out" });
          const extras = q("[data-hero-extra]");
          if (extras.length) {
            gsap.fromTo(
              extras,
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.1, delay: 0.6, ease: "power2.out" },
            );
          }
          q("[data-hero-title]").forEach((title) => {
            gsap.set(title, { autoAlpha: 1 });
            SplitText.create(title, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, { yPercent: 100, duration: 0.9, stagger: 0.1, delay: 0.2, ease: "power3.out" }),
            });
          });
        }),
      );
    },
    { scope },
  );
}

/**
 * Entradas al hacer scroll dentro de `scope`:
 * - [data-reveal-heading]: el rótulo aparece, la regla [data-rule] crece y el título sube.
 * - [data-card]: la foto [data-card-media] se destapa de abajo hacia arriba, escalonada con
 *   las vecinas, y el texto [data-card-text] acompaña.
 * - [data-count]: el número cuenta desde 0 hasta el valor del atributo.
 */
export function useReveals(scope: Scope, key: string | number = "") {
  useGSAP(
    (_, contextSafe) => {
      if (reducedMotion()) return;
      const q = gsap.utils.selector(scope);
      return afterReveal(
        contextSafe!(() => {
          // Las piezas que ya se animaron quedan marcadas: el hook se vuelve a correr cuando
          // llegan datos de la API o cambia la página, y no debe reanimar lo que ya se vio.
          pending(belowFold(q("[data-reveal-heading]"))).forEach((heading) => {
            const tl = gsap.timeline({ scrollTrigger: { trigger: heading, start: "top 88%", once: true } });
            const label = heading.querySelector("[data-reveal-label]");
            const rule = heading.querySelector("[data-rule]");
            const title = heading.querySelectorAll("[data-reveal-title]");
            if (label) tl.from(label, { autoAlpha: 0, y: 8, duration: 0.5 });
            if (rule) tl.from(rule, { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power3.inOut" }, "<0.1");
            if (title.length) tl.from(title, { autoAlpha: 0, yPercent: 30, duration: 0.8, ease: "power3.out" }, "<0.2");
          });

          const cards = pending(belowFold(q("[data-card]")), false);
          if (cards.length) {
            set(cardParts(cards, "[data-card-media]"), { clipPath: "inset(100% 0% 0% 0%)" });
            set(cardTexts(cards), { autoAlpha: 0, y: 12 });
            ScrollTrigger.batch(cards, {
              start: "top 92%",
              once: true,
              onEnter: contextSafe!((entered: Element[]) => {
                // Las que un filtro ya mostró (showCards) no se vuelven a animar.
                const batch = entered.filter((c) => !c.hasAttribute("data-revealed"));
                batch.forEach((c) => c.setAttribute("data-revealed", ""));
                const medias = cardParts(batch, "[data-card-media]");
                const fotos = cardParts(batch, "[data-card-media] img");
                const textos = cardTexts(batch);
                if (medias.length) {
                  gsap.to(medias, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1,
                    stagger: 0.12,
                    ease: "power3.out",
                    clearProps: "clipPath",
                  });
                }
                if (fotos.length) {
                  gsap.fromTo(fotos, { scale: 1.2 }, { scale: 1, duration: 1.2, stagger: 0.12, ease: "power3.out" });
                }
                if (textos.length) {
                  gsap.to(textos, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.3 });
                }
              }),
            });
          }

          pending(belowFold(q("[data-count]"))).forEach((el) => {
            const end = Number(el.getAttribute("data-count"));
            if (!Number.isFinite(end) || end <= 0) return;
            // El texto que ya está en el HTML es el definitivo (puede venir formateado, "1.2K"):
            // se anima un número crudo y al terminar se restaura tal cual estaba.
            const final = el.textContent ?? String(end);
            const counter = { value: 0 };
            el.textContent = "0";
            gsap.to(counter, {
              value: end,
              duration: 1.6,
              ease: "power2.out",
              snap: { value: 1 },
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
              onUpdate: () => (el.textContent = String(counter.value)),
              onComplete: () => (el.textContent = final),
            });
          });
        }),
      );
    },
    { scope, dependencies: [key], revertOnUpdate: true },
  );
}

/** gsap.set que no se queja cuando la lista viene vacía (una tarjeta puede no tener foto). */
const set = (els: Element[], vars: gsap.TweenVars) => {
  if (els.length) gsap.set(els, vars);
};

/**
 * Elementos que todavía no se animaron. `mark` en false los deja sin marcar porque el batch de
 * las tarjetas marca cada una cuando entra en pantalla, no cuando se prepara.
 */
const pending = (els: Element[], mark = true) => {
  const left = els.filter((el) => !el.hasAttribute("data-revealed"));
  if (mark) left.forEach((el) => el.setAttribute("data-revealed", ""));
  return left;
};

const cardParts = (cards: Element[], sel: string) =>
  cards.map((c) => c.querySelector(sel)).filter(Boolean) as Element[];
const cardTexts = (cards: Element[]) => cards.flatMap((c) => Array.from(c.querySelectorAll("[data-card-text]")));

/** Deja visibles al instante tarjetas que todavía esperaban su entrada (lo usa el Flip del catálogo). */
export function showCards(cards: Element[]) {
  const porMostrar = cards.filter((c) => !c.hasAttribute("data-revealed"));
  porMostrar.forEach((c) => c.setAttribute("data-revealed", ""));
  set(cardParts(porMostrar, "[data-card-media]"), { clearProps: "clipPath" });
  set(cardTexts(porMostrar), { autoAlpha: 1, y: 0 });
}

/**
 * Hover editorial en las tarjetas [data-card] (solo con mouse): la foto hace un zoom sutil, se
 * dibuja la línea [data-card-line] bajo el título y la flecha [data-card-arrow] avanza.
 * `key` cambia cuando cambian las tarjetas (filtros), para volver a enganchar los eventos.
 */
export function useCardHover(scope: Scope, key: string | number = "") {
  useGSAP(
    (_, contextSafe) => {
      if (reducedMotion() || !finePointer()) return;
      const cleanups = gsap.utils.toArray<HTMLElement>("[data-card]", scope.current).map((card) => {
        const img = card.querySelector("[data-card-media] img");
        const line = card.querySelector("[data-card-line]");
        const arrow = card.querySelector("[data-card-arrow]");
        const enter = contextSafe!(() => {
          if (img) gsap.to(img, { scale: 1.06, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          if (line) gsap.to(line, { scaleX: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          if (arrow) gsap.to(arrow, { x: 3, y: -3, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        });
        const leave = contextSafe!(() => {
          if (img) gsap.to(img, { scale: 1, duration: 0.8, ease: "power2.out", overwrite: "auto" });
          if (line) gsap.to(line, { scaleX: 0, duration: 0.4, ease: "power2.in", overwrite: "auto" });
          if (arrow) gsap.to(arrow, { x: 0, y: 0, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        });
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
        card.addEventListener("focusin", enter);
        card.addEventListener("focusout", leave);
        return () => {
          card.removeEventListener("mouseenter", enter);
          card.removeEventListener("mouseleave", leave);
          card.removeEventListener("focusin", enter);
          card.removeEventListener("focusout", leave);
        };
      });
      return () => cleanups.forEach((fn) => fn());
    },
    { scope, dependencies: [key], revertOnUpdate: true },
  );
}

/** Línea que se dibuja bajo el título de una tarjeta (la anima useCardHover). */
export function CardLine({ className }: { className?: string }) {
  return (
    <span
      data-card-line
      aria-hidden
      className={className}
      style={{
        display: "block",
        height: 1,
        marginTop: 2,
        background: "currentColor",
        transform: "scaleX(0)",
        transformOrigin: "left center",
      }}
    />
  );
}

/**
 * Botón magnético: con el mouse encima, el contenido se deja atraer por el cursor y vuelve a su
 * lugar al salir. En pantallas táctiles o con "reducir movimiento" no hace nada.
 */
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!el || reducedMotion() || !finePointer()) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const move = contextSafe!((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2 - Number(gsap.getProperty(el, "x"));
        const cy = r.top + r.height / 2 - Number(gsap.getProperty(el, "y"));
        xTo((e.clientX - cx) * strength);
        yTo((e.clientY - cy) * strength);
      });
      const leave = contextSafe!(() => {
        xTo(0);
        yTo(0);
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className} style={{ display: "inline-block" }}>
      {children}
    </span>
  );
}

/** Regla bajo los rótulos de sección; useReveals la hace crecer de izquierda a derecha. */
export function SectionRule({ className }: { className?: string }) {
  return <span data-rule aria-hidden className={className} style={{ transform: "scaleX(0)", transformOrigin: "left center" }} />;
}
