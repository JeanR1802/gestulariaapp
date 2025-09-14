// Archivo: app/components/editor/controls/ColorPalette.tsx (NUEVO)
'use client';
import React from 'react';
import { ColorPicker } from './ColorPicker';

// Lista de colores predefinidos (clases de Tailwind)
const colors = [
  { name: 'Blanco', class: 'bg-white', ring: 'ring-slate-300' },
  { name: 'Gris Claro', class: 'bg-slate-100', ring: 'ring-slate-300' },
  { name: 'Gris Oscuro', class: 'bg-slate-800', ring: 'ring-slate-500' },
  { name: 'Azul', class: 'bg-blue-600', ring: 'ring-blue-400' },
  { name: 'Rojo', class: 'bg-red-600', ring: 'ring-red-400' },
  { name: 'Verde', class: 'bg-green-600', ring: 'ring-green-400' },
];

interface ColorPaletteProps {
  label: string;
  selectedColor: string;
  onChange: (colorClass: string) => void;
}

// Permite seleccionar un color personalizado además de los predefinidos
const customColorOption = { name: 'Personalizado', class: 'custom', ring: 'ring-blue-400' };

export function ColorPalette({ label, selectedColor, onChange }: ColorPaletteProps) {
  const [showCustom, setShowCustom] = React.useState(false);
  const [customColor, setCustomColor] = React.useState('#ff0000');

  React.useEffect(() => {
    if (selectedColor?.startsWith('[')) {
      setCustomColor(selectedColor.replace(/\[|\]/g, ''));
    }
  }, [selectedColor]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-3 items-center">
        {colors.map((color) => (
          <button
            key={color.class}
            type="button"
            title={color.name}
            onClick={() => onChange(color.class)}
            className={`w-8 h-8 rounded-full ${color.class} border border-slate-200 transition-all ${selectedColor === color.class ? `ring-2 ${color.ring} ring-offset-2` : 'hover:scale-110'}`}
          />
        ))}
        {/* Botón para color personalizado */}
        <button
          type="button"
          title="Color personalizado"
          onClick={() => setShowCustom(true)}
          className={`w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center bg-gradient-to-br from-white to-slate-200 text-xs font-bold ${selectedColor?.startsWith('[') ? 'ring-2 ring-blue-400 ring-offset-2' : 'hover:scale-110'}`}
        >
          +
        </button>
        {showCustom && (
          <div className="absolute z-30 mt-2 bg-white p-4 rounded-lg shadow-lg border flex flex-col items-center gap-2">
            <ColorPicker
              color={customColor}
              onChange={setCustomColor}
              label="Color personalizado"
            />
            <button
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() => {
                onChange(`[${customColor}]`);
                setShowCustom(false);
              }}
            >
              Aplicar
            </button>
            <button
              className="text-xs text-slate-500 mt-1 hover:underline"
              onClick={() => setShowCustom(false)}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}