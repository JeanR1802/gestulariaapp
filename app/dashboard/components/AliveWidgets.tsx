// app/dashboard/components/AliveWidgets.tsx
'use client';

import { ArrowUpRight, Bot, Zap, TrendingUp, MoreHorizontal, ShoppingBag, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Tarjeta de Ingresos (Glass Card Grande) ---
export const IncomeCard = ({ value, trend }: { value: string, trend: string }) => (
    <div className="lg:col-span-2 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 ease-out rounded-[2rem] border border-slate-200 dark:border-white/10 bg-sky-100 dark:bg-slate-900 shadow-xl dark:shadow-2xl">
    {/* Gradiente de fondo */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-[100%] pointer-events-none" />
    
    <div className="p-8 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end h-full gap-6">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Ingresos Totales (Simulado)</p>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl text-slate-400 font-light">$</span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-brand font-bold text-slate-800 dark:text-white tracking-tight">
                {value}
            </h2>
        </div>
        
        <div className="mt-4 flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> {trend}
            </span>
            <span className="text-xs text-slate-500">vs mes anterior</span>
        </div>
      </div>

      {/* Gráfico CSS Puro */}
      <div className="flex items-end gap-1 h-16 sm:h-20 opacity-80 pb-1">
         {[40, 60, 35, 70, 85, 60, 75].map((h, i) => (
             <div key={i} 
                  className={cn(
                      "w-3 rounded-full transition-all duration-500 group-hover:bg-indigo-500/60",
                      i === 4 ? "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "bg-indigo-400/20"
                  )} 
                  style={{ height: `${h}%` }} 
             />
         ))}
      </div>
    </div>
  </div>
);

// --- Tarjeta de IA (Glass Card Vertical) ---
export const AiStatCard = () => (
    <div className="relative overflow-hidden group hover:-translate-y-1 transition-transform duration-500 rounded-[2rem] border border-slate-200 dark:border-white/10 bg-gradient-to-br from-purple-200 via-purple-100 to-violet-200 dark:bg-gradient-to-br dark:from-[#4f378b] dark:via-[#7c3aed] dark:to-[#312e81] shadow-2xl p-8 flex flex-col justify-between h-full min-h-[200px]">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-400/20 rounded-full blur-2xl" />
        
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-brand-purple" />
                <span className="text-xs font-bold uppercase text-slate-500">Efectividad IA</span>
            </div>
            <h2 className="text-5xl font-brand font-extrabold text-black dark:text-purple-100 drop-shadow-lg">85%</h2>
            <p className="text-xs text-black dark:text-purple-200 mt-2 leading-relaxed font-semibold drop-shadow">
                Tu <span className="text-brand-purple font-bold">Negociador</span> ha cerrado 4 ventas hoy.
            </p>
        </div>

        <div className="mt-6 w-full h-2 bg-purple-300/60 dark:bg-purple-900/60 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-violet-400 dark:from-purple-400 dark:via-purple-300 dark:to-violet-400 w-[85%] shadow-[0_0_10px_#a78bfa]" />
        </div>
    </div>
);

// --- Grid de Herramientas Activas ---
export const ToolsGrid = ({ onOpenSites }: { onOpenSites: () => void }) => {
    // Definimos las herramientas. "Mis Sitios" es la única funcional por ahora.
    const tools = [
        {
            id: 'sites',
            name: 'Mis Sitios',
            icon: ShoppingBag,
            color: 'text-white drop-shadow-md',
            bg: 'bg-gradient-to-br from-sky-500 via-blue-500 to-blue-700 dark:from-[#1e2a78] dark:via-[#233393] dark:to-[#1a237e]',
            border: 'border-0',
            status: 'Activo',
            statusColor: 'bg-emerald-400',
            action: onOpenSites
        },
        { id: 'negotiator', name: 'Negociador', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10', status: 'Beta', statusColor: 'bg-amber-500', action: () => {}, disabled: true }, // Placeholder
        { id: 'viral', name: 'Precio Viral', icon: Zap, color: 'text-pink-500', bg: 'bg-pink-500/10', status: 'Apagado', statusColor: 'bg-slate-400', action: () => {}, disabled: true }, // Placeholder
    ];

    return (
        <div className="mt-8">
             <div className="flex items-center justify-between mb-5 px-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    Herramientas Activas
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-[10px] text-slate-500 font-mono">
                        {tools.filter(t => !t.disabled).length}/{tools.length}
                    </span>
                </h3>
                <button className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors opacity-50 cursor-not-allowed">
                    Gestionar
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={tool.disabled ? undefined : tool.action}
                        className={cn(
                            "rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-300",
                            tool.id === 'sites'
                                ? `${tool.bg} ${tool.color} ${tool.border} shadow-2xl hover:shadow-2xl hover:scale-105 relative overflow-hidden`
                                : "border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900",
                            tool.disabled 
                                ? "opacity-60 grayscale cursor-not-allowed" 
                                : tool.id !== 'sites' && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105 hover:shadow-lg hover:border-indigo-500/30"
                        )}
                    >
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110 bg-white/10", tool.color)}>
                            <tool.icon className="w-8 h-8 drop-shadow-lg" />
                        </div>
                        <h4 className="text-base font-extrabold tracking-wide text-white drop-shadow-lg mb-1">{tool.name}</h4>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className={cn("w-2 h-2 rounded-full", tool.statusColor, tool.status === 'Activo' && "shadow-[0_0_5px_currentColor]")} />
                            <span className="text-xs text-white/80 font-semibold drop-shadow">{tool.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// (Se eliminaron componentes extra: QuickAccess, GoalsCard, TopProductsCard, FunnelCard)
