// app/dashboard/page.tsx
'use client'
import { useRouter } from 'next/navigation'
import React, { useState, Fragment } from 'react'
import { Transition } from '@headlessui/react'
// Importamos los iconos que usaremos
import { 
  GlobeAltIcon, 
  UsersIcon, 
  ClipboardDocumentListIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  XMarkIcon,
  PlusIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

// Definimos el tipo para nuestros módulos, ahora con colores e iconos SVG
type Module = {
  id: string;
  title: string;
  description: string;
  Icon: React.ElementType; // Usamos un componente de icono en lugar de una URL
  href: string;
  color: { // Paleta de colores para cada módulo
    bg: string;
    icon: string;
  };
  status?: 'Próximamente';
};

// Lista completa de módulos con su nueva identidad visual
const ALL_MODULES: Module[] = [
  {
    id: 'sites',
    title: 'Gestor de Sitios Web',
    description: 'Crea y edita tus páginas web públicas.',
    Icon: GlobeAltIcon,
    href: '/dashboard/sites',
    color: { bg: 'bg-blue-100', icon: 'text-blue-600' }
  },
  {
    id: 'crm',
    title: 'Clientes (CRM)',
    description: 'Gestiona todos tus contactos y leads.',
    Icon: UsersIcon,
    href: '/dashboard/clients',
    status: 'Próximamente',
    color: { bg: 'bg-purple-100', icon: 'text-purple-600' }
  },
  {
    id: 'projects',
    title: 'Gestor de Proyectos',
    description: 'Organiza tareas y colabora en proyectos.',
    Icon: ClipboardDocumentListIcon,
    href: '/dashboard/projects',
    status: 'Próximamente',
    color: { bg: 'bg-orange-100', icon: 'text-orange-600' }
  },
  {
    id: 'sales',
    title: 'Ventas y Facturación',
    description: 'Crea y envía facturas a tus clientes.',
    Icon: BanknotesIcon,
    href: '/dashboard/sales',
    status: 'Próximamente',
    color: { bg: 'bg-green-100', icon: 'text-green-600' }
  },
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Métricas de tus sitios y ventas.',
    Icon: ChartBarIcon,
    href: '/dashboard/analytics',
    status: 'Próximamente',
    color: { bg: 'bg-indigo-100', icon: 'text-indigo-600' }
  }
];

export default function DashboardHomePage() {
  const router = useRouter();
  
  const [dashboardModules, setDashboardModules] = useState<Module[]>([ALL_MODULES[0]]);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);

  const addModule = (moduleToAdd: Module) => {
    if (!dashboardModules.find(m => m.id === moduleToAdd.id)) {
      setDashboardModules([...dashboardModules, moduleToAdd]);
    }
  };

  const removeModule = (moduleId: string) => {
    setDashboardModules(dashboardModules.filter(m => m.id !== moduleId));
  };

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Tu Espacio de Trabajo
          </h1>
          <p className="text-gray-600">
            Añade, elimina y organiza tus herramientas como prefieras.
          </p>
        </div>
        <button
          onClick={() => setIsToolboxOpen(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-sm flex items-center gap-2"
        >
          <Squares2X2Icon className="h-5 w-5" />
          Bandeja de Herramientas
        </button>
      </div>

      {/* Grid del Dashboard */}
      {dashboardModules.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dashboardModules.map((module) => (
            <div
              key={module.id}
              className={`bg-white rounded-xl shadow-sm border group transition-all duration-300 relative ${!module.status && 'hover:shadow-lg hover:-translate-y-1'}`}
            >
              <button 
                onClick={() => removeModule(module.id)}
                className="absolute top-3 right-3 w-7 h-7 bg-gray-100 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100 z-10 flex items-center justify-center"
                title={`Quitar ${module.title}`}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
              
              <div 
                onClick={() => !module.status && router.push(module.href)}
                className={`p-6 ${!module.status ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${module.color.bg} ${module.status ? 'opacity-60' : ''}`}>
                  <module.Icon className={`h-7 w-7 ${module.color.icon}`} />
                </div>
                <div className={`${module.status ? 'opacity-60' : ''}`}>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{module.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                   {module.status && (
                    <div className="mt-3">
                      <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full font-medium">
                        {module.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-gray-50">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Tu dashboard está vacío</h3>
          <p className="mt-1 text-sm text-gray-500">Empieza por añadir tus herramientas de trabajo.</p>
          <div className="mt-6">
            <button
              onClick={() => setIsToolboxOpen(true)}
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Añadir herramienta
            </button>
          </div>
        </div>
      )}

      {/* Bandeja de Herramientas (Modal Lateral) */}
      <Transition show={isToolboxOpen} as={Fragment}>
        <div className="fixed inset-0 z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsToolboxOpen(false)} />
          </Transition.Child>

          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-md">
                <div className="h-full flex flex-col bg-white shadow-xl">
                  <div className="p-6 bg-gray-50 border-b">
                    <div className="flex items-start justify-between">
                      <h2 className="text-lg font-medium text-gray-900">Bandeja de Herramientas</h2>
                      <button onClick={() => setIsToolboxOpen(false)} className="ml-3 h-7 flex items-center justify-center text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Cerrar panel</span>
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Selecciona las herramientas que quieres en tu dashboard.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {ALL_MODULES.map(module => {
                      const isAdded = dashboardModules.some(m => m.id === module.id);
                      return (
                        <div key={module.id} className="border rounded-lg p-3 flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${module.color.bg}`}>
                            <module.Icon className={`h-6 w-6 ${module.color.icon}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{module.title}</h4>
                            <p className="text-xs text-gray-500">{module.description}</p>
                          </div>
                          <button
                            onClick={() => addModule(module)}
                            disabled={isAdded || !!module.status}
                            className={`px-3 py-1 text-xs rounded-full font-semibold transition-all ${
                              isAdded 
                                ? 'bg-green-100 text-green-700 cursor-default' 
                                : module.status
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {isAdded ? 'Añadido ✓' : module.status ? 'Próximo' : 'Añadir +'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition>
    </div>
  )
}