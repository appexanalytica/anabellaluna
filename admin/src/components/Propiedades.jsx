import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { FaHome, FaMapMarkerAlt, FaDollarSign, FaEye } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
import { Button } from '.';

const Propiedades = () => {
  const { currentColor, setIsClicked, initialState } = useStateContext();

  const propiedadesRecientes = [
    {
      id: 1,
      nombre: 'Depto 2 amb Palermo',
      direccion: 'Av. Santa Fe 3200',
      precio: '$185,000',
      estado: 'Disponible',
      visitas: 45,
      imagen: '🏢',
      color: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500'
    },
    {
      id: 2,
      nombre: 'Casa 3 amb Belgrano',
      direccion: 'Cabildo 2800',
      precio: '$320,000',
      estado: 'Reservada',
      visitas: 32,
      imagen: '🏠',
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-500'
    },
    {
      id: 3,
      nombre: 'PH Colegiales',
      direccion: 'Av. Cabildo 1500',
      precio: '$275,000',
      estado: 'En Negociación',
      visitas: 28,
      imagen: '🏘️',
      color: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-500'
    },
    {
      id: 4,
      nombre: 'Loft Puerto Madero',
      direccion: 'Juana Manso 500',
      precio: '$420,000',
      estado: 'Disponible',
      visitas: 67,
      imagen: '🏙️',
      color: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500'
    },
    {
      id: 5,
      nombre: 'Penthouse Recoleta',
      direccion: 'Av. Callao 1200',
      precio: '$850,000',
      estado: 'Disponible',
      visitas: 89,
      imagen: '🏛️',
      color: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-500'
    }
  ];

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] p-6 rounded-lg w-96 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FaHome className="text-2xl" style={{ color: currentColor }} />
          <p className="font-semibold text-lg dark:text-gray-200">Propiedades Recientes</p>
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
        {propiedadesRecientes.map((propiedad) => (
          <div
            key={propiedad.id}
            className={`${propiedad.color} border-l-4 ${propiedad.borderColor} p-4 rounded-lg hover:shadow-md transition-all cursor-pointer`}
          >
            <div className="flex items-start gap-3">
              <div className="text-3xl">{propiedad.imagen}</div>
              <div className="flex-1">
                <h4 className="font-bold text-sm dark:text-gray-200 mb-1">
                  {propiedad.nombre}
                </h4>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 mb-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{propiedad.direccion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="text-green-600 dark:text-green-400" />
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {propiedad.precio}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <FaEye />
                    <span>{propiedad.visitas} visitas</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    propiedad.estado === 'Disponible'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : propiedad.estado === 'Reservada'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  }`}>
                    {propiedad.estado}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t dark:border-gray-600">
        <button
          className="w-full py-2 rounded-lg font-medium transition-colors"
          style={{ backgroundColor: currentColor, color: 'white' }}
        >
          Ver Todas las Propiedades →
        </button>
      </div>
    </div>
  );
};

export default Propiedades;
