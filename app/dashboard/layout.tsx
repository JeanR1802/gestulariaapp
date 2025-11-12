'use client';

import React from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { useAuth } from '../hooks/useAuth'; // Crearemos este hook
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  // Excluir sidebar solo en el editor de bloques (ruta con ID)
  const isEditor = /^\/dashboard\/sites\/[a-zA-Z0-9_-]+$/.test(pathname);

  return (
    <div className="flex h-screen bg-slate-50">
      {!isEditor && <DashboardSidebar />}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
