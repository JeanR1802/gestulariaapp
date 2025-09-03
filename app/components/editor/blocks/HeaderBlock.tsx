import React, { ChangeEvent } from 'react';

// --- Se define una interfaz estricta para los datos del Header ---
interface HeaderData {
  logoText: string;
  link1: string;
  link2: string;
  link3: string;
}

// --- Componente de Ayuda para Formularios con tipos correctos ---
const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: (e: ChangeEvent<HTMLInputElement>) => void }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input 
          type="text" 
          value={value || ''} 
          onChange={onChange} 
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
        />
    </div>
);

// --- Componente Visual del Bloque ---
export function HeaderBlock({ data }: { data: HeaderData }) {
  return (
    <header className="bg-white p-4 border-b">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">{data.logoText || 'Mi Negocio'}</h1>
        <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-600">
          <a href="#" className="hover:text-blue-600">{data.link1 || 'Inicio'}</a>
          <a href="#" className="hover:text-blue-600">{data.link2 || 'Servicios'}</a>
          <a href="#" className="hover:text-blue-600">{data.link3 || 'Contacto'}</a>
        </nav>
      </div>
    </header>
  );
}

// --- Formulario de Edición del Bloque ---
export function HeaderEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Texto del Logo" value={data.logoText} onChange={(e) => updateData('logoText', e.target.value)} />
      <InputField label="Enlace 1" value={data.link1} onChange={(e) => updateData('link1', e.target.value)} />
      <InputField label="Enlace 2" value={data.link2} onChange={(e) => updateData('link2', e.target.value)} />
      <InputField label="Enlace 3" value={data.link3} onChange={(e) => updateData('link3', e.target.value)} />
    </div>
  );
}