import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import ImageWithBasePath from "../../core/imageWithBasePath";
import { gsap, markNavigated, reducedMotion, setCurtainCovered, useGSAP } from "../../lib/motion";

/**
 * Cortina de marca. En la primera carga del inicio hace de intro: el logo original se destapa
 * con una máscara y aparece el descriptor. El logo es el SVG de marca tal cual (no se redibuja
 * ni se separa en letras); solo se anima cómo aparece.
 *
 * Al navegar entre páginas tapa la pantalla con el logo chico mientras carga la siguiente y se
 * retira hacia arriba. Como react-router no tiene un `beforeLoad`, la navegación se intercepta
 * en el click del enlace: se tapa primero y recién después se navega.
 */
const curtain: { el: HTMLDivElement | null; mark: HTMLDivElement | null } = { el: null, mark: null };
let lastPath: string | null = null;
let isCovering = false;

/** Rutas con intro de marca: el inicio, que es a donde entra la gente al sitio. */
const HOME_PATHS = ["/", "/index"];

/**
 * La decisión del intro se toma una sola vez por carga del documento, así el doble montaje de
 * StrictMode en desarrollo no deja la cortina a mitad de camino.
 */
let introDecided: boolean | null = null;
function decideIntro(path: string): boolean {
  if (introDecided === null) introDecided = HOME_PATHS.includes(path);
  return introDecided;
}

/** Tapa la pantalla y recién entonces resuelve, para que la navegación ocurra detrás de la cortina. */
export function coverForNavigation(nextPath: string): Promise<void> {
  const { el, mark } = curtain;
  if (!el || !mark || lastPath === null || lastPath === nextPath || reducedMotion()) {
    return Promise.resolve();
  }
  isCovering = true;
  setCurtainCovered(true);
  return new Promise((resolve) => {
    gsap.killTweensOf([el, mark]);
    gsap
      .timeline({
        onComplete: () => {
          resolve();
          // Si la navegación falla sin resolverse, la cortina no queda tapando el sitio.
          setTimeout(revealPage, 8000);
        },
      })
      .set(el, { visibility: "visible", yPercent: 100 })
      .set(mark, { autoAlpha: 0 })
      .to(el, { yPercent: 0, duration: 0.55, ease: "power3.inOut" })
      .to(mark, { autoAlpha: 1, duration: 0.25 }, "-=0.15");
  });
}

function revealPage() {
  const { el, mark } = curtain;
  if (!isCovering || !el || !mark) return;
  isCovering = false;
  gsap
    .timeline()
    .to(mark, { autoAlpha: 0, duration: 0.2, delay: 0.1 })
    .to(el, { yPercent: -100, duration: 0.7, ease: "power3.inOut", onStart: () => setCurtainCovered(false) })
    .set(el, { visibility: "hidden" });
}

/** ¿Es un enlace interno que conviene tapar antes de navegar? */
function internalTarget(e: MouseEvent): URL | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  const anchor = (e.target as HTMLElement | null)?.closest?.("a");
  if (!anchor) return null;
  if (anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return null;
  const href = anchor.getAttribute("href");
  // Se descartan los anchors que la plantilla usa como botones (href="#", "#seccion")
  // y cualquier destino externo o con protocolo propio.
  if (!href || !href.startsWith("/") || href.startsWith("//")) return null;
  const url = new URL(href, window.location.origin);
  if (url.pathname === window.location.pathname) return null;
  return url;
}

export function PageCurtain() {
  const location = useLocation();
  const navigate = useNavigate();
  const [intro, setIntro] = useState(() => decideIntro(location.pathname));
  const el = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);

  // Antes de que la página monte sus animaciones: si hay intro, esperan a que la cortina suba.
  if (intro && typeof window !== "undefined" && !reducedMotion()) setCurtainCovered(true);

  useEffect(() => {
    curtain.el = el.current;
    curtain.mark = mark.current;
    return () => {
      curtain.el = curtain.mark = null;
    };
  }, []);

  // Tapar antes de navegar: se intercepta el click del enlace en fase de captura.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const url = internalTarget(e);
      if (!url) return;
      e.preventDefault();
      const to = `${url.pathname}${url.search}${url.hash}`;
      coverForNavigation(url.pathname).then(() => navigate(to));
    };
    // En captura: si se escuchara en burbujeo, react-router ya habría navegado (y marcado el
    // evento como defaultPrevented) antes de que llegue acá.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [navigate]);

  // La página nueva ya montó: se levanta la cortina y sus entradas, encoladas, arrancan.
  useEffect(() => {
    if (lastPath !== null && lastPath !== location.pathname) {
      markNavigated();
      revealPage();
    }
    lastPath = location.pathname;
  }, [location.pathname]);

  useGSAP(
    () => {
      if (!intro) return;
      const finish = () => {
        setCurtainCovered(false);
        setIntro(false);
      };
      // Sin movimiento, o si el JS llegó tarde y la cortina ya se retiró sola por CSS.
      if (reducedMotion() || performance.now() > 3500) {
        gsap.set(el.current, { visibility: "hidden" });
        finish();
        return;
      }
      const [logoImg, descriptor] = Array.from(logo.current?.firstElementChild?.children ?? []);
      gsap.set(el.current, { animation: "none", visibility: "visible" });
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(
          logoImg!,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power2.inOut" },
        )
        .fromTo(descriptor!, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "-=0.3")
        .to(logo.current, { autoAlpha: 0, duration: 0.3 }, "+=0.45")
        .to(el.current, { yPercent: -100, duration: 0.8, ease: "power3.inOut", onStart: () => setCurtainCovered(false) })
        .set(el.current, { visibility: "hidden" })
        .call(finish);
    },
    { dependencies: [] },
  );

  return (
    <div ref={el} aria-hidden className="page-curtain" data-intro={intro || undefined}>
      {intro ? (
        <div ref={logo}>
          <div className="curtain-logo">
            <ImageWithBasePath src="assets/img/logo-white.svg" alt="" className="curtain-logo-img" />
            <span className="curtain-descriptor">Inmobiliaria</span>
          </div>
        </div>
      ) : null}
      <div ref={mark} className="curtain-mark">
        <ImageWithBasePath src="assets/img/logo-white.svg" alt="" />
      </div>
    </div>
  );
}

export default PageCurtain;
