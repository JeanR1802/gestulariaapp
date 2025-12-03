'use client';
import React, { useRef, JSX } from 'react';
import { Editable } from './TextBlock';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { classToComputedColor } from '@/app/lib/color-utils';
import { BlockComponentProps } from './index';

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

// --- Lógica para manejar colores personalizados ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff', 'text-black': '#000000',
    'text-slate-50': '#f8fafc', 'text-slate-100': '#f1f5f9', 'text-slate-200': '#e2e8f0',
    'text-slate-300': '#cbd5e1', 'text-slate-400': '#94a3b8', 'text-slate-500': '#64748b',
    'text-slate-600': '#475569', 'text-slate-700': '#334155', 'text-slate-800': '#1e293b',
    'text-slate-900': '#0f172a',
    'text-gray-50': '#f9fafb', 'text-gray-100': '#f3f4f6', 'text-gray-200': '#e5e7eb',
    'text-gray-300': '#d1d5db', 'text-gray-400': '#9ca3af', 'text-gray-500': '#6b7280',
    'text-gray-600': '#4b5563', 'text-gray-700': '#374151', 'text-gray-800': '#1f2937',
    'text-gray-900': '#111827',
    'text-red-500': '#ef4444', 'text-red-600': '#dc2626', 'text-red-700': '#b91c1c',
    'text-orange-500': '#f97316', 'text-orange-600': '#ea580c', 'text-orange-700': '#c2410c',
    'text-yellow-500': '#eab308', 'text-yellow-600': '#ca8a04', 'text-yellow-700': '#a16207',
    'text-green-500': '#22c55e', 'text-green-600': '#16a34a', 'text-green-700': '#15803d',
    'text-blue-500': '#3b82f6', 'text-blue-600': '#2563eb', 'text-blue-700': '#1d4ed8',
    'text-indigo-500': '#6366f1', 'text-indigo-600': '#4f46e5', 'text-indigo-700': '#4338ca',
    'text-purple-500': '#a855f7', 'text-purple-600': '#9333ea', 'text-purple-700': '#7e22ce',
    'text-pink-500': '#ec4899', 'text-pink-600': '#db2777', 'text-pink-700': '#be185d',
  };
  if (colorValue?.startsWith('[#')) {
    return {
      className: '',
      style: { color: colorValue.slice(1, -1) },
    } as const;
  }
  const finalClass = colorValue || defaultClass;
  const mapped = colorMap[finalClass];
  if (mapped) {
    return {
      className: finalClass,
      style: { color: mapped },
    } as const;
  }
  const computed = classToComputedColor(finalClass, 'color');
  return {
    className: finalClass,
    style: { color: computed || '#334155' },
  } as const;
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  const bgMap: Record<string, string> = {
    'bg-white': '#ffffff', 'bg-black': '#000000',
    'bg-slate-50': '#f8fafc', 'bg-slate-100': '#f1f5f9', 'bg-slate-200': '#e2e8f0',
    'bg-slate-300': '#cbd5e1', 'bg-slate-400': '#94a3b8', 'bg-slate-500': '#64748b',
    'bg-slate-600': '#475569', 'bg-slate-700': '#334155', 'bg-slate-800': '#1e293b',
    'bg-slate-900': '#0f172a', 
    'bg-gray-50': '#f9fafb', 'bg-gray-100': '#f3f4f6', 'bg-gray-200': '#e5e7eb',
    'bg-gray-300': '#d1d5db', 'bg-gray-400': '#9ca3af', 'bg-gray-500': '#6b7280',
    'bg-gray-600': '#4b5563', 'bg-gray-700': '#374151', 'bg-gray-800': '#1f2937',
    'bg-gray-900': '#111827',
    'bg-zinc-50': '#fafafa', 'bg-zinc-100': '#f4f4f5', 'bg-zinc-200': '#e4e4e7',
    'bg-zinc-300': '#d4d4d8', 'bg-zinc-400': '#a1a1aa', 'bg-zinc-500': '#71717a',
    'bg-zinc-600': '#52525b', 'bg-zinc-700': '#3f3f46', 'bg-zinc-800': '#27272a',
    'bg-zinc-900': '#18181b',
    'bg-red-50': '#fef2f2', 'bg-red-100': '#fee2e2', 'bg-red-200': '#fecaca',
    'bg-red-300': '#fca5a5', 'bg-red-400': '#f87171', 'bg-red-500': '#ef4444',
    'bg-red-600': '#dc2626', 'bg-red-700': '#b91c1c', 'bg-red-800': '#991b1b',
    'bg-red-900': '#7f1d1d',
    'bg-orange-50': '#fff7ed', 'bg-orange-100': '#ffedd5', 'bg-orange-200': '#fed7aa',
    'bg-orange-300': '#fdba74', 'bg-orange-400': '#fb923c', 'bg-orange-500': '#f97316',
    'bg-orange-600': '#ea580c', 'bg-orange-700': '#c2410c', 'bg-orange-800': '#9a3412',
    'bg-orange-900': '#7c2d12',
    'bg-amber-50': '#fffbeb', 'bg-amber-100': '#fef3c7', 'bg-amber-200': '#fde68a',
    'bg-amber-300': '#fcd34d', 'bg-amber-400': '#fbbf24', 'bg-amber-500': '#f59e0b',
    'bg-amber-600': '#d97706', 'bg-amber-700': '#b45309', 'bg-amber-800': '#92400e',
    'bg-amber-900': '#78350f',
    'bg-yellow-50': '#fefce8', 'bg-yellow-100': '#fef9c3', 'bg-yellow-200': '#fef08a',
    'bg-yellow-300': '#fde047', 'bg-yellow-400': '#facc15', 'bg-yellow-500': '#eab308',
    'bg-yellow-600': '#ca8a04', 'bg-yellow-700': '#a16207', 'bg-yellow-800': '#854d0e',
    'bg-yellow-900': '#713f12',
    'bg-lime-50': '#f7fee7', 'bg-lime-100': '#ecfccb', 'bg-lime-200': '#d9f99d',
    'bg-lime-300': '#bef264', 'bg-lime-400': '#a3e635', 'bg-lime-500': '#84cc16',
    'bg-lime-600': '#65a30d', 'bg-lime-700': '#4d7c0f', 'bg-lime-800': '#3f6212',
    'bg-lime-900': '#365314',
    'bg-green-50': '#f0fdf4', 'bg-green-100': '#dcfce7', 'bg-green-200': '#bbf7d0',
    'bg-green-300': '#86efac', 'bg-green-400': '#4ade80', 'bg-green-500': '#22c55e',
    'bg-green-600': '#16a34a', 'bg-green-700': '#15803d', 'bg-green-800': '#166534',
    'bg-green-900': '#14532d',
    'bg-emerald-50': '#ecfdf5', 'bg-emerald-100': '#d1fae5', 'bg-emerald-200': '#a7f3d0',
    'bg-emerald-300': '#6ee7b7', 'bg-emerald-400': '#34d399', 'bg-emerald-500': '#10b981',
    'bg-emerald-600': '#059669', 'bg-emerald-700': '#047857', 'bg-emerald-800': '#065f46',
    'bg-emerald-900': '#064e3b',
    'bg-teal-50': '#f0fdfa', 'bg-teal-100': '#ccfbf1', 'bg-teal-200': '#99f6e4',
    'bg-teal-300': '#5eead4', 'bg-teal-400': '#2dd4bf', 'bg-teal-500': '#14b8a6',
    'bg-teal-600': '#0d9488', 'bg-teal-700': '#0f766e', 'bg-teal-800': '#115e59',
    'bg-teal-900': '#134e4a',
    'bg-cyan-50': '#ecfeff', 'bg-cyan-100': '#cffafe', 'bg-cyan-200': '#a5f3fc',
    'bg-cyan-300': '#67e8f9', 'bg-cyan-400': '#22d3ee', 'bg-cyan-500': '#06b6d4',
    'bg-cyan-600': '#0891b2', 'bg-cyan-700': '#0e7490', 'bg-cyan-800': '#155e75',
    'bg-cyan-900': '#164e63',
    'bg-sky-50': '#f0f9ff', 'bg-sky-100': '#e0f2fe', 'bg-sky-200': '#bae6fd',
    'bg-sky-300': '#7dd3fc', 'bg-sky-400': '#38bdf8', 'bg-sky-500': '#0ea5e9',
    'bg-sky-600': '#0284c7', 'bg-sky-700': '#0369a1', 'bg-sky-800': '#075985',
    'bg-sky-900': '#0c4a6e',
    'bg-blue-50': '#eff6ff', 'bg-blue-100': '#dbeafe', 'bg-blue-200': '#bfdbfe',
    'bg-blue-300': '#93c5fd', 'bg-blue-400': '#60a5fa', 'bg-blue-500': '#3b82f6',
    'bg-blue-600': '#2563eb', 'bg-blue-700': '#1d4ed8', 'bg-blue-800': '#1e40af',
    'bg-blue-900': '#1e3a8a',
    'bg-indigo-50': '#eef2ff', 'bg-indigo-100': '#e0e7ff', 'bg-indigo-200': '#c7d2fe',
    'bg-indigo-300': '#a5b4fc', 'bg-indigo-400': '#818cf8', 'bg-indigo-500': '#6366f1',
    'bg-indigo-600': '#4f46e5', 'bg-indigo-700': '#4338ca', 'bg-indigo-800': '#3730a3',
    'bg-indigo-900': '#312e81',
    'bg-violet-50': '#f5f3ff', 'bg-violet-100': '#ede9fe', 'bg-violet-200': '#ddd6fe',
    'bg-violet-300': '#c4b5fd', 'bg-violet-400': '#a78bfa', 'bg-violet-500': '#8b5cf6',
    'bg-violet-600': '#7c3aed', 'bg-violet-700': '#6d28d9', 'bg-violet-800': '#5b21b6',
    'bg-violet-900': '#4c1d95',
    'bg-purple-50': '#faf5ff', 'bg-purple-100': '#f3e8ff', 'bg-purple-200': '#e9d5ff',
    'bg-purple-300': '#d8b4fe', 'bg-purple-400': '#c084fc', 'bg-purple-500': '#a855f7',
    'bg-purple-600': '#9333ea', 'bg-purple-700': '#7e22ce', 'bg-purple-800': '#6b21a8',
    'bg-purple-900': '#581c87',
    'bg-fuchsia-50': '#fdf4ff', 'bg-fuchsia-100': '#fae8ff', 'bg-fuchsia-200': '#f5d0fe',
    'bg-fuchsia-300': '#f0abfc', 'bg-fuchsia-400': '#e879f9', 'bg-fuchsia-500': '#d946ef',
    'bg-fuchsia-600': '#c026d3', 'bg-fuchsia-700': '#a21caf', 'bg-fuchsia-800': '#86198f',
    'bg-fuchsia-900': '#701a75',
    'bg-pink-50': '#fdf2f8', 'bg-pink-100': '#fce7f3', 'bg-pink-200': '#fbcfe8',
    'bg-pink-300': '#f9a8d4', 'bg-pink-400': '#f472b6', 'bg-pink-500': '#ec4899',
    'bg-pink-600': '#db2777', 'bg-pink-700': '#be185d', 'bg-pink-800': '#9d174d',
    'bg-pink-900': '#831843',
    'bg-rose-50': '#fff1f2', 'bg-rose-100': '#ffe4e6', 'bg-rose-200': '#fecdd3',
    'bg-rose-300': '#fda4af', 'bg-rose-400': '#fb7185', 'bg-rose-500': '#f43f5e',
    'bg-rose-600': '#e11d48', 'bg-rose-700': '#be123c', 'bg-rose-800': '#9f1239',
    'bg-rose-900': '#881337',
  };
  
  if (colorValue?.startsWith('[#')) {
    return {
      className: '',
      style: { backgroundColor: colorValue.slice(1, -1) },
    } as const;
  }
  
  const finalClass = colorValue || defaultClass;
  const mapped = bgMap[finalClass];
  if (mapped) {
    return {
      className: finalClass,
      style: { backgroundColor: mapped },
    } as const;
  }
  // fallback with DOM computation if class not in map
  const computed = classToComputedColor(finalClass, 'background-color');
  return {
    className: finalClass,
    style: { backgroundColor: computed || '#ffffff' },
  } as const;
};

// --- Componente "Director" ---
export function CardsBlock({ data, isEditing, onUpdate }: BlockComponentProps<CardsData>) {
  const props = { data, isEditing, onUpdate };
  switch (data.variant) {
    case 'list':
      return <CardsList {...props} />;
    case 'imageTop':
      return <CardsImageTop {...props} />;
    default:
      return <CardsDefault {...props} />;
  }
}

// --- Utilidades de actualización inmutable ---
function updateCardArray(cards: Card[], index: number, field: keyof Card, value: string): Card[] {
  const next = [...(cards || [])];
  next[index] = { ...next[index], [field]: value } as Card;
  return next;
}

// --- Componentes Visuales ---
const CardsDefault = ({ data, isEditing, onUpdate }: BlockComponentProps<CardsData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-slate-50');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const cardBgStyles = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
  const cardTitleStyles = getStyles(data.cardTitleColor, 'text-slate-900');
  const cardDescriptionStyles = getStyles(data.cardDescriptionColor, 'text-slate-600');

  React.useEffect(() => {
    if (!isEditing) return;
    const sample = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
    console.log('🔍 CardsImageTop DEBUG - data.cardBackgroundColor =', data.cardBackgroundColor, '-> sample.backgroundColor =', sample.style?.backgroundColor);
  }, [data.cardBackgroundColor, isEditing]);

  React.useEffect(() => {
    if (!isEditing) return;
    const sample = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
    console.log('🔍 CardsList DEBUG - data.cardBackgroundColor =', data.cardBackgroundColor, '-> sample.backgroundColor =', sample.style?.backgroundColor);
  }, [data.cardBackgroundColor, isEditing]);

  // Debug: comprobar valor computado del color de fondo de tarjeta (solo en edición)
  React.useEffect(() => {
    if (!isEditing) return;
    try {
      const sample = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
      console.log('🔍 CardsDefault DEBUG - data.cardBackgroundColor =', data.cardBackgroundColor, '-> sample.backgroundColor =', sample.style?.backgroundColor);
    } catch (e) {
      console.error('🔍 CardsDefault DEBUG error computing sample background', e);
    }
  }, [data.cardBackgroundColor, isEditing]);

  const handleUpdate = (key: keyof CardsData, value: string | Card[]) => {
    if (onUpdate) onUpdate(key as string, value);
  };
  const handleCardUpdate = (index: number, field: keyof Card, value: string) => {
    handleUpdate('cards', updateCardArray(data.cards || [], index, field, value));
  };

  return (
    <div className={cn('py-16 px-4', bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-7xl mx-auto">
        <Editable
          tagName="h2"
          value={data.title}
          onUpdate={(v) => handleUpdate('title', v)}
          isEditing={isEditing}
          className={cn(
            'text-center font-bold mb-12',
            { 'text-4xl': isDesktop, 'text-3xl': isTablet, 'text-2xl': isMobile },
            titleStyles.className
          )}
          style={titleStyles.style}
        />
        <div className={cn('grid gap-8', { 'grid-cols-1 md:grid-cols-3': isDesktop || isTablet, 'grid-cols-1': isMobile })}>
          {(data.cards || []).map((card, index) => {
            const cardStyle = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
            return (
            <div 
              key={index} 
              className={cn('relative p-8 rounded-lg shadow-md text-center', cardStyle.className)} 
              style={cardStyle.style}
            >
              <div className="absolute top-2 left-2 text-xs px-2 py-1 bg-black/60 text-white rounded">
                {cardStyle.style?.backgroundColor || data.cardBackgroundColor || cardStyle.className}
              </div>
              <Editable
                tagName="span"
                value={card.icon}
                onUpdate={(v) => handleCardUpdate(index, 'icon', v)}
                isEditing={isEditing}
                className="text-4xl mb-4 block"
                style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, "Noto Emoji", sans-serif' }}
              />
              <Editable
                tagName="h3"
                value={card.title}
                onUpdate={(v) => handleCardUpdate(index, 'title', v)}
                isEditing={isEditing}
                className={cn(
                  'font-semibold mb-2',
                  { 'text-xl': isDesktop, 'text-lg': isTablet || isMobile },
                  cardTitleStyles.className
                )}
                style={cardTitleStyles.style}
              />
              <Editable
                tagName="p"
                value={card.description}
                onUpdate={(v) => handleCardUpdate(index, 'description', v)}
                isEditing={isEditing}
                className={cn(
                  { 'text-base': isDesktop || isTablet, 'text-sm': isMobile },
                  cardDescriptionStyles.className
                )}
                style={cardDescriptionStyles.style}
              />
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const CardsList = ({ data, isEditing, onUpdate }: BlockComponentProps<CardsData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-white');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const cardTitleStyles = getStyles(data.cardTitleColor, 'text-slate-900');
  const cardDescriptionStyles = getStyles(data.cardDescriptionColor, 'text-slate-600');

  const handleUpdate = (key: keyof CardsData, value: string | Card[]) => {
    if (onUpdate) onUpdate(key as string, value);
  };
  const handleCardUpdate = (index: number, field: keyof Card, value: string) => {
    handleUpdate('cards', updateCardArray(data.cards || [], index, field, value));
  };

  return (
    <div className={cn('py-16 px-4', bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-4xl mx-auto">
        <Editable
          tagName="h2"
          value={data.title}
          onUpdate={(v) => handleUpdate('title', v)}
          isEditing={isEditing}
          className={cn(
            'text-center font-bold mb-12',
            { 'text-4xl': isDesktop, 'text-3xl': isTablet, 'text-2xl': isMobile },
            titleStyles.className
          )}
          style={titleStyles.style}
        />
        <div className="space-y-8">
          {(data.cards || []).map((card, index) => (
            <div key={index} className="relative flex items-start gap-6">
              <div className="absolute top-2 left-2 text-xs px-2 py-1 bg-black/60 text-white rounded">
                {getBackgroundStyles(data.cardBackgroundColor, 'bg-white').style?.backgroundColor || data.cardBackgroundColor}
              </div>
              <Editable
                tagName="span"
                value={card.icon}
                onUpdate={(v) => handleCardUpdate(index, 'icon', v)}
                isEditing={isEditing}
                className="text-3xl mt-1"
                style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, "Noto Emoji", sans-serif' }}
              />
              <div>
                <Editable
                  tagName="h3"
                  value={card.title}
                  onUpdate={(v) => handleCardUpdate(index, 'title', v)}
                  isEditing={isEditing}
                  className={cn(
                    'font-semibold mb-1',
                    { 'text-xl': isDesktop, 'text-lg': isTablet || isMobile },
                    cardTitleStyles.className
                  )}
                  style={cardTitleStyles.style}
                />
                <Editable
                  tagName="p"
                  value={card.description}
                  onUpdate={(v) => handleCardUpdate(index, 'description', v)}
                  isEditing={isEditing}
                  className={cn(
                    { 'text-base': isDesktop || isTablet, 'text-sm': isMobile },
                    cardDescriptionStyles.className
                  )}
                  style={cardDescriptionStyles.style}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CardsImageTop = ({ data, isEditing, onUpdate }: BlockComponentProps<CardsData>) => {
  const { isMobile, isTablet, isDesktop } = usePreviewMode();
  const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-slate-50');
  const titleStyles = getStyles(data.titleColor, 'text-slate-800');
  const cardBgStyles = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
  const cardTitleStyles = getStyles(data.cardTitleColor, 'text-slate-900');
  const cardDescriptionStyles = getStyles(data.cardDescriptionColor, 'text-slate-600');

  const handleUpdate = (key: keyof CardsData, value: string | Card[]) => {
    if (onUpdate) onUpdate(key as string, value);
  };
  const handleCardUpdate = (index: number, field: keyof Card, value: string) => {
    handleUpdate('cards', updateCardArray(data.cards || [], index, field, value));
  };

  return (
    <div className={cn('py-16 px-4', bgStyles.className)} style={bgStyles.style}>
      <div className="max-w-7xl mx-auto">
        <Editable
          tagName="h2"
          value={data.title}
          onUpdate={(v) => handleUpdate('title', v)}
          isEditing={isEditing}
          className={cn(
            'text-center font-bold mb-12',
            { 'text-4xl': isDesktop, 'text-3xl': isTablet, 'text-2xl': isMobile },
            titleStyles.className
          )}
          style={titleStyles.style}
        />
        <div className={cn('grid gap-8', { 'grid-cols-1 md:grid-cols-3': isDesktop || isTablet, 'grid-cols-1': isMobile })}>
          {(data.cards || []).map((card, index) => {
            const cardStyle = getBackgroundStyles(data.cardBackgroundColor, 'bg-white');
            return (
            <div 
              key={index} 
              className={cn('relative rounded-lg shadow-md overflow-hidden', cardStyle.className)} 
              style={cardStyle.style}
            >
              <div className="absolute top-2 left-2 text-xs px-2 py-1 bg-black/60 text-white rounded">
                {cardStyle.style?.backgroundColor || data.cardBackgroundColor || cardStyle.className}
              </div>
              <img src={card.imageUrl || 'https://placehold.co/400x250/e2e8f0/64748b?text=Imagen'} alt={card.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <Editable
                  tagName="h3"
                  value={card.title}
                  onUpdate={(v) => handleCardUpdate(index, 'title', v)}
                  isEditing={isEditing}
                  className={cn(
                    'font-semibold mb-2',
                    { 'text-xl': isDesktop, 'text-lg': isTablet || isMobile },
                    cardTitleStyles.className
                  )}
                  style={cardTitleStyles.style}
                />
                <Editable
                  tagName="p"
                  value={card.description}
                  onUpdate={(v) => handleCardUpdate(index, 'description', v)}
                  isEditing={isEditing}
                  className={cn(
                    { 'text-base': isDesktop || isTablet, 'text-sm': isMobile },
                    cardDescriptionStyles.className
                  )}
                  style={cardDescriptionStyles.style}
                />
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// --- Editor de CONTENIDO (SEPARADO) ---
export function CardsContentEditor({ data, updateData }: { data: CardsData; updateData: (key: keyof CardsData, value: string | Card[]) => void }) {
  const handleCardChange = (index: number, field: keyof Card, value: string) => {
    const newCards = [...(data.cards || [])];
    newCards[index] = { ...newCards[index], [field]: value } as Card;
    updateData('cards', newCards);
  };
  const addCard = () => {
    const newCards = [...(data.cards || []), { icon: '💡', title: 'Nuevo Título', description: 'Nueva descripción.' } as Card];
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
          <button
            onClick={() => removeCard(index)}
            className="absolute top-2 right-2 w-6 h-6 bg-slate-200 text-slate-500 rounded-full hover:bg-red-100 hover:text-red-600 flex items-center justify-center"
            title="Eliminar tarjeta"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
          <h4 className="font-medium text-sm text-slate-700">Tarjeta {index + 1}</h4>
          {data.variant === 'imageTop' ? (
            <InputField label="URL de Imagen" value={card.imageUrl || ''} onChange={(e) => handleCardChange(index, 'imageUrl', e.target.value)} />
          ) : (
            <InputField label="Icono (Emoji)" value={card.icon} onChange={(e) => handleCardChange(index, 'icon', e.target.value)} />
          )}
          <InputField label="Título" value={card.title} onChange={(e) => handleCardChange(index, 'title', e.target.value)} />
          <TextareaField label="Descripción" value={card.description} rows={3} onChange={(e) => handleCardChange(index, 'description', e.target.value)} />
        </div>
      ))}
      <button className="w-full bg-slate-200 text-slate-700 py-2 px-4 rounded-md font-semibold hover:bg-slate-300 flex items-center justify-center gap-2" onClick={addCard}>
        <PlusIcon className="w-5 h-5" />
        Añadir Tarjeta
      </button>
    </div>
  );
}

// --- Editor de ESTILO (SEPARADO) ---
export function CardsStyleEditor({ data, updateData }: { data: CardsData; updateData: (key: keyof CardsData, value: string) => void }) {
  const [customSectionBgColor, setCustomSectionBgColor] = React.useState<string>(
    data.backgroundColor?.startsWith('[#') ? data.backgroundColor.slice(1, -1) : '#ffffff'
  );
  const [customSectionTitleColor, setCustomSectionTitleColor] = React.useState<string>(
    data.titleColor?.startsWith('[#') ? data.titleColor.slice(1, -1) : '#000000'
  );
  const [customCardBgColor, setCustomCardBgColor] = React.useState<string>(
    data.cardBackgroundColor?.startsWith('[#') ? data.cardBackgroundColor.slice(1, -1) : '#ffffff'
  );
  const [customCardTitleColor, setCustomCardTitleColor] = React.useState<string>(
    data.cardTitleColor?.startsWith('[#') ? data.cardTitleColor.slice(1, -1) : '#000000'
  );
  const [customCardDescColor, setCustomCardDescColor] = React.useState<string>(
    data.cardDescriptionColor?.startsWith('[#') ? data.cardDescriptionColor.slice(1, -1) : '#000000'
  );
  const isCustomSectionBg = data.backgroundColor?.startsWith('[#');
  const isCustomSectionTitle = data.titleColor?.startsWith('[#');
  const isCustomCardBg = data.cardBackgroundColor?.startsWith('[#');
  const isCustomCardTitle = data.cardTitleColor?.startsWith('[#');
  const isCustomCardDesc = data.cardDescriptionColor?.startsWith('[#');
  return (
    <div className="space-y-4">
      <div>
        <ColorPalette label="Color de Fondo de Sección" selectedColor={data.backgroundColor || ''} onChange={(color) => updateData('backgroundColor', color)} />
      </div>
      <div>
        <TextColorPalette label="Color del Título de Sección" selectedColor={data.titleColor || ''} onChange={(color) => updateData('titleColor', color)} />
      </div>
      <div className="border-t border-slate-200 pt-4 mt-4">
        <h4 className="font-medium text-sm text-slate-600 mb-3">Estilo de las Tarjetas</h4>
        <div>
          <ColorPalette label="Color de Fondo de Tarjeta" selectedColor={data.cardBackgroundColor || ''} onChange={(color) => updateData('cardBackgroundColor', color)} />
        </div>
        <div>
          <TextColorPalette label="Color de Título de Tarjeta" selectedColor={data.cardTitleColor || ''} onChange={(color) => updateData('cardTitleColor', color)} />
        </div>
        <div>
          <TextColorPalette label="Color de Descripción de Tarjeta" selectedColor={data.cardDescriptionColor || ''} onChange={(color) => updateData('cardDescriptionColor', color)} />
        </div>
      </div>
    </div>
  );
}
