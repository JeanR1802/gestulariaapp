// app/components/editor/blocks/Stack/StackPreviews.tsx

import React from 'react';
import { StackData } from './../StackBlock';

export function StackPreviewDefault({ data }: { data: StackData }) {
  return (
    <div className="bg-white w-full p-4 flex flex-col gap-2 border border-slate-200 rounded">
      <div className="bg-slate-700 h-2 w-3/4 rounded-sm" />
      <div className="bg-slate-300 h-1.5 w-full rounded-full" />
      <div className="bg-slate-300 h-1.5 w-5/6 rounded-full" />
      <div className="bg-blue-600 h-3 w-12 rounded-md mt-1" />
    </div>
  );
}