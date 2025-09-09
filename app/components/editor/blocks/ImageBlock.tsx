// app/components/editor/blocks/ImageBlock.tsx (VERSIÓN COMPLETA Y CORREGIDA)
'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { InputField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

// --- Interfaces de Datos ---
export interface ImageData {
  variant: 'default' | 'bordered' | 'fullwidth';
  imageUrl: string;
  alt: string;
  caption?: string;
}

// --- Componente de Bloque (Visual) ---
export function ImageBlock({ data }: { data: ImageData }) {
  switch (data.variant) {
    case 'bordered':
      return <ImageBordered data={data} />;
    case 'fullwidth':
      return <ImageFullWidth data={data} />;
    default:
      return <ImageDefault data={data} />;
  }
}

// --- Variantes Visuales ---
const ImageDefault = ({ data }: { data: ImageData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  return (
    <figure className={cn('text-center my-4', { 'px-8': isDesktop, 'px-4': isTablet, 'px-2': isMobile })}>
      <img
        src={data.imageUrl || 'https://placehold.co/800x450/e2e8f0/64748b?text=Imagen'}
        alt={data.alt}
        className="mx-auto rounded-lg max-w-full h-auto"
      />
      {data.caption && <figcaption className="mt-2 text-sm text-slate-500 italic">{data.caption}</figcaption>}
    </figure>
  );
};

const ImageBordered = ({ data }: { data: ImageData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  return (
    <figure className={cn('text-center my-4', { 'p-8': isDesktop, 'p-4': isTablet, 'p-2': isMobile })}>
      <img
        src={data.imageUrl || 'https://placehold.co/800x450/e2e8f0/64748b?text=Imagen'}
        alt={data.alt}
        className="mx-auto max-w-full h-auto rounded-lg border-4 border-white shadow-lg"
      />
      {data.caption && <figcaption className="mt-3 text-sm text-slate-500 italic">{data.caption}</figcaption>}
    </figure>
  );
};

const ImageFullWidth = ({ data }: { data: ImageData }) => {
  return (
    <figure className="w-full my-4">
      <img
        src={data.imageUrl || 'https://placehold.co/1200x600/e2e8f0/64748b?text=Imagen+Ancho+Completo'}
        alt={data.alt}
        className="w-full h-auto"
      />
      {data.caption && <figcaption className="mt-2 text-sm text-slate-500 italic text-center px-4">{data.caption}</figcaption>}
    </figure>
  );
};

// --- Editor de Contenido ---
export function ImageContentEditor({ data, updateData }: { data: ImageData; updateData: (key: keyof ImageData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField
        label="URL de la imagen"
        value={data.imageUrl}
        onChange={(e) => updateData('imageUrl', e.target.value)}
      />
      <InputField
        label="Texto alternativo (para SEO)"
        value={data.alt}
        onChange={(e) => updateData('alt', e.target.value)}
      />
      <InputField
        label="Pie de foto (opcional)"
        value={data.caption || ''}
        onChange={(e) => updateData('caption', e.target.value)}
      />
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