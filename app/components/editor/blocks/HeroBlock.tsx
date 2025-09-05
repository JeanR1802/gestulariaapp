// Archivo: app/components/editor/blocks/HeroBlock.tsx (ACTUALIZADO)
import React from 'react';
import { InputField, TextareaField } from './InputField';

// 1. Actualizamos la interfaz para incluir 'variant' y 'imageUrl'
export interface HeroData {
  variant: 'default' | 'leftImage' | 'darkMinimal';
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor: string;
  buttonLink?: string;
  imageUrl?: string; // Nuevo campo para la imagen
}

// 2. Componente "director" que elige qué diseño renderizar
export function HeroBlock({ data }: { data: HeroData }) {
  switch (data.variant) {
    case 'leftImage':
      return <HeroLeftImage data={data} />;
    case 'darkMinimal':
      return <HeroDarkMinimal data={data} />;
    case 'default':
    default:
      return <HeroDefault data={data} />;
  }
}

// --- Componentes internos para cada variante ---
const HeroDefault = ({ data }: { data: HeroData }) => (
  <div className={`${data.backgroundColor || 'bg-slate-100'} p-12 md:p-20 text-center`}>
    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{data.title}</h1>
    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">{data.subtitle}</p>
    <a href={data.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">{data.buttonText}</a>
  </div>
);

const HeroLeftImage = ({ data }: { data: HeroData }) => (
  <div className={`${data.backgroundColor || 'bg-white'}`}>
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8 p-8 md:p-12">
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{data.title}</h1>
        <p className="text-lg text-slate-600 mb-8">{data.subtitle}</p>
        <a href={data.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">{data.buttonText}</a>
      </div>
      <div>
        <img src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={data.title} className="rounded-lg shadow-lg mx-auto" />
      </div>
    </div>
  </div>
);

const HeroDarkMinimal = ({ data }: { data: HeroData }) => (
    <div className={`${data.backgroundColor || 'bg-slate-900'} p-12 md:p-24 text-center`}>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">{data.title}</h1>
        <a href={data.buttonLink || '#'} className="inline-block bg-white text-slate-800 px-8 py-3 rounded-md text-base font-semibold hover:bg-slate-200">{data.buttonText}</a>
    </div>
);


// 3. El editor ahora muestra campos condicionales
export function HeroEditor({ data, updateData }: { data: HeroData, updateData: (key: keyof HeroData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      {/* El subtítulo no aparece en el diseño minimalista */}
      {data.variant !== 'darkMinimal' && (
        <TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
      )}
      <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
      {/* El campo de URL de imagen solo aparece si es el diseño con imagen */}
      {data.variant === 'leftImage' && (
        <InputField label="URL de la Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />
      )}
    </div>
  );
}