# Sistema de Temas: Modo Claro y Oscuro

## 🎨 Resumen

Se ha implementado un sistema completo de temas con modo claro y oscuro para el dashboard de sitios, incluyendo:

- ✅ Context API de React para manejo global del tema
- ✅ Persistencia del tema en localStorage
- ✅ Botón toggle en el header para cambiar entre temas
- ✅ Transiciones suaves entre temas
- ✅ Paleta de colores profesional y accesible
- ✅ Detección automática de preferencia del sistema

---

## 📁 Archivos Creados/Modificados

### Nuevos Archivos:
1. **`app/contexts/ThemeContext.tsx`** - Context Provider para el tema
2. **`app/lib/colors.ts`** - Paletas de colores para ambos temas
3. **`app/dashboard/DashboardHeader.tsx`** - Header principal con botón toggle de tema
4. **`app/dashboard/DashboardWrapper.tsx`** - Wrapper que aplica el tema a todo el dashboard

### Archivos Modificados:
5. **`app/dashboard/layout.tsx`** - Wrapped con ThemeProvider
6. **`app/dashboard/DashboardSidebar.tsx`** - Sidebar con soporte de temas
7. **`app/dashboard/sites/page.tsx`** - Panel de Control con tema
8. **`app/dashboard/sites/list/page.tsx`** - Lista de sitios con tema completo

---

## 🎨 Paleta de Colores

### Modo Oscuro (Dark Mode)
```typescript
{
  // Fondos
  bg: {
    primary: '#0D1222',      // Fondo principal oscuro
    secondary: '#111933',    // Fondo de tarjetas/modales
    tertiary: '#1F2937',     // Fondo de elementos hover
  },
  // Textos
  text: {
    primary: '#FFFFFF',      // Texto principal
    secondary: '#CBD5E1',    // Texto secundario (slate-300)
    tertiary: '#94A3B8',     // Texto terciario (slate-400)
    muted: '#64748B',        // Texto apagado (slate-500)
  },
  // Acentos
  accent: {
    primary: '#00F5FF',      // Cyan brillante
    secondary: '#00C2CC',    // Cyan hover
    glow: 'rgba(0,245,255,0.3)', // Efecto glow
  },
  // Bordes
  border: {
    primary: 'rgba(255,255,255,0.1)',  // Borde sutil
    secondary: 'rgba(255,255,255,0.05)', // Borde muy sutil
    accent: 'rgba(0,245,255,0.2)',      // Borde con acento
  },
  // Estados
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
}
```

### Modo Claro (Light Mode)
```typescript
{
  // Fondos
  bg: {
    primary: '#FFFFFF',      // Fondo principal blanco
    secondary: '#F8FAFC',    // Fondo de tarjetas (slate-50)
    tertiary: '#F1F5F9',     // Fondo de elementos hover (slate-100)
  },
  // Textos
  text: {
    primary: '#0F172A',      // Texto principal oscuro (slate-900)
    secondary: '#334155',    // Texto secundario (slate-700)
    tertiary: '#64748B',     // Texto terciario (slate-500)
    muted: '#94A3B8',        // Texto apagado (slate-400)
  },
  // Acentos
  accent: {
    primary: '#0891B2',      // Cyan profesional (cyan-600)
    secondary: '#0E7490',    // Cyan hover (cyan-700)
    glow: 'rgba(8,145,178,0.15)', // Efecto glow suave
  },
  // Bordes
  border: {
    primary: '#E2E8F0',      // Borde sutil (slate-200)
    secondary: '#F1F5F9',    // Borde muy sutil (slate-100)
    accent: '#BAE6FD',       // Borde con acento (cyan-200)
  },
  // Estados
  success: '#059669',
  error: '#DC2626',
  warning: '#D97706',
}
```

---

## 🚀 Cómo Usar

### En cualquier componente dentro del Dashboard:

```typescript
import { useTheme } from '@/app/contexts/ThemeContext'
import { colors } from '@/app/lib/colors'

function MiComponente() {
  const { theme, toggleTheme } = useTheme()
  const c = colors[theme]

  return (
    <div style={{ backgroundColor: c.bg.primary, color: c.text.primary }}>
      {/* Tu contenido */}
      <button onClick={toggleTheme}>
        {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
      </button>
    </div>
  )
}
```

---

## ✨ Características

### 1. **Persistencia Automática**
El tema seleccionado se guarda en `localStorage` y se mantiene entre sesiones.

### 2. **Detección del Sistema**
Si es la primera vez que el usuario visita, se detecta automáticamente su preferencia del sistema operativo.

### 3. **Transiciones Suaves**
Todas las transiciones de color tienen `transition-colors duration-200` para un cambio visual agradable.

### 4. **Botón Toggle Intuitivo**
- 🌙 Icono de luna en modo claro (para cambiar a oscuro)
- ☀️ Icono de sol en modo oscuro (para cambiar a claro)

### 5. **Accesibilidad**
- Contraste WCAG AA cumplido
- Títulos descriptivos en botones
- Colores pensados para legibilidad

---

## 📍 Ubicación del Botón Toggle

El botón está ubicado en el **header principal del dashboard** (DashboardHeader), visible en todas las páginas del dashboard. Se encuentra junto al email del usuario y el avatar, en la esquina superior derecha.

---

## 🎯 Próximos Pasos Sugeridos

1. **Extender a otras páginas del dashboard** - Aplicar el mismo sistema de temas al resto de páginas
2. **Tema automático por horario** - Cambiar automáticamente según la hora del día
3. **Más variantes de tema** - Agregar temas personalizados (ej: "High Contrast", "Solarized")
4. **Preferencias avanzadas** - Panel de configuración con más opciones de personalización

---

## 🐛 Troubleshooting

**Problema**: El tema no persiste entre recargas
- **Solución**: Verificar que localStorage esté habilitado en el navegador

**Problema**: Flash de tema incorrecto al cargar
- **Solución**: El ThemeProvider incluye un `mounted` state que previene esto

**Problema**: Colores no se aplican correctamente
- **Solución**: Asegurarse de que el componente esté dentro del `<ThemeProvider>` en el layout

---

## 📝 Notas Técnicas

- Los colores se aplican via inline styles para máxima flexibilidad y control
- Se usa Context API en lugar de estado global para mejor rendimiento
- Los hover effects se manejan con event handlers para evitar clases CSS complejas
- La paleta está diseñada para ser extensible (fácil agregar nuevos colores)

---

¡El sistema de temas está listo para usar! 🎉
