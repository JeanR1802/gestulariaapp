"use client";

import { UserCircleIcon } from '@heroicons/react/24/solid';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { colorPalettes } from '../lib/colors';

interface DashboardHeaderProps {
  userEmail?: string;
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const { theme, toggleTheme, palette } = useTheme();
  const c = colorPalettes[palette][theme];
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent | TouchEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfile(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowProfile(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <header 
      className="px-4 sm:px-8 py-6 flex justify-between items-center border-b backdrop-blur-md z-10 flex-shrink-0 transition-colors duration-200"
      style={{ 
        backgroundColor: theme === 'dark' ? c.bg.secondary : `${c.accent.primary}0E`,
        borderBottomColor: c.border.secondary
      }}
    >
      <div>
        <h1 className="text-2xl font-bold transition-colors" style={{ color: c.text.primary }}>
          Dashboard
        </h1>
        <p className="text-sm transition-colors hidden sm:block" style={{ color: c.text.tertiary }}>
          Resumen general
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Perfil - muestra panel con correo y cerrar sesión */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="p-2 rounded-lg grid place-items-center"
            aria-expanded={showProfile}
            aria-label="Abrir perfil"
            style={{ backgroundColor: c.bg.secondary }}
          >
            <UserCircleIcon className="w-6 h-6" style={{ color: c.text.primary }} />
          </button>

          {showProfile && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl z-50"
              style={{
                backgroundColor: c.bg.secondary,
                border: `1px solid ${c.border.primary}`,
                padding: '10px'
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="text-sm break-words" style={{ color: c.text.primary }}>
                  {userEmail ?? 'Sin correo'}
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('userToken');
                    window.location.href = '/';
                  }}
                  className="w-full px-3 py-2 rounded-md text-sm font-medium transition-all hover:opacity-90"
                  style={{ backgroundColor: c.accent.primary, color: c.bg.primary }}
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
