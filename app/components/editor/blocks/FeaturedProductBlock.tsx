'use client';
import React, { useRef, JSX } from 'react';
import { Editable } from './TextBlock';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { StarIcon } from '@heroicons/react/24/solid';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';
import { BlockComponentProps } from './index';

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
  backgroundColor?: string;
  textColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

// --- Helpers seguros para colores ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff', 'text-black': '#000000', 'text-slate-50': '#f8fafc', 'text-slate-100': '#f1f5f9',
    'text-slate-200': '#e2e8f0', 'text-slate-300': '#cbd5e1', 'text-slate-400': '#94a3b8', 'text-slate-500': '#64748b',
    'text-slate-600': '#475569', 'text-slate-700': '#334155', 'text-slate-800': '#1e293b', 'text-slate-900': '#0f172a',
    'text-blue-600': '#2563eb', 'text-blue-500': '#3b82f6',
  };
  const finalClass = colorValue || defaultClass;
  if (colorValue?.startsWith('[#')) return { className: '', style: { color: colorValue.slice(1, -1) } } as const;
  return { className: finalClass, style: { color: colorMap[finalClass] || '#1e293b' } } as const;
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  const bgMap: Record<string, string> = {
    'bg-white': '#ffffff', 'bg-black': '#000000', 'bg-slate-50': '#f8fafc', 'bg-slate-100': '#f1f5f9',
    'bg-slate-200': '#e2e8f0', 'bg-slate-300': '#cbd5e1', 'bg-slate-400': '#94a3b8', 'bg-slate-500': '#64748b',
    'bg-slate-600': '#475569', 'bg-slate-700': '#334155', 'bg-slate-800': '#1e293b', 'bg-slate-900': '#0f172a',
    'bg-blue-600': '#2563eb', 'bg-blue-500': '#3b82f6',
  };
  const finalClass = colorValue || defaultClass;
  if (colorValue?.startsWith('[#')) return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } } as const;
  return { className: finalClass, style: { backgroundColor: bgMap[finalClass] || '#ffffff' } } as const;
};

const getButtonStyles = (bgColor?: string, textColor?: string) => {
  const style: React.CSSProperties = {};
  const isCustomBg = bgColor?.startsWith('[#');
  const isCustomText = textColor?.startsWith('[#');
  
  const bgMap: Record<string, string> = {
    'bg-blue-600': '#2563eb',
    'bg-blue-500': '#3b82f6',
    'bg-slate-900': '#0f172a',
    'bg-slate-800': '#1e293b',
    'bg-white': '#ffffff',
    'bg-black': '#000000',
  };
  const textMap: Record<string, string> = {
    'text-white': '#ffffff',
    'text-slate-800': '#1e293b',
    'text-slate-900': '#0f172a',
    'text-black': '#000000',
  };
  
  // SIEMPRE aplicar inline styles
  if (isCustomBg && bgColor) {
    style.backgroundColor = bgColor.slice(1, -1);
  } else {
    const bgClass = bgColor || 'bg-slate-900';
    style.backgroundColor = bgMap[bgClass] || '#0f172a';
  }
  
  if (isCustomText && textColor) {
    style.color = textColor.slice(1, -1);
  } else {
    const textClass = textColor || 'text-white';
    style.color = textMap[textClass] || '#ffffff';
  }
  
  return { className: cn(!isCustomBg ? bgColor || 'bg-slate-900' : '', !isCustomText ? textColor || 'text-white' : ''), style } as const;
};

// --- Componentes Visuales ---
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={cn('w-5 h-5', i < rating ? 'text-yellow-400' : 'text-slate-300')} />
    ))}
  </div>
);

const FeaturedProductImageLeft = ({ data, isEditing, onUpdate }: BlockComponentProps<FeaturedProductData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const textStyles = getStyles(data.textColor, 'text-slate-800');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  const handleUpdate = (key: keyof FeaturedProductData, value: string) => { if (onUpdate) onUpdate(key as string, value); };

  return (
    <div className={cn({ 'py-20 px-8': isDesktop, 'py-16 px-6': isTablet, 'py-12 px-4': isMobile }, bg.className)} style={bg.style}>
      <div className={cn('mx-auto grid items-center gap-12', { 'max-w-6xl grid-cols-1 md:grid-cols-2': isDesktop || isTablet, 'max-w-full grid-cols-1': isMobile })}>
        <div className="rounded-lg overflow-hidden bg-slate-100">
          <img src={data.imageUrl || 'https://placehold.co/600x600/e2e8f0/64748b?text=Producto'} alt={data.title} className="w-full h-full object-cover aspect-square" />
        </div>
        <div className={cn('text-left', { 'py-8': isDesktop })}>
          <Editable tagName="span" value={data.tag} onUpdate={(v) => handleUpdate('tag', v)} isEditing={isEditing} className={cn('text-sm font-bold uppercase tracking-widest', textStyles.className)} style={textStyles.style} />
          <Editable tagName="h2" value={data.title} onUpdate={(v) => handleUpdate('title', v)} isEditing={isEditing} className={cn('font-bold my-4', { 'text-5xl': isDesktop, 'text-4xl': isTablet, 'text-3xl': isMobile }, textStyles.className)} style={textStyles.style} />
          <Editable tagName="p" value={data.description} onUpdate={(v) => handleUpdate('description', v)} isEditing={isEditing} className={cn('mb-6', { 'text-lg leading-relaxed': isDesktop, 'text-base': isTablet || isMobile }, textStyles.className)} style={textStyles.style} />
          <div className="flex items-center justify-between mb-8">
            <Editable tagName="p" value={data.price} onUpdate={(v) => handleUpdate('price', v)} isEditing={isEditing} className={cn('font-bold', { 'text-4xl': isDesktop, 'text-3xl': isTablet || isMobile }, textStyles.className)} style={textStyles.style} />
            <RatingStars rating={data.rating} />
          </div>
          <Editable tagName="a" value={data.buttonText} onUpdate={(v) => handleUpdate('buttonText', v)} isEditing={isEditing} className={cn('w-full block text-center rounded-lg font-semibold transition-transform hover:scale-105', { 'py-4 text-lg': isDesktop, 'py-3 text-base': isTablet || isMobile }, buttonStyles.className)} style={buttonStyles.style} />
        </div>
      </div>
    </div>
  );
};

const FeaturedProductBackground = ({ data, isEditing, onUpdate }: BlockComponentProps<FeaturedProductData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);
  const handleUpdate = (key: keyof FeaturedProductData, value: string) => { if (onUpdate) onUpdate(key as string, value); };
  
  return (
    <div className={cn('relative text-white', { 'min-h-[600px]': isDesktop, 'min-h-[500px]': isTablet, 'min-h-[450px]': isMobile })}>
      <img src={data.imageUrl || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Producto'} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className={cn('relative z-10 flex flex-col justify-center h-full mx-auto', { 'max-w-7xl px-8': isDesktop, 'max-w-5xl px-6': isTablet, 'max-w-full px-4': isMobile })}>
        <div className={cn({ 'max-w-lg': isDesktop || isTablet })}>
          <Editable tagName="span" value={data.tag} onUpdate={(v) => handleUpdate('tag', v)} isEditing={isEditing} className={cn('text-sm font-bold uppercase tracking-widest', getStyles(data.textColor, 'text-blue-400').className)} style={getStyles(data.textColor, 'text-blue-400').style} />
          <Editable tagName="h2" value={data.title} onUpdate={(v) => handleUpdate('title', v)} isEditing={isEditing} className={cn('font-bold my-4', { 'text-5xl': isDesktop, 'text-4xl': isTablet, 'text-3xl': isMobile }, getStyles(data.textColor, 'text-white').className)} style={getStyles(data.textColor, 'text-white').style} />
          <Editable tagName="p" value={data.description} onUpdate={(v) => handleUpdate('description', v)} isEditing={isEditing} className={cn('mb-6', { 'text-lg leading-relaxed': isDesktop, 'text-base': isTablet || isMobile }, getStyles(data.textColor, 'text-slate-200').className)} style={getStyles(data.textColor, 'text-slate-200').style} />
          <div className="flex items-center gap-8 mb-8">
            <Editable tagName="p" value={data.price} onUpdate={(v) => handleUpdate('price', v)} isEditing={isEditing} className={cn('font-bold', { 'text-4xl': isDesktop, 'text-3xl': isTablet || isMobile }, getStyles(data.textColor, 'text-white').className)} style={getStyles(data.textColor, 'text-white').style} />
            <RatingStars rating={data.rating} />
          </div>
          <Editable tagName="a" value={data.buttonText} onUpdate={(v) => handleUpdate('buttonText', v)} isEditing={isEditing} className={cn('w-full sm:w-auto inline-block text-center rounded-lg font-semibold transition-transform hover:scale-105', { 'py-4 px-12 text-lg': isDesktop, 'py-3 px-10 text-base': isTablet || isMobile }, buttonStyles.className)} style={buttonStyles.style} />
        </div>
      </div>
    </div>
  );
};

// --- Componente Director ---
export function FeaturedProductBlock({ data, isEditing, onUpdate }: BlockComponentProps<FeaturedProductData>) {
  const props = { data, isEditing, onUpdate };
  return data.variant === 'background' ? <FeaturedProductBackground {...props} /> : <FeaturedProductImageLeft {...props} />;
}

// --- Editor de CONTENIDO ---
export function FeaturedProductContentEditor({ data, updateData }: { data: FeaturedProductData; updateData: (key: keyof FeaturedProductData, value: string | number) => void }) {
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
        <input type="number" max={5} min={0} value={data.rating} onChange={(e) => updateData('rating', parseInt(e.target.value, 10))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
    </div>
  );
}

// --- Editor de ESTILO ---
export function FeaturedProductStyleEditor({ data, updateData }: { data: FeaturedProductData; updateData: (key: keyof FeaturedProductData, value: string) => void }) {
  const isCustomBg = data.backgroundColor?.startsWith('[#');
  const isCustomText = data.textColor?.startsWith('[#');
  return (
    <div className="space-y-4">
      <div><ColorPalette label="Color de Fondo" selectedColor={isCustomBg ? '' : data.backgroundColor || 'bg-white'} onChange={(color) => updateData('backgroundColor', color)} /></div>
      <div><TextColorPalette label="Color de Texto" selectedColor={isCustomText ? '' : data.textColor || 'text-slate-800'} onChange={(color) => updateData('textColor', color)} /></div>
      <ButtonColorPalette label="Estilo del Botón" selectedBgColor={data.buttonBgColor || 'bg-slate-900'} selectedTextColor={data.buttonTextColor || 'text-white'} onChange={(bg, text) => { updateData('buttonBgColor', bg); updateData('buttonTextColor', text); }} />
    </div>
  );
}
