import React, { useEffect, useState } from 'react';

import defaultAvatar from '../../data/avatar.png';

/**
 * Avatar del usuario.
 *
 * Dos cosas que antes fallaban:
 *  - el anillo se pintaba con `style={{ ringColor }}`, que no es una propiedad
 *    CSS válida: React la descartaba y quedaba el color por defecto de Tailwind;
 *  - sin `onError`, un avatar corrupto o vacío mostraba el ícono de imagen rota
 *    en vez de la foto por defecto.
 */
const Avatar = ({ src, alt = 'Perfil', size = 40, ringColor, className = '' }) => {
  const [fallo, setFallo] = useState(false);

  // Si el usuario cambia su foto, hay que volver a intentar cargarla.
  useEffect(() => { setFallo(false); }, [src]);

  const source = !src || fallo ? defaultAvatar : src;

  return (
    <img
      src={source}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      onError={() => setFallo(true)}
      className={`rounded-full object-cover flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        ...(ringColor ? { boxShadow: `0 0 0 2px ${ringColor}` } : {}),
      }}
    />
  );
};

export default Avatar;
