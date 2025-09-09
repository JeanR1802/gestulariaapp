// Reemplaza el contenido de app/components/editor/blocks/FaqBlock.tsx
'use client';
import React, { useState } from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

// --- Interfaces de Datos ---
interface FaqItem {
  question: string;
  answer: string;
}

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

// --- Componente "Director" ---
export function FaqBlock({ data }: { data: FaqData }) {
  switch (data.variant) {
    case 'accordion':
      return <FaqAccordion data={data} />;
    default:
      return <FaqList data={data} />;
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

// --- Componentes Internos para Cada Variante ---
const FaqList = ({ data }: { data: FaqData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor);
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const questionStyles = getStyles(data.questionColor, 'text-slate-900');
  const answerStyles = getStyles(data.answerColor, 'text-slate-600');
  
  return (
    <div className={cn({ "py-16 px-8": isDesktop, "py-12 px-6": isTablet, "py-8 px-4": isMobile }, bgStyles.className)} style={bgStyles.style}>
      <div className={cn("mx-auto", { "max-w-4xl": isDesktop || isTablet, "max-w-full": isMobile })}>
        <h2 className={cn("font-bold text-center", { "text-4xl mb-12": isDesktop, "text-3xl mb-10": isTablet, "text-2xl mb-8": isMobile }, titleStyles.className)} style={titleStyles.style}>
          {data.title}
        </h2>
        <div className="space-y-8">
          {(data.items || []).map((item, index) => (
            <div key={index}>
              <h3 className={cn("font-semibold", { "text-xl mb-2": isDesktop, "text-lg mb-2": isTablet, "text-base mb-1": isMobile }, questionStyles.className)} style={questionStyles.style}>
                {item.question}
              </h3>
              <p className={cn({ "text-base leading-relaxed": isDesktop || isTablet, "text-sm leading-relaxed": isMobile }, answerStyles.className)} style={answerStyles.style}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccordionItem = ({ item, data }: { item: FaqItem, data: FaqData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const questionStyles = getStyles(data.questionColor, 'text-slate-900');
    const answerStyles = getStyles(data.answerColor, 'text-slate-600');
    const iconStyles = getStyles(data.iconColor, 'text-slate-500');

    return (
        <div className="border-b border-slate-200 py-4">
            <button
                className="w-full flex justify-between items-center text-left"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className={cn("font-semibold text-lg", questionStyles.className)} style={questionStyles.style}>
                    {item.question}
                </h3>
                <ChevronDownIcon className={cn("w-5 h-5 transition-transform", { "transform rotate-180": isOpen }, iconStyles.className)} style={iconStyles.style} />
            </button>
            {isOpen && (
                <div className={cn("mt-4 text-base leading-relaxed", answerStyles.className)} style={answerStyles.style}>
                    <p>{item.answer}</p>
                </div>
            )}
        </div>
    );
};

const FaqAccordion = ({ data }: { data: FaqData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();
    const bgStyles = getBackgroundStyles(data.backgroundColor);
    const titleStyles = getStyles(data.titleColor, 'text-slate-800');
    
    return (
        <div className={cn({ "py-16 px-8": isDesktop, "py-12 px-6": isTablet, "py-8 px-4": isMobile }, bgStyles.className)} style={bgStyles.style}>
            <div className={cn("mx-auto", { "max-w-3xl": isDesktop || isTablet, "max-w-full": isMobile })}>
                <h2 className={cn("font-bold text-center", { "text-4xl mb-12": isDesktop, "text-3xl mb-10": isTablet, "text-2xl mb-8": isMobile }, titleStyles.className)} style={titleStyles.style}>
                    {data.title}
                </h2>
                <div>
                    {(data.items || []).map((item, index) => (
                        <AccordionItem key={index} item={item} data={data} />
                    ))}
                </div>
            </div>
        </div>
    );
};
  
// --- Editor de CONTENIDO (SEPARADO) ---
export function FaqContentEditor({ data, updateData }: { data: FaqData, updateData: (key: keyof FaqData, value: string | FaqItem[]) => void }) {
    const handleItemChange = (index: number, field: keyof FaqItem, value: string) => {
        const newItems = [...(data.items || [])];
        newItems[index] = { ...newItems[index], [field]: value };
        updateData('items', newItems);
    };

    const addItem = () => {
        const newItems = [...(data.items || []), { question: '', answer: '' }];
        updateData('items', newItems);
    };

    const removeItem = (index: number) => {
        const newItems = (data.items || []).filter((_, i) => i !== index);
        updateData('items', newItems);
    };

    return (
        <div className="space-y-4">
            <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
            
            {(data.items || []).map((item, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50 relative">
                     <button onClick={() => removeItem(index)} className="absolute top-2 right-2 w-6 h-6 bg-slate-200 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600" title="Eliminar item"><XMarkIcon className="w-4 h-4 mx-auto" /></button>
                    <h4 className="font-medium text-sm text-slate-700">Item {index + 1}</h4>
                    <InputField label="Pregunta" value={item.question} onChange={(e) => handleItemChange(index, 'question', e.target.value)} />
                    <TextareaField label="Respuesta" value={item.answer} rows={3} onChange={(e) => handleItemChange(index, 'answer', e.target.value)} />
                </div>
            ))}

            <button onClick={addItem} className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2"><PlusIcon className="w-5 h-5" />Añadir Pregunta</button>
        </div>
    );
}

// --- Editor de ESTILO (SEPARADO) ---
export function FaqStyleEditor({ data, updateData }: { data: FaqData, updateData: (key: keyof FaqData, value: string) => void }) {
    return (
        <div className="space-y-4">
            <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
            <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
            <TextColorPalette label="Color de Preguntas" selectedColor={data.questionColor} onChange={(color) => updateData('questionColor', color)} />
            <TextColorPalette label="Color de Respuestas" selectedColor={data.answerColor} onChange={(color) => updateData('answerColor', color)} />
            {data.variant === 'accordion' && (
                <TextColorPalette label="Color del Ícono" selectedColor={data.iconColor} onChange={(color) => updateData('iconColor', color)} />
            )}
        </div>
    );
}