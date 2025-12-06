import React from 'react';
import { FaPlug, FaCheck, FaTimes } from 'react-icons/fa';
import { Header } from '../components';

const Integraciones = () => {
  const integraciones = [
    { nombre: 'ZonaProp', descripcion: 'Portal inmobiliario líder', conectado: true, logo: '🏢' },
    { nombre: 'ArgentinaProp', descripcion: 'Publicación de propiedades', conectado: true, logo: '🏘️' },
    { nombre: 'MercadoLibre', descripcion: 'Marketplace de propiedades', conectado: false, logo: '🛒' },
    { nombre: 'Google Calendar', descripcion: 'Sincronización de citas', conectado: true, logo: '📅' },
    { nombre: 'WhatsApp Business', descripcion: 'Mensajería con clientes', conectado: false, logo: '💬' },
    { nombre: 'Mailchimp', descripcion: 'Email marketing', conectado: false, logo: '📧' },
  ];

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Header category="Configuración" title="Integraciones" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integraciones.map((int, index) => (
          <div key={index} className="border dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{int.logo}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                int.conectado ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
              }`}>
                {int.conectado ? <><FaCheck className="inline mr-1" /> Conectado</> : <><FaTimes className="inline mr-1" /> Desconectado</>}
              </span>
            </div>
            <h3 className="text-lg font-bold dark:text-gray-200 mb-2">{int.nombre}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{int.descripcion}</p>
            <button className={`w-full py-2 px-4 rounded-lg transition-colors ${
              int.conectado ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}>
              {int.conectado ? 'Desconectar' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Integraciones;
