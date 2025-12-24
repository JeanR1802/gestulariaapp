'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutGrid, 
    ShoppingBag, 
    MessageSquare, 
    Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/hooks/useAuth';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
    { href: '/dashboard/sites', label: 'Mis Sitios', icon: ShoppingBag },
    { href: '/dashboard/chats', label: 'Chats IA', icon: MessageSquare, disabled: true },
  ];

  return (
    <aside className="w-20 lg:w-24 h-screen fixed left-0 top-0 z-50 flex flex-col items-center py-8 transition-colors duration-500 border-r border-white/5 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-xl">
        
        {/* Logo / Brand Image (larger; black bg in light mode) */}
        <div className="mb-12 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm hover:scale-105 transition-transform cursor-pointer bg-black dark:bg-transparent">
            <img src="/logoG.svg" alt="Gestularia" className="w-9 h-9 object-contain" />
        </div>

        {/* Navegación */}
        <nav className="flex-1 flex flex-col gap-6 w-full items-center">
            {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <div key={item.label} className="relative group">
                        <Link 
                            href={item.disabled ? '#' : item.href}
                            className={cn(
                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                                isActive 
                                    ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 shadow-sm" 
                                    : "text-slate-400 hover:bg-slate-200/50 dark:hover:bg-white/10 hover:text-slate-600 dark:hover:text-slate-200",
                                item.disabled && "opacity-50 cursor-not-allowed grayscale"
                            )}
                        >
                            {item.label === 'Chats IA' ? (
                                <div className="relative">
                                    <item.icon className="w-5 h-5" />
                                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-pink rounded-full border-2 border-white dark:border-slate-900"></span>
                                </div>
                            ) : (
                                <item.icon className="w-5 h-5" />
                            )}
                        </Link>
                        
                        {/* Tooltip */}
                        <div className="absolute left-14 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-xl translate-x-2 group-hover:translate-x-0 duration-200">
                            {item.label} {item.disabled && "(Pronto)"}
                        </div>
                    </div>
                );
            })}
        </nav>

        {/* Avatar de Usuario */}
        <div className="mt-auto mb-4">
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 hover:border-indigo-500 transition-colors shadow-md relative">
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
                    {user?.email?.substring(0, 2).toUpperCase() || 'US'}
                </div>
            </button>
        </div>
    </aside>
  );
}
