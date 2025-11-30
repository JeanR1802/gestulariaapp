import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';

// Tipos para elementos personalizados del header (compatible con StackElement)
export type HeaderElementType = 'heading' | 'paragraph' | 'image' | 'button' | 'spacer' | 'logo' | 'link' | 'actions';

export interface HeaderElement {
  id: string;
  type: HeaderElementType;
  data: {
    content?: string;
    level?: 'h2' | 'h3' | 'h4';
    imageUrl?: string;
    alt?: string;
    buttonText?: string;
    buttonLink?: string;
    href?: string;
    platform?: string;
    height?: number;
    width?: number;
    zone?: 'left' | 'center' | 'right';
  };
}

export interface HeaderPresentationalData {
  variant?: 'default' | 'centered' | 'withButton' | 'nueva' | 'sticky' | 'custom';
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
  customElements?: HeaderElement[];
  paddingLeft?: number;
  paddingRight?: number;
  headerMode?: 'fijo' | 'dinamico';
}

// Pure presentational header used for server rendering and to guarantee identical markup
export default function HeaderPresentational({ data }: { data: HeaderPresentationalData }) {
  const variant = data.variant || 'default';
  const logo = data.logoText || 'Mi Negocio';
  const link1 = data.link1 || 'Inicio';
  const link2 = data.link2 || 'Servicios';
  const link3 = data.link3 || 'Contacto';
  const buttonText = data.buttonText || '';

  // Use theme palette values as sensible defaults but allow explicit overrides from `data`
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];

  const resolveColor = (val?: string, fallback?: string) => {
    if (!val) return fallback || undefined;
    if (val.startsWith('[#') && val.endsWith(']')) return val.slice(1, -1);
    return val; // allow classnames too but prefer inline resolved hex when provided in [#hex]
  };

  const resolved = {
    bg: resolveColor(data.backgroundColor, 'transparent'),
    logoColor: resolveColor(data.logoColor, c.text.primary),
    linkColor: resolveColor(data.linkColor, c.text.secondary),
    buttonBg: resolveColor(data.buttonBgColor, c.accent.primary),
    buttonText: resolveColor(data.buttonTextColor, theme === 'dark' ? '#0D1222' : '#FFFFFF')
  } as const;

  // Helper to produce inline style object for background when needed
  const bgStyle = resolved.bg ? { backgroundColor: resolved.bg } : undefined;

  switch (variant) {
    case 'custom':
      return <HeaderCustomVariant data={data} bgStyle={bgStyle} resolved={resolved} />;
    
    case 'centered':
      return (
        <header className="p-4" style={bgStyle}>
          <div className="max-w-5xl mx-auto flex justify-between items-center md:flex-col md:gap-3">
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: resolved.logoColor }}>{logo}</h1>
            <nav className="hidden md:flex items-center space-x-6 text-sm" style={{ color: resolved.linkColor }}>
              <a href="#">{link1}</a>
              <a href="#">{link2}</a>
              <a href="#">{link3}</a>
            </nav>
            <div className="md:hidden">
              <button aria-label="Abrir menú" style={{ color: resolved.logoColor }}>
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
        <header className="p-4" style={bgStyle}>
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold" style={{ color: resolved.logoColor }}>{logo}</h1>
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center space-x-6 text-sm" style={{ color: resolved.linkColor }}>
                <a href="#">{link1}</a>
                <a href="#">{link2}</a>
              </nav>
              <a href="#" className="px-4 py-1.5 rounded-md text-sm font-semibold" style={{ backgroundColor: resolved.buttonBg, color: resolved.buttonText }}>{buttonText || 'Acción'}</a>
            </div>
            <div className="md:hidden">
              <button aria-label="Abrir menú" style={{ color: resolved.logoColor }}>
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
        <header className="p-4" style={bgStyle}> 
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold" style={{ color: resolved.logoColor }}>{logo}</h1>
            <nav className="hidden md:flex items-center space-x-6 text-sm" style={{ color: resolved.linkColor }}>
              <a href="#">{link1}</a>
              <a href="#">{link2}</a>
              <a href="#">{link3}</a>
            </nav>
            <div className="md:hidden">
              <button aria-label="Abrir menú" style={{ color: resolved.logoColor }}>☰</button>
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
        <header className="p-4" style={bgStyle}>
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4" style={{ color: resolved.logoColor }}>
              <h1 className="text-lg font-bold">{logo}</h1>
            </div>
            <nav className="hidden md:flex items-center gap-8" style={{ color: resolved.linkColor }}>
              <a href="#" className="text-sm">{link1}</a>
              <a href="#" className="text-sm">{link2}</a>
              <a href="#" className="text-sm">{link3}</a>
            </nav>
            <div className="hidden md:flex items-center gap-4">
              <a href="#" className="px-4 py-1.5 rounded-full text-sm font-semibold" style={{ backgroundColor: resolved.buttonBg, color: resolved.buttonText }}>{buttonText || 'Comenzar'}</a>
            </div>
            <div className="md:hidden">
              <button aria-label="Abrir menú" style={{ color: resolved.logoColor }}>☰</button>
            </div>

          </div>

          <nav className="hidden md:hidden fixed inset-0 bg-white z-50 p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold">{logo}</h2>
              <button aria-label="Cerrar menú" className="text-slate-600">×</button>
            </div>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-lg font-semibold" style={{ color: resolved.linkColor }}>{link1}</a>
              <a href="#" className="text-lg font-semibold" style={{ color: resolved.linkColor }}>{link2}</a>
              <a href="#" className="text-lg font-semibold" style={{ color: resolved.linkColor }}>{link3}</a>
              <a href="#" className="mt-4 inline-block px-4 py-2 rounded-md font-semibold" style={{ backgroundColor: resolved.buttonBg, color: resolved.buttonText }}>{buttonText || 'Comenzar'}</a>
            </div>
          </nav>
        </header>
      );

    default:
      return (
        <header className="p-4" style={bgStyle}>
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold" style={{ color: resolved.logoColor }}>{logo}</h1>
            <nav className="hidden md:flex items-center space-x-6 text-sm" style={{ color: resolved.linkColor }}>
              <a href="#">{link1}</a>
              <a href="#">{link2}</a>
              <a href="#">{link3}</a>
            </nav>
            <div className="md:hidden">
              <button aria-label="Abrir menú" style={{ color: resolved.logoColor }}>☰</button>
            </div>
          </div>

          <nav className="hidden md:hidden fixed inset-x-0 top-full bg-white border-b border-slate-200 flex flex-col items-center gap-4 py-4 max-h-[70vh] overflow-y-auto" role="dialog" aria-modal="true" aria-hidden="true">
            <button aria-label="Cerrar menú" className="self-end mr-4 text-slate-600">×</button>
            <a href="#" className="text-slate-800 hover:text-blue-600" style={{ color: resolved.linkColor }}>{link1}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600" style={{ color: resolved.linkColor }}>{link2}</a>
            <a href="#" className="text-slate-800 hover:text-blue-600" style={{ color: resolved.linkColor }}>{link3}</a>
          </nav>
        </header>
      );
  }
}

// --- CUSTOM VARIANT RENDERER ---
function HeaderCustomVariant({ 
  data, 
  bgStyle, 
  resolved 
}: { 
  data: HeaderPresentationalData; 
  bgStyle?: React.CSSProperties;
  resolved: { bg?: string; logoColor?: string; linkColor?: string; buttonBg?: string; buttonText?: string; };
}) {
  const customElements = data.customElements || [];
  
  // Build header inline style merging background and optional paddings
  const headerStyle: React.CSSProperties = {
    ...bgStyle,
    paddingLeft: typeof data.paddingLeft === 'number' ? `${data.paddingLeft}px` : undefined,
    paddingRight: typeof data.paddingRight === 'number' ? `${data.paddingRight}px` : undefined,
  };

  // Agrupar elementos por zone (slot)
  const leftElements = customElements.filter(el => el.data.zone === 'left');
  const centerElements = customElements.filter(el => el.data.zone === 'center');
  const rightElements = customElements.filter(el => el.data.zone === 'right');

  return (
    <header className="p-4 min-h-[80px] flex items-center" style={headerStyle}>
      <div className="max-w-6xl mx-auto w-full grid grid-cols-3 items-center gap-4">
        {/* Left Slot */}
        <div className="flex items-center gap-4 justify-start">
          {leftElements.map((element) => (
            <React.Fragment key={element.id}>
              {renderHeaderElement(element, resolved)}
            </React.Fragment>
          ))}
        </div>

        {/* Center Slot */}
        <div className="flex items-center gap-4 justify-center">
          {centerElements.map((element) => (
            <React.Fragment key={element.id}>
              {renderHeaderElement(element, resolved)}
            </React.Fragment>
          ))}
        </div>

        {/* Right Slot */}
        <div className="flex items-center gap-4 justify-end">
          {rightElements.map((element) => (
            <React.Fragment key={element.id}>
              {renderHeaderElement(element, resolved)}
            </React.Fragment>
          ))}
        </div>
      </div>
    </header>
  );
}

// --- RENDER HEADER ELEMENT ---
function renderHeaderElement(
  element: HeaderElement,
  resolved: { logoColor?: string; linkColor?: string; buttonBg?: string; buttonText?: string; }
): React.ReactElement {
  switch (element.type) {
    case 'logo':
      return (
        <span className="font-bold text-xl" style={{ color: resolved.logoColor }}>
          {element.data.content || 'Logo'}
        </span>
      );
    
    case 'link':
      return (
        <a 
          href={element.data.href || '#'} 
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: resolved.linkColor }}
        >
          {element.data.content || 'Link'}
        </a>
      );
    
    case 'button':
      return (
        <a 
          href={element.data.buttonLink || element.data.href || '#'} 
          className="px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          style={{ backgroundColor: resolved.buttonBg, color: resolved.buttonText }}
        >
          {element.data.buttonText || element.data.content || 'Button'}
        </a>
      );
    
    case 'heading':
      const HeadingTag = element.data.level || 'h2';
      return (
        <HeadingTag className="font-bold text-lg" style={{ color: resolved.logoColor }}>
          {element.data.content || 'Heading'}
        </HeadingTag>
      );
    
    case 'paragraph':
      return (
        <p className="text-sm" style={{ color: resolved.linkColor }}>
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
        <div style={{ width: element.data.width || element.data.height || 20 }} className="flex-shrink-0"></div>
      );
    
    case 'actions':
      return (
        <a 
          href={element.data.href || '#'} 
          className="text-sm hover:opacity-80 transition-opacity"
          style={{ color: resolved.linkColor }}
        >
          {element.data.platform || 'Action'}
        </a>
      );
    
    default:
      return <span className="text-xs text-slate-400">Unknown element</span>;
  }
}
