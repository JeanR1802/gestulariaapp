'use client';
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { StarIcon } from '@heroicons/react/24/solid'; // Usamos el ícono sólido para las estrellas rellenas
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

// --- Interfaces de Datos ---
export interface FeaturedProductData {
  variant: 'imageLeft' | 'background';
  imageUrl: string;
  tag: string;
  title: string;
  description: string;
  price: string;
  rating: number;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
}

// --- Componente "Director" (Visual) ---
export function FeaturedProductBlock({ data }: { data: FeaturedProductData }) {
  switch (data.variant) {
    case 'background':
      return <FeaturedProductBackground data={data} />;
    default:
      return <FeaturedProductImageLeft data={data} />;
  }
}

// --- Componentes de Variante (Visuales) ---

const RatingStars = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={cn("w-5 h-5", i < rating ? 'text-yellow-400' : 'text-slate-300')} />
        ))}
    </div>
);

const FeaturedProductImageLeft = ({ data }: { data: FeaturedProductData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  return (
    <div className={cn(data.backgroundColor || 'bg-white', { "py-20 px-8": isDesktop, "py-16 px-6": isTablet, "py-12 px-4": isMobile })}>
      <div className={cn("mx-auto grid items-center gap-12", { "max-w-6xl grid-cols-1 md:grid-cols-2": isDesktop || isTablet, "max-w-full grid-cols-1": isMobile })}>
        <div className="rounded-lg overflow-hidden bg-slate-100"><img src={data.imageUrl || 'https://placehold.co/600x600/e2e8f0/64748b?text=Producto'} alt={data.title} className="w-full h-full object-cover aspect-square" /></div>
        <div className={cn("text-left", { "py-8": isDesktop, "": isTablet || isMobile })}>
          <span className={cn("text-sm font-bold uppercase tracking-widest", data.textColor ? data.textColor.replace('text-', 'text-opacity-70 ') : 'text-blue-600')}>{data.tag}</span>
          <h2 className={cn("font-bold my-4", data.textColor || 'text-slate-800', { "text-5xl": isDesktop, "text-4xl": isTablet, "text-3xl": isMobile })}>{data.title}</h2>
          <p className={cn("mb-6", data.textColor ? data.textColor.replace('text-', 'text-opacity-90 ') : 'text-slate-600', { "text-lg leading-relaxed": isDesktop, "text-base": isTablet || isMobile })}>{data.description}</p>
          <div className="flex items-center justify-between mb-8">
            <p className={cn("font-bold", data.textColor || 'text-slate-900', { "text-4xl": isDesktop, "text-3xl": isTablet || isMobile })}>{data.price}</p>
            <RatingStars rating={data.rating} />
          </div>
          <a href="#" className={cn("w-full block text-center rounded-lg font-semibold transition-transform hover:scale-105", data.buttonBgColor || 'bg-slate-900', data.buttonTextColor || 'text-white', { "py-4 text-lg": isDesktop, "py-3 text-base": isTablet || isMobile })}>{data.buttonText}</a>
        </div>
      </div>
    </div>
  );
};

const FeaturedProductBackground = ({ data }: { data: FeaturedProductData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();
    return (
        <div className={cn("relative text-white", { "min-h-[600px]": isDesktop, "min-h-[500px]": isTablet, "min-h-[450px]": isMobile })}>
            <img src={data.imageUrl || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Producto'} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className={cn("relative z-10 flex flex-col justify-center h-full mx-auto", { "max-w-7xl px-8": isDesktop, "max-w-5xl px-6": isTablet, "max-w-full px-4": isMobile })}>
                <div className={cn({ "max-w-lg": isDesktop || isTablet })}>
                    <span className="text-sm font-bold uppercase tracking-widest text-blue-400">{data.tag}</span>
                    <h2 className={cn("font-bold my-4", { "text-5xl": isDesktop, "text-4xl": isTablet, "text-3xl": isMobile })}>{data.title}</h2>
                    <p className={cn("mb-6 text-slate-200", { "text-lg leading-relaxed": isDesktop, "text-base": isTablet || isMobile })}>{data.description}</p>
                    <div className="flex items-center gap-8 mb-8">
                        <p className={cn("font-bold", { "text-4xl": isDesktop, "text-3xl": isTablet || isMobile })}>{data.price}</p>
                        <RatingStars rating={data.rating} />
                    </div>
                    <a href="#" className={cn("w-full sm:w-auto inline-block text-center rounded-lg font-semibold transition-transform hover:scale-105", data.buttonBgColor || 'bg-white', data.buttonTextColor || 'text-slate-900', { "py-4 px-12 text-lg": isDesktop, "py-3 px-10 text-base": isTablet || isMobile })}>{data.buttonText}</a>
                </div>
            </div>
        </div>
    );
};

// --- Editor de CONTENIDO ---
export function FeaturedProductContentEditor({ data, updateData }: { data: FeaturedProductData, updateData: (key: keyof FeaturedProductData, value: string | number) => void }) {
    return (
        <div className="space-y-4">
            <InputField label="URL de Imagen" value={data.imageUrl} onChange={(e) => updateData('imageUrl', e.target.value)} />
            <InputField label="Etiqueta (Ej: Nuevo)" value={data.tag} onChange={(e) => updateData('tag', e.target.value)} />
            <InputField label="Título del Producto" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
            <TextareaField label="Descripción" value={data.description} rows={4} onChange={(e) => updateData('description', e.target.value)} />
            <InputField label="Precio" value={data.price} onChange={(e) => updateData('price', e.target.value)} />
            <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Valoración (0-5)</label>
                <input type="number" max="5" min="0" value={data.rating} onChange={(e) => updateData('rating', parseInt(e.target.value, 10))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
        </div>
    );
}

// --- Editor de ESTILO ---
export function FeaturedProductStyleEditor({ data, updateData }: { data: FeaturedProductData, updateData: (key: keyof FeaturedProductData, value: string) => void }) {
    return (
        <div className="space-y-4">
            <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
            <TextColorPalette label="Color de Texto" selectedColor={data.textColor} onChange={(color) => updateData('textColor', color)} />
            <ButtonColorPalette label="Estilo del Botón" selectedBgColor={data.buttonBgColor || ''} onChange={(bg, text) => { updateData('buttonBgColor', bg); updateData('buttonTextColor', text); }} />
        </div>
    );
}