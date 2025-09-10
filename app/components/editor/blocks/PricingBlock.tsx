// Reemplaza el contenido de app/components/editor/blocks/PricingBlock.tsx
'use client';
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { XMarkIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { ColorPalette } from '../controls/ColorPalette';
import { TextColorPalette } from '../controls/TextColorPalette';
import { ButtonColorPalette } from '../controls/ButtonColorPalette';

// --- Interfaces de Datos ---
export interface PricingPlan {
    name: string;
    price: string;
    frequency: string;
    features: string[];
    buttonText: string;
    featured?: boolean;
}
export interface PricingData {
    variant: 'columns' | 'list' | 'simple';
    title: string;
    subtitle: string;
    plans: PricingPlan[];
    backgroundColor: string;
    titleColor: string;
    subtitleColor: string;
    cardColor: string;
    featuredCardColor: string;
    planNameColor: string;
    priceColor: string;
    frequencyColor: string;
    featureTextColor: string;
    buttonBgColor: string;
    buttonTextColor: string;
    featuredButtonBgColor: string;
    featuredButtonTextColor: string;
}

// --- Componente "Director" y Lógica ---
export function PricingBlock({ data }: { data: PricingData }) {
    switch (data.variant) {
        case 'list': return <PricingList data={data} />;
        case 'simple': return <PricingSimple data={data} />;
        default: return <PricingColumns data={data} />;
    }
}

// --- Helpers de color ---
const getStyles = (colorValue: string | undefined, defaultClass: string) => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { color: colorValue.slice(1, -1) } as React.CSSProperties };
  }
  return { className: colorValue || defaultClass, style: {} as React.CSSProperties };
};

const getBackgroundStyles = (colorValue: string | undefined, defaultClass = 'bg-white') => {
  if (colorValue?.startsWith('[#')) {
    return { className: '', style: { backgroundColor: colorValue.slice(1, -1) } as React.CSSProperties };
  }
  return { className: colorValue || defaultClass, style: {} as React.CSSProperties };
};

const getButtonStyles = (bgColor: string | undefined, textColor: string | undefined, defaultBg: string, defaultText: string) => {
    const isCustomBg = bgColor?.startsWith('[#');
    const isCustomText = textColor?.startsWith('[#');
    const style: React.CSSProperties = {};
    if (isCustomBg && bgColor) style.backgroundColor = bgColor.slice(1, -1);
    if (isCustomText && textColor) style.color = textColor.slice(1, -1);

    return {
        className: cn(!isCustomBg ? bgColor || defaultBg : '', !isCustomText ? textColor || defaultText : ''),
        style,
    };
};

// --- Componentes Visuales ---
const PricingColumns = ({ data }: { data: PricingData }) => {
    const { isMobile, isTablet, isDesktop } = usePreviewMode();
    const bgStyles = getBackgroundStyles(data.backgroundColor, 'bg-gray-50');
    const titleStyles = getStyles(data.titleColor, 'text-slate-800');
    const subtitleStyles = getStyles(data.subtitleColor, 'text-slate-600');
    
    return (
        <div className={cn("py-16 px-4", bgStyles.className)} style={bgStyles.style}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className={cn("font-bold", { "text-4xl": isDesktop, "text-3xl": isTablet, "text-2xl": isMobile }, titleStyles.className)} style={titleStyles.style}>{data.title}</h2>
                    <p className={cn("mt-4 mx-auto max-w-2xl", { "text-lg": isDesktop, "text-base": isTablet || isMobile }, subtitleStyles.className)} style={subtitleStyles.style}>{data.subtitle}</p>
                </div>
                <div className={cn("grid gap-8", { "grid-cols-1 lg:grid-cols-3": isDesktop, "grid-cols-1 md:grid-cols-2": isTablet, "grid-cols-1": isMobile })}>
                    {(data.plans || []).map((plan, index) => {
                        const cardBg = getBackgroundStyles(plan.featured ? data.featuredCardColor : data.cardColor, plan.featured ? 'bg-slate-800' : 'bg-white');
                        const nameStyles = getStyles(data.planNameColor, plan.featured ? 'text-white' : 'text-slate-900');
                        const priceStyles = getStyles(data.priceColor, plan.featured ? 'text-white' : 'text-slate-900');
                        const frequencyStyles = getStyles(data.frequencyColor, plan.featured ? 'text-slate-400' : 'text-slate-500');
                        const featureStyles = getStyles(data.featureTextColor, plan.featured ? 'text-slate-300' : 'text-slate-600');
                        const buttonStyles = getButtonStyles(
                            plan.featured ? data.featuredButtonBgColor : data.buttonBgColor,
                            plan.featured ? data.featuredButtonTextColor : data.buttonTextColor,
                            plan.featured ? 'bg-white' : 'bg-blue-600',
                            plan.featured ? 'text-blue-600' : 'text-white'
                        );

                        return (
                            <div key={index} className={cn("rounded-2xl p-8 shadow-lg border flex flex-col", cardBg.className, { 'border-blue-500 ring-2 ring-blue-500': plan.featured, 'border-slate-200': !plan.featured })} style={cardBg.style}>
                                <h3 className={cn("text-lg font-semibold", nameStyles.className)} style={nameStyles.style}>{plan.name}</h3>
                                <div className="mt-4 flex items-baseline">
                                    <span className={cn("text-4xl font-bold tracking-tight", priceStyles.className)} style={priceStyles.style}>{plan.price}</span>
                                    <span className={cn("ml-1 text-sm font-semibold", frequencyStyles.className)} style={frequencyStyles.style}>{plan.frequency}</span>
                                </div>
                                <ul className="mt-8 space-y-3 text-sm flex-grow">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className={cn("flex items-center gap-3", featureStyles.className)} style={featureStyles.style}>
                                            <CheckIcon className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <a href="#" className={cn("mt-10 block w-full text-center rounded-md px-3 py-2 text-sm font-semibold", buttonStyles.className)} style={buttonStyles.style}>{plan.buttonText}</a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
const PricingList = ({ data }: { data: PricingData }) => { return <div>Lista de Precios</div>; };
const PricingSimple = ({ data }: { data: PricingData }) => { return <div>Precios Simples</div>; };

// --- Editor de CONTENIDO (SEPARADO) ---
export function PricingContentEditor({ data, updateData }: { data: PricingData, updateData: (key: keyof PricingData, value: string | PricingPlan[]) => void }) {
    const handlePlanChange = (index: number, field: keyof PricingPlan, value: string | boolean | string[]) => {
        const newPlans = [...(data.plans || [])];
        const planToUpdate = { ...newPlans[index], [field]: value };
        newPlans[index] = planToUpdate;
        updateData('plans', newPlans);
    };

    const addPlan = () => {
        const newPlans = [...(data.plans || []), { name: 'Nuevo Plan', price: '$0', frequency: '/mes', features: ['Característica 1'], buttonText: 'Elegir Plan', featured: false }];
        updateData('plans', newPlans);
    };

    const removePlan = (index: number) => {
        const newPlans = (data.plans || []).filter((_, i) => i !== index);
        updateData('plans', newPlans);
    };

    return (
        <div className="space-y-4">
            <InputField label="Título" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
            <TextareaField label="Subtítulo" value={data.subtitle} rows={2} onChange={(e) => updateData('subtitle', e.target.value)} />
            <div className="flex justify-between items-center"><h4 className="font-medium text-sm text-slate-600">Planes ({data.plans?.length || 0})</h4><button onClick={addPlan} className="bg-slate-200 text-slate-700 py-1.5 px-3 rounded-md text-sm font-semibold hover:bg-slate-300 flex items-center gap-1"><PlusIcon className="w-4 h-4" />Añadir</button></div>
            {(data.plans || []).map((plan, index) => (
                <div key={index} className="border p-3 rounded-lg bg-slate-50 relative space-y-3">
                    <button onClick={() => removePlan(index)} className="absolute top-2 right-2 w-6 h-6 bg-slate-200 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center" title="Eliminar plan"><XMarkIcon className="w-3 h-3" /></button>
                    <h4 className="font-medium text-sm text-slate-700 pr-8">Plan {index + 1}</h4>
                    <InputField label="Nombre del Plan" value={plan.name} onChange={(e) => handlePlanChange(index, 'name', e.target.value)} />
                    <div className="grid grid-cols-2 gap-3"><InputField label="Precio" value={plan.price} onChange={(e) => handlePlanChange(index, 'price', e.target.value)} /><InputField label="Frecuencia" value={plan.frequency} onChange={(e) => handlePlanChange(index, 'frequency', e.target.value)} /></div>
                    <TextareaField label="Características (una por línea)" value={plan.features.join('\n')} rows={4} onChange={(e) => handlePlanChange(index, 'features', e.target.value.split('\n'))} />
                    <InputField label="Texto del Botón" value={plan.buttonText} onChange={(e) => handlePlanChange(index, 'buttonText', e.target.value)} />
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" checked={!!plan.featured} onChange={(e) => handlePlanChange(index, 'featured', e.target.checked)} className="rounded" /> Marcar como destacado</label>
                </div>
            ))}
        </div>
    );
}

// --- Editor de ESTILO (SEPARADO) ---
export function PricingStyleEditor({ data, updateData }: { data: PricingData, updateData: (key: keyof PricingData, value: string) => void }) {
    const isCustomBg = data.backgroundColor?.startsWith('[#');
    const isCustomTitle = data.titleColor?.startsWith('[#');
    const isCustomSubtitle = data.subtitleColor?.startsWith('[#');
    const isCustomCard = data.cardColor?.startsWith('[#');
    const isCustomFeaturedCard = data.featuredCardColor?.startsWith('[#');
    const isCustomPlanName = data.planNameColor?.startsWith('[#');
    const isCustomPrice = data.priceColor?.startsWith('[#');
    const isCustomFrequency = data.frequencyColor?.startsWith('[#');
    const isCustomFeatureText = data.featureTextColor?.startsWith('[#');
    return (
        <div className="space-y-4">
            <h4 className="font-medium text-sm text-slate-600">Diseño General</h4>
            <div>
                <ColorPalette label="Color de Fondo" selectedColor={isCustomBg ? data.backgroundColor : data.backgroundColor || ''} onChange={(color) => updateData('backgroundColor', color)} />
            </div>
            <div>
                <TextColorPalette label="Color del Título" selectedColor={isCustomTitle ? data.titleColor : data.titleColor || ''} onChange={(color) => updateData('titleColor', color)} />
            </div>
            <div>
                <TextColorPalette label="Color del Subtítulo" selectedColor={isCustomSubtitle ? data.subtitleColor : data.subtitleColor || ''} onChange={(color) => updateData('subtitleColor', color)} />
            </div>
            <div className="border-t pt-4 mt-4">
                <h4 className="font-medium text-sm text-slate-600 mb-3">Estilo de los Planes</h4>
                <div>
                    <ColorPalette label="Color de Tarjeta" selectedColor={isCustomCard ? data.cardColor : data.cardColor || ''} onChange={(color) => updateData('cardColor', color)} />
                </div>
                <div>
                    <ColorPalette label="Color de Tarjeta Destacada" selectedColor={isCustomFeaturedCard ? data.featuredCardColor : data.featuredCardColor || ''} onChange={(color) => updateData('featuredCardColor', color)} />
                </div>
                <div>
                    <TextColorPalette label="Color Nombre del Plan" selectedColor={isCustomPlanName ? data.planNameColor : data.planNameColor || ''} onChange={(color) => updateData('planNameColor', color)} />
                </div>
                <div>
                    <TextColorPalette label="Color del Precio" selectedColor={isCustomPrice ? data.priceColor : data.priceColor || ''} onChange={(color) => updateData('priceColor', color)} />
                </div>
                <div>
                    <TextColorPalette label="Color de Frecuencia" selectedColor={isCustomFrequency ? data.frequencyColor : data.frequencyColor || ''} onChange={(color) => updateData('frequencyColor', color)} />
                </div>
                <div>
                    <TextColorPalette label="Color de Características" selectedColor={isCustomFeatureText ? data.featureTextColor : data.featureTextColor || ''} onChange={(color) => updateData('featureTextColor', color)} />
                </div>
                <ButtonColorPalette label="Botón Estándar" selectedBgColor={data.buttonBgColor || ''} selectedTextColor={data.buttonTextColor || ''} onChange={(bg, text) => { updateData('buttonBgColor', bg); updateData('buttonTextColor', text); }} />
                <ButtonColorPalette label="Botón Destacado" selectedBgColor={data.featuredButtonBgColor || ''} selectedTextColor={data.featuredButtonTextColor || ''} onChange={(bg, text) => { updateData('featuredButtonBgColor', bg); updateData('featuredButtonTextColor', text); }} />
            </div>
        </div>
    );
}