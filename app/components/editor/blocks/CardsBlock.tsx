// Reemplaza el contenido de app/components/editor/blocks/CardsBlock.tsx
'use client';
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';

// --- Interfaces de Datos ---
export interface Card {
  icon: string;
  title: string;
  description: string;
  imageUrl?: string;
}
export interface CardsData {
  variant: 'default' | 'list' | 'imageTop';
  title: string;
  cards: Card[];
  backgroundColor: string;
  titleColor: string;
  cardBackgroundColor: string;
  cardTitleColor: string;
  cardDescriptionColor: string;
}

// --- Componente "Director" ---
export function CardsBlock({ data }: { data: CardsData }) {
    switch(data.variant) {
        case 'list': return <CardsList data={data} />;
        case 'imageTop': return <CardsImageTop data={data} />;
        default: return <CardsDefault data={data} />;
    }
}

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) {
    return {
      className: '',
      style: { color: colorValue.slice(1, -1) }
    };
  }
  return {
    className: colorValue || defaultClass,
    style: {}
  };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (colorValue?.startsWith('[#')) {
    return {
      className: '',
      style: { backgroundColor: colorValue.slice(1, -1) }
    };
  }
  return {
    className: colorValue || defaultClass,
    style: {}
  };
};

// --- Componentes Visuales ---
const CardsDefault = ({ data }: { data: CardsData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();
    const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-slate-50');
    const titleStyles = getStyles(data.titleColor, 'text-slate-800');
    const cardBgStyles = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
    const cardTitleStyles = getStyles(data.cardTitleColor, 'text-slate-900');
    const cardDescriptionStyles = getStyles(data.cardDescriptionColor, 'text-slate-600');

    return (
        <div className={cn("py-16 px-4", bgStyles.className)} style={bgStyles.style}>
            <div className="max-w-7xl mx-auto">
                <h2 className={cn("text-center font-bold mb-12", { "text-4xl": isDesktop, "text-3xl": isTablet, "text-2xl": isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
                <div className={cn("grid gap-8", { "grid-cols-1 md:grid-cols-3": isDesktop || isTablet, "grid-cols-1": isMobile })}>
                    {(data.cards || []).map((card, index) => (
                        <div key={index} className={cn("p-8 rounded-lg shadow-md text-center", cardBgStyles.className)} style={cardBgStyles.style}>
                            <div className="text-4xl mb-4">{card.icon}</div>
                            <h3 className={cn("font-semibold mb-2", { "text-xl": isDesktop, "text-lg": isTablet || isMobile }, cardTitleStyles.className)} style={cardTitleStyles.style}>{card.title}</h3>
                            <p className={cn({ "text-base": isDesktop || isTablet, "text-sm": isMobile }, cardDescriptionStyles.className)} style={cardDescriptionStyles.style}>{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const CardsList = ({ data }: { data: CardsData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();
    const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-white');
    const titleStyles = getStyles(data.titleColor, 'text-slate-800');
    const cardTitleStyles = getStyles(data.cardTitleColor, 'text-slate-900');
    const cardDescriptionStyles = getStyles(data.cardDescriptionColor, 'text-slate-600');

    return (
        <div className={cn("py-16 px-4", bgStyles.className)} style={bgStyles.style}>
            <div className="max-w-4xl mx-auto">
                <h2 className={cn("text-center font-bold mb-12", { "text-4xl": isDesktop, "text-3xl": isTablet, "text-2xl": isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
                <div className="space-y-8">
                    {(data.cards || []).map((card, index) => (
                        <div key={index} className="flex items-start gap-6">
                            <div className="text-3xl mt-1">{card.icon}</div>
                            <div>
                                <h3 className={cn("font-semibold mb-1", { "text-xl": isDesktop, "text-lg": isTablet || isMobile }, cardTitleStyles.className)} style={cardTitleStyles.style}>{card.title}</h3>
                                <p className={cn({ "text-base": isDesktop || isTablet, "text-sm": isMobile }, cardDescriptionStyles.className)} style={cardDescriptionStyles.style}>{card.description}</p>
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
    const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-slate-50');
    const titleStyles = getStyles(data.titleColor, 'text-slate-800');
    const cardBgStyles = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
    const cardTitleStyles = getStyles(data.cardTitleColor, 'text-slate-900');
    const cardDescriptionStyles = getStyles(data.cardDescriptionColor, 'text-slate-600');

    return (
        <div className={cn("py-16 px-4", bgStyles.className)} style={bgStyles.style}>
            <div className="max-w-7xl mx-auto">
                <h2 className={cn("text-center font-bold mb-12", { "text-4xl": isDesktop, "text-3xl": isTablet, "text-2xl": isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
                <div className={cn("grid gap-8", { "grid-cols-1 md:grid-cols-3": isDesktop || isTablet, "grid-cols-1": isMobile })}>
                    {(data.cards || []).map((card, index) => (
                        <div key={index} className={cn("rounded-lg shadow-md overflow-hidden", cardBgStyles.className)} style={cardBgStyles.style}>
                            <img src={card.imageUrl || 'https://placehold.co/400x250/e2e8f0/64748b?text=Imagen'} alt={card.title} className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className={cn("font-semibold mb-2", { "text-xl": isDesktop, "text-lg": isTablet || isMobile }, cardTitleStyles.className)} style={cardTitleStyles.style}>{card.title}</h3>
                                <p className={cn({ "text-base": isDesktop || isTablet, "text-sm": isMobile }, cardDescriptionStyles.className)} style={cardDescriptionStyles.style}>{card.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Editor de CONTENIDO (SEPARADO) ---
export function CardsContentEditor({ data, updateData }: { data: CardsData, updateData: (key: keyof CardsData, value: string | Card[]) => void }) {
    const handleCardChange = (index: number, field: keyof Card, value: string) => {
        const newCards = [...(data.cards || [])];
        newCards[index] = { ...newCards[index], [field]: value };
        updateData('cards', newCards);
    };
    const addCard = () => {
        const newCards = [...(data.cards || []), { icon: '💡', title: 'Nuevo Título', description: 'Nueva descripción.' }];
        updateData('cards', newCards);
    };
    const removeCard = (index: number) => {
        const newCards = (data.cards || []).filter((_, i) => i !== index);
        updateData('cards', newCards);
    };

    return (
        <div className="space-y-4">
            <InputField label="Título de la Sección" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
            {(data.cards || []).map((card, index) => (
                <div key={index} className="border p-3 rounded-lg bg-slate-50 relative space-y-3">
                    <button onClick={() => removeCard(index)} className="absolute top-2 right-2 w-6 h-6 bg-slate-200 text-slate-500 rounded-full hover:bg-red-100 hover:text-red-600 flex items-center justify-center" title="Eliminar tarjeta"><XMarkIcon className="w-4 h-4" /></button>
                    <h4 className="font-medium text-sm text-slate-700">Tarjeta {index + 1}</h4>
                    {data.variant === 'imageTop' ? 
                        <InputField label="URL de Imagen" value={card.imageUrl || ''} onChange={(e) => handleCardChange(index, 'imageUrl', e.target.value)} /> : 
                        <InputField label="Icono (Emoji)" value={card.icon} onChange={(e) => handleCardChange(index, 'icon', e.target.value)} />
                    }
                    <InputField label="Título" value={card.title} onChange={(e) => handleCardChange(index, 'title', e.target.value)} />
                    <TextareaField label="Descripción" value={card.description} rows={3} onChange={(e) => handleCardChange(index, 'description', e.target.value)} />
                </div>
            ))}
            <button onClick={addCard} className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2"><PlusIcon className="w-5 h-5" />Añadir Tarjeta</button>
        </div>
    );
}

// --- Editor de ESTILO (SEPARADO) ---
export function CardsStyleEditor({ data, updateData }: { data: CardsData, updateData: (key: keyof CardsData, value: string) => void }) {
    const [customSectionBgColor, setCustomSectionBgColor] = React.useState<string>(data.backgroundColor?.startsWith('[#') ? data.backgroundColor.slice(2, -1) : '#ffffff');
    const [customSectionTitleColor, setCustomSectionTitleColor] = React.useState<string>(data.titleColor?.startsWith('[#') ? data.titleColor.slice(2, -1) : '#000000');
    const [customCardBgColor, setCustomCardBgColor] = React.useState<string>(data.cardBackgroundColor?.startsWith('[#') ? data.cardBackgroundColor.slice(2, -1) : '#ffffff');
    const [customCardTitleColor, setCustomCardTitleColor] = React.useState<string>(data.cardTitleColor?.startsWith('[#') ? data.cardTitleColor.slice(2, -1) : '#000000');
    const [customCardDescColor, setCustomCardDescColor] = React.useState<string>(data.cardDescriptionColor?.startsWith('[#') ? data.cardDescriptionColor.slice(2, -1) : '#000000');
    const isCustomSectionBg = data.backgroundColor?.startsWith('[#');
    const isCustomSectionTitle = data.titleColor?.startsWith('[#');
    const isCustomCardBg = data.cardBackgroundColor?.startsWith('[#');
    const isCustomCardTitle = data.cardTitleColor?.startsWith('[#');
    const isCustomCardDesc = data.cardDescriptionColor?.startsWith('[#');
    return (
        <div className="space-y-4">
            <div>
                <ColorPalette label="Color de Fondo de Sección" selectedColor={isCustomSectionBg ? '' : data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
                <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-slate-700">Fondo sección personalizado:</label>
                    <input
                        type="color"
                        value={customSectionBgColor}
                        onChange={e => {
                            setCustomSectionBgColor(e.target.value);
                            updateData('backgroundColor', `[${e.target.value}]`);
                        }}
                        className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                        title="Elegir color personalizado de fondo de sección"
                    />
                </div>
            </div>
            <div>
                <TextColorPalette label="Color del Título de Sección" selectedColor={isCustomSectionTitle ? '' : data.titleColor} onChange={(color) => updateData('titleColor', color)} />
                <div className="flex items-center gap-2 mt-2">
                    <label className="text-sm text-slate-700">Título sección personalizado:</label>
                    <input
                        type="color"
                        value={customSectionTitleColor}
                        onChange={e => {
                            setCustomSectionTitleColor(e.target.value);
                            updateData('titleColor', `[${e.target.value}]`);
                        }}
                        className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                        title="Elegir color personalizado de título de sección"
                    />
                </div>
            </div>
            <div className="border-t border-slate-200 pt-4 mt-4">
                <h4 className="font-medium text-sm text-slate-600 mb-3">Estilo de las Tarjetas</h4>
                <div>
                    <ColorPalette label="Color de Fondo de Tarjeta" selectedColor={isCustomCardBg ? '' : data.cardBackgroundColor} onChange={(color) => updateData('cardBackgroundColor', color)} />
                    <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm text-slate-700">Fondo tarjeta personalizado:</label>
                        <input
                            type="color"
                            value={customCardBgColor}
                            onChange={e => {
                                setCustomCardBgColor(e.target.value);
                                updateData('cardBackgroundColor', `[${e.target.value}]`);
                            }}
                            className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                            title="Elegir color personalizado de fondo de tarjeta"
                        />
                    </div>
                </div>
                <div>
                    <TextColorPalette label="Color de Título de Tarjeta" selectedColor={isCustomCardTitle ? '' : data.cardTitleColor} onChange={(color) => updateData('cardTitleColor', color)} />
                    <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm text-slate-700">Título tarjeta personalizado:</label>
                        <input
                            type="color"
                            value={customCardTitleColor}
                            onChange={e => {
                                setCustomCardTitleColor(e.target.value);
                                updateData('cardTitleColor', `[${e.target.value}]`);
                            }}
                            className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                            title="Elegir color personalizado de título de tarjeta"
                        />
                    </div>
                </div>
                <div>
                    <TextColorPalette label="Color de Descripción de Tarjeta" selectedColor={isCustomCardDesc ? '' : data.cardDescriptionColor} onChange={(color) => updateData('cardDescriptionColor', color)} />
                    <div className="flex items-center gap-2 mt-2">
                        <label className="text-sm text-slate-700">Descripción tarjeta personalizada:</label>
                        <input
                            type="color"
                            value={customCardDescColor}
                            onChange={e => {
                                setCustomCardDescColor(e.target.value);
                                updateData('cardDescriptionColor', `[${e.target.value}]`);
                            }}
                            className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
                            title="Elegir color personalizado de descripción de tarjeta"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}