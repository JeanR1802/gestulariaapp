import React from 'react';
import { TextareaField } from './InputField';

export interface TextData { content: string; }

export function TextBlock({ data }: { data: TextData }) {
  return (
    <div className="prose prose-slate max-w-none p-4">
      <p dangerouslySetInnerHTML={{ __html: (data.content || '').replace(/\n/g, '<br />') }}></p>
    </div>
  );
}

export function TextEditor({ data, updateData }: { data: TextData, updateData: (key: keyof TextData, value: string) => void }) {
  return (
    <TextareaField label="Contenido" value={data.content} rows={8} onChange={(e) => updateData('content', e.target.value)} />
  );
}