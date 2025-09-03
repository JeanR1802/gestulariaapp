import React, { ChangeEvent } from 'react';

export const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input type="text" value={value || ''} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
    </div>
);

export const TextareaField = ({ label, value, rows = 3, onChange }: { label: string, value: string, rows?: number, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <textarea value={value || ''} onChange={onChange} rows={rows} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
    </div>
);