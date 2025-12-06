import React, { useState } from 'react';
import { FaPlus, FaSearch, FaTags, FaEnvelope, FaWhatsapp, FaPhone, FaBell, FaUsers, FaChartLine, FaFire, FaTimes, FaSave, FaUser, FaMapMarkerAlt, FaDollarSign, FaStar, FaCalendar, FaBuilding, FaHome, FaArrowLeft, FaThLarge, FaEdit, FaTrash, FaHistory, FaComments, FaBriefcase } from 'react-icons/fa';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

// Syncfusion Components
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, LineSeries, Category, Tooltip, Legend, ColumnSeries, AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip, PieSeries } from '@syncfusion/ej2-react-charts';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Inject as GridInject } from '@syncfusion/ej2-react-grids';

const ClientesCRM = () => {
  const { currentMode, currentColor } = useStateContext();
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  
  // Estados para modales de estadísticas
  const [showModalTotalClientes, setShowModalTotalClientes] = useState(false);
  const [showModalLeadsCalientes, setShowModalLeadsCalientes] = useState(false);
  const [showModalEnNegociacion, setShowModalEnNegociacion] = useState(false);
  const [showModalConversion, setShowModalConversion] = useState(false);
  
  // Estados para las vistas
  const [vistaActual, setVistaActual] = useState('dashboard'); // 'dashboard', 'lista', 'detalle'
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  
  // Estado para el formulario de nuevo cliente
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    telefonoAlternativo: '',
    tipoCliente: 'Comprador',
    estado: 'Lead',
    presupuesto: '',
    moneda: 'USD',
    zonaInteres: '',
    tipoPropiedad: 'Departamento',
    ambientes: '',
    dormitorios: '',
    baños: '',
    caracteristicas: [],
    origen: 'Web',
    agente: '',
    scoring: 50,
    notas: '',
    direccion: '',
    ciudad: 'Buenos Aires',
    provincia: 'Buenos Aires',
    ocupacion: '',
    empresa: '',
  });

  const clientesEjemplo = [
    { 
      id: 1, 
      nombre: 'Juan Pérez', 
      tipo: 'Comprador', 
      email: 'juan@email.com', 
      telefono: '+54 11 1234-5678',
      telefonoAlternativo: '+54 11 1234-5679',
      estado: 'Lead', 
      presupuesto: 150000,
      moneda: 'USD',
      zona: 'Palermo', 
      scoring: 85, 
      ultimaInteraccion: '2025-10-08',
      fechaRegistro: '2025-09-15',
      origen: 'Web',
      agente: 'Ana López',
      ocupacion: 'Ingeniero de Software',
      empresa: 'Tech Solutions SA',
      direccion: 'Av. Córdoba 1234',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      tipoPropiedad: 'Departamento',
      ambientes: 2,
      dormitorios: 1,
      baños: 1,
      caracteristicas: ['Balcón', 'Gimnasio', 'Seguridad 24hs'],
      notas: 'Cliente interesado en zona Palermo. Busca mudarse en 3 meses.',
      interacciones: 5,
      propiedadesVistas: 8
    },
    { 
      id: 2, 
      nombre: 'María González', 
      tipo: 'Propietario', 
      email: 'maria@email.com', 
      telefono: '+54 11 8765-4321',
      telefonoAlternativo: '',
      estado: 'Contacto', 
      presupuesto: 0,
      moneda: 'USD',
      zona: 'Recoleta', 
      scoring: 60, 
      ultimaInteraccion: '2025-10-07',
      fechaRegistro: '2025-08-20',
      origen: 'Referido',
      agente: 'Carlos Ruiz',
      ocupacion: 'Arquitecta',
      empresa: 'Estudio González',
      direccion: 'Av. Callao 567',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      tipoPropiedad: 'Casa',
      ambientes: 0,
      dormitorios: 0,
      baños: 0,
      caracteristicas: [],
      notas: 'Propietaria con 2 departamentos en Recoleta para vender.',
      interacciones: 3,
      propiedadesVistas: 0
    },
    { 
      id: 3, 
      nombre: 'Carlos Rodríguez', 
      tipo: 'Comprador', 
      email: 'carlos@email.com', 
      telefono: '+54 11 5555-1234',
      telefonoAlternativo: '+54 11 5555-1235',
      estado: 'Prospecto', 
      presupuesto: 200000,
      moneda: 'USD',
      zona: 'Belgrano', 
      scoring: 92, 
      ultimaInteraccion: '2025-10-09',
      fechaRegistro: '2025-09-01',
      origen: 'Redes Sociales',
      agente: 'Laura Fernández',
      ocupacion: 'Médico',
      empresa: 'Hospital Italiano',
      direccion: 'Cabildo 2890',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      tipoPropiedad: 'Casa',
      ambientes: 3,
      dormitorios: 2,
      baños: 2,
      caracteristicas: ['Jardín', 'Parrilla', 'Cochera'],
      notas: 'Busca casa con jardín para familia. Tiene pre-aprobación bancaria.',
      interacciones: 12,
      propiedadesVistas: 15
    },
    { 
      id: 4, 
      nombre: 'Ana Martínez', 
      tipo: 'Inversor', 
      email: 'ana@email.com', 
      telefono: '+54 11 9999-8888',
      telefonoAlternativo: '',
      estado: 'Negociación', 
      presupuesto: 350000,
      moneda: 'USD',
      zona: 'Puerto Madero', 
      scoring: 95, 
      ultimaInteraccion: '2025-10-10',
      fechaRegistro: '2025-09-25',
      origen: 'Evento',
      agente: 'Sofía Torres',
      ocupacion: 'Empresaria',
      empresa: 'Inversiones AM',
      direccion: 'Av. Madero 1000',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      tipoPropiedad: 'Departamento',
      ambientes: 4,
      dormitorios: 3,
      baños: 3,
      caracteristicas: ['Pileta', 'Gimnasio', 'Seguridad 24hs', 'Cochera'],
      notas: 'Inversora con cartera de propiedades. Busca oportunidades en Puerto Madero.',
      interacciones: 18,
      propiedadesVistas: 22
    },
    { 
      id: 5, 
      nombre: 'Luis Fernández', 
      tipo: 'Comprador', 
      email: 'luis@email.com', 
      telefono: '+54 11 7777-6666',
      telefonoAlternativo: '+54 11 7777-6667',
      estado: 'Cerrado', 
      presupuesto: 180000,
      moneda: 'USD',
      zona: 'Villa Crespo', 
      scoring: 88, 
      ultimaInteraccion: '2025-10-05',
      fechaRegistro: '2025-08-10',
      origen: 'Web',
      agente: 'Marcos Silva',
      ocupacion: 'Contador',
      empresa: 'Estudio Fernández',
      direccion: 'Av. Corrientes 4567',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      tipoPropiedad: 'Departamento',
      ambientes: 2,
      dormitorios: 1,
      baños: 1,
      caracteristicas: ['Balcón', 'Aire Acondicionado'],
      notas: 'Operación cerrada exitosamente. Cliente satisfecho.',
      interacciones: 10,
      propiedadesVistas: 12
    },
  ];

  // KPIs de Clientes
  const kpisClientes = [
    { title: 'Total Clientes', value: clientesEjemplo.length, desc: '23 nuevos este mes', icon: <FaUsers />, color: 'from-blue-500 to-blue-600' },
    { title: 'Leads Calientes', value: clientesEjemplo.filter(c => c.scoring >= 80).length, desc: 'Scoring > 80', icon: <FaFire />, color: 'from-red-500 to-red-600' },
    { title: 'En Negociación', value: clientesEjemplo.filter(c => c.estado === 'Negociación').length, desc: 'Próximos a cerrar', icon: <FaChartLine />, color: 'from-green-500 to-green-600' },
    { title: 'Conversión', value: '32%', desc: 'Lead → Cliente', icon: <FaTags />, color: 'from-purple-500 to-purple-600' },
  ];

  // Datos para gráficos
  const cicloVidaData = [
    { etapa: 'Lead', cantidad: clientesEjemplo.filter(c => c.estado === 'Lead').length, fill: '#F59E0B' },
    { etapa: 'Contacto', cantidad: clientesEjemplo.filter(c => c.estado === 'Contacto').length, fill: '#3B82F6' },
    { etapa: 'Prospecto', cantidad: clientesEjemplo.filter(c => c.estado === 'Prospecto').length, fill: '#8B5CF6' },
    { etapa: 'Negociación', cantidad: clientesEjemplo.filter(c => c.estado === 'Negociación').length, fill: '#F97316' },
    { etapa: 'Cerrado', cantidad: clientesEjemplo.filter(c => c.estado === 'Cerrado').length, fill: '#10B981' },
  ];

  const segmentacionData = [
    { tipo: 'Comprador', cantidad: clientesEjemplo.filter(c => c.tipo === 'Comprador').length },
    { tipo: 'Propietario', cantidad: clientesEjemplo.filter(c => c.tipo === 'Propietario').length },
    { tipo: 'Inversor', cantidad: clientesEjemplo.filter(c => c.tipo === 'Inversor').length },
  ];

  const cardBase = 'rounded-xl shadow-md p-6 bg-white dark:bg-secondary-dark-bg transition transform hover:scale-105';

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoCliente(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nuevo cliente:', nuevoCliente);
    alert('Cliente guardado exitosamente!');
    setShowModal(false);
    // Resetear formulario
    setNuevoCliente({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      telefonoAlternativo: '',
      tipoCliente: 'Comprador',
      estado: 'Lead',
      presupuesto: '',
      moneda: 'USD',
      zonaInteres: '',
      tipoPropiedad: 'Departamento',
      ambientes: '',
      dormitorios: '',
      baños: '',
      caracteristicas: [],
      origen: 'Web',
      agente: '',
      scoring: 50,
      notas: '',
      direccion: '',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      ocupacion: '',
      empresa: '',
    });
  };

  // Características disponibles
  const caracteristicasDisponibles = [
    'Balcón', 'Terraza', 'Jardín', 'Pileta', 'Gimnasio', 'Parrilla',
    'Cochera', 'Seguridad 24hs', 'Aire Acondicionado', 'Calefacción'
  ];

  // Función para ver detalle de cliente
  const verDetalle = (cliente) => {
    setClienteSeleccionado(cliente);
    setVistaActual('detalle');
  };

  // Función para volver al dashboard
  const volverAlDashboard = () => {
    setVistaActual('dashboard');
    setClienteSeleccionado(null);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-main-bg dark:bg-main-dark-bg rounded-3xl">
      <Header category="CRM" title="👥 CRM de Clientes Avanzado" />
      
      {/* Botones de Acción */}
      <div className="flex flex-wrap gap-3 mb-6">
        {vistaActual !== 'dashboard' && (
          <button 
            onClick={volverAlDashboard}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
          >
            <FaArrowLeft /> Volver
          </button>
        )}
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
        >
          <FaPlus /> Nuevo Cliente
        </button>
        {vistaActual === 'dashboard' && (
          <button 
            onClick={() => setVistaActual('lista')}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            <FaThLarge /> Ver Todos los Clientes
          </button>
        )}
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">
          <FaSearch /> Búsqueda Avanzada
        </button>
      </div>

      {/* Vista Dashboard */}
      {vistaActual === 'dashboard' && (
        <>
      {/* KPIs de Clientes - Clickeables */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {kpisClientes.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (i === 0) setShowModalTotalClientes(true);
              else if (i === 1) setShowModalLeadsCalientes(true);
              else if (i === 2) setShowModalEnNegociacion(true);
              else if (i === 3) setShowModalConversion(true);
            }}
            className={`${cardBase} overflow-hidden cursor-pointer hover:shadow-xl`}
          >
            <div className={`h-2 w-full bg-gradient-to-r ${kpi.color}`} />
            <div className="flex items-center gap-4 mt-3">
              <div className={`text-3xl text-white p-3 rounded-lg bg-gradient-to-br ${kpi.color}`}>{kpi.icon}</div>
              <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.title}</p>
                <p className="text-2xl font-semibold dark:text-gray-100 truncate">{kpi.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{kpi.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos de Ciclo de Vida y Segmentación */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Ciclo de Vida */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📊 Ciclo de Vida (Lead → Cerrado)</h3>
          <AccumulationChartComponent
            id="ciclo-vida-chart"
            tooltip={{ enable: true }}
            legendSettings={{ visible: true }}
            height="300px"
          >
            <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip]} />
            <AccumulationSeriesCollectionDirective>
              <AccumulationSeriesDirective
                type="Pie"
                dataSource={cicloVidaData}
                xName="etapa"
                yName="cantidad"
                name="Clientes"
                innerRadius="40%"
                dataLabel={{ visible: true, name: 'etapa', position: 'Outside' }}
              />
            </AccumulationSeriesCollectionDirective>
          </AccumulationChartComponent>
        </div>

        {/* Gráfico de Segmentación */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🎯 Segmentación por Tipo</h3>
          <ChartComponent
            id="segmentacion-chart"
            primaryXAxis={{ valueType: 'Category', title: 'Tipo de Cliente' }}
            primaryYAxis={{ title: 'Cantidad' }}
            tooltip={{ enable: true }}
            legendSettings={{ visible: false }}
            height="300px"
          >
            <Inject services={[ColumnSeries, Category, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                type="Column"
                dataSource={segmentacionData}
                xName="tipo"
                yName="cantidad"
                name="Cantidad"
                fill={currentColor || '#3B82F6'}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>

      {/* Grid de Clientes y Lead Scoring */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Grid Principal */}
        <div className={`xl:col-span-2 ${cardBase}`}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">👥 Base de Datos de Clientes</h3>
          <GridComponent
            dataSource={clientesEjemplo}
            allowPaging
            pageSettings={{ pageSize: 10 }}
            allowSorting
            allowFiltering
          >
            <GridInject services={[Page, Sort, Filter]} />
            <ColumnsDirective>
              <ColumnDirective field="nombre" headerText="Cliente" width="150" />
              <ColumnDirective field="tipo" headerText="Tipo" width="120" />
              <ColumnDirective field="estado" headerText="Estado" width="120" />
              <ColumnDirective field="presupuesto" headerText="Presupuesto" textAlign="Right" width="120" format="C0" />
              <ColumnDirective field="zona" headerText="Zona" width="120" />
              <ColumnDirective field="scoring" headerText="Scoring" textAlign="Center" width="100" />
            </ColumnsDirective>
          </GridComponent>
        </div>

        {/* Panel de Lead Scoring */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🔥 Lead Scoring</h3>
          <div className="space-y-4">
            {clientesEjemplo.map((cliente) => (
              <div key={cliente.id} className="border dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold dark:text-gray-200 text-sm">{cliente.nombre}</h4>
                  <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                    cliente.scoring >= 90 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                    cliente.scoring >= 80 ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                    cliente.scoring >= 60 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {cliente.scoring} pts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${
                      cliente.scoring >= 90 ? 'bg-red-500' :
                      cliente.scoring >= 80 ? 'bg-orange-500' :
                      cliente.scoring >= 60 ? 'bg-yellow-500' : 'bg-gray-500'
                    }`} 
                    style={{ width: `${cliente.scoring}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {cliente.scoring >= 90 ? '🔥 Lead súper caliente' :
                   cliente.scoring >= 80 ? '🔥 Lead caliente' :
                   cliente.scoring >= 60 ? '⚠️ Lead tibio' :
                   '❄️ Lead frío'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comunicación Integrada */}
      <div className={cardBase}>
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📞 Comunicación Integrada</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaEnvelope className="text-4xl text-blue-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Email Marketing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Campañas automatizadas</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">1,247</p>
              <p className="text-xs text-gray-500">Enviados este mes</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaWhatsapp className="text-4xl text-green-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">WhatsApp</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Mensajes directos</p>
              <p className="text-2xl font-bold text-green-600 mt-2">432</p>
              <p className="text-xs text-gray-500">Conversaciones activas</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="p-6 border-2 border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaPhone className="text-4xl text-purple-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Llamadas</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Registro completo</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">89</p>
              <p className="text-xs text-gray-500">Esta semana</p>
            </div>
          </div>

          <div className="text-center">
            <div className="p-6 border-2 border-orange-500 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaBell className="text-4xl text-orange-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Recordatorios</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Automáticos</p>
              <p className="text-2xl font-bold text-orange-600 mt-2">15</p>
              <p className="text-xs text-gray-500">Pendientes hoy</p>
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Vista Lista de Clientes */}
      {vistaActual === 'lista' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientesEjemplo.map((cliente) => (
            <div key={cliente.id} className={`${cardBase} hover:shadow-xl cursor-pointer`} onClick={() => verDetalle(cliente)}>
              {/* Header con avatar */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b dark:border-gray-700">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${
                  cliente.scoring >= 90 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                  cliente.scoring >= 80 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                  cliente.scoring >= 60 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                  'bg-gradient-to-br from-gray-400 to-gray-500'
                }`}>
                  {cliente.nombre.charAt(0)}{cliente.nombre.split(' ')[1]?.charAt(0) || ''}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold dark:text-gray-100 truncate">{cliente.nombre}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.tipo}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  cliente.estado === 'Lead' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                  cliente.estado === 'Contacto' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                  cliente.estado === 'Prospecto' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                  cliente.estado === 'Negociación' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                }`}>
                  {cliente.estado}
                </span>
              </div>

              {/* Información de contacto */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <FaEnvelope className="text-blue-500" />
                  <span className="dark:text-gray-300 truncate">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FaPhone className="text-green-500" />
                  <span className="dark:text-gray-300">{cliente.telefono}</span>
                </div>
                {cliente.presupuesto > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <FaDollarSign className="text-green-500" />
                    <span className="font-semibold" style={{ color: currentColor }}>
                      {cliente.moneda} ${cliente.presupuesto.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span className="dark:text-gray-300">{cliente.zona}</span>
                </div>
              </div>

              {/* Lead Scoring */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium dark:text-gray-300">Lead Scoring</span>
                  <span className="text-xs font-bold" style={{ color: currentColor }}>{cliente.scoring}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      cliente.scoring >= 90 ? 'bg-red-500' :
                      cliente.scoring >= 80 ? 'bg-orange-500' :
                      cliente.scoring >= 60 ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${cliente.scoring}%` }}
                  />
                </div>
              </div>

              {/* Footer con estadísticas */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t dark:border-gray-700">
                <div className="text-center">
                  <FaHistory className="text-gray-400 mx-auto mb-1 text-sm" />
                  <p className="text-xs font-semibold dark:text-gray-200">{cliente.interacciones}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Interacciones</p>
                </div>
                <div className="text-center">
                  <FaHome className="text-gray-400 mx-auto mb-1 text-sm" />
                  <p className="text-xs font-semibold dark:text-gray-200">{cliente.propiedadesVistas}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vistas</p>
                </div>
                <div className="text-center">
                  <FaCalendar className="text-gray-400 mx-auto mb-1 text-sm" />
                  <p className="text-xs font-semibold dark:text-gray-200">{cliente.ultimaInteraccion.split('-')[2]}/{cliente.ultimaInteraccion.split('-')[1]}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Última</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Detalle de Cliente */}
      {vistaActual === 'detalle' && clienteSeleccionado && (
        <div className="space-y-6">
          {/* Header con información principal */}
          <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-4xl font-bold">
                  {clienteSeleccionado.nombre.charAt(0)}{clienteSeleccionado.nombre.split(' ')[1]?.charAt(0) || ''}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{clienteSeleccionado.nombre}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-2">
                      <FaUser /> {clienteSeleccionado.tipo}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaBriefcase /> {clienteSeleccionado.ocupacion}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  clienteSeleccionado.estado === 'Lead' ? 'bg-yellow-500 text-white' :
                  clienteSeleccionado.estado === 'Contacto' ? 'bg-blue-500 text-white' :
                  clienteSeleccionado.estado === 'Prospecto' ? 'bg-purple-500 text-white' :
                  clienteSeleccionado.estado === 'Negociación' ? 'bg-orange-500 text-white' :
                  'bg-green-500 text-white'
                }`}>
                  {clienteSeleccionado.estado}
                </span>
                <button className="px-4 py-2 bg-white text-blue-600 rounded-full hover:bg-opacity-90 transition-colors flex items-center gap-2 font-semibold">
                  <FaEdit /> Editar
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 font-semibold">
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información de Contacto */}
              <div className={cardBase}>
                <h3 className="text-xl font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaPhone className="text-blue-500" /> Información de Contacto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <FaEnvelope className="text-2xl text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                      <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <FaPhone className="text-2xl text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono Principal</p>
                      <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.telefono}</p>
                    </div>
                  </div>
                  {clienteSeleccionado.telefonoAlternativo && (
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                      <FaWhatsapp className="text-2xl text-green-500" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Teléfono Alternativo</p>
                        <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.telefonoAlternativo}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-gray-800 rounded-lg">
                    <FaBriefcase className="text-2xl text-purple-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Empresa</p>
                      <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.empresa}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferencias de Búsqueda */}
              {clienteSeleccionado.presupuesto > 0 && (
                <div className={cardBase}>
                  <h3 className="text-xl font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                    <FaHome className="text-green-500" /> Preferencias de Búsqueda
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Presupuesto</p>
                        <p className="text-3xl font-bold" style={{ color: currentColor }}>
                          {clienteSeleccionado.moneda} ${clienteSeleccionado.presupuesto.toLocaleString()}
                        </p>
                      </div>
                      <FaDollarSign className="text-4xl text-green-500 opacity-20" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="text-center p-3 border dark:border-gray-700 rounded-lg">
                        <FaBuilding className="text-2xl text-blue-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tipo</p>
                        <p className="font-bold dark:text-gray-100">{clienteSeleccionado.tipoPropiedad}</p>
                      </div>
                      <div className="text-center p-3 border dark:border-gray-700 rounded-lg">
                        <FaHome className="text-2xl text-green-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Ambientes</p>
                        <p className="font-bold dark:text-gray-100">{clienteSeleccionado.ambientes || 'N/A'}</p>
                      </div>
                      <div className="text-center p-3 border dark:border-gray-700 rounded-lg">
                        <FaMapMarkerAlt className="text-2xl text-red-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Zona</p>
                        <p className="font-bold dark:text-gray-100">{clienteSeleccionado.zona}</p>
                      </div>
                      <div className="text-center p-3 border dark:border-gray-700 rounded-lg">
                        <FaStar className="text-2xl text-yellow-500 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Scoring</p>
                        <p className="font-bold dark:text-gray-100">{clienteSeleccionado.scoring}</p>
                      </div>
                    </div>
                    {clienteSeleccionado.caracteristicas.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-3 dark:text-gray-200">Características Deseadas:</p>
                        <div className="flex flex-wrap gap-2">
                          {clienteSeleccionado.caracteristicas.map((car, idx) => (
                            <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                              {car}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notas */}
              {clienteSeleccionado.notas && (
                <div className={cardBase}>
                  <h3 className="text-xl font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                    <FaComments className="text-purple-500" /> Notas
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{clienteSeleccionado.notas}</p>
                </div>
              )}
            </div>

            {/* Columna Lateral */}
            <div className="space-y-6">
              {/* Lead Scoring */}
              <div className={cardBase}>
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaFire className="text-red-500" /> Lead Scoring
                </h3>
                <div className="text-center mb-4">
                  <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-4xl font-bold text-white ${
                    clienteSeleccionado.scoring >= 90 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                    clienteSeleccionado.scoring >= 80 ? 'bg-gradient-to-br from-orange-500 to-orange-600' :
                    clienteSeleccionado.scoring >= 60 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                    'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    {clienteSeleccionado.scoring}
                  </div>
                  <p className="mt-3 font-bold text-lg dark:text-gray-100">
                    {clienteSeleccionado.scoring >= 90 ? '🔥 Caliente' :
                     clienteSeleccionado.scoring >= 80 ? '🌡️ Tibio-Caliente' :
                     clienteSeleccionado.scoring >= 60 ? '☀️ Tibio' :
                     '❄️ Frío'}
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      clienteSeleccionado.scoring >= 90 ? 'bg-red-500' :
                      clienteSeleccionado.scoring >= 80 ? 'bg-orange-500' :
                      clienteSeleccionado.scoring >= 60 ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${clienteSeleccionado.scoring}%` }}
                  />
                </div>
              </div>

              {/* Información CRM */}
              <div className={cardBase}>
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaTags className="text-purple-500" /> Información CRM
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Origen</p>
                    <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.origen}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Agente Asignado</p>
                    <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.agente}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Fecha de Registro</p>
                    <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.fechaRegistro}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Última Interacción</p>
                    <p className="font-semibold dark:text-gray-200">{clienteSeleccionado.ultimaInteraccion}</p>
                  </div>
                </div>
              </div>

              {/* Estadísticas */}
              <div className={cardBase}>
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100">📊 Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaHistory className="text-blue-500" />
                      <span className="text-sm dark:text-gray-200">Interacciones</span>
                    </div>
                    <span className="font-bold dark:text-gray-100">{clienteSeleccionado.interacciones}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaHome className="text-green-500" />
                      <span className="text-sm dark:text-gray-200">Propiedades Vistas</span>
                    </div>
                    <span className="font-bold dark:text-gray-100">{clienteSeleccionado.propiedadesVistas}</span>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className={cardBase}>
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" /> Ubicación
                </h3>
                <div className="space-y-2">
                  <p className="text-sm dark:text-gray-300">{clienteSeleccionado.direccion}</p>
                  <p className="text-sm dark:text-gray-300">{clienteSeleccionado.ciudad}, {clienteSeleccionado.provincia}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nuevo Cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaUsers /> Nuevo Cliente
                </h2>
                <p className="text-blue-100 text-sm mt-1">Complete los datos del cliente</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Formulario con scroll */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Información Personal */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Información Personal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={nuevoCliente.nombre}
                      onChange={handleInputChange}
                      required
                      placeholder="Juan"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Apellido *
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={nuevoCliente.apellido}
                      onChange={handleInputChange}
                      required
                      placeholder="Pérez"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={nuevoCliente.email}
                      onChange={handleInputChange}
                      required
                      placeholder="juan@email.com"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={nuevoCliente.telefono}
                      onChange={handleInputChange}
                      required
                      placeholder="+54 11 1234-5678"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Teléfono Alternativo
                    </label>
                    <input
                      type="tel"
                      name="telefonoAlternativo"
                      value={nuevoCliente.telefonoAlternativo}
                      onChange={handleInputChange}
                      placeholder="+54 11 8765-4321"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Ocupación
                    </label>
                    <input
                      type="text"
                      name="ocupacion"
                      value={nuevoCliente.ocupacion}
                      onChange={handleInputChange}
                      placeholder="Ingeniero"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Empresa
                    </label>
                    <input
                      type="text"
                      name="empresa"
                      value={nuevoCliente.empresa}
                      onChange={handleInputChange}
                      placeholder="Tech Corp"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Dirección
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={nuevoCliente.direccion}
                      onChange={handleInputChange}
                      placeholder="Av. Corrientes 1234"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={nuevoCliente.ciudad}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Provincia
                    </label>
                    <input
                      type="text"
                      name="provincia"
                      value={nuevoCliente.provincia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Clasificación CRM */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaTags className="text-purple-500" /> Clasificación CRM
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Tipo de Cliente *
                    </label>
                    <select
                      name="tipoCliente"
                      value={nuevoCliente.tipoCliente}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Comprador">Comprador</option>
                      <option value="Propietario">Propietario</option>
                      <option value="Inversor">Inversor</option>
                      <option value="Inquilino">Inquilino</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Estado en el Ciclo *
                    </label>
                    <select
                      name="estado"
                      value={nuevoCliente.estado}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Contacto">Contacto</option>
                      <option value="Prospecto">Prospecto</option>
                      <option value="Negociación">Negociación</option>
                      <option value="Cerrado">Cerrado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Origen del Lead
                    </label>
                    <select
                      name="origen"
                      value={nuevoCliente.origen}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Web">Sitio Web</option>
                      <option value="Redes Sociales">Redes Sociales</option>
                      <option value="Referido">Referido</option>
                      <option value="Llamada">Llamada Directa</option>
                      <option value="Email">Email</option>
                      <option value="Evento">Evento</option>
                      <option value="Otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Agente Asignado
                    </label>
                    <select
                      name="agente"
                      value={nuevoCliente.agente}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="">Sin asignar</option>
                      <option value="Ana López">Ana López</option>
                      <option value="Carlos Ruiz">Carlos Ruiz</option>
                      <option value="Laura Fernández">Laura Fernández</option>
                      <option value="Sofía Torres">Sofía Torres</option>
                      <option value="Marcos Silva">Marcos Silva</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Lead Scoring: {nuevoCliente.scoring}
                    </label>
                    <input
                      type="range"
                      name="scoring"
                      value={nuevoCliente.scoring}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                      <span>Frío (0)</span>
                      <span>Tibio (50)</span>
                      <span>Caliente (100)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preferencias de Búsqueda */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaHome className="text-green-500" /> Preferencias de Búsqueda
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Presupuesto
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="moneda"
                        value={nuevoCliente.moneda}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="USD">USD</option>
                        <option value="ARS">ARS</option>
                      </select>
                      <input
                        type="number"
                        name="presupuesto"
                        value={nuevoCliente.presupuesto}
                        onChange={handleInputChange}
                        placeholder="150000"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Zona de Interés
                    </label>
                    <input
                      type="text"
                      name="zonaInteres"
                      value={nuevoCliente.zonaInteres}
                      onChange={handleInputChange}
                      placeholder="Palermo, Belgrano, Recoleta"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Tipo de Propiedad
                    </label>
                    <select
                      name="tipoPropiedad"
                      value={nuevoCliente.tipoPropiedad}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Departamento">Departamento</option>
                      <option value="Casa">Casa</option>
                      <option value="PH">PH</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Local">Local Comercial</option>
                      <option value="Terreno">Terreno</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Ambientes
                    </label>
                    <input
                      type="number"
                      name="ambientes"
                      value={nuevoCliente.ambientes}
                      onChange={handleInputChange}
                      placeholder="2"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Dormitorios
                    </label>
                    <input
                      type="number"
                      name="dormitorios"
                      value={nuevoCliente.dormitorios}
                      onChange={handleInputChange}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Baños
                    </label>
                    <input
                      type="number"
                      name="baños"
                      value={nuevoCliente.baños}
                      onChange={handleInputChange}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Características Deseadas */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
                  Características Deseadas
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {caracteristicasDisponibles.map((caracteristica) => (
                    <label key={caracteristica} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={nuevoCliente.caracteristicas.includes(caracteristica)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNuevoCliente(prev => ({
                              ...prev,
                              caracteristicas: [...prev.caracteristicas, caracteristica]
                            }));
                          } else {
                            setNuevoCliente(prev => ({
                              ...prev,
                              caracteristicas: prev.caracteristicas.filter(c => c !== caracteristica)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="dark:text-gray-200">{caracteristica}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                  Notas Adicionales
                </label>
                <textarea
                  name="notas"
                  value={nuevoCliente.notas}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Información adicional sobre el cliente, preferencias especiales, observaciones..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-3 justify-end pt-4 border-t dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: currentColor }}
                  className="flex items-center gap-2 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md"
                >
                  <FaSave /> Guardar Cliente
                </button>
              </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Total Clientes */}
      {showModalTotalClientes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaUsers /> Total Clientes
                </h2>
                <p className="text-blue-100 text-sm mt-1">{clientesEjemplo.length} clientes en el sistema</p>
              </div>
              <button onClick={() => setShowModalTotalClientes(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientesEjemplo.map((cliente) => (
                  <div key={cliente.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg dark:text-gray-100">{cliente.nombre}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.email}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        cliente.estado === 'Lead' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        cliente.estado === 'Contactado' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        cliente.estado === 'Negociación' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {cliente.estado}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                        <span className="font-medium dark:text-gray-200">{cliente.tipoCliente}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Presupuesto:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{cliente.moneda} ${cliente.presupuesto.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Scoring:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                cliente.scoring >= 80 ? 'bg-green-500' :
                                cliente.scoring >= 60 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${cliente.scoring}%` }}
                            />
                          </div>
                          <span className="font-bold dark:text-gray-200">{cliente.scoring}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t dark:border-gray-700">
                        <p>Interés: {cliente.zonaInteres}</p>
                        <p>Agente: {cliente.agente}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Leads Calientes */}
      {showModalLeadsCalientes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaFire /> Leads Calientes
                </h2>
                <p className="text-red-100 text-sm mt-1">
                  {clientesEjemplo.filter(c => c.scoring >= 80).length} clientes con scoring ≥ 80
                </p>
              </div>
              <button onClick={() => setShowModalLeadsCalientes(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {clientesEjemplo
                  .filter(c => c.scoring >= 80)
                  .sort((a, b) => b.scoring - a.scoring)
                  .map((cliente, index) => (
                    <div key={cliente.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border-2 ${currentMode === 'Dark' ? 'border-red-700' : 'border-red-200'} hover:shadow-md transition-shadow`}>
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${
                          index === 0 ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {cliente.scoring}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg dark:text-gray-100">{cliente.nombre}</h3>
                            {index === 0 && <FaFire className="text-red-500 text-xl" />}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{cliente.email} • {cliente.telefono}</p>
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <span className={`px-2 py-1 rounded text-xs ${
                              cliente.estado === 'Negociación' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                              'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                            }`}>
                              {cliente.estado}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">{cliente.tipoCliente}</span>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                              {cliente.moneda} ${cliente.presupuesto.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Interés</p>
                          <p className="font-medium dark:text-gray-200">{cliente.zonaInteres}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cliente.tipoPropiedad}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Agente: {cliente.agente}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {clientesEjemplo.filter(c => c.scoring >= 80).length === 0 && (
                <div className="text-center py-12">
                  <FaFire className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay leads calientes en este momento</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal En Negociación */}
      {showModalEnNegociacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaChartLine /> En Negociación
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  {clientesEjemplo.filter(c => c.estado === 'Negociación').length} clientes próximos a cerrar
                </p>
              </div>
              <button onClick={() => setShowModalEnNegociacion(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {clientesEjemplo
                  .filter(c => c.estado === 'Negociación')
                  .sort((a, b) => b.scoring - a.scoring)
                  .map((cliente) => (
                    <div key={cliente.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border-2 ${currentMode === 'Dark' ? 'border-green-700' : 'border-green-200'} hover:shadow-md transition-shadow`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg dark:text-gray-100">{cliente.nombre}</h3>
                            <div className="flex items-center gap-1">
                              <FaStar className="text-yellow-500" />
                              <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{cliente.scoring}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{cliente.email} • {cliente.telefono}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Tipo de Cliente:</p>
                              <p className="font-medium dark:text-gray-200">{cliente.tipoCliente}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Presupuesto:</p>
                              <p className="font-bold text-green-600 dark:text-green-400">
                                {cliente.moneda} ${cliente.presupuesto.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Zona de Interés:</p>
                              <p className="font-medium dark:text-gray-200">{cliente.zonaInteres}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 dark:text-gray-400">Tipo de Propiedad:</p>
                              <p className="font-medium dark:text-gray-200">{cliente.tipoPropiedad}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t dark:border-gray-700 flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Agente: <span className="font-medium text-gray-700 dark:text-gray-300">{cliente.agente}</span>
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1 rounded-full font-medium">
                              Próximo a cerrar
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              
              {clientesEjemplo.filter(c => c.estado === 'Negociación').length === 0 && (
                <div className="text-center py-12">
                  <FaChartLine className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay clientes en negociación</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Conversión */}
      {showModalConversion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaTags /> Tasa de Conversión
                </h2>
                <p className="text-purple-100 text-sm mt-1">Análisis del embudo de ventas</p>
              </div>
              <button onClick={() => setShowModalConversion(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Embudo de Conversión */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Embudo de Conversión</h3>
                <div className="space-y-4">
                  {[
                    { estado: 'Lead', count: clientesEjemplo.filter(c => c.estado === 'Lead').length, color: 'yellow', width: '100%' },
                    { estado: 'Contactado', count: clientesEjemplo.filter(c => c.estado === 'Contactado').length, color: 'blue', width: '75%' },
                    { estado: 'Negociación', count: clientesEjemplo.filter(c => c.estado === 'Negociación').length, color: 'orange', width: '50%' },
                    { estado: 'Cliente', count: clientesEjemplo.filter(c => c.estado === 'Cliente').length, color: 'green', width: '32%' },
                  ].map((etapa) => (
                    <div key={etapa.estado} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium dark:text-gray-200">{etapa.estado}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{etapa.count} clientes</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-8 relative overflow-hidden">
                        <div 
                          className={`h-8 rounded-full bg-${etapa.color}-500 flex items-center justify-center text-white font-bold transition-all duration-500`}
                          style={{ width: etapa.width }}
                        >
                          {etapa.width}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas de Conversión */}
              <div className={`p-6 ${currentMode === 'Dark' ? 'bg-purple-900/20' : 'bg-purple-50'} rounded-lg border-2 border-purple-500`}>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">Métricas de Conversión</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lead → Contactado</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 my-2">
                      {Math.round((clientesEjemplo.filter(c => c.estado !== 'Lead').length / clientesEjemplo.length) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {clientesEjemplo.filter(c => c.estado !== 'Lead').length} de {clientesEjemplo.length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contactado → Negociación</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 my-2">
                      {clientesEjemplo.filter(c => c.estado === 'Contactado').length > 0 
                        ? Math.round((clientesEjemplo.filter(c => c.estado === 'Negociación' || c.estado === 'Cliente').length / clientesEjemplo.filter(c => c.estado === 'Contactado').length) * 100)
                        : 0}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {clientesEjemplo.filter(c => c.estado === 'Negociación' || c.estado === 'Cliente').length} conversiones
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Lead → Cliente</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400 my-2">
                      {Math.round((clientesEjemplo.filter(c => c.estado === 'Cliente').length / clientesEjemplo.length) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {clientesEjemplo.filter(c => c.estado === 'Cliente').length} clientes cerrados
                    </p>
                  </div>
                </div>
              </div>

              {/* Clientes por Estado */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { estado: 'Lead', color: 'yellow', icon: '📋' },
                  { estado: 'Contactado', color: 'blue', icon: '📞' },
                  { estado: 'Negociación', color: 'orange', icon: '💼' },
                  { estado: 'Cliente', color: 'green', icon: '✅' },
                ].map((item) => (
                  <div key={item.estado} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.estado}</p>
                    <p className="text-2xl font-bold dark:text-gray-100">
                      {clientesEjemplo.filter(c => c.estado === item.estado).length}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesCRM;
