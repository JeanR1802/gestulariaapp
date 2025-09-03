import React from 'react';
import { InputField } from './InputField'; // Reutilizamos el componente de formulario

// --- Tipos de Datos Específicos ---
export interface ImageData {
  imageUrl: string;
  alt: string;
  caption: string;
}

// --- Componente Visual ---
export function ImageBlock({ data }: { data: ImageData }) {
  return (
    <div className="p-4 text-center">
      <img src={data.imageUrl} alt={data.alt} className="rounded-lg mx-auto max-w-full h-auto" />
      {data.caption && (<p className="text-sm text-slate-600 mt-2">{data.caption}</p>)}
    </div>
  );
}

// --- Formulario de Edición ---
export function ImageEditor({ data, updateData }: { data: ImageData, updateData: (key: keyof ImageData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="URL de la Imagen" value={data.imageUrl} onChange={(e) => updateData('imageUrl', e.target.value)} />
      <InputField label="Descripción (Alt)" value={data.alt} onChange={(e) => updateData('alt', e.target.value)} />
      <InputField label="Pie de foto" value={data.caption} onChange={(e) => updateData('caption', e.target.value)} />
    </div>
  );
}