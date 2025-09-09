// app/components/editor/controls/ButtonColorPalette.tsx (VERSIÓN CORREGIDA Y ROBUSTA)
'use client';
import React from 'react';

// Se exporta la interfaz de propiedades para asegurar consistencia en todo el proyecto.
export interface ButtonColorPaletteProps {
  label: string;
  selectedBgColor: string;
  selectedTextColor: string; // Propiedad que causaba el error, ahora correctamente definida.
  onChange: (bg: string, text: string) => void;
}

const CustomColorPicker = ({ label, color, onChange, title }: { label: string, color: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, title: string }) => {
  const isCustomColor = color?.startsWith('[#');
  const displayColor = isCustomColor ? color.slice(1, -1) : '#FFFFFF';

  return (
    <div className="relative" title={title}>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <div className="relative w-10 h-10">
        <input
          type="color"
          value={displayColor}
          onChange={onChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="w-full h-full rounded-full border-2 border-slate-200"
          style={{ backgroundColor: displayColor }}
        />
      </div>
    </div>
  );
};

export function ButtonColorPalette({ label, selectedBgColor, selectedTextColor, onChange }: ButtonColorPaletteProps) {
  
  const handleBgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(`[${e.target.value}]`, selectedTextColor || '[#ffffff]');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(selectedBgColor || '[#0066ff]', `[${e.target.value}]`);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex items-end gap-4 p-3 border rounded-lg bg-slate-50">
        <CustomColorPicker
          label="Fondo"
          title="Color de fondo del botón"
          color={selectedBgColor}
          onChange={handleBgChange}
        />
        <CustomColorPicker
          label="Texto"
          title="Color del texto del botón"
          color={selectedTextColor}
          onChange={handleTextChange}
        />
        <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1 text-center">Vista Previa</label>
            <div
                className="w-full text-center px-3 py-2 rounded-md text-sm font-semibold transition-all"
                style={{
                    backgroundColor: selectedBgColor?.startsWith('[#') ? selectedBgColor.slice(1, -1) : '#e2e8f0',
                    color: selectedTextColor?.startsWith('[#') ? selectedTextColor.slice(1, -1) : '#1f2937'
                }}
            >
                Botón
            </div>
        </div>
      </div>
    </div>
  );
}