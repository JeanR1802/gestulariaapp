# Fix: Custom Header Layout en Sitio Público

## Problema Identificado

El header personalizado (creado con el editor avanzado) no se renderizaba correctamente en el sitio público:

1. **No respetaba el modo fijo/dinámico**: En el editor, el usuario puede elegir entre:
   - **Modo Fijo**: El centro está siempre centrado, los laterales no pueden tocarlo
   - **Modo Dinámico**: El centro se mueve si los laterales lo empujan (flex layout)

2. **Padding aplicado incorrectamente**: El padding se aplicaba al `<header>` exterior en lugar del contenedor interno, causando que los elementos no respetaran el espaciado configurado.

3. **Layout simplificado**: El sitio público usaba un simple `grid grid-cols-3` sin lógica de posicionamiento, ignorando la complejidad del editor.

---

## Solución Implementada

### 1. Refactorización del Caso `custom` en `render-blocks-to-html.js`

**Archivo modificado**: `app/lib/render-blocks-to-html.js`

#### Cambios realizados:

**a) Detección del modo de layout:**
```javascript
// Get mode (default to 'fijo' if not specified, match editor's headerMode field)
const layoutMode = data.headerMode || data.mode || 'fijo';
```

**b) Renderizado para Modo Fijo:**
```javascript
if (layoutMode === 'fijo') {
  // Fixed mode: center is always centered, left/right absolute positioned
  // Padding is applied via invisible spacers (matching editor logic)
  headerHtml = `
    <div class="max-w-6xl mx-auto w-full relative" style="height:90px;">
      ${paddingLeft > 0 ? `<div style="position:absolute;left:0;top:0;width:${paddingLeft}px;height:100%;pointer-events:none;"></div>` : ''}
      ${paddingRight > 0 ? `<div style="position:absolute;right:0;top:0;width:${paddingRight}px;height:100%;pointer-events:none;"></div>` : ''}
      
      <div class="absolute h-full flex items-center gap-2" style="left:${paddingLeft}px;">
        ${leftElements.map(renderElement).join('')}
      </div>
      
      <div class="absolute h-full flex items-center justify-center gap-2" style="left:50%;transform:translateX(-50%);">
        ${centerElements.map(renderElement).join('')}
      </div>
      
      <div class="absolute h-full flex items-center flex-row-reverse gap-2" style="right:${paddingRight}px;">
        ${rightElements.map(renderElement).join('')}
      </div>
    </div>
  `;
}
```

**Características del Modo Fijo:**
- ✅ Centro con `left:50%; transform:translateX(-50%)` (siempre centrado)
- ✅ Laterales con `position: absolute` y `left`/`right` respetando padding
- ✅ Padding mediante spacers invisibles con `pointer-events:none`

**c) Renderizado para Modo Dinámico:**
```javascript
else {
  // Dynamic mode: flex layout, center can be pushed
  // Padding still applied via spacers for consistency
  headerHtml = `
    <div class="max-w-6xl mx-auto w-full flex items-center justify-between" style="height:90px;">
      ${paddingLeft > 0 ? `<div style="width:${paddingLeft}px;flex-shrink:0;"></div>` : ''}
      
      <div class="flex items-center gap-2">
        ${leftElements.map(renderElement).join('')}
      </div>
      
      <div class="flex items-center justify-center gap-2">
        ${centerElements.map(renderElement).join('')}
      </div>
      
      <div class="flex items-center flex-row-reverse gap-2">
        ${rightElements.map(renderElement).join('')}
      </div>
      
      ${paddingRight > 0 ? `<div style="width:${paddingRight}px;flex-shrink:0;"></div>` : ''}
    </div>
  `;
}
```

**Características del Modo Dinámico:**
- ✅ Layout `flex` con `justify-between` (distribuye espacio)
- ✅ Centro puede moverse si los laterales crecen
- ✅ Padding mediante spacers con `flex-shrink:0`

### 2. Eliminar Padding del `<header>` Exterior

**Problema anterior:**
```javascript
return `<header class="bg-white p-4 ...">...</header>`;
```
El `p-4` (padding de 16px) se aplicaba al header, interfiriendo con el padding interno configurado.

**Solución:**
```javascript
// For custom variant, don't apply p-4 padding to outer header (padding is handled internally)
const outerPadding = data.variant === 'custom' ? '' : 'p-4';
return `<header class="${bg.class} ${outerPadding} w-full ...">...</header>`;
```

Ahora el header custom **NO** tiene `p-4`, solo las otras variantes (centered, withButton, sticky, nueva).

---

## Estructura HTML Resultante

### Modo Fijo (Ejemplo con padding 50px a la izquierda, 30px a la derecha):

```html
<header class="bg-white w-full" style="background-color:#ffffff;">
  <div class="max-w-6xl mx-auto w-full relative" style="height:90px;">
    <!-- Spacer izquierdo (invisible) -->
    <div style="position:absolute;left:0;top:0;width:50px;height:100%;pointer-events:none;"></div>
    <!-- Spacer derecho (invisible) -->
    <div style="position:absolute;right:0;top:0;width:30px;height:100%;pointer-events:none;"></div>
    
    <!-- Zona izquierda (absolute, respetando padding) -->
    <div class="absolute h-full flex items-center gap-2" style="left:50px;">
      <span class="font-bold text-xl">Logo</span>
      <a href="#" class="text-sm">Inicio</a>
    </div>
    
    <!-- Zona centro (absolute, centrado) -->
    <div class="absolute h-full flex items-center justify-center gap-2" style="left:50%;transform:translateX(-50%);">
      <a href="#" class="text-sm">Servicios</a>
    </div>
    
    <!-- Zona derecha (absolute, respetando padding) -->
    <div class="absolute h-full flex items-center flex-row-reverse gap-2" style="right:30px;">
      <a href="#" class="px-4 py-2 rounded-md bg-blue-600">CTA</a>
    </div>
  </div>
</header>
```

### Modo Dinámico (Ejemplo con padding 50px a la izquierda, 30px a la derecha):

```html
<header class="bg-white w-full" style="background-color:#ffffff;">
  <div class="max-w-6xl mx-auto w-full flex items-center justify-between" style="height:90px;">
    <!-- Spacer izquierdo (flex-shrink:0) -->
    <div style="width:50px;flex-shrink:0;"></div>
    
    <!-- Zona izquierda -->
    <div class="flex items-center gap-2">
      <span class="font-bold text-xl">Logo</span>
      <a href="#" class="text-sm">Inicio</a>
    </div>
    
    <!-- Zona centro -->
    <div class="flex items-center justify-center gap-2">
      <a href="#" class="text-sm">Servicios</a>
    </div>
    
    <!-- Zona derecha -->
    <div class="flex items-center flex-row-reverse gap-2">
      <a href="#" class="px-4 py-2 rounded-md bg-blue-600">CTA</a>
    </div>
    
    <!-- Spacer derecho (flex-shrink:0) -->
    <div style="width:30px;flex-shrink:0;"></div>
  </div>
</header>
```

---

## Validación

### ✅ Checklist de Funcionalidades:

1. **Modo Fijo**: El centro está siempre centrado, no importa cuántos elementos haya en los laterales
2. **Modo Dinámico**: El centro se mueve si los laterales crecen (flex layout)
3. **Padding Interno**: Los valores `paddingLeft` y `paddingRight` se aplican mediante spacers internos
4. **Sin Padding Exterior**: El `<header>` custom NO tiene `p-4`
5. **Compatibilidad**: Otras variantes (centered, withButton, sticky, nueva) mantienen su `p-4`
6. **Data Source**: Lee `data.headerMode` (campo del editor) o `data.mode` como fallback

### Próximos Pasos de Prueba:

1. **Crear un header personalizado en el editor avanzado**:
   - Agregar elementos en las tres zonas (izquierda, centro, derecha)
   - Configurar padding (ej. 50px izquierda, 30px derecha)
   - Probar en modo Fijo y Dinámico

2. **Guardar y verificar en el sitio público**:
   - El layout debe ser idéntico al del editor
   - El padding debe respetar los valores configurados
   - El modo (fijo/dinámico) debe comportarse correctamente

3. **Casos de borde**:
   - ¿Qué pasa si no hay padding? (debe funcionar sin spacers)
   - ¿Qué pasa si no hay elementos en el centro? (debe mantener layout)
   - ¿Qué pasa si hay muchos elementos? (debe respetar límites del modo)

---

## Archivos Modificados

- ✅ `app/lib/render-blocks-to-html.js`: Refactorizado caso `custom` con lógica de modo fijo/dinámico y padding interno
- ✅ `app/lib/render-blocks-to-html.js`: Eliminado `p-4` del header exterior cuando es `variant='custom'`

---

## Notas Técnicas

### Por qué usar `position: absolute` en modo fijo:

El modo fijo requiere que el centro esté **siempre centrado** independientemente del tamaño de los laterales. Esto solo se logra con posicionamiento absoluto y `left:50%; transform:translateX(-50%)`. Un layout flex no garantiza esto porque los elementos empujan el centro.

### Por qué usar spacers invisibles:

Los spacers (`pointer-events:none` o `flex-shrink:0`) simulan el padding sin aplicarlo directamente al contenedor. Esto permite:
- Mantener el ancho total del header consistente
- Que los elementos internos respeten el espaciado
- Evitar conflictos con otros estilos del header

### Compatibilidad con el editor:

El editor (`SimpleHeaderEditor.tsx`) usa exactamente la misma lógica:
- Spacers invisibles para padding
- `position: absolute` en modo fijo
- Flex layout en modo dinámico
- Campo `headerMode` en `block.data`

Esto asegura **paridad visual 1:1** entre editor y sitio público.

---

## Fecha de Implementación

**2024** - Refactorización completa del sistema de renderizado de headers personalizados para el sitio público.
