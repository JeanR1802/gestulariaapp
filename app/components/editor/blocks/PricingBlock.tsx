'use client';
import React, { useState } from 'react';
import { InputField, TextareaField } from './InputField';
import { ColorPalette } from '../controls/ColorPalette';
import { usePreviewMode } from '@/app/contexts/PreviewModeContext';
import { cn } from '@/lib/utils';
import { SparklesIcon } from '@heroicons/react/24/outline';

// --- Interfaces de Datos ---
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

// --- Componentes de Bloque (sin cambios) ---
export function PricingBlock({ data }: { data: PricingData }) { /* ... */ }
const PricingColumns = ({ data }: { data: PricingData }) => { /* ... */ };
const PricingList = ({ data }: { data: PricingData }) => { /* ... */ };
const PricingSimple = ({ data }: { data: PricingData }) => { /* ... */ };

// --- Editor de Campos (ACTUALIZADO) ---
export function PricingEditor({ data, updateData }: { data: PricingData, updateData: (key: keyof PricingData, value: string | PricePlan[]) => void }) {

    const [userDescription, setUserDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!userDescription) return;
        setIsLoading(true);
        try {
            const res = await fetch('/api/ai/generate-block', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ blockType: 'pricing', userDescription }),
            });
            const result = await res.json();
            if (res.ok) {
                if(result.title) updateData('title', result.title);
                if(result.subtitle) updateData('subtitle', result.subtitle);
                if(result.plans) updateData('plans', result.plans);
            } else {
                alert('Error al generar contenido con IA.');
            }
        } catch (e) {
            alert('Error de conexión con la IA.');
        } finally {
            setIsLoading(false);
        }
    };

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
            <div className="border border-blue-200 p-3 rounded-lg space-y-3 bg-blue-50">
                <h4 className="font-semibold text-sm text-blue-800">Generación Inteligente</h4>
                <TextareaField label="Describe tu negocio o servicio" value={userDescription} rows={3} onChange={(e) => setUserDescription(e.target.value)} />
                <button onClick={handleGenerate} disabled={isLoading || !userDescription} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
                    {isLoading ? 'Generando...' : <><SparklesIcon className="w-5 h-5" /> Generar contenido</>}
                </button>
            </div>
            
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
