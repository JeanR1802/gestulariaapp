"use client";

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/app/contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={"p-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm border " + className}
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#1a1a1a',
        borderColor: theme === 'light' ? '#e2e8f0' : '#333',
        color: theme === 'light' ? '#0f172a' : '#ffffff'
      }}
      title={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
