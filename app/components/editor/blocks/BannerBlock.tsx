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

export const BannerEditorPlaceholder: React.FC<{ data: BannerData; updateData: (key: keyof BannerData, value: BannerData[keyof BannerData]) => void }> = () => (
  <div className="text-gray-400 text-sm p-2">Editor de banner no implementado.</div>
);

export const BannerContentEditor: React.FC<{ data: BannerData; updateData: (key: keyof BannerData, value: BannerData[keyof BannerData]) => void }> = ({ data, updateData }) => (
  <div className="flex flex-col gap-2 p-2">
    <label className="text-xs font-semibold text-gray-600">Texto del banner</label>
    <input
      className="border rounded px-2 py-1 text-sm"
      value={data.text}
      onChange={e => updateData('text', e.target.value)}
      placeholder="Texto principal"
    />
    <label className="text-xs font-semibold text-gray-600">Color de fondo</label>
    <input
      className="border rounded px-2 py-1 text-sm"
      value={data.bgColor}
      onChange={e => updateData('bgColor', e.target.value)}
      placeholder="Clase Tailwind o color"
    />
    <label className="text-xs font-semibold text-gray-600">Color de texto</label>
    <input
      className="border rounded px-2 py-1 text-sm"
      value={data.textColor || ''}
      onChange={e => updateData('textColor', e.target.value)}
      placeholder="Clase Tailwind o color"
    />
    {data.variant === 'promo' && (
      <>
        <label className="text-xs font-semibold text-gray-600">Texto del botón (opcional)</label>
        <input
          className="border rounded px-2 py-1 text-sm"
          value={data.buttonText || ''}
          onChange={e => updateData('buttonText', e.target.value)}
          placeholder="Texto del botón"
        />
      </>
    )}
  </div>
);

export const BannerStyleEditor: React.FC<{ data: BannerData; updateData: (key: keyof BannerData, value: BannerData[keyof BannerData]) => void }> = ({ data, updateData }) => (
  <div className="space-y-3">
    <div className="flex items-center gap-2">
      <ColorPalette
        label="Fondo"
        selectedColor={data.bgColor || ''}
        onChange={color => updateData('bgColor', color)}
      />
    </div>
    <div className="flex items-center gap-2">
      <TextColorPalette
        label="Texto"
        selectedColor={data.textColor || ''}
        onChange={color => updateData('textColor', color)}
      />
    </div>
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-600">Alto</label>
      <select
        className="border rounded px-2 py-1 text-sm"
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
    </div>
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-600">Tamaño texto</label>
      <select
        className="border rounded px-2 py-1 text-sm"
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
    </div>
    <div className="flex items-center gap-2">
      <label className="text-xs font-semibold text-gray-600">Alineación</label>
      <select
        className="border rounded px-2 py-1 text-sm"
        value={data.textAlign || 'center'}
        onChange={e => updateData('textAlign', e.target.value as 'left' | 'center' | 'right')}
      >
        <option value="left">Izquierda</option>
        <option value="center">Centro</option>
        <option value="right">Derecha</option>
      </select>
    </div>
    {data.variant === 'promo' && (
      <div className="flex items-center gap-2">
        <ColorPalette
          label="Fondo botón"
          selectedColor={data.buttonBgColor || ''}
          onChange={color => updateData('buttonBgColor', color)}
        />
        <TextColorPalette
          label="Texto botón"
          selectedColor={data.buttonTextColor || ''}
          onChange={color => updateData('buttonTextColor', color)}
        />
      </div>
    )}
  </div>
);