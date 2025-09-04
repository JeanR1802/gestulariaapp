import React from 'react';
import { HeaderData } from './HeaderVariantDefault'; // Reutilizamos la misma interfaz de datos

// Este es un nuevo diseño con todo centrado
export function HeaderVariantCentered({ data }: { data: HeaderData }) {
  return (
    <header className="bg-white p-4 border-b border-slate-200 w-full">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-3">
        <h1 className="text-2xl font-bold text-slate-800">{data.logoText || 'Mi Negocio'}</h1>
        <nav className="flex items-center space-x-6 text-sm text-slate-600">
          <a href="#" className="hover:text-blue-600">{data.link1 || 'Inicio'}</a>
          <a href="#" className="hover:text-blue-600">{data.link2 || 'Servicios'}</a>
          <a href="#" className="hover:text-blue-600">{data.link3 || 'Contacto'}</a>
        </nav>
      </div>
    </header>
  );
}