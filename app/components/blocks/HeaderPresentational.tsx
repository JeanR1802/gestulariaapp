import React from 'react';
import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';
import { getBackgroundStyles, getTextStyles, getButtonStyles } from '@/app/lib/block-style-helpers';

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

  // Mobile menu state for interactive rendering
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Use theme palette values as sensible defaults but allow explicit overrides from `data`
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];

  // Use centralized helpers so Tailwind class names and custom hex values
  // always produce an inline style fallback that the preview can render.
  const bg = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const logoStyles = getTextStyles(data.logoColor, 'text-slate-800');
  const linkStyles = getTextStyles(data.linkColor, 'text-slate-600');
  const buttonStyles = getButtonStyles(data.buttonBgColor, data.buttonTextColor, 'bg-blue-600', 'text-white');

  // Merge with theme palette defaults when helper did not resolve a color
  const bgStyle = { ...(bg.style || {}), backgroundColor: (bg.style && (bg.style as any).backgroundColor) || c.bg?.primary } as React.CSSProperties;
  const finalLogoStyle = { ...(logoStyles.style || {}), color: (logoStyles.style && (logoStyles.style as any).color) || c.text.primary } as React.CSSProperties;
  const finalLinkStyle = { ...(linkStyles.style || {}), color: (linkStyles.style && (linkStyles.style as any).color) || c.text.secondary } as React.CSSProperties;
  const finalButtonStyle = { ...(buttonStyles.style || {}), backgroundColor: (buttonStyles.style && (buttonStyles.style as any).backgroundColor) || c.accent?.primary, color: (buttonStyles.style && (buttonStyles.style as any).color) || (theme === 'dark' ? '#0D1222' : '#FFFFFF') } as React.CSSProperties;

  switch (variant) {
    case 'custom':
      return <HeaderCustomVariant data={data} bgStyle={bgStyle} resolved={{ bg: bgStyle?.backgroundColor, logoColor: finalLogoStyle.color, linkColor: finalLinkStyle.color, buttonBg: finalButtonStyle.backgroundColor, buttonText: finalButtonStyle.color }} />;
    
    case 'centered':
      return (
        <header className="relative" style={bgStyle}>
          {/* Desktop */}
          <div className="hidden md:block p-4">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-3">
              <h1 className="text-xl font-bold" style={finalLogoStyle}>{logo}</h1>
              <nav className="flex items-center space-x-6 text-sm" style={finalLinkStyle}>
                <a href="#">{link1}</a>
                <a href="#">{link2}</a>
                <a href="#">{link3}</a>
              </nav>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="p-4 flex flex-col items-center gap-3">
              <h1 className="text-2xl font-bold" style={finalLogoStyle}>{logo}</h1>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border-2 font-medium text-sm"
                style={{ color: finalLogoStyle.color, borderColor: menuOpen ? '#60a5fa' : '#e2e8f0', backgroundColor: menuOpen ? '#eff6ff' : '#fff' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
              </button>
            </div>
            {menuOpen && (
              <nav className="border-t border-slate-200 px-4 py-3 space-y-2 flex flex-col items-center">
                <a href="#" className="block py-2 px-4 rounded-md hover:bg-slate-50 text-sm font-medium text-center w-full max-w-xs" style={finalLinkStyle}>{link1}</a>
                <a href="#" className="block py-2 px-4 rounded-md hover:bg-slate-50 text-sm font-medium text-center w-full max-w-xs" style={finalLinkStyle}>{link2}</a>
                <a href="#" className="block py-2 px-4 rounded-md hover:bg-slate-50 text-sm font-medium text-center w-full max-w-xs" style={finalLinkStyle}>{link3}</a>
              </nav>
            )}
          </div>
        </header>
      );

    case 'withButton':
      return (
        <header className="relative" style={bgStyle}>
          {/* Desktop */}
          <div className="hidden md:block p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold" style={finalLogoStyle}>{logo}</h1>
              <nav className="flex items-center space-x-6 text-sm" style={finalLinkStyle}>
                <a href="#">{link1}</a>
                <a href="#">{link2}</a>
                <a href="#">{link3}</a>
                <button className="px-4 py-2 rounded-md font-semibold" style={finalButtonStyle}>{buttonText}</button>
              </nav>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-lg font-bold" style={finalLogoStyle}>{logo}</h1>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-2" style={finalLogoStyle}>
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
              <button className="w-full px-4 py-2.5 rounded-lg font-semibold text-sm shadow-sm" style={finalButtonStyle}>{buttonText}</button>
            </div>
            {menuOpen && (
              <nav className="border-t border-slate-200 px-4 py-3 space-y-2">
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link1}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link2}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link3}</a>
              </nav>
            )}
          </div>
        </header>
      );

    case 'sticky':
      return (
        <header className="sticky top-0 z-50 relative" style={{ ...bgStyle, backdropFilter: 'blur(10px)' }}>
          {/* Desktop */}
          <div className="hidden md:block p-3 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-lg font-bold" style={finalLogoStyle}>{logo}</h1>
              <nav className="flex items-center space-x-6 text-sm" style={finalLinkStyle}>
                <a href="#">{link1}</a>
                <a href="#">{link2}</a>
                <a href="#">{link3}</a>
                <button className="px-4 py-1.5 rounded-md font-semibold text-sm" style={finalButtonStyle}>{buttonText}</button>
              </nav>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="p-3 shadow-sm flex justify-between items-center">
              <h1 className="text-base font-bold" style={finalLogoStyle}>{logo}</h1>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-md font-semibold text-xs" style={finalButtonStyle}>{buttonText}</button>
                <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5" style={finalLogoStyle}>
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
              <nav className="border-t border-slate-200 px-3 py-2 space-y-1 shadow-md">
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link1}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link2}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link3}</a>
              </nav>
            )}
          </div>
        </header>
      );

    case 'nueva':
      return (
        <header className="relative" style={bgStyle}>
          {/* Desktop */}
          <div className="hidden md:block p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold" style={finalLogoStyle}>{logo}</h1>
              <nav className="flex items-center space-x-6 text-sm" style={finalLinkStyle}>
                <a href="#">{link1}</a>
                <a href="#">{link2}</a>
                <a href="#">{link3}</a>
              </nav>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="p-4 flex justify-between items-center">
              <h1 className="text-lg font-bold" style={finalLogoStyle}>{logo}</h1>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2" style={finalLogoStyle}>
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
              <nav className="border-t border-slate-200 px-4 py-3 space-y-2">
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link1}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link2}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link3}</a>
              </nav>
            )}
          </div>
        </header>
      );

    default:
      return (
        <header className="relative" style={bgStyle}>
          {/* Desktop */}
          <div className="hidden md:block p-4">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold" style={finalLogoStyle}>{logo}</h1>
              <nav className="flex items-center space-x-6 text-sm" style={finalLinkStyle}>
                <a href="#">{link1}</a>
                <a href="#">{link2}</a>
                <a href="#">{link3}</a>
              </nav>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <div className="p-4 flex justify-between items-center">
              <h1 className="text-lg font-bold" style={finalLogoStyle}>{logo}</h1>
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} 
                className="p-2"
                style={finalLogoStyle}
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
              <nav className="border-t border-slate-200 px-4 py-3 space-y-2">
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link1}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link2}</a>
                <a href="#" className="block py-2 px-3 rounded-md hover:bg-slate-50 text-sm font-medium" style={finalLinkStyle}>{link3}</a>
              </nav>
            )}
          </div>
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
