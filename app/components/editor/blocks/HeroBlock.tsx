// Archivo: app/components/editor/blocks/HeroBlock.tsx (ACTUALIZADO CON COLOR DE TEXTO)
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette'; // Importamos la nueva paleta

// 1. Actualizamos la interfaz para incluir colores de texto
export interface HeroData {
  variant: 'default' | 'leftImage' | 'darkMinimal';
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonLink?: string;
  imageUrl?: string;
}

// --- Componente "Director" que elige qué diseño renderizar ---
export function HeroBlock({ data }: { data: HeroData }) {
  // ... (código existente sin cambios, se pasa 'data' completo)
}

// 2. Componentes internos ahora usan los colores de texto dinámicos
const HeroDefault = ({ data }: { data: HeroData }) => (
  <div className={`${data.backgroundColor || 'bg-slate-100'} p-12 md:p-20 text-center`}>
    <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h1>
    <p className={`text-lg mb-8 max-w-2xl mx-auto ${data.subtitleColor || 'text-slate-600'}`}>{data.subtitle}</p>
    <a href={data.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md text-base font-semibold hover:bg-blue-700">{data.buttonText}</a>
  </div>
);

const HeroLeftImage = ({ data }: { data: HeroData }) => (
  <div className={`${data.backgroundColor || 'bg-white'}`}>
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8 p-8 md:p-12">
      <div className="text-center md:text-left">
        <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h1>
        <p className={`text-lg mb-8 ${data.subtitleColor || 'text-slate-600'}`}>{data.subtitle}</p>
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
        <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${data.titleColor || 'text-white'}`}>{data.title}</h1>
        <a href={data.buttonLink || '#'} className="inline-block bg-white text-slate-800 px-8 py-3 rounded-md text-base font-semibold hover:bg-slate-200">{data.buttonText}</a>
    </div>
);

// 3. Editor ahora incluye la paleta de colores de texto
export function HeroEditor({ data, updateData }: { data: HeroData, updateData: (key: keyof HeroData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-slate-600">Contenido</h4>
        <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
        {data.variant !== 'darkMinimal' && (<TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />)}
        <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
        {data.variant === 'leftImage' && (<InputField label="URL de la Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />)}
      </div>
      <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
        <TextColorPalette label="Color de Texto del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
        {data.variant !== 'darkMinimal' && (
          <TextColorPalette label="Color de Texto del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />
        )}
      </div>
    </div>
  );
}