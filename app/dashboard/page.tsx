// app/dashboard/page.tsx (VERSIÓN MODULAR)
'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function DashboardHomePage() {
  const router = useRouter();

  const modules = [
    {
      title: 'Gestor de Sitios Web',
      description: 'Crea y edita tus páginas web públicas.',
      icon: '🌐',
      href: '/dashboard/sites',
    },
    {
      title: 'Clientes (CRM)',
      description: 'Gestiona todos tus contactos y leads.',
      icon: '👥',
      href: '/dashboard/clients',
      status: 'Próximamente',
    },
    {
      title: 'Gestor de Proyectos',
      description: 'Organiza tareas y colabora en proyectos.',
      icon: '📋',
      href: '/dashboard/projects',
      status: 'Próximamente',
    },
     {
      title: 'Ventas y Facturación',
      description: 'Crea y envía facturas a tus clientes.',
      icon: '💰',
      href: '/dashboard/sales',
      status: 'Próximamente',
    }
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido a Gestularia
        </h1>
        <p className="text-gray-600">
          Selecciona un módulo para empezar a gestionar tu negocio.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <div
            key={module.title}
            onClick={() => !module.status && router.push(module.href)}
            className={`bg-white rounded-lg shadow-sm border p-6 group transition-all duration-200 ${module.status ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md hover:border-blue-500 hover:-translate-y-1'}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl mr-4">{module.icon}</span>
              {module.status && (
                <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {module.status}
                </span>
              )}
            </div>
            <div className="mt-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{module.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{module.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}