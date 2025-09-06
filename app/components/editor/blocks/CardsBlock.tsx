// app/components/editor/blocks/CardsBlock.tsx
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

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

const CardsDefault = ({ data }: { data: CardsData }) => (
  <div className={`${data.sectionBackgroundColor || 'bg-slate-50'} py-12 px-4`}>
    <div className="max-w-5xl mx-auto">
      <h2 className={`text-3xl font-bold text-center mb-12 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {(data.cards || []).map((card, index) => (
          <div key={index} className={`text-center p-6 rounded-lg shadow-sm ring-1 ring-slate-100 ${data.cardBackgroundColor || 'bg-white'}`}>
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className={`text-xl font-semibold mb-2 ${data.titleColor || 'text-slate-800'}`}>{card.title}</h3>
            <p className={`${data.textColor || 'text-slate-600'} text-sm`}>{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CardsList = ({ data }: { data: CardsData }) => (
  <div className={`${data.sectionBackgroundColor || 'bg-white'} py-12 px-4`}>
      <div className="max-w-3xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
          <div className="space-y-8">
              {(data.cards || []).map((card, index) => (
                  <div key={index} className="flex items-start gap-6">
                      <div className="text-3xl mt-1">{card.icon}</div>
                      <div>
                          <h3 className={`text-xl font-semibold mb-2 ${data.titleColor || 'text-slate-800'}`}>{card.title}</h3>
                          <p className={`${data.textColor || 'text-slate-600'}`}>{card.description}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  </div>
);

const CardsImageTop = ({ data }: { data: CardsData }) => (
  <div className={`${data.sectionBackgroundColor || 'bg-slate-50'} py-12 px-4`}>
      <div className="max-w-5xl mx-auto">
          <h2 className={`text-3xl font-bold text-center mb-12 ${data.titleColor || 'text-slate-800'}`}>{data.title}</h2>
          <div className="grid md:grid-cols-3 gap-8">
              {(data.cards || []).map((card, index) => (
                  <div key={index} className={`${data.cardBackgroundColor || 'bg-white'} rounded-lg shadow-sm ring-1 ring-slate-100 overflow-hidden`}>
                      <img src={card.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={card.title} className="w-full h-40 object-cover" />
                      <div className="p-6 text-center">
                          <h3 className={`text-xl font-semibold mb-2 ${data.titleColor || 'text-slate-800'}`}>{card.title}</h3>
                          <p className={`${data.textColor || 'text-slate-600'} text-sm`}>{card.description}</p>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  </div>
);

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