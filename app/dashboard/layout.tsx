'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '../contexts/ThemeContext';
import { DashboardWrapper } from './DashboardWrapper';

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
      <div className="flex items-center justify-center min-h-screen border-2 border-blue-200 bg-white p-2 text-black">
        <div>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen border-2 border-blue-200 bg-white p-2 text-black">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  // Excluir sidebar solo en el editor de bloques (ruta con ID)
  const isEditor = /^\/dashboard\/sites\/[a-zA-Z0-9_-]+$/.test(pathname);

  return (
    <ThemeProvider>
      <DashboardWrapper userEmail={user?.email} isEditor={isEditor}>
        {children}
      </DashboardWrapper>
    </ThemeProvider>
  );
}
