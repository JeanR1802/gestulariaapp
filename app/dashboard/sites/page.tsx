'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { PlusIcon, PencilIcon, ArrowTopRightOnSquareIcon, TrashIcon, GlobeAltIcon } from '@heroicons/react/24/outline'
import { generateSlug } from '@/lib/utils' // Importamos la utilidad para generar slugs

interface Tenant {
  id: string
  name: string
  slug: string
  createdAt: string
}

// --- INICIO DE LA CORRECCIÓN: AÑADIMOS EL MODAL PARA CREAR SITIOS ---
interface CreateSiteModalProps {
  onClose: () => void;
  onSiteCreated: (siteId: string) => void;
}

function CreateSiteModal({ onClose, onSiteCreated }: CreateSiteModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setName(newName);
    setSlug(generateSlug(newName));
  };

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/tenants/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name, slug }),
      });
      const data = await res.json();
      if (res.ok) {
        onSiteCreated(data.tenant.id); // Redirigir al nuevo sitio
      } else {
        setError(data.error || 'No se pudo crear el sitio.');
      }
    } catch (err) {
      setError('Ocurrió un error de red.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold text-slate-800">Crear Nuevo Sitio Web</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl">&times;</button>
        </div>
        <form onSubmit={handleCreateSite}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Nombre del Sitio</label>
              <input type="text" id="siteName" value={name} onChange={handleNameChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Mi increíble negocio"/>
            </div>
            <div>
              <label htmlFor="siteSlug" className="block text-sm font-medium text-gray-700">URL del Sitio</label>
              <div className="flex items-center mt-1">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">gestularia.com/</span>
                <input type="text" id="siteSlug" value={slug} onChange={e => setSlug(generateSlug(e.target.value))} className="flex-1 block w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="mi-negocio"/>
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <div className="p-6 border-t flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancelar</button>
            <button type="submit" disabled={loading || !name || !slug} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {loading ? 'Creando...' : 'Crear Sitio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
// --- FIN DEL MODAL ---

interface DeleteSiteModalProps {
  tenant: Tenant
  onClose: () => void
  onDelete: (id: string) => void
}

function DeleteSiteModal({ tenant, onClose, onDelete }: DeleteSiteModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md m-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Eliminar Sitio</h2>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que quieres eliminar &quot;{tenant.name}&quot;? Esta acción es permanente y no se puede deshacer.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onDelete(tenant.id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold transition-colors"
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
  const [isCreateModalOpen, setCreateModalOpen] = useState(false); // Estado para el nuevo modal
  const router = useRouter()

  useEffect(() => {
    const loadTenants = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch('/api/tenants', {
          headers: { Authorization: `Bearer ${token ?? ''}` }
        })

        type TenantsResponse = { tenants: Tenant[] }
        const data: TenantsResponse = await res.json()

        setTenants(data.tenants || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTenants()
  }, [])

  const deleteTenant = async (tenantId: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tenants/${tenantId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token ?? ''}` }
      })

      if (res.ok) {
        setTenants((prev) => prev.filter((t) => t.id !== tenantId))
        setShowDeleteModal(null)
      } else {
        alert('Error al eliminar el sitio')
      }
    } catch (err) {
      console.error(err)
      alert('Error al eliminar el sitio')
    }
  }

  // Función para redirigir al editor después de crear el sitio
  const handleSiteCreated = (newSiteId: string) => {
    router.push(`/dashboard/sites/${newSiteId}`);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    )
  }

  return (
    <>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mis Sitios Web</h1>
            <p className="text-gray-600">Gestiona todos tus sitios desde aquí.</p>
          </div>
          {/* --- INICIO DE LA CORRECCIÓN DEL BOTÓN --- */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all shadow-sm flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Crear Sitio
          </button>
          {/* --- FIN DE LA CORRECCIÓN DEL BOTÓN --- */}
        </div>

        {tenants.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl bg-gray-50">
              <GlobeAltIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Aún no tienes sitios web</h3>
              <p className="mt-1 text-sm text-gray-500">Empieza por crear tu primer sitio para mostrarlo al mundo.</p>
              <div className="mt-6">
                  <button
                      onClick={() => setCreateModalOpen(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      Crear mi primer sitio
                  </button>
              </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="bg-white rounded-xl shadow-sm border group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="h-32 bg-gray-50 rounded-t-xl flex items-center justify-center border-b">
                   <GlobeAltIcon className="h-12 w-12 text-gray-300 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 truncate">{tenant.name}</h3>
                      <p className="text-sm text-gray-500">/{tenant.slug}</p>
                    </div>
                     <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                        Activo
                      </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-4">
                    Creado: {new Date(tenant.createdAt).toLocaleDateString('es-ES')}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/sites/${tenant.id}`}
                      className="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <PencilIcon className="h-4 w-4" />
                      Editar
                    </Link>
                    <button
                      onClick={() => {
                        const protocol = window.location.protocol;
                        const host = window.location.host.includes('localhost')
                          ? 'localhost:3000'
                          : 'gestularia.com';
                        window.open(`${protocol}//${tenant.slug}.${host}`, '_blank');
                      }}
                      className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      title="Ver Sitio en una nueva pestaña"
                    >
                      <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(tenant)}
                      className="p-2 text-gray-400 hover:bg-red-100 hover:text-red-600 rounded-md"
                      title="Eliminar Sitio"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
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

      {/* Renderizar el modal de creación si está abierto */}
      {isCreateModalOpen && (
        <CreateSiteModal 
          onClose={() => setCreateModalOpen(false)} 
          onSiteCreated={handleSiteCreated} 
        />
      )}
    </>
  )
}

