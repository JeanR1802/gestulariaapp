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
} from '@heroicons/react/24/solid';
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

  // En modo oscuro queremos que el sidebar se note respecto al fondo:
  // - fondo secundario del tema (ligeramente distinto)
  // - borde sutil y sombra para separación
  const sidebarBg = isLight ? c.accent.primary : c.bg.secondary;
  const textColor = isLight ? '#FFFFFF' : c.text.primary;
  const indicatorActive = isLight ? '#FFFFFF' : c.accent.primary;
  const tooltipBg = isLight ? '#FFFFFF' : c.bg.secondary;
  const tooltipText = isLight ? c.accent.primary : c.text.primary;
  const sidebarBorder = isLight ? 'transparent' : `1px solid ${c.border.secondary}`;
  const sidebarBoxShadow = isLight ? undefined : '0 8px 24px rgba(0,0,0,0.35)';

  return (
    <aside 
      className="w-20 lg:w-56 border-r flex flex-col items-center lg:items-start py-6 gap-8 z-20 flex-shrink-0 transition-all duration-300"
      style={{ 
        // Fondo adaptativo según tema
        backgroundColor: sidebarBg,
        borderRight: sidebarBorder,
        boxShadow: sidebarBoxShadow,
        paddingLeft: '1rem',
        paddingRight: '1rem'
      }}
    >
      {/* Botón al dashboard con logo lgc sin fondo */}
      <Link 
        href="/dashboard" 
        className="flex items-center gap-3 w-10 h-10 rounded-xl hover:scale-110 transition-all overflow-hidden"
      >
        <img src="/lgc.png" alt="Logo" className="w-8 h-8 object-contain" />
        <span className="hidden lg:inline text-sm font-semibold" style={{ color: textColor }}>Gestularia</span>
      </Link>
      {/* Logo lgc sin fondo */}

      {/* Navegación con iconos */}
      <nav className="flex flex-col gap-3 w-full">
        {menuItems.map((item) => {
          const isActive = (item.href === '/dashboard' && pathname === item.href) || 
                           (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const disabled = !!item.disabled;
          
          return (
            <Link
              key={item.href}
              href={disabled ? '#' : item.href}
              title={item.label}
              className={cn("relative group flex items-center gap-3 w-full rounded-xl transition-all px-3 py-2", disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer')}
              style={{
                backgroundColor: isActive ? (isLight ? 'rgba(255,255,255,0.12)' : 'rgba(20,20,20,0.25)') : 'transparent',
                color: textColor,
              }}
              onMouseEnter={(e) => {
                if (!disabled && !isActive) {
                  e.currentTarget.style.backgroundColor = isLight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)';
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && !isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              {/* Indicador lateral visible en lg cuando activo */}
              <span className="hidden lg:inline-block absolute left-0 h-10 w-1 rounded-r-md" style={{ backgroundColor: isActive ? indicatorActive : 'transparent' }} />

              <item.icon className="w-6 h-6 flex-shrink-0" style={{ color: textColor }} />

              {/* Label visible en pantallas grandes */}
              <span className="hidden lg:inline text-sm font-medium" style={{ color: textColor }}>{item.label}</span>

              {/* Tooltip al hacer hover para pantallas pequeñas (oculto en lg) */}
              <span 
                className="absolute left-full ml-4 px-3 py-2 text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl lg:hidden"
                style={{ 
                  backgroundColor: tooltipBg,
                  color: tooltipText,
                  borderColor: 'transparent',
                  borderWidth: '0px'
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
