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
import { StackElement } from './CustomStackElements';
import { InputField } from './InputField';

// --- Interfaces de Datos ---
export interface HeaderData {
  variant: 'default' | 'centered' | 'withButton' | 'nueva' | 'sticky' | 'custom'; // AÑADIDA 'custom'
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
  // NUEVO CAMPO: Contenido para el modo personalizado
  customElements?: StackElement[]; 
  // NUEVOS CAMPOS: padding del header en px (izquierda / derecha). Opcionales.
  paddingLeft?: number;
  paddingRight?: number;
  // NUEVO CAMPO: modo del header para custom variant ('fijo' | 'dinamico')
  headerMode?: 'fijo' | 'dinamico';
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
    case 'custom': // NUEVO CASO
      return <HeaderCustom {...props} />; 
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

  // Build header inline style merging background and optional paddings
  const headerStyle: React.CSSProperties = {
    ...bg.style,
    paddingLeft: typeof data.paddingLeft === 'number' ? `${data.paddingLeft}px` : undefined,
    paddingRight: typeof data.paddingRight === 'number' ? `${data.paddingRight}px` : undefined,
  };

  return (
    <header className={cn('p-4', bg.className)} style={headerStyle}>
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

    const headerStyle: React.CSSProperties = {
      ...bg.style,
      paddingLeft: typeof data.paddingLeft === 'number' ? `${data.paddingLeft}px` : undefined,
      paddingRight: typeof data.paddingRight === 'number' ? `${data.paddingRight}px` : undefined,
    };

    // For the centered header we prefer the menu to drop from the TOP of the canvas
    // to avoid positioning issues; set anchorTop to 0 when open.
    const anchorTop = menuOpen ? 0 : null;

    return (
      <header className={cn('p-4', bg.className)} style={headerStyle}>
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

const HeaderCustom = ({ data, isEditing, onUpdate }: BlockComponentProps<HeaderData>) => {
  const bg = getBackgroundStyles(data.backgroundColor);

  // En la vista previa normal, mostramos el placeholder
  if (!isEditing) {
      return (
          <header className={cn('p-4', bg.className)} style={bg.style}>
              <div className="max-w-6xl mx-auto flex justify-between items-center bg-slate-50/50 p-4 rounded-md border border-slate-200">
                 <p className="text-sm text-slate-600">Header Personalizado. **Modo Edición Avanzada: Clic para entrar.**</p>
              </div>
          </header>
      )
  }

  const headerStyle: React.CSSProperties = {
    ...bg.style,
    paddingLeft: typeof data.paddingLeft === 'number' ? `${data.paddingLeft}px` : undefined,
    paddingRight: typeof data.paddingRight === 'number' ? `${data.paddingRight}px` : undefined,
  };

  // Agrupar elementos por zone
  const customElements = data.customElements || [];
  const leftElements = customElements.filter(el => el.data.zone === 'left');
  const centerElements = customElements.filter(el => el.data.zone === 'center');
  const rightElements = customElements.filter(el => el.data.zone === 'right');

  // En el modo edición AVANZADA (isEditing === true), renderizamos los customElements
  return (
    <header className={cn('p-4 min-h-[80px] flex items-center', bg.className)} style={headerStyle}>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-3 items-center gap-4">
            {/* Left Zone */}
            <div className="flex items-center gap-4 justify-start">
                {leftElements.map((element) => (
                    <StackElementRenderer key={element.id} element={element} />
                ))}
            </div>
            {/* Center Zone */}
            <div className="flex items-center gap-4 justify-center">
                {centerElements.map((element) => (
                    <StackElementRenderer key={element.id} element={element} />
                ))}
            </div>
            {/* Right Zone */}
            <div className="flex items-center gap-4 justify-end">
                {rightElements.map((element) => (
                    <StackElementRenderer key={element.id} element={element} />
                ))}
            </div>
        </div>
    </header>
  );
};

// --- StackElementRenderer Component ---
function StackElementRenderer({ element }: { element: StackElement }) {
  switch (element.type) {
    case 'logo':
      return (
        <span className="font-bold text-xl">
          {element.data.content || 'Logo'}
        </span>
      );
    
    case 'link':
      return (
        <a 
          href={element.data.href || '#'} 
          className="text-sm hover:opacity-80 transition-opacity"
        >
          {element.data.content || 'Link'}
        </a>
      );
    
    case 'button':
      return (
        <a 
          href={element.data.buttonLink || element.data.href || '#'} 
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          {element.data.buttonText || element.data.content || 'Button'}
        </a>
      );
    
    case 'heading':
      const HeadingTag = element.data.level || 'h2';
      return (
        <HeadingTag className="font-bold text-lg">
          {element.data.content || 'Heading'}
        </HeadingTag>
      );
    
    case 'paragraph':
      return (
        <p className="text-sm">
          {element.data.content || 'Text'}
        </p>
      );
    
    case 'image':
      return (
        <img 
          src={element.data.imageUrl || '/placeholder.svg'} 
          alt={element.data.alt || 'Image'} 
          className="h-8 w-auto object-contain"
        />
      );
    
    case 'spacer':
      return (
        <div 
          style={{ width: element.data.width || element.data.height || 20 }} 
          className="flex-shrink-0"
        />
      );
    
    case 'actions':
      return (
        <a 
          href={element.data.href || '#'} 
          className="text-sm hover:opacity-80 transition-opacity"
        >
          {element.data.platform || 'Action'}
        </a>
      );
    
    default:
      return <span className="text-xs text-slate-400">Unknown element</span>;
  }
}

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
  updateData: (key: keyof HeaderData, value: string) => void;
}) {
  return (
    <div className="space-y-3">
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
    maxWidth: '100vw',
    zIndex: 1000,
    overflow: 'hidden',
  };
  const panelStyle: React.CSSProperties = {
    maxHeight: `calc(${Math.round(rect.height)}px - env(safe-area-inset-top) - env(safe-area-inset-bottom))`,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch' as const,
  };

  return createPortal(
    <Transition
      show={open}
      enter="transition-opacity duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className="fixed inset-0 bg-black/30"
        onClick={onClose}
        style={{ zIndex: 999 }}
      >
        <div className="flex items-start justify-center min-h-screen px-4 py-6">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden" style={containerStyle}>
            <div className="relative" style={panelStyle}>
              {/* Close button in panel context */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 transition-colors"
                aria-label="Cerrar menú"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              {children}
            </div>
          </div>
        </div>
      </div>
    </Transition>,
    document.body
  );
}

const HeaderWithButton = ({ data }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

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

  const headerStyle: React.CSSProperties = {
    ...bg.style,
    paddingLeft: typeof data.paddingLeft === 'number' ? `${data.paddingLeft}px` : undefined,
    paddingRight: typeof data.paddingRight === 'number' ? `${data.paddingRight}px` : undefined,
  };

  return (
    <header className={cn('p-4', bg.className)} style={headerStyle}>
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <h1 className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>

        {/* Desktop nav */}
        {!isMobile && (
          <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
            <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
            <button className={cn('px-4 py-2 rounded', buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</button>
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
            <button type="button" onClick={() => setMenuOpen(false)} className={cn('block w-full text-center px-4 py-2 rounded-md font-semibold', buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</button>
          </div>
        </div>
      </CanvasPortal>
    </header>
  );
};

const HeaderNueva = ({ data }: BlockComponentProps<HeaderData>) => {
  // Similar to HeaderDefault, quizás un nuevo estilo
  return <HeaderDefault data={data} />;
};

const HeaderSticky = ({ data }: BlockComponentProps<HeaderData>) => {
  const { isMobile } = usePreviewMode();
  const bg = getBackgroundStyles(data.backgroundColor);
  const logoStyles = getStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getStyles(data.linkColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor);

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

  const headerStyle: React.CSSProperties = {
    ...bg.style,
    paddingLeft: typeof data.paddingLeft === 'number' ? `${data.paddingLeft}px` : undefined,
    paddingRight: typeof data.paddingRight === 'number' ? `${data.paddingRight}px` : undefined,
  };

  return (
    <header className={cn('sticky top-0 z-50 p-4', bg.className)} style={headerStyle}>
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <h1 className={cn('font-bold', isMobile ? 'text-lg' : 'text-xl', logoStyles.className)} style={logoStyles.style}>{data.logoText}</h1>

        {/* Desktop nav */}
        {!isMobile && (
          <nav className={cn('flex items-center space-x-6 text-sm', linkStyles.className)} style={linkStyles.style}>
            <a className="hover:opacity-80 transition-opacity">{data.link1}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link2}</a>
            <a className="hover:opacity-80 transition-opacity">{data.link3}</a>
            <button className={cn('px-4 py-2 rounded', buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</button>
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
            <button type="button" onClick={() => setMenuOpen(false)} className={cn('block w-full text-center px-4 py-2 rounded-md font-semibold', buttonStyles.className)} style={buttonStyles.style}>{data.buttonText}</button>
          </div>
        </div>
      </CanvasPortal>
    </header>
  );
};