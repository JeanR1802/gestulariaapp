// app/components/editor/blocks/HeaderBlock.tsx (REFACTORED with use-editable)
'use client';
import React, { JSX, useState, useRef, useEffect } from 'react';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { BlockComponentProps } from './index';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { Transition } from '@headlessui/react';
import { createPortal } from 'react-dom';

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
export function HeaderBlock({ data }: BlockComponentProps<HeaderData>) {
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

const HeaderDefault = ({ data }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Close on ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // rect del canvas para limitar el portal
  const canvasRect = useCanvasRect(menuOpen);

  return (
    <header className={cn('p-4', bg.className)} style={bg.style}>
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <h1 className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>

        {/* Desktop nav */}
        {!isMobile && (
          <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
            <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
          </nav>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            type="button"
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen(v => !v)}
            onTouchStart={(e) => { e.preventDefault(); setMenuOpen(v => !v); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setMenuOpen(v => !v); } }}
            className={cn('px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500', logoStyles.className)}
            style={logoStyles.style}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile off-canvas menu ahora portalizado y limitado al canvas */}
      <CanvasPortal open={menuOpen} rect={canvasRect} onClose={() => setMenuOpen(false)}>
        <div className="p-4 flex flex-col" style={{ maxHeight: canvasRect ? Math.min(420, Math.max(160, canvasRect.height - 24)) : 360, overflowY: 'auto' }}>
          <div className="flex items-center justify-between mb-4">
            <div className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>{data.logoText}</div>
            <button ref={closeBtnRef} onClick={() => setMenuOpen(false)} aria-label="Cerrar" className="text-xl">✕</button>
          </div>

          <nav className="flex flex-col gap-3 text-sm text-slate-700 overflow-auto">
            <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link1}</button>
            <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link2}</button>
            <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link3}</button>
          </nav>

          <div className="mt-4">
            {data.buttonText && (
              <button type="button" onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-2 rounded-md bg-blue-600 text-white font-semibold">{data.buttonText}</button>
            )}
          </div>
        </div>
      </CanvasPortal>
    </header>
  );
};

const HeaderCentered = ({ data }: BlockComponentProps<HeaderData>) => {
    const { isMobile } = usePreviewMode();
    const bg = getBackgroundStyles(data.backgroundColor);
    const logoStyles = getStyles(data.logoColor, 'text-slate-800');
    const linkStyles = getStyles(data.linkColor, 'text-slate-600');

    // Mobile menu state
    const [menuOpen, setMenuOpen] = useState(false);
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
      if (menuOpen) document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [menuOpen]);

    // Focus the close button when the menu opens for screen reader / keyboard users
    useEffect(() => {
      if (menuOpen) {
        // slight delay to ensure portal content is mounted
        setTimeout(() => closeBtnRef.current?.focus(), 0);
      }
    }, [menuOpen]);

    const canvasRect = useCanvasRect(menuOpen);

    // For the centered header we prefer the menu to drop from the TOP of the canvas
    // to avoid positioning issues; set anchorTop to 0 when open.
    const anchorTop = menuOpen ? 0 : null;

    return (
      <header className={cn('p-4', bg.className)} style={bg.style}>
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          {/* Header content stacked and centered (mobile-first) */}
          <div className="w-full header-content flex flex-col items-center py-4 px-4 md:px-0 relative box-border">
             {/* Logo */}
             <h1 className={cn('logo font-extrabold tracking-tight', isMobile ? 'text-2xl' : 'text-xl', logoStyles.className)} style={logoStyles.style}>
               {data.logoText}
             </h1>

            {/* Mobile pill menu button */}
            {isMobile && (
              <button
                type="button"
                aria-expanded={menuOpen}
                aria-controls="centered-mobile-menu"
                onClick={() => setMenuOpen(v => !v)}
                className={cn(
                  'menu-toggle mt-3 inline-flex items-center gap-2 rounded-full px-5 py-2 border-2 transition-all',
                  menuOpen ? 'border-sky-300 bg-slate-50' : 'border-slate-200 bg-white',
                  logoStyles.className
                )}
                style={logoStyles.style}
              >
                {/* simple hamburger icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                <span className="font-semibold text-sm">{menuOpen ? 'Cerrar' : 'Menú'}</span>
              </button>
            )}

            {/* Desktop nav shown below logo on larger screens */}
            {!isMobile && (
              <nav className={cn('mt-3 flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
                <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
                <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
                <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
              </nav>
            )}
          </div>

          {/* Mobile menu dropdown (portalized inside canvas) anchored under the header */}
          <CanvasPortal open={menuOpen} rect={canvasRect} onClose={() => setMenuOpen(false)} anchorTop={anchorTop}>
            <div
              id="centered-mobile-menu"
              className="mobile-menu absolute left-0 w-full bg-white border-t border-b py-2 shadow-sm z-40"
              style={{ top: 0, maxHeight: canvasRect ? Math.max(80, canvasRect.height - 12) : undefined, overflowY: 'auto' }}
            >
              <div className="flex items-center justify-between px-4 py-2">
                <div className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>{data.logoText}</div>
                {/* Close button added here */}
                <button
                  ref={closeBtnRef}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="ml-3 inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              <div className="mobile-menu-links flex flex-col items-center gap-2 py-2 px-4">
                <button onClick={() => setMenuOpen(false)} className="w-full text-center py-3 rounded-md hover:bg-slate-50 font-semibold text-sm text-slate-700">{data.link1}</button>
                <button onClick={() => setMenuOpen(false)} className="w-full text-center py-3 rounded-md hover:bg-slate-50 font-semibold text-sm text-slate-700">{data.link2}</button>
                <button onClick={() => setMenuOpen(false)} className="w-full text-center py-3 rounded-md hover:bg-slate-50 font-semibold text-sm text-slate-700">{data.link3}</button>
              </div>
            </div>
          </CanvasPortal>
        </div>
      </header>
  );
};

const HeaderWithButton = ({ data }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  // Mobile menu state (para que funcione en modo preview)
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Focus the close button when menu opens
  useEffect(() => {
    if (menuOpen) setTimeout(() => closeBtnRef.current?.focus(), 0);
  }, [menuOpen]);

  const canvasRect = useCanvasRect(menuOpen);

  return (
    <header className={cn('p-4', bg.className)} style={bg.style}>
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <h1 className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>
        {!isMobile && (
          <div className="flex items-center gap-6">
            <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
              <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
              <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
            </nav>
            <a className={cn('px-4 py-1.5 rounded-md text-sm font-semibold', buttonStyle.className)} style={buttonStyle.style}>{data.buttonText}</a>
          </div>
        )}
        {isMobile && (
          <>
            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen(v => !v)}
              onTouchStart={(e) => { e.preventDefault(); setMenuOpen(v => !v); }}
              onPointerDown={() => setMenuOpen(v => !v)}
              className={logoStyles.className}
              style={logoStyles.style}
            >
              ☰
            </button>

            {/* Portalized menu inside canvas to avoid overflowing editor */}
            <CanvasPortal open={menuOpen} rect={canvasRect} onClose={() => setMenuOpen(false)}>
              <div className="p-4 flex flex-col bg-white" style={{ maxHeight: canvasRect ? Math.min(420, Math.max(160, canvasRect.height - 24)) : 360, overflowY: 'auto' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>{data.logoText}</div>
                  <button ref={closeBtnRef} onClick={() => setMenuOpen(false)} aria-label="Cerrar" className="text-xl">✕</button>
                </div>

                <nav className="flex flex-col gap-3 text-sm text-slate-700 overflow-auto">
                  <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link1}</button>
                  <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link2}</button>
                </nav>

                <div className="mt-4">
                  {data.buttonText && (
                    <a onClick={() => setMenuOpen(false)} className={cn('block w-full text-center px-4 py-2 rounded-md text-white font-semibold', buttonStyle.className)} style={buttonStyle.style}>
                      {data.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </CanvasPortal>
          </>
        )}
      </div>
    </header>
  );
};

const HeaderNueva = ({ data }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  // Mobile menu state + accessibility
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setTimeout(() => closeBtnRef.current?.focus(), 0);
  }, [menuOpen]);

  // Portal anchoring to canvas
  const canvasRect = useCanvasRect(menuOpen);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const anchorTop = canvasRect && headerRef.current ? Math.max(0, headerRef.current.getBoundingClientRect().bottom - canvasRect.top) : 0;

  return (
    <div className={cn('w-full', bg.className)} style={bg.style}>
      <header ref={headerRef} className="max-w-6xl mx-auto w-full p-4 box-border">
        <div className="flex items-center justify-between">
          <div className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>
            {data.logoText}
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <nav className={cn('flex items-center gap-6 mx-6', linkStyles.className)} style={linkStyles.style}>
              <a className="text-sm hover:opacity-80 transition-opacity">{data.link1}</a>
              <a className="text-sm hover:opacity-80 transition-opacity">{data.link2}</a>
              <a className="text-sm hover:opacity-80 transition-opacity">{data.link3}</a>
            </nav>
          )}

          {/* CTA or hamburger */}
          {!isMobile ? (
            data.buttonText ? (
              <a className={cn('px-4 py-1.5 rounded-md text-sm font-semibold', buttonStyle.className)} style={buttonStyle.style}>
                {data.buttonText}
              </a>
            ) : (
              <div />
            )
          ) : (
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="nueva-mobile-menu"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              onClick={() => setMenuOpen(v => !v)}
              onTouchStart={(e) => { e.preventDefault(); setMenuOpen(v => !v); }}
              className={cn('inline-flex items-center justify-center px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500', logoStyles.className)}
              style={logoStyles.style}
            >
              <span aria-hidden>{menuOpen ? '✕' : '☰'}</span>
            </button>
          )}
        </div>

        {/* Mobile menu now portalized and limited to canvas */}
        <CanvasPortal open={menuOpen} rect={canvasRect} onClose={() => setMenuOpen(false)} anchorTop={anchorTop}>
          <div id="nueva-mobile-menu" className="bg-white w-full shadow-sm" style={{ maxHeight: canvasRect ? Math.min(420, Math.max(160, canvasRect.height - anchorTop - 12)) : 360, overflowY: 'auto' }}>
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <div className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>
                {data.logoText}
              </div>
              <button ref={closeBtnRef} onClick={() => setMenuOpen(false)} aria-label="Cerrar menú" className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className={cn('flex flex-col gap-2 px-4 py-3', linkStyles.className)} style={linkStyles.style}>
              <button onClick={() => setMenuOpen(false)} className="w-full text-left py-3 rounded-md hover:bg-slate-50 font-semibold text-sm text-slate-700">
                {data.link1}
              </button>
              <button onClick={() => setMenuOpen(false)} className="w-full text-left py-3 rounded-md hover:bg-slate-50 font-semibold text-sm text-slate-700">
                {data.link2}
              </button>
              <button onClick={() => setMenuOpen(false)} className="w-full text-left py-3 rounded-md hover:bg-slate-50 font-semibold text-sm text-slate-700">
                {data.link3}
              </button>

              {data.buttonText && (
                <div className="pt-2">
                  <a onClick={() => setMenuOpen(false)} className={cn('block w-full text-center px-4 py-2 rounded-md text-white font-semibold', buttonStyle.className)} style={buttonStyle.style}>
                    {data.buttonText}
                  </a>
                </div>
              )}
            </div>
          </div>
        </CanvasPortal>
      </header>
    </div>
  );
};

const HeaderSticky = ({ data }: BlockComponentProps<HeaderData>) => {
  // IMPORTANT: in the visual editor the header must not overlay the canvas UI.
  // Keep visual 'sticky' appearance for front-end, but in-editor render as normal block without fixed positioning.
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  const buttonStyle = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

  // Mobile menu state
  const [menuOpen, setMenuOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) setTimeout(() => closeBtnRef.current?.focus(), 0);
  }, [menuOpen]);

  const canvasRect = useCanvasRect(menuOpen);

  // Render as a normal header block (no sticky/fixed) and ensure it doesn't create a new stacking context above the editor
  return (
    <header className={cn('p-4 relative z-0', bg.className)} style={bg.style}>
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <div className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>
          {data.logoText}
        </div>

        {!isMobile && (
          <nav className={cn('flex items-center gap-6 text-sm', linkStyles.className)} style={linkStyles.style}>
            <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
          </nav>
        )}

        {!isMobile ? (
          data.buttonText ? (
            <a className={cn('px-4 py-1.5 rounded-md text-sm font-semibold', buttonStyle.className)} style={buttonStyle.style}>
              {data.buttonText}
            </a>
          ) : (
            <div />
          )
        ) : (
          <>
            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              onTouchStart={(e) => {
                e.preventDefault();
                setMenuOpen((v) => !v);
              }}
              onPointerDown={() => setMenuOpen((v) => !v)}
              className={cn('text-xl', logoStyles.className)}
              style={logoStyles.style}
            >
              ☰
            </button>

            {/* Portalized menu inside canvas to avoid overflowing editor */}
            <CanvasPortal open={menuOpen} rect={canvasRect} onClose={() => setMenuOpen(false)}>
              <div className="p-4 flex flex-col bg-white" style={{ maxHeight: canvasRect ? Math.min(460, Math.max(160, canvasRect.height - 24)) : 360, overflowY: 'auto' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('font-bold text-lg', logoStyles.className)} style={logoStyles.style}>
                    {data.logoText}
                  </div>
                  <button ref={closeBtnRef} onClick={() => setMenuOpen(false)} aria-label="Cerrar" className="text-xl">
                    ✕
                  </button>
                </div>

                <nav className="flex flex-col gap-3 text-sm text-slate-700">
                  <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link1}</button>
                  <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link2}</button>
                  <button type="button" className="text-left w-full px-2 py-2 rounded hover:bg-slate-50" onClick={() => setMenuOpen(false)}>{data.link3}</button>
                </nav>

                <div className="mt-4">
                  {data.buttonText && (
                    <a onClick={() => setMenuOpen(false)} className="block w-full text-center px-4 py-2 rounded-md bg-blue-600 text-white font-semibold">
                      {data.buttonText}
                    </a>
                  )}
                </div>
              </div>
            </CanvasPortal>
          </>
        )}
      </div>
    </header>
  );
};

// --- Helper: obtiene rect del canvas y re-calcula al abrir/resize/scroll
function useCanvasRect(open: boolean) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  React.useEffect(() => {
    if (!open) return;
    const compute = () => {
      const el = document.getElementById('editor-canvas');
      if (el) setRect(el.getBoundingClientRect());
    };
    compute();
    window.addEventListener('resize', compute);
    window.addEventListener('scroll', compute, true);
    return () => {
      window.removeEventListener('resize', compute);
      window.removeEventListener('scroll', compute, true);
    };
  }, [open]);
  return rect;
}

// --- Helper: portaliza un overlay + panel dentro del viewport pero limitado al rect del canvas
function CanvasPortal({ open, rect, children, onClose, anchorTop }: { open: boolean; rect: DOMRect | null; children: React.ReactNode; onClose: () => void; anchorTop?: number | null }) {
  if (typeof document === 'undefined' || !open || !rect) return null;
  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
    zIndex: 3000,
    pointerEvents: 'none', // overlay/panel control own pointer events
    overflow: 'hidden', // prevent children from visibly overflowing the canvas bounds
  };
  const overlayStyle: React.CSSProperties = { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.35)', pointerEvents: 'auto' };

  // If anchorTop is provided render children anchored under that Y position (useful for dropdowns under header)
  if (typeof anchorTop === 'number') {
    const anchoredStyle: React.CSSProperties = { position: 'absolute', left: 0, top: anchorTop, width: '100%', pointerEvents: 'auto' };
    return createPortal(
      <div style={containerStyle}>
        <div style={overlayStyle} onClick={onClose} />
        <div style={anchoredStyle}>{children}</div>
      </div>,
      document.body
    );
  }

  // default: right-side panel (legacy behavior)
  const panelStyle: React.CSSProperties = { position: 'absolute', top: 0, right: 0, height: '100%', width: 288, background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', pointerEvents: 'auto' };
  return createPortal(
    <div style={containerStyle}>
      <div style={overlayStyle} onClick={onClose} />
      <div style={panelStyle}>{children}</div>
    </div>,
    document.body
  );
}

// --- Componente de Input reutilizable para el editor ---
const InputField = ({ label, value, propKey, updateData }: { label: string, value: string, propKey: keyof HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) => (
  <div>
    <label className="text-sm font-medium text-slate-700 mb-1 block">{label}</label>
    <input
      className="border rounded-md px-2 py-1.5 text-sm w-full focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
      value={value}
      onChange={e => updateData(propKey, e.target.value)}
    />
  </div>
);

// --- Editor de CONTENIDO ---
export function HeaderContentEditor({ data, updateData }: { data: HeaderData, updateData: (key: keyof HeaderData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <InputField label="Texto del Logo" value={data.logoText} propKey="logoText" updateData={updateData} />
      <InputField label="Enlace 1" value={data.link1} propKey="link1" updateData={updateData} />
      <InputField label="Enlace 2" value={data.link2} propKey="link2" updateData={updateData} />
      {data.variant !== 'withButton' && <InputField label="Enlace 3" value={data.link3} propKey="link3" updateData={updateData} />}
      {data.variant === 'withButton' && <InputField label="Texto del Botón" value={data.buttonText} propKey="buttonText" updateData={updateData} />}
    </div>
  );
}

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