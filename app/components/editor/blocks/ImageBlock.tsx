'use client';
import React, { useRef, JSX } from 'react';
import { useEditable } from 'use-editable';
import { cn } from '@/lib/utils';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { InputField } from './InputField';

// --- Interfaces de Datos ---
export interface ImageData {
  variant: 'default' | 'bordered' | 'fullwidth';
  imageUrl: string;
  alt: string;
  caption?: string;
}

import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { BlockComponentProps } from './index';

// --- Helper Component for Inline Editing ---
const Editable = ({
  tagName,
  value,
  onUpdate,
  isEditing,
  className,
  style,
}: {
  tagName: keyof JSX.IntrinsicElements;
  value: string;
  onUpdate: (newValue: string) => void;
  isEditing?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const ref = useRef<HTMLElement>(null);
  useEditable(
    ref,
    (newValue) => onUpdate(newValue.replace(/<[^>]*>?/gm, '')),
    { disabled: !isEditing }
  );

  return React.createElement(
    tagName,
    {
      ref: ref,
      className: cn(className, {
        'outline-dashed outline-1 outline-gray-400 focus:outline-blue-500': isEditing,
      }),
      style: style,
    },
    value
  );
};

// --- Componente de Bloque (Visual + Inline Editing) ---
export function ImageBlock({ data, isEditing, onUpdate }: BlockComponentProps<ImageData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'bordered':
      return <ImageBordered {...props} />;
    case 'fullwidth':
      return <ImageFullWidth {...props} />;
    default:
      return <ImageDefault {...props} />;
  }
}

// --- Variantes Visuales ---
const ImageDefault = ({ data, isEditing, onUpdate }: BlockComponentProps<ImageData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const handleUpdate = (key: keyof ImageData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };
  return (
    <figure className={cn('text-center my-4', { 'px-8': isDesktop, 'px-4': isTablet, 'px-2': isMobile })}>
      <img
        src={data.imageUrl || 'https://placehold.co/800x450/e2e8f0/64748b?text=Imagen'}
        alt={data.alt}
        className="mx-auto rounded-lg max-w-full h-auto"
      />
      <Editable
        tagName="span"
        value={data.alt}
        onUpdate={(v) => handleUpdate('alt', v)}
        isEditing={isEditing}
        className="sr-only"
      />
      {typeof data.caption !== 'undefined' && (
        <figcaption className="mt-2 text-sm text-slate-500 italic">
          <Editable
            tagName="span"
            value={data.caption || ''}
            onUpdate={(v) => handleUpdate('caption', v)}
            isEditing={isEditing}
            className=""
          />
        </figcaption>
      )}
    </figure>
  );
};

const ImageBordered = ({ data, isEditing, onUpdate }: BlockComponentProps<ImageData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const handleUpdate = (key: keyof ImageData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };
  return (
    <figure className={cn('text-center my-4', { 'p-8': isDesktop, 'p-4': isTablet, 'p-2': isMobile })}>
      <img
        src={data.imageUrl || 'https://placehold.co/800x450/e2e8f0/64748b?text=Imagen'}
        alt={data.alt}
        className="mx-auto max-w-full h-auto rounded-lg border-4 border-white shadow-lg"
      />
      <Editable
        tagName="span"
        value={data.alt}
        onUpdate={(v) => handleUpdate('alt', v)}
        isEditing={isEditing}
        className="sr-only"
      />
      {typeof data.caption !== 'undefined' && (
        <figcaption className="mt-3 text-sm text-slate-500 italic">
          <Editable
            tagName="span"
            value={data.caption || ''}
            onUpdate={(v) => handleUpdate('caption', v)}
            isEditing={isEditing}
            className=""
          />
        </figcaption>
      )}
    </figure>
  );
};

const ImageFullWidth = ({ data, isEditing, onUpdate }: BlockComponentProps<ImageData>) => {
  const handleUpdate = (key: keyof ImageData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };
  return (
    <figure className="w-full my-4">
      <img
        src={data.imageUrl || 'https://placehold.co/1200x600/e2e8f0/64748b?text=Imagen+Ancho+Completo'}
        alt={data.alt}
        className="w-full h-auto"
      />
      <Editable
        tagName="span"
        value={data.alt}
        onUpdate={(v) => handleUpdate('alt', v)}
        isEditing={isEditing}
        className="sr-only"
      />
      {typeof data.caption !== 'undefined' && (
        <figcaption className="mt-2 text-sm text-slate-500 italic text-center px-4">
          <Editable
            tagName="span"
            value={data.caption || ''}
            onUpdate={(v) => handleUpdate('caption', v)}
            isEditing={isEditing}
            className=""
          />
        </figcaption>
      )}
    </figure>
  );
};

// --- Editor de Contenido ---
export function ImageContentEditor({ data, updateData }: { data: ImageData; updateData: (key: keyof ImageData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="URL de la imagen" value={data.imageUrl} onChange={(e) => updateData('imageUrl', e.target.value)} />
      <InputField label="Texto alternativo (para SEO)" value={data.alt} onChange={(e) => updateData('alt', e.target.value)} />
      <InputField label="Pie de foto (opcional)" value={data.caption || ''} onChange={(e) => updateData('caption', e.target.value)} />
    </div>
  );
}

// --- Editor de Estilo ---
export function ImageStyleEditor({ data, updateData }: { data: ImageData; updateData: (key: keyof ImageData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">No hay opciones de estilo adicionales para este bloque.</p>
    </div>
  );
}
