import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdSpaceDashboard } from 'react-icons/md';
import { FaBars, FaBell, FaCalendarAlt, FaComments, FaSearch, FaTasks } from 'react-icons/fa';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Tareas, Citas, Alertas, ConsultasDropdown } from '.';
import NavButton from './navbar/NavButton';
import ProfileMenu from './navbar/ProfileMenu';
import GlobalSearch from './navbar/GlobalSearch';
import QuickCreate from './navbar/QuickCreate';
import ProximaCita from './navbar/ProximaCita';
import { useStateContext } from '../contexts/ContextProvider';
import { crmService } from '../services/crmService';
import { authService } from '../services/authService';
import notificationService from '../services/notificationService';
import { isApiUnavailableError } from '../config/api';
import useNavbarSummary from '../hooks/useNavbarSummary';

/**
 * Navbar del panel de agentes.
 *
 * Mismo set de ítems que admin, más el chip de próxima cita. Propiedades vive
 * en el sidebar y los logros en /crm/recompensas: la navbar sólo muestra lo
 * que requiere una acción.
 */
const Navbar = () => {
  const {
    currentColor,
    currentMode,
    setActiveMenu,
    handleClick,
    isClicked,
    setIsClicked,
    initialState,
    setScreenSize,
    screenSize,
    setMode,
  } = useStateContext();

  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = screenSize <= 900;

  const [topBarVisible, setTopBarVisible] = useState(true);
  const lastScrollY = useRef(0);

  const [usuario, setUsuario] = useState(authService.getCurrentUser());
  const [menuPerfil, setMenuPerfil] = useState(false);
  const [menuNuevo, setMenuNuevo] = useState(false);
  const [buscadorAbierto, setBuscadorAbierto] = useState(false);

  const fetchSummary = useCallback(() => crmService.navbar.getSummary(), []);
  const { summary, apiOffline, refrescar, aplicarLocal } = useNavbarSummary(
    fetchSummary,
    isApiUnavailableError,
  );

  useEffect(() => {
    const onUserUpdate = (event) => setUsuario(event.detail || authService.getCurrentUser());
    window.addEventListener('userUpdated', onUserUpdate);
    return () => window.removeEventListener('userUpdated', onUserUpdate);
  }, []);

  // La generación periódica corre en el scheduler del backend; acá alcanza con
  // pedirla una vez al entrar.
  useEffect(() => {
    notificationService.generateNotifications()
      .then(() => refrescar())
      .catch(() => {});
  }, [refrescar]);

  const handleResize = useCallback(() => setScreenSize(window.innerWidth), [setScreenSize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    setActiveMenu(screenSize > 900);
  }, [screenSize, setActiveMenu]);

  useEffect(() => {
    if (!isMobile) { setTopBarVisible(true); return undefined; }
    const THRESHOLD = 10;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (Math.abs(currentY - lastScrollY.current) < THRESHOLD) return;
      setTopBarVisible(currentY < lastScrollY.current || currentY < 10);
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Cuando llega un push con la app abierta, el service worker no muestra la
  // notificación del sistema y avisa por acá: refrescamos los badges al toque.
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return undefined;
    const onMensaje = (event) => {
      if (event.data?.type === 'erp-push') refrescar();
    };
    navigator.serviceWorker.addEventListener('message', onMensaje);
    return () => navigator.serviceWorker.removeEventListener('message', onMensaje);
  }, [refrescar]);

  // Ctrl+K / ⌘K abre la búsqueda global desde cualquier pantalla.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsClicked(initialState);
        setBuscadorAbierto(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [initialState, setIsClicked]);

  /** Abre o cierra un panel: volver a tocar el mismo ícono lo cierra. */
  const togglePanel = useCallback((panel) => {
    setMenuPerfil(false);
    setMenuNuevo(false);
    if (isClicked[panel]) setIsClicked(initialState);
    else handleClick(panel);
  }, [handleClick, initialState, isClicked, setIsClicked]);

  const cerrarPaneles = useCallback(() => setIsClicked(initialState), [initialState, setIsClicked]);

  const toggleModo = () => setMode({ target: { value: currentMode === 'Dark' ? 'Light' : 'Dark' } });

  const consultasSinLeer = summary.consultas.noLeidas;
  const tareasPendientes = summary.tareas.total;
  const citasProximas = summary.citas.total;
  const alertasSinLeer = summary.alertas.noLeidas;

  const hayPanelAbierto = isClicked.tareas || isClicked.citas || isClicked.consultas || isClicked.alertas;

  const bottomNavItems = [
    {
      icon: <MdSpaceDashboard size={22} />,
      label: 'Inicio',
      action: () => { cerrarPaneles(); navigate('/crm'); },
      active: location.pathname === '/crm',
      badge: 0,
    },
    {
      icon: <FaTasks size={20} />,
      label: 'Tareas',
      action: () => togglePanel('tareas'),
      active: isClicked.tareas,
      badge: tareasPendientes,
    },
    {
      icon: <FaCalendarAlt size={20} />,
      label: 'Citas',
      action: () => togglePanel('citas'),
      active: isClicked.citas,
      badge: citasProximas,
    },
    {
      icon: <FaComments size={20} />,
      label: 'Consultas',
      action: () => togglePanel('consultas'),
      active: isClicked.consultas,
      badge: consultasSinLeer,
    },
    {
      icon: <FaBell size={20} />,
      label: 'Alertas',
      action: () => togglePanel('alertas'),
      active: isClicked.alertas,
      badge: alertasSinLeer,
    },
  ];

  return (
    <div className="relative">
      {/* Barra superior */}
      <div
        className={`flex items-center p-3 md:px-6 gap-2 transition-transform duration-300${isMobile ? ' fixed top-0 left-0 right-0 z-40 bg-main-bg dark:bg-main-dark-bg' : ''}`}
        style={isMobile ? { transform: topBarVisible ? 'translateY(0)' : 'translateY(-100%)' } : undefined}
      >
        {isMobile && (
          <button
            type="button"
            onClick={() => setActiveMenu(true)}
            aria-label="Abrir menú"
            className="p-2.5 rounded-xl text-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            style={{ color: currentColor }}
          >
            <FaBars />
          </button>
        )}

        <div className="flex-1" />

        <ProximaCita cita={summary.proximaCita} currentColor={currentColor} />

        {apiOffline && (
          <div className="rounded-full bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
            API sin conexión
          </div>
        )}

        <TooltipComponent content="Buscar (Ctrl+K)" position="BottomCenter">
          <button
            type="button"
            onClick={() => { cerrarPaneles(); setBuscadorAbierto(true); }}
            aria-label="Buscar"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaSearch />
            <span className="hidden lg:inline">Buscar</span>
            <kbd className="hidden lg:inline text-[10px] font-sans border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5">
              Ctrl K
            </kbd>
          </button>
        </TooltipComponent>

        {!isMobile && (
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-2xl px-2 py-1 shadow-sm">
            <QuickCreate
              abierto={menuNuevo}
              onToggle={() => { cerrarPaneles(); setMenuPerfil(false); setMenuNuevo((v) => !v); }}
              onClose={() => setMenuNuevo(false)}
              currentColor={currentColor}
            />

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 mx-1" />

            <NavButton
              title={`Tareas (${summary.tareas.vencidas} vencidas · ${summary.tareas.hoy} para hoy)`}
              ariaLabel={`Tareas, ${tareasPendientes} pendientes`}
              onClick={() => togglePanel('tareas')}
              color={currentColor}
              icon={<FaTasks />}
              badgeCount={tareasPendientes}
              badgeColor="bg-amber-500"
              dotColor={summary.tareas.vencidas > 0 ? '#EF4444' : 'transparent'}
              isActive={isClicked.tareas}
            />
            <NavButton
              title={`Citas (${summary.citas.hoy} hoy · ${citasProximas} en 24 h)`}
              ariaLabel={`Citas, ${citasProximas} próximas`}
              onClick={() => togglePanel('citas')}
              color={currentColor}
              icon={<FaCalendarAlt />}
              badgeCount={citasProximas}
              badgeColor="bg-violet-500"
              isActive={isClicked.citas}
            />
            <NavButton
              title={`Consultas (${consultasSinLeer} sin leer)`}
              ariaLabel={`Consultas, ${consultasSinLeer} sin leer`}
              onClick={() => togglePanel('consultas')}
              color={currentColor}
              icon={<FaComments />}
              badgeCount={consultasSinLeer}
              isActive={isClicked.consultas}
            />
            <NavButton
              title={`Alertas (${alertasSinLeer} sin leer)`}
              ariaLabel={`Alertas, ${alertasSinLeer} sin leer`}
              onClick={() => togglePanel('alertas')}
              color={currentColor}
              icon={<FaBell />}
              badgeCount={alertasSinLeer}
              dotColor={summary.alertas.urgentes > 0 ? '#EF4444' : 'transparent'}
              isActive={isClicked.alertas}
            />

            <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 mx-1" />

            <ProfileMenu
              usuario={usuario}
              abierto={menuPerfil}
              onToggle={() => { cerrarPaneles(); setMenuNuevo(false); setMenuPerfil((v) => !v); }}
              onClose={() => setMenuPerfil(false)}
              currentColor={currentColor}
              currentMode={currentMode}
              onToggleMode={toggleModo}
            />
          </div>
        )}

        {isMobile && (
          <ProfileMenu
            usuario={usuario}
            abierto={menuPerfil}
            onToggle={() => { cerrarPaneles(); setMenuPerfil((v) => !v); }}
            onClose={() => setMenuPerfil(false)}
            currentColor={currentColor}
            currentMode={currentMode}
            onToggleMode={toggleModo}
          />
        )}
      </div>

      {/* Clic afuera para cerrar cualquier panel */}
      {hayPanelAbierto && (
        <div className="fixed inset-0 z-40" onClick={cerrarPaneles} role="presentation" />
      )}

      {/* Paneles */}
      {isClicked.tareas && <Tareas onClose={cerrarPaneles} />}
      {isClicked.citas && <Citas onClose={cerrarPaneles} />}
      {isClicked.consultas && (
        <ConsultasDropdown
          onClose={cerrarPaneles}
          onUnreadChange={(noLeidas) => aplicarLocal('consultas', { noLeidas })}
        />
      )}
      {isClicked.alertas && (
        <Alertas
          onClose={cerrarPaneles}
          onUnreadChange={(noLeidas) => aplicarLocal('alertas', { noLeidas })}
        />
      )}

      <GlobalSearch
        abierto={buscadorAbierto}
        onClose={() => setBuscadorAbierto(false)}
        currentColor={currentColor}
      />

      {/* Navegación inferior en mobile */}
      {isMobile && (
        <div
          className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700/80 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] transition-transform duration-300"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', transform: topBarVisible ? 'translateY(0)' : 'translateY(100%)' }}
        >
          <nav className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
            {bottomNavItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.action}
                aria-label={item.badge > 0 ? `${item.label}, ${item.badge} sin resolver` : item.label}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 rounded-2xl transition-all duration-200 ${
                  item.active ? 'scale-105' : 'text-gray-400 dark:text-gray-500 active:scale-95'
                }`}
                style={item.active ? { color: currentColor } : {}}
              >
                {item.badge > 0 && (
                  <span className="absolute -top-0.5 right-1 bg-red-500 text-white text-[9px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-1">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
                <span className="text-[22px] leading-none">{item.icon}</span>
                <span className="text-[10px] font-semibold leading-tight">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
