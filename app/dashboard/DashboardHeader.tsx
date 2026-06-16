"use client";

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardHeaderProps {
  userEmail?: string;
}

export function DashboardHeader({ userEmail }: DashboardHeaderProps) {
  const { theme, toggleTheme } = useTheme();
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
    <header className="px-4 sm:px-8 py-4 flex justify-between items-center border-b border-gray-200 bg-white">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm">Resumen general</p>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="bg-gray-200 px-4 py-2 rounded">
          Toggle tema ({theme})
        </button>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="bg-gray-200 px-3 py-2 rounded"
            aria-expanded={showProfile}
            aria-label="Abrir perfil"
          >
            Perfil
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-2 w-56 rounded border border-gray-200 bg-white p-3">
              <div className="flex flex-col gap-3">
                <div className="text-sm break-words">{userEmail ?? 'Sin correo'}</div>
                <button
                  onClick={() => {
                    localStorage.removeItem('userToken');
                    window.location.href = '/';
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
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
