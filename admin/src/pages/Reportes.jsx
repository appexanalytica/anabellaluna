import React from 'react';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, Tooltip, ColumnSeries, LineSeries, SplineAreaSeries, AccumulationChartComponent, AccumulationSeriesCollectionDirective, AccumulationSeriesDirective, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip, PieSeries } from '@syncfusion/ej2-react-charts';
import { FaChartBar, FaDownload, FaCalendarAlt, FaFilter, FaArrowUp, FaDollarSign, FaUsers, FaHome } from 'react-icons/fa';
import { Header } from '../components';
import { useStateContext } from '../contexts/ContextProvider';

// Syncfusion Components
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Sort, Filter, Inject as GridInject } from '@syncfusion/ej2-react-grids';

const Reportes = () => {
  const { currentMode, currentColor } = useStateContext();

  // Datos para reportes
  const ventasPorMes = [
    { mes: 'Ene', ventas: 35, alquileres: 18, comisiones: 125000 },
    { mes: 'Feb', ventas: 28, alquileres: 22, comisiones: 98000 },
    { mes: 'Mar', ventas: 42, alquileres: 15, comisiones: 156000 },
    { mes: 'Abr', ventas: 38, alquileres: 25, comisiones: 142000 },
    { mes: 'May', ventas: 45, alquileres: 20, comisiones: 178000 },
    { mes: 'Jun', ventas: 52, alquileres: 28, comisiones: 195000 },
  ];

  const rendimientoAgentes = [
    { agente: 'Ana López', ventas: 12, comisiones: 42000, rating: 4.8 },
    { agente: 'Carlos Ruiz', ventas: 8, comisiones: 28000, rating: 4.5 },
    { agente: 'Laura Fernández', ventas: 15, comisiones: 52500, rating: 4.9 },
    { agente: 'Sofía Torres', ventas: 10, comisiones: 35000, rating: 4.6 },
    { agente: 'Marcos Silva', ventas: 7, comisiones: 24500, rating: 4.3 },
  ];

  const propiedadesPorZona = [
    { zona: 'Palermo', cantidad: 45, fill: '#3B82F6' },
    { zona: 'Belgrano', cantidad: 32, fill: '#10B981' },
    { zona: 'Recoleta', cantidad: 28, fill: '#F59E0B' },
    { zona: 'Puerto Madero', cantidad: 15, fill: '#8B5CF6' },
    { zona: 'Villa Crespo', cantidad: 22, fill: '#EF4444' },
  ];

  // KPIs de Reportes
  const kpisReportes = [
    { title: 'Ingresos Totales', value: `$${ventasPorMes.reduce((sum, v) => sum + v.comisiones, 0).toLocaleString()}`, desc: 'Últimos 6 meses', icon: <FaDollarSign />, color: 'from-green-500 to-green-600' },
    { title: 'Operaciones', value: ventasPorMes.reduce((sum, v) => sum + v.ventas + v.alquileres, 0), desc: 'Ventas + Alquileres', icon: <FaHome />, color: 'from-blue-500 to-blue-600' },
    { title: 'Agentes Activos', value: rendimientoAgentes.length, desc: 'Rating promedio: 4.6', icon: <FaUsers />, color: 'from-purple-500 to-purple-600' },
    { title: 'Crecimiento', value: '+23%', desc: 'vs período anterior', icon: <FaArrowUp />, color: 'from-orange-500 to-orange-600' },
  ];

  const cardBase = 'rounded-xl shadow-md p-6 bg-white dark:bg-secondary-dark-bg transition transform hover:scale-105';

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-main-bg dark:bg-main-dark-bg rounded-3xl">
      <Header category="Analítica" title="📊 Reportes y Estadísticas" />
      
      {/* Botones de Acción */}
      <div className="flex gap-3 mb-6">
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md">
          <FaChartBar /> Generar Reporte
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-md">
          <FaDownload /> Exportar PDF
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">
          <FaFilter /> Filtros Avanzados
        </button>
        <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200 transition-colors">
          <FaCalendarAlt /> Período
        </button>
      </div>

      {/* KPIs de Reportes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        {kpisReportes.map((kpi, i) => (
          <div key={i} className={`${cardBase} overflow-hidden`}>
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

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Ventas y Alquileres */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📈 Evolución Mensual</h3>
          <ChartComponent
            id="ventas-alquileres-chart"
            primaryXAxis={{ valueType: 'Category', title: 'Meses' }}
            primaryYAxis={{ title: 'Cantidad' }}
            tooltip={{ enable: true }}
            legendSettings={{ visible: true }}
            height="350px"
          >
            <Inject services={[ColumnSeries, LineSeries, Legend, Tooltip, Category]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={ventasPorMes}
                xName="mes"
                yName="ventas"
                type="Column"
                name="Ventas"
                fill="#10B981"
              />
              <SeriesDirective
                dataSource={ventasPorMes}
                xName="mes"
                yName="alquileres"
                type="Column"
                name="Alquileres"
                fill="#3B82F6"
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>

        {/* Gráfico de Propiedades por Zona */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🗺️ Propiedades por Zona</h3>
          <AccumulationChartComponent
            id="zonas-chart"
            tooltip={{ enable: true }}
            legendSettings={{ visible: true }}
            height="350px"
          >
            <Inject services={[PieSeries, AccumulationLegend, AccumulationDataLabel, AccumulationTooltip]} />
            <AccumulationSeriesCollectionDirective>
              <AccumulationSeriesDirective
                type="Pie"
                dataSource={propiedadesPorZona}
                xName="zona"
                yName="cantidad"
                name="Propiedades"
                innerRadius="40%"
                dataLabel={{ visible: true, name: 'zona', position: 'Outside' }}
              />
            </AccumulationSeriesCollectionDirective>
          </AccumulationChartComponent>
        </div>
      </div>

      {/* Gráfico de Comisiones y Grid de Rendimiento */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">💰 Evolución de Comisiones</h3>
          <ChartComponent
            id="comisiones-chart"
            primaryXAxis={{ valueType: 'Category', title: 'Meses' }}
            primaryYAxis={{ title: 'Comisiones ($)' }}
            tooltip={{ enable: true }}
            legendSettings={{ visible: false }}
            height="300px"
          >
            <Inject services={[SplineAreaSeries, Category, Tooltip]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                type="Area"
                dataSource={ventasPorMes}
                xName="mes"
                yName="comisiones"
                name="Comisiones"
                fill={currentColor || '#8B5CF6'}
                opacity={0.7}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>

        {/* Grid de Rendimiento de Agentes */}
        <div className={cardBase}>
          <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">🏆 Rendimiento de Agentes</h3>
          <GridComponent
            dataSource={rendimientoAgentes}
            allowPaging
            pageSettings={{ pageSize: 5 }}
            allowSorting
          >
            <GridInject services={[Page, Sort]} />
            <ColumnsDirective>
              <ColumnDirective field="agente" headerText="Agente" width="150" />
              <ColumnDirective field="ventas" headerText="Ventas" textAlign="Center" width="80" />
              <ColumnDirective field="comisiones" headerText="Comisiones" textAlign="Right" width="120" format="C0" />
              <ColumnDirective field="rating" headerText="Rating" textAlign="Center" width="80" />
            </ColumnsDirective>
          </GridComponent>
        </div>
      </div>

      {/* Panel de Exportación y Filtros */}
      <div className={cardBase}>
        <h3 className="text-lg font-semibold mb-4 dark:text-gray-100">📋 Opciones de Exportación</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="p-6 border-2 border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaDownload className="text-4xl text-red-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">PDF Completo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Reporte ejecutivo</p>
              <p className="text-xs text-gray-500 mt-1">Todos los gráficos</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaDownload className="text-4xl text-green-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Excel</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Datos en tablas</p>
              <p className="text-xs text-gray-500 mt-1">Para análisis</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaCalendarAlt className="text-4xl text-blue-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Programado</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Envío automático</p>
              <p className="text-xs text-gray-500 mt-1">Semanal/Mensual</p>
            </div>
          </div>

          <div className="text-center">
            <div className="p-6 border-2 border-purple-500 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
              <FaFilter className="text-4xl text-purple-500 mx-auto mb-3" />
              <h4 className="font-bold dark:text-gray-200">Personalizado</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Filtros avanzados</p>
              <p className="text-xs text-gray-500 mt-1">Por período/agente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
