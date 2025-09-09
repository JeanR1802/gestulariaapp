// Reemplaza el contenido de app/components/editor/blocks/CatalogBlock.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon, SparklesIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

// --- Interfaces de Datos ---
interface Product {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
  buttonText: string;
}

export interface CatalogData {
  variant: 'grid' | 'minimalGrid' | 'carousel';
  title: string;
  subtitle: string;
  products: Product[];
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  cardColor: string;
  productNameColor: string;
  productPriceColor: string;
  productDescriptionColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
}

// --- Componente "Director" ---
export function CatalogBlock({ data }: { data: CatalogData }) {
  switch (data.variant) {
    case 'minimalGrid':
      return <CatalogMinimalGrid data={data} />;
    case 'carousel':
      return <CatalogCarousel data={data} />;
    default:
      return <CatalogGrid data={data} />;
  }
}

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getButtonStyles = (bgColor: string | undefined, textColor: string | undefined) => {
    const isCustomBg = bgColor?.startsWith('[#');
    const isCustomText = textColor?.startsWith('[#');
    const style: React.CSSProperties = {};
    if (isCustomBg && bgColor) style.backgroundColor = bgColor.slice(1, -1);
    if (isCustomText && textColor) style.color = textColor.slice(1, -1);
    
    return {
        className: cn(!isCustomBg ? bgColor || 'bg-slate-800' : '', !isCustomText ? textColor || 'text-white' : ''),
        style: style,
    };
};

// --- Componentes Visuales ---
const CatalogGrid = ({ data }: { data: CatalogData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const sectionBg = getBackgroundStyles(data.backgroundColor);
  const cardBg = getBackgroundStyles(data.cardColor, 'bg-white');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const nameStyles = getStyles(data.productNameColor, 'text-slate-900');
  const priceStyles = getStyles(data.productPriceColor, 'text-blue-600');
  const descriptionStyles = getStyles(data.productDescriptionColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);
 
  return (
    <div 
      className={cn({ 'py-20 px-8': isDesktop, 'py-16 px-6': isTablet, 'py-12 px-4': isMobile }, sectionBg.className)}
      style={sectionBg.style}
    >
      <div className={cn("mx-auto", { 'max-w-7xl': isDesktop, 'max-w-5xl': isTablet, 'max-w-full': isMobile })}>
        <div className={cn("text-center", { 'mb-16': isDesktop, 'mb-12': isTablet, 'mb-8': isMobile })}>
          <h2 className={cn("font-bold", { 'text-4xl mb-6': isDesktop, 'text-3xl mb-4': isTablet, 'text-2xl mb-3': isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
          <p className={cn("mx-auto", { 'text-xl max-w-3xl leading-relaxed': isDesktop, 'text-lg max-w-2xl leading-relaxed': isTablet, 'text-base leading-relaxed': isMobile }, subtitleStyles.className)} style={subtitleStyles.style}>{data.subtitle}</p>
        </div>

        <div className={cn("grid text-left", { 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8': isDesktop, 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6': isTablet, 'grid-cols-1 gap-6': isMobile })}>
          {(data.products || []).map((product, index) => (
            <div 
              key={index} 
              className={cn("group rounded-xl overflow-hidden shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col", cardBg.className)}
              style={cardBg.style}
            >
              <div className="relative overflow-hidden bg-slate-50">
                <img className={cn("w-full object-cover transition-transform duration-500 group-hover:scale-110", { 'h-64': isDesktop, 'h-56': isTablet, 'h-48': isMobile })} src={product.imageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=Producto'} alt={product.name} loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className={cn("flex flex-col flex-grow", { 'p-6': isDesktop, 'p-5': isTablet, 'p-4': isMobile })}>
                <h3 className={cn("font-semibold line-clamp-2 mb-3", { 'text-xl': isDesktop, 'text-lg': isTablet, 'text-base': isMobile }, nameStyles.className)} style={nameStyles.style}>{product.name}</h3>
                <p className={cn("font-bold mb-4", { 'text-2xl': isDesktop, 'text-xl': isTablet, 'text-lg': isMobile }, priceStyles.className)} style={priceStyles.style}>{product.price}</p>
                <p className={cn("flex-grow line-clamp-3 mb-6", { 'text-base leading-relaxed': isDesktop, 'text-sm leading-relaxed': isTablet || isMobile }, descriptionStyles.className)} style={descriptionStyles.style}>{product.description}</p>
                <button className={cn("w-full text-center rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95 mt-auto", { 'py-3 text-base': isDesktop, 'py-2.5 text-sm': isTablet, 'py-2 text-sm': isMobile }, buttonStyles.className)} style={buttonStyles.style}>{product.buttonText}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CatalogMinimalGrid = ({ data }: { data: CatalogData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const sectionBg = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const nameStyles = getStyles(data.productNameColor, 'text-slate-800');
  const priceStyles = getStyles(data.productPriceColor, 'text-slate-600');
 
  return (
    <div 
      className={cn({ 'py-20 px-8': isDesktop, 'py-16 px-6': isTablet, 'py-12 px-4': isMobile }, sectionBg.className)}
      style={sectionBg.style}
    >
      <div className={cn("mx-auto", { 'max-w-7xl': isDesktop, 'max-w-5xl': isTablet, 'max-w-full': isMobile })}>
        <div className={cn("text-center", { 'mb-16': isDesktop, 'mb-12': isTablet, 'mb-8': isMobile })}>
          <h2 className={cn("font-bold", { 'text-4xl mb-6': isDesktop, 'text-3xl mb-4': isTablet, 'text-2xl mb-3': isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
          <p className={cn("mx-auto", { 'text-xl max-w-3xl': isDesktop, 'text-lg max-w-2xl': isTablet, 'text-base': isMobile }, subtitleStyles.className)} style={subtitleStyles.style}>{data.subtitle}</p>
        </div>
        <div className={cn("grid", { 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8': isDesktop, 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6': isTablet, 'grid-cols-2 gap-4': isMobile })}>
          {(data.products || []).map((product, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg bg-slate-50 mb-4">
                <img className="w-full aspect-square object-cover transition-all duration-500 group-hover:scale-110" src={product.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'} alt={product.name} loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
              <div className={cn({ 'space-y-2': isDesktop, 'space-y-1': isTablet || isMobile })}>
                <h3 className={cn("font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors", { 'text-lg': isDesktop, 'text-base': isTablet, 'text-sm': isMobile }, nameStyles.className)} style={nameStyles.style}>{product.name}</h3>
                <p className={cn("font-medium", { 'text-base': isDesktop, 'text-sm': isTablet, 'text-xs': isMobile }, priceStyles.className)} style={priceStyles.style}>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CatalogCarousel = ({ data }: { data: CatalogData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const sectionBg = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
  const nameStyles = getStyles(data.productNameColor, 'text-slate-800');
  const priceStyles = getStyles(data.productPriceColor, 'text-slate-600');

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 280 : isTablet ? 320 : 360;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
     
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      checkScrollButtons();
      container.addEventListener('scroll', checkScrollButtons, { passive: true });
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [data.products]);

  return (
    <div 
      className={cn({ 'py-20': isDesktop, 'py-16': isTablet, 'py-12': isMobile }, sectionBg.className)}
      style={sectionBg.style}
    >
      <div className={cn("mx-auto relative", { 'max-w-7xl px-8': isDesktop, 'max-w-5xl px-6': isTablet, 'max-w-full px-4': isMobile })}>
        <div className={cn("flex justify-between items-end", { 'mb-12': isDesktop, 'mb-10': isTablet, 'mb-8': isMobile })}>
          <div className="flex-1">
            <h2 className={cn("font-bold", { 'text-4xl mb-4': isDesktop, 'text-3xl mb-3': isTablet, 'text-2xl mb-2': isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
            <p className={cn({ 'text-xl max-w-3xl': isDesktop, 'text-lg max-w-2xl': isTablet, 'text-base': isMobile }, subtitleStyles.className)} style={subtitleStyles.style}>{data.subtitle}</p>
          </div>
          {!isMobile && (
            <div className="flex gap-2 ml-8">
              <button onClick={() => scroll('left')} disabled={!canScrollLeft} className={cn("p-2 rounded-full border transition-all duration-200", canScrollLeft ? "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800" : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed")}><ChevronLeftIcon className="w-5 h-5" /></button>
              <button onClick={() => scroll('right')} disabled={!canScrollRight} className={cn("p-2 rounded-full border transition-all duration-200", canScrollRight ? "bg-white border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800" : "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed")}><ChevronRightIcon className="w-5 h-5" /></button>
            </div>
          )}
        </div>
        <div ref={scrollContainerRef} className={cn("flex overflow-x-auto scrollbar-hide scroll-smooth", { 'gap-8 pb-4': isDesktop, 'gap-6 pb-4': isTablet, 'gap-4 pb-2': isMobile })} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {(data.products || []).map((product, index) => (
            <div key={index} className={cn("group flex-shrink-0 cursor-pointer", { 'w-80': isDesktop, 'w-72': isTablet, 'w-64': isMobile })}>
              <div className="relative overflow-hidden rounded-xl bg-slate-50 mb-4">
                <img className="w-full aspect-square object-cover transition-all duration-500 group-hover:scale-110" src={product.imageUrl || 'https://placehold.co/400x400/e2e8f0/64748b?text=Producto'} alt={product.name} loading="lazy"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
              <div className={cn({ 'space-y-2': isDesktop, 'space-y-1': isTablet || isMobile })}>
                <h3 className={cn("font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors", { 'text-xl': isDesktop, 'text-lg': isTablet, 'text-base': isMobile }, nameStyles.className)} style={nameStyles.style}>{product.name}</h3>
                <p className={cn("font-semibold", { 'text-lg': isDesktop, 'text-base': isTablet, 'text-sm': isMobile }, priceStyles.className)} style={priceStyles.style}>{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        {isMobile && (<div className="flex justify-center mt-4"><div className="text-xs text-slate-400">Desliza para ver más productos →</div></div>)}
      </div>
    </div>
  );
};

// --- Editor de CONTENIDO (SEPARADO) ---
export function CatalogContentEditor({ data, updateData }: { data: CatalogData, updateData: (key: keyof CatalogData, value: string | Product[]) => void }) {
    const [userDescription, setUserDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => { /* ... */ };
    const handleKeyPress = (e: React.KeyboardEvent) => { /* ... */ };
    
    const handleProductChange = (index: number, field: keyof Product, value: string) => {
        const newProducts = [...(data.products || [])];
        newProducts[index] = { ...newProducts[index], [field]: value };
        updateData('products', newProducts);
    };

    const addProduct = () => {
        const newProducts = [...(data.products || []), { 
            name: 'Nuevo Producto', 
            price: '$0.00', 
            description: 'Descripción del producto', 
            imageUrl: '', 
            buttonText: 'Comprar' 
        }];
        updateData('products', newProducts);
    };

    const removeProduct = (index: number) => {
        const newProducts = (data.products || []).filter((_, i) => i !== index);
        updateData('products', newProducts);
    };

    return (
        <div className="space-y-4">
            <div className="border border-blue-200 p-4 rounded-lg space-y-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-sm text-blue-800">Generación Inteligente</h4>
                </div>
                <TextareaField label="Describe tu negocio o tipo de productos" value={userDescription} rows={3} onChange={(e) => setUserDescription(e.target.value)} onKeyPress={handleKeyPress} />
                <div className="text-xs text-slate-500 flex justify-between">
                    <span>Ctrl/Cmd + Enter para generar</span>
                    <span>{userDescription.length}/500</span>
                </div>
                <button onClick={handleGenerate} disabled={isLoading || !userDescription.trim() || userDescription.length > 500} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-md font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all">
                    {isLoading ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />Generando...</>) : (<><SparklesIcon className="w-4 h-4" />Generar catálogo</>)}
                </button>
            </div>
            <div className="space-y-3">
                <h4 className="font-medium text-sm text-slate-600">Configuración General</h4>
                <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
                <TextareaField label="Subtítulo de la Sección" value={data.subtitle} rows={2} onChange={(e) => updateData('subtitle', e.target.value)} />
            </div>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-medium text-sm text-slate-600">Productos ({data.products?.length || 0})</h4>
                    <button onClick={addProduct} className="bg-slate-200 text-slate-700 py-1.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-300 flex items-center gap-1"><PlusIcon className="w-4 h-4" />Añadir</button>
                </div>
                {(data.products || []).map((product, index) => (
                    <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50 relative">
                        <button onClick={() => removeProduct(index)} className="absolute top-2 right-2 w-6 h-6 bg-slate-200 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center" title="Eliminar producto"><XMarkIcon className="w-3 h-3" /></button>
                        <h4 className="font-medium text-sm text-slate-700 pr-8">Producto {index + 1}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <InputField label="Nombre" value={product.name} onChange={(e) => handleProductChange(index, 'name', e.target.value)} />
                            <InputField label="Precio" value={product.price} onChange={(e) => handleProductChange(index, 'price', e.target.value)} />
                        </div>
                        <InputField label="URL de Imagen" value={product.imageUrl} onChange={(e) => handleProductChange(index, 'imageUrl', e.target.value)} />
                        {data.variant === 'grid' && (<TextareaField label="Descripción" value={product.description} rows={2} onChange={(e) => handleProductChange(index, 'description', e.target.value)} />)}
                        {data.variant === 'grid' && (<InputField label="Texto del Botón" value={product.buttonText} onChange={(e) => handleProductChange(index, 'buttonText', e.target.value)} />)}
                    </div>
                ))}
            </div>
        </div>
    );
}

// --- Editor de ESTILO (SEPARADO) ---
export function CatalogStyleEditor({ data, updateData }: { data: CatalogData, updateData: (key: keyof CatalogData, value: string) => void }) {
    return (
        <div className="space-y-4">
            <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño General</h4>
            <ColorPalette label="Color de Fondo de Sección" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
            <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
            <TextColorPalette label="Color del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />
            
            <div className="border-t border-slate-200 pt-4 mt-4">
                <h4 className="font-medium text-sm text-slate-600 mb-3">Estilo de las Tarjetas de Producto</h4>
                {data.variant === 'grid' && (
                    <ColorPalette label="Color de Fondo de Tarjeta" selectedColor={data.cardColor} onChange={(color) => updateData('cardColor', color)} />
                )}
                <TextColorPalette label="Color de Nombre del Producto" selectedColor={data.productNameColor} onChange={(color) => updateData('productNameColor', color)} />
                <TextColorPalette label="Color del Precio" selectedColor={data.productPriceColor} onChange={(color) => updateData('productPriceColor', color)} />
                {data.variant === 'grid' && (
                    <>
                        <TextColorPalette label="Color de Descripción" selectedColor={data.productDescriptionColor} onChange={(color) => updateData('productDescriptionColor', color)} />
                        <ButtonColorPalette 
                            label="Estilo del Botón" 
                            selectedBgColor={data.buttonBgColor || ''} 
                            selectedTextColor={data.buttonTextColor || ''} 
                            onChange={(bg, text) => { 
                                updateData('buttonBgColor', bg); 
                                updateData('buttonTextColor', text); 
                            }} 
                        />
                    </>
                )}
            </div>
        </div>
    );
}