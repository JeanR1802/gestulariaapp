'use client';
import React, { useState } from 'react';
import { InputField } from './InputField';

export interface HeaderData {
  variant: 'default' | 'centered' | 'withButton';
  logoText: string;
  link1: string;
  link2: string;
  link3: string;
  buttonText?: string;
}

export function HeaderBlock({ data }: { data: HeaderData }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const sharedProps = { data, isMenuOpen, toggleMenu };

  switch (data.variant) {
    case 'centered': return <HeaderCentered {...sharedProps} />;
    case 'withButton': return <HeaderWithButton {...sharedProps} />;
    default: return <HeaderDefault {...sharedProps} />;
  }
}

const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;

interface HeaderVariantProps { data: HeaderData; isMenuOpen: boolean; toggleMenu: () => void; }

const HeaderDefault = ({ data, isMenuOpen, toggleMenu }: HeaderVariantProps) => (
  <header className="bg-white p-4 border-b border-slate-200 w-full relative">
    <div className="max-w-5xl mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold text-slate-800">{data.logoText || 'Mi Negocio'}</h1>
      <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-600"><a href="#" className="hover:text-blue-600">{data.link1 || 'Inicio'}</a><a href="#" className="hover:text-blue-600">{data.link2 || 'Servicios'}</a><a href="#" className="hover:text-blue-600">{data.link3 || 'Contacto'}</a></nav>
      <div className="md:hidden"><button onClick={toggleMenu} aria-label="Toggle Menu">{isMenuOpen ? <CloseIcon /> : <MenuIcon />}</button></div>
    </div>
    {isMenuOpen && <nav className="md:hidden absolute top-full left-0 w-full bg-white border-b flex flex-col items-center gap-4 py-4"><a href="#" className="hover:text-blue-600">{data.link1 || 'Inicio'}</a><a href="#" className="hover:text-blue-600">{data.link2 || 'Servicios'}</a><a href="#" className="hover:text-blue-600">{data.link3 || 'Contacto'}</a></nav>}
  </header>
);

const HeaderCentered = ({ data, isMenuOpen, toggleMenu }: HeaderVariantProps) => (
  <header className="bg-white p-4 border-b border-slate-200 w-full relative">
    <div className="max-w-5xl mx-auto flex justify-between items-center md:flex-col md:gap-3">
      <h1 className="text-xl md:text-2xl font-bold text-slate-800">{data.logoText || 'Mi Negocio'}</h1>
      <nav className="hidden md:flex items-center space-x-6 text-sm text-slate-600"><a href="#" className="hover:text-blue-600">{data.link1 || 'Inicio'}</a><a href="#" className="hover:text-blue-600">{data.link2 || 'Servicios'}</a><a href="#" className="hover:text-blue-600">{data.link3 || 'Contacto'}</a></nav>
      <div className="md:hidden"><button onClick={toggleMenu} aria-label="Toggle Menu">{isMenuOpen ? <CloseIcon /> : <MenuIcon />}</button></div>
    </div>
    {isMenuOpen && <nav className="md:hidden absolute top-full left-0 w-full bg-white border-b flex flex-col items-center gap-4 py-4"><a href="#" className="hover:text-blue-600">{data.link1 || 'Inicio'}</a><a href="#" className="hover:text-blue-600">{data.link2 || 'Servicios'}</a><a href="#" className="hover:text-blue-600">{data.link3 || 'Contacto'}</a></nav>}
  </header>
);

const HeaderWithButton = ({ data, isMenuOpen, toggleMenu }: HeaderVariantProps) => (
  <header className="bg-white p-4 border-b border-slate-200 w-full relative">
    <div className="max-w-5xl mx-auto flex justify-between items-center">
      <h1 className="text-xl font-bold text-slate-800">{data.logoText || 'Mi Negocio'}</h1>
      <div className="hidden md:flex items-center gap-6"><nav className="flex items-center space-x-6 text-sm text-slate-600"><a href="#" className="hover:text-blue-600">{data.link1 || 'Producto'}</a><a href="#" className="hover:text-blue-600">{data.link2 || 'Precios'}</a></nav><a href="#" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700">{data.buttonText || 'Acción'}</a></div>
      <div className="md:hidden"><button onClick={toggleMenu} aria-label="Toggle Menu">{isMenuOpen ? <CloseIcon /> : <MenuIcon />}</button></div>
    </div>
    {isMenuOpen && <nav className="md:hidden absolute top-full left-0 w-full bg-white border-b flex flex-col items-center gap-4 py-4"><a href="#" className="hover:text-blue-600">{data.link1 || 'Producto'}</a><a href="#" className="hover:text-blue-600">{data.link2 || 'Precios'}</a><a href="#" className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 w-fit">{data.buttonText || 'Acción'}</a></nav>}
  </header>
);

export function HeaderEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Texto del Logo" value={data.logoText} onChange={(e) => updateData('logoText', e.target.value)} />
      <InputField label="Enlace 1" value={data.link1} onChange={(e) => updateData('link1', e.target.value)} />
      <InputField label="Enlace 2" value={data.link2} onChange={(e) => updateData('link2', e.target.value)} />
      {data.variant !== 'withButton' && (<InputField label="Enlace 3" value={data.link3} onChange={(e) => updateData('link3', e.target.value)} />)}
      {data.variant === 'withButton' && (<InputField label="Texto del Botón" value={data.buttonText || ''} onChange={(e) => updateData('buttonText', e.target.value)} />)}
    </div>
  );
}