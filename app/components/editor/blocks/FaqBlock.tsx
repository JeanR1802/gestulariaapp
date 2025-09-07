'use client';
import React, { useState } from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon, SparklesIcon } from '@heroicons/react/24/outline';
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

// --- Componentes Internos para Cada Variante ---

const FaqList = ({ data }: { data: FaqData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(data.backgroundColor || 'bg-white', { "py-16 px-8": isDesktop, "py-12 px-6": isTablet, "py-8 px-4": isMobile })}>
      <div className={cn("mx-auto", { "max-w-4xl": isDesktop, "max-w-3xl": isTablet, "max-w-full": isMobile })}>
        <h2 className={cn("text-center font-bold", data.titleColor || 'text-slate-800', { "text-4xl mb-12": isDesktop, "text-3xl mb-10": isTablet, "text-2xl mb-8": isMobile })}>
          {data.title}
        </h2>
        <div className="space-y-8">
          {(data.items || []).map((item, index) => (
            <div key={index}>
              <h3 className={cn("font-semibold", data.questionColor || 'text-slate-900', { "text-2xl mb-3": isDesktop, "text-xl mb-2": isTablet, "text-lg mb-2": isMobile })}>
                {item.question}
              </h3>
              {/* --- INICIO DE LA CORRECCIÓN --- */}
              <p className={cn(data.answerColor || 'text-slate-600', { "text-lg": isDesktop, "text-base": isTablet || isMobile })}>
                {item.answer}
              </p>
              {/* --- FIN DE LA CORRECCIÓN --- */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FaqAccordion = ({ data }: { data: FaqData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();

    return (
        <div className={cn(data.backgroundColor || 'bg-white', { "py-16 px-8": isDesktop, "py-12 px-6": isTablet, "py-8 px-4": isMobile })}>
            <div className={cn("mx-auto", { "max-w-4xl": isDesktop, "max-w-3xl": isTablet, "max-w-full": isMobile })}>
                <h2 className={cn("text-center font-bold", data.titleColor || 'text-slate-800', { "text-4xl mb-12": isDesktop, "text-3xl mb-10": isTablet, "text-2xl mb-8": isMobile })}>
                    {data.title}
                </h2>
                <div className="divide-y divide-slate-200">
                    {(data.items || []).map((item, index) => (
                        <details key={index} className="group py-4">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                                <span className={cn("font-semibold", data.questionColor || 'text-slate-900', { "text-xl": isDesktop, "text-lg": isTablet, "text-base": isMobile })}>{item.question}</span>
                                <span className="transition group-open:rotate-180">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <p className={cn("mt-3 group-open:animate-fadeIn", data.answerColor || 'text-slate-600', { "text-base": isDesktop || isTablet, "text-sm": isMobile })}>
                                {item.answer}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </div>
    );
};
  
// --- Editor de Campos ---
export function FaqEditor({ data, updateData }: { data: FaqData, updateData: (key: keyof FaqData, value: string | FaqItem[]) => void }) {
    
    const [userDescription, setUserDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!userDescription) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/generate-block', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockType: 'faq', userDescription }),
            });
            const result = await res.json();
            if (res.ok) {
                if(result.title) updateData('title', result.title);
                if(result.items) updateData('items', result.items);
            } else {
                alert('Error al generar contenido con IA.');
            }
        } catch (e) {
            alert('Error de conexión con la IA.');
        } finally {
            setIsLoading(false);
        }
    };

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
            <div className="border border-blue-200 p-3 rounded-lg space-y-3 bg-blue-50">
                <h4 className="font-semibold text-sm text-blue-800">Generación Inteligente</h4>
                <TextareaField label="Describe tu negocio para generar FAQs" value={userDescription} rows={3} onChange={(e) => setUserDescription(e.target.value)} />
                <button onClick={handleGenerate} disabled={isLoading || !userDescription} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? 'Generando...' : <><SparklesIcon className="w-5 h-5" /> Generar contenido</>}
                </button>
            </div>

            <InputField 
                label="Título de la Sección" 
                value={data.title} 
                onChange={(e) => updateData('title', e.target.value)} 
            />
            
            {(data.items || []).map((item, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50 relative">
                     <button 
                        onClick={() => removeItem(index)}
                        className="absolute top-2 right-2 w-6 h-6 bg-slate-200 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600"
                        title="Eliminar pregunta"
                    >
                        <XMarkIcon className="w-4 h-4 mx-auto" />
                    </button>
                    <h4 className="font-medium text-sm text-slate-700">Pregunta {index + 1}</h4>
                    <InputField 
                        label="Pregunta" 
                        value={item.question} 
                        onChange={(e) => handleItemChange(index, 'question', e.target.value)} 
                    />
                    <TextareaField 
                        label="Respuesta" 
                        value={item.answer} 
                        rows={4} 
                        onChange={(e) => handleItemChange(index, 'answer', e.target.value)} 
                    />
                </div>
            ))}

            <button 
                onClick={addItem}
                className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2"
            >
                <PlusIcon className="w-5 h-5" />
                Añadir Pregunta
            </button>
            <div className="border-t border-slate-200 pt-4 space-y-4">
                <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
                <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
                <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
                <TextColorPalette label="Color de Preguntas" selectedColor={data.questionColor} onChange={(color) => updateData('questionColor', color)} />
                <TextColorPalette label="Color de Respuestas" selectedColor={data.answerColor} onChange={(color) => updateData('answerColor', color)} />
            </div>
        </div>
    );
}