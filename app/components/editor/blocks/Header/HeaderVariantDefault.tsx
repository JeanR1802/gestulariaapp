import React from 'react';

// Interfaz que ambos diseños deben respetar
export interface HeaderData {
  logoText: string;
  link1: string;
  link2: string;
  link3: string;
}

// Este es el diseño que ya teníamos (logo a la izquierda, enlaces a la derecha)
export function HeaderVariantDefault({ data }: { data: HeaderData }) {
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