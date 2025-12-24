// app/dashboard/page.tsx
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-alive-light dark:bg-alive-dark">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen relative overflow-hidden">
        {/* Fondo Atmosférico */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-transparent to-purple-50/50 dark:from-indigo-950/20 dark:via-transparent dark:to-purple-950/20 pointer-events-none" />

        {/* Contenido Principal */}
        <div className="relative z-10 max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">{/*  Reducido padding y removido margen izquierdo */}
            
            {/* Header */}
            <header className="flex justify-between items-end mb-8 pt-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-slow"></span>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Sistema Operativo</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-brand font-bold text-slate-800 dark:text-white tracking-tight">
                        Hola, {user?.email?.split('@')[0] || 'Gestor'}
                    </h1>
                </div>

                {/* Toggle de Tema */}
                <button 
                    onClick={toggleTheme}
                    className="h-11 px-4 rounded-full flex items-center gap-3 border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:scale-105 transition-all group shadow-md dark:shadow-xl"
                >
                    <div className="relative w-5 h-5">
                        <Sun className={`w-5 h-5 absolute inset-0 text-amber-500 transition-all duration-300 ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
                        <Moon className={`w-5 h-5 absolute inset-0 text-indigo-400 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-500 transition-colors hidden sm:inline-block">
                        {theme === 'dark' ? 'Modo Noche' : 'Modo Día'}
                    </span>
                </button>
            </header>

            {/* Grid Principal de Métricas */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 auto-rows-min">
                <div className="lg:col-span-4">
                    <IncomeCard value="24,500" trend="12.5%" />
                </div>

                <div className="lg:col-span-2">
                    <AiStatCard />
                </div>

                <div className="lg:col-span-6">
                    <ToolsGrid onOpenSites={() => router.push('/dashboard/sites')} />
                </div>
            </div>

        </div>
    </div>
  );
}
