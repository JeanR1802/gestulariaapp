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
  if (!color) return { className: defaultClass, style: {} };
  if (color.startsWith('[#')) return { className: '', style: { color: color.slice(1, -1) } };
  return { className: color, style: {} };
};

const getBackgroundStyles = (color: string | undefined, defaultClass = 'bg-white') => {
  if (!color) return { className: defaultClass, style: {} };
  if (color.startsWith('[#')) return { className: '', style: { backgroundColor: color.slice(1, -1) } };
  return { className: color, style: {} };
};

// --- Editable Inline Component (reusable) ---
type EditableProps = {
  tagName: keyof JSX.IntrinsicElements;
  value: string;
  onUpdate: (newValue: string) => void;
  isEditing?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

const Editable: React.FC<EditableProps> = ({ tagName, value, onUpdate, isEditing, className, style }) => {
  const ref = React.useRef<HTMLElement>(null);
  useEditable(ref, (newValue) => onUpdate(newValue.replace(/<[^>]*>?/gm, '')), { disabled: !isEditing });
  const Tag = tagName as keyof JSX.IntrinsicElements;
  return (
    <Tag
      ref={ref}
      className={cn(className, { 'outline-dashed outline-1 outline-gray-400 focus:outline-blue-500': isEditing })}
      style={style}
      contentEditable={isEditing || undefined}
      suppressContentEditableWarning={true}
    >
      {value}
    </Tag>
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