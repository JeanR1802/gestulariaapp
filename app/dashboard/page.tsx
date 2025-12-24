'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';
import { useTheme } from '@/app/contexts/ThemeContext';
import { IncomeCard, AiStatCard, ToolsGrid } from './components/AliveWidgets';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-indigo-500">Cargando Gestularia...</div>;
  }

  return (
    <div className="flex-1 min-h-screen relative overflow-hidden transition-colors duration-700 bg-slate-50 dark:bg-[#020617]">
        {/* Luces Ambientales de Fondo */}
        <div className="absolute inset-0 bg-alive-light dark:bg-alive-dark pointer-events-none transition-opacity duration-700" />

        <div className="relative z-10 max-w-[1400px] mx-auto p-6 md:p-10 space-y-8 ml-20 lg:ml-24">
            
            {/* Header */}
            <header className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sistema Operativo</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-brand font-bold text-slate-800 dark:text-white tracking-tight">
                        Gestularia HQ
                    </h1>
                </div>

                {/* Toggle de Tema */}
                <button 
                    onClick={toggleTheme}
                    className="h-11 px-4 rounded-full flex items-center gap-3 border border-white/10 bg-white dark:bg-slate-900 shadow-sm"
                >
                    <div className="w-5 h-5">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                        {theme === 'dark' ? 'Modo Noche' : 'Modo Día'}
                    </span>
                </button>
            </header>

            {/* Grid Principal de Métricas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <IncomeCard value="24,500" trend="12.5%" />
                <AiStatCard />
            </div>

            {/* Grid de Herramientas */}
            <ToolsGrid onOpenSites={() => router.push('/dashboard/sites')} />

            {/* Feed en Vivo */}
            <div className="rounded-[2rem] border border-white/10 bg-white dark:bg-slate-900 shadow-lg p-6 mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 dark:text-white">Feed en Vivo</h3>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </div>
                <div className="text-center py-8 text-slate-400 text-sm">
                    No hay actividad reciente en tiempo real.
                </div>
            </div>

        </div>
    </div>
  );
}
