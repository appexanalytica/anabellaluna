import React, { useEffect, useRef, useState } from 'react';
import { gsap, reducedMotion, useGSAP } from '../../lib/motion';
import './brand-intro.css';

/**
 * Cortina de marca al entrar al panel, el mismo gesto que el sitio público: el
 * logo original se descubre con una máscara, aparece el descriptor y la cortina
 * se va hacia arriba.
 *
 * Aparece una sola vez por carga del documento (al entrar después del login o al
 * refrescar), nunca al cambiar de pantalla: acá se navega todo el día.
 *
 * A prueba de fallos: si el JS no llega o la animación queda a mitad, el CSS la
 * retira sola a los 3,5 s y además hay un seguro por JS. El panel nunca queda
 * tapado por esto.
 */

// Una vez por carga del documento, igual que el intro del sitio.
let yaPasó = false;

const BrandIntro = ({ logo = '/logo-white.svg', descriptor = 'ERP' }) => {
  const [visible, setVisible] = useState(() => !yaPasó && !reducedMotion());
  const cortina = useRef(null);
  const marca = useRef(null);

  useEffect(() => {
    yaPasó = true;
  }, []);

  useGSAP(
    () => {
      if (!visible) return undefined;
      const terminar = () => setVisible(false);

      if (reducedMotion()) {
        terminar();
        return undefined;
      }
      // Nada de descartar la cortina porque el bundle tardó: la animación de
      // respaldo del CSS cuenta desde que este nodo entra al DOM, no desde que
      // arrancó la navegación, así que siempre quedan sus 3,5 s de margen.

      const [imagen, texto] = Array.from(marca.current?.children ?? []);
      const tl = gsap.timeline({ onComplete: terminar });
      tl.set(cortina.current, { animation: 'none' })
        .fromTo(
          imagen,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9, ease: 'power2.inOut' },
        )
        .fromTo(texto, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, '-=0.25')
        .to(marca.current, { autoAlpha: 0, duration: 0.25 }, '+=0.35')
        .to(cortina.current, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' });

      // Seguro: pase lo que pase, a los 3,5 s el panel queda despejado.
      const red = window.setTimeout(terminar, 3500);
      return () => {
        window.clearTimeout(red);
        tl.kill();
      };
    },
    { dependencies: [visible] },
  );

  if (!visible) return null;

  return (
    <div className="panel-intro" ref={cortina} aria-hidden="true">
      <div className="panel-intro-marca" ref={marca}>
        <img src={logo} alt="" className="panel-intro-logo" />
        <span className="panel-intro-descriptor">{descriptor}</span>
      </div>
    </div>
  );
};

export default BrandIntro;
