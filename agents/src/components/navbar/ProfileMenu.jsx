import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardArrowDown, MdLogout, MdPerson, MdSecurity, MdDarkMode, MdLightMode } from 'react-icons/md';

import Avatar from './Avatar';
import { authService } from '../../services/authService';

/**
 * Menú del avatar.
 *
 * Antes el avatar navegaba directo a Mi Perfil y no había forma de cerrar
 * sesión desde la navbar: la única salida estaba dentro de la propia pantalla
 * de perfil.
 */
const ProfileMenu = ({ usuario, abierto, onToggle, onClose, currentColor, currentMode, onToggleMode }) => {
  const navigate = useNavigate();
  const ref = useRef(null);

  const nombre = usuario?.nombre || usuario?.username || 'Agente';
  const avatar = usuario?.avatar;

  useEffect(() => {
    if (!abierto) return undefined;
    const onKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    const onClickFuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickFuera);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickFuera);
    };
  }, [abierto, onClose]);

  const ir = (ruta) => { onClose(); navigate(ruta); };

  const cerrarSesion = async () => {
    onClose();
    // En agentes el logout además marca la sesión como offline en el backend.
    try { await authService.logout(); } catch { /* la sesión se cierra igual */ }
    // Recarga completa: el token vive en el estado de App, así que un navigate
    // dejaría la sesión a medio cerrar.
    window.location.assign('/');
  };

  const itemClass = 'w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors';

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={abierto}
        aria-label="Menú de perfil"
        className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
      >
        <Avatar src={avatar} alt={nombre} size={40} ringColor={currentColor} />
        <div className="text-left hidden lg:block">
          <p className="text-base font-bold text-gray-800 dark:text-gray-100 leading-tight">{nombre}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Agente</p>
        </div>
        <MdKeyboardArrowDown
          className={`text-gray-500 dark:text-gray-400 text-lg transition-transform ${abierto ? 'rotate-180' : ''}`}
        />
      </button>

      {abierto && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-[#42464D] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 z-50"
        >
          <div className="px-4 py-2 border-b dark:border-gray-600 mb-1">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{nombre}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {usuario?.email || 'Agente'}
            </p>
          </div>

          <button type="button" role="menuitem" className={itemClass} onClick={() => ir('/crm/perfil')}>
            <MdPerson className="text-lg text-gray-400" /> Mi perfil
          </button>
          <button type="button" role="menuitem" className={itemClass} onClick={() => ir('/crm/seguridad')}>
            <MdSecurity className="text-lg text-gray-400" /> Seguridad
          </button>
          <button type="button" role="menuitem" className={itemClass} onClick={onToggleMode}>
            {currentMode === 'Dark'
              ? <><MdLightMode className="text-lg text-gray-400" /> Modo claro</>
              : <><MdDarkMode className="text-lg text-gray-400" /> Modo oscuro</>}
          </button>

          <div className="border-t dark:border-gray-600 mt-1 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={cerrarSesion}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <MdLogout className="text-lg" /> Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
