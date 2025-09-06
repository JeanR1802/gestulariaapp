// app/components/editor/blocks/TextBlock.tsx
'use client';
import React, { useState, KeyboardEvent } from 'react';
import { TextareaField, InputField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { SparklesIcon } from '@heroicons/react/24/outline';

export interface TextData {
  variant: 'default' | 'quote' | 'highlighted';
  content: string;
  backgroundColor: string;
  textColor: string;
}

export function TextBlock({ data }: { data: TextData }) {
  switch (data.variant) {
    case 'quote': return <TextQuote data={data} />;
    case 'highlighted': return <TextHighlighted data={data} />;
    default: return <TextDefault data={data} />;
  }
}

const TextDefault = ({ data }: { data: TextData }) => (
  <div className={`prose prose-slate max-w-none p-4 ${data.backgroundColor || ''}`}>
    <p className={data.textColor || 'text-slate-800'} dangerouslySetInnerHTML={{ __html: (data.content || '').replace(/\n/g, '<br />') }}></p>
  </div>
);
const TextQuote = ({ data }: { data: TextData }) => (
  <div className={`p-4 ${data.backgroundColor || ''}`}>
    <blockquote className="border-l-4 border-slate-400 pl-4 italic">
      <p className={data.textColor || 'text-slate-600'} dangerouslySetInnerHTML={{ __html: (data.content || '').replace(/\n/g, '<br />') }}></p>
    </blockquote>
  </div>
);
const TextHighlighted = ({ data }: { data: TextData }) => (
  <div className="p-4">
    <div className={`border rounded-lg p-4 ${data.backgroundColor || 'bg-blue-50 border-blue-200'}`}>
      <p className={data.textColor || 'text-blue-800'} dangerouslySetInnerHTML={{ __html: (data.content || '').replace(/\n/g, '<br />') }}></p>
    </div>
  </div>
);

export function TextEditor({ data, updateData }: { data: TextData, updateData: (key: keyof TextData, value: string) => void }) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/generate-block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: 'text',
          userDescription: prompt,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        updateData('content', result.content);
      } else {
        alert('Error al generar texto con IA.');
      }
    } catch (e) {
      alert('Error de conexión con la IA.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Maneja el evento de teclado para generar al presionar Enter
  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault(); // Evita un salto de línea
      handleGenerate();
    }
  };

  return (
    <div className="space-y-4">
      {/* Nuevo control para la generación con IA */}
      <div className="border border-blue-200 p-3 rounded-lg space-y-3 bg-blue-50">
        <h4 className="font-semibold text-sm text-blue-800">Generación con IA</h4>
        <TextareaField
          label="Describe el texto que necesitas"
          value={prompt}
          rows={3}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            'Generando...'
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Generar texto
            </>
          )}
        </button>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm text-slate-600">Contenido</h4>
        <TextareaField label="Contenido" value={data.content} rows={8} onChange={(e) => updateData('content', e.target.value)} />
      </div>

      <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
        <TextColorPalette label="Color del Texto" selectedColor={data.textColor} onChange={(color) => updateData('textColor', color)} />
      </div>
    </div>
  );
}