import React, { useEffect, useState } from 'react';
import {
  FaUserFriends,
  FaRegCalendarAlt,
  FaHome,
  FaTasks,
  FaTrophy,
  FaCheckCircle,
  FaUsers,
  FaClock,
  FaPhoneAlt,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';
import { Header } from '../components';

const AgentDashboard = () => {
  const [showNewRecord, setShowNewRecord] = useState(false);

  useEffect(() => {
    if (!showNewRecord) return;
    const timer = setTimeout(() => {
      setShowNewRecord(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, [showNewRecord]);

  // Vista inicial del agente: resumen simple de su actividad
  const kpis = [
    {
      title: 'Leads activos',
      value: 12,
      desc: 'En seguimiento',
      icon: <FaUserFriends />,
      color: 'from-blue-500 to-blue-600',
      trend: '+8%',
    },
    {
      title: 'Visitas hoy',
      value: 3,
      desc: 'Agendadas en tu calendario',
      icon: <FaRegCalendarAlt />,
      color: 'from-emerald-500 to-emerald-600',
      trend: '+12%',
    },
    {
      title: 'Propiedades asignadas',
      value: 18,
      desc: 'Activas en tu cartera',
      icon: <FaHome />,
      color: 'from-indigo-500 to-indigo-600',
      trend: '+5%',
    },
    {
      title: 'Tareas pendientes',
      value: 7,
      desc: 'Por completar hoy',
      icon: <FaTasks />,
      color: 'from-orange-500 to-orange-600',
      trend: '+3%',
    },
  ];

  const proximasCitas = [
    {
      hora: '10:00',
      cliente: 'Juan Pérez',
      propiedad: 'Depto 2 ambientes - Palermo',
      estado: 'Confirmada',
    },
    {
      hora: '14:30',
      cliente: 'María Gómez',
      propiedad: 'Casa 3 dormitorios - Belgrano',
      estado: 'Pendiente de confirmación',
    },
  ];

  const tareas = [
    'Llamar a leads nuevos de ayer',
    'Actualizar estado de oferta en Propiedad #1243',
    'Enviar resumen de visitas al cliente López',
  ];

  const cardBase = 'rounded-xl shadow-md p-6 bg-white dark:bg-secondary-dark-bg transition-all duration-300 hover:scale-[1.01] hover:shadow-lg';

  return (
    <div className="p-6 bg-main-bg dark:bg-main-dark-bg min-h-screen">
      <Header category="Agente" title="Panel del Agente" />

      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={() => setShowNewRecord(true)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-pink-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200"
        >
          <FaTrophy className="text-sm" />
          <span>Celebrar nuevo récord</span>
        </button>
      </div>

      {/* Trofeos (badges) centrados en la parte superior */}
      <div className="flex justify-center mb-8 gap-6">
        <img
          src="/assets/firstSaleBadge.svg"
          alt="First Sale Badge"
          className="h-12 md:h-16 w-auto drop-shadow-xl"
        />
        <img
          src="/assets/goldenStarBadge.svg"
          alt="Golden Star Badge"
          className="h-12 md:h-16 w-auto drop-shadow-xl"
        />
        <img
          src="/assets/HighQuaityBadge.svg"
          alt="High Quality Badge"
          className="h-12 md:h-16 w-auto drop-shadow-xl"
        />
      </div>
      {/* KPIs de logros e insignias del agente (al tope del dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Nivel de experiencia (a la izquierda) */}
        <div className={`${cardBase} bg-gradient-to-br from-amber-100 via-amber-50 to-white dark:from-amber-900/40 dark:via-amber-800/40 dark:to-secondary-dark-bg border border-amber-300/60 dark:border-amber-700/60`}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-amber-900 dark:text-amber-100 uppercase tracking-wide">
              Nivel de experiencia
            </p>
            <div className="flex items-center gap-1 bg-amber-500 text-white text-[11px] px-2 py-1 rounded-full shadow-sm">
              <FaTrophy className="text-xs" />
              <span>Ranking SENIOR</span>
            </div>
          </div>
          <p className="mt-1 text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            Senior
          </p>
          <div className="mt-2 flex items-center gap-1 text-yellow-400">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaRegStar />
            <span className="ml-2 text-xs font-medium text-gray-700 dark:text-gray-200">
              4/5 estrellas
            </span>
          </div>
          <p className="mt-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            Basado en operaciones cerradas, reseñas de clientes y cumplimiento de objetivos mensuales.
          </p>
        </div>

        {/* Racha de actividad (estilo desafíos de videojuego) */}
        <div className={`${cardBase} bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Racha de actividad
              </p>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-emerald-900/60 border border-emerald-300/40">
                Desafío diario
              </span>
            </div>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              14 días
            </p>
            <p className="mt-1 text-[11px] text-emerald-100">
              Días consecutivos registrando citas o tareas en el CRM.
            </p>

            {/* Barra de progreso tipo videojuego */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-semibold">Racha actual</span>
                <span>Objetivo: 21 días</span>
              </div>
              <div className="w-full bg-emerald-900/50 rounded-full h-2.5 overflow-hidden">
                <div className="bg-gradient-to-r from-lime-300 via-yellow-300 to-orange-300 h-2.5 rounded-full" style={{ width: '66%' }} />
              </div>
            </div>

            {/* Logros de racha tipo insignias pequeñas */}
            <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-1 rounded-full bg-emerald-900/60 border border-emerald-300/40">
                +XP diario
              </span>
              <span className="px-2 py-1 rounded-full bg-emerald-900/60 border border-emerald-300/40">
                Bonus 7 días
              </span>
              <span className="px-2 py-1 rounded-full bg-emerald-900/60 border border-emerald-300/40">
                Cerca del logro 21
              </span>
            </div>
          </div>
        </div>

        {/* Insignias obtenidas (más atractiva) */}
        <div className={`${cardBase} bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 text-white relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_55%)]" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Insignias obtenidas
              </p>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-indigo-900/60 border border-indigo-300/40">
                Colección
              </span>
            </div>
            <p className="mt-1 text-3xl font-extrabold tracking-tight">
              3
            </p>
            <p className="mt-1 text-[11px] text-sky-100">
              Trofeos destacados por desempeño comercial.
            </p>

            {/* Mini etiquetas de las insignias */}
            <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
              <span className="px-2 py-1 rounded-full bg-indigo-900/70 border border-sky-300/50">
                First Sale
              </span>
              <span className="px-2 py-1 rounded-full bg-indigo-900/70 border border-sky-300/50">
                Golden Star
              </span>
              <span className="px-2 py-1 rounded-full bg-indigo-900/70 border border-sky-300/50">
                High Quality
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs principales del agente (misma estructura que DashboardEjecutivo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className={`${cardBase} overflow-hidden relative cursor-pointer`}
          >
            {/* Barra de color superior */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${kpi.color}`} />

            {/* Contenido principal */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`text-2xl text-white p-3 rounded-lg bg-gradient-to-br ${kpi.color} shadow-lg`}>
                    {kpi.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      {kpi.title}
                    </p>
                    <p className="text-3xl font-bold dark:text-gray-100 mt-1">
                      {kpi.value}
                    </p>
                  </div>
                </div>

                {/* Descripción y tendencia */}
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {kpi.desc}
                  </p>
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {kpi.trend}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Seguimiento post-cita (widget resumido debajo de KPIs) */}
      <div className="mb-8">
        <div className={cardBase}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-6 border-2 border-green-500 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <FaCheckCircle className="text-4xl text-green-500 mx-auto mb-3" />
                <h4 className="font-bold dark:text-gray-200">Completadas</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Citas finalizadas</p>
                <p className="text-2xl font-bold text-green-600 mt-2">18</p>
                <p className="text-xs text-gray-500">Esta semana</p>
              </div>
            </div>

            <div className="text-center">
              <div className="p-6 border-2 border-blue-500 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <FaUsers className="text-4xl text-blue-500 mx-auto mb-3" />
                <h4 className="font-bold dark:text-gray-200">Interesados</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Clientes con interés</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">12</p>
                <p className="text-xs text-gray-500">Requieren seguimiento</p>
              </div>
            </div>

            <div className="text-center">
              <div className="p-6 border-2 border-yellow-500 rounded-lg hover:bg-yellow-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <FaClock className="text-4xl text-yellow-500 mx-auto mb-3" />
                <h4 className="font-bold dark:text-gray-200">Reagendar</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Citas a reprogramar</p>
                <p className="text-2xl font-bold text-yellow-600 mt-2">3</p>
                <p className="text-xs text-gray-500">Pendientes</p>
              </div>
            </div>

            <div className="text-center">
              <div className="p-6 border-2 border-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-gray-800 cursor-pointer transition-colors">
                <FaPhoneAlt className="text-4xl text-red-500 mx-auto mb-3" />
                <h4 className="font-bold dark:text-gray-200">No Contactados</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Sin respuesta</p>
                <p className="text-2xl font-bold text-red-600 mt-2">2</p>
                <p className="text-xs text-gray-500">Requieren atención</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Próximas citas */}
        <div className="lg:col-span-2">
          <div className={cardBase}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Próximas citas
              </h2>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                {proximasCitas.length} hoy
              </span>
            </div>

            <div className="space-y-3">
              {proximasCitas.map((cita, index) => (
                <div
                  key={`${cita.cliente}-${index}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                      {cita.cliente}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cita.propiedad}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {cita.hora}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cita.estado}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tareas rápidas */}
        <div>
          <div className={cardBase}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Tareas rápidas
            </h2>
            <ul className="space-y-2">
              {tareas.map((tarea) => (
                <li
                  key={tarea}
                  className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40 text-sm text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
                >
                  {tarea}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Widget adicional: rendimiento personal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={cardBase}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FaTrophy className="text-yellow-500" />
              Rendimiento personal
            </h2>
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
              Este mes
            </span>
          </div>

          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
            <div className="flex items-center justify-between">
              <span>Objetivo de operaciones</span>
              <span className="font-semibold">12 / 20</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full" style={{ width: '60%' }} />
            </div>

            <div className="flex items-center justify-between mt-4">
              <span>Conversión de leads</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">24%</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mantén una tasa de conversión por encima del 20% para cumplir tus metas mensuales.
            </p>
          </div>
        </div>
      </div>

      {showNewRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative mx-4 max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl dark:bg-secondary-dark-bg/95">
            <div className="pointer-events-none absolute -top-6 -left-4 text-4xl select-none">
              🎉
            </div>
            <div className="pointer-events-none absolute -top-4 -right-4 text-4xl select-none">
              🎊
            </div>
            <div className="pointer-events-none absolute bottom-0 left-3 text-3xl opacity-80 select-none">
              🎉
            </div>
            <div className="pointer-events-none absolute bottom-2 right-6 text-3xl opacity-80 select-none">
              🎊
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-amber-100 px-4 py-1 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                <FaTrophy className="mr-2 text-lg" />
                <span className="text-xs font-semibold tracking-wide uppercase">
                  Nuevo récord alcanzado
                </span>
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50">
                ¡Nuevo récord!
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                Has superado tu mejor marca de rendimiento. Comparte este logro con tu equipo y sigue sumando resultados.
              </p>

              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-md">
                  <span>Récord de citas y oportunidades este mes</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNewRecord(false)}
                  className="mt-1 rounded-full border border-gray-300 px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
