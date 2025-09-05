// Archivo: app/components/editor/blocks/CardsBlock.tsx (ACTUALIZADO)
import React from 'react';
import { InputField, TextareaField } from './InputField';

// 1. Actualizamos la interfaz para que cada tarjeta pueda tener una imagen
interface Card {
  icon: string;
  title: string;
  description: string;
  imageUrl?: string; // Nuevo campo opcional para la imagen
}

export interface CardsData {
  variant: 'default' | 'list' | 'imageTop';
  title: string;
  cards: Card[];
}

// 2. Componente "director" que elige qué diseño de tarjetas mostrar
export function CardsBlock({ data }: { data: CardsData }) {
  switch (data.variant) {
    case 'list':
      return <CardsList data={data} />;
    case 'imageTop':
      return <CardsImageTop data={data} />;
    case 'default':
    default:
      return <CardsDefault data={data} />;
  }
}

// --- Componentes internos para cada variante ---
const CardsDefault = ({ data }: { data: CardsData }) => (
  <div className="bg-slate-50 py-12 px-4">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">{data.title}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {(data.cards || []).map((card, index) => (
          <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm ring-1 ring-slate-100">
            <div className="text-4xl mb-4">{card.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-slate-800">{card.title}</h3>
            <p className="text-slate-600 text-sm">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const CardsList = ({ data }: { data: CardsData }) => (
    <div className="bg-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">{data.title}</h2>
            <div className="space-y-8">
                {(data.cards || []).map((card, index) => (
                    <div key={index} className="flex items-start gap-6">
                        <div className="text-3xl mt-1">{card.icon}</div>
                        <div>
                            <h3 className="text-xl font-semibold mb-2 text-slate-800">{card.title}</h3>
                            <p className="text-slate-600">{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CardsImageTop = ({ data }: { data: CardsData }) => (
    <div className="bg-slate-50 py-12 px-4">
        <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">{data.title}</h2>
            <div className="grid md:grid-cols-3 gap-8">
                {(data.cards || []).map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm ring-1 ring-slate-100 overflow-hidden">
                        <img src={card.imageUrl || 'https://placehold.co/600x400/e2e8f0/64748b?text=Imagen'} alt={card.title} className="w-full h-40 object-cover" />
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-semibold mb-2 text-slate-800">{card.title}</h3>
                            <p className="text-slate-600 text-sm">{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


// 3. El editor ahora muestra campos condicionales
export function CardsEditor({ data, updateData }: { data: CardsData, updateData: (key: keyof CardsData, value: string | Card[]) => void }) {
  const updateCardData = (cardIndex: number, key: keyof Card, value: string) => {
    const newCards = [...(data.cards || [])];
    newCards[cardIndex] = { ...newCards[cardIndex], [key]: value };
    updateData('cards', newCards);
  };

  return (
    <div className="space-y-4">
      <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
      {(data.cards || []).map((card, index) => (
        <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
          <h4 className="font-medium text-sm text-slate-600">Tarjeta {index + 1}</h4>
          {data.variant !== 'imageTop' && (
            <InputField label="Icono (Emoji)" value={card.icon} onChange={(e) => updateCardData(index, 'icon', e.target.value)} />
          )}
          {data.variant === 'imageTop' && (
            <InputField label="URL de la Imagen" value={card.imageUrl || ''} onChange={(e) => updateCardData(index, 'imageUrl', e.target.value)} />
          )}
          <InputField label="Título de la Tarjeta" value={card.title} onChange={(e) => updateCardData(index, 'title', e.target.value)} />
          <TextareaField label="Descripción" value={card.description} onChange={(e) => updateCardData(index, 'description', e.target.value)} />
        </div>
      ))}
    </div>
  );
}