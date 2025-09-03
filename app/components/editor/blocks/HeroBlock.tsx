import React from 'react';
import { InputField, TextareaField } from './InputField';

export interface HeroData { title: string; subtitle: string; buttonText: string; backgroundColor: string; buttonLink?: string; }

// Cómo se ve el bloque en la página
export function HeroBlock({ data }: { data: HeroData }) {
  return (
    <div className={`${data.backgroundColor} p-12 md:p-20 rounded-md text-center`}>
      <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{data.title}</h1>
      <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">{data.subtitle}</p>
      <a href={data.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">{data.buttonText}</a>
    </div>
  );
}

// Cómo se edita el bloque en el panel lateral
export function HeroEditor({ data, updateData }: { data: HeroData, updateData: (key: keyof HeroData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      <TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
      <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
    </div>
  );
}