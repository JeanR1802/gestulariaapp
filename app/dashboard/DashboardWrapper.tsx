'use client';

import { useTheme } from '../contexts/ThemeContext';
import { colorPalettes } from '../lib/colors';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { useState } from 'react';

interface DashboardWrapperProps {
  children: React.ReactNode;
  userEmail?: string;
  isEditor: boolean;
}

export function DashboardWrapper({ children, userEmail, isEditor }: DashboardWrapperProps) {
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];

  return (
    <div
      className="dashboard-root flex h-screen font-sans overflow-hidden transition-colors duration-200"
      style={{
        // Fondo global: gris claro en modo claro, color de paleta en modo oscuro
        backgroundColor: theme === 'light' ? '#F3F4F6' : c.bg.primary,
        color: c.text.primary,
      }}
    >
      {!isEditor && <DashboardSidebar />}

      <main className="flex-1 flex flex-col overflow-hidden">
        {!isEditor && <DashboardHeader userEmail={userEmail} />}

        {/* Contenido con smooth scroll */}
        <div className={isEditor ? "flex-1" : "flex-1 overflow-y-auto scroll-smooth"}>
          {!isEditor && (
            <style jsx global>{`
              /* Smooth scroll personalizado */
              .overflow-y-auto {
                scroll-behavior: smooth;
                scrollbar-width: thin;
                scrollbar-color: ${theme === 'dark' ? "rgba(0, 245, 255, 0.3) rgba(13, 18, 34, 0.5)" : "rgba(8, 145, 178, 0.3) rgba(241, 245, 249, 0.5)"};
              }

              /* Webkit browsers (Chrome, Safari, Edge) */
              .overflow-y-auto::-webkit-scrollbar {
                width: 8px;
              }

              .overflow-y-auto::-webkit-scrollbar-track {
                background: ${theme === 'dark' ? "rgba(13, 18, 34, 0.5)" : "rgba(241, 245, 249, 0.5)"};
                border-radius: 10px;
              }

              .overflow-y-auto::-webkit-scrollbar-thumb {
                background: ${theme === 'dark' ? "rgba(0, 245, 255, 0.3)" : "rgba(8, 145, 178, 0.3)"};
                border-radius: 10px;
                transition: background 0.2s;
              }

              .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                background: ${theme === 'dark' ? "rgba(0, 245, 255, 0.5)" : "rgba(8, 145, 178, 0.5)"};
              }

              /* Forzar fondo blanco en contenedores/tarjetas dentro del dashboard en modo claro */
              ${theme === 'light' ? `
                .dashboard-root .bg-slate-50,
                .dashboard-root .bg-slate-100,
                .dashboard-root .bg-white,
                .dashboard-root .card-bg {
                  background-color: #FFFFFF !important;
                  color: inherit !important;
                }
                .dashboard-root .rounded-lg {
                  border-radius: 8px;
                }
                .dashboard-root .card-shadow {
                  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
                }
              ` : ''}
            `}</style>
          )}

          {/* Wrapper condicional: con padding en dashboard normal, sin padding en editor */}
          {isEditor ? (
            children
          ) : (
            <div className="p-4 sm:p-6 lg:p-8" style={{ backgroundColor: 'transparent' }}>
              <div className="min-h-full" style={{ backgroundColor: 'transparent' }}>
                {children}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
