'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';

type Tenant = { id: string; name: string; slug: string; createdAt?: string; pages?: unknown[] };

const generateSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 60);

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);

  useEffect(() => {
    if (!loading && user) loadTenants();
    else if (!loading && !user) setLoadingTenants(false);
  }, [loading, user]);

  async function loadTenants() {
    setLoadingTenants(true);
    try {
      const res = await fetch('/api/tenants', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const data = await res.json();
      setTenants(data.tenants || []);
    } catch {
      setTenants([]);
    } finally {
      setLoadingTenants(false);
    }
  }

  async function createSite() {
    const name = prompt('Nombre del nuevo sitio (ej: Mi Tienda)')?.trim();
    if (!name) return;
    const slug = generateSlug(name);
    try {
      const res = await fetch('/api/tenants/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ name, slug })
      });
      const data = await res.json();
      if (res.ok && data.tenant?.id) {
        router.push(`/dashboard/sites/${data.tenant.id}`);
      } else {
        alert(data.error || 'Error al crear sitio');
      }
    } catch {
      alert('Error de red');
    }
  }

  async function createPageForTenant(tenantId: string) {
    const title = prompt('Título de la nueva página')?.trim();
    if (!title) return;
    const slug = '/' + generateSlug(title);
    const token = localStorage.getItem('token');
    try {
      const getRes = await fetch(`/api/tenants/${tenantId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!getRes.ok) { alert('No se pudo obtener el sitio'); return; }
      const getData = await getRes.json();
      const tenant = getData.tenant;
      const pages = Array.isArray(tenant.pages) ? tenant.pages.slice() : [];
      pages.push({ title, slug, published: false, content: '[]' });
      const updated = { ...tenant, pages };
      const putRes = await fetch(`/api/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updated)
      });
      if (putRes.ok) {
        alert('Página creada');
        router.push(`/dashboard/sites/${tenantId}`);
      } else {
        const err = await putRes.json();
        alert(err.error || 'Error al actualizar sitio');
      }
    } catch {
      alert('Error de red');
    }
  }

  if (loading || loadingTenants) {
    return <div className="min-h-[40vh] flex items-center justify-center">Cargando sitios...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Tus sitios</h2>
          <p className="text-sm text-gray-500">Accede rápidamente a editor y vista pública.</p>
        </div>
        <div>
          <button onClick={createSite} className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-500">Crear nuevo sitio</button>
        </div>
      </div>

      {tenants.length === 0 ? (
        <div className="p-8 bg-white rounded-lg border text-center text-gray-600">No tienes sitios aún. Crea uno nuevo.</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          {tenants.map((t) => (
            <div key={t.id} className="bg-white rounded-lg border p-4 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold text-black">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.slug}</div>
                </div>
                <div className="text-xs text-gray-400">{t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}</div>
              </div>

              <div className="mt-auto flex gap-2">
                <button onClick={() => createPageForTenant(t.id)} className="flex-1 px-3 py-2 bg-gray-100 rounded-md text-sm hover:bg-gray-200 text-black">Crear página</button>
                <button onClick={() => router.push(`/dashboard/sites/${t.id}`)} className="px-3 py-2 bg-slate-900 text-white rounded-md text-sm">Abrir Editor</button>
                <button onClick={() => window.open(`/${t.slug}`, '_blank')} className="px-3 py-2 border rounded-md text-sm text-black">Visitar</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
