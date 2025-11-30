'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ColorPalette } from '../lib/colors'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  palette: ColorPalette
  setPalette: (palette: ColorPalette) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [palette, setPaletteState] = useState<ColorPalette>('teal')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Cargar tema y paleta guardados del localStorage
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const savedPalette = localStorage.getItem('palette') as ColorPalette | null
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      // Detectar preferencia del sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
    
    if (savedPalette) {
      setPaletteState(savedPalette)
    }
    
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme)
      // Actualizar clase en el html para estilos globales si es necesario
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [theme, mounted])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('palette', palette)
    }
  }, [palette, mounted])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setPalette = (newPalette: ColorPalette) => {
    setPaletteState(newPalette)
  }

  // Evitar flash de contenido sin tema
  if (!mounted) {
    return null
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // No lanzar para evitar romper componentes que se renderizan fuera del provider
    console.warn('useTheme llamado fuera de ThemeProvider — usando valores por defecto.');
    return {
      theme: 'light' as Theme,
      toggleTheme: () => {},
      palette: 'teal' as ColorPalette,
      setPalette: () => {}
    }
  }
  return context
}
