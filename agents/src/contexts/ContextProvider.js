import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../config/api';

const persistTheme = (patch) => { try { api.patch('/auth/theme', patch); } catch (_) {} };

const StateContext = createContext();

// Paneles desplegables de la navbar. Cada uno es dueño de un único badge.
// Los logros se quitaron de la navbar y viven en /crm/recompensas.
const initialState = {
  tareas: false,
  citas: false,
  alertas: false,
  consultas: false,
};

// La apariencia se compone de dos ejes: el modo (claro/oscuro), que ya existía,
// y el "skin", que define la piel visual. `classic` es el diseño de siempre y
// `luminous` el tema oscuro de acento cian → magenta.
export const SKINS = ['classic', 'luminous'];

// Pieles que sólo existen en oscuro: elegirlas fuerza el modo Dark.
const SKINS_SOLO_OSCURO = ['luminous'];

// El tema Luminous tiene un acento propio y no negociable, así que ignora el
// color guardado por el usuario mientras está activo.
const ACENTO_POR_SKIN = { luminous: '#22D3EE' };

const FUENTE_POR_SKIN = {
  luminous: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap',
};

const readSkin = () => {
  const guardado = localStorage.getItem('themeSkin');
  return SKINS.includes(guardado) ? guardado : 'classic';
};

/** Carga la webfont del tema recién cuando se activa, no en todas las sesiones. */
const useFuenteDelTema = (skin) => {
  useEffect(() => {
    const href = FUENTE_POR_SKIN[skin];
    if (!href) return;
    if (document.querySelector(`link[data-theme-font="${skin}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-theme-font', skin);
    document.head.appendChild(link);
  }, [skin]);
};

export const ContextProvider = ({ children }) => {
  const [screenSize, setScreenSize] = useState(undefined);
  const [storedColor, setStoredColor] = useState('#03C9D7');
  const [currentMode, setCurrentMode] = useState('Light');
  const [currentSkin, setCurrentSkin] = useState(readSkin);
  const [themeSettings, setThemeSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState(true);
  const [isClicked, setIsClicked] = useState(initialState);

  useFuenteDelTema(currentSkin);

  // Red de seguridad: si una preferencia vieja trae Luminous en modo claro (o
  // el modo se restaura desde backend después que la piel), se corrige acá.
  useEffect(() => {
    if (SKINS_SOLO_OSCURO.includes(currentSkin) && currentMode !== 'Dark') {
      setCurrentMode('Dark');
      localStorage.setItem('themeMode', 'Dark');
    }
  }, [currentSkin, currentMode]);

  // Muchos componentes escriben el acento inline (`style={{ color: currentColor }}`),
  // que ninguna hoja de estilos puede pisar. Resolverlo acá es lo que permite
  // que Luminous mande sin sembrar `!important` por todo el CSS.
  const currentColor = ACENTO_POR_SKIN[currentSkin] || storedColor;

  // Acepta tanto el evento del radio como el string directo, porque la navbar
  // lo llama con un valor plano.
  const setMode = (e) => {
    const value = typeof e === 'string' ? e : e?.target?.value;
    if (value !== 'Light' && value !== 'Dark') return;
    if (value === 'Light' && SKINS_SOLO_OSCURO.includes(currentSkin)) return;
    setCurrentMode(value);
    localStorage.setItem('themeMode', value);
    persistTheme({ themeMode: value });
  };

  // El perfil guardado en backend puede traer una piel que ya no existe (por
  // ejemplo el viejo tema Cristal): se sanea al hidratar para que el selector
  // no quede sin ningún tile marcado.
  const hidratarSkin = (skin) => setCurrentSkin(SKINS.includes(skin) ? skin : 'classic');

  const setSkin = (skin) => {
    if (!SKINS.includes(skin)) return;
    setCurrentSkin(skin);
    localStorage.setItem('themeSkin', skin);
    if (SKINS_SOLO_OSCURO.includes(skin)) {
      setCurrentMode('Dark');
      localStorage.setItem('themeMode', 'Dark');
      persistTheme({ themeSkin: skin, themeMode: 'Dark' });
      return;
    }
    persistTheme({ themeSkin: skin });
  };

  // Los tiles del selector cambian modo y piel de una sola vez: así queda un
  // único guardado en backend en lugar de dos peticiones seguidas.
  const setTheme = (mode, skin) => {
    const modoFinal = SKINS_SOLO_OSCURO.includes(skin) ? 'Dark' : mode;
    if (modoFinal === 'Light' || modoFinal === 'Dark') {
      setCurrentMode(modoFinal);
      localStorage.setItem('themeMode', modoFinal);
    }
    if (SKINS.includes(skin)) {
      setCurrentSkin(skin);
      localStorage.setItem('themeSkin', skin);
    }
    persistTheme({ themeMode: modoFinal, themeSkin: skin });
  };

  const setColor = (color) => {
    setStoredColor(color);
    localStorage.setItem('colorMode', color);
    persistTheme({ colorMode: color });
  };

  const handleClick = (clicked) => setIsClicked({ ...initialState, [clicked]: true });

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <StateContext.Provider value={{ currentColor, currentMode, currentSkin, activeMenu, screenSize, setScreenSize, handleClick, isClicked, initialState, setIsClicked, setActiveMenu, setCurrentColor: setStoredColor, setCurrentMode, setCurrentSkin: hidratarSkin, setMode, setSkin, setTheme, setColor, themeSettings, setThemeSettings }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
