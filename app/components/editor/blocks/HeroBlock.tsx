// app/components/editor/blocks/HeroBlock.tsx (RESPONSIVO)
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';

export interface HeroData {
  variant: 'default' | 'leftImage' | 'darkMinimal';
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

export function HeroBlock({ data }: { data: HeroData }) {
  switch (data.variant) {
    case 'leftImage': return <HeroLeftImage data={data} />;
    case 'darkMinimal': return <HeroDarkMinimal data={data} />;
    default: return <HeroDefault data={data} />;
  }
}

const HeroDefault = ({ data }: { data: HeroData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-slate-100'} text-center`,
      {
        'p-16 md:p-24': isDesktop,
        'p-12 md:p-20': isTablet,
        'p-8': isMobile,
      }
    )}>
      <h1 className={cn(
        `font-bold mb-6 ${data.titleColor || 'text-slate-800'}`,
        {
          'text-4xl md:text-5xl': isDesktop,
          'text-3xl md:text-4xl': isTablet,
          'text-2xl leading-tight': isMobile,
        }
      )}>
        {data.title}
      </h1>
      
      <p className={cn(
        `mb-8 mx-auto ${data.subtitleColor || 'text-slate-600'}`,
        {
          'text-xl leading-relaxed max-w-3xl': isDesktop,
          'text-lg leading-relaxed max-w-2xl': isTablet,
          'text-base leading-relaxed max-w-sm': isMobile,
        }
      )}>
        {data.subtitle}
      </p>
      
      <a 
        href={data.buttonLink || '#'} 
        className={cn(
          `inline-block font-semibold rounded-md transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`,
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

const HeroLeftImage = ({ data }: { data: HeroData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={`${data.backgroundColor || 'bg-white'}`}>
      <div className={cn(
        "mx-auto items-center gap-8",
        {
          'max-w-6xl grid md:grid-cols-2 p-12 md:p-16': isDesktop,
          'max-w-4xl grid md:grid-cols-2 p-8 md:p-12': isTablet,
          'max-w-full flex flex-col p-6': isMobile,
        }
      )}>
        {/* Text Content */}
        <div className={cn(
          {
            'text-center md:text-left': isDesktop || isTablet,
            'text-center order-2': isMobile,
          }
        )}>
          <h1 className={cn(
            `font-bold mb-6 ${data.titleColor || 'text-slate-800'}`,
            {
              'text-4xl md:text-5xl': isDesktop,
              'text-3xl md:text-4xl': isTablet,
              'text-2xl': isMobile,
            }
          )}>
            {data.title}
          </h1>
          
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
              `inline-block font-semibold rounded-md transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-blue-600'} ${data.buttonTextColor || 'text-white'}`,
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

const HeroDarkMinimal = ({ data }: { data: HeroData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.backgroundColor || 'bg-slate-900'} text-center`,
      {
        'p-20 md:p-32': isDesktop,
        'p-16 md:p-24': isTablet,
        'p-12': isMobile,
      }
    )}>
      <h1 className={cn(
        `font-bold mb-12 ${data.titleColor || 'text-white'}`,
        {
          'text-5xl md:text-6xl': isDesktop,
          'text-4xl md:text-5xl': isTablet,
          'text-3xl leading-tight': isMobile,
        }
      )}>
        {data.title}
      </h1>
      
      <a 
        href={data.buttonLink || '#'} 
        className={cn(
          `inline-block font-semibold rounded-md transition-transform hover:scale-105 ${data.buttonBgColor || 'bg-white'} ${data.buttonTextColor || 'text-slate-800'}`,
          {
            'px-10 py-5 text-xl': isDesktop,
            'px-8 py-4 text-lg': isTablet,
            'px-6 py-3 text-base w-full max-w-xs': isMobile,
          }
        )}
      >
        {data.buttonText}
      </a>
    </div>
  );
};

export function HeroEditor({ data, updateData }: { data: HeroData, updateData: (key: keyof HeroData, value: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <h4 className="font-medium text-sm text-slate-600">Contenido</h4>
        <InputField label="Título Principal" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
        {data.variant !== 'darkMinimal' && (<TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />)}
        <InputField label="Texto del Botón" value={data.buttonText} onChange={(e) => updateData('buttonText', e.target.value)} />
        {data.variant === 'leftImage' && (<InputField label="URL de la Imagen" value={data.imageUrl || ''} onChange={(e) => updateData('imageUrl', e.target.value)} />)}
      </div>

      <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
        <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
        <TextColorPalette label="Color de Texto del Título" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
        {data.variant !== 'darkMinimal' && (
          <TextColorPalette label="Color de Texto del Subtítulo" selectedColor={data.subtitleColor} onChange={(color) => updateData('subtitleColor', color)} />
        )}
        <ButtonColorPalette 
          label="Estilo del Botón"
          selectedBgColor={data.buttonBgColor}
          onChange={(bg, text) => {
            updateData('buttonBgColor', bg);
            updateData('buttonTextColor', text);
          }}
        />
      </div>
    </div>
  );
}