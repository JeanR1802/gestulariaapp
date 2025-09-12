'use client';
import React, { useRef, JSX } from 'react';
import { Editable } from './TextBlock';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { BlockComponentProps } from './index';

// --- Interfaces de Datos ---
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
}

export interface TestimonialData {
  variant: 'single' | 'singleWithImage' | 'grid';
  title: string;
  testimonials: Testimonial[];
  backgroundColor?: string;
  cardColor?: string;
  titleColor?: string;
  quoteColor?: string;
  authorColor?: string;
  roleColor?: string;
}

// --- Helpers seguros para colores ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (!colorValue) return { className: defaultClass, style: {} } as const;
  if (colorValue.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } } as const;
  }
  return { className: colorValue, style: {} } as const;
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (!colorValue) return { className: defaultClass, style: {} } as const;
  if (colorValue.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } } as const;
  }
  return { className: colorValue, style: {} } as const;
};

// --- Utilidades de actualización inmutable ---
function updateTestimonialArray(
  testimonials: Testimonial[] = [],
  index: number,
  field: keyof Testimonial,
  value: string
): Testimonial[] {
  const next = [...testimonials];
  next[index] = { ...next[index], [field]: value } as Testimonial;
  return next;
}

// --- Componente "Director" ---
export function TestimonialBlock({ data, isEditing, onUpdate }: BlockComponentProps<TestimonialData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'singleWithImage':
      return <TestimonialSingleWithImage {...props} />;
    case 'grid':
      return <TestimonialGrid {...props} />;
    default:
      return <TestimonialSingle {...props} />;
  }
}

// --- Componentes Internos para Cada Variante ---
const TestimonialSingle = ({ data, isEditing, onUpdate }: BlockComponentProps<TestimonialData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const testimonial = data.testimonials?.[0];
  if (!testimonial) return null;

  const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-slate-50');
  const quoteStyles = getStyles(data.quoteColor, 'text-slate-700');
  const authorStyles = getStyles(data.authorColor, 'text-slate-900');
  const roleStyles = getStyles(data.roleColor, 'text-slate-500');

  const handleUpdate = (index: number, field: keyof Testimonial, value: string) => {
    if (onUpdate) onUpdate('testimonials', updateTestimonialArray(data.testimonials, index, field, value));
  };

  return (
    <div className={cn({ 'p-16': isDesktop, 'p-12': isTablet, 'p-8': isMobile }, bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-4xl mx-auto text-center">
        <blockquote className={cn('font-medium', { 'text-3xl': isDesktop, 'text-2xl': isTablet, 'text-xl': isMobile }, quoteStyles.className)} style={quoteStyles.style}>
          <Editable tagName="p" value={testimonial.quote} onUpdate={(v) => handleUpdate(0, 'quote', v)} isEditing={isEditing} />
        </blockquote>
        <footer className={cn('mt-8', { 'text-lg': isDesktop, 'text-base': isTablet || isMobile })}>
          <Editable tagName="div" value={testimonial.author} onUpdate={(v) => handleUpdate(0, 'author', v)} isEditing={isEditing} className={cn('font-semibold', authorStyles.className)} style={authorStyles.style} />
          <Editable tagName="div" value={testimonial.role} onUpdate={(v) => handleUpdate(0, 'role', v)} isEditing={isEditing} className={cn(roleStyles.className)} style={roleStyles.style} />
        </footer>
      </div>
    </div>
  );
};

const TestimonialSingleWithImage = ({ data, isEditing, onUpdate }: BlockComponentProps<TestimonialData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const testimonial = data.testimonials?.[0];
  if (!testimonial) return null;

  const bgStyles = getBackgroundStyles(data.backgroundColor);
  const quoteStyles = getStyles(data.quoteColor, 'text-slate-700');
  const authorStyles = getStyles(data.authorColor, 'text-slate-900');
  const roleStyles = getStyles(data.roleColor, 'text-slate-500');

  const handleUpdate = (index: number, field: keyof Testimonial, value: string) => {
    if (onUpdate) onUpdate('testimonials', updateTestimonialArray(data.testimonials, index, field, value));
  };

  return (
    <div className={cn({ 'py-16': isDesktop, 'py-12': isTablet, 'py-8': isMobile }, bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-2xl mx-auto text-center">
        <img className="w-24 h-24 mx-auto rounded-full object-cover" src={testimonial.imageUrl || 'https://placehold.co/100x100/e2e8f0/64748b?text=Foto'} alt={testimonial.author} />
        <blockquote className={cn('mt-8 font-medium', { 'text-2xl': isDesktop, 'text-xl': isTablet, 'text-lg': isMobile }, quoteStyles.className)} style={quoteStyles.style}>
          <Editable tagName="p" value={testimonial.quote} onUpdate={(v) => handleUpdate(0, 'quote', v)} isEditing={isEditing} />
        </blockquote>
        <footer className={cn('mt-6', { 'text-base': isDesktop, 'text-sm': isTablet || isMobile })}>
          <Editable tagName="div" value={testimonial.author} onUpdate={(v) => handleUpdate(0, 'author', v)} isEditing={isEditing} className={cn('font-semibold', authorStyles.className)} style={authorStyles.style} />
          <Editable tagName="div" value={testimonial.role} onUpdate={(v) => handleUpdate(0, 'role', v)} isEditing={isEditing} className={cn(roleStyles.className)} style={roleStyles.style} />
        </footer>
      </div>
    </div>
  );
};

const TestimonialGrid = ({ data, isEditing, onUpdate }: BlockComponentProps<TestimonialData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor);
  const cardStyles = getBackgroundStyles(data.cardColor, 'bg-slate-50');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const quoteStyles = getStyles(data.quoteColor, 'text-slate-700');
  const authorStyles = getStyles(data.authorColor, 'text-slate-900');
  const roleStyles = getStyles(data.roleColor, 'text-slate-500');

  const handleUpdateData = (key: keyof TestimonialData, value: string) => {
    if (onUpdate) onUpdate(key as string, value);
  };
  const handleUpdateItem = (index: number, field: keyof Testimonial, value: string) => {
    if (onUpdate) onUpdate('testimonials', updateTestimonialArray(data.testimonials, index, field, value));
  };

  return (
    <div className={cn({ 'py-16 px-8': isDesktop, 'py-12 px-6': isTablet, 'py-8 px-4': isMobile }, bgStyles.className)} style={bgStyles.style}>
      <div className={cn('mx-auto', { 'max-w-6xl': isDesktop, 'max-w-4xl': isTablet, 'max-w-full': isMobile })}>
        <Editable tagName="h2" value={data.title} onUpdate={(v) => handleUpdateData('title', v)} isEditing={isEditing} className={cn('text-center font-bold', { 'text-4xl mb-16': isDesktop, 'text-3xl mb-12': isTablet, 'text-2xl mb-8': isMobile }, titleStyles.className)} style={titleStyles.style} />
        <div className={cn('gap-8', { 'grid md:grid-cols-2 lg:grid-cols-3': isDesktop || isTablet, 'flex flex-col space-y-8': isMobile })}>
          {(data.testimonials || []).map((testimonial, index) => (
            <figure key={index} className={cn('p-8 rounded-lg', cardStyles.className)} style={cardStyles.style}>
              <blockquote className={cn(quoteStyles.className)} style={quoteStyles.style}>
                <Editable tagName="p" value={testimonial.quote} onUpdate={(v) => handleUpdateItem(index, 'quote', v)} isEditing={isEditing} />
              </blockquote>
              <figcaption className="flex items-center gap-4 mt-6">
                <img className="w-12 h-12 rounded-full object-cover" src={testimonial.imageUrl || 'https://placehold.co/50x50/e2e8f0/64748b?text=Foto'} alt={testimonial.author} />
                <div>
                  <Editable tagName="div" value={testimonial.author} onUpdate={(v) => handleUpdateItem(index, 'author', v)} isEditing={isEditing} className={cn('font-semibold', authorStyles.className)} style={authorStyles.style} />
                  <Editable tagName="div" value={testimonial.role} onUpdate={(v) => handleUpdateItem(index, 'role', v)} isEditing={isEditing} className={cn('text-sm', roleStyles.className)} style={roleStyles.style} />
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Editor de CONTENIDO (SEPARADO) ---
export function TestimonialContentEditor({ data, updateData }: { data: TestimonialData; updateData: (key: keyof TestimonialData, value: string | Testimonial[]) => void; }) {
  const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
    const newTestimonials = [...(data.testimonials || [])];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    updateData('testimonials', newTestimonials);
  };

  const addTestimonial = () => {
    const newTestimonials = [...(data.testimonials || []), { quote: '', author: '', role: '', imageUrl: '' }];
    updateData('testimonials', newTestimonials);
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = (data.testimonials || []).filter((_, i) => i !== index);
    updateData('testimonials', newTestimonials);
  };

  return (
    <div className="space-y-4">
      {data.variant === 'grid' && (
        <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      )}

      {(data.testimonials || []).map((testimonial, index) => (
        <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50 relative">
          <button onClick={() => removeTestimonial(index)} className="absolute top-2 right-2 w-6 h-6 bg-slate-200 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600" title="Eliminar testimonio">
            <XMarkIcon className="w-4 h-4 mx-auto" />
          </button>
          <h4 className="font-medium text-sm text-slate-700">Testimonio {index + 1}</h4>
          <TextareaField label="Cita" value={testimonial.quote} rows={4} onChange={(e) => handleTestimonialChange(index, 'quote', e.target.value)} />
          <InputField label="Autor" value={testimonial.author} onChange={(e) => handleTestimonialChange(index, 'author', e.target.value)} />
          <InputField label="Cargo o Empresa" value={testimonial.role} onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)} />
          {(data.variant === 'singleWithImage' || data.variant === 'grid') && (
            <InputField label="URL de la Imagen" value={testimonial.imageUrl || ''} onChange={(e) => handleTestimonialChange(index, 'imageUrl', e.target.value)} />
          )}
        </div>
      ))}

      {data.variant === 'grid' && (
        <button onClick={addTestimonial} className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Añadir Testimonio
        </button>
      )}
    </div>
  );
}

// --- Editor de ESTILO (SEPARADO) ---
export function TestimonialStyleEditor({ data, updateData }: { data: TestimonialData; updateData: (key: keyof TestimonialData, value: string) => void; }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ColorPalette label="Color de Fondo de Sección" selectedColor={data.backgroundColor || ''} onChange={(color) => updateData('backgroundColor', color)} />
      </div>
      {data.variant === 'grid' && (
        <div className="flex items-center gap-2">
          <ColorPalette label="Color de Fondo de Tarjeta" selectedColor={data.cardColor || ''} onChange={(color) => updateData('cardColor', color)} />
        </div>
      )}
      {data.variant === 'grid' && (
        <div className="flex items-center gap-2">
          <TextColorPalette label="Color del Título" selectedColor={data.titleColor || ''} onChange={(color) => updateData('titleColor', color)} />
        </div>
      )}
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color de la Cita" selectedColor={data.quoteColor || ''} onChange={(color) => updateData('quoteColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color del Autor" selectedColor={data.authorColor || ''} onChange={(color) => updateData('authorColor', color)} />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette label="Color del Cargo" selectedColor={data.roleColor || ''} onChange={(color) => updateData('roleColor', color)} />
      </div>
    </div>
  );
}
