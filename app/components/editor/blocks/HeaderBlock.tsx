// app/components/editor/blocks/HeaderBlock.tsx (REFACTORED with use-editable)
'use client';
import React, { JSX } from 'react';
import { useEditable } from 'use-editable';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { BlockComponentProps } from './index';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { Editable } from './TextBlock';

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

// --- HEADER RESPONSIVE Y MODERNO ---
export function HeaderBlock({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'centered':
      return <HeaderCentered {...props} />;
    case 'withButton':
      return <HeaderWithButton {...props} />;
    default:
      return <HeaderDefault {...props} />;
  }
}

const HeaderDefault = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');

  const handleUpdate = (key: keyof HeaderData, value: string) => {
    if (onUpdate) onUpdate(key, value);
  };

  return (
    <header className={cn('p-4', bg.className)} style={bg.style}>
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <Editable tagName="h1" value={data.logoText} onUpdate={(v) => handleUpdate('logoText', v)} isEditing={isEditing} className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style} />
        {!isMobile && (
          <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
            <Editable tagName="a" value={data.link1} onUpdate={(v) => handleUpdate('link1', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
            <Editable tagName="a" value={data.link2} onUpdate={(v) => handleUpdate('link2', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
            <Editable tagName="a" value={data.link3} onUpdate={(v) => handleUpdate('link3', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
          </nav>
        )}
        {isMobile && <button className={logoStyles.className} style={logoStyles.style}>☰</button>}
      </div>
    </header>
  );
};

const HeaderCentered = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
    const { isMobile } = usePreviewMode();
    const bg = getBackgroundStyles(data.backgroundColor);
    const logoStyles = getStyles(data.logoColor, 'text-slate-800');
    const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  
    const handleUpdate = (key: keyof HeaderData, value: string) => {
      if (onUpdate) onUpdate(key, value);
    };

  return (
    <header className={cn('p-4', bg.className)} style={bg.style}>
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        <Editable tagName="h1" value={data.logoText} onUpdate={(v) => handleUpdate('logoText', v)} isEditing={isEditing} className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style} />
        {!isMobile && (
          <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
            <Editable tagName="a" value={data.link1} onUpdate={(v) => handleUpdate('link1', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
            <Editable tagName="a" value={data.link2} onUpdate={(v) => handleUpdate('link2', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
            <Editable tagName="a" value={data.link3} onUpdate={(v) => handleUpdate('link3', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
          </nav>
        )}
      </div>
    </header>
  );
};

const HeaderWithButton = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
    const { isMobile } = usePreviewMode();
    const bg = getBackgroundStyles(data.backgroundColor);
    const logoStyles = getStyles(data.logoColor, 'text-slate-800');
    const linkStyles = getStyles(data.linkColor, 'text-slate-600');
    const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

    const handleUpdate = (key: keyof HeaderData, value: string) => {
        if (onUpdate) onUpdate(key, value);
    };

  return (
    <header className={cn('p-4', bg.className)} style={bg.style}>
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <Editable tagName="h1" value={data.logoText} onUpdate={(v) => handleUpdate('logoText', v)} isEditing={isEditing} className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style} />
        {!isMobile && (
          <div className="flex items-center gap-6">
            <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
                <Editable tagName="a" value={data.link1} onUpdate={(v) => handleUpdate('link1', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
                <Editable tagName="a" value={data.link2} onUpdate={(v) => handleUpdate('link2', v)} isEditing={isEditing} className="hover:opacity-80 transition-opacity" />
            </nav>
            <Editable tagName="a" value={data.buttonText} onUpdate={(v) => handleUpdate('buttonText', v)} isEditing={isEditing} className={cn('px-4 py-1.5 rounded-md text-sm font-semibold', buttonStyle.className)} style={buttonStyle.style} />
          </div>
        )}
        {isMobile && <button className={logoStyles.className} style={logoStyles.style}>☰</button>}
      </div>
    </header>
  );
};

// --- Editor de ESTILO ---
export function HeaderStyleEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <ColorPalette
          label="Fondo"
          selectedColor={data.backgroundColor}
          onChange={color => updateData('backgroundColor', color)}
        />
      </div>
      <div>
        <TextColorPalette
          label="Logo"
          selectedColor={data.logoColor}
          onChange={color => updateData('logoColor', color)}
        />
      </div>
      <div>
        <TextColorPalette
          label="Enlaces"
          selectedColor={data.linkColor}
          onChange={color => updateData('linkColor', color)}
        />
      </div>
      {data.variant === 'withButton' && (
        <>
          <div>
            <ColorPalette
              label="Botón fondo"
              selectedColor={data.buttonBgColor}
              onChange={color => updateData('buttonBgColor', color)}
            />
          </div>
          <div>
            <TextColorPalette
              label="Botón texto"
              selectedColor={data.buttonTextColor}
              onChange={color => updateData('buttonTextColor', color)}
            />
          </div>
        </>
      )}
    </div>
  );
}