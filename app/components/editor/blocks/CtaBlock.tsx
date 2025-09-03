import React, { ChangeEvent } from 'react';
import { InputField, TextareaField } from './InputField'; // Reutilizamos nuestros componentes de formulario

// --- 1. Definimos la forma de los datos para este bloque ---
export interface CtaData {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink?: string;
  backgroundColor: string;
}

// --- 2. Creamos el componente visual (cómo se ve en la página) ---
export function CtaBlock({ data }: { data: CtaData }) {
  return (
    <div className={`${data.backgroundColor || 'bg-slate-800'} text-white p-12 rounded-md text-center`}>
      <h2 className="text-3xl font-bold mb-2">{data.title}</h2>
      <p className="text-lg opacity-90 mb-6 max-w-xl mx-auto">{data.subtitle}</p>
      <a 
        href={data.buttonLink || '#'} 
        className="inline-block bg-white text-slate-800 px-6 py-2.5 rounded-md text-base font-semibold hover:bg-slate-200"
      >
        {data.buttonText}
      </a>
    </div>
  );
}

// --- 3. Creamos el formulario para editar el bloque ---
export function CtaEditor({ data, updateData }: { data: CtaData, updateData: (key: keyof CtaData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField 
        label="Título Principal" 
        value={data.title} 
        onChange={(e) => updateData('title', e.target.value)} 
      />
      <TextareaField 
        label="Subtítulo" 
        value={data.subtitle} 
        onChange={(e) => updateData('subtitle', e.target.value)} 
      />
      <InputField 
        label="Texto del Botón" 
        value={data.buttonText} 
        onChange={(e) => updateData('buttonText', e.target.value)} 
      />
      <InputField 
        label="Enlace del Botón (Opcional)" 
        value={data.buttonLink || ''} 
        onChange={(e) => updateData('buttonLink', e.target.value)} 
      />
    </div>
  );
}