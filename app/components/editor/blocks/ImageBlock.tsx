// Archivo: app/components/editor/blocks/ImageBlock.tsx (ACTUALIZADO)
import React from 'react';
import { InputField } from './InputField';

// 1. Añadimos la propiedad 'variant' a la interfaz
export interface ImageData {
  variant: 'default' | 'bordered' | 'fullwidth';
  imageUrl: string;
  alt: string;
  caption: string;
}

// 2. Componente "director" que elige el estilo de imagen a mostrar
export function ImageBlock({ data }: { data: ImageData }) {
  switch (data.variant) {
    case 'bordered':
      return <ImageBordered data={data} />;
    case 'fullwidth':
      return <ImageFullWidth data={data} />;
    case 'default':
    default:
      return <ImageDefault data={data} />;
  }
}

// --- Componentes internos para cada variante ---
const ImageDefault = ({ data }: { data: ImageData }) => (
  <div className="max-w-4xl mx-auto p-4 text-center">
    <img src={data.imageUrl} alt={data.alt} className="rounded-lg mx-auto max-w-full h-auto" />
    {data.caption && (<p className="text-sm text-slate-600 mt-2 italic">{data.caption}</p>)}
  </div>
);

const ImageBordered = ({ data }: { data: ImageData }) => (
  <div className="max-w-4xl mx-auto p-4 text-center">
    <img src={data.imageUrl} alt={data.alt} className="rounded-lg mx-auto max-w-full h-auto border-4 border-white shadow-lg" />
    {data.caption && (<p className="text-sm text-slate-600 mt-3 italic">{data.caption}</p>)}
  </div>
);

const ImageFullWidth = ({ data }: { data: ImageData }) => (
  <div className="w-full my-8">
    <img src={data.imageUrl} alt={data.alt} className="w-full h-auto" />
    {data.caption && (<p className="text-center text-sm text-slate-600 mt-2 italic">{data.caption}</p>)}
  </div>
);

// 3. El editor no cambia, ya que los campos son los mismos para todas las variantes
export function ImageEditor({ data, updateData }: { data: ImageData, updateData: (key: keyof ImageData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="URL de la Imagen" value={data.imageUrl} onChange={(e) => updateData('imageUrl', e.target.value)} />
      <InputField label="Descripción (Alt)" value={data.alt} onChange={(e) => updateData('alt', e.target.value)} />
      <InputField label="Pie de foto" value={data.caption} onChange={(e) => updateData('caption', e.target.value)} />
    </div>
  );
}