import React from 'react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

/**
 * Botón de la navbar con badge accesible.
 *
 * El badge se anuncia con aria-live para que un lector de pantalla avise
 * cuando cambia el contador, y el aria-label describe qué representa el número
 * (antes el botón sólo decía el ícono).
 */
const NavButton = ({
  title,
  onClick,
  icon,
  color,
  badgeCount = 0,
  badgeColor = 'bg-red-500',
  dotColor,
  isActive,
  ariaLabel,
}) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || title}
      aria-expanded={isActive ? 'true' : 'false'}
      className={`
        relative text-xl p-3 rounded-xl transition-all duration-200
        hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-105
        ${isActive ? 'bg-gray-100 dark:bg-gray-700 shadow-sm' : ''}
      `}
      style={{ color }}
    >
      {badgeCount > 0 ? (
        <span
          aria-live="polite"
          className={`absolute -top-0.5 -right-0.5 ${badgeColor} text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center font-bold px-1`}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </span>
      ) : dotColor && dotColor !== 'transparent' ? (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2.5 w-2.5 right-2 top-2 animate-pulse"
        />
      ) : null}
      {icon}
    </button>
  </TooltipComponent>
);

export default NavButton;
