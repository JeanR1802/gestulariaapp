// Archivo: app/components/editor/controls/ColorPalette.tsx (NUEVO)
'use client';
import React from 'react';

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

export function ColorPalette({ label, selectedColor, onChange }: ColorPaletteProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => (
          <button
            key={color.class}
            type="button"
            title={color.name}
            onClick={() => onChange(color.class)}
            className={`w-8 h-8 rounded-full ${color.class} border border-slate-200 transition-all ${selectedColor === color.class ? `ring-2 ${color.ring} ring-offset-2` : 'hover:scale-110'}`}
          />
        ))}
      </div>
    </div>
  );
}