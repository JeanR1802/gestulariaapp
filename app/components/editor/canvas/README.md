# Advanced Editor Canvas - Estructura Refactorizada

## 📁 Estructura del Proyecto

```
canvas/
├── AdvancedEditorCanvas.tsx       # Componente principal (210 líneas)
├── AdvancedEditorCanvas_OLD_BACKUP.tsx  # Backup del archivo original (877 líneas)
├── ElementItem.tsx                # Componente de item de elemento
├── index.ts                       # Exports públicos
│
├── components/                    # Componentes reutilizables
│   ├── AdvancedMobileToolbar.tsx  # Barra de herramientas móvil
│   ├── EditorSidebar.tsx          # Sidebar con lista y añadir elementos
│   ├── HeaderElementRenderer.tsx  # Renderiza un elemento del header
│   ├── HeaderPreview.tsx          # Vista previa completa del header
│   ├── HeaderSlotZone.tsx         # Una zona individual del header (left/center/right)
│   └── NormalBlockPreview.tsx     # Vista previa para bloques normales
│
├── hooks/                         # Hooks personalizados
│   └── useEditorElements.ts       # Gestión del estado de elementos
│
└── utils/                         # Utilidades y helpers
    ├── elementHelpers.ts          # Funciones helper para elementos
    └── headerHelpers.ts           # Funciones helper para el header
```

## 🎯 Beneficios de la Refactorización

### Antes
- ✗ **1 archivo** con **877 líneas**
- ✗ Difícil de mantener y debuguear
- ✗ Lógica mezclada con presentación
- ✗ Código duplicado
- ✗ Difícil de testear

### Después
- ✓ **11 archivos** bien organizados
- ✓ Archivo principal con solo **210 líneas**
- ✓ Separación clara de responsabilidades
- ✓ Componentes reutilizables
- ✓ Fácil de testear y mantener
- ✓ Código DRY (Don't Repeat Yourself)

## 📦 Componentes Principales

### `AdvancedEditorCanvas.tsx`
Componente principal que orquesta todo el editor avanzado.
- Gestiona el estado global
- Coordina entre componentes
- Maneja eventos del usuario

### `EditorSidebar.tsx`
Barra lateral con dos vistas:
- **Lista**: Muestra elementos existentes
- **Añadir**: Galería de elementos disponibles

### `HeaderPreview.tsx`
Vista previa WYSIWYG del header con 3 zonas (left, center, right).

### `NormalBlockPreview.tsx`
Vista previa para bloques normales (no-header) con puntos de inserción.

## 🔧 Hooks

### `useEditorElements`
Hook personalizado que encapsula toda la lógica de gestión de elementos:
- Agregar elementos
- Eliminar elementos
- Mover elementos
- Actualizar elementos
- Llenar slots
- Gestión del modo de inserción

## 🛠️ Utilidades

### `elementHelpers.ts`
- `getDefaultDataForType()`: Datos por defecto para cada tipo
- `generateElementId()`: Genera IDs únicos
- `ELEMENT_TYPES`: Array con todos los tipos disponibles

### `headerHelpers.ts`
- `getActiveSlots()`: Agrupa elementos por zona
- `getSlotClass()`: Calcula clases CSS según zonas activas
- `MAX_ELEMENTS_PER_SLOT`: Constante de límite

## 🚀 Uso

```typescript
import { AdvancedEditorCanvas } from '@/app/components/editor/canvas';

<AdvancedEditorCanvas 
  block={block}
  onClose={handleClose}
  onSave={handleSave}
/>
```

## 🧪 Testing

Ahora cada componente puede ser testeado de forma independiente:

```typescript
// Ejemplo de test para HeaderSlotZone
import { HeaderSlotZone } from './components/HeaderSlotZone';

test('renders empty zone', () => {
  render(<HeaderSlotZone zone="left" elements={[]} ... />);
  // assertions
});
```

## 📝 Próximos Pasos

1. ✅ Refactorizar a componentes más pequeños
2. ✅ Extraer lógica a hooks personalizados
3. ✅ Crear utilidades reutilizables
4. ⏳ Agregar tests unitarios
5. ⏳ Mejorar accesibilidad (a11y)
6. ⏳ Agregar animaciones suaves
7. ⏳ Optimizar rendimiento con React.memo

## 🤝 Contribuir

Al agregar nuevas funcionalidades:
1. Mantén los componentes pequeños (< 200 líneas)
2. Extrae lógica compleja a hooks
3. Usa TypeScript para type safety
4. Documenta props y funciones
5. Agrega tests cuando sea posible
