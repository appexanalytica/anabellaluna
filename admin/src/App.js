import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Footer, Sidebar, ThemeSettings } from './components';
import { Ecommerce, Orders, Calendar, Employees, Stacked, Pyramid, Customers, Kanban, Line, Area, Bar, Pie, Financial, ColorPicker, ColorMapping, Editor, DashboardEjecutivo, Propiedades, ClientesCRM, Agentes, Citas, Ventas, Tareas, Documentos, Reportes, Integraciones, Configuracion, Workflows, Automatizacion, RolesPermisos, Campanas, EmailMarketing, AnalyticsMarketing } from './pages';
import './App.css';

import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, currentColor, themeSettings, setThemeSettings } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          <Sidebar />
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-64 w-full transition-all duration-300'
                : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2 transition-all duration-300'
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
              <Navbar />
            </div>
            <div>
              {themeSettings && (<ThemeSettings />)}

              <Routes>
                {/* dashboard  */}
                <Route path="/" element={(<DashboardEjecutivo />)} />
                <Route path="/ecommerce" element={(<Ecommerce />)} />

                {/* CRM Inmobiliario - 8 Módulos Principales */}
                <Route path="/propiedades" element={<Propiedades />} />
                <Route path="/clientes" element={<ClientesCRM />} />
                <Route path="/agentes" element={<Agentes />} />
                <Route path="/operaciones" element={<Ventas />} />
                <Route path="/citas" element={<Citas />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/reportes" element={<Reportes />} />
                
                {/* Otras páginas */}
                <Route path="/tareas" element={<Tareas />} />
                <Route path="/integraciones" element={<Integraciones />} />
                <Route path="/configuracion" element={<Configuracion />} />

                {/* pages  */}
                <Route path="/orders" element={<Orders />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/customers" element={<Customers />} />

                {/* apps  */}
                <Route path="/kanban" element={<Kanban />} />
                <Route path="/editor" element={<Editor />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/color-picker" element={<ColorPicker />} />

                {/* charts  */}
                <Route path="/line" element={<Line />} />
                <Route path="/area" element={<Area />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/financial" element={<Financial />} />
                <Route path="/color-mapping" element={<ColorMapping />} />
                <Route path="/pyramid" element={<Pyramid />} />
                <Route path="/stacked" element={<Stacked />} />

                {/* Módulos Avanzados - Automatización */}
                <Route path="/workflows" element={<Workflows />} />
                <Route path="/automatizacion" element={<Automatizacion />} />
                <Route path="/reglas-negocio" element={<Workflows />} />

                {/* Módulos Avanzados - Seguridad */}
                <Route path="/autenticacion" element={<RolesPermisos />} />
                <Route path="/roles-permisos" element={<RolesPermisos />} />
                <Route path="/auditoria" element={<RolesPermisos />} />

                {/* Módulos Avanzados - Marketing */}
                <Route path="/campanas" element={<Campanas />} />
                <Route path="/email-marketing" element={<EmailMarketing />} />
                <Route path="/analytics-marketing" element={<AnalyticsMarketing />} />

                {/* Módulos Avanzados - Atención al Cliente */}
                <Route path="/tickets" element={<Workflows />} />
                <Route path="/chat-soporte" element={<Workflows />} />
                <Route path="/base-conocimiento" element={<Workflows />} />

                {/* Módulos Avanzados - Integraciones */}
                <Route path="/erp-integracion" element={<Integraciones />} />
                <Route path="/contabilidad" element={<Integraciones />} />
                <Route path="/telefonia" element={<Integraciones />} />
                <Route path="/apis-externas" element={<Integraciones />} />
                <Route path="/webhooks" element={<Integraciones />} />

                {/* Módulos Avanzados - Movilidad */}
                <Route path="/app-movil" element={<Workflows />} />
                <Route path="/geolocalizacion" element={<Workflows />} />
                <Route path="/notificaciones-push" element={<Workflows />} />

              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
