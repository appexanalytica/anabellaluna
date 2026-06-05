import React, { useState, useMemo } from 'react';
import { FiX, FiSearch, FiLayout, FiSend } from 'react-icons/fi';

const extractVariables = (text) => {
  if (!text) return [];
  const matches = text.match(/\{\{(\d+)\}\}/g) || [];
  return [...new Set(matches.map((m) => m.replace(/\{\{|\}\}/g, '')))].sort((a, b) => Number(a) - Number(b));
};

const TemplatePreview = ({ template, variables, onChange }) => {
  const renderComponent = (component) => {
    const vars = extractVariables(component.text);
    let text = component.text || '';
    vars.forEach((v) => {
      text = text.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), variables[v] || `{{${v}}}`);
    });

    return (
      <div key={component.type} className="mb-2">
        {component.type === 'HEADER' && (
          <div className="font-bold text-gray-800 text-sm border-b pb-1 mb-1">{text}</div>
        )}
        {component.type === 'BODY' && (
          <div className="text-gray-700 text-sm whitespace-pre-wrap">{text}</div>
        )}
        {component.type === 'FOOTER' && (
          <div className="text-gray-400 text-xs mt-1 border-t pt-1">{text}</div>
        )}
        {component.type === 'BUTTONS' && component.buttons && (
          <div className="flex flex-col gap-1 mt-2">
            {component.buttons.map((btn, i) => (
              <div
                key={i}
                className="text-center text-sm py-1 rounded"
                style={{ color: '#00a5f4', borderTop: '1px solid #e9edef' }}
              >
                {btn.text}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const allVars = (template.components || []).reduce((acc, c) => {
    extractVariables(c.text).forEach((v) => acc.add(v));
    return acc;
  }, new Set());
  const varList = [...allVars].sort((a, b) => Number(a) - Number(b));

  return (
    <div>
      {/* Preview */}
      <div
        className="rounded-lg p-3 mb-4"
        style={{ backgroundColor: '#dcf8c6', border: '1px solid #c8e6c9' }}
      >
        {(template.components || []).map((c) => renderComponent(c))}
      </div>

      {/* Variable inputs */}
      {varList.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Completar variables</p>
          {varList.map((v) => (
            <div key={v} className="flex items-center gap-2">
              <span className="text-xs text-gray-500 w-10 flex-shrink-0">{`{{${v}}}`}</span>
              <input
                type="text"
                placeholder={`Variable ${v}`}
                value={variables[v] || ''}
                onChange={(e) => onChange(v, e.target.value)}
                className="flex-1 px-3 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const WhatsAppTemplateSelector = ({ templates = [], onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [variables, setVariables] = useState({});

  const approvedTemplates = useMemo(
    () => templates.filter((t) => t.status === 'APPROVED'),
    [templates]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return approvedTemplates;
    const term = search.toLowerCase();
    return approvedTemplates.filter(
      (t) => t.name?.toLowerCase().includes(term) || t.category?.toLowerCase().includes(term)
    );
  }, [approvedTemplates, search]);

  const handleSelectTemplate = (tpl) => {
    setSelected(tpl);
    setVariables({});
  };

  const handleVariableChange = (key, value) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const handleSend = () => {
    if (!selected) return;
    // Build components array with params
    const components = (selected.components || []).map((c) => {
      const vars = extractVariables(c.text);
      if (vars.length === 0) return { type: c.type };
      return {
        type: c.type,
        parameters: vars.map((v) => ({ type: 'text', text: variables[v] || '' })),
      };
    }).filter((c) => c.type);

    onSelect({
      templateName: selected.name,
      templateLanguage: selected.language || 'es',
      templateComponents: components,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div
        className="bg-white rounded-xl shadow-2xl flex flex-col"
        style={{ width: '580px', maxHeight: '85vh' }}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <FiLayout className="text-green-600" size={20} />
            <h2 className="font-semibold text-gray-800">Seleccionar Template</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <FiX size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Template list */}
          <div className="w-56 border-r border-gray-100 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={13} />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="text-center py-6 text-gray-400 text-sm">Sin resultados</div>
              ) : (
                filtered.map((tpl) => (
                  <div
                    key={tpl._id || tpl.name}
                    onClick={() => handleSelectTemplate(tpl)}
                    className="px-3 py-2.5 cursor-pointer border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    style={{ backgroundColor: selected?._id === tpl._id ? '#f0fdf4' : undefined }}
                  >
                    <p className="text-sm font-medium text-gray-800 truncate">{tpl.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{tpl.category} · {tpl.language}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Preview panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selected ? (
              <>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm">{selected.name}</h3>
                    <span className="text-xs text-gray-400">{selected.category} · {selected.language}</span>
                  </div>
                  <TemplatePreview
                    template={selected}
                    variables={variables}
                    onChange={handleVariableChange}
                  />
                </div>
                <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
                  <button
                    onClick={handleSend}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-white font-medium text-sm transition-colors"
                    style={{ backgroundColor: '#25d366' }}
                  >
                    <FiSend size={16} />
                    Enviar template
                  </button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FiLayout size={36} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Seleccioná un template para ver la vista previa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppTemplateSelector;
