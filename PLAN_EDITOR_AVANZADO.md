# Plan de Refactorización: Editor Avanzado

## Problema Actual
El editor avanzado es solo un prototipo sin funcionalidad real. No permite editar bloques de forma estructurada y la UI no es intuitiva.

## Solución Propuesta

### 1. **Arquitectura del Editor Avanzado**

#### Layout Mejorado:
```
┌─────────────────────────────────────────────────────────┐
│  🛠️ Edición Avanzada: Header        [Guardar] [Cerrar] │
├──────────────┬──────────────────────────┬───────────────┤
│              │                          │               │
│  ELEMENTOS   │   VISTA PREVIA          │  PROPIEDADES  │
│  (Sidebar)   │   (Canvas Central)       │  (Panel Der.) │
│              │                          │               │
│  + Texto     │  ┌──────────────────┐   │  📝 Heading   │
│  + Imagen    │  │ [Logo]  [Nav]    │   │  Contenido:   │
│  + Botón     │  │                  │   │  ┌─────────┐  │
│  + Spacer    │  │ Mi Título        │   │  │ Título  │  │
│              │  │                  │   │  └─────────┘  │
│              │  │ Texto aquí...    │   │  Nivel: H2    │
│              │  │                  │   │  Color: #000  │
│              │  │ [Botón CTA]      │   │               │
│              │  └──────────────────┘   │               │
└──────────────┴──────────────────────────┴───────────────┘
```

### 2. **Funcionalidades Clave**

#### A. Añadir Elementos
- **Drag & Drop**: Arrastrar elementos desde el sidebar al canvas
- **Click to Add**: Click en el elemento + click en posición del canvas
- **Shortcuts**: Teclas rápidas (T para texto, I para imagen, etc.)

#### B. Editar Elementos
- **Click para seleccionar**: Al hacer click en un elemento, se muestra en el panel de propiedades
- **Edición inline**: Doble click para editar texto directamente
- **Panel de propiedades**: Formulario dinámico según el tipo de elemento

#### C. Organizar Elementos
- **Reordenar**: Drag & drop para cambiar orden
- **Alinear**: Botones de alineación (izq, centro, der)
- **Espaciado**: Control de márgenes y padding

### 3. **Tipos de Elementos Soportados**

```typescript
type ElementType = 
  | 'heading'      // Títulos (H1-H6)
  | 'paragraph'    // Párrafos de texto
  | 'image'        // Imágenes
  | 'button'       // Botones CTA
  | 'link'         // Enlaces
  | 'spacer'       // Espaciadores
  | 'divider'      // Líneas divisoras
  | 'container'    // Contenedores flex/grid
```

### 4. **Estructura de Datos**

```typescript
interface AdvancedBlockData {
  elements: StackElement[];
  layout: 'stack' | 'flex' | 'grid';
  spacing: number;
  backgroundColor?: string;
  padding?: { top: number; right: number; bottom: number; left: number };
}

interface StackElement {
  id: string;
  type: ElementType;
  data: ElementData;
  style?: {
    textAlign?: 'left' | 'center' | 'right';
    fontSize?: number;
    color?: string;
    backgroundColor?: string;
    padding?: number;
    margin?: number;
  };
}
```

### 5. **Flujo de Trabajo del Usuario**

1. **Abrir Editor Avanzado**: Click en "Editar Avanzado" en un bloque
2. **Ver Estructura Actual**: El canvas muestra los elementos existentes
3. **Añadir Elemento**:
   - Click en "+" o en tipo de elemento en sidebar
   - Click en posición donde insertar
   - Se abre panel de propiedades
4. **Editar Elemento**:
   - Click en elemento en canvas
   - Panel de propiedades se actualiza
   - Modificar valores
   - Cambios se reflejan en tiempo real
5. **Guardar**: Click en "Guardar" para aplicar cambios

### 6. **Componentes a Crear**

```
components/
  advanced-editor/
    AdvancedEditor.tsx          // Componente principal
    ElementsSidebar.tsx         // Lista de elementos disponibles
    Canvas.tsx                  // Vista previa editable
    PropertiesPanel.tsx         // Panel de propiedades dinámico
    ElementRenderer.tsx         // Renderiza cada tipo de elemento
    DragDropContext.tsx         // Contexto para drag & drop
```

### 7. **Mejoras de UX**

- **Undo/Redo**: Historial de cambios
- **Previsualización**: Toggle entre modo edición y vista final
- **Responsive**: Vista previa en mobile/tablet/desktop
- **Shortcuts**: Atajos de teclado
- **Validación**: Prevenir errores (ej: imagen sin URL)
- **Feedback visual**: Indicadores de drop zones, elementos seleccionados

### 8. **Implementación por Fases**

**Fase 1** (MVP):
- Layout básico (3 columnas)
- Añadir elementos por click
- Editar propiedades básicas (texto, color)
- Guardar cambios

**Fase 2**:
- Drag & Drop
- Reordenar elementos
- Más tipos de elementos
- Estilos avanzados

**Fase 3**:
- Undo/Redo
- Previsualización responsive
- Shortcuts de teclado
- Templates predefinidos
