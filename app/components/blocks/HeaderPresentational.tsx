import React from 'react';

export interface HeaderPresentationalData {
  variant?: 'default' | 'centered' | 'withButton' | 'nueva' | 'sticky';
  logoText?: string;
  link1?: string;
  link2?: string;
  link3?: string;
  buttonText?: string;
  backgroundColor?: string;
  logoColor?: string;
  linkColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

// Pure presentational header used for server rendering and to guarantee identical markup
export default function HeaderPresentational({ data }: { data: HeaderPresentationalData }) {
  const variant = data.variant || 'default';
  const logo = data.logoText || 'Mi Negocio';
  const link1 = data.link1 || 'Inicio';
  const link2 = data.link2 || 'Servicios';
  const link3 = data.link3 || 'Contacto';
  const buttonText = data.buttonText || '';

  // simple helpers to use provided Tailwind classes or inline styles for arbitrary colors
  const classOrStyle = (val?: string, defaultClass = '') => {
    if (!val) return { className: defaultClass, style: '' };
    if (val.startsWith('[#') && val.endsWith(']')) return { className: '', style: `color: ${val.slice(1, -1)};` };
    return { className: val, style: '' };
  };

  const bg = (data.backgroundColor && data.backgroundColor.startsWith('[#')) ? `style=\"background-color:${data.backgroundColor.slice(1,-1)};\"` : '';

  switch (variant) {
    case 'centered':
      return (
        <header className={`p-4 ${data.backgroundColor || ''}`}>
          <div className="max-w-5xl mx-auto flex justify-between items-center md:flex-col md:gap-3">
            <h1 className={`text-xl md:text-2xl font-bold ${data.logoColor || ''}`} style={data.logoColor && data.logoColor.startsWith('[#') ? { color: data.logoColor.slice(1, -1) } : undefined}>{logo}</h1>
            <nav className={`hidden md:flex items-center space-x-6 text-sm ${data.linkColor || ''}`} style={data.linkColor && data.linkColor.startsWith('[#') ? { color: data.linkColor.slice(1, -1) } : undefined}>
              <a href="#">{link1}</a>
              <a href="#">{link2}</a>
              <a href="#">{link3}</a>
            </nav>
            <div className="md:hidden">
              <button aria-label="Abrir menú" className={`${data.logoColor || ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          <nav className="hidden md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4 max-h-[70vh] overflow-y-auto" role="dialog" aria-modal="true" aria-hidden="true">
            <button aria-label="Cerrar menú" className="self-end mr-4 text-slate-600">×</button>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link1}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link2}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link3}</a>
          </nav>
        </header>
      );

    case 'withButton':
      return (
        <header className={`p-4 ${data.backgroundColor || ''}`}>
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className={`text-xl font-bold ${data.logoColor || ''}`} style={data.logoColor && data.logoColor.startsWith('[#') ? { color: data.logoColor.slice(1, -1) } : undefined}>{logo}</h1>
            <div className="hidden md:flex items-center gap-6">
              <nav className={`flex items-center space-x-6 text-sm ${data.linkColor || ''}`} style={data.linkColor && data.linkColor.startsWith('[#') ? { color: data.linkColor.slice(1, -1) } : undefined}>
                <a href="#">{link1}</a>
                <a href="#">{link2}</a>
              </nav>
              <a href="#" className={`px-4 py-1.5 rounded-md text-sm font-semibold ${data.buttonBgColor || ''}`} style={data.buttonBgColor && data.buttonBgColor.startsWith('[#') ? { backgroundColor: data.buttonBgColor.slice(1, -1), color: data.buttonTextColor && data.buttonTextColor.startsWith('[#') ? data.buttonTextColor.slice(1, -1) : undefined } : undefined}>{buttonText || 'Acción'}</a>
            </div>
            <div className="md:hidden">
              <button aria-label="Abrir menú" className={`${data.logoColor || ''}`}>
                ☰
              </button>
            </div>
          </div>

          <nav className="hidden md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4 max-h-[70vh] overflow-y-auto" role="dialog" aria-modal="true" aria-hidden="true">
            <button aria-label="Cerrar menú" className="self-end mr-4 text-slate-600">×</button>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link1}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link2}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600">{buttonText || 'Acción'}</a>
          </nav>
        </header>
      );

    case 'sticky':
      return (
        <header className={`p-4 ${data.backgroundColor || ''}`}> 
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className={`text-xl font-bold ${data.logoColor || ''}`}>{logo}</h1>
            <nav className={`hidden md:flex items-center space-x-6 text-sm ${data.linkColor || ''}`}>
              <a href="#">{link1}</a>
              <a href="#">{link2}</a>
              <a href="#">{link3}</a>
            </nav>
            <div className="md:hidden">
              <button aria-label="Abrir menú" className={`${data.logoColor || ''}`}>☰</button>
            </div>
          </div>

          <nav className="fixed inset-y-0 right-0 w-72 bg-white z-50 transform translate-x-full transition-transform max-h-[70vh]" role="dialog" aria-modal="true" aria-hidden="true">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold">Menu</h3>
              <button aria-label="Cerrar menú" className="text-slate-600">×</button>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <a href="#" className="text-slate-800 hover:text-blue-600">{link1}</a>
              <a href="#" className="text-slate-800 hover:text-blue-600">{link2}</a>
              <a href="#" className="text-slate-800 hover:text-blue-600">{link3}</a>
            </div>
          </nav>
        </header>
      );

    case 'nueva':
      return (
        <header className={`p-4 ${data.backgroundColor || ''}`}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className={`flex items-center gap-4 ${data.logoColor || ''}`} style={data.logoColor && data.logoColor.startsWith('[#') ? { color: data.logoColor.slice(1, -1) } : undefined}>
              <h1 className="text-lg font-bold">{logo}</h1>
            </div>
            <nav className={`hidden md:flex items-center gap-8 ${data.linkColor || ''}`}>
              <a href="#" className="text-sm">{link1}</a>
              <a href="#" className="text-sm">{link2}</a>
              <a href="#" className="text-sm">{link3}</a>
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className={`px-4 py-1.5 rounded-full text-sm font-semibold ${data.buttonBgColor || ''}`}>{buttonText || 'Comenzar'}</a>
            </div>
            <div className="md:hidden">
              <button aria-label="Abrir menú" className={`${data.logoColor || ''}`}>☰</button>
            </div>

          </div>

          <nav className="hidden md:hidden fixed inset-0 bg-white z-50 p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold">{logo}</h2>
              <button aria-label="Cerrar menú" className="text-slate-600">×</button>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-lg font-semibold">{link1}</a>
              <a href="#" className="text-lg font-semibold">{link2}</a>
              <a href="#" className="text-lg font-semibold">{link3}</a>
              <a href="#" className={`mt-4 inline-block px-4 py-2 rounded-md font-semibold ${data.buttonBgColor || ''}`}>{buttonText || 'Comenzar'}</a>
            </div>
          </nav>
        </header>
      );

    default:
      return (
        <header className={`p-4 ${data.backgroundColor || ''}`}>
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className={`text-xl font-bold ${data.logoColor || ''}`}>{logo}</h1>
            <nav className={`hidden md:flex items-center space-x-6 text-sm ${data.linkColor || ''}`}>
              <a href="#">{link1}</a>
              <a href="#">{link2}</a>
              <a href="#">{link3}</a>
            </nav>
            <div className="md:hidden">
              <button aria-label="Abrir menú" className={`${data.logoColor || ''}`}>☰</button>
            </div>
          </div>

          <nav className="hidden md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4 max-h-[70vh] overflow-y-auto" role="dialog" aria-modal="true" aria-hidden="true">
            <button aria-label="Cerrar menú" className="self-end mr-4 text-slate-600">×</button>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link1}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link2}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600">{link3}</a>
          </nav>
        </header>
      );
  }
}
