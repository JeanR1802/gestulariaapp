'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Componente Modal para crear sitio
function CreateSiteModal({ onClose, onSuccess }) {
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState(null)

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const checkSlugAvailability = async (slugToCheck) => {
    if (!slugToCheck || slugToCheck.length < 2) {
      setSlugAvailable(null)
      return
    }

    try {
      const res = await fetch(`/api/check-slug/${slugToCheck}`)
      const data = await res.json()
      setSlugAvailable(data.available)
    } catch (error) {
      setSlugAvailable(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/tenants/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, slug, description })
      })

      if (res.ok) {
        const data = await res.json()
        alert(`¡Sitio creado exitosamente!\n\nTu sitio está disponible en:\nhttps://${data.tenant.slug}.gestularia.com`)
        onSuccess()
      } else {
        const data = await res.json()
        alert(data.error || 'Error al crear el sitio')
      }
    } catch (error) {
      alert('Error al crear el sitio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Sitio Web</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                const newSlug = generateSlug(e.target.value)
                setSlug(newSlug)
                checkSlugAvailability(newSlug)
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Mi Empresa"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL del Sitio
            </label>
            <div className="flex">
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  const newSlug = generateSlug(e.target.value)
                  setSlug(newSlug)
                  checkSlugAvailability(newSlug)
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-r-md">
                .gestularia.com
              </span>
            </div>
            {slug && (
              <div className="mt-1">
                {slugAvailable === true && (
                  <p className="text-sm text-green-600">✓ Disponible: {slug}.gestularia.com</p>
                )}
                {slugAvailable === false && (
                  <p className="text-sm text-red-600">✗ No disponible, elige otro nombre</p>
                )}
                {slugAvailable === null && slug.length >= 2 && (
                  <p className="text-sm text-gray-500">Verificando disponibilidad...</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (opcional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Breve descripción de tu sitio"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || slugAvailable === false || !slug}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Sitio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [tenants, setTenants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/tenants', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setTenants(data.tenants || [])
    } catch (error) {
      console.error('Error loading tenants:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('URL copiada al portapapeles!')
    } catch (err) {
      // Fallback para navegadores sin clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
      alert('URL copiada al portapapeles!')
    }
  }

  const modules = [
    {
      title: 'Mis Sitios Web',
      description: 'Gestiona todos tus sitios web',
      icon: '🌐',
      content: (
        <div className="space-y-4">
          {tenants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No tienes sitios web aún</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Crear mi primer sitio
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Sitios Activos ({tenants.length})</h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  + Nuevo Sitio
                </button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{tenant.name}</h4>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Activo
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm text-blue-600 font-medium">
                          {tenant.slug}.gestularia.com
                        </p>
                        <button
                          onClick={() => copyToClipboard(`https://${tenant.slug}.gestularia.com`)}
                          className="text-gray-400 hover:text-gray-600"
                          title="Copiar URL"
                        >
                          📋
                        </button>
                      </div>
                      <p className="text-xs text-gray-500">
                        {tenant.stats?.views || 0} vistas • Creado {new Date(tenant.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/dashboard/sites/${tenant.id}`)}
                        className="flex-1 text-center bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 text-sm"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => window.open(`https://${tenant.slug}.gestularia.com`, '_blank')}
                        className="flex-1 text-center bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200 text-sm"
                      >
                        🌐 Ver Sitio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )
    },
    {
      title: 'Analytics',
      description: 'Estadísticas de tus sitios',
      icon: '📊',
      content: (
        <div className="space-y-4">
          {tenants.length > 0 ? (
            <div className="grid gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Resumen General</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700">Total de sitios</p>
                    <p className="text-2xl font-bold text-blue-900">{tenants.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700">Total de vistas</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {tenants.reduce((sum, tenant) => sum + (tenant.stats?.views || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              {tenants.map((tenant) => (
                <div key={tenant.id} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-gray-600">{tenant.slug}.gestularia.com</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{tenant.stats?.views || 0}</p>
                      <p className="text-xs text-gray-500">vistas</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Crea tu primer sitio para ver analytics</p>
            </div>
          )}
        </div>
      )
    }
  ]

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  return (
    <div className="px-4 py-6">
      {/* Bienvenida */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Dashboard de Gestularia
        </h1>
        <p className="text-gray-600">
          Crea y gestiona sitios web con subdominio automático en gestularia.com
        </p>
      </div>

      {/* Módulos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {modules.map((module, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">{module.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.description}</p>
              </div>
            </div>
            
            <div className="mt-4">
              {module.content}
            </div>
          </div>
        ))}
      </div>

      {/* Modal para crear sitio */}
      {showCreateModal && (
        <CreateSiteModal 
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            loadTenants()
          }}
        />
      )}
    </div>
  )
}