"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Tenant { name?: string; slug?: string; pages?: { slug: string; content: string }[] }

export default function EditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [saving, setSaving] = useState(false);

  const goBack = () => router.push('/dashboard/page.tsx');

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (id) {
        // Guardar estado vacío por ahora
        await fetch(`/api/tenants/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ pages: [{ slug: '/', content: JSON.stringify([]) }] })
        }).catch(() => {});
      }
      alert('Guardado: []');
    } catch (e) {
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleVisit = () => {
    window.open(`/${(id as string) || ''}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 bg-white border-b px-4 flex items-center justify-between">
        <div>
          <button onClick={goBack} className="px-3 py-2 rounded bg-gray-100">Regresar</button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="px-3 py-2 rounded bg-blue-600 text-white">{saving ? 'Guardando…' : 'Guardar'}</button>
          <button onClick={handleVisit} className="px-3 py-2 rounded bg-gray-100">Visitar</button>
        </div>
      </header>

      <main className="flex-1 bg-slate-50 flex items-center justify-center">
        <div className="text-center text-slate-700">
          <h2 className="text-lg font-semibold mb-2">Lienzo limpio. Listo para la nueva arquitectura Locablo.</h2>
          <p className="text-sm text-slate-500">Este espacio está vacío por diseño — reconstruye el editor desde cero.</p>
        </div>
      </main>
    </div>
  );
}