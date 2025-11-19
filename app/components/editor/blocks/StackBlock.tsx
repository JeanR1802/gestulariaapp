'use client';
import React from 'react';
import { BlockComponentProps } from './index';
import { Editable } from './TextBlock';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { cn } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { TrashIcon, ArrowUpIcon, ArrowDownIcon, Heading, Type, Image, Circle } from 'lucide-react';
import { StackElement, StackElementType } from './CustomStackElements';

// --- 1. INTERFACES DE DATOS ---

// Interfaz principal para los datos del bloque Stack
export interface StackData {
  variant: 'default';
  elements: StackElement[];
  backgroundColor?: string;
}


export function StackBlock({ data, isEditing, onUpdate }: BlockComponentProps<StackData>) {
    const handleElementUpdate = (index: number, newElementData: StackElement['data']) => {
        if (!onUpdate) return;
        const newElements = [...data.elements];
        newElements[index] = { ...newElements[index], data: newElementData };
        onUpdate('elements', newElements);
    };

    return (
        <div className="py-8 px-4 space-y-4" style={{ backgroundColor: data.backgroundColor || 'transparent' }}>
            <div className="max-w-4xl mx-auto">
                {(data.elements || []).map((element: StackElement, index: number) => (
                    <ElementRenderer key={element.id} element={element} isEditing={isEditing} onUpdate={(newData: StackElement['data']) => handleElementUpdate(index, newData)} />
                ))}
            </div>
        </div>
    );
}

// --- 2. COMPONENTE DE RENDERIZADO ---

const ElementRenderer: React.FC<{ element: StackElement; isEditing?: boolean; onUpdate: (value: StackElement['data']) => void }> = ({ element, isEditing, onUpdate }) => {
    switch (element.type) {
        case 'heading':
            return <Editable tagName={element.data.level || 'h2'} value={element.data.content || ''} onUpdate={(v: string) => onUpdate({ ...element.data, content: v })} isEditing={isEditing} className={cn('font-bold', { 'text-3xl': element.data.level === 'h2', 'text-2xl': element.data.level === 'h3', 'text-xl': element.data.level === 'h4' })} />;
        case 'paragraph':
            return <Editable tagName="p" value={element.data.content || ''} onUpdate={(v: string) => onUpdate({ ...element.data, content: v })} isEditing={isEditing} className="leading-relaxed" />;
        case 'image':
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={element.data.imageUrl || 'https://placehold.co/800x450/e2e8f0/64748b?text=Imagen'} alt={element.data.alt} className="mx-auto rounded-lg max-w-full h-auto my-4" />;
        case 'button':
            return <a href={element.data.buttonLink || '#'} className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md font-semibold my-4">{element.data.buttonText}</a>;
        case 'spacer':
            return <div style={{ height: `${element.data.height || 20}px` }} />;
        default:
            return null;
    }
};

// --- 3. EDITOR DE CONTENIDO ---

export function StackContentEditor({ data, updateData }: { data: StackData; updateData: (key: keyof StackData, value: StackElement[] | string) => void; }) {
    const updateElements = (newElements: StackElement[]) => {
        updateData('elements', newElements);
    };

    const addElement = (type: StackElementType) => {
        let newElement: StackElement;
        switch(type) {
            case 'heading':
                newElement = { id: nanoid(), type, data: { content: 'Nuevo Encabezado', level: 'h2' }};
                break;
            case 'paragraph':
                newElement = { id: nanoid(), type, data: { content: 'Este es un nuevo párrafo. Haz clic para editarlo.' }};
                break;
            case 'image':
                newElement = { id: nanoid(), type, data: { imageUrl: '', alt: 'Descripción de imagen' }};
                break;
            case 'button':
                newElement = { id: nanoid(), type, data: { buttonText: 'Botón', buttonLink: '#' }};
                break;
            case 'spacer':
                newElement = { id: nanoid(), type, data: { height: 20 }};
                break;
            default:
                newElement = { id: nanoid(), type, data: {} };
        }
        updateElements([...(data.elements || []), newElement]);
    };

    const removeElement = (index: number) => {
        updateElements(data.elements.filter((_, i) => i !== index));
    };

    const moveElement = (index: number, direction: 'up' | 'down') => {
        const newElements = [...data.elements];
        const to = direction === 'up' ? index - 1 : index + 1;
        if (to < 0 || to >= newElements.length) return;
        const [movedElement] = newElements.splice(index, 1);
        newElements.splice(to, 0, movedElement);
        updateElements(newElements);
    };
    
    const updateElementData = (index: number, field: keyof StackElement['data'], value: string | number) => {
        const newElements = [...data.elements];
        newElements[index] = { ...newElements[index], data: { ...newElements[index].data, [field]: value }};
        updateElements(newElements);
    };

    return (
        <div className="space-y-4">
            {/* Panel de Elementos (responsive, touch-friendly) */}
            <div className="border p-3 rounded-lg bg-slate-50 space-y-3 max-h-[50vh] sm:max-h-none overflow-auto">
                {(data.elements || []).map((element, index) => (
                    <details key={element.id} className="p-2 border bg-white rounded-md" open>
                        <summary className="flex justify-between items-center cursor-pointer">
                            <span className="text-xs font-bold text-slate-500 uppercase">{element.type}</span>
                            <div className="flex items-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); moveElement(index, 'up'); }} disabled={index === 0} aria-label="Mover arriba" className="p-2 sm:p-1 rounded-md disabled:opacity-30">
                                    <ArrowUpIcon className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); moveElement(index, 'down'); }} disabled={index === (data.elements.length - 1)} aria-label="Mover abajo" className="p-2 sm:p-1 rounded-md disabled:opacity-30">
                                    <ArrowDownIcon className="w-4 h-4" />
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); removeElement(index); }} aria-label="Eliminar" className="p-2 rounded-md text-red-500">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </summary>

                        <div className="mt-2">
                            {/* Editores específicos */}
                            {element.type === 'heading' && (
                                <InputField label="Texto" value={element.data.content || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElementData(index, 'content', e.target.value)} />
                            )}
                            {element.type === 'paragraph' && (
                                <TextareaField label="Texto" value={element.data.content || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateElementData(index, 'content', e.target.value)} />
                            )}
                            {element.type === 'image' && (
                                <InputField label="URL de Imagen" value={element.data.imageUrl || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElementData(index, 'imageUrl', e.target.value)} />
                            )}
                            {element.type === 'button' && (
                                <>
                                    <InputField label="Texto del Botón" value={element.data.buttonText || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElementData(index, 'buttonText', e.target.value)} />
                                    <InputField label="Enlace" value={element.data.buttonLink || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElementData(index, 'buttonLink', e.target.value)} />
                                </>
                            )}
                            {element.type === 'spacer' && (
                                <InputField label="Altura (px)" value={String(element.data.height || 20)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateElementData(index, 'height', Number(e.target.value))} />
                            )}
                        </div>
                    </details>
                ))}
            </div>

            {/* Botones para añadir elementos (responsive) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button onClick={() => addElement('heading')} className="flex items-center justify-center gap-2 p-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm"><Heading className="w-4 h-4" /> Título</button>
                <button onClick={() => addElement('paragraph')} className="flex items-center justify-center gap-2 p-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm"><Type className="w-4 h-4" /> Párrafo</button>
                <button onClick={() => addElement('image')} className="flex items-center justify-center gap-2 p-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm"><Image className="w-4 h-4" /> Imagen</button>
                <button onClick={() => addElement('button')} className="flex items-center justify-center gap-2 p-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 text-sm"><Circle className="w-4 h-4" /> Botón</button>
            </div>
        </div>
    );
}

// --- 4. EDITOR DE ESTILO ---

export function StackStyleEditor({ data, updateData }: { data: StackData; updateData: (key: keyof StackData, value: string) => void; }) {
    return (
        <div className="space-y-4">
            <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor || ''} onChange={(color: string) => updateData('backgroundColor', color)} />
        </div>
    );
}