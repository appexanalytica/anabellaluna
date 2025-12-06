import React, { useState } from 'react';
import { FaPlus, FaUpload, FaHome, FaEye, FaDollarSign, FaUser, FaCamera, FaMapMarkerAlt, FaBuilding, FaTimes, FaSave, FaArrowLeft, FaList, FaThLarge, FaBed, FaBath, FaCar, FaRulerCombined, FaCalendar, FaEdit, FaTrash } from 'react-icons/fa';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

// Syncfusion Components
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, ColumnSeries, Category, Tooltip, Legend, AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip, PieSeries } from '@syncfusion/ej2-react-charts';
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Inject as GridInject } from '@syncfusion/ej2-react-grids';

const Propiedades = () => {
  const { currentMode, currentColor } = useStateContext();
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  
  // Estados para modales de estadísticas
  const [showModalTotalPropiedades, setShowModalTotalPropiedades] = useState(false);
  const [showModalValorPortfolio, setShowModalValorPortfolio] = useState(false);
  const [showModalVisitasTotales, setShowModalVisitasTotales] = useState(false);
  const [showModalFotosSubidas, setShowModalFotosSubidas] = useState(false);
  
  // Estados para las vistas
  const [vistaActual, setVistaActual] = useState('dashboard'); // 'dashboard', 'lista', 'detalle'
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  
  // Estado para el formulario de nueva propiedad
  const [nuevaPropiedad, setNuevaPropiedad] = useState({
    titulo: '',
    tipo: 'Departamento',
    operacion: 'Venta',
    precio: '',
    moneda: 'USD',
    direccion: '',
    barrio: '',
    ciudad: 'Buenos Aires',
    provincia: 'Buenos Aires',
    codigoPostal: '',
    m2Totales: '',
    m2Cubiertos: '',
    ambientes: '',
    dormitorios: '',
    baños: '',
    cocheras: '',
    antiguedad: '',
    estado: 'Disponible',
    descripcion: '',
    amenities: [],
    agente: '',
    comision: '3',
  });

  const propiedades = [
    { 
      id: 1, 
      titulo: 'Depto 2amb Palermo', 
      tipo: 'Departamento', 
      estado: 'Disponible', 
      precio: 150000, 
      moneda: 'USD',
      operacion: 'Venta',
      m2: 45, 
      m2Cubiertos: 40,
      ambientes: 2,
      dormitorios: 1,
      baños: 1,
      cocheras: 0,
      antiguedad: 5,
      direccion: 'Av. Santa Fe 3456',
      barrio: 'Palermo',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigoPostal: 'C1425',
      descripcion: 'Hermoso departamento de 2 ambientes en el corazón de Palermo. Luminoso, con balcón y excelente distribución. Edificio con amenities.',
      amenities: ['Balcón', 'Gimnasio', 'Seguridad 24hs', 'Laundry'],
      agente: 'Ana López', 
      visitas: 1248, 
      fotos: 8,
      fechaPublicacion: '2025-09-15',
      comision: 3
    },
    { 
      id: 2, 
      titulo: 'Casa 3amb Belgrano', 
      tipo: 'Casa', 
      estado: 'Reservada', 
      precio: 280000, 
      moneda: 'USD',
      operacion: 'Venta',
      m2: 120, 
      m2Cubiertos: 95,
      ambientes: 3,
      dormitorios: 2,
      baños: 2,
      cocheras: 1,
      antiguedad: 10,
      direccion: 'Cabildo 2345',
      barrio: 'Belgrano',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigoPostal: 'C1428',
      descripcion: 'Casa de estilo clásico en Belgrano. Amplio jardín, parrilla y cochera. Ideal para familias.',
      amenities: ['Jardín', 'Parrilla', 'Cochera', 'Terraza'],
      agente: 'Carlos Ruiz', 
      visitas: 932, 
      fotos: 12,
      fechaPublicacion: '2025-08-20',
      comision: 3.5
    },
    { 
      id: 3, 
      titulo: 'Oficina Microcentro', 
      tipo: 'Oficina', 
      estado: 'Vendida', 
      precio: 95000, 
      moneda: 'USD',
      operacion: 'Venta',
      m2: 35, 
      m2Cubiertos: 35,
      ambientes: 1,
      dormitorios: 0,
      baños: 1,
      cocheras: 0,
      antiguedad: 15,
      direccion: 'Florida 456',
      barrio: 'Microcentro',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigoPostal: 'C1005',
      descripcion: 'Oficina comercial en pleno microcentro. Excelente ubicación cerca del subte. Lista para usar.',
      amenities: ['Aire Acondicionado', 'Seguridad 24hs', 'Ascensor'],
      agente: 'Laura Fernández', 
      visitas: 678, 
      fotos: 6,
      fechaPublicacion: '2025-07-10',
      comision: 4
    },
    { 
      id: 4, 
      titulo: 'PH 4amb Colegiales', 
      tipo: 'PH', 
      estado: 'Disponible', 
      precio: 320000, 
      moneda: 'USD',
      operacion: 'Venta',
      m2: 85, 
      m2Cubiertos: 70,
      ambientes: 4,
      dormitorios: 3,
      baños: 2,
      cocheras: 1,
      antiguedad: 3,
      direccion: 'Zapiola 1234',
      barrio: 'Colegiales',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigoPostal: 'C1426',
      descripcion: 'PH moderno con terraza propia. Excelente iluminación natural. Cocina integrada y parrilla en terraza.',
      amenities: ['Terraza', 'Parrilla', 'Cochera', 'Balcón', 'Aire Acondicionado'],
      agente: 'Sofía Torres', 
      visitas: 544, 
      fotos: 15,
      fechaPublicacion: '2025-09-01',
      comision: 3
    },
    { 
      id: 5, 
      titulo: 'Local Comercial Recoleta', 
      tipo: 'Local', 
      estado: 'Alquilada', 
      precio: 180000, 
      moneda: 'USD',
      operacion: 'Alquiler',
      m2: 60, 
      m2Cubiertos: 60,
      ambientes: 2,
      dormitorios: 0,
      baños: 1,
      cocheras: 0,
      antiguedad: 20,
      direccion: 'Av. Callao 987',
      barrio: 'Recoleta',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigoPostal: 'C1022',
      descripcion: 'Local comercial a la calle en zona premium de Recoleta. Gran vidriera y alto tránsito peatonal.',
      amenities: ['Aire Acondicionado', 'Vidriera'],
      agente: 'Marcos Silva', 
      visitas: 423, 
      fotos: 5,
      fechaPublicacion: '2025-06-15',
      comision: 5
    },
  ];

  // KPIs de Propiedades
  const kpisPropiedades = [
    { title: 'Total Propiedades', value: propiedades.length, desc: '3 nuevas esta semana', icon: <FaHome />, color: 'from-blue-500 to-blue-600' },
    { title: 'Valor Total Portfolio', value: `$${(propiedades.reduce((sum, p) => sum + p.precio, 0) / 1000).toFixed(0)}K`, desc: 'Inventario completo', icon: <FaDollarSign />, color: 'from-green-500 to-green-600' },
    { title: 'Visitas Totales', value: propiedades.reduce((sum, p) => sum + p.visitas, 0).toLocaleString(), desc: 'Este mes', icon: <FaEye />, color: 'from-purple-500 to-purple-600' },
    { title: 'Fotos Subidas', value: propiedades.reduce((sum, p) => sum + p.fotos, 0), desc: 'Galería completa', icon: <FaCamera />, color: 'from-orange-500 to-orange-600' },
  ];

  // Datos para gráficos
  const estadosData = [
    { estado: 'Disponible', cantidad: propiedades.filter(p => p.estado === 'Disponible').length, fill: '#10B981' },
    { estado: 'Reservada', cantidad: propiedades.filter(p => p.estado === 'Reservada').length, fill: '#F59E0B' },
    { estado: 'Vendida', cantidad: propiedades.filter(p => p.estado === 'Vendida').length, fill: '#6B7280' },
    { estado: 'Alquilada', cantidad: propiedades.filter(p => p.estado === 'Alquilada').length, fill: '#3B82F6' },
  ];

  const tiposData = [
    { tipo: 'Departamento', cantidad: propiedades.filter(p => p.tipo === 'Departamento').length },
    { tipo: 'Casa', cantidad: propiedades.filter(p => p.tipo === 'Casa').length },
    { tipo: 'Oficina', cantidad: propiedades.filter(p => p.tipo === 'Oficina').length },
    { tipo: 'PH', cantidad: propiedades.filter(p => p.tipo === 'PH').length },
    { tipo: 'Local', cantidad: propiedades.filter(p => p.tipo === 'Local').length },
  ];

  const cardBase = 'rounded-xl shadow-md p-6 bg-white dark:bg-secondary-dark-bg transition transform hover:scale-105';

  // Función para manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPropiedad(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Nueva propiedad:', nuevaPropiedad);
    // Aquí iría la lógica para guardar en la base de datos
    alert('Propiedad guardada exitosamente!');
    setShowModal(false);
    // Resetear formulario
    setNuevaPropiedad({
      titulo: '',
      tipo: 'Departamento',
      operacion: 'Venta',
      precio: '',
      moneda: 'USD',
      direccion: '',
      barrio: '',
      ciudad: 'Buenos Aires',
      provincia: 'Buenos Aires',
      codigoPostal: '',
      m2Totales: '',
      m2Cubiertos: '',
      ambientes: '',
      dormitorios: '',
      baños: '',
      cocheras: '',
      antiguedad: '',
      estado: 'Disponible',
      descripcion: '',
      amenities: [],
      agente: '',
      comision: '3',
    });
  };

  // Amenities disponibles
  const amenitiesDisponibles = [
    'Pileta', 'Gimnasio', 'Parrilla', 'Seguridad 24hs', 'Cochera', 
    'Balcón', 'Terraza', 'Jardín', 'Aire Acondicionado', 'Calefacción',
    'Laundry', 'SUM', 'Solarium', 'Sauna', 'Ascensor'
  ];

  // Función para ver detalle de propiedad
  const verDetalle = (propiedad) => {
    setPropiedadSeleccionada(propiedad);
    setVistaActual('detalle');
  };

  // Función para volver al dashboard
  const volverAlDashboard = () => {
    setVistaActual('dashboard');
    setPropiedadSeleccionada(null);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-main-bg dark:bg-main-dark-bg rounded-3xl">
      <Header category="Propiedades" title="🏠 Gestión de Propiedades" />
      
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
          <FaPlus /> Nueva Propiedad
        </button>
        {vistaActual === 'dashboard' && (
          <button 
            onClick={() => setVistaActual('lista')}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            <FaThLarge /> Ver Todas las Propiedades
          </button>
        )}
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">
          <FaUpload /> Importar CSV
        </button>
      </div>

      {/* Vista Dashboard */}
      {vistaActual === 'dashboard' && (
        <>
      {/* KPIs de Propiedades - Clickeables */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {kpisPropiedades.map((kpi, i) => (
          <div 
            key={i} 
            onClick={() => {
              if (i === 0) setShowModalTotalPropiedades(true);
              else if (i === 1) setShowModalValorPortfolio(true);
              else if (i === 2) setShowModalVisitasTotales(true);
              else if (i === 3) setShowModalFotosSubidas(true);
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

      {/* Gráficos de Estados y Tipos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Estados */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📊 Estados de Propiedades</h3>
          <AccumulationChartComponent
            id="estados-chart"
            tooltip={{ enable: true }}
            legendSettings={{ visible: true }}
            height="300px"
          >
            <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip]} />
            <AccumulationSeriesCollectionDirective>
              <AccumulationSeriesDirective
                type="Pie"
                dataSource={estadosData}
                xName="estado"
                yName="cantidad"
                name="Propiedades"
                innerRadius="40%"
                dataLabel={{ visible: true, name: 'estado', position: 'Outside' }}
              />
            </AccumulationSeriesCollectionDirective>
          </AccumulationChartComponent>
        </div>

        {/* Gráfico de Tipos */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🏗️ Tipos de Propiedades</h3>
          <ChartComponent
            id="tipos-chart"
            primaryXAxis={{ valueType: 'Category', title: 'Tipos' }}
            primaryYAxis={{ title: 'Cantidad' }}
            tooltip={{ enable: true }}
            legendSettings={{ visible: false }}
            height="300px"
          >
            <Inject services={[ColumnSeries, Category, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                type="Column"
                dataSource={tiposData}
                xName="tipo"
                yName="cantidad"
                name="Cantidad"
                fill={currentColor || '#3B82F6'}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>

      {/* Grid de Propiedades y Galería */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        {/* Grid Principal */}
        <div className={`xl:col-span-2 ${cardBase}`}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🏠 Listado de Propiedades</h3>
          <GridComponent
            dataSource={propiedades}
            allowPaging
            pageSettings={{ pageSize: 10 }}
            allowSorting
            allowFiltering
          >
            <GridInject services={[Page, Sort, Filter]} />
            <ColumnsDirective>
              <ColumnDirective field="titulo" headerText="Propiedad" width="200" />
              <ColumnDirective field="tipo" headerText="Tipo" width="120" />
              <ColumnDirective field="estado" headerText="Estado" width="120" />
              <ColumnDirective field="precio" headerText="Precio" textAlign="Right" width="120" format="C0" />
              <ColumnDirective field="m2" headerText="M²" textAlign="Center" width="80" />
              <ColumnDirective field="agente" headerText="Agente" width="150" />
              <ColumnDirective field="visitas" headerText="Visitas" textAlign="Center" width="100" />
            </ColumnsDirective>
          </GridComponent>
        </div>

        {/* Panel de Galería */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📸 Galería y Multimedia</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square border-2 border-dashed dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer text-xs">
                  <FaCamera className="text-gray-400" />
                </div>
              ))}
            </div>
            <div className="text-center">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                <FaUpload className="inline mr-2" />Subir Fotos
              </button>
            </div>
            <div>
              <h4 className="font-bold mb-2 dark:text-gray-200 text-sm">Videos Integrados</h4>
              <input 
                type="text" 
                placeholder="URL de YouTube/Vimeo..." 
                className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tipología y Características */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Tipología */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🏗️ Tipología Completa</h3>
          <div className="grid grid-cols-3 gap-4">
            {['Casa', 'Departamento', 'Lote', 'Local', 'Oficina', 'Cochera'].map((tipo) => (
              <div key={tipo} className="p-4 border dark:border-gray-700 rounded-lg text-center hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <FaBuilding className="text-2xl mx-auto mb-2 text-blue-500" />
                <p className="font-medium dark:text-gray-200 text-sm">{tipo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Características y Ubicación */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📍 Ubicación y Características</h3>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-2xl text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Mapa Interactivo</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="M²" className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm" />
              <input type="number" placeholder="Ambientes" className="px-3 py-2 border dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-gray-200 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-1">
              {['Piscina', 'Gym', 'Seguridad', 'Parrilla'].map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="w-3 h-3" />
                  <span className="dark:text-gray-200">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Vista Lista de Propiedades */}
      {vistaActual === 'lista' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((propiedad) => (
            <div key={propiedad.id} className={`${cardBase} hover:shadow-xl cursor-pointer`} onClick={() => verDetalle(propiedad)}>
              {/* Imagen placeholder */}
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <FaHome className="text-6xl text-white opacity-30" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    propiedad.estado === 'Disponible' ? 'bg-green-500 text-white' :
                    propiedad.estado === 'Reservada' ? 'bg-yellow-500 text-white' :
                    propiedad.estado === 'Vendida' ? 'bg-gray-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {propiedad.estado}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                  <FaCamera /> {propiedad.fotos} fotos
                </div>
              </div>

              {/* Información */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold dark:text-gray-100">{propiedad.titulo}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <FaMapMarkerAlt className="text-red-500" /> {propiedad.barrio}, {propiedad.ciudad}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold" style={{ color: currentColor }}>
                    {propiedad.moneda} ${propiedad.precio.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{propiedad.operacion}</span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-3 border-t dark:border-gray-700">
                  <div className="text-center">
                    <FaRulerCombined className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold dark:text-gray-200">{propiedad.m2}m²</p>
                  </div>
                  <div className="text-center">
                    <FaHome className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold dark:text-gray-200">{propiedad.ambientes} amb</p>
                  </div>
                  <div className="text-center">
                    <FaBed className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold dark:text-gray-200">{propiedad.dormitorios} dorm</p>
                  </div>
                  <div className="text-center">
                    <FaBath className="text-gray-400 mx-auto mb-1" />
                    <p className="text-xs font-semibold dark:text-gray-200">{propiedad.baños} baños</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-gray-400" />
                    <span className="text-sm dark:text-gray-300">{propiedad.agente}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <FaEye />
                    <span className="text-sm">{propiedad.visitas}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vista Detalle de Propiedad */}
      {vistaActual === 'detalle' && propiedadSeleccionada && (
        <div className="space-y-6">
          {/* Header con imagen */}
          <div className="relative h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl overflow-hidden">
            <FaHome className="absolute inset-0 m-auto text-9xl text-white opacity-20" />
            <div className="absolute top-6 right-6 flex gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                propiedadSeleccionada.estado === 'Disponible' ? 'bg-green-500 text-white' :
                propiedadSeleccionada.estado === 'Reservada' ? 'bg-yellow-500 text-white' :
                propiedadSeleccionada.estado === 'Vendida' ? 'bg-gray-500 text-white' :
                'bg-blue-500 text-white'
              }`}>
                {propiedadSeleccionada.estado}
              </span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2">
                <FaEdit /> Editar
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center gap-2">
                <FaTrash /> Eliminar
              </button>
            </div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{propiedadSeleccionada.titulo}</h1>
              <p className="text-xl flex items-center gap-2">
                <FaMapMarkerAlt /> {propiedadSeleccionada.direccion}, {propiedadSeleccionada.barrio}
              </p>
            </div>
          </div>

          {/* Información Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Precio y Operación */}
              <div className={cardBase}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Precio de {propiedadSeleccionada.operacion}</p>
                    <p className="text-4xl font-bold" style={{ color: currentColor }}>
                      {propiedadSeleccionada.moneda} ${propiedadSeleccionada.precio.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Comisión</p>
                    <p className="text-2xl font-bold text-green-500">{propiedadSeleccionada.comision}%</p>
                  </div>
                </div>
              </div>

              {/* Características Principales */}
              <div className={cardBase}>
                <h3 className="text-xl font-bold mb-4 dark:text-gray-100">📋 Características Principales</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <FaRulerCombined className="text-3xl text-blue-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Superficie Total</p>
                    <p className="text-xl font-bold dark:text-gray-100">{propiedadSeleccionada.m2}m²</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <FaHome className="text-3xl text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ambientes</p>
                    <p className="text-xl font-bold dark:text-gray-100">{propiedadSeleccionada.ambientes}</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-gray-800 rounded-lg">
                    <FaBed className="text-3xl text-purple-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Dormitorios</p>
                    <p className="text-xl font-bold dark:text-gray-100">{propiedadSeleccionada.dormitorios}</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-gray-800 rounded-lg">
                    <FaBath className="text-3xl text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Baños</p>
                    <p className="text-xl font-bold dark:text-gray-100">{propiedadSeleccionada.baños}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg">
                    <FaCar className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cocheras</p>
                      <p className="font-bold dark:text-gray-100">{propiedadSeleccionada.cocheras}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg">
                    <FaRulerCombined className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">M² Cubiertos</p>
                      <p className="font-bold dark:text-gray-100">{propiedadSeleccionada.m2Cubiertos}m²</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border dark:border-gray-700 rounded-lg">
                    <FaCalendar className="text-2xl text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Antigüedad</p>
                      <p className="font-bold dark:text-gray-100">{propiedadSeleccionada.antiguedad} años</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className={cardBase}>
                <h3 className="text-xl font-bold mb-4 dark:text-gray-100">📝 Descripción</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{propiedadSeleccionada.descripcion}</p>
              </div>

              {/* Amenities */}
              <div className={cardBase}>
                <h3 className="text-xl font-bold mb-4 dark:text-gray-100">✨ Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {propiedadSeleccionada.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium dark:text-gray-200">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Lateral */}
            <div className="space-y-6">
              {/* Información de Ubicación */}
              <div className={cardBase}>
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" /> Ubicación
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Dirección</p>
                    <p className="font-semibold dark:text-gray-200">{propiedadSeleccionada.direccion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Barrio</p>
                    <p className="font-semibold dark:text-gray-200">{propiedadSeleccionada.barrio}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ciudad</p>
                    <p className="font-semibold dark:text-gray-200">{propiedadSeleccionada.ciudad}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Provincia</p>
                    <p className="font-semibold dark:text-gray-200">{propiedadSeleccionada.provincia}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Código Postal</p>
                    <p className="font-semibold dark:text-gray-200">{propiedadSeleccionada.codigoPostal}</p>
                  </div>
                </div>
              </div>

              {/* Agente Responsable */}
              <div className={cardBase}>
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaUser className="text-purple-500" /> Agente Responsable
                </h3>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <FaUser className="text-3xl text-white" />
                  </div>
                  <p className="font-bold text-lg dark:text-gray-100">{propiedadSeleccionada.agente}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Agente Inmobiliario</p>
                </div>
              </div>

              {/* Estadísticas */}
              <div className={cardBase}>
                <h3 className="text-lg font-bold mb-4 dark:text-gray-100">📊 Estadísticas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaEye className="text-blue-500" />
                      <span className="text-sm dark:text-gray-200">Visitas</span>
                    </div>
                    <span className="font-bold dark:text-gray-100">{propiedadSeleccionada.visitas}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaCamera className="text-green-500" />
                      <span className="text-sm dark:text-gray-200">Fotos</span>
                    </div>
                    <span className="font-bold dark:text-gray-100">{propiedadSeleccionada.fotos}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="text-purple-500" />
                      <span className="text-sm dark:text-gray-200">Publicada</span>
                    </div>
                    <span className="font-bold dark:text-gray-100">{propiedadSeleccionada.fechaPublicacion}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Nueva Propiedad */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            {/* Header del Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaHome /> Nueva Propiedad
                </h2>
                <p className="text-blue-100 text-sm mt-1">Complete los datos de la propiedad</p>
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
              {/* Información Básica */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaBuilding className="text-blue-500" /> Información Básica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Título de la Propiedad *
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={nuevaPropiedad.titulo}
                      onChange={handleInputChange}
                      required
                      placeholder="Ej: Depto 2amb Palermo con balcón"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Tipo de Propiedad *
                    </label>
                    <select
                      name="tipo"
                      value={nuevaPropiedad.tipo}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Departamento">Departamento</option>
                      <option value="Casa">Casa</option>
                      <option value="PH">PH</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Local">Local Comercial</option>
                      <option value="Terreno">Terreno</option>
                      <option value="Cochera">Cochera</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Operación *
                    </label>
                    <select
                      name="operacion"
                      value={nuevaPropiedad.operacion}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Venta">Venta</option>
                      <option value="Alquiler">Alquiler</option>
                      <option value="Alquiler Temporal">Alquiler Temporal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Precio *
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="moneda"
                        value={nuevaPropiedad.moneda}
                        onChange={handleInputChange}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      >
                        <option value="USD">USD</option>
                        <option value="ARS">ARS</option>
                      </select>
                      <input
                        type="number"
                        name="precio"
                        value={nuevaPropiedad.precio}
                        onChange={handleInputChange}
                        required
                        placeholder="150000"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Estado *
                    </label>
                    <select
                      name="estado"
                      value={nuevaPropiedad.estado}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="Disponible">Disponible</option>
                      <option value="Reservada">Reservada</option>
                      <option value="Vendida">Vendida</option>
                      <option value="Alquilada">Alquilada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" /> Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={nuevaPropiedad.direccion}
                      onChange={handleInputChange}
                      required
                      placeholder="Av. Santa Fe 1234"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Barrio *
                    </label>
                    <input
                      type="text"
                      name="barrio"
                      value={nuevaPropiedad.barrio}
                      onChange={handleInputChange}
                      required
                      placeholder="Palermo"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      name="ciudad"
                      value={nuevaPropiedad.ciudad}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Provincia *
                    </label>
                    <input
                      type="text"
                      name="provincia"
                      value={nuevaPropiedad.provincia}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      name="codigoPostal"
                      value={nuevaPropiedad.codigoPostal}
                      onChange={handleInputChange}
                      placeholder="C1425"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Características */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaHome className="text-green-500" /> Características
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      M² Totales *
                    </label>
                    <input
                      type="number"
                      name="m2Totales"
                      value={nuevaPropiedad.m2Totales}
                      onChange={handleInputChange}
                      required
                      placeholder="45"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      M² Cubiertos
                    </label>
                    <input
                      type="number"
                      name="m2Cubiertos"
                      value={nuevaPropiedad.m2Cubiertos}
                      onChange={handleInputChange}
                      placeholder="40"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Ambientes *
                    </label>
                    <input
                      type="number"
                      name="ambientes"
                      value={nuevaPropiedad.ambientes}
                      onChange={handleInputChange}
                      required
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
                      value={nuevaPropiedad.dormitorios}
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
                      value={nuevaPropiedad.baños}
                      onChange={handleInputChange}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Cocheras
                    </label>
                    <input
                      type="number"
                      name="cocheras"
                      value={nuevaPropiedad.cocheras}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Antigüedad (años)
                    </label>
                    <input
                      type="number"
                      name="antiguedad"
                      value={nuevaPropiedad.antiguedad}
                      onChange={handleInputChange}
                      placeholder="5"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={nuevaPropiedad.descripcion}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Descripción detallada de la propiedad..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {amenitiesDisponibles.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={nuevaPropiedad.amenities.includes(amenity)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNuevaPropiedad(prev => ({
                              ...prev,
                              amenities: [...prev.amenities, amenity]
                            }));
                          } else {
                            setNuevaPropiedad(prev => ({
                              ...prev,
                              amenities: prev.amenities.filter(a => a !== amenity)
                            }));
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="dark:text-gray-200">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Agente y Comisión */}
              <div>
                <h3 className="text-lg font-semibold mb-4 dark:text-gray-100 flex items-center gap-2">
                  <FaUser className="text-purple-500" /> Asignación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Agente Responsable *
                    </label>
                    <select
                      name="agente"
                      value={nuevaPropiedad.agente}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    >
                      <option value="">Seleccionar agente</option>
                      <option value="Ana López">Ana López</option>
                      <option value="Carlos Ruiz">Carlos Ruiz</option>
                      <option value="Laura Fernández">Laura Fernández</option>
                      <option value="Sofía Torres">Sofía Torres</option>
                      <option value="Marcos Silva">Marcos Silva</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-200">
                      Comisión (%)
                    </label>
                    <input
                      type="number"
                      name="comision"
                      value={nuevaPropiedad.comision}
                      onChange={handleInputChange}
                      step="0.5"
                      min="0"
                      max="10"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
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
                  <FaSave /> Guardar Propiedad
                </button>
              </div>              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Total Propiedades */}
      {showModalTotalPropiedades && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaHome /> Total Propiedades
                </h2>
                <p className="text-blue-100 text-sm mt-1">{propiedades.length} propiedades en el sistema</p>
              </div>
              <button onClick={() => setShowModalTotalPropiedades(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propiedades.map((prop) => (
                  <div key={prop.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-lg transition-shadow`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg dark:text-gray-100">{prop.titulo}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{prop.barrio}, {prop.ciudad}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        prop.estado === 'Disponible' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        prop.estado === 'Reservada' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        prop.estado === 'Vendida' ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {prop.estado}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Tipo:</span>
                        <span className="font-medium dark:text-gray-200">{prop.tipo}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Operación:</span>
                        <span className="font-medium dark:text-gray-200">{prop.operacion}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">{prop.moneda} ${prop.precio.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t dark:border-gray-700">
                        <span className="flex items-center gap-1"><FaBed /> {prop.dormitorios}</span>
                        <span className="flex items-center gap-1"><FaBath /> {prop.baños}</span>
                        <span className="flex items-center gap-1"><FaRulerCombined /> {prop.m2}m²</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Valor Total Portfolio */}
      {showModalValorPortfolio && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaDollarSign /> Valor Total del Portfolio
                </h2>
                <p className="text-green-100 text-sm mt-1">
                  Total: ${propiedades.reduce((sum, p) => sum + p.precio, 0).toLocaleString()} USD
                </p>
              </div>
              <button onClick={() => setShowModalValorPortfolio(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {propiedades.sort((a, b) => b.precio - a.precio).map((prop) => (
                  <div key={prop.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg dark:text-gray-100">{prop.titulo}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{prop.tipo} • {prop.operacion} • {prop.barrio}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                          <span>{prop.m2}m²</span>
                          <span>{prop.ambientes} amb</span>
                          <span>{prop.dormitorios} dorm</span>
                          <span className={`px-2 py-1 rounded ${
                            prop.estado === 'Disponible' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            prop.estado === 'Reservada' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {prop.estado}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{prop.moneda} ${prop.precio.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Comisión: {prop.comision}%</p>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1">
                          ${((prop.precio * prop.comision) / 100).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-6 p-4 ${currentMode === 'Dark' ? 'bg-green-900/20' : 'bg-green-50'} rounded-lg border-2 border-green-500`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Valor Total</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${propiedades.reduce((sum, p) => sum + p.precio, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Comisión Potencial</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${propiedades.reduce((sum, p) => sum + (p.precio * p.comision / 100), 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Precio Promedio</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${Math.round(propiedades.reduce((sum, p) => sum + p.precio, 0) / propiedades.length).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visitas Totales */}
      {showModalVisitasTotales && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaEye /> Visitas Totales
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {propiedades.reduce((sum, p) => sum + p.visitas, 0).toLocaleString()} visitas totales
                </p>
              </div>
              <button onClick={() => setShowModalVisitasTotales(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {propiedades.sort((a, b) => b.visitas - a.visitas).map((prop, index) => (
                  <div key={prop.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg dark:text-gray-100">{prop.titulo}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{prop.tipo} • {prop.barrio} • {prop.moneda} ${prop.precio.toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            prop.estado === 'Disponible' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {prop.estado}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">Agente: {prop.agente}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{prop.visitas.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">visitas</p>
                        <div className="mt-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${(prop.visitas / Math.max(...propiedades.map(p => p.visitas))) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-6 p-4 ${currentMode === 'Dark' ? 'bg-purple-900/20' : 'bg-purple-50'} rounded-lg border-2 border-purple-500`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Visitas</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {propiedades.reduce((sum, p) => sum + p.visitas, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Propiedad</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round(propiedades.reduce((sum, p) => sum + p.visitas, 0) / propiedades.length).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Más Visitada</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.max(...propiedades.map(p => p.visitas)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Fotos Subidas */}
      {showModalFotosSubidas && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className={`${currentMode === 'Dark' ? 'bg-gray-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col`}>
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <FaCamera /> Fotos Subidas
                </h2>
                <p className="text-orange-100 text-sm mt-1">
                  {propiedades.reduce((sum, p) => sum + p.fotos, 0)} fotos en total
                </p>
              </div>
              <button onClick={() => setShowModalFotosSubidas(false)} className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors">
                <FaTimes className="text-2xl" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {propiedades.sort((a, b) => b.fotos - a.fotos).map((prop) => (
                  <div key={prop.id} className={`${currentMode === 'Dark' ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 border ${currentMode === 'Dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg dark:text-gray-100">{prop.titulo}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{prop.tipo} • {prop.barrio}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <span className="text-gray-600 dark:text-gray-400">Publicada: {prop.fechaPublicacion}</span>
                          <span className={`px-2 py-1 rounded ${
                            prop.estado === 'Disponible' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {prop.estado}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <FaCamera className="text-4xl text-orange-500 mx-auto mb-1" />
                          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{prop.fotos}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">fotos</p>
                        </div>
                        <div className="text-center">
                          <FaEye className="text-2xl text-purple-500 mx-auto mb-1" />
                          <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">{prop.visitas}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">visitas</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Ratio</p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {Math.round(prop.visitas / prop.fotos)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">visitas/foto</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            prop.fotos >= 10 ? 'bg-green-500' :
                            prop.fotos >= 6 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${(prop.fotos / 15) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {prop.fotos >= 10 ? 'Completo' : prop.fotos >= 6 ? 'Bueno' : 'Necesita más fotos'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={`mt-6 p-4 ${currentMode === 'Dark' ? 'bg-orange-900/20' : 'bg-orange-50'} rounded-lg border-2 border-orange-500`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Fotos</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {propiedades.reduce((sum, p) => sum + p.fotos, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Promedio por Propiedad</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.round(propiedades.reduce((sum, p) => sum + p.fotos, 0) / propiedades.length)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Más Fotos</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {Math.max(...propiedades.map(p => p.fotos))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Propiedades Completas</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {propiedades.filter(p => p.fotos >= 10).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Propiedades;
