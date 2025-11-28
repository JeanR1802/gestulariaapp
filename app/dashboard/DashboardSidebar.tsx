'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Squares2X2Icon, 
  GlobeAltIcon, 
  UsersIcon, 
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useTheme } from '../contexts/ThemeContext';
import { colorPalettes } from '../lib/colors';

const menuItems = [
  // Dashboard muestra métricas rápidas — icono cambiado a flecha de tendencias
  { href: '/dashboard', label: 'Dashboard', icon: ArrowTrendingUpIcon },
  // Sitios ahora se muestra como Módulos (mantener ruta /dashboard/sites)
  { href: '/dashboard/sites', label: 'Módulos', icon: Squares2X2Icon },
  { href: '/dashboard/analytics', label: 'Analíticas', icon: ChartBarIcon, disabled: true },
  { href: '/dashboard/team', label: 'Equipo', icon: UsersIcon, disabled: true },
  { href: '/dashboard/settings', label: 'Ajustes', icon: Cog6ToothIcon, disabled: true },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];
  const isLight = theme === 'light';

  return (
    <aside 
      className="w-20 border-r flex flex-col items-center py-6 gap-8 z-20 flex-shrink-0 transition-colors duration-200"
      style={{ 
        // Usar el color de acento de la paleta seleccionada
        backgroundColor: isLight ? c.accent.primary : c.bg.primary,
        borderRightColor: c.border.secondary
      }}
    >
      {/* Botón al dashboard con logo lgc sin fondo */}
      <Link 
        href="/dashboard" 
        className="w-10 h-10 rounded-xl grid place-items-center hover:scale-110 transition-all overflow-hidden"
      >
        <img src="/lgc.png" alt="Logo" className="w-8 h-8 object-contain" />
      </Link>
      {/* Logo lgc sin fondo */}

      {/* Navegación con iconos */}
      <nav className="flex flex-col gap-6 w-full items-center">
        {menuItems.map((item) => {
          const isActive = (item.href === '/dashboard' && pathname === item.href) || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.disabled ? '#' : item.href}
              title={item.label}
              className="p-3 rounded-xl cursor-pointer transition-all relative group"
              style={{
                backgroundColor: isActive ? `${c.accent.primary}22` : 'transparent',
                color: isActive ? (isLight ? c.bg.primary : c.accent.primary) : (item.disabled ? c.text.muted : (isLight ? c.bg.primary : c.text.tertiary)),
                opacity: item.disabled ? 0.4 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!item.disabled && !isActive) {
                  e.currentTarget.style.backgroundColor = `${c.accent.primary}0A`;
                  e.currentTarget.style.color = isLight ? c.bg.primary : c.text.primary;
                }
              }}
              onMouseLeave={(e) => {
                if (!item.disabled && !isActive) {
                   e.currentTarget.style.backgroundColor = 'transparent'
                   e.currentTarget.style.color = isLight ? c.bg.primary : c.text.tertiary
                 }
               }}
            >
              <item.icon className="w-6 h-6" />
              
              {/* Tooltip al hacer hover */}
              <span 
                className="absolute left-full ml-4 px-3 py-2 text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl"
                style={{ 
                  backgroundColor: c.bg.secondary,
                  color: c.text.primary,
                  borderColor: c.border.primary,
                  borderWidth: '1px'
                }}
              >
                {item.label}
                {item.disabled && (
                  <span className="ml-2 text-[10px]" style={{ color: c.text.muted }}>
                    (Próximamente)
                  </span>
                )}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
