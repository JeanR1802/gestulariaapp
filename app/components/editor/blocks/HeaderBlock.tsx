'use client';
import React from 'react';
import { InputField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

// --- Interfaces de Datos ---
export interface HeaderData {
  variant: 'default' | 'centered' | 'withButton';
  logoText: string;
  link1: string;
  link2: string;
  link3: string;
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
}

// --- Componente "Director" (Visual) ---
export function HeaderBlock({ data }: { data: HeaderData }) {
  switch (data.variant) {
    case 'centered':
      return <HeaderCentered data={data} />;
    case 'withButton':
      return <HeaderWithButton data={data} />;
    default:
      return <HeaderDefault data={data} />;
  }
}

// --- Componentes de Variante (Visuales) ---
const HeaderDefault = ({ data }: { data: HeaderData }) => {
  const { isMobile } = usePreviewMode();
  return (
    <header className={cn("p-4", data.backgroundColor || 'bg-white')}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className={cn("font-bold", data.textColor || 'text-slate-800', isMobile ? 'text-lg' : 'text-xl')}>{data.logoText}</h1>
            {!isMobile && (
                <nav className={cn("flex items-center space-x-6 text-sm", data.textColor ? data.textColor.replace('text-', 'text-opacity-80 ') : 'text-slate-600')}>
                    <a href="#" className="hover:opacity-100">{data.link1}</a>
                    <a href="#" className="hover:opacity-100">{data.link2}</a>
                    <a href="#" className="hover:opacity-100">{data.link3}</a>
                </nav>
            )}
            {isMobile && <button className={data.textColor || 'text-slate-800'}>☰</button>}
        </div>
    </header>
  );
};
const HeaderCentered = ({ data }: { data: HeaderData }) => {
    const { isMobile } = usePreviewMode();
    return (
      <header className={cn("p-4", data.backgroundColor || 'bg-white')}>
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
              <h1 className={cn("font-bold", data.textColor || 'text-slate-800', isMobile ? 'text-lg' : 'text-xl')}>{data.logoText}</h1>
              {!isMobile && (
                  <nav className={cn("flex items-center space-x-6 text-sm", data.textColor ? data.textColor.replace('text-', 'text-opacity-80 ') : 'text-slate-600')}>
                      <a href="#" className="hover:opacity-100">{data.link1}</a>
                      <a href="#" className="hover:opacity-100">{data.link2}</a>
                      <a href="#" className="hover:opacity-100">{data.link3}</a>
                  </nav>
              )}
          </div>
      </header>
    );
};
const HeaderWithButton = ({ data }: { data: HeaderData }) => {
    const { isMobile } = usePreviewMode();
    return (
        <header className={cn("p-4", data.backgroundColor || 'bg-white')}>
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className={cn("font-bold", data.textColor || 'text-slate-800', isMobile ? 'text-lg' : 'text-xl')}>{data.logoText}</h1>
                {!isMobile && (
                    <div className="flex items-center gap-6">
                        <nav className={cn("flex items-center space-x-6 text-sm", data.textColor ? data.textColor.replace('text-', 'text-opacity-80 ') : 'text-slate-600')}>
                            <a href="#" className="hover:opacity-100">{data.link1}</a>
                            <a href="#" className="hover:opacity-100">{data.link2}</a>
                        </nav>
                        <a href="#" className={cn("px-4 py-1.5 rounded-md text-sm font-semibold", data.buttonBgColor, data.buttonTextColor)}>{data.buttonText}</a>
                    </div>
                )}
                 {isMobile && <button className={data.textColor || 'text-slate-800'}>☰</button>}
            </div>
        </header>
    );
};

// --- Editor de CONTENIDO ---
export function HeaderContentEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
  return (
    <div className="space-y-4">
        <InputField label="Texto del Logo" value={data.logoText} onChange={(e) => updateData('logoText', e.target.value)} />
        <InputField label="Enlace 1" value={data.link1} onChange={(e) => updateData('link1', e.target.value)} />
        <InputField label="Enlace 2" value={data.link2} onChange={(e) => updateData('link2', e.target.value)} />
        {data.variant !== 'withButton' && (
             <InputField label="Enlace 3" value={data.link3} onChange={(e) => updateData('link3', e.target.value)} />
        )}
        {data.variant === 'withButton' && (
            <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
        )}
    </div>
  );
}

// --- Editor de ESTILO ---
export function HeaderStyleEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
    return (
        <div className="space-y-4">
            <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
            <TextColorPalette label="Color del Texto" selectedColor={data.textColor} onChange={(color) => updateData('textColor', color)} />
            {data.variant === 'withButton' && (
                <ButtonColorPalette label="Estilo del Botón" selectedBgColor={data.buttonBgColor || ''} onChange={(bg, text) => { updateData('buttonBgColor', bg); updateData('buttonTextColor', text); }} />
            )}
        </div>
    );
}