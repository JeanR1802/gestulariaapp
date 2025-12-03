// app/components/editor/blocks/TextBlock.tsx (REFACTORED with use-editable)
'use client';
import React, { useRef, useEffect, JSX } from 'react';
import { cn } from '@/lib/utils';
import { useEditable } from 'use-editable';
import { BlockComponentProps } from './index';

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
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff', 'text-slate-600': '#475569', 'text-slate-700': '#334155',
    'text-slate-800': '#1e293b', 'text-slate-900': '#0f172a', 'text-blue-600': '#2563eb',
  };
  if (!color) return { className: defaultClass, style: { color: colorMap[defaultClass] || '#334155' } };
  if (color.startsWith('[#')) return { className: '', style: { color: color.slice(1, -1) } };
  return { className: color, style: { color: colorMap[color] || '#334155' } };
};

const getBackgroundStyles = (color: string | undefined, defaultClass = 'bg-white') => {
  const bgMap: Record<string, string> = {
    'bg-white': '#ffffff', 'bg-slate-50': '#f8fafc', 'bg-slate-100': '#f1f5f9',
    'bg-yellow-100': '#fef9c3', 'bg-blue-600': '#2563eb',
  };
  if (!color) return { className: defaultClass, style: { backgroundColor: bgMap[defaultClass] || '#ffffff' } };
  if (color.startsWith('[#')) return { className: '', style: { backgroundColor: color.slice(1, -1) } };
  return { className: color, style: { backgroundColor: bgMap[color] || '#ffffff' } };
};

// --- Editable Inline Component (reusable) ---
type EditableProps = {
  tagName: keyof HTMLElementTagNameMap;
  value: string;
  onUpdate: (newValue: string) => void;
  isEditing?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const Editable: React.FC<EditableProps> = ({ tagName, value, onUpdate, isEditing, className, style }) => {
  const ref = React.useRef<HTMLElement>(null);
  useEditable(ref, (newValue) => onUpdate(newValue.replace(/<[^>]*>?/gm, '')), { disabled: !isEditing });

  // decode HTML entities so values like "&#x1F4A1;" render as emoji inside the editor
  const decodeEntities = (s: string) => {
    if (typeof document === 'undefined') return s;
    try {
      const el = document.createElement('div');
      el.innerHTML = s;
      return el.textContent ?? s;
    } catch (e) {
      return s;
    }
  };

  const displayValue = decodeEntities(value || '');

  return React.createElement(
    tagName,
    {
      ref: ref as React.Ref<HTMLElement>,
      className: cn(className, { 'outline-dashed outline-1 outline-gray-400 focus:outline-blue-500': isEditing }),
      style,
      contentEditable: isEditing || undefined,
      suppressContentEditableWarning: true,
    },
    displayValue
  );
};

// --- Componente Visual ---
export function TextBlock({ data, isEditing, onUpdate }: BlockComponentProps<TextData>) {
  const handleUpdate = (key: keyof TextData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-transparent');
  const text = getStyles(data.textColor, 'text-slate-700');

  if (data.variant === 'quote') {
    return (
      <div className={cn('py-8 px-4', bg.className)} style={bg.style}>
        <blockquote
          className={cn('border-l-4 border-slate-300 pl-6 italic max-w-3xl mx-auto', text.className)}
          style={text.style}
        >
          <Editable
            tagName="p"
            value={data.content}
            onUpdate={v => handleUpdate('content', v)}
            isEditing={isEditing}
            className="w-full bg-transparent"
            style={{}}
          />
        </blockquote>
      </div>
    );
  }

  if (data.variant === 'highlighted') {
    return (
      <div className={cn('py-4 px-4', bg.className)} style={bg.style}>
        <div className="max-w-4xl mx-auto">
          <div className={cn('p-4 rounded-lg', bg.className || 'bg-yellow-100/60')}>
            <Editable
              tagName="p"
              value={data.content}
              onUpdate={v => handleUpdate('content', v)}
              isEditing={isEditing}
              className={cn(text.className || 'text-yellow-800')}
              style={text.style}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-4 px-4', bg.className)} style={bg.style}>
      <div className="max-w-4xl mx-auto">
        <Editable
          tagName="p"
          value={data.content}
          onUpdate={v => handleUpdate('content', v)}
          isEditing={isEditing}
          className={cn('leading-relaxed', text.className)}
          style={text.style}
        />
      </div>
    </div>
  );
}

// --- Editor de CONTENIDO ---
export function TextContentEditor({ data, updateData }: { data: TextData; updateData: (key: keyof TextData, value: string) => void; }) {
  return (
    <div className="space-y-2">
      <label htmlFor="textContent" className="text-sm font-medium text-slate-700">Contenido</label>
      <textarea
        id="textContent"
        value={data.content}
        onChange={(e) => updateData('content', e.target.value)}
        className="w-full h-40 border rounded-md px-2 py-1.5 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Escribe tu texto aquí..."
      />
    </div>
  );
}

// --- Editor de ESTILO (para la barra de herramientas flotante / hoja inferior) ---
export function TextStyleEditor({
  data,
  updateData,
}: {
  data: TextData;
  updateData: (key: keyof TextData, value: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <ColorPalette
          label="Fondo"
          selectedColor={data.backgroundColor || ''}
          onChange={color => updateData('backgroundColor', color)}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette
          label="Texto"
          selectedColor={data.textColor || ''}
          onChange={color => updateData('textColor', color)}
        />
      </div>
    </div>
  );
}

// --- Helper para exportar Editable y usarlo en otros bloques ---
export { Editable };