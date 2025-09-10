// Reemplaza el contenido de app/components/editor/blocks/TextBlock.tsx
'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

// --- Interfaces de Datos ---
export interface TextData {
  variant: 'default' | 'quote' | 'highlighted';
  content: string;
  backgroundColor?: string;
  textColor?: string;
}

// --- Helpers seguros para colores ---
const getStyles = (color: string | undefined, defaultClass: string) => {
  if (!color) return { className: defaultClass, style: {} };
  if (color.startsWith('[#')) return { className: '', style: { color: color.slice(1, -1) } };
  return { className: color, style: {} };
};

const getBackgroundStyles = (color: string | undefined, defaultClass = 'bg-white') => {
  if (!color) return { className: defaultClass, style: {} };
  if (color.startsWith('[#')) return { className: '', style: { backgroundColor: color.slice(1, -1) } };
  return { className: color, style: {} };
};

// --- Componente Visual ---
export function TextBlock({ data }: { data: TextData }) {
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-transparent');
  const text = getStyles(data.textColor, 'text-slate-700');

  if (data.variant === 'quote') {
    return (
      <div className={cn('py-8 px-4', bg.className)} style={bg.style}>
        <blockquote
          className={cn('border-l-4 border-slate-300 pl-6 italic max-w-3xl mx-auto', text.className)}
          style={text.style}
        >
          <p className="text-xl">{data.content}</p>
        </blockquote>
      </div>
    );
  }

  if (data.variant === 'highlighted') {
    return (
      <div className={cn('py-4 px-4', bg.className)} style={bg.style}>
        <div className="max-w-4xl mx-auto">
          <div className={cn('p-4 rounded-lg', bg.className || 'bg-yellow-100/60')}>
            <p className={cn(text.className || 'text-yellow-800')} style={text.style}>
              {data.content}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-4 px-4', bg.className)} style={bg.style}>
      <div className="max-w-4xl mx-auto">
        <p className={cn('leading-relaxed', text.className)} style={text.style}>
          {data.content}
        </p>
      </div>
    </div>
  );
}

// --- Editor de CONTENIDO ---
export function TextContentEditor({
  data,
  updateData,
}: {
  data: TextData;
  updateData: (key: keyof TextData, value: string) => void;
}) {
  return (
    <div className="space-y-4 p-1">
      <TextareaField
        label="Contenido del bloque de texto"
        value={data.content}
        rows={8}
        onChange={(e) => updateData('content', e.target.value)}
      />
    </div>
  );
}

// --- Editor de ESTILO ---
export function TextStyleEditor({
  data,
  updateData,
}: {
  data: TextData;
  updateData: (key: keyof TextData, value: string) => void;
}) {
  const [customTextColor, setCustomTextColor] = React.useState<string>(data.textColor?.startsWith('[#') ? data.textColor.slice(2, -1) : '#000000');
  const [customBgColor, setCustomBgColor] = React.useState<string>(data.backgroundColor?.startsWith('[#') ? data.backgroundColor.slice(2, -1) : '#ffffff');
  const isCustomText = data.textColor?.startsWith('[#');
  const isCustomBg = data.backgroundColor?.startsWith('[#');
  return (
    <div className="space-y-4">
      <div>
        <ColorPalette
          label="Color de Fondo"
          selectedColor={isCustomBg ? '' : data.backgroundColor || 'bg-transparent'}
          onChange={(color) => updateData('backgroundColor', color)}
        />
        <div className="flex items-center gap-2 mt-2">
          <label className="text-sm text-slate-700">Fondo personalizado:</label>
          <input
            type="color"
            value={customBgColor}
            onChange={e => {
              setCustomBgColor(e.target.value);
              updateData('backgroundColor', `[${e.target.value}]`);
            }}
            className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
            title="Elegir color personalizado de fondo"
          />
        </div>
      </div>
      <div>
        <TextColorPalette
          label="Color del Texto"
          selectedColor={isCustomText ? '' : data.textColor || 'text-slate-700'}
          onChange={(color) => updateData('textColor', color)}
        />
        <div className="flex items-center gap-2 mt-2">
          <label className="text-sm text-slate-700">Texto personalizado:</label>
          <input
            type="color"
            value={customTextColor}
            onChange={e => {
              setCustomTextColor(e.target.value);
              updateData('textColor', `[${e.target.value}]`);
            }}
            className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
            title="Elegir color personalizado de texto"
          />
        </div>
      </div>
    </div>
  );
}