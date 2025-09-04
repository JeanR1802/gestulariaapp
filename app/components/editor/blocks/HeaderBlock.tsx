import React, { ChangeEvent } from 'react';
import { InputField } from './InputField'; // Reutilizamos nuestro componente de formulario

// --- 1. Definimos la forma de los datos para este bloque ---
export interface HeaderData {
  logoText: string;
  link1: string;
  link2: string;
  link3: string;
}

// --- 2. Creamos el componente visual (cómo se ve en la página) ---
export function HeaderBlock({ data }: { data: HeaderData }) {
  // Este bloque no debe tener 'rounded-md' ni limitantes de ancho.
  // Su fondo debe ocupar todo el espacio disponible.
  return (
    <header className="bg-white p-4 border-b border-slate-200 w-full">
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

// --- 3. Creamos el formulario para editar el bloque ---
export function HeaderEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField 
        label="Texto del Logo" 
        value={data.logoText} 
        onChange={(e) => updateData('logoText', e.target.value)} 
      />
      <InputField 
        label="Enlace 1" 
        value={data.link1} 
        onChange={(e) => updateData('link1', e.target.value)} 
      />
      <InputField 
        label="Enlace 2" 
        value={data.link2} 
        onChange={(e) => updateData('link2', e.target.value)} 
      />
      <InputField 
        label="Enlace 3" 
        value={data.link3} 
        onChange={(e) => updateData('link3', e.target.value)} 
      />
    </div>
  );
}