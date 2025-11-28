# Sistema de Paletas de Colores - Documentación

## 📚 Descripción General

Se ha implementado un sistema completo de paletas de colores que permite a los usuarios personalizar la apariencia del dashboard eligiendo entre diferentes esquemas de color. El sistema mantiene la compatibilidad con el modo claro/oscuro existente.

## 🎨 Paletas Disponibles

### 1. **Púrpura** (Predeterminada)
- Color principal: `#4816F0` (Indigo Eléctrico)
- Ideal para: Diseño corporativo, aspecto profesional
- Mantiene el esquema de color original del dashboard

### 2. **Azul**
- Color principal: `#0EA5E9` (Azul Cielo)
- Ideal para: Aplicaciones tecnológicas, aspecto fresco y limpio
- Transmite confianza y estabilidad

### 3. **Verde**
- Color principal: `#10B981` (Verde Esmeralda)
- Ideal para: Aplicaciones ambientales, salud, finanzas
- Transmite crecimiento y prosperidad

### 4. **Naranja**
- Color principal: `#F97316` (Naranja Vibrante)
- Ideal para: Creatividad, energía, entusiasmo
- Perfecto para marcas dinámicas

### 5. **Rosa**
- Color principal: `#EC4899` (Rosa Brillante)
- Ideal para: Diseño moderno, aplicaciones de estilo de vida
- Transmite creatividad y sofisticación

## 🛠️ Archivos Modificados

### 1. **`app/lib/colors.ts`**
- Se agregaron 5 paletas de colores completas
- Cada paleta incluye variantes para modo claro y oscuro
- Se mantiene retrocompatibilidad con el código existente

### 2. **`app/contexts/ThemeContext.tsx`**
- Extendido para manejar la paleta seleccionada
- Nuevas funciones: `palette` y `setPalette`
- Persistencia en `localStorage` de la paleta elegida

### 3. **`app/components/ColorPalettePicker.tsx`** (NUEVO)
- Componente visual para seleccionar la paleta
- Panel flotante con preview de colores
- Se cierra automáticamente al hacer clic fuera

### 4. **`app/dashboard/DashboardHeader.tsx`**
- Incluye el selector de paletas
- Posicionado junto al botón de tema claro/oscuro

### 5. Componentes actualizados para usar paletas:
- `DashboardSidebar.tsx`
- `DashboardWrapper.tsx`
- `dashboard/page.tsx`
- `dashboard/sites/page.tsx`
- `dashboard/sites/list/page.tsx`

## 📖 Uso

### Para el Usuario

1. **Abrir el selector de paletas:**
   - Haz clic en el ícono de paleta (🎨) en el header del dashboard

2. **Seleccionar una paleta:**
   - Elige entre las 5 paletas disponibles
   - Los cambios se aplican inmediatamente

3. **Persistencia:**
   - La paleta seleccionada se guarda automáticamente
   - Se mantiene entre sesiones

### Para Desarrolladores

#### Obtener la paleta actual en un componente:

```tsx
import { useTheme } from '@/app/contexts/ThemeContext';
import { colorPalettes } from '@/app/lib/colors';

function MyComponent() {
  const { theme, palette } = useTheme();
  const c = colorPalettes[palette][theme];
  
  return (
    <div style={{ backgroundColor: c.bg.primary, color: c.text.primary }}>
      Mi contenido
    </div>
  );
}
```

#### Cambiar la paleta programáticamente:

```tsx
import { useTheme } from '@/app/contexts/ThemeContext';

function MyComponent() {
  const { setPalette } = useTheme();
  
  const handleChangePalette = () => {
    setPalette('blue'); // 'purple', 'blue', 'green', 'orange', 'pink'
  };
  
  return <button onClick={handleChangePalette}>Cambiar a Azul</button>;
}
```

#### Agregar una nueva paleta:

1. Edita `app/lib/colors.ts`
2. Agrega un nuevo tipo en `ColorPalette`:
   ```typescript
   export type ColorPalette = 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'tu-nueva-paleta';
   ```
3. Agrega la definición completa en `colorPalettes`:
   ```typescript
   'tu-nueva-paleta': {
     name: 'Tu Nombre',
     dark: { /* colores modo oscuro */ },
     light: { /* colores modo claro */ }
   }
   ```
4. Actualiza `paletteColors` en `ColorPalettePicker.tsx`

## 🎯 Estructura de una Paleta

Cada paleta contiene:

```typescript
{
  name: string,           // Nombre mostrado al usuario
  dark: {                // Colores para modo oscuro
    bg: {                // Fondos
      primary: string,
      secondary: string,
      tertiary: string
    },
    text: {              // Textos
      primary: string,
      secondary: string,
      tertiary: string,
      muted: string
    },
    accent: {            // Acentos
      primary: string,
      secondary: string,
      glow: string
    },
    border: {            // Bordes
      primary: string,
      secondary: string,
      accent: string
    },
    button: {            // Botones
      primary: { bg, hover, text },
      secondary: { bg, hover, text }
    },
    success: string,     // Estados
    error: string,
    warning: string
  },
  light: { /* misma estructura para modo claro */ }
}
```

## ✨ Características

- **5 paletas predefinidas** con colores cuidadosamente seleccionados
- **Compatible con modo claro/oscuro** - Cada paleta tiene variantes para ambos modos
- **Persistencia automática** - La selección se guarda en localStorage
- **UI intuitiva** - Selector visual con preview de colores
- **Totalmente tipado** - TypeScript para seguridad de tipos
- **Retrocompatible** - El código existente sigue funcionando
- **Fácil de extender** - Agregar nuevas paletas es sencillo

## 🔧 Consideraciones Técnicas

- Las paletas se cargan desde `localStorage` al iniciar la aplicación
- El cambio de paleta es instantáneo sin necesidad de recargar
- Todos los componentes del dashboard respetan la paleta seleccionada
- El sistema usa CSS-in-JS para aplicar los colores dinámicamente

## 📝 Notas

- La paleta por defecto es **Púrpura** (el esquema original)
- Los colores de estado (success, error, warning) son consistentes entre paletas
- El selector de paletas está disponible en el header del dashboard
- El cambio de paleta no afecta el contenido del sitio web generado

## 🚀 Próximas Mejoras

Posibles mejoras futuras:
- Paletas personalizadas creadas por el usuario
- Importar/exportar paletas
- Temas predefinidos (ej. "Corporativo", "Creativo", "Minimalista")
- Vista previa en tiempo real antes de aplicar
- Sincronización de paletas entre dispositivos

---

**Fecha de implementación:** 27 de noviembre de 2025  
**Versión:** 1.0.0
