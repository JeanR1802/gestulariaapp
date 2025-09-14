// app/components/editor/controls/ButtonColorPalette.tsx (VERSIÓN CORREGIDA Y ROBUSTA)
'use client';
import React from 'react';
import { ColorPicker } from './ColorPicker';

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
        <div>
          {/* Overlay modal */}
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity animate-fadeIn" onClick={() => setOpen(false)} />
          {/* Panel centrado */}
          <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white/90 p-6 rounded-2xl shadow-2xl border flex flex-col items-center gap-4 w-[90vw] max-w-xs animate-fadeIn" style={{backdropFilter:'blur(8px)'}}>
            <label className="block text-base font-semibold text-slate-700 mb-2">{label}</label>
            <ColorPicker
              color={tempColor}
              onChange={setTempColor}
              label={label}
            />
            <div className="flex gap-3 w-full mt-2">
              <button
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition text-base"
                onClick={() => {
                  onApply(`[${tempColor}]`);
                  setOpen(false);
                }}
              >
                Aplicar
              </button>
              <button
                className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition text-base"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
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