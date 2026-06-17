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
    const name = prompt('Nombre del nuevo negocio o sitio (ej: Mi Tienda Local)')?.trim();
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
    const title = prompt('Título de la nueva página (ej: Contacto, Promociones)')?.trim();
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
        alert('Página creada con éxito');
        router.push(`/dashboard/sites/${tenantId}`);
      } else {
        const err = await putRes.json();
        alert(err.error || 'Error al actualizar sitio');
      }
    } catch {
      alert('Error de red');
    }
  }

  // Pantalla de Carga Elegante
  if (loading || loadingTenants) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse">Cargando tus negocios...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      {/* Encabezado del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tus Negocios</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Administra y edita los sitios web de tus tiendas locales.</p>
        </div>
        <button 
          onClick={createSite} 
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:bg-indigo-500 active:scale-95 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Nuevo Negocio
        </button>
      </div>

      {/* Estado Vacío */}
      {tenants.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Aún no tienes sitios creados</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            Comienza construyendo tu primer sitio en Locablo para ofrecer una experiencia optimizada de ventas locales.
          </p>
          <button 
            onClick={createSite} 
            className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Crear mi primer sitio
          </button>
        </div>
      ) : (
        /* Cuadrícula de Tarjetas de Negocios */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((t) => (
            <div key={t.id} className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all overflow-hidden relative">
              
              {/* Información de la Tarjeta */}
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {t.createdAt && (
                    <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-1.5 truncate" title={t.name}>{t.name}</h3>
                
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="truncate">locablo.com/{t.slug}</span>
                </div>
              </div>

              {/* Botones de Acción (Zona Inferior) */}
              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                
                <button 
                  onClick={() => router.push(`/dashboard/sites/${t.id}`)} 
                  className="flex-1 flex justify-center items-center gap-2 px-3 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editor
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => createPageForTenant(t.id)} 
                    title="Añadir nueva página a este sitio"
                    className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => window.open(`/${t.slug}`, '_blank')} 
                    title="Ver el sitio público"
                    className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}