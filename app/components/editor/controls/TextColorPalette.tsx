// Archivo: app/components/editor/controls/TextColorPalette.tsx (NUEVO)
'use client';
import React from 'react';
import { ColorPicker } from './ColorPicker';

// Lista de colores de texto predefinidos (clases de Tailwind)
const textColors = [
  { name: 'Negro', class: 'text-slate-800', ring: 'ring-slate-400', swatch: 'bg-slate-800' },
  { name: 'Gris', class: 'text-slate-600', ring: 'ring-slate-400', swatch: 'bg-slate-600' },
  { name: 'Blanco', class: 'text-white', ring: 'ring-slate-300', swatch: 'bg-white' },
];

interface TextColorPaletteProps {
  label: string;
  selectedColor: string;
  onChange: (colorClass: string) => void;
}

// Permite seleccionar un color personalizado además de los predefinidos
const customTextColorOption = { name: 'Personalizado', class: 'custom', ring: 'ring-blue-400', swatch: 'bg-gradient-to-br from-white to-slate-200' };

export function TextColorPalette({ label, selectedColor, onChange }: TextColorPaletteProps) {
  const [showCustom, setShowCustom] = React.useState(false);
  const [customColor, setCustomColor] = React.useState('#ff0000');

  React.useEffect(() => {
    if (selectedColor?.startsWith('[')) {
      setCustomColor(selectedColor.replace(/\[|\]/g, ''));
    }
  }, [selectedColor]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2" style={{ color: '#334155' }}>{label}</label>
      <div className="flex flex-wrap gap-3 items-center">
        {textColors.map((color) => (
          <button
            key={color.class}
            type="button"
            title={color.name}
            onClick={() => onChange(color.class)}
            className={`w-8 h-8 rounded-full ${color.swatch} border-2 border-slate-200 transition-all ${selectedColor === color.class ? `ring-2 ${color.ring} ring-offset-2` : 'hover:scale-110'}`}
          />
        ))}
        {/* Botón para color personalizado */}
        <button
          type="button"
          title="Color personalizado"
          onClick={() => setShowCustom(true)}
          className={`w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center bg-gradient-to-br from-white to-slate-200 text-xs font-bold ${selectedColor?.startsWith('[') ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:scale-110'}`}
        >
          +
        </button>
        {showCustom && (
          <div>
            {/* Overlay modal */}
            <div className="fixed inset-0 z-[70] bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setShowCustom(false)} />
            {/* Panel centrado */}
            <div className="fixed left-1/2 top-1/2 z-[80] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl shadow-2xl border flex flex-col items-center gap-4 w-[90vw] max-w-xs">
              <label className="block text-base font-semibold text-slate-700 mb-2">Color personalizado</label>
              <ColorPicker
                color={customColor}
                onChange={setCustomColor}
                label=""
              />
              <div className="flex gap-3 w-full mt-2">
                <button
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-base"
                  onClick={() => {
                    onChange(`[${customColor}]`);
                    setShowCustom(false);
                  }}
                >
                  Aplicar
                </button>
                <button
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition text-base"
                  onClick={() => setShowCustom(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}