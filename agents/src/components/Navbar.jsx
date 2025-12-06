import React, { useEffect, useCallback, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { FiSettings } from 'react-icons/fi';
import { FaHome, FaTasks, FaBell, FaComments } from 'react-icons/fa';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import avatar from '../data/avatar.png';
import { Propiedades, Tareas, Alertas, ChatInterno, UserProfile } from '.';
import { themeColors } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
      />
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const {
    currentColor,
    currentMode,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
    setMode,
    setThemeSettings,
    setColor,
  } = useStateContext();

  const [showColorMenu, setShowColorMenu] = useState(false);

  const handleResize = useCallback(() => {
    setScreenSize(window.innerWidth);
  }, [setScreenSize]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu(!activeMenu);

  return (
    <div className="flex justify-between items-start p-2 md:ml-6 md:mr-6 relative">

      <div className="flex flex-col items-start gap-1">
        <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={<AiOutlineMenu />} />
        <span className="text-3xl md:text-5xl font-extrabold text-gray-800 dark:text-gray-100 leading-tight mt-1">
          Hola Pilar..!
        </span>
      </div>
      <div className="flex items-center gap-1">
        <NavButton title="Propiedades" customFunc={() => handleClick('propiedades')} color={currentColor} icon={<FaHome />} dotColor="#10B981" />
        <NavButton title="Tareas" dotColor="#F59E0B" customFunc={() => handleClick('tareas')} color={currentColor} icon={<FaTasks />} />
        <NavButton title="Chat Interno" dotColor="#3B82F6" customFunc={() => handleClick('chatInterno')} color={currentColor} icon={<FaComments />} />
        <NavButton title="Alertas" dotColor="#EF4444" customFunc={() => handleClick('alertas')} color={currentColor} icon={<FaBell />} />
        {/* Toggle modo claro/oscuro */}
        <NavButton
          title={currentMode === 'Dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          customFunc={() => setMode({ target: { value: currentMode === 'Dark' ? 'Light' : 'Dark' } })}
          color={currentColor}
          icon={currentMode === 'Dark' ? <MdLightMode /> : <MdDarkMode />}
        />
        {/* Botón para abrir selector de tema (colores) */}
        <div className="relative">
          <NavButton
            title="Tema de color"
            customFunc={() => setShowColorMenu((prev) => !prev)}
            color={currentColor}
            icon={<FiSettings />}
          />
          {showColorMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-dark-bg shadow-lg rounded-lg p-3 z-50 border border-gray-100 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Colores del tema
              </p>
              <div className="grid grid-cols-4 gap-2">
                {themeColors.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    className="h-8 w-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-105"
                    style={{ borderColor: item.color === currentColor ? item.color : 'transparent' }}
                    onClick={() => {
                      setColor(item.color);
                      setShowColorMenu(false);
                    }}
                  >
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <img
              className="rounded-full w-8 h-8"
              src={avatar}
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Hola</span>{' '}
              <span className="text-gray-400 font-bold ml-1 text-14">
                Pilar!
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>

        {isClicked.propiedades && (<Propiedades />)}
        {isClicked.tareas && (<Tareas />)}
        {isClicked.chatInterno && (<ChatInterno />)}
        {isClicked.alertas && (<Alertas />)}
        {isClicked.userProfile && (<UserProfile />)}
      </div>
    </div>
  );
};

export default Navbar;
