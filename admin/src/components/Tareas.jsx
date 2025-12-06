import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { FaTasks, FaCheckCircle, FaClock, FaExclamationCircle, FaUser } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
import { Button } from '.';

const Tareas = () => {
  const { currentColor, setIsClicked, initialState } = useStateContext();

  const tareasPendientes = [
    {
      id: 1,
      titulo: 'Seguimiento cliente - Juan Pérez',
      descripcion: 'Enviar documentación de propiedad Palermo',
      prioridad: 'Alta',
      vencimiento: 'Hoy 15:00',
      agente: 'María González',
      completada: false,
      color: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      icon: '🔴'
    },
    {
      id: 2,
      titulo: 'Visita programada',
      descripcion: 'Casa Belgrano - Cliente interesado',
      prioridad: 'Alta',
      vencimiento: 'Hoy 17:30',
      agente: 'Carlos Ruiz',
      completada: false,
      color: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      icon: '🏠'
    },
    {
      id: 3,
      titulo: 'Actualizar fotos propiedad',
      descripcion: 'PH Colegiales - Nuevas fotos profesionales',
      prioridad: 'Media',
      vencimiento: 'Mañana',
      agente: 'Ana Martínez',
      completada: false,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-500',
      icon: '📸'
    },
    {
      id: 4,
      titulo: 'Preparar contrato',
      descripcion: 'Loft Puerto Madero - Cliente confirmado',
      prioridad: 'Alta',
      vencimiento: 'Hoy 18:00',
      agente: 'Luis Torres',
      completada: false,
      color: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      icon: '📄'
    },
    {
      id: 5,
      titulo: 'Llamar a tasador',
      descripcion: 'Evaluar propiedad nueva en Recoleta',
      prioridad: 'Media',
      vencimiento: 'Esta semana',
      agente: 'María González',
      completada: false,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-500',
      icon: '📞'
    },
    {
      id: 6,
      titulo: 'Reunión equipo ventas',
      descripcion: 'Revisar metas del mes',
      prioridad: 'Baja',
      vencimiento: 'Viernes 10:00',
      agente: 'Todos',
      completada: true,
      color: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500',
      icon: '✅'
    }
  ];

  const tareasPendientesCount = tareasPendientes.filter(t => !t.completada).length;

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-6 rounded-lg w-96 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FaTasks className="text-2xl" style={{ color: currentColor }} />
          <div>
            <p className="font-semibold text-lg dark:text-gray-200">Tareas Pendientes</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tareasPendientesCount} de {tareasPendientes.length} pendientes
            </p>
          </div>
        </div>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={() => setIsClicked(initialState)}
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {tareasPendientes.map((tarea) => (
          <div
            key={tarea.id}
            className={`${tarea.color} border-l-4 ${tarea.borderColor} p-4 rounded-lg hover:shadow-md transition-all cursor-pointer ${
              tarea.completada ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{tarea.icon}</div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-bold text-sm dark:text-gray-200 ${
                    tarea.completada ? 'line-through' : ''
                  }`}>
                    {tarea.titulo}
                  </h4>
                  {tarea.completada && (
                    <FaCheckCircle className="text-green-500 text-lg" />
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {tarea.descripcion}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FaClock className={tarea.prioridad === 'Alta' ? 'text-red-500' : 'text-gray-400'} />
                    <span>{tarea.vencimiento}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    tarea.prioridad === 'Alta'
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                      : tarea.prioridad === 'Media'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                  }`}>
                    {tarea.prioridad}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <FaUser />
                  <span>{tarea.agente}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-600 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tareas completadas hoy:</span>
          <span className="font-bold text-green-600 dark:text-green-400">
            {tareasPendientes.filter(t => t.completada).length}
          </span>
        </div>
        <button
          className="w-full py-2 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: currentColor, color: 'white' }}
        >
          Ver Todas las Tareas →
        </button>
      </div>
    </div>
  );
};

export default Tareas;
