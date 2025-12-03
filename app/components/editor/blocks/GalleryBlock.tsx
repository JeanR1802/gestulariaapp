import React, { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid';

// --- INTERFAZ DE DATOS ---
export interface GalleryData {
  variant: 'grid' | 'carousel' | 'featured';
  images: { url: string; alt: string }[];
  spacing: 'sm' | 'md' | 'lg';
  width: 'normal' | 'wide' | 'full';
  lightbox: boolean;
}

// --- COMPONENTE DE RENDERIZADO DEL BLOQUE ---
export const GalleryBlock: React.FC<{ data: GalleryData }> = ({ data }) => {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const spacingClasses = { sm: 'gap-2', md: 'gap-4', lg: 'gap-8' };
  const spacingClass = spacingClasses[data.spacing] || 'gap-4';

  const widthClasses = {
    normal: 'max-w-4xl',
    wide: 'max-w-7xl',
    full: 'w-full',
  };
  const widthClass = widthClasses[data.width] || 'max-w-7xl';

  const renderGrid = () => (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ${spacingClass}`}>
      {(data.images.length > 0 ? data.images : Array(4).fill({ url: '', alt: 'Placeholder' })).map((img, index) => (
        <img
          key={index}
          src={img.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Imagen'}
          alt={img.alt}
          className="aspect-square w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => data.lightbox && setLightboxImage(img.url)}
        />
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className={`flex overflow-x-auto ${spacingClass}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {(data.images.length > 0 ? data.images : Array(5).fill({ url: '', alt: 'Placeholder' })).map((img, index) => (
        <div key={index} className="flex-shrink-0 w-2/3 sm:w-1/2 md:w-1/3 lg:w-1/4">
          <img
            src={img.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Imagen'}
            alt={img.alt}
            className="aspect-square w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => data.lightbox && setLightboxImage(img.url)}
          />
        </div>
      ))}
    </div>
  );

  const renderFeatured = () => {
    const images = data.images.length > 0 ? data.images : Array(3).fill({ url: '', alt: 'Placeholder' });
    const [first, ...rest] = images;
    return (
      <div className={`grid grid-cols-1 md:grid-cols-3 ${spacingClass}`}>
        <div className="md:col-span-2">
          <img
            src={first?.url || 'https://placehold.co/800x800/e2e8f0/64748b?text=Imagen'}
            alt={first?.alt}
            className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => data.lightbox && setLightboxImage(first?.url)}
          />
        </div>
        <div className={`grid grid-cols-2 md:grid-cols-1 ${spacingClass}`}>
          {rest.slice(0, 2).map((img, i) => (
            <img
              key={i}
              src={img.url || 'https://placehold.co/400x400/e2e8f0/64748b?text=Imagen'}
              alt={img.alt}
              className="w-full aspect-square object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => data.lightbox && setLightboxImage(img.url)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 px-4`}>
      <div className={`${widthClass} mx-auto`}>
        {data.variant === 'grid' && renderGrid()}
        {data.variant === 'carousel' && renderCarousel()}
        {data.variant === 'featured' && renderFeatured()}
      </div>

      {data.lightbox && lightboxImage && (
        <div 
          className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-fast"
          onClick={() => setLightboxImage(null)}
        >
          <img src={lightboxImage} alt="Vista ampliada" className="max-w-full max-h-full rounded-lg shadow-2xl" />
          <button className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl">&times;</button>
        </div>
      )}
    </div>
  );
};

// --- EDITOR DE CONTENIDO ---
export const GalleryContentEditor: React.FC<{ data: GalleryData; updateData: (key: keyof GalleryData, value: string | boolean | { url: string; alt: string }[]) => void }> = ({ data, updateData }) => {
  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...data.images];
    newImages[index] = { ...newImages[index], [field]: value };
    updateData('images', newImages);
  };

  const addImage = () => {
    updateData('images', [...data.images, { url: '', alt: '' }]);
  };

  const removeImage = (index: number) => {
    const newImages = data.images.filter((_, i) => i !== index);
    updateData('images', newImages);
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-semibold text-gray-700">Imágenes</label>
      <div className="space-y-3">
        {data.images.map((img, index) => (
          <div key={index} className="p-3 border rounded-lg bg-slate-50/80">
            <div className="flex items-center gap-2 mb-2">
                <Bars3Icon className="w-5 h-5 text-slate-400 cursor-grab" />
                <p className="text-xs font-medium text-slate-600">Imagen {index + 1}</p>
                <div className="flex-grow"></div>
                <button onClick={() => removeImage(index)} className="text-red-500 hover:text-red-700 text-xs font-semibold">Eliminar</button>
            </div>
            <div className="space-y-2">
                <input
                    type="text"
                    placeholder="URL de la imagen"
                    className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={img.url}
                    onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Texto alternativo (alt)"
                    className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    value={img.alt}
                    onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                />
            </div>
          </div>
        ))}
      </div>
      <button onClick={addImage} className="w-full text-center py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors">Añadir Imagen</button>
    </div>
  );
};

// --- EDITOR DE ESTILOS ---
export const GalleryStyleEditor: React.FC<{ data: GalleryData; updateData: (key: keyof GalleryData, value: string | boolean | { url: string; alt: string }[]) => void }> = ({ data, updateData }) => {
  
  const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <label className="text-sm font-medium text-slate-700 w-full sm:w-1/3 flex-shrink-0">{children}</label>
  );

  const ControlWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2">{children}</div>
  );

  return (
    <div className="space-y-4">
      <ControlWrapper>
        <Label>Variante</Label>
        <select
          className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={data.variant || 'grid'}
          onChange={e => updateData('variant', e.target.value)}
        >
          <option value="grid">Rejilla (Grid)</option>
          <option value="carousel">Carrusel</option>
          <option value="featured">Destacado</option>
        </select>
      </ControlWrapper>
      <ControlWrapper>
        <Label>Ancho del Bloque</Label>
        <select
          className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={data.width || 'wide'}
          onChange={e => updateData('width', e.target.value)}
        >
          <option value="normal">Normal</option>
          <option value="wide">Ancho</option>
          <option value="full">Ancho Completo</option>
        </select>
      </ControlWrapper>
      <ControlWrapper>
        <Label>Espaciado</Label>
        <select
          className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          value={data.spacing || 'md'}
          onChange={e => updateData('spacing', e.target.value)}
        >
          <option value="sm">Pequeño</option>
          <option value="md">Mediano</option>
          <option value="lg">Grande</option>
        </select>
      </ControlWrapper>
      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <Label>Activar Lightbox</Label>
          <input 
            type="checkbox" 
            checked={data.lightbox} 
            onChange={e => updateData('lightbox', e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
          />
      </div>
    </div>
  );
};