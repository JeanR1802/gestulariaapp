import React from 'react';
import { InputField, TextareaField } from './InputField';

// --- Tipos de Datos Específicos ---
interface Card {
  icon: string;
  title: string;
  description: string;
}

export interface CardsData {
  title: string;
  cards: Card[];
}

// --- Componente Visual ---
export function CardsBlock({ data }: { data: CardsData }) {
  return (
    <div className="bg-slate-50 py-12 px-4 rounded-md">
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
  );
}

// --- Formulario de Edición ---
export function CardsEditor({ data, updateData }: { data: CardsData, updateData: (key: string, value: any) => void }) {
  
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
          <InputField label="Icono (Emoji)" value={card.icon} onChange={(e) => updateCardData(index, 'icon', e.target.value)} />
          <InputField label="Título de la Tarjeta" value={card.title} onChange={(e) => updateCardData(index, 'title', e.target.value)} />
          <TextareaField label="Descripción de la Tarjeta" value={card.description} onChange={(e) => updateCardData(index, 'description', e.target.value)} />
        </div>
      ))}
    </div>
  );
}