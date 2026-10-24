import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useContentKey, usePageTransition, usePanelReveal } from './hooks';

/**
 * Envuelve el contenido del panel.
 *
 * Hace dos cosas: la vista entra al cambiar de pantalla, y las tarjetas y cifras
 * marcadas con data-panel-card / data-count-auto se animan cuando aparecen,
 * también si llegaron después con la respuesta de la API.
 *
 * Va acá adentro y no en App porque necesita estar dentro del Router.
 */
const PanelMotion = ({ children }) => {
  const { pathname } = useLocation();
  const scope = useRef(null);
  const contentKey = useContentKey(scope);

  usePageTransition(scope, pathname);
  usePanelReveal(scope, `${pathname}:${contentKey}`);

  return (
    <div ref={scope} data-panel-view>
      {children}
    </div>
  );
};

export default PanelMotion;
