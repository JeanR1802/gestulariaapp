'use client';
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

// --- Interfaces de Datos ---
export interface HeroData {
  variant: 'default' | 'leftImage' | 'darkMinimal';
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

// --- Componente de Bloque (Visual) ---
export function HeroBlock({ data }: { data: HeroData }) {
  switch (data.variant) {
    case 'leftImage':
      return <HeroLeftImage data={data} />;
    case 'darkMinimal':
      return <HeroDarkMinimal data={data} />;
    default:
      return <HeroDefault data={data} />;
  }
}

// --- Componentes de Variante (Visuales) ---
const HeroDefault = ({ data }: { data: HeroData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-slate-100'} text-center`,
      { 'py-24 px-8': isDesktop, 'py-20 px-6': isTablet, 'py-16 px-4': isMobile }
    )}>
      <h1 className={cn(`font-bold ${data.titleColor || 'text-slate-800'}`, { 'text-5xl mb-6': isDesktop, 'text-4xl mb-4': isTablet, 'text-3xl mb-3': isMobile })}>{data.title}</h1>
      <p className={cn(`max-w-3xl mx-auto ${data.subtitleColor || 'text-slate-600'}`, { 'text-xl mb-10': isDesktop, 'text-lg mb-8': isTablet, 'text-base mb-6': isMobile })}>{data.subtitle}</p>
      <a href={data.buttonLink || '#'} className={cn(`inline-block rounded-md font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`, { 'px-8 py-4 text-lg': isDesktop, 'px-7 py-3 text-base': isTablet, 'px-6 py-2.5 text-sm': isMobile })}>{data.buttonText}</a>
    </div>
  );
};

const HeroLeftImage = ({ data }: { data: HeroData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();
    return (
      <div className={cn(`${data.backgroundColor || 'bg-white'}`, { 'py-24 px-8': isDesktop, 'py-20 px-6': isTablet, 'py-16 px-4': isMobile })}>
          <div className={cn("mx-auto grid items-center", { 'max-w-6xl gap-16 grid-cols-2': isDesktop, 'max-w-4xl gap-12 grid-cols-2': isTablet, 'max-w-full gap-8 grid-cols-1': isMobile })}>
              <div className={cn({"text-left": isDesktop || isTablet, "text-center": isMobile})}>
                  <h1 className={cn(`font-bold ${data.titleColor || 'text-slate-800'}`, { 'text-5xl mb-6': isDesktop, 'text-4xl mb-4': isTablet, 'text-3xl mb-3': isMobile })}>{data.title}</h1>
                  <p className={cn(`${data.subtitleColor || 'text-slate-600'}`, { 'text-xl mb-10': isDesktop, 'text-lg mb-8': isTablet, 'text-base mb-6': isMobile })}>{data.subtitle}</p>
                  <a href={data.buttonLink || '#'} className={cn(`inline-block rounded-md font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`, { 'px-8 py-4 text-lg': isDesktop, 'px-7 py-3 text-base': isTablet, 'px-6 py-2.5 text-sm': isMobile })}>{data.buttonText}</a>
              </div>
              <div className="rounded-lg overflow-hidden bg-slate-100">
                  <img src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={data.title} className="w-full h-full object-cover aspect-video" />
              </div>
          </div>
      </div>
    );
};
  
const HeroDarkMinimal = ({ data }: { data: HeroData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();
    return (
        <div className={cn(`${data.backgroundColor || 'bg-slate-900'} text-center`, { 'py-32 px-8': isDesktop, 'py-28 px-6': isTablet, 'py-24 px-4': isMobile })}>
            <h1 className={cn(`font-bold ${data.titleColor || 'text-white'}`, { 'text-6xl mb-12': isDesktop, 'text-5xl mb-10': isTablet, 'text-4xl mb-8': isMobile })}>{data.title}</h1>
            <a href={data.buttonLink || '#'} className={cn(`inline-block rounded-md font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-800'}`, { 'px-10 py-5 text-xl': isDesktop, 'px-8 py-4 text-lg': isTablet, 'px-7 py-3 text-base': isMobile })}>{data.buttonText}</a>
        </div>
    );
};

// --- Editor de CONTENIDO (Limpio y Enfocado) ---
export function HeroContentEditor({ data, updateData }: { data: HeroData, updateData: (key: keyof HeroData, value: string) => void }) {
  return (
    <div className="space-y-4">
        <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
        {data.variant !== 'darkMinimal' && (<TextareaField label="Subtítulo" value={data.subtitle} rows={3} onChange={(e) => updateData('subtitle', e.target.value)} />)}
        <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
        {data.variant === 'leftImage' && (<InputField label="URL de la Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />)}
    </div>
  );
}

// --- Editor de ESTILO (Limpio y Enfocado) ---
export function HeroStyleEditor({ data, updateData }: { data: HeroData, updateData: (key: keyof HeroData, value: string) => void }) {
    return (
        <div className="space-y-4">
            <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
            <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
            {data.variant !== 'darkMinimal' && <TextColorPalette label="Color del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />}
            <ButtonColorPalette label="Estilo del Botón" selectedBgColor={data.buttonBgColor || ''} onChange={(bg, text) => { updateData('buttonBgColor', bg); updateData('buttonTextColor', text); }} />
        </div>
    );
}