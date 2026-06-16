// app/dashboard/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { useTheme } from '@/app/contexts/ThemeContext';

export default function DashboardPage() {
  const router = useRouter();
    const { user, loading } = useAuth();
    const { theme, toggleTheme } = useTheme();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center border border-gray-300 bg-white p-4">
                <div>Cargando...</div>
            </div>
        );
    }

  return (
        <div className="flex-1 min-h-screen relative overflow-hidden border border-gray-300 bg-white p-4">
            <div className="relative z-10 max-w-[1400px] mx-auto p-4 md:p-8 space-y-8">
                <header className="flex justify-between items-end mb-8 pt-4 border-b border-gray-300 bg-white p-4">
                    <div>
                        <h1 className="text-2xl font-semibold">Hola, {user?.email?.split('@')[0] || 'Gestor'}</h1>
                        <p className="text-sm">Resumen general del panel</p>
                    </div>

                    <button onClick={toggleTheme} className="bg-gray-200 text-black border border-gray-400 px-4 py-2 rounded">
                        Toggle tema ({theme})
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 auto-rows-min">
                    <div className="lg:col-span-4">
                        <div className="border border-gray-300 bg-white p-4">
                            <div className="font-medium">Resumen de ingresos</div>
                            <div className="text-sm">Datos básicos del mes</div>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="border border-gray-300 bg-white p-4">
                            <div className="font-medium">Resumen AI</div>
                            <div className="text-sm">Estado general</div>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="border border-gray-300 bg-white p-4">
                            <div className="font-medium mb-3">Lista de sitios</div>
                            <ul className="space-y-2">
                                {['Sitio 1', 'Sitio 2', 'Sitio 3'].map((site) => (
                                    <li key={site} className="border border-gray-300 bg-white p-4">
                                        {site}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => router.push('/dashboard/sites')} className="bg-gray-200 text-black border border-gray-400 px-4 py-2 rounded">
                                    Ver sitios
                                </button>
                                <button className="bg-gray-200 text-black border border-gray-400 px-4 py-2 rounded">Crear sitio</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  );
}
