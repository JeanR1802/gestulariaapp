'use client';
import React, { JSX } from 'react';
import { useEditable } from 'use-editable';
import { cn } from '@/lib/utils';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { BlockComponentProps } from './index';
import { Editable } from './TextBlock';

// --- Tipos de datos ---
interface FaqItem { question: string; answer: string; }
export interface FaqData {
  variant: 'list' | 'accordion';
  title: string;
  items: FaqItem[];
  backgroundColor: string;
  titleColor: string;
  questionColor: string;
  answerColor: string;
  iconColor: string;
}

// --- Helpers de estilos ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) return { className: '', style: { color: colorValue.slice(1, -1) } } as const;
  return { className: colorValue || defaultClass, style: {} } as const;
};
const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (colorValue?.startsWith('[#')) return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } } as const;
  return { className: colorValue || defaultClass, style: {} } as const;
};

// --- Director ---
export function FaqBlock({ data, isEditing, onUpdate }: BlockComponentProps<FaqData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'accordion':
      return <FaqAccordion {...props} />;
    default:
      return <FaqList {...props} />;
  }
}

// --- Actualización inmutable de items ---
function updateItem(items: FaqItem[] = [], index: number, field: keyof FaqItem, value: string): FaqItem[] {
  const next = [...items];
  next[index] = { ...next[index], [field]: value } as FaqItem;
  return next;
}

// --- Variantes ---
const FaqList = ({ data, isEditing, onUpdate }: BlockComponentProps<FaqData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const qStyles = getStyles(data.questionColor, 'text-slate-900');
  const aStyles = getStyles(data.answerColor, 'text-slate-600');

  const handleUpdate = (key: keyof FaqData, value: string | FaqItem[]) => { if (onUpdate) onUpdate(key as string, value); };
  const handleItem = (idx: number, field: keyof FaqItem, value: string) => handleUpdate('items', updateItem(data.items, idx, field, value));

  return (
    <section className={cn({ 'py-16 px-8': isDesktop, 'py-12 px-6': isTablet, 'py-10 px-4': isMobile }, bg.className)} style={bg.style}>
      <div className={cn('mx-auto', { 'max-w-4xl': isDesktop || isTablet, 'max-w-full': isMobile })}>
        <Editable tagName="h2" value={data.title} onUpdate={(v) => handleUpdate('title', v)} isEditing={isEditing} className={cn('text-center font-bold mb-10', { 'text-4xl': isDesktop, 'text-3xl': isTablet, 'text-2xl': isMobile }, titleStyles.className)} style={titleStyles.style} />
        <div className="space-y-6">
          {(data.items || []).map((item, idx) => (
            <div key={idx} className="border-b border-slate-200 pb-6">
              <Editable tagName="h3" value={item.question} onUpdate={(v) => handleItem(idx, 'question', v)} isEditing={isEditing} className={cn('font-semibold mb-2', qStyles.className)} style={qStyles.style} />
              <Editable tagName="p" value={item.answer} onUpdate={(v) => handleItem(idx, 'answer', v)} isEditing={isEditing} className={cn(aStyles.className)} style={aStyles.style} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqAccordion = ({ data, isEditing, onUpdate }: BlockComponentProps<FaqData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const qStyles = getStyles(data.questionColor, 'text-slate-900');
  const aStyles = getStyles(data.answerColor, 'text-slate-600');

  const handleUpdate = (key: keyof FaqData, value: string | FaqItem[]) => { if (onUpdate) onUpdate(key as string, value); };
  const handleItem = (idx: number, field: keyof FaqItem, value: string) => handleUpdate('items', updateItem(data.items, idx, field, value));

  // Para el modo edición, mantenemos todo expandido para permitir editar respuestas.
  return (
    <section className={cn({ 'py-16 px-8': isDesktop, 'py-12 px-6': isTablet, 'py-10 px-4': isMobile }, bg.className)} style={bg.style}>
      <div className={cn('mx-auto', { 'max-w-3xl': isDesktop || isTablet, 'max-w-full': isMobile })}>
        <Editable tagName="h2" value={data.title} onUpdate={(v) => handleUpdate('title', v)} isEditing={isEditing} className={cn('text-center font-bold mb-8', { 'text-4xl': isDesktop, 'text-3xl': isTablet, 'text-2xl': isMobile }, titleStyles.className)} style={titleStyles.style} />
        <div className="divide-y divide-slate-200">
          {(data.items || []).map((item, idx) => (
            <div key={idx} className="py-4">
              <Editable tagName="h3" value={item.question} onUpdate={(v) => handleItem(idx, 'question', v)} isEditing={isEditing} className={cn('font-semibold', qStyles.className)} style={qStyles.style} />
              <div className="mt-2">
                <Editable tagName="p" value={item.answer} onUpdate={(v) => handleItem(idx, 'answer', v)} isEditing={isEditing} className={cn(aStyles.className)} style={aStyles.style} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Editor de CONTENIDO ---
export function FaqContentEditor({ data, updateData }: { data: FaqData; updateData: (key: keyof FaqData, value: string | FaqItem[]) => void; }) {
  const onItemChange = (index: number, field: keyof FaqItem, value: string) => {
    const next = [...(data.items || [])];
    next[index] = { ...next[index], [field]: value };
    updateData('items', next);
  };
  const addItem = () => {
    const next = [...(data.items || []), { question: 'Nueva pregunta', answer: 'Nueva respuesta' }];
    updateData('items', next);
  };
  const removeItem = (index: number) => {
    const next = (data.items || []).filter((_, i) => i !== index);
    updateData('items', next);
  };

  return (
    <div className="space-y-4">
      <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      {(data.items || []).map((item, idx) => (
        <div key={idx} className="border p-3 rounded-lg bg-slate-50 relative space-y-3">
          <button onClick={() => removeItem(idx)} className="absolute top-2 right-2 w-6 h-6 bg-slate-200 text-slate-500 rounded-full hover:bg-red-100 hover:text-red-600 flex items-center justify-center" title="Eliminar">
            <XMarkIcon className="w-4 h-4" />
          </button>
          <InputField label={`Pregunta ${idx + 1}`} value={item.question} onChange={(e) => onItemChange(idx, 'question', e.target.value)} />
          <TextareaField label="Respuesta" value={item.answer} rows={3} onChange={(e) => onItemChange(idx, 'answer', e.target.value)} />
        </div>
      ))}
      <button onClick={addItem} className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2">
        <PlusIcon className="w-5 h-5" /> Añadir Pregunta
      </button>
    </div>
  );
}

// --- Editor de ESTILO ---
export function FaqStyleEditor({ data, updateData }: { data: FaqData; updateData: (key: keyof FaqData, value: string) => void; }) {
  return (
    <div className="space-y-3">
      <ColorPalette label="Fondo" selectedColor={data.backgroundColor || ''} onChange={(color) => updateData('backgroundColor', color)} />
      <TextColorPalette label="Título" selectedColor={data.titleColor || ''} onChange={(color) => updateData('titleColor', color)} />
      <TextColorPalette label="Pregunta" selectedColor={data.questionColor || ''} onChange={(color) => updateData('questionColor', color)} />
      <TextColorPalette label="Respuesta" selectedColor={data.answerColor || ''} onChange={(color) => updateData('answerColor', color)} />
    </div>
  );
}
