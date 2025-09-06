// app/components/editor/blocks/FooterBlock.tsx
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';

// --- Interfaces de Datos ---
interface SocialLink {
  platform: string;
  url: string;
}

interface FooterColumn {
    title: string;
    links: string[];
}

export interface FooterData {
    variant: 'simple' | 'multiColumn' | 'minimal';
    copyrightText: string;
    backgroundColor: string;
    textColor: string;
    socialLinks?: SocialLink[];
    columns?: FooterColumn[];
}

// --- Componente "Director" ---
export function FooterBlock({ data }: { data: FooterData }) {
  switch (data.variant) {
    case 'multiColumn':
      return <FooterMultiColumn data={data} />;
    case 'minimal':
      return <FooterMinimal data={data} />;
    case 'simple':
    default:
      return <FooterSimple data={data} />;
  }
}

// --- Componentes Internos para Cada Variante ---
const FooterSimple = ({ data }: { data: FooterData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <footer className={cn(
      `${data.backgroundColor || 'bg-slate-800'} ${data.textColor || 'text-slate-400'} text-center`,
      {
        'p-12 text-base': isDesktop,
        'p-8 text-sm': isTablet,
        'p-6 text-sm': isMobile,
      }
    )}>
      <p className={cn(
        {
          'mb-6': isDesktop,
          'mb-4': isTablet || isMobile,
        }
      )}>
        {data.copyrightText || '© 2025 Mi Negocio. Todos los derechos reservados.'}
      </p>
      
      <div className={cn(
        "flex justify-center",
        {
          'space-x-6': isDesktop,
          'space-x-4': isTablet,
          'flex-col space-y-3 items-center': isMobile,
        }
      )}>
        {(data.socialLinks || []).map((link, index) => (
          link.url && (
            <a 
              key={index} 
              href={link.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={cn(
                "hover:text-white transition-colors",
                {
                  'text-base': isDesktop,
                  'text-sm': isTablet || isMobile,
                }
              )}
            >
              {link.platform}
            </a>
          )
        ))}
      </div>
    </footer>
  );
};

const FooterMultiColumn = ({ data }: { data: FooterData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <footer className={cn(
      `${data.backgroundColor || 'bg-slate-800'} ${data.textColor || 'text-slate-400'}`,
      {
        'p-12 text-base': isDesktop,
        'p-8 text-sm': isTablet,
        'p-6 text-sm': isMobile,
      }
    )}>
      <div className={cn(
        "mx-auto",
        {
          'max-w-6xl': isDesktop,
          'max-w-4xl': isTablet,
          'max-w-full': isMobile,
        }
      )}>
        <div className={cn(
          "gap-8",
          {
            'grid md:grid-cols-4': isDesktop,
            'grid sm:grid-cols-2 md:grid-cols-3': isTablet,
            'flex flex-col space-y-8': isMobile,
          }
        )}>
          {(data.columns || []).map((col, index) => (
            <div 
              key={index}
              className={cn(
                {
                  'text-left': isDesktop || isTablet,
                  'text-center': isMobile,
                }
              )}
            >
              <h4 className={cn(
                "font-semibold text-white mb-4",
                {
                  'text-lg': isDesktop,
            
                  'text-base': isMobile,
                }
              )}>
                {col.title}
              </h4>
              
              <ul className={cn(
                {
                  'space-y-3': isDesktop,
                  'space-y-2': isTablet || isMobile,
                }
              )}>
                {(col.links || []).map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className={cn(
                        "hover:text-white transition-colors",
                        {
                          'text-base': isDesktop,
                          'text-sm': isTablet || isMobile,
                        }
                      )}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className={cn(
          "border-t border-slate-700 text-center",
          {
            'mt-12 pt-6': isDesktop,
            'mt-8 pt-4': isTablet || isMobile,
          }
        )}>
          <p className={cn(
            {
              'text-base': isDesktop,
              'text-sm': isTablet || isMobile,
            }
          )}>
            {data.copyrightText || '© 2025 Mi Negocio. Todos los derechos reservados.'}
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterMinimal = ({ data }: { data: FooterData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <footer className={cn(
      `${data.backgroundColor || 'bg-white'} ${data.textColor || 'text-slate-500'} text-center`,
      {
        'p-6 text-sm': isDesktop,
        'p-4 text-xs': isTablet,
        'p-3 text-xs': isMobile,
      }
    )}>
      <p>
        {data.copyrightText || '© 2025 Mi Negocio. Todos los derechos reservados.'}
      </p>
    </footer>
  );
};

// --- Editor de Campos Condicional ---
export function FooterEditor({ data, updateData }: { data: FooterData, updateData: (key: keyof FooterData, value: string | SocialLink[] | FooterColumn[]) => void }) {
    
  const handleSocialLinkChange = (index: number, field: keyof SocialLink, value: string) => {
    const newLinks = [...(data.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    updateData('socialLinks', newLinks);
  };

  const handleColumnChange = (index: number, field: 'title' | 'links', value: string) => {
    const newColumns = [...(data.columns || [])];
    if (field === 'links') {
        newColumns[index] = { ...newColumns[index], links: value.split('\n') };
    } else {
        newColumns[index] = { ...newColumns[index], [field]: value };
    }
    updateData('columns', newColumns);
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm text-slate-600">Contenido</h4>
        <InputField 
          label="Texto de Copyright" 
          value={data.copyrightText} 
          onChange={(e) => updateData('copyrightText', e.target.value)} 
        />
      </div>
      
      {data.variant === 'simple' && (
        <>
            <h4 className="font-medium text-sm text-slate-600 pt-2 border-t border-slate-200">
              Redes Sociales
            </h4>
            {(data.socialLinks || []).map((link, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
                  <InputField 
                    label={`Plataforma ${index + 1}`} 
                    value={link.platform} 
                    onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)} 
                    
                  />
                  <InputField 
                    label={`URL ${index + 1}`} 
                    value={link.url} 
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)} 
                    
                  />
                </div>
            ))}
        </>
      )}

      {data.variant === 'multiColumn' && (
        <>
            <h4 className="font-medium text-sm text-slate-600 pt-2 border-t border-slate-200">
              Columnas de Enlaces
            </h4>
            {(data.columns || []).map((col, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
                    <InputField 
                      label={`Título Columna ${index + 1}`} 
                      value={col.title} 
                      onChange={(e) => handleColumnChange(index, 'title', e.target.value)} 
                    />
                    <TextareaField 
                      label="Enlaces (uno por línea)" 
                      value={(col.links || []).join('\n')} 
                      rows={4} 
                      onChange={(e) => handleColumnChange(index, 'links', e.target.value)}
                    />
                </div>
            ))}
        </>
      )}

      <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
        <ColorPalette 
          label="Color de Fondo" 
          selectedColor={data.backgroundColor} 
          onChange={(color) => updateData('backgroundColor', color)} 
        />
        <TextColorPalette 
          label="Color del Texto" 
          selectedColor={data.textColor} 
          onChange={(color) => updateData('textColor', color)} 
        />
      </div>
    </div>
  );
}