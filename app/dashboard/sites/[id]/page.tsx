'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SitePreview from '@/components/SitePreview'

// Definimos los tipos para los parámetros de la URL
interface SiteEditorParams {
  params: {
    id: string;
  };
}

// Definimos el tipo para los objetos de sitio web (tenant)
interface Tenant {
  id: string;
  userKey: string;
  name: string;
  slug: string;
  domain: string | null;
  pages: { id: string, title: string, slug: string, content: string, published: boolean }[];
  createdAt: string;
  updatedAt: string;
  config: {
    customCSS: string;
    [key: string]: any;
  };
  description?: string;
  stats?: { views: number };
}

export default function SiteEditor({ params }: SiteEditorParams) {
  const [tenant, setTenant] = useState<Tenant | null>(null) // <-- Le decimos a useState que 'tenant' es de tipo 'Tenant' o 'null'
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const router = useRouter()
  
  useEffect(() => {
    if (params.id) {
      loadTenant()
    }
  }, [params.id])

  const loadTenant = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tenants/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (res.ok) {
        const data = await res.json()
        setTenant(data.tenant)
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error loading tenant:', error)
      router.push('/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const saveTenant = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tenants/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(tenant)
      })
      if (res.ok) {
        alert('Cambios guardados')
      } else {
        alert('Error al guardar')
      }
    } catch (error) {
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando editor...</div>
  }

  if (!tenant) {
    return <div className="text-center py-8">Sitio no encontrado</div>
  }

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Header del editor */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div>
          <h1 className="text-xl font-bold">{tenant.name}</h1>
          <p className="text-gray-600">/{tenant.slug}</p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => window.open(`/site/${tenant.slug}`, '_blank')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Ver Sitio
          </button>
          <button
            onClick={saveTenant}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      {/* Tabs del editor */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {['content', 'design', 'settings', 'preview'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'content' ? 'Contenido' : 
                 tab === 'design' ? 'Diseño' : 
                 tab === 'settings' ? 'Configuración' : 'Vista Previa'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'content' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Editor de Contenido</h3>
              <textarea
                value={tenant.pages[0]?.content || ''}
                onChange={(e) => {
                  const updatedTenant = { ...tenant }
                  if (updatedTenant.pages[0]) {
                    updatedTenant.pages[0].content = e.target.value
                  }
                  setTenant(updatedTenant)
                }}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="Escribe el HTML de tu página aquí..."
              />
              <p className="text-sm text-gray-600 mt-2">
                Puedes usar HTML y clases de Tailwind CSS
              </p>
            </div>
          )}

          {activeTab === 'design' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Personalización</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSS Personalizado
                  </label>
                  <textarea
                    value={tenant.config?.customCSS || ''}
                    onChange={(e) => {
                      const updatedTenant = { ...tenant }
                      updatedTenant.config = { ...updatedTenant.config, customCSS: e.target.value }
                      setTenant(updatedTenant)
                    }}
                    className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="/* Tu CSS personalizado aquí */"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-medium mb-4">Configuración del Sitio</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Sitio
                  </label>
                  <input
                    type="text"
                    value={tenant.name}
                    onChange={(e) => setTenant({ ...tenant, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL del Sitio
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /
                    </span>
                    <input
                      type="text"
                      value={tenant.slug}
                      onChange={(e) => setTenant({ ...tenant, slug: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Solo letras, números y guiones
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <SitePreview
              content={tenant.pages[0]?.content}
              customCSS={tenant.config?.customCSS}
            />
          )}
        </div>
      </div>
    </div>
  )
}