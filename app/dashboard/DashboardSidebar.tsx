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
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "h-screen fixed left-0 top-0 z-50 flex flex-col py-6 border-r border-gray-200 bg-gray-50",
                    "transition-all duration-300 ease-in-out",
                    isExpanded ? "lg:w-64" : "lg:w-20",
                    isMobileOpen ? "w-64" : "w-20"
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
                            "flex-shrink-0 w-10 h-10 flex items-center justify-center rounded bg-gray-200",
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
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded bg-white">G</div>
                            <span className="font-semibold text-base whitespace-nowrap text-black">Gestularia</span>
                        </Link>
                    )}
                </div>

                {/* Navegación */}
                <nav className={cn("flex-1 flex flex-col gap-2", ((isExpanded && !isMobile) || isMobileOpen) ? "px-3" : "px-2")}> 
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
                                        "flex items-center gap-3 rounded border border-gray-200 text-black",
                                        ((isExpanded && !isMobile) || isMobileOpen) ? "px-4 py-3" : "justify-center w-12 h-12 mx-auto",
                                        isActive ? "bg-gray-200" : "bg-white",
                                        item.disabled && "opacity-50 cursor-not-allowed"
                                    )}
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    {((isExpanded && !isMobile) || isMobileOpen) && <span className="truncate">{item.label}</span>}
                                </Link>
                            </div>
                        );
                    })}
                </nav>

                {/* Avatar de Usuario & Logout */}
                <div className={cn("mt-auto", ((isExpanded && !isMobile) || isMobileOpen) ? "px-3" : "px-2")}> 
                    <div className={cn(
                        "flex items-center gap-3 p-3 rounded border border-gray-200 bg-white",
                        !(isExpanded || isMobileOpen) && "justify-center mx-auto w-12 h-12 p-0"
                    )}>
                        <div className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-xs font-bold">
                            {user?.email?.substring(0, 2).toUpperCase() || 'US'}
                        </div>
                        {((isExpanded && !isMobile) || isMobileOpen) && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate text-black">{user?.email || 'Usuario'}</p>
                                <button 
                                    onClick={logout}
                                    className="text-xs bg-gray-200 px-2 py-1 rounded flex items-center gap-1 mt-1"
                                >
                                    <LogOut className="w-3 h-3" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}
