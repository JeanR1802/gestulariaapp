'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Globe, 
  BarChart3, 
  Settings, 
  FileText,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/sites', label: 'Mis Sitios', icon: Globe },
  { href: '/dashboard/pages', label: 'Páginas', icon: FileText, disabled: true }, // Ejemplo de deshabilitado
  { href: '/dashboard/analytics', label: 'Estadísticas', icon: BarChart3, disabled: true },
  { href: '/dashboard/team', label: 'Equipo', icon: Users, disabled: true },
  { href: '/dashboard/settings', label: 'Configuración', icon: Settings, disabled: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-col flex-shrink-0 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">Modublo</h2>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = (item.href === '/dashboard' && pathname === item.href) || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : item.disabled
                  ? 'text-slate-400 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.disabled && <span className="ml-auto text-xs bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">Pronto</span>}
            </Link>
          );
        })}
      </nav>
      {/* Puedes agregar un pie de página a la sidebar aquí, como el perfil del usuario */}
    </aside>
  );
}
