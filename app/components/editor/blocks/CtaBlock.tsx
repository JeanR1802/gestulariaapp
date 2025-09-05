// Archivo: app/components/editor/blocks/CtaBlock.tsx (ACTUALIZADO)
import React from 'react';
import { InputField, TextareaField } from './InputField';

// 1. Actualizamos la interfaz para incluir 'variant' y 'imageUrl'
export interface CtaData {
  variant: 'dark' | 'light' | 'split';
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
  backgroundColor: string;
  imageUrl?: string;
}

// 2. Componente "director" que elige el diseño a renderizar
export function CtaBlock({ data }: { data: CtaData }) {
  switch (data.variant) {
    case 'light':
      return <CtaLight data={data} />;
    case 'split':
      return <CtaSplit data={data} />;
    case 'dark':
    default:
      return <CtaDark data={data} />;
  }
}

// --- Componentes internos para cada variante ---
const CtaDark = ({ data }: { data: CtaData }) => (
  <div className={`${data.backgroundColor || 'bg-slate-800'} text-white p-12 text-center`}>
    <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
    <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">{data.subtitle}</p>
    <a href={data.buttonLink || '#'} className="inline-block bg-white text-slate-800 px-6 py-2.5 rounded-md text-base font-semibold hover:bg-slate-200">{data.buttonText}</a>
  </div>
);

const CtaLight = ({ data }: { data: CtaData }) => (
    <div className={`${data.backgroundColor || 'bg-slate-100'} p-12 text-center rounded-lg`}>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.title}</h2>
        <p className="text-lg text-slate-600 mb-6 max-w-xl mx-auto">{data.subtitle}</p>
        <a href={data.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">{data.buttonText}</a>
    </div>
);

const CtaSplit = ({ data }: { data: CtaData }) => (
    <div className={`${data.backgroundColor || 'bg-white'} p-8`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.title}</h2>
                <p className="text-lg text-slate-600 mb-6">{data.subtitle}</p>
                <a href={data.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">{data.buttonText}</a>
            </div>
            <div>
                <img src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={data.title} className="rounded-lg shadow-lg mx-auto" />
            </div>
        </div>
    </div>
);


// 3. El editor ahora muestra campos condicionales
export function CtaEditor({ data, updateData }: { data: CtaData, updateData: (key: keyof CtaData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      <TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
      <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
      <InputField label="Enlace del Botón (Opcional)" value={data.buttonLink || ''} onChange={(e) => updateData('buttonLink', e.target.value)} />
      {data.variant === 'split' && (
        <InputField label="URL de la Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />
      )}
    </div>
  );
}