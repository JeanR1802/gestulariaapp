'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Tenant {
  id: string
  name: string
  slug: string
  createdAt: string
}

interface DeleteSiteModalProps {
  tenant: Tenant
  onClose: () => void
  onDelete: (id: string) => void
}

function DeleteSiteModal({ tenant, onClose, onDelete }: DeleteSiteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Eliminar Sitio</h2>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar "{tenant.name}"? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={() => onDelete(tenant.id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SitesPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [showDeleteModal, setShowDeleteModal] = useState<Tenant | null>(null)
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

  const deleteTenant = async (tenantId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        setTenants(tenants.filter((t) => t.id !== tenantId))
        setShowDeleteModal(null)
      } else {
        alert('Error al eliminar el sitio')
      }
    } catch (error) {
      alert('Error al eliminar el sitio')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Cargando sitios...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Sitios Web</h1>
          <p className="text-gray-600">Gestiona todos tus sitios desde aquí</p>
        </div>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Crear Sitio
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes sitios web aún
          </h3>
          <p className="text-gray-600 mb-6">Crea tu primer sitio para comenzar</p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Crear mi primer sitio
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <div key={tenant.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{tenant.name}</h3>
                  <p className="text-sm text-gray-600">/{tenant.slug}</p>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    Activo
                  </span>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Creado: {new Date(tenant.createdAt).toLocaleDateString('es-ES')}
              </div>

              <div className="flex gap-2">
                <Link
                  href={`/dashboard/sites/${tenant.id}`}
                  className="flex-1 text-center bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 text-sm"
                >
                  Editar
                </Link>
                <button
                  onClick={() => window.open(`/site/${tenant.slug}`, '_blank')}
                  className="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm"
                >
                  Ver Sitio
                </button>
                <button
                  onClick={() => setShowDeleteModal(tenant)}
                  className="text-red-600 hover:text-red-800 px-2"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <DeleteSiteModal
          tenant={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onDelete={deleteTenant}
        />
      )}
    </div>
  )
}
