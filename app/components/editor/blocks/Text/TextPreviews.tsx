// Archivo: app/components/editor/blocks/Text/TextPreviews.tsx
import React from 'react';
import { TextData } from '../TextBlock';

export function TextPreview({ data }: { data: TextData }) {
  return (
    <div className="bg-white w-full p-4 flex flex-col gap-1.5 border border-slate-200 rounded">
      <div className="bg-slate-300 h-1.5 w-full rounded-full" />
      <div className="bg-slate-300 h-1.5 w-full rounded-full" />
      <div className="bg-slate-300 h-1.5 w-3/4 rounded-full" />
    </div>
  );
}