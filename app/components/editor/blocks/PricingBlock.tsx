// app/components/editor/blocks/PricingBlock.tsx
import React from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';

interface PricePlan {
  name: string;
  price: string;
  frequency: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
}

export interface PricingData {
  variant: 'columns' | 'list' | 'simple';
  title: string;
  subtitle: string;
  plans: PricePlan[];
  backgroundColor: string;
  highlightColor: string;
}

export function PricingBlock({ data }: { data: PricingData }) {
  switch (data.variant) {
    case 'list': return <PricingList data={data} />;
    case 'simple': return <PricingSimple data={data} />;
    default: return <PricingColumns data={data} />;
  }
}

const PricingColumns = ({ data }: { data: PricingData }) => (
    <div className={`${data.backgroundColor || 'bg-white'} py-12 px-4`}>
        <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.title}</h2>
            <p className="text-lg text-slate-600 mb-12 max-w-2xl mx-auto">{data.subtitle}</p>
            <div className="grid md:grid-cols-3 gap-8">
                {(data.plans || []).map((plan, i) => (
                    <div key={i} className={`p-6 border rounded-lg text-left flex flex-col ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'} `}>
                        <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                        <p className="text-slate-500 mb-4">{plan.description}</p>
                        <p className="text-4xl font-bold mb-1">${plan.price}<span className="text-base font-normal text-slate-500">{plan.frequency}</span></p>
                        <ul className="text-sm text-slate-600 space-y-2 my-6 flex-grow">
                            {(plan.features || []).map((feat, fi) => <li key={fi} className="flex items-center gap-2">✓<span>{feat}</span></li>)}
                        </ul>
                        <a href="#" className={`w-full text-center py-2 rounded-md font-semibold ${plan.highlighted ? `${data.highlightColor ? data.highlightColor.replace('border-', 'bg-') : 'bg-blue-600'} text-white` : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>{plan.buttonText}</a>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PricingList = ({ data }: { data: PricingData }) => (
    <div className={`${data.backgroundColor || 'bg-white'} py-12 px-4`}>
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.title}</h2>
                <p className="text-lg text-slate-600">{data.subtitle}</p>
            </div>
            <div className="space-y-4">
                {(data.plans || []).map((plan, i) => (
                    <div key={i} className={`p-4 border rounded-lg grid md:grid-cols-3 items-center gap-4 ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}`}>
                        <div className="md:col-span-2">
                            <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                            <p className="text-sm text-slate-500">{plan.description}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-3xl font-bold">${plan.price}<span className="text-sm font-normal text-slate-500">{plan.frequency}</span></p>
                           <a href="#" className="mt-2 inline-block w-full text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700"> {plan.buttonText}</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const PricingSimple = ({ data }: { data: PricingData }) => (
    <div className={`${data.backgroundColor || 'bg-white'} py-12 px-4`}>
        <div className="max-w-4xl mx-auto">
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.title}</h2>
                <p className="text-lg text-slate-600">{data.subtitle}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
                 {(data.plans || []).map((plan, i) => (
                    <div key={i} className={`p-6 border rounded-lg ${plan.highlighted ? `border-2 ${data.highlightColor || 'border-blue-600'}` : 'border-slate-200'}`}>
                        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                        <p className="text-4xl font-bold mb-4">${plan.price}<span className="text-base font-normal text-slate-500">{plan.frequency}</span></p>
                        <p className="text-slate-500 text-sm mb-4">{plan.description}</p>
                        <a href="#" className="w-full block text-center py-2 rounded-md font-semibold bg-slate-800 text-white hover:bg-slate-700">{plan.buttonText}</a>
                    </div>
                 ))}
            </div>
        </div>
    </div>
);

export function PricingEditor({ data, updateData }: { data: PricingData, updateData: (key: keyof PricingData, value: string | PricePlan[]) => void }) {

    const updatePlanData = (planIndex: number, key: keyof PricePlan, value: string | boolean | string[]) => {
        const newPlans = [...(data.plans || [])];

        if (key === 'highlighted' && typeof value === 'boolean') {
            newPlans.forEach((p, i) => {
                p.highlighted = i === planIndex ? value : false;
            });
        } else {
            const planToUpdate = { ...newPlans[planIndex], [key]: value };
            newPlans[planIndex] = planToUpdate;
        }

        updateData('plans', newPlans);
    };

    return (
        <div className="space-y-4">
            <div>
                <h4 className="font-medium text-sm text-slate-600">Contenido Principal</h4>
                <InputField label="Título" value={data.title} onChange={(e) => updateData('title', e.target.value)} />
                <TextareaField label="Subtítulo" value={data.subtitle} onChange={(e) => updateData('subtitle', e.target.value)} />
            </div>
            
            {(data.plans || []).map((plan, index) => (
                <div key={index} className="border border-slate-200 p-3 rounded-lg space-y-3 bg-slate-50">
                    <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm text-slate-700">Plan {index + 1}</h4>
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={plan.highlighted} onChange={(e) => updatePlanData(index, 'highlighted', e.target.checked)} />
                            Destacar
                        </label>
                    </div>
                    <InputField label="Nombre del Plan" value={plan.name} onChange={e => updatePlanData(index, 'name', e.target.value)} />
                    <div className="flex gap-2">
                        <InputField label="Precio" value={plan.price} onChange={e => updatePlanData(index, 'price', e.target.value)} />
                        <InputField label="Frecuencia" value={plan.frequency} onChange={e => updatePlanData(index, 'frequency', e.target.value)} />
                    </div>
                    <TextareaField label="Descripción" value={plan.description} rows={2} onChange={e => updatePlanData(index, 'description', e.target.value)} />
                    <TextareaField label="Características (una por línea)" value={(plan.features || []).join('\n')} rows={4} onChange={e => updatePlanData(index, 'features', e.target.value.split('\n'))} />
                    <InputField label="Texto del Botón" value={plan.buttonText} onChange={e => updatePlanData(index, 'buttonText', e.target.value)} />
                </div>
            ))}

            <div className="border-t border-slate-200 pt-4 space-y-4">
                <h4 className="font-medium text-sm text-slate-600 mb-3">Diseño</h4>
                <ColorPalette label="Color de Fondo" selectedColor={data.backgroundColor} onChange={(color) => updateData('backgroundColor', color)} />
            </div>
        </div>
    );
}