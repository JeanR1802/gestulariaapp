import React from 'react';
import { TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

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

export function TextEditor({ data, updateData }: { data: TextData, updateData: (key: keyof TextData, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
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