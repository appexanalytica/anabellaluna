import React, { useState } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { FaComments, FaPaperPlane, FaCircle, FaSearch } from 'react-icons/fa';
import { useStateContext } from '../contexts/ContextProvider';
import { Button } from '.';

const ChatInterno = () => {
  const { currentColor, setIsClicked, initialState, currentMode } = useStateContext();
  const [mensajeNuevo, setMensajeNuevo] = useState('');
  const [chatActivo, setChatActivo] = useState(null);

  const conversaciones = [
    {
      id: 1,
      nombre: 'María González',
      avatar: '👩‍💼',
      ultimoMensaje: 'Perfecto, confirmo la visita',
      hora: '10:30',
      noLeidos: 2,
      online: true,
      rol: 'Agente Senior'
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      avatar: '👨‍💼',
      ultimoMensaje: 'Necesito las fotos de Belgrano',
      hora: '09:45',
      noLeidos: 0,
      online: true,
      rol: 'Agente'
    },
    {
      id: 3,
      nombre: 'Ana Martínez',
      avatar: '👩‍💻',
      ultimoMensaje: 'Cliente interesado en PH',
      hora: 'Ayer',
      noLeidos: 5,
      online: false,
      rol: 'Coordinadora'
    },
    {
      id: 4,
      nombre: 'Luis Torres',
      avatar: '👨‍💻',
      ultimoMensaje: 'Documentación lista ✓',
      hora: 'Ayer',
      noLeidos: 0,
      online: false,
      rol: 'Administrativo'
    },
    {
      id: 5,
      nombre: 'Equipo Ventas',
      avatar: '👥',
      ultimoMensaje: 'Reunión mañana 10am',
      hora: '2 días',
      noLeidos: 1,
      online: true,
      rol: 'Grupo'
    }
  ];

  const mensajesEjemplo = [
    {
      id: 1,
      remitente: 'María González',
      mensaje: 'Hola! Tengo un cliente interesado en el depto de Palermo',
      hora: '10:15',
      propio: false
    },
    {
      id: 2,
      remitente: 'Tú',
      mensaje: 'Genial! ¿Para cuándo quiere programar la visita?',
      hora: '10:18',
      propio: true
    },
    {
      id: 3,
      remitente: 'María González',
      mensaje: 'Mañana a las 15:00 si es posible',
      hora: '10:20',
      propio: false
    },
    {
      id: 4,
      remitente: 'Tú',
      mensaje: 'Perfecto, confirmo la visita. Te envío los detalles por email',
      hora: '10:25',
      propio: true
    },
    {
      id: 5,
      remitente: 'María González',
      mensaje: 'Perfecto, confirmo la visita',
      hora: '10:30',
      propio: false
    }
  ];

  const totalNoLeidos = conversaciones.reduce((sum, conv) => sum + conv.noLeidos, 0);

  const handleEnviarMensaje = () => {
    if (mensajeNuevo.trim()) {
      // Aquí iría la lógica para enviar el mensaje
      setMensajeNuevo('');
    }
  };

  return (
    <div className="nav-item absolute right-5 md:right-40 top-16 bg-white dark:bg-[#42464D] rounded-lg w-[420px] shadow-xl">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-600">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaComments className="text-2xl" style={{ color: currentColor }} />
            {totalNoLeidos > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalNoLeidos}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-lg dark:text-gray-200">Chat Interno</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {conversaciones.filter(c => c.online).length} en línea
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

      {/* Buscador */}
      <div className="p-3 border-b dark:border-gray-600">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Lista de Conversaciones */}
      {!chatActivo ? (
        <div className="max-h-96 overflow-y-auto">
          {conversaciones.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setChatActivo(conv)}
              className={`p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                conv.noLeidos > 0 ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="text-3xl">{conv.avatar}</div>
                  {conv.online && (
                    <FaCircle className="absolute bottom-0 right-0 text-green-500 text-xs bg-white dark:bg-gray-800 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm dark:text-gray-200 truncate">
                      {conv.nombre}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                      {conv.hora}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">{conv.rol}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate flex-1">
                      {conv.ultimoMensaje}
                    </p>
                    {conv.noLeidos > 0 && (
                      <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                        {conv.noLeidos}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Vista de Chat Activo */
        <div className="flex flex-col h-96">
          {/* Header del Chat */}
          <div className="p-3 border-b dark:border-gray-600 flex items-center gap-3">
            <button
              onClick={() => setChatActivo(null)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ←
            </button>
            <div className="text-2xl">{chatActivo.avatar}</div>
            <div className="flex-1">
              <h4 className="font-bold text-sm dark:text-gray-200">{chatActivo.nombre}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {chatActivo.online ? '🟢 En línea' : '⚫ Desconectado'}
              </p>
            </div>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800">
            {mensajesEjemplo.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.propio ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.propio
                      ? 'bg-blue-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {!msg.propio && (
                    <p className="text-xs font-bold mb-1 text-blue-600 dark:text-blue-400">
                      {msg.remitente}
                    </p>
                  )}
                  <p className="text-sm">{msg.mensaje}</p>
                  <p className={`text-xs mt-1 ${msg.propio ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {msg.hora}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de Mensaje */}
          <div className="p-3 border-t dark:border-gray-600">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={mensajeNuevo}
                onChange={(e) => setMensajeNuevo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensaje()}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200"
              />
              <button
                onClick={handleEnviarMensaje}
                className="p-2 rounded-lg text-white transition-colors"
                style={{ backgroundColor: currentColor }}
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      {!chatActivo && (
        <div className="p-3 border-t dark:border-gray-600">
          <button
            className="w-full py-2 rounded-lg font-medium transition-colors text-sm"
            style={{ backgroundColor: currentColor, color: 'white' }}
          >
            Ver Todos los Mensajes →
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatInterno;
