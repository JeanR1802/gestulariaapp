// Archivo: app/components/editor/blocks/TextBlock.tsx (ACTUALIZADO)
import React from 'react';
import { TextareaField } from './InputField';

// 1. Actualizamos la interfaz para que incluya la variante
export interface TextData {
  variant: 'default' | 'quote' | 'highlighted';
  content: string;
}

// 2. Componente "director" que elige qué diseño de texto mostrar
export function TextBlock({ data }: { data: TextData }) {
  switch (data.variant) {
    case 'quote':
      return <TextQuote data={data} />;
    case 'highlighted':
      return <TextHighlighted data={data} />;
    case 'default':
    default:
      return <TextDefault data={data} />;
  }
}

// --- Componentes internos para cada variante ---
const TextDefault = ({ data }: { data: TextData }) => (
  <div className="prose prose-slate max-w-none p-4">
    <p dangerouslySetInnerHTML={{ __html: (data.content || '').replace(/\n/g, '<br />') }}></p>
  </div>
);

const TextQuote = ({ data }: { data: TextData }) => (
  <div className="p-4">
    <blockquote className="border-l-4 border-slate-400 pl-4 italic text-slate-600">
      <p dangerouslySetInnerHTML={{ __html: (data.content || '').replace(/\n/g, '<br />') }}></p>
    </blockquote>
  </div>
);

const TextHighlighted = ({ data }: { data: TextData }) => (
  <div className="p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
        <p dangerouslySetInnerHTML={{ __html: (data.content || '').replace(/\n/g, '<br />') }}></p>
      </div>
  </div>
);


// 3. El editor sigue siendo el mismo, ya que todas las variantes usan el mismo campo
export function TextEditor({ data, updateData }: { data: TextData, updateData: (key: keyof TextData, value: string) => void }) {
  return (
    <TextareaField label="Contenido" value={data.content} rows={8} onChange={(e) => updateData('content', e.target.value)} />
  );
}