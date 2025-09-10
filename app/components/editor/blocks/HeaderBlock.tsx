// Reemplaza el contenido de app/components/editor/blocks/HeaderBlock.tsx
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
  logoColor: string;
  linkColor: string;
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

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  }
  return { className: colorValue || defaultClass, style: {} };
};

const getButtonStyles = (bgColor: string | undefined, textColor: string | undefined) => {
    const isCustomBg = bgColor?.startsWith('[#');
    const isCustomText = textColor?.startsWith('[#');
    const style: React.CSSProperties = {};
    if (isCustomBg && bgColor) style.backgroundColor = bgColor.slice(1, -1);
    if (isCustomText && textColor) style.color = textColor.slice(1, -1);
    
    return {
        className: cn(!isCustomBg ? bgColor || 'bg-blue-600' : '', !isCustomText ? textColor || 'text-white' : ''),
        style: style,
    };
};

// --- Componentes de Variante (Visuales) ---
const HeaderDefault = ({ data }: { data: HeaderData }) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');

  return (
    <header className={cn("p-4", bg.className)} style={bg.style}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h1 className={cn("font-bold", isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
            {!isMobile && (
                <nav className={cn("flex items-center space-x-6 text-sm", linkStyles.className)} style={linkStyles.style}>
                    <a href="#" className="hover:opacity-80 transition-opacity">{data.link1}</a>
                    <a href="#" className="hover:opacity-80 transition-opacity">{data.link2}</a>
                    <a href="#" className="hover:opacity-80 transition-opacity">{data.link3}</a>
                </nav>
            )}
            {isMobile && <button className={logoStyles.className} style={logoStyles.style}>☰</button>}
        </div>
    </header>
  );
};

const HeaderCentered = ({ data }: { data: HeaderData }) => {
    const { isMobile } = usePreviewMode();
    const bg = getBackgroundStyles(data.backgroundColor);
    const logoStyles = getStyles(data.logoColor, 'text-slate-800');
    const linkStyles = getStyles(data.linkColor, 'text-slate-600');

    return (
      <header className={cn("p-4", bg.className)} style={bg.style}>
          <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
              <h1 className={cn("font-bold", isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
              {!isMobile && (
                  <nav className={cn("flex items-center space-x-6 text-sm", linkStyles.className)} style={linkStyles.style}>
                      <a href="#" className="hover:opacity-80 transition-opacity">{data.link1}</a>
                      <a href="#" className="hover:opacity-80 transition-opacity">{data.link2}</a>
                      <a href="#" className="hover:opacity-80 transition-opacity">{data.link3}</a>
                  </nav>
              )}
          </div>
      </header>
    );
};
const HeaderWithButton = ({ data }: { data: HeaderData }) => {
    const { isMobile } = usePreviewMode();
    const bg = getBackgroundStyles(data.backgroundColor);
    const logoStyles = getStyles(data.logoColor, 'text-slate-800');
    const linkStyles = getStyles(data.linkColor, 'text-slate-600');
    const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

    return (
        <header className={cn("p-4", bg.className)} style={bg.style}>
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className={cn("font-bold", isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
                {!isMobile && (
                    <div className="flex items-center gap-6">
                        <nav className={cn("flex items-center space-x-6 text-sm", linkStyles.className)} style={linkStyles.style}>
                            <a href="#" className="hover:opacity-80 transition-opacity">{data.link1}</a>
                            <a href="#" className="hover:opacity-80 transition-opacity">{data.link2}</a>
                        </nav>
                        <a 
                           href="#" 
                           className={cn("px-4 py-1.5 rounded-md text-sm font-semibold", buttonStyle.className)} 
                           style={buttonStyle.style}
                        >
                           {data.buttonText}
                        </a>
                    </div>
                )}
                 {isMobile && <button className={logoStyles.className} style={logoStyles.style}>☰</button>}
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
    const [customLogoColor, setCustomLogoColor] = React.useState<string>(data.logoColor?.startsWith('[#') ? data.logoColor.slice(2, -1) : '#000000');
    const [customLinkColor, setCustomLinkColor] = React.useState<string>(data.linkColor?.startsWith('[#') ? data.linkColor.slice(2, -1) : '#000000');
    const [customBgColor, setCustomBgColor] = React.useState<string>(data.backgroundColor?.startsWith('[#') ? data.backgroundColor.slice(2, -1) : '#ffffff');
    const isCustomLogo = data.logoColor?.startsWith('[#');
    const isCustomLink = data.linkColor?.startsWith('[#');
    const isCustomBg = data.backgroundColor?.startsWith('[#');
    return (
        <div className="space-y-4">
            <div>
                <ColorPalette label="Color de Fondo" selectedColor={isCustomBg ? '' : data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
                <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-slate-700">Fondo personalizado:</label>
                    <input
                        type="color"
                        value={customBgColor}
                        onChange={e => {
                            setCustomBgColor(e.target.value);
                            updateData('backgroundColor', `[${e.target.value}]`);
                        }}
                        className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                        title="Elegir color personalizado de fondo"
                    />
                </div>
            </div>
            <div>
                <TextColorPalette label="Color del Logo" selectedColor={isCustomLogo ? '' : data.logoColor} onChange={(color) => updateData('logoColor', color)} />
                <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-slate-700">Logo personalizado:</label>
                    <input
                        type="color"
                        value={customLogoColor}
                        onChange={e => {
                            setCustomLogoColor(e.target.value);
                            updateData('logoColor', `[${e.target.value}]`);
                        }}
                        className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                        title="Elegir color personalizado del logo"
                    />
                </div>
            </div>
            <div>
                <TextColorPalette label="Color de Enlaces" selectedColor={isCustomLink ? '' : data.linkColor} onChange={(color) => updateData('linkColor', color)} />
                <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-slate-700">Enlaces personalizado:</label>
                    <input
                        type="color"
                        value={customLinkColor}
                        onChange={e => {
                            setCustomLinkColor(e.target.value);
                            updateData('linkColor', `[${e.target.value}]`);
                        }}
                        className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                        title="Elegir color personalizado de enlaces"
                    />
                </div>
            </div>
            {data.variant === 'withButton' && (
                <ButtonColorPalette 
                    label="Estilo del Botón" 
                    selectedBgColor={data.buttonBgColor || ''}
                    selectedTextColor={data.buttonTextColor || ''}
                    onChange={(bg, text) => { 
                        updateData('buttonBgColor', bg); 
                        updateData('buttonTextColor', text); 
                    }} 
                />
            )}
        </div>
    );
}