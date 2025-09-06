// app/components/editor/blocks/CardsBlock.tsx
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';

interface Card {
  icon: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface CardsData {
  variant: 'default' | 'list' | 'imageTop';
  title: string;
  cards: Card[];
  sectionBackgroundColor: string;
  cardBackgroundColor: string;
  titleColor: string;
  textColor: string;
}

export function CardsBlock({ data }: { data: CardsData }) {
  switch (data.variant) {
    case 'list': return <CardsList data={data} />;
    case 'imageTop': return <CardsImageTop data={data} />;
    default: return <CardsDefault data={data} />;
  }
}

const CardsDefault = ({ data }: { data: CardsData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.sectionBackgroundColor || 'bg-slate-50'}`,
      {
        'py-16 px-8': isDesktop,
        'py-12 px-6': isTablet,
        'py-8 px-4': isMobile,
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
        <h2 className={cn(
          `text-center font-bold ${data.titleColor || 'text-slate-800'}`,
          {
            'text-4xl mb-16': isDesktop,
            'text-3xl mb-12': isTablet,
            'text-2xl mb-8': isMobile,
          }
        )}>
          {data.title}
        </h2>
        
        <div className={cn(
          "gap-8",
          {
            'grid md:grid-cols-3': isDesktop,
            'grid sm:grid-cols-2 md:grid-cols-3': isTablet,
            'flex flex-col space-y-6': isMobile,
          }
        )}>
          {(data.cards || []).map((card, index) => (
            <div 
              key={index} 
              className={cn(
                `text-center rounded-lg shadow-sm ring-1 ring-slate-100 ${data.cardBackgroundColor || 'bg-white'}`,
                {
                  'p-8': isDesktop,
                 
                  'p-6': isMobile,
                }
              )}
            >
              <div className={cn(
                "mb-6",
                {
                  'text-5xl': isDesktop,
                  'text-4xl': isTablet,
                  'text-3xl': isMobile,
                }
              )}>
                {card.icon}
              </div>
              
              <h3 className={cn(
                `font-semibold mb-4 ${data.titleColor || 'text-slate-800'}`,
                {
                  'text-2xl': isDesktop,
                  'text-xl': isTablet,
                  'text-lg': isMobile,
                }
              )}>
                {card.title}
              </h3>
              
              <p className={cn(
                `${data.textColor || 'text-slate-600'}`,
                {
                  'text-base leading-relaxed': isDesktop,
                  
                  'text-sm leading-relaxed': isMobile,
                }
              )}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CardsList = ({ data }: { data: CardsData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.sectionBackgroundColor || 'bg-white'}`,
      {
        'py-16 px-8': isDesktop,
        'py-12 px-6': isTablet,
        'py-8 px-4': isMobile,
      }
    )}>
      <div className={cn(
        "mx-auto",
        {
          'max-w-4xl': isDesktop,
          'max-w-3xl': isTablet,
          'max-w-full': isMobile,
        }
      )}>
        <h2 className={cn(
          `text-center font-bold ${data.titleColor || 'text-slate-800'}`,
          {
            'text-4xl mb-16': isDesktop,
            'text-3xl mb-12': isTablet,
            'text-2xl mb-8': isMobile,
          }
        )}>
          {data.title}
        </h2>
        
        <div className={cn(
          {
            'space-y-10': isDesktop,
            'space-y-8': isTablet,
            'space-y-6': isMobile,
          }
        )}>
          {(data.cards || []).map((card, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-start",
                {
                  'gap-8': isDesktop,
                  'gap-6': isTablet,
                  'gap-4 flex-col text-center': isMobile,
                }
              )}
            >
              <div className={cn(
                "mt-1",
                {
                  'text-4xl': isDesktop,
                 
                  'text-3xl': isMobile,
                }
              )}>
                {card.icon}
              </div>
              
              <div className={cn(
                {
                  'flex-1': isDesktop || isTablet,
                  'w-full': isMobile,
                }
              )}>
                <h3 className={cn(
                  `font-semibold mb-3 ${data.titleColor || 'text-slate-800'}`,
                  {
                    'text-2xl': isDesktop,
                    'text-xl': isTablet,
                    'text-lg': isMobile,
                  }
                )}>
                  {card.title}
                </h3>
                
                <p className={cn(
                  `${data.textColor || 'text-slate-600'}`,
                  {
                    'text-lg leading-relaxed': isDesktop,
                    'text-base leading-relaxed': isTablet,
                    'text-sm leading-relaxed': isMobile,
                  }
                )}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CardsImageTop = ({ data }: { data: CardsData }) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  
  return (
    <div className={cn(
      `${data.sectionBackgroundColor || 'bg-slate-50'}`,
      {
        'py-16 px-8': isDesktop,
        'py-12 px-6': isTablet,
        'py-8 px-4': isMobile,
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
        <h2 className={cn(
          `text-center font-bold ${data.titleColor || 'text-slate-800'}`,
          {
            'text-4xl mb-16': isDesktop,
            'text-3xl mb-12': isTablet,
            'text-2xl mb-8': isMobile,
          }
        )}>
          {data.title}
        </h2>
        
        <div className={cn(
          "gap-8",
          {
            'grid md:grid-cols-3': isDesktop,
            'grid sm:grid-cols-2 md:grid-cols-3': isTablet,
            'flex flex-col space-y-6': isMobile,
          }
        )}>
          {(data.cards || []).map((card, index) => (
            <div 
              key={index} 
              className={cn(
                `${data.cardBackgroundColor || 'bg-white'} rounded-lg shadow-sm ring-1 ring-slate-100 overflow-hidden`,
                {
                  '': isDesktop || isTablet,
                  'max-w-sm mx-auto': isMobile,
                }
              )}
            >
              <img 
                src={card.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} 
                alt={card.title} 
                className={cn(
                  "w-full object-cover",
                  {
                    'h-48': isDesktop,
                    'h-40': isTablet,
                    'h-32': isMobile,
                  }
                )}
              />
              
              <div className={cn(
                "text-center",
                {
                  'p-8': isDesktop,
                  'p-6': isTablet,
                  'p-4': isMobile,
                }
              )}>
                <h3 className={cn(
                  `font-semibold mb-3 ${data.titleColor || 'text-slate-800'}`,
                  {
                    'text-2xl': isDesktop,
                    'text-xl': isTablet,
                    'text-lg': isMobile,
                  }
                )}>
                  {card.title}
                </h3>
                
                <p className={cn(
                  `${data.textColor || 'text-slate-600'}`,
                  {
                    'text-base leading-relaxed': isDesktop,
                   
                    'text-sm leading-relaxed': isMobile,
                  }
                )}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function CardsEditor({ data, updateData }: { data: CardsData, updateData: (key: keyof CardsData, value: string | Card[]) => void }) {
  const updateCardData = (cardIndex: number, key: keyof Card, value: string) => {
    const newCards = [...(data.cards || [])];
    newCards[cardIndex] = { ...newCards[cardIndex], [key]: value };
    updateData('cards', newCards);
  };

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium text-sm text-slate-600">Contenido General</h4>
        <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      </div>
        {(data.cards || []).map((card, index) => (
          <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50 mt-4">
            <h4 className="font-medium text-sm text-slate-600">Tarjeta {index + 1}</h4>
            {data.variant !== 'imageTop' && (<InputField label="Icono (Emoji)" value={card.icon} onChange={(e) => updateCardData(index, 'icon', e.target.value)} />)}
            {data.variant === 'imageTop' && (<InputField label="URL de la Imagen" value={card.imageUrl || ''} onChange={(e) => updateCardData(index, 'imageUrl', e.target.value)} />)}
            <InputField label="Título de la Tarjeta" value={card.title} onChange={(e) => updateCardData(index, 'title', e.target.value)} />
            <TextareaField label="Descripción" value={card.description} onChange={(e) => updateCardData(index, 'description', e.target.value)} />
          </div>
        ))}
       <div className="border-t border-slate-200 pt-4 space-y-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño General</h4>
        <ColorPalette label="Color de Fondo de Sección" selectedColor={data.sectionBackgroundColor} onChange={(color) => updateData('sectionBackgroundColor', color)} />
        {data.variant !== 'list' && <ColorPalette label="Color de Fondo de Tarjeta" selectedColor={data.cardBackgroundColor} onChange={(color) => updateData('cardBackgroundColor', color)} />}
        <TextColorPalette label="Color de Títulos" selectedColor={data.titleColor} onChange={(color) => updateData('titleColor', color)} />
        <TextColorPalette label="Color del Texto" selectedColor={data.textColor} onChange={(color) => updateData('textColor', color)} />
      </div>
    </div>
  );
}