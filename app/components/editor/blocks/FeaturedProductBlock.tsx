// app/components/editor/blocks/FeaturedProductBlock.tsx (VERSIÓN CORREGIDA)
'use client';
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { StarIcon } from '@heroicons/react/24/solid';
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
  backgroundColor?: string;
  tagColor?: string;
  titleColor?: string;
  descriptionColor?: string;
  priceColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

// --- Helpers seguros para colores ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (!colorValue) return { className: defaultClass, style: {} };
  if (colorValue.startsWith('[#')) return { className: '', style: { color: colorValue.slice(1, -1) } };
  return { className: colorValue, style: {} };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (!colorValue) return { className: defaultClass, style: {} };
  if (colorValue.startsWith('[#')) return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  return { className: colorValue, style: {} };
};

const getButtonStyles = (bgColor?: string, textColor?: string) => {
  const style: React.CSSProperties = {};
  const isCustomBg = bgColor?.startsWith('[#');
  const isCustomText = textColor?.startsWith('[#');
  if (isCustomBg && bgColor) style.backgroundColor = bgColor.slice(1, -1);
  if (isCustomText && textColor) style.color = textColor.slice(1, -1);
  return {
    className: cn(!isCustomBg ? bgColor || 'bg-slate-900' : '', !isCustomText ? textColor || 'text-white' : ''),
    style,
  };
};

// --- Componentes Visuales ---
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={cn("w-5 h-5", i < rating ? 'text-yellow-400' : 'text-slate-300')} />
    ))}
  </div>
);

const FeaturedProductImageLeft = ({ data }: { data: FeaturedProductData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const tagStyles = getStyles(data.tagColor, 'text-blue-600');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const descriptionStyles = getStyles(data.descriptionColor, 'text-slate-600');
  const priceStyles = getStyles(data.priceColor, 'text-slate-900');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  return (
    <div className={cn({ "py-20 px-8": isDesktop, "py-16 px-6": isTablet, "py-12 px-4": isMobile }, bg.className)} style={bg.style}>
      <div className={cn("mx-auto grid items-center gap-12", { "max-w-6xl grid-cols-1 md:grid-cols-2": isDesktop || isTablet, "max-w-full grid-cols-1": isMobile })}>
        <div className="rounded-lg overflow-hidden bg-slate-100">
          <img src={data.imageUrl || 'https://placehold.co/600x600/e2e8f0/64748b?text=Producto'} alt={data.title} className="w-full h-full object-cover aspect-square" />
        </div>
        <div className={cn("text-left", { "py-8": isDesktop })}>
          <span className={cn("text-sm font-bold uppercase tracking-widest", tagStyles.className)} style={tagStyles.style}>{data.tag}</span>
          <h2 className={cn("font-bold my-4", { "text-5xl": isDesktop, "text-4xl": isTablet, "text-3xl": isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
          <p className={cn("mb-6", { "text-lg leading-relaxed": isDesktop, "text-base": isTablet || isMobile }, descriptionStyles.className)} style={descriptionStyles.style}>{data.description}</p>
          <div className="flex items-center justify-between mb-8">
            <p className={cn("font-bold", { "text-4xl": isDesktop, "text-3xl": isTablet || isMobile }, priceStyles.className)} style={priceStyles.style}>{data.price}</p>
            <RatingStars rating={data.rating} />
          </div>
          <a href="#" className={cn("w-full block text-center rounded-lg font-semibold transition-transform hover:scale-105", { "py-4 text-lg": isDesktop, "py-3 text-base": isTablet || isMobile }, buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</a>
        </div>
      </div>
    </div>
  );
};

const FeaturedProductBackground = ({ data }: { data: FeaturedProductData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);
  
  return (
    <div className={cn("relative text-white", { "min-h-[600px]": isDesktop, "min-h-[500px]": isTablet, "min-h-[450px]": isMobile })}>
      <img src={data.imageUrl || 'https://placehold.co/1200x800/e2e8f0/64748b?text=Producto'} alt={data.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/60"></div>
      <div className={cn("relative z-10 flex flex-col justify-center h-full mx-auto", { "max-w-7xl px-8": isDesktop, "max-w-5xl px-6": isTablet, "max-w-full px-4": isMobile })}>
        <div className={cn({ "max-w-lg": isDesktop || isTablet })}>
          <span className={cn("text-sm font-bold uppercase tracking-widest", getStyles(data.tagColor, 'text-blue-400').className)} style={getStyles(data.tagColor, 'text-blue-400').style}>{data.tag}</span>
          <h2 className={cn("font-bold my-4", { "text-5xl": isDesktop, "text-4xl": isTablet, "text-3xl": isMobile }, getStyles(data.titleColor, 'text-white').className)} style={getStyles(data.titleColor, 'text-white').style}>{data.title}</h2>
          <p className={cn("mb-6", { "text-lg leading-relaxed": isDesktop, "text-base": isTablet || isMobile }, getStyles(data.descriptionColor, 'text-slate-200').className)} style={getStyles(data.descriptionColor, 'text-slate-200').style}>{data.description}</p>
          <div className="flex items-center gap-8 mb-8">
            <p className={cn("font-bold", { "text-4xl": isDesktop, "text-3xl": isTablet || isMobile }, getStyles(data.priceColor, 'text-white').className)} style={getStyles(data.priceColor, 'text-white').style}>{data.price}</p>
            <RatingStars rating={data.rating} />
          </div>
          <a href="#" className={cn("w-full sm:w-auto inline-block text-center rounded-lg font-semibold transition-transform hover:scale-105", { "py-4 px-12 text-lg": isDesktop, "py-3 px-10 text-base": isTablet || isMobile }, buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</a>
        </div>
      </div>
    </div>
  );
};

// --- Componente Director ---
export function FeaturedProductBlock({ data }: { data: FeaturedProductData }) {
  return data.variant === 'background' ? <FeaturedProductBackground data={data} /> : <FeaturedProductImageLeft data={data} />;
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
        <input type="number" max={5} min={0} value={data.rating} onChange={(e) => updateData('rating', parseInt(e.target.value, 10))} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      </div>
    </div>
  );
}

// --- Editor de ESTILO ---
export function FeaturedProductStyleEditor({ data, updateData }: { data: FeaturedProductData, updateData: (key: keyof FeaturedProductData, value: string) => void }) {
  const [customBgColor, setCustomBgColor] = React.useState<string>(data.backgroundColor?.startsWith('[#') ? data.backgroundColor.slice(2, -1) : '#ffffff');
  const [customTagColor, setCustomTagColor] = React.useState<string>(data.tagColor?.startsWith('[#') ? data.tagColor.slice(2, -1) : '#000000');
  const [customTitleColor, setCustomTitleColor] = React.useState<string>(data.titleColor?.startsWith('[#') ? data.titleColor.slice(2, -1) : '#000000');
  const [customDescColor, setCustomDescColor] = React.useState<string>(data.descriptionColor?.startsWith('[#') ? data.descriptionColor.slice(2, -1) : '#000000');
  const [customPriceColor, setCustomPriceColor] = React.useState<string>(data.priceColor?.startsWith('[#') ? data.priceColor.slice(2, -1) : '#000000');
  const isCustomBg = data.backgroundColor?.startsWith('[#');
  const isCustomTag = data.tagColor?.startsWith('[#');
  const isCustomTitle = data.titleColor?.startsWith('[#');
  const isCustomDesc = data.descriptionColor?.startsWith('[#');
  const isCustomPrice = data.priceColor?.startsWith('[#');
  return (
    <div className="space-y-4">
      <div>
        <ColorPalette label="Color de Fondo" selectedColor={isCustomBg ? '' : data.backgroundColor || 'bg-white'} onChange={(color) => updateData('backgroundColor', color)} />
      </div>
      <div>
        <TextColorPalette label="Color de Etiqueta" selectedColor={isCustomTag ? '' : data.tagColor || 'text-blue-400'} onChange={(color) => updateData('tagColor', color)} />
      </div>
      <div>
        <TextColorPalette label="Color de Título" selectedColor={isCustomTitle ? '' : data.titleColor || 'text-white'} onChange={(color) => updateData('titleColor', color)} />
      </div>
      <div>
        <TextColorPalette label="Color de Descripción" selectedColor={isCustomDesc ? '' : data.descriptionColor || 'text-slate-200'} onChange={(color) => updateData('descriptionColor', color)} />
      </div>
      <div>
        <TextColorPalette label="Color de Precio" selectedColor={isCustomPrice ? '' : data.priceColor || 'text-white'} onChange={(color) => updateData('priceColor', color)} />
      </div>
      <ButtonColorPalette 
        label="Estilo del Botón" 
        selectedBgColor={data.buttonBgColor || 'bg-slate-900'}
        selectedTextColor={data.buttonTextColor || 'text-white'}
        onChange={(bg, text) => { 
          updateData('buttonBgColor', bg); 
          updateData('buttonTextColor', text); 
        }} 
      />
    </div>
  );
}