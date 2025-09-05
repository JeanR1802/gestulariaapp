// Archivo: app/components/editor/controls/ButtonColorPalette.tsx (NUEVO)
'use client';
import React from 'react';

// Estilos de botón predefinidos (fondo, texto, borde, etc.)
const buttonStyles = [
  { name: 'Azul', bgClass: 'bg-blue-600', textClass: 'text-white', ring: 'ring-blue-400' },
  { name: 'Negro', bgClass: 'bg-slate-800', textClass: 'text-white', ring: 'ring-slate-500' },
  { name: 'Blanco', bgClass: 'bg-white', textClass: 'text-slate-800', ring: 'ring-slate-300' },
  { name: 'Verde', bgClass: 'bg-green-600', textClass: 'text-white', ring: 'ring-green-400' },
];

interface ButtonColorPaletteProps {
  label: string;
  selectedBgColor: string;
  onChange: (bgClass: string, textClass: string) => void;
}

export function ButtonColorPalette({ label, selectedBgColor, onChange }: ButtonColorPaletteProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-3">
        {buttonStyles.map((style) => (
          <button
            key={style.bgClass}
            type="button"
            title={style.name}
            onClick={() => onChange(style.bgClass, style.textClass)}
            className={`px-3 py-1 rounded-md text-sm ${style.bgClass} ${style.textClass} border border-slate-300 transition-all ${selectedBgColor === style.bgClass ? `ring-2 ${style.ring} ring-offset-2` : 'hover:scale-110'}`}
          >
            Aa
          </button>
        ))}
      </div>
    </div>
  );
}