'use client';

import React from 'react';
import { useDashboardCustomization } from '@/app/contexts/DashboardCustomizationContext';
import { X } from 'lucide-react';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={"w-12 h-7 rounded-full p-1 flex items-center transition-colors " + (checked ? 'bg-indigo-500' : 'bg-slate-300')}
    >
      <span className={"bg-white w-5 h-5 rounded-full shadow transform transition-transform " + (checked ? 'translate-x-5' : 'translate-x-0')} />
    </button>
  );
}

export default function WidgetVisibilityModal() {
  const { visibleWidgets, setVisibleWidgets, modalOpen, closeModal } = useDashboardCustomization();

  if (!modalOpen) return null;

  const toggle = (key: keyof typeof visibleWidgets) => {
    setVisibleWidgets({ ...visibleWidgets, [key]: !visibleWidgets[key] });
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
      <div className="relative z-50 w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Gestionar Vista</h3>
          <button onClick={closeModal} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4 text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Ingresos</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tarjeta de ingresos</p>
            </div>
            <Toggle checked={visibleWidgets.income} onChange={() => toggle('income')} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Estadísticas IA</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Tarjeta vertical de IA</p>
            </div>
            <Toggle checked={visibleWidgets.aiStats} onChange={() => toggle('aiStats')} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Meta Mensual</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Progreso mensual</p>
            </div>
            <Toggle checked={visibleWidgets.goals} onChange={() => toggle('goals')} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Top Productos</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Ranking de productos</p>
            </div>
            <Toggle checked={visibleWidgets.topProducts} onChange={() => toggle('topProducts')} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Embudo</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Embudo de conversión</p>
            </div>
            <Toggle checked={visibleWidgets.funnel} onChange={() => toggle('funnel')} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-700 dark:text-white">Accesos Rápidos</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Mostrar tarjetas de acceso rápido</p>
            </div>
            <Toggle checked={visibleWidgets.quickAccess} onChange={() => toggle('quickAccess')} />
          </div>
        </div>

      </div>
    </div>
  );
}
