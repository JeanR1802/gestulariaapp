'use client';
import { ArrowUpRight, Bot, Zap, TrendingUp, MoreHorizontal, ShoppingBag, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Tarjeta de Ingresos (Glass Card Grande) ---
export const IncomeCard = ({ value, trend }: { value: string, trend: string }) => (
  <div className="lg:col-span-2 relative overflow-hidden rounded-[2rem] border border-white/10 bg-white dark:bg-slate-900 shadow-lg">
    {/* Gradiente de fondo */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-[100%] pointer-events-none" />
    
    <div className="p-8 relative z-10 flex justify-between items-start h-full">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Ingresos Totales (Simulado)</p>
        <div className="flex items-baseline gap-1">
            <span className="text-2xl text-slate-400 font-light">$</span>
            <h2 className="text-6xl md:text-7xl font-brand font-bold text-slate-800 dark:text-white tracking-tight">
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
      <div className="flex items-end gap-1 h-20 opacity-80">
         {[40, 60, 35, 70, 85].map((h, i) => (
             <div key={i} 
                  className={i === 4 ? "w-3 rounded-full bg-indigo-500" : "w-3 rounded-full bg-indigo-400/20"}
                  style={{ height: `${h}%` }} 
             />
         ))}
      </div>
    </div>
  </div>
);

// --- Tarjeta de IA (Glass Card Vertical) ---
export const AiStatCard = () => (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white dark:bg-slate-900 shadow-lg p-8 flex flex-col justify-between">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-purple/5 rounded-full blur-xl" />
        
        <div>
            <div className="flex items-center gap-2 mb-2">
                <Bot className="w-4 h-4 text-brand-purple" />
                <span className="text-xs font-bold uppercase text-slate-500">Efectividad IA</span>
            </div>
            <h2 className="text-5xl font-brand font-bold text-slate-800 dark:text-white">85%</h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Tu <span className="text-brand-purple font-bold">Negociador</span> está activo.
            </p>
        </div>

        <div className="mt-6 w-full h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-purple to-brand-pink w-[85%] shadow-[0_0_10px_#d946ef]" />
        </div>
    </div>
);

// --- Grid de Herramientas Activas ---
export const ToolsGrid = ({ onOpenSites }: { onOpenSites: () => void }) => {
    const tools = [
        { id: 'sites', name: 'Mis Sitios', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-500/10', status: 'Activo', statusColor: 'bg-emerald-500', action: onOpenSites },
        { id: 'negotiator', name: 'Negociador', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10', status: 'Beta', statusColor: 'bg-amber-500', action: () => {} },
        { id: 'viral', name: 'Precio Viral', icon: Zap, color: 'text-pink-500', bg: 'bg-pink-500/10', status: 'Apagado', statusColor: 'bg-slate-400', action: () => {}, disabled: true },
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
                <button className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors">
                    Gestionar
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {tools.map((tool) => (
                    <div 
                        key={tool.id}
                        onClick={tool.disabled ? undefined : tool.action}
                        className={cn(
                            "rounded-2xl border border-white/10 bg-white dark:bg-slate-900 p-5 flex flex-col items-center text-center",
                            tool.disabled 
                                ? "opacity-60 grayscale cursor-not-allowed" 
                                : "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-indigo-500/30"
                        )}
                    >
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", tool.bg, tool.color)}>
                            <tool.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">{tool.name}</h4>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className={cn("w-1.5 h-1.5 rounded-full", tool.statusColor, tool.status === 'Activo' && "shadow-[0_0_5px_currentColor]")} />
                            <span className="text-[10px] text-slate-500 font-medium">{tool.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
