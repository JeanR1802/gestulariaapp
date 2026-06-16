// app/components/editor/blocks/HeaderBlock.tsx (REFACTORED with use-editable)
'use client';
import React, { JSX, useState, useRef, useEffect } from 'react';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { BlockComponentProps } from './index';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
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

// --- Lógica mínima para colores personalizados (solo hex) ---
const getCustomTextStyle = (colorValue?: string) =>
  colorValue?.startsWith('[#') ? { color: colorValue.slice(1, -1) } : undefined;

const getCustomBgStyle = (colorValue?: string) =>
  colorValue?.startsWith('[#') ? { backgroundColor: colorValue.slice(1, -1) } : undefined;

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
  const headerStyle = getCustomBgStyle(data.backgroundColor);
  const logoStyle = getCustomTextStyle(data.logoColor);
  const linkStyle = getCustomTextStyle(data.linkColor);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="relative bg-white border-b border-gray-200" style={headerStyle}>
      {/* Desktop version */}
      {!isMobile && (
        <div className="p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
            <h1 className="font-semibold text-xl" style={logoStyle}>{data.logoText}</h1>
            <nav className="flex items-center space-x-6 text-sm" style={linkStyle}>
              <a>{data.link1}</a>
              <a>{data.link2}</a>
              <a>{data.link3}</a>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile version - Logo izq + Hamburger der */}
      {isMobile && (
        <>
          <div className="p-4 flex justify-between items-center">
            <h1 className="font-semibold text-lg" style={logoStyle}>{data.logoText}</h1>
            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen(v => !v)}
              className="border rounded p-2"
              style={logoStyle}
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
          {menuOpen && (
            <nav className="border-t border-gray-200 px-4 py-3 space-y-2">
              <a className="block py-2 px-3 rounded border border-gray-200" style={linkStyle}>{data.link1}</a>
              <a className="block py-2 px-3 rounded border border-gray-200" style={linkStyle}>{data.link2}</a>
              <a className="block py-2 px-3 rounded border border-gray-200" style={linkStyle}>{data.link3}</a>
            </nav>
          )}
        </>
      )}
    </header>
  );
};

const HeaderCentered = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
    const { isMobile } = usePreviewMode();
  const headerStyle = getCustomBgStyle(data.backgroundColor);
  const logoStyle = getCustomTextStyle(data.logoColor);
  const linkStyle = getCustomTextStyle(data.linkColor);

    // Mobile menu state
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
      if (menuOpen) document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    return (
      <header className="relative bg-white border-b border-gray-200" style={headerStyle}>
        {/* Desktop version - Todo centrado */}
        {!isMobile && (
          <div className="p-4">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
              <h1 className="font-semibold text-xl" style={logoStyle}>{data.logoText}</h1>
              <nav className="flex items-center space-x-6 text-sm" style={linkStyle}>
                <a>{data.link1}</a>
                <a>{data.link2}</a>
                <a>{data.link3}</a>
              </nav>
            </div>
          </div>
        )}

        {/* Mobile version - Logo centrado + Botón menú abajo */}
        {isMobile && (
          <>
            <div className="p-4 flex flex-col items-center gap-3">
              <h1 className="font-semibold text-2xl" style={logoStyle}>{data.logoText}</h1>
              <button
                type="button"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMenuOpen(v => !v)}
                className="inline-flex items-center gap-2 px-6 py-2 rounded border border-gray-200 text-sm"
                style={logoStyle}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
              </button>
            </div>

            {/* Mobile menu panel */}
            {menuOpen && (
              <nav className="border-t border-gray-200 px-4 py-3 space-y-2 flex flex-col items-center">
                <a className="block py-2 px-4 rounded border border-gray-200 text-sm text-center w-full max-w-xs" style={linkStyle}>{data.link1}</a>
                <a className="block py-2 px-4 rounded border border-gray-200 text-sm text-center w-full max-w-xs" style={linkStyle}>{data.link2}</a>
                <a className="block py-2 px-4 rounded border border-gray-200 text-sm text-center w-full max-w-xs" style={linkStyle}>{data.link3}</a>
              </nav>
            )}
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
  updateData: (key: keyof HeaderData, value: unknown) => void;
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
  const headerStyle = getCustomBgStyle(data.backgroundColor);
  const logoStyle = getCustomTextStyle(data.logoColor);
  const linkStyle = getCustomTextStyle(data.linkColor);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="relative bg-white border-b border-gray-200" style={headerStyle}>
      {/* Desktop version */}
      {!isMobile && (
        <div className="p-4">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
            <h1 className="font-semibold text-xl" style={logoStyle}>{data.logoText}</h1>
            <nav className="flex items-center space-x-6 text-sm" style={linkStyle}>
              <a>{data.link1}</a>
              <a>{data.link2}</a>
              <a>{data.link3}</a>
              <button className="px-6 py-2 bg-gray-800 text-white font-bold rounded">{data.buttonText}</button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile version - Logo + CTA Button visible + Hamburger */}
      {isMobile && (
        <>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h1 className="font-semibold text-lg" style={logoStyle}>{data.logoText}</h1>
              <button
                type="button"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMenuOpen(v => !v)}
                className="border rounded p-2"
                style={logoStyle}
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
            <button className="w-full px-6 py-2 bg-gray-800 text-white font-bold rounded">
              {data.buttonText}
            </button>
          </div>

          {/* Mobile menu panel */}
          {menuOpen && (
            <nav className="border-t border-gray-200 px-4 py-3 space-y-2">
              <a className="block py-2 px-3 rounded border border-gray-200" style={linkStyle}>{data.link1}</a>
              <a className="block py-2 px-3 rounded border border-gray-200" style={linkStyle}>{data.link2}</a>
              <a className="block py-2 px-3 rounded border border-gray-200" style={linkStyle}>{data.link3}</a>
            </nav>
          )}
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
  const headerStyle = getCustomBgStyle(data.backgroundColor);
  const logoStyle = getCustomTextStyle(data.logoColor);
  const linkStyle = getCustomTextStyle(data.linkColor);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 relative bg-white border-b border-gray-200" style={headerStyle}>
      {/* Desktop version */}
      {!isMobile && (
        <div className="p-3">
          <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
            <h1 className="font-semibold text-lg" style={logoStyle}>{data.logoText}</h1>
            <nav className="flex items-center space-x-6 text-sm" style={linkStyle}>
              <a>{data.link1}</a>
              <a>{data.link2}</a>
              <a>{data.link3}</a>
              <button className="px-6 py-2 bg-gray-800 text-white font-bold rounded">{data.buttonText}</button>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile version - Compacto y pegajoso */}
      {isMobile && (
        <>
          <div className="p-3 flex justify-between items-center">
            <h1 className="font-semibold text-base" style={logoStyle}>{data.logoText}</h1>
            <div className="flex items-center gap-2">
              <button className="px-6 py-2 bg-gray-800 text-white font-bold rounded text-xs">
                {data.buttonText}
              </button>
              <button
                type="button"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                onClick={() => setMenuOpen(v => !v)}
                className="border rounded p-1.5"
                style={logoStyle}
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

          {menuOpen && (
            <nav className="border-t border-gray-200 px-3 py-2 space-y-1">
              <a className="block py-2 px-3 rounded border border-gray-200 text-sm" style={linkStyle}>{data.link1}</a>
              <a className="block py-2 px-3 rounded border border-gray-200 text-sm" style={linkStyle}>{data.link2}</a>
              <a className="block py-2 px-3 rounded border border-gray-200 text-sm" style={linkStyle}>{data.link3}</a>
            </nav>
          )}
        </>
      )}
    </header>
  );
};