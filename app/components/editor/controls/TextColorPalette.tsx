// Archivo: app/components/editor/controls/TextColorPalette.tsx (NUEVO)
'use client';
import React from 'react';

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

export function TextColorPalette({ label, selectedColor, onChange }: TextColorPaletteProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-3">
        {textColors.map((color) => (
          <button
            key={color.class}
            type="button"
            title={color.name}
            onClick={() => onChange(color.class)}
            className={`w-8 h-8 rounded-full ${color.swatch} border-2 border-slate-200 transition-all ${selectedColor === color.class ? `ring-2 ${color.ring} ring-offset-2` : 'hover:scale-110'}`}
          />
        ))}
      </div>
    </div>
  );
}