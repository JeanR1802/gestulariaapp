// app/components/editor/controls/ButtonColorPalette.tsx (VERSIÓN CORREGIDA Y ROBUSTA)
'use client';
import React from 'react';

// Se exporta la interfaz de propiedades para asegurar consistencia en todo el proyecto.
export interface ButtonColorPaletteProps {
  label: string;
  selectedBgColor: string;
  selectedTextColor: string;
  onChange: (bg: string, text: string) => void;
}

const CustomColorPicker = ({ label, color, onApply, title }: { label: string, color: string, onApply: (color: string) => void, title: string }) => {
  const [tempColor, setTempColor] = React.useState(
    color?.startsWith('[#') ? color.slice(1, -1) : '#FFFFFF'
  );
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setTempColor(color?.startsWith('[#') ? color.slice(1, -1) : '#FFFFFF');
  }, [color]);

  return (
    <div className="relative" title={title}>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      <div className="relative w-10 h-10">
        <button
          type="button"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onClick={() => setOpen(true)}
          aria-label={`Seleccionar color personalizado para ${label}`}
        />
        <div
          className="w-full h-full rounded-full border-2 border-slate-200"
          style={{ backgroundColor: tempColor }}
        />
      </div>
      {open && (
        <div className="absolute left-0 mt-2 z-20 bg-white p-3 rounded-lg shadow-lg border flex flex-col items-center gap-2">
          <input
            type="color"
            value={tempColor}
            onChange={e => setTempColor(e.target.value)}
            className="w-10 h-10 border rounded-full"
          />
          <button
            className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => {
              onApply(`[${tempColor}]`);
              setOpen(false);
            }}
          >
            Aplicar
          </button>
          <button
            className="text-xs text-slate-500 mt-1 hover:underline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};

export function ButtonColorPalette({ label, selectedBgColor, selectedTextColor, onChange }: ButtonColorPaletteProps) {
  const handleBgApply = (color: string) => {
    onChange(color, selectedTextColor || '[#ffffff]');
  };
  const handleTextApply = (color: string) => {
    onChange(selectedBgColor || '[#0066ff]', color);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <div className="flex items-end gap-4 p-3 border rounded-lg bg-slate-50">
        <CustomColorPicker
          label="Fondo"
          title="Color de fondo del botón"
          color={selectedBgColor}
          onApply={handleBgApply}
        />
        <CustomColorPicker
          label="Texto"
          title="Color del texto del botón"
          color={selectedTextColor}
          onApply={handleTextApply}
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