// app/components/editor/blocks/HeaderBlock.tsx (REFACTORED with use-editable)
'use client';
import React, { JSX, useState, useRef, useEffect } from 'react';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { BlockComponentProps } from './index';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { Transition } from '@headlessui/react';
import { InputField } from './InputField';

// --- Interfaces de Datos ---
export interface HeaderData {
  variant: 'default' | 'centered' | 'withButton' | 'nueva' | 'sticky';
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
  mobileMenuOpen?: boolean | string;
}

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff', 'text-black': '#000000',
    'text-slate-50': '#f8fafc', 'text-slate-100': '#f1f5f9', 'text-slate-200': '#e2e8f0',
    'text-slate-300': '#cbd5e1', 'text-slate-400': '#94a3b8', 'text-slate-500': '#64748b',
    'text-slate-600': '#475569', 'text-slate-700': '#334155', 'text-slate-800': '#1e293b',
    'text-slate-900': '#0f172a', 'text-blue-600': '#2563eb', 'text-blue-500': '#3b82f6',
  };
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } };
  }
  const finalClass = colorValue || defaultClass;
  return { className: finalClass, style: { color: colorMap[finalClass] || '#1e293b' } };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  const bgMap: Record<string, string> = {
    'bg-white': '#ffffff', 'bg-black': '#000000',
    'bg-slate-50': '#f8fafc', 'bg-slate-100': '#f1f5f9', 'bg-slate-200': '#e2e8f0',
    'bg-slate-300': '#cbd5e1', 'bg-slate-400': '#94a3b8', 'bg-slate-500': '#64748b',
    'bg-slate-600': '#475569', 'bg-slate-700': '#334155', 'bg-slate-800': '#1e293b',
    'bg-slate-900': '#0f172a', 'bg-blue-600': '#2563eb', 'bg-blue-500': '#3b82f6',
  };
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } };
  }
  const finalClass = colorValue || defaultClass;
  return { className: finalClass, style: { backgroundColor: bgMap[finalClass] || '#ffffff' } };
};

const getButtonStyles = (bgColor: string | undefined, textColor: string | undefined) => {
  const isCustomBg = bgColor?.startsWith('[#');
  const isCustomText = textColor?.startsWith('[#');
  const style: React.CSSProperties = {};
  
  const bgMap: Record<string, string> = {
    'bg-blue-600': '#2563eb',
    'bg-blue-500': '#3b82f6',
    'bg-slate-900': '#0f172a',
    'bg-slate-800': '#1e293b',
    'bg-white': '#ffffff',
    'bg-black': '#000000',
  };
  const textMap: Record<string, string> = {
    'text-white': '#ffffff',
    'text-slate-800': '#1e293b',
    'text-slate-900': '#0f172a',
    'text-black': '#000000',
  };
  
  // SIEMPRE aplicar inline styles
  if (isCustomBg && bgColor) {
    style.backgroundColor = bgColor.slice(1, -1);
  } else {
    const bgClass = bgColor || 'bg-blue-600';
    style.backgroundColor = bgMap[bgClass] || '#2563eb';
  }
  
  if (isCustomText && textColor) {
    style.color = textColor.slice(1, -1);
  } else {
    const textClass = textColor || 'text-white';
    style.color = textMap[textClass] || '#ffffff';
  }
  
  return {
    className: cn(!isCustomBg ? bgColor || 'bg-blue-600' : '', !isCustomText ? textColor || 'text-white' : ''),
    style: style,
  };
};

// --- HEADER RESPONSIVE Y MODERNO ---
export function HeaderBlock({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) {
  const props = { data };
  switch (data.variant) {
    case 'centered':
      return <HeaderCentered {...props} />;
    case 'withButton':
      return <HeaderWithButton {...props} />;
    case 'nueva':
      return <HeaderNueva {...props} />;
    case 'sticky':
      return <HeaderSticky {...props} />;
    default:
      return <HeaderDefault {...props} />;
  }
}

const HeaderDefault = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const headerStyle: React.CSSProperties = {
    ...bg.style,
  };

  return (
    <header className={cn('relative', bg.className)} style={headerStyle}>
      {/* Desktop version */}
      {!isMobile && (
        <div className="p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
            <h1 className={cn('font-bold text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
            <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
              <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
              <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
              <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile version - Logo izq + Hamburger der */}
      {isMobile && (
        <>
          <div className="p-4 flex justify-between items-center">
            <h1 className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen(v => !v)}
              className={cn('p-2 rounded-md', logoStyles.className)}
              style={logoStyles.style}
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu panel */}
          <Transition
            show={menuOpen}
            enter="transition-all duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <nav className="border-t border-slate-200 px-4 py-3 space-y-2">
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link1}</a>
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link2}</a>
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link3}</a>
            </nav>
          </Transition>
        </>
      )}
    </header>
  );
};

const HeaderCentered = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
    const { isMobile } = usePreviewMode();
    const bg = getBackgroundStyles(data.backgroundColor);
    const logoStyles = getStyles(data.logoColor, 'text-slate-800');
    const linkStyles = getStyles(data.linkColor, 'text-slate-600');

    // Mobile menu state
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
      if (menuOpen) document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    const headerStyle: React.CSSProperties = {
      ...bg.style,
    };

    return (
      <header className={cn('relative', bg.className)} style={headerStyle}>
        {/* Desktop version - Todo centrado */}
        {!isMobile && (
          <div className="p-4">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
              <h1 className={cn('font-bold text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
              <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
                <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
                <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
                <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
              </nav>
            </div>
          </div>
        )}

        {/* Mobile version - Logo centrado + Botón menú abajo */}
        {isMobile && (
          <>
            <div className="p-4 flex flex-col items-center gap-3">
              <h1 className={cn('font-bold text-2xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
              <button
                type="button"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMenuOpen(v => !v)}
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-all font-medium text-sm',
                  menuOpen ? 'border-blue-400 bg-blue-50' : 'border-slate-200 bg-white shadow-sm'
                )}
                style={{ color: logoStyles.style.color }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
              </button>
            </div>

            {/* Mobile menu panel */}
            <Transition
              show={menuOpen}
              enter="transition-all duration-200 ease-out"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition-all duration-150 ease-in"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 -translate-y-2"
            >
              <nav className="border-t border-slate-200 px-4 py-3 space-y-2 flex flex-col items-center">
                <a className={cn('block py-2 px-4 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium text-center w-full max-w-xs', linkStyles.className)} style={linkStyles.style}>{data.link1}</a>
                <a className={cn('block py-2 px-4 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium text-center w-full max-w-xs', linkStyles.className)} style={linkStyles.style}>{data.link2}</a>
                <a className={cn('block py-2 px-4 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium text-center w-full max-w-xs', linkStyles.className)} style={linkStyles.style}>{data.link3}</a>
              </nav>
            </Transition>
          </>
        )}
      </header>
    );
};

// --- Editor de CONTENIDO ---
export function HeaderContentEditor({
  data,
  updateData,
}: {
  data: HeaderData;
  updateData: (key: keyof HeaderData, value: string) => void;
}) {
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
      {(data.variant === 'withButton' || data.variant === 'sticky') && (
        <InputField
          label="Texto del Botón"
          value={data.buttonText}
          onChange={(e) => updateData('buttonText', e.target.value)}
        />
      )}
    </div>
  );
}

// --- Editor de ESTILO ---
export function HeaderStyleEditor({
  data,
  updateData,
}: {
  data: HeaderData;
  updateData: (key: keyof HeaderData, value: any) => void;
}) {
  return (
    <div className="space-y-3">
      {/* Toggle para simular menú móvil abierto (preview en tiempo real) */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Simular menú móvil abierto</label>
        <input
          type="checkbox"
          checked={Boolean(data.mobileMenuOpen)}
          onChange={(e) => updateData('mobileMenuOpen', e.target.checked)}
        />
      </div>

      <div className="flex items-center gap-2">
        <ColorPalette
          label="Fondo"
          selectedColor={data.backgroundColor || ''}
          onChange={(color) => updateData('backgroundColor', color)}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette
          label="Logo"
          selectedColor={data.logoColor || ''}
          onChange={(color) => updateData('logoColor', color)}
        />
      </div>
      <div className="flex items-center gap-2">
        <TextColorPalette
          label="Enlaces"
          selectedColor={data.linkColor || ''}
          onChange={(color) => updateData('linkColor', color)}
        />
      </div>
      {(data.variant === 'withButton' || data.variant === 'sticky') && (
        <>
          <div className="flex items-center gap-2">
            <ColorPalette
              label="Botón fondo"
              selectedColor={data.buttonBgColor || ''}
              onChange={(color) => updateData('buttonBgColor', color)}
            />
          </div>
          <div className="flex items-center gap-2">
            <TextColorPalette
              label="Botón texto"
              selectedColor={data.buttonTextColor || ''}
              onChange={(color) => updateData('buttonTextColor', color)}
            />
          </div>
        </>
      )}
    </div>
  );
}

// Funciones helper eliminadas - ya no se usan portales complejos

const HeaderWithButton = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const headerStyle: React.CSSProperties = {
    ...bg.style,
  };

  return (
    <header className={cn('relative', bg.className)} style={headerStyle}>
      {/* Desktop version */}
      {!isMobile && (
        <div className="p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
            <h1 className={cn('font-bold text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
            <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
              <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
              <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
              <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
              <button className={cn('px-4 py-2 rounded-md font-semibold', buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile version - Logo + CTA Button visible + Hamburger */}
      {isMobile && (
        <>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
              <button
                type="button"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMenuOpen(v => !v)}
                className={cn('p-2 rounded-md', logoStyles.className)}
                style={logoStyles.style}
              >
                {menuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
            
            {/* CTA Button siempre visible en móvil */}
            <button className={cn('w-full px-4 py-2.5 rounded-lg font-semibold text-sm shadow-sm', buttonStyles.className)} style={buttonStyles.style}>
              {data.buttonText}
            </button>
          </div>

          {/* Mobile menu panel */}
          <Transition
            show={menuOpen}
            enter="transition-all duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <nav className="border-t border-slate-200 px-4 py-3 space-y-2">
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link1}</a>
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link2}</a>
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link3}</a>
            </nav>
          </Transition>
        </>
      )}
    </header>
  );
};

const HeaderNueva = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
  // Nueva variante - similar a default
  return <HeaderDefault data={data} isEditing={isEditing} onUpdate={onUpdate} />;
};

const HeaderSticky = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const headerStyle: React.CSSProperties = {
    ...bg.style,
    backdropFilter: 'blur(10px)',
  };

  return (
    <header className={cn('sticky top-0 z-50 relative', bg.className)} style={headerStyle}>
      {/* Desktop version */}
      {!isMobile && (
        <div className="p-3 shadow-sm">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
            <h1 className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
            <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
              <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
              <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
              <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
              <button className={cn('px-4 py-1.5 rounded-md font-semibold text-sm', buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile version - Compacto y pegajoso */}
      {isMobile && (
        <>
          <div className="p-3 shadow-sm flex justify-between items-center">
            <h1 className={cn('font-bold text-base', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
            <div className="flex items-center gap-2">
              <button className={cn('px-3 py-1.5 rounded-md font-semibold text-xs', buttonStyles.className)} style={buttonStyles.style}>
                {data.buttonText}
              </button>
              <button
                type="button"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMenuOpen(v => !v)}
                className={cn('p-1.5 rounded-md', logoStyles.className)}
                style={logoStyles.style}
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu panel */}
          <Transition
            show={menuOpen}
            enter="transition-all duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transition-all duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-2"
          >
            <nav className="border-t border-slate-200 px-3 py-2 space-y-1 shadow-md">
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link1}</a>
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link2}</a>
              <a className={cn('block py-2 px-3 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium', linkStyles.className)} style={linkStyles.style}>{data.link3}</a>
            </nav>
          </Transition>
        </>
      )}
    </header>
  );
};