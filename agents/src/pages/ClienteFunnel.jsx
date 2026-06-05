import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  FaFilter, FaGripVertical, FaDollarSign, FaFire,
} from 'react-icons/fa';
import { crmService } from '../services/crmService';

export const FUNNEL_STAGES = [
  { id: 'Lead',           label: 'Nuevo Lead',     color: '#3B82F6', emoji: '🎯', desc: 'Primer contacto' },
  { id: 'Contactado',     label: 'Contactado',      color: '#8B5CF6', emoji: '📞', desc: 'Contacto realizado' },
  { id: 'Calificado',     label: 'Calificado',      color: '#F59E0B', emoji: '⭐', desc: 'Perfil confirmado' },
  { id: 'En Negociación', label: 'En Negociación',  color: '#F97316', emoji: '🤝', desc: 'Negociando' },
  { id: 'Propuesta',      label: 'Propuesta',       color: '#EC4899', emoji: '📋', desc: 'Propuesta enviada' },
  { id: 'Convertido',     label: 'Ganado',          color: '#10B981', emoji: '✅', desc: 'Operación cerrada' },
  { id: 'Perdido',        label: 'Perdido',         color: '#EF4444', emoji: '❌', desc: 'Oportunidad perdida' },
];

const getLifebarColor = (pct) => {
  if (pct >= 60) return '#10B981';
  if (pct >= 30) return '#F59E0B';
  return '#EF4444';
};

const formatMoney = (n) => {
  if (!n || n === 0) return null;
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n}`;
};

const getInitials = (nombre) =>
  (nombre || '').split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

const ClienteFunnel = ({ clientes, lifebars, isDark, onStageChange }) => {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [moving, setMoving] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const textMain = isDark ? 'text-gray-100' : 'text-gray-900';
  const textMuted = isDark ? 'text-gray-400' : 'text-gray-500';

  const filtered = clientes.filter((c) => {
    if (filtroTipo === 'todos') return true;
    return (c.tipoCliente || c.tipo) === filtroTipo;
  });

  const byStage = (stageId) =>
    filtered.filter((c) => (c.estado || 'Lead') === stageId);

  const stageValue = (stageId) =>
    byStage(stageId).reduce((s, c) => s + (c.presupuesto || 0), 0);

  // Drag handlers
  const handleDragStart = (e, clienteId) => {
    setDraggedId(String(clienteId));
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(clienteId));
  };

  const handleDragOver = (e, stageId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverStage !== stageId) setDragOverStage(stageId);
  };

  const handleDrop = async (e, newStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const clienteId = draggedId || e.dataTransfer.getData('text/plain');
    if (!clienteId) return;
    const cliente = clientes.find((c) => String(c.id) === clienteId || String(c._id) === clienteId);
    if (!cliente) return;
    const oldStage = cliente.estado || 'Lead';
    if (oldStage === newStage) { setDraggedId(null); return; }

    setMoving(true);
    // Optimistic update
    onStageChange(clienteId, newStage, oldStage);
    try {
      await crmService.clientes.updateStage(clienteId, newStage);
      const stageLbl = FUNNEL_STAGES.find((s) => s.id === newStage)?.label || newStage;
      toast.success(`${cliente.nombre} → ${stageLbl}`);
    } catch {
      // Rollback
      onStageChange(clienteId, oldStage, newStage);
      toast.error('No se pudo mover el cliente');
    } finally {
      setMoving(false);
      setDraggedId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  return (
    <div>
      {/* ── Filtro de tipo ─────────────────────────────────── */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <FaFilter className={`${textMuted} text-xs`} />
        {['todos', 'Comprador', 'Propietario', 'Inversor'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFiltroTipo(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              filtroTipo === t
                ? 'bg-blue-500 text-white'
                : isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t === 'todos' ? 'Todos' : t}s
          </button>
        ))}
        {moving && (
          <span className={`text-xs ${textMuted} animate-pulse ml-2`}>Guardando cambio...</span>
        )}
      </div>

      {/* ── Kanban Board ───────────────────────────────────── */}
      <div
        className="flex gap-4 overflow-x-auto pb-6"
        style={{ minHeight: 520 }}
      >
        {FUNNEL_STAGES.map((stage) => {
          const stageClientes = byStage(stage.id);
          const isOver = dragOverStage === stage.id;
          const val = stageValue(stage.id);

          return (
            <div
              key={stage.id}
              className={`flex-shrink-0 rounded-2xl border transition-all duration-200 ${
                isOver
                  ? isDark
                    ? 'border-blue-400 bg-blue-900/20 scale-[1.01]'
                    : 'border-blue-400 bg-blue-50 scale-[1.01]'
                  : isDark
                  ? 'border-gray-700 bg-gray-800/40'
                  : 'border-gray-200 bg-gray-50'
              }`}
              style={{ width: 240, borderTop: `4px solid ${stage.color}` }}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={() => setDragOverStage(null)}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              {/* Column header */}
              <div className="px-3 pt-3 pb-2">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{stage.emoji}</span>
                    <span className={`text-xs font-bold ${textMain}`}>{stage.label}</span>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stageClientes.length}
                  </span>
                </div>
                <p className={`text-xs ${textMuted}`}>{stage.desc}</p>
                {val > 0 && (
                  <p className="text-xs font-semibold text-emerald-500 mt-1">
                    {formatMoney(val)}
                  </p>
                )}
              </div>

              {/* Drop zone separator */}
              {isOver && (
                <div
                  className="mx-3 mb-2 h-1 rounded-full"
                  style={{ backgroundColor: stage.color, opacity: 0.6 }}
                />
              )}

              {/* Cards */}
              <div className="px-2 pb-3 flex flex-col gap-2" style={{ minHeight: 380 }}>
                {stageClientes.map((cliente) => {
                  const lbPct = lifebars?.[String(cliente.id)] ?? lifebars?.[String(cliente._id)] ?? 100;
                  const dragging = draggedId === String(cliente.id);

                  return (
                    <div
                      key={cliente.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, cliente.id)}
                      onDragEnd={handleDragEnd}
                      className={`rounded-xl border p-3 cursor-grab active:cursor-grabbing select-none transition-all ${
                        dragging
                          ? 'opacity-30 scale-95'
                          : isDark
                          ? 'bg-gray-800 border-gray-700 hover:border-gray-500 hover:shadow-lg'
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
                      }`}
                    >
                      {/* Avatar + name */}
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ backgroundColor: stage.color }}
                        >
                          {getInitials(cliente.nombre)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${textMain}`}>
                            {cliente.nombre}
                          </p>
                          <p className={`text-xs truncate ${textMuted}`}>
                            {cliente.tipoCliente || cliente.tipo || 'Comprador'}
                          </p>
                        </div>
                        <FaGripVertical className={`text-xs ${textMuted} flex-shrink-0`} />
                      </div>

                      {/* Presupuesto */}
                      {cliente.presupuesto > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <FaDollarSign className="text-emerald-500 text-xs flex-shrink-0" />
                          <span className={`text-xs font-semibold ${textMain}`}>
                            {formatMoney(cliente.presupuesto)}{' '}
                            <span className={textMuted}>{cliente.moneda || 'USD'}</span>
                          </span>
                        </div>
                      )}

                      {/* Scoring + zona */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <FaFire
                            className={`text-xs ${
                              cliente.scoring >= 70 ? 'text-orange-500' : textMuted
                            }`}
                          />
                          <span className={`text-xs ${textMuted}`}>{cliente.scoring ?? 50}/100</span>
                        </div>
                        {cliente.zonaInteres && (
                          <span
                            className={`text-xs truncate max-w-[80px] ${textMuted}`}
                            title={cliente.zonaInteres}
                          >
                            {cliente.zonaInteres}
                          </span>
                        )}
                      </div>

                      {/* Lifebar */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs ${textMuted}`}>Actividad</span>
                          <span
                            className="text-xs font-semibold"
                            style={{ color: getLifebarColor(lbPct) }}
                          >
                            {Math.round(lbPct)}%
                          </span>
                        </div>
                        <div
                          className={`w-full h-1.5 rounded-full ${
                            isDark ? 'bg-gray-700' : 'bg-gray-200'
                          }`}
                        >
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{
                              width: `${Math.min(lbPct, 100)}%`,
                              backgroundColor: getLifebarColor(lbPct),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {stageClientes.length === 0 && !isOver && (
                  <div
                    className={`flex flex-col items-center justify-center py-10 text-center ${textMuted}`}
                  >
                    <span className="text-3xl mb-2 opacity-20">{stage.emoji}</span>
                    <p className="text-xs">Sin clientes</p>
                    <p className="text-xs opacity-50 mt-0.5">Arrastrá aquí</p>
                  </div>
                )}

                {isOver && (
                  <div
                    className="flex items-center justify-center py-6 rounded-xl border-2 border-dashed text-xs"
                    style={{ borderColor: stage.color, color: stage.color }}
                  >
                    Soltar aquí →
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClienteFunnel;
