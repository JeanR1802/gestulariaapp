import React from 'react';

// Componente Visual
export function HeaderBlock({ data }: { data: any }) {
  return (
    <header className="bg-white p-4 border-b">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">{data.logoText || 'Mi Negocio'}</h1>
        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <a href="#" className="hover:text-blue-600">{data.link1 || 'Inicio'}</a>
          <a href="#" className="hover:text-blue-600">{data.link2 || 'Servicios'}</a>
          <a href="#" className="hover:text-blue-600">{data.link3 || 'Contacto'}</a>
        </nav>
      </div>
    </header>
  );
}

// Formulario de Edición
export function HeaderEditor({ data, updateData }: { data: any, updateData: (key: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Texto del Logo" value={data.logoText} onChange={(e) => updateData('logoText', e.target.value)} />
      <InputField label="Enlace 1" value={data.link1} onChange={(e) => updateData('link1', e.target.value)} />
      <InputField label="Enlace 2" value={data.link2} onChange={(e) => updateData('link2', e.target.value)} />
      <InputField label="Enlace 3" value={data.link3} onChange={(e) => updateData('link3', e.target.value)} />
    </div>
  );
}

// Componentes de Ayuda para Formularios (puedes moverlos a un archivo separado si quieres)
const InputField = ({ label, value, onChange }: { label: string, value: string, onChange: any }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <input type="text" value={value || ''} onChange={onChange} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500" />
    </div>
);