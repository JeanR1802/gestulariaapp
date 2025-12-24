'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    LayoutGrid, 
    ShoppingBag, 
    LogOut,
    Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/app/hooks/useAuth';
import { useSidebar } from '@/app/contexts/SidebarContext';
import { useState, useEffect } from 'react';

export function DashboardSidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { isExpanded, setIsExpanded } = useSidebar();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si estamos en móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleToggle = () => {
        if (isMobile) {
            setIsMobileOpen(!isMobileOpen);
        } else {
            setIsExpanded(!isExpanded);
        }
    };

    const handleMobileItemClick = () => {
        if (isMobile) {
            setIsMobileOpen(false);
        }
    };

    const menuItems: { href: string; label: string; icon: any; disabled?: boolean }[] = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
        { href: '/dashboard/sites', label: 'Mis Sitios', icon: ShoppingBag },
    ];

    return (
        <>
            {/* Overlay para móvil cuando está abierto */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "h-screen fixed left-0 top-0 z-50 flex flex-col py-6 border-r border-slate-800/50 bg-blue-900 dark:bg-[#101a3a] will-change-transform",
                    // Transiciones suaves
                    "transition-all duration-300 ease-in-out",
                    // Desktop: ancho cambia según isExpanded
                    isExpanded ? "lg:w-64" : "lg:w-20",
                    // Móvil: siempre w-20, pero cuando está abierto se expande
                    isMobileOpen ? "w-64" : "w-20",
                       // Usar un degradado azul ligeramente más fuerte pero más suave que antes
                       "bg-gradient-to-br from-sky-500 via-blue-600 to-blue-700 text-white",
                       // Modo oscuro: degradado ultramarino
                       "dark:bg-gradient-to-br dark:from-[#07123a] dark:via-[#0e2a6b] dark:to-[#163b8f]"
                )}
            >
                {/* Header con Hamburger y Logo */}
                <div className={cn(
                    "mb-8 flex items-center gap-3 transition-all duration-300",
                    ((isExpanded && !isMobile) || isMobileOpen) ? "px-4" : "px-0 justify-center"
                )}>
                    {/* Botón Hamburger */}
                    <button
                        onClick={handleToggle}
                        className={cn(
                            "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg bg-transparent hover:bg-white/5 transition-all duration-200 text-white active:scale-95",
                            !(isExpanded || isMobileOpen) && "mx-auto"
                        )}
                        aria-label={(isExpanded || isMobileOpen) ? "Colapsar sidebar" : "Expandir sidebar"}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    
                    {/* Logo (solo visible cuando está expandido) */}
                    {((isExpanded && !isMobile) || isMobileOpen) && (
                        <Link
                            href="/dashboard"
                            onClick={handleMobileItemClick}
                            className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                        >
                            <img src="/lgc.png" alt="Gestularia" className="w-8 h-8 object-contain flex-shrink-0" />
                            <span className="text-white font-bold text-base whitespace-nowrap">Gestularia</span>
                        </Link>
                    )}
                </div>

                {/* Navegación */}
                <nav className={cn("flex-1 flex flex-col gap-2 transition-all duration-300", ((isExpanded && !isMobile) || isMobileOpen) ? "px-3" : "px-2")}> 
                    {menuItems.map((item) => {
                        const isActive = item.href === '/dashboard'
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                        return (
                            <div key={item.label} className="relative group">
                                <Link
                                    href={item.disabled ? '#' : item.href}
                                    onClick={handleMobileItemClick}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl transition-all duration-200 text-white font-medium active:scale-95",
                                        ((isExpanded && !isMobile) || isMobileOpen) ? "px-4 py-3" : "justify-center w-12 h-12 mx-auto",
                                        isActive ? "bg-indigo-500/20 border border-indigo-400/30 shadow-md" : "hover:bg-white/5",
                                        item.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {((isExpanded && !isMobile) || isMobileOpen) && <span className="truncate">{item.label}</span>}
                                </Link>
                                
                                {/* Tooltip cuando está colapsado (solo desktop) */}
                                {!isExpanded && !isMobile && (
                                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
                                        {item.label}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Avatar de Usuario & Logout */}
                <div className={cn("mt-auto relative group transition-all duration-300", ((isExpanded && !isMobile) || isMobileOpen) ? "px-3" : "px-2")}> 
                    <div className={cn(
                        "flex items-center gap-3 p-3 rounded-xl bg-transparent hover:bg-white/5 transition-all duration-200 cursor-pointer active:scale-95",
                        !(isExpanded || isMobileOpen) && "justify-center mx-auto w-12 h-12 p-0"
                    )}>
                        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0">
                            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold">
                                {user?.email?.substring(0, 2).toUpperCase() || 'US'}
                            </div>
                        </div>
                        {((isExpanded && !isMobile) || isMobileOpen) && (
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium truncate">{user?.email || 'Usuario'}</p>
                                <button 
                                    onClick={logout}
                                    className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 mt-1"
                                >
                                    <LogOut className="w-3 h-3" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Tooltip de logout cuando está colapsado (solo desktop) */}
                    {!isExpanded && !isMobile && (
                        <div className="absolute left-full ml-2 bottom-0 px-3 py-2 bg-blue-900 dark:bg-[#101a3a] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto shadow-xl whitespace-nowrap z-50">
                            <button onClick={logout} className="flex items-center gap-2 text-xs text-white hover:text-red-400 transition-colors">
                                <LogOut className="w-3 h-3" /> Cerrar Sesión
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
