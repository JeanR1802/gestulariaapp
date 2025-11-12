// app/dashboard/sites/SiteModals.tsx
'use client';

import React, { useState } from 'react';

type CreateSiteModalProps = {
  onClose: () => void;
  onSiteCreated: (newSiteId: string) => void;
};

export function CreateSiteModal({ onClose, onSiteCreated }: CreateSiteModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí puedes realizar la llamada real a la API para crear el sitio.
      // Como stub, simulamos la creación con un timeout y devolvemos un id falso.
      await new Promise((r) => setTimeout(r, 600));
      const fakeId = Math.random().toString(36).slice(2, 9);
      onSiteCreated(fakeId);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md p-6">
        <h3 className="text-lg font-medium mb-4">Crear nuevo sitio</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
              placeholder="Mi sitio"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subdominio (slug)</label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm"
              placeholder="mi-sitio"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-blue-600 text-white">
              {loading ? 'Creando...' : 'Crear sitio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateSiteModal;
