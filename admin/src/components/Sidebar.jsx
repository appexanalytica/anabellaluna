import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MdSpaceDashboard, MdOutlineCancel } from 'react-icons/md';
import { FaUsers, FaRegCalendarAlt, FaDollarSign, FaCheckSquare, FaChartBar, FaPlug } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { useStateContext } from '../contexts/ContextProvider';

// Configuración de los ítems del menú del CRM según funcionalidades completas
const menuItems = [
  { name: 'ADMIN', path: '/', icon: <MdSpaceDashboard /> },
  { name: 'PROPIEDADES', path: '/propiedades', icon: <FaUsers /> },
  { name: 'CLIENTES', path: '/clientes', icon: <FaUsers /> },
  { name: 'AGENTES', path: '/agentes', icon: <FaUsers /> },
  { name: 'OPERACIONES', path: '/operaciones', icon: <FaDollarSign /> },
  { name: 'AGENDA', path: '/citas', icon: <FaRegCalendarAlt /> },
  { name: 'DOCUMENTOS', path: '/documentos', icon: <FaCheckSquare /> },
  { name: 'REPORTES', path: '/reportes', icon: <FaChartBar /> },
];

const Sidebar = () => {
  const { currentColor, currentMode, activeMenu, setActiveMenu, screenSize } = useStateContext();

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  // Estilos para el link activo
  const activeLink = 'flex items-center gap-4 pl-4 pt-3 pb-3 rounded-lg text-white text-md m-2 transition-colors duration-200';
  
  // Estilos para el link normal (ajustados para fondo oscuro en ambos modos)
  const normalLink = currentMode === 'Dark'
    ? 'flex items-center gap-4 pl-4 pt-3 pb-3 rounded-lg text-gray-300 text-md m-2 hover:bg-gray-700 transition-colors duration-200'
    : 'flex items-center gap-4 pl-4 pt-3 pb-3 rounded-lg text-gray-200 text-md m-2 hover:bg-gray-800 transition-colors duration-200';

  return (
    <>
      {/* Overlay para móviles */}
      {activeMenu && screenSize <= 900 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setActiveMenu(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 flex flex-col overflow-auto pb-10 z-50 bg-gray-900 shadow-lg transition-transform duration-300 ${
        activeMenu ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header del Sidebar con logo y botón de cerrar */}
        {activeMenu && (
          <>
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <Link 
              to="/" 
              onClick={handleCloseSideBar} 
              className="flex items-center gap-3 text-xl font-extrabold tracking-tight text-white"
            >
              <MdSpaceDashboard className="text-2xl" />
              <span>ERP Dashboard</span>
            </Link>
            
            {/* Botón de cerrar - solo visible en móviles */}
            <TooltipComponent content="Cerrar menú" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-2 hover:bg-gray-700 transition-colors duration-200 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          {/* Navegación */}
          <nav className="mt-6 px-2 flex-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleCloseSideBar}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? currentColor : '',
                })}
                className={({ isActive }) => (isActive ? activeLink : normalLink)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer opcional del sidebar */}
          <div className={`p-4 border-t ${
            currentMode === 'Dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-600'
          } text-xs text-center`}>
            <p>CRM Dashboard v1.0</p>
          </div>
        </>
      )}
      </div>
    </>
  );
};

export default Sidebar;
