// components/Layout/DashboardSidebar.tsx (VERSIÓN MODULAR)
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // ===== MENÚ MODULAR ACTUALIZADO =====
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/dashboard/sites', label: 'Sitios Web', icon: '🌐' },
    { href: '/dashboard/clients', label: 'Clientes (CRM)', icon: '👥' },
    { href: '/dashboard/projects', label: 'Proyectos', icon: '📋' },
    { href: '/dashboard/sales', label: 'Ventas', icon: '💰' },
    { href: '/dashboard/settings', label: 'Configuración', icon: '⚙️' },
  ]

  // El resto del componente permanece igual...
  return (
    <div className={`bg-white shadow-sm border-r transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
        <div className="p-4 flex items-center justify-between h-16">
          {!collapsed && (
            <Link href="/dashboard">
                <h2 className="text-lg font-semibold text-gray-900">Gestularia</h2>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="mt-4">
            {menuItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm transition-colors ${
                (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                    ? 'bg-blue-50 text-blue-700 font-semibold border-r-2 border-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
                <span className="text-lg mr-3">{item.icon}</span>
                {!collapsed && item.label}
            </Link>
            ))}
        </nav>
    </div>
  )
}