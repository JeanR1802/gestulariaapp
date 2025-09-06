// app/components/editor/blocks/CtaBlock.tsx
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';

export interface CtaData {
  variant: 'dark' | 'light' | 'split';
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundColor: string;
  titleColor: string;
  subtitleColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  buttonLink?: string;
  imageUrl?: string;
}

export function CtaBlock({ data }: { data: CtaData }) {
  switch (data.variant) {
    case 'light': return <CtaLight data={data} />;
    case 'split': return <CtaSplit data={data} />;
    default: return <CtaDark data={data} />;
  }
}

const CtaDark = ({ data }: { data: CtaData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-slate-800'} text-white text-center`,
      {
        'p-16': isDesktop,
        'p-12': isTablet,
        'p-8': isMobile,
      }
    )}>
      <h2 className={cn(
        `font-bold mb-4 ${data.titleColor || 'text-white'}`,
        {
          'text-4xl': isDesktop,
          'text-3xl': isTablet,
          'text-2xl': isMobile,
        }
      )}>
        {data.title}
      </h2>
      
      <p className={cn(
        `opacity-90 mx-auto mb-8 ${data.subtitleColor || 'text-slate-300'}`,
        {
          'text-xl leading-relaxed max-w-2xl': isDesktop,
          'text-lg leading-relaxed max-w-xl': isTablet,
          'text-base leading-relaxed max-w-sm': isMobile,
        }
      )}>
        {data.subtitle}
      </p>
      
      <a 
        href={data.buttonLink || '#'} 
        className={cn(
          `inline-block rounded-md font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-800'}`,
          {
            'px-8 py-4 text-lg': isDesktop,
            'px-6 py-3 text-base': isTablet,
            'px-6 py-3 text-sm w-full max-w-xs': isMobile,
          }
        )}
      >
        {data.buttonText}
      </a>
    </div>
  );
};

const CtaLight = ({ data }: { data: CtaData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-slate-100'} text-center rounded-lg`,
      {
        'p-16': isDesktop,
        'p-12': isTablet,
        'p-8': isMobile,
      }
    )}>
      <h2 className={cn(
        `font-bold mb-4 ${data.titleColor || 'text-slate-800'}`,
        {
          'text-4xl': isDesktop,
          'text-3xl': isTablet,
          'text-2xl': isMobile,
        }
      )}>
        {data.title}
      </h2>
      
      <p className={cn(
        `mx-auto mb-8 ${data.subtitleColor || 'text-slate-600'}`,
        {
          'text-xl leading-relaxed max-w-2xl': isDesktop,
          'text-lg leading-relaxed max-w-xl': isTablet,
          'text-base leading-relaxed max-w-sm': isMobile,
        }
      )}>
        {data.subtitle}
      </p>
      
      <a 
        href={data.buttonLink || '#'} 
        className={cn(
          `inline-block rounded-md font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`,
          {
            'px-8 py-4 text-lg': isDesktop,
            'px-6 py-3 text-base': isTablet,
            'px-6 py-3 text-sm w-full max-w-xs': isMobile,
          }
        )}
      >
        {data.buttonText}
      </a>
    </div>
  );
};

const CtaSplit = ({ data }: { data: CtaData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-white'}`,
      {
        'p-12': isDesktop,
        'p-8': isTablet,
        'p-6': isMobile,
      }
    )}>
      <div className={cn(
        "mx-auto items-center",
        {
          'max-w-6xl grid md:grid-cols-2 gap-12': isDesktop,
          'max-w-4xl grid md:grid-cols-2 gap-8': isTablet,
          'max-w-full flex flex-col space-y-6': isMobile,
        }
      )}>
        {/* Content */}
        <div className={cn(
          {
            'text-center md:text-left': isDesktop || isTablet,
            'text-center order-2': isMobile,
          }
        )}>
          <h2 className={cn(
            `font-bold mb-4 ${data.titleColor || 'text-slate-800'}`,
            {
              'text-4xl': isDesktop,
              'text-3xl': isTablet,
              'text-2xl': isMobile,
            }
          )}>
            {data.title}
          </h2>
          
          <p className={cn(
            `mb-8 ${data.subtitleColor || 'text-slate-600'}`,
            {
              'text-xl leading-relaxed': isDesktop,
              'text-lg leading-relaxed': isTablet,
              'text-base leading-relaxed': isMobile,
            }
          )}>
            {data.subtitle}
          </p>
          
          <a 
            href={data.buttonLink || '#'} 
            className={cn(
              `inline-block rounded-md font-semibold transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`,
              {
                'px-8 py-4 text-lg': isDesktop,
                'px-6 py-3 text-base': isTablet,
                'px-6 py-3 text-sm w-full max-w-xs': isMobile,
              }
            )}
          >
            {data.buttonText}
          </a>
        </div>

        {/* Image */}
        <div className={cn(
          {
            'order-1': isMobile,
          }
        )}>
          <img 
            src={data.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} 
            alt={data.title} 
            className={cn(
              "rounded-lg shadow-lg mx-auto",
              {
                'max-w-full h-auto': isDesktop || isTablet,
                'w-full max-w-sm h-48 object-cover': isMobile,
              }
            )}
          />
        </div>
      </div>
    </div>
  );
};

export function CtaEditor({ data, updateData }: { data: CtaData, updateData: (key: keyof CtaData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-slate-600">Contenido</h4>
        <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
        <TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
        <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
        {data.variant === 'split' && (<InputField label="URL de la Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />)}
      </div>
      <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
        <TextColorPalette label="Color del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
        <TextColorPalette label="Color del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />
        <ButtonColorPalette label="Estilo del Botón" selectedBgColor={data.buttonBgColor || ''} onChange={(bg, text) => { updateData('buttonBgColor', bg); updateData('buttonTextColor', text); }} />
      </div>
    </div>
  );
}