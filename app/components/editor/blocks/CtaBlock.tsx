import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

export interface CtaData {
  variant: 'dark' | 'light' | 'split';
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonLink?: string;
  imageUrl?: string;
}

export function CtaBlock({ data }: { data: CtaData }) {
  switch (data.variant) {
    case 'light': return <CtaLight data={data} />;
    case 'split': return <CtaSplit data={data} />;
    default: return <CtaDark data={data} />;
  }
}

const buttonBaseClasses = "inline-block px-6 py-2.5 rounded-md text-base font-semibold transition-transform hover:scale-105";

const CtaDark = ({ data }: { data: CtaData }) => (
  <div className={`${data.backgroundColor || 'bg-slate-800'} text-white p-12 text-center`}>
    <h2 className={`text-3xl font-bold mb-2 ${data.titleColor || 'text-white'}`}>{data.title}</h2>
    <p className={`text-lg opacity-90 mb-6 max-w-xl mx-auto ${data.subtitleColor || 'text-slate-300'}`}>{data.subtitle}</p>
    <a href={data.buttonLink || '#'} className={`${buttonBaseClasses} ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-800'}`}>{data.buttonText}</a>
  </div>
);

const CtaLight = ({ data }: { data: CtaData }) => (
    <div className={`${data.backgroundColor || 'bg-slate-100'} p-12 text-center rounded-lg`}>
        <h2 className={`text-3xl font-bold mb-2 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
        <p className={`text-lg mb-6 max-w-xl mx-auto ${data.subtitleColor || 'text-slate-600'}`}>{data.subtitle}</p>
        <a href={data.buttonLink || '#'} className={`${buttonBaseClasses} ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`}>{data.buttonText}</a>
    </div>
);

const CtaSplit = ({ data }: { data: CtaData }) => (
    <div className={`${data.backgroundColor || 'bg-white'} p-8`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-center gap-8">
            <div className="text-center md:text-left">
                <h2 className={`text-3xl font-bold mb-2 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
                <p className={`text-lg mb-6 ${data.subtitleColor || 'text-slate-600'}`}>{data.subtitle}</p>
                <a href={data.buttonLink || '#'} className={`${buttonBaseClasses} ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`}>{data.buttonText}</a>
            </div>
            <div><img src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={data.title} className="rounded-lg shadow-lg mx-auto" /></div>
        </div>
    </div>
);

export function CtaEditor({ data, updateData }: { data: CtaData, updateData: (key: keyof CtaData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-slate-600">Contenido</h4>
        <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
        <TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
        <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
        {data.variant === 'split' && (<InputField label="URL de la Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />)}
      </div>
      <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
        <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
        <TextColorPalette label="Color del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />
        <ButtonColorPalette label="Estilo del Botón" selectedBgColor={data.buttonBgColor} onChange={(bg, text) => { updateData('buttonBgColor', bg); updateData('buttonTextColor', text); }} />
      </div>
    </div>
  );
}