'use client';

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import { DashboardWrapper } from './DashboardWrapper';
import { colorPalettes } from '../lib/colors';

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
    const c = colorPalettes.teal.dark;
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1222]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: c.accent.primary }}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1222] text-white">
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
