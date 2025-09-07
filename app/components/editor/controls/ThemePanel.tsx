'use client';
import React from 'react';

// --- Interfaces de Datos para el Tema ---
export interface ColorTheme {
  primary: string;
  secondary: string;
  accent: string;
  textPrimary: string;
  textSecondary: string;
  background: string;
}

export interface TypographyTheme {
  font: string;
  h1Size: string;
  h2Size: string;
  pSize: string;
}

export interface Theme {
  colors: ColorTheme;
  typography: TypographyTheme;
}

// --- TEMA POR DEFECTO (AHORA EXPORTADO) ---
export const defaultTheme: Theme = {
  colors: {
    primary: '#0066ff',
    secondary: '#f3f4f6',
    accent: '#10b981',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    background: '#ffffff',
  },
  typography: { font: 'Inter', h1Size: '48px', h2Size: '36px', pSize: '16px' },
};

interface ThemePanelProps {
  theme: Theme;
  onThemeChange: (newTheme: Theme) => void;
  onClose: () => void;
}

export function ThemePanel({ theme, onThemeChange, onClose }: ThemePanelProps) {

  const handleColorChange = (key: keyof ColorTheme, value: string) => {
    onThemeChange({
      ...theme,
      colors: { ...theme.colors, [key]: value },
    });
  };

  const ColorInput = ({ label, colorKey }: { label: string, colorKey: keyof ColorTheme }) => (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="color"
          value={theme.colors[colorKey]}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="p-0 w-8 h-8 border-none rounded-md cursor-pointer"
          style={{ backgroundColor: theme.colors[colorKey] }}
        />
        <input
          type="text"
          value={theme.colors[colorKey]}
          onChange={(e) => handleColorChange(colorKey, e.target.value)}
          className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
        <div className="w-full max-w-sm h-full bg-white shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Tema Global del Sitio</h2>
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="space-y-4">
                    <h3 className="font-semibold text-slate-700">Paleta de Colores</h3>
                    <ColorInput label="Color de Fondo" colorKey="background" />
                    <ColorInput label="Texto Principal" colorKey="textPrimary" />
                    <ColorInput label="Texto Secundario" colorKey="textSecondary" />
                    <ColorInput label="Primario (Botones, Links)" colorKey="primary" />
                    <ColorInput label="Secundario (Fondos sutiles)" colorKey="secondary" />
                    <ColorInput label="Acento (Destacados)" colorKey="accent" />
                </div>
            </div>
            <div className="p-4 border-t bg-slate-50">
                <button
                    onClick={onClose}
                    className="w-full bg-slate-800 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-slate-700 transition-all"
                >
                    Hecho
                </button>
            </div>
        </div>
    </div>
  );
}