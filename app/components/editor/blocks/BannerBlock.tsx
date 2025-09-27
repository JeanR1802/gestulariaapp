import React from 'react';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

export interface BannerData {
  variant: 'info' | 'success' | 'promo';
  text: string;
  bgColor: string;
  textColor?: string;
  icon?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  height?: string; // Ej: 'h-12', 'h-16', 'h-20'
  textSize?: string; // Ej: 'text-sm', 'text-base', 'text-lg'
  textAlign?: 'left' | 'center' | 'right';
}

// --- Helpers seguros para colores ---
const getStyles = (color: string | undefined, defaultClass: string) => {
  if (!color) return { className: defaultClass, style: {} };
  if (color.startsWith('text-')) return { className: color, style: {} };
  if (color.startsWith('[#')) return { className: '', style: { color: color.slice(1, -1) } };
  return { className: '', style: { color } };
};
const getBackgroundStyles = (color: string | undefined, defaultClass = 'bg-blue-50') => {
  if (!color) return { className: defaultClass, style: {} };
  if (color.startsWith('bg-')) return { className: color, style: {} };
  if (color.startsWith('[#')) return { className: '', style: { backgroundColor: color.slice(1, -1) } };
  return { className: '', style: { backgroundColor: color } };
};

// --- COMPONENTE DE RENDERIZADO DEL BLOQUE ---
export const BannerBlock: React.FC<{ data: BannerData }> = ({ data }) => {
  const bg = getBackgroundStyles(data.bgColor, 'bg-blue-50');
  const text = getStyles(data.textColor, 'text-blue-900');
  const buttonBg = getBackgroundStyles(data.buttonBgColor, 'bg-yellow-400/90');
  const buttonText = getStyles(data.buttonTextColor, 'text-yellow-900');
  const heightClass = data.height || 'h-12';
  const textSizeClass = data.textSize || 'text-base';
  let alignClass = 'justify-center text-center';
  if (data.textAlign === 'left') alignClass = 'justify-start text-left';
  if (data.textAlign === 'right') alignClass = 'justify-end text-right';
  return (
    <div className={`w-full ${heightClass} flex items-center px-4 shadow-sm gap-2 ${bg.className} ${alignClass}`} style={bg.style}>
      <span className={`font-semibold ${text.className} ${textSizeClass}`} style={text.style}>{data.text}</span>
      {data.buttonText && (
        <button
          className={`ml-2 px-3 py-1 rounded-md font-semibold hover:bg-yellow-400 transition ${buttonBg.className} ${buttonText.className} ${textSizeClass}`}
          style={{ ...buttonBg.style, ...buttonText.style }}
        >
          {data.buttonText}
        </button>
      )}
    </div>
  );
};

// --- EDITOR DE CONTENIDO ---
export const BannerContentEditor: React.FC<{ data: BannerData; updateData: (key: keyof BannerData, value: string) => void }> = ({ data, updateData }) => (
  <div className="space-y-4">
    <div>
      <label className="text-sm font-medium text-slate-700 mb-1 block">Texto del banner</label>
      <input
        className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        value={data.text}
        onChange={e => updateData('text', e.target.value)}
        placeholder="Texto principal"
      />
    </div>
    {data.variant === 'promo' && (
      <div>
        <label className="text-sm font-medium text-slate-700 mb-1 block">Texto del botón (opcional)</label>
        <input
          className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={data.buttonText || ''}
          onChange={e => updateData('buttonText', e.target.value)}
          placeholder="Ej: Ver más"
        />
      </div>
    )}
  </div>
);

// --- EDITOR DE ESTILOS ---
export const BannerStyleEditor: React.FC<{ data: BannerData; updateData: (key: keyof BannerData, value: string) => void }> = ({ data, updateData }) => {
  const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="text-sm font-medium text-slate-700 w-full sm:w-1/3 flex-shrink-0">{children}</label>
  );

  const ControlWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">{children}</div>
  );

  return (
    <div className="space-y-4">
      <ColorPalette
        label="Color de Fondo"
        selectedColor={data.bgColor || ''}
        onChange={color => updateData('bgColor', color)}
      />
      <TextColorPalette
        label="Color de Texto"
        selectedColor={data.textColor || ''}
        onChange={color => updateData('textColor', color)}
      />
      <hr />
      <ControlWrapper>
        <Label>Alto</Label>
        <select
          className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={data.height || 'h-12'}
          onChange={e => updateData('height', e.target.value)}
        >
          <option value="h-8">Muy bajo</option>
          <option value="h-10">Bajo</option>
          <option value="h-12">Normal</option>
          <option value="h-16">Medio</option>
          <option value="h-20">Alto</option>
          <option value="h-24">Muy alto</option>
        </select>
      </ControlWrapper>
      <ControlWrapper>
        <Label>Tamaño Texto</Label>
        <select
          className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={data.textSize || 'text-base'}
          onChange={e => updateData('textSize', e.target.value)}
        >
          <option value="text-xs">XS</option>
          <option value="text-sm">SM</option>
          <option value="text-base">Base</option>
          <option value="text-lg">LG</option>
          <option value="text-xl">XL</option>
          <option value="text-2xl">2XL</option>
        </select>
      </ControlWrapper>
      <ControlWrapper>
        <Label>Alineación</Label>
        <select
          className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={data.textAlign || 'center'}
          onChange={e => updateData('textAlign', e.target.value as 'left' | 'center' | 'right')}
        >
          <option value="left">Izquierda</option>
          <option value="center">Centro</option>
          <option value="right">Derecha</option>
        </select>
      </ControlWrapper>
      {data.variant === 'promo' && (
        <>
          <hr />
          <ColorPalette
            label="Fondo del Botón"
            selectedColor={data.buttonBgColor || ''}
            onChange={color => updateData('buttonBgColor', color)}
          />
          <TextColorPalette
            label="Texto del Botón"
            selectedColor={data.buttonTextColor || ''}
            onChange={color => updateData('buttonTextColor', color)}
          />
        </>
      )}
    </div>
  );
};