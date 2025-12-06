import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { FaBell, FaExclamationTriangle, FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
import { Button } from '.';

const Alertas = () => {
  const { currentColor, setIsClicked, initialState } = useStateContext();

  const alertas = [
    {
      id: 1,
      tipo: 'urgente',
      titulo: 'Cliente sin respuesta',
      mensaje: 'Juan Pérez no responde hace 48 horas',
      tiempo: 'Hace 2 horas',
      accion: 'Contactar ahora',
      icon: <FaExclamationTriangle />,
      color: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      textColor: 'text-red-600 dark:text-red-400',
      leida: false
    },
    {
      id: 2,
      tipo: 'importante',
      titulo: 'Contrato por vencer',
      mensaje: 'Alquiler Av. Cabildo 2800 vence en 15 días',
      tiempo: 'Hace 3 horas',
      accion: 'Ver contrato',
      icon: <FaTimesCircle />,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      leida: false
    },
    {
      id: 3,
      tipo: 'info',
      titulo: 'Nueva consulta web',
      mensaje: 'Interesado en Penthouse Recoleta',
      tiempo: 'Hace 5 horas',
      accion: 'Ver consulta',
      icon: <FaInfoCircle />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      leida: false
    },
    {
      id: 4,
      tipo: 'urgente',
      titulo: 'Visita cancelada',
      mensaje: 'Cliente canceló visita Casa Belgrano',
      tiempo: 'Hace 6 horas',
      accion: 'Reprogramar',
      icon: <FaExclamationTriangle />,
      color: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-500',
      textColor: 'text-red-600 dark:text-red-400',
      leida: false
    },
    {
      id: 5,
      tipo: 'exito',
      titulo: 'Venta confirmada',
      mensaje: 'Loft Puerto Madero - $420,000',
      tiempo: 'Hace 8 horas',
      accion: 'Ver detalles',
      icon: <FaCheckCircle />,
      color: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      leida: true
    },
    {
      id: 6,
      tipo: 'info',
      titulo: 'Documento subido',
      mensaje: 'Escritura PH Colegiales disponible',
      tiempo: 'Ayer',
      accion: 'Descargar',
      icon: <FaInfoCircle />,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      leida: true
    },
    {
      id: 7,
      tipo: 'importante',
      titulo: 'Precio actualizado',
      mensaje: 'Depto Palermo redujo precio 10%',
      tiempo: 'Ayer',
      accion: 'Ver propiedad',
      icon: <FaInfoCircle />,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      borderColor: 'border-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      leida: true
    }
  ];

  const alertasNoLeidas = alertas.filter(a => !a.leida).length;

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-6 rounded-lg w-96 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaBell className="text-2xl" style={{ color: currentColor }} />
            {alertasNoLeidas > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {alertasNoLeidas}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-lg dark:text-gray-200">Alertas del Sistema</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {alertasNoLeidas} sin leer
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
        {alertas.map((alerta) => (
          <div
            key={alerta.id}
            className={`${alerta.color} border-l-4 ${alerta.borderColor} p-4 rounded-lg hover:shadow-md transition-all cursor-pointer ${
              alerta.leida ? 'opacity-70' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`text-xl ${alerta.textColor}`}>
                {alerta.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-bold text-sm dark:text-gray-200">
                    {alerta.titulo}
                  </h4>
                  {!alerta.leida && (
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {alerta.mensaje}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {alerta.tiempo}
                  </span>
                  <button
                    className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${alerta.textColor} hover:bg-opacity-20`}
                    style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                  >
                    {alerta.accion}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-600 space-y-2">
        <div className="flex items-center justify-between">
          <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
            Marcar todas como leídas
          </button>
          <button className="text-sm font-medium" style={{ color: currentColor }}>
            Configurar alertas
          </button>
        </div>
        <button
          className="w-full py-2 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: currentColor, color: 'white' }}
        >
          Ver Todas las Alertas →
        </button>
      </div>
    </div>
  );
};

export default Alertas;
