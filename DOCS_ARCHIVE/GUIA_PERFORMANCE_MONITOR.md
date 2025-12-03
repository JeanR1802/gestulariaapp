# 🔍 Performance Monitor - Guía de Uso

## 📋 Descripción

Monitor de rendimiento en tiempo real que captura métricas durante 5 segundos y genera un reporte JSON completo con diagnóstico de performance.

---

## 🎯 Características

### ✅ Métricas Capturadas

1. **FPS (Frames por Segundo)**
   - Promedio, Mínimo, Máximo
   - Samples completos de cada frame
   - Alerta si < 50 FPS

2. **Memoria JavaScript**
   - Heap usado, total y límite
   - Porcentaje de uso
   - Alerta si > 60% usado

3. **Árbol DOM**
   - Conteo de nodos
   - Event listeners estimados
   - Style recalcs y layouts

4. **Página**
   - Cantidad de módulos totales
   - Módulos visibles en viewport
   - Altura y posición del scroll

5. **Actividad del Usuario**
   - Scroll events
   - Click events
   - Mouse events
   - Resize events

6. **Advertencias Automáticas**
   - Se generan basadas en thresholds
   - Indican problemas críticos

---

## 🚀 Cómo Usar

### Paso 1: Iniciar Grabación
```
1. Clic en el botón MORADO (ícono de gráfica) en la esquina inferior derecha
2. El botón se vuelve ROJO y pulsa → está grabando
3. Tienes 5 segundos para interactuar
```

### Paso 2: Interactuar
Durante los 5 segundos de grabación:
- ✅ Haz scroll por el dashboard
- ✅ Agrega módulos (KPI, Charts, Banners)
- ✅ Elimina módulos
- ✅ Pasa el mouse sobre elementos
- ✅ Cambia el tamaño de la ventana

### Paso 3: Ver Resultados
```
1. A los 5 segundos, se detiene automáticamente
2. Se abre un modal con el reporte completo
3. Revisa las advertencias (⚠️) en rojo
4. Analiza cada sección de métricas
```

### Paso 4: Exportar
```
Opciones en el footer del modal:
- 💾 Descargar JSON → Guarda archivo .json
- 📋 Copiar al Portapapeles → Pega en herramientas externas
```

---

## 📊 Ejemplo de Reporte JSON

```json
{
  "timestamp": "2025-11-24T10:30:45.123Z",
  "duration": 5023.45,
  
  "memory": {
    "usedJSHeapSize": 45678900,
    "totalJSHeapSize": 67891234,
    "jsHeapSizeLimit": 2172649472,
    "usedPercentage": 2.1
  },
  
  "fps": {
    "average": 58.3,
    "min": 42.1,
    "max": 60.0,
    "samples": [60, 59.5, 58.2, ...]
  },
  
  "dom": {
    "nodeCount": 842,
    "eventListeners": 127,
    "styleRecalcs": 15,
    "layouts": 8
  },
  
  "page": {
    "scrollHeight": 3240,
    "scrollTop": 1200,
    "moduleCount": 12,
    "visibleModules": 6
  },
  
  "activity": {
    "scrollEvents": 45,
    "clickEvents": 8,
    "mouseEvents": 234,
    "resizeEvents": 0
  },
  
  "warnings": [
    "⚡ FPS bajo: 42.1 (objetivo: 60)",
    "📊 Muchos módulos: 12 (considerar lazy loading)"
  ]
}
```

---

## 🎨 Interpretación de Colores

### En el Modal:

| Color | Significado | Ejemplo |
|-------|-------------|---------|
| 🟢 Verde | Óptimo | FPS > 50, Memoria < 60% |
| 🟡 Amarillo | Advertencia | FPS 30-50, Memoria 60-80% |
| 🔴 Rojo | Crítico | FPS < 30, Memoria > 80% |

---

## 📈 Thresholds de Advertencias

### FPS
```
✅ > 50 fps → Excelente
⚡ 30-50 fps → Advertencia
⚠️ < 30 fps → Crítico
```

### Memoria
```
✅ < 60% → Óptimo
🟡 60-80% → Advertencia
🔴 > 80% → Crítico
```

### DOM
```
✅ < 1500 nodos → Óptimo
📦 > 1500 nodos → Considerar virtualización
```

### Módulos
```
✅ < 20 módulos → Óptimo
📊 > 20 módulos → Considerar lazy loading
```

### Eventos
```
✅ < 100 scroll events → Óptimo
📜 > 100 scroll events → Usar throttle

✅ < 500 mouse events → Óptimo
🖱️ > 500 mouse events → Usar throttle
```

---

## 🔬 Casos de Uso

### Caso 1: Dashboard Lento con Scroll
**Problema:** El scroll se siente lagueado

**Pasos:**
1. Abre el dashboard con módulos existentes
2. Click en Performance Monitor (botón morado)
3. **Durante los 5 segundos:** Haz scroll rápido de arriba a abajo
4. Analiza el reporte:
   - Revisa **FPS average** (debe ser > 50)
   - Revisa **scrollEvents** (muchos = necesita throttle)
   - Revisa **DOM nodeCount** (> 1500 = problema)

**Solución esperada:**
```json
{
  "fps": { "average": 35.2 }, // ⚠️ Bajo
  "activity": { "scrollEvents": 150 }, // ⚠️ Muchos
  "warnings": [
    "⚠️ FPS muy bajo: 35.2",
    "📜 Muchos scroll events: 150 (usar throttle)"
  ]
}
```

---

### Caso 2: Inserción de Módulos Lenta
**Problema:** Al agregar módulos, el dashboard se congela

**Pasos:**
1. Click en Performance Monitor
2. **Durante los 5 segundos:** Agrega 3-4 módulos banner seguidos
3. Analiza:
   - **FPS min** (debe mantenerse > 30)
   - **Memory usedPercentage** (no debe subir drásticamente)
   - **layoutsRecalcs** (muchos = problema de CSS)

**Solución esperada:**
```json
{
  "fps": { "min": 25.1 }, // 🔴 Se cae al insertar
  "memory": { "usedPercentage": 45.2 }, // ✅ OK
  "dom": { "layouts": 32 }, // ⚠️ Muchos recalcs
  "warnings": [
    "⚠️ FPS muy bajo: 25.1"
  ]
}
```

**Diagnóstico:** Los layouts recalcs altos indican que CSS Grid está recalculando todo. Solución: quitar `grid-auto-flow: dense`.

---

### Caso 3: Comparación Antes/Después
**Objetivo:** Verificar que las optimizaciones funcionaron

**Pasos:**
1. **Antes de optimizar:**
   - Graba 5s con scroll + inserción
   - Descarga `performance-before.json`

2. **Aplicar optimizaciones:**
   - Agregar React.memo
   - Reducir blur
   - Agregar throttle a scroll

3. **Después de optimizar:**
   - Graba 5s con las mismas acciones
   - Descarga `performance-after.json`

4. **Comparar:**
```bash
# FPS
Before: 35.2 fps
After:  58.7 fps ✅ +66% mejora

# Memoria
Before: 65.3% usado
After:  42.1% usado ✅ -35% uso

# Eventos
Before: 150 scroll events
After:  45 scroll events ✅ -70% eventos (throttle funcionó)
```

---

## 🛠️ Herramientas Externas

### Visualizar JSON
Pega el JSON en:
- [JSONViewer](https://jsonviewer.stack.hu/)
- [JSON Hero](https://jsonhero.io/)

### Comparar Reportes
```bash
# Usar diff o herramientas como:
# - https://www.jsondiff.com/
# - https://jsondiff.netlify.app/
```

---

## 🎯 Métricas Clave por Problema

### Problema: Scroll Lento
**Métricas a revisar:**
- `fps.average` → < 50 = problema
- `activity.scrollEvents` → > 100 = problema
- `dom.nodeCount` → > 1500 = problema
- `page.moduleCount` → > 20 = considerar virtualización

**Soluciones:**
- Throttle scroll events
- Reducir blur en CSS
- Virtualizar lista de módulos

---

### Problema: Alto Uso de Memoria
**Métricas a revisar:**
- `memory.usedPercentage` → > 60% = advertencia
- `memory.usedJSHeapSize` → Analizar crecimiento
- `dom.eventListeners` → Muchos = memory leaks

**Soluciones:**
- Limpiar event listeners en useEffect
- Memoizar componentes con React.memo
- Reducir referencias circulares

---

### Problema: Inserción Lenta
**Métricas a revisar:**
- `fps.min` → Cae drásticamente al insertar
- `dom.layouts` → > 20 = problema de CSS
- `dom.styleRecalcs` → > 30 = problema de CSS

**Soluciones:**
- Remover `grid-auto-flow: dense`
- Usar `will-change` en elementos animados
- Reducir animaciones CSS

---

## 📝 Notas Técnicas

### Cómo Funciona

1. **FPS Measurement:**
```tsx
// Usa requestAnimationFrame para medir cada frame
const measureFrame = (currentTime) => {
  const frameDuration = currentTime - lastFrameTime;
  const fps = 1000 / frameDuration;
  frameTimes.push(fps);
};
```

2. **Memory API:**
```tsx
// Solo disponible en Chrome/Edge con flag
if ('memory' in performance) {
  const mem = performance.memory;
  // usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit
}
```

3. **Visible Modules:**
```tsx
// Usa getBoundingClientRect para detectar viewport
const isVisible = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
};
```

4. **Event Tracking:**
```tsx
// Listeners pasivos para no bloquear
window.addEventListener('scroll', handler, { passive: true });
```

---

## ⚙️ Configuración

### Cambiar Duración de Grabación
```tsx
// En PerformanceMonitor.tsx, línea ~205:
setTimeout(() => {
  stopRecording();
  cleanup();
}, 5000); // ← Cambiar a 10000 para 10 segundos
```

### Cambiar Thresholds
```tsx
// En generateWarnings(), línea ~174:
if (metrics.fps.average < 30) { // ← Cambiar threshold
  warnings.push(`⚠️ FPS muy bajo: ${metrics.fps.average.toFixed(1)}`);
}
```

---

## 🚫 Limitaciones

### 1. **Memory API**
- Solo disponible en Chrome/Edge
- Requiere flag: `--enable-precise-memory-info`
- En otros browsers: `memory: null`

### 2. **Performance Observer**
- Algunas métricas (LCP, CLS, TBT) requieren PerformanceObserver
- No implementado en v1 (opcional para v2)

### 3. **Precisión de Event Listeners**
- Es una estimación (cuenta elementos con listeners)
- No cuenta listeners registrados con JS puro

---

## ✅ Checklist de Diagnóstico

### Antes de Reportar Problema:
- [ ] Grabar reporte con dashboard VACÍO (baseline)
- [ ] Grabar reporte con 5 módulos
- [ ] Grabar reporte con 10 módulos
- [ ] Grabar reporte con 20 módulos
- [ ] Comparar FPS average entre reportes
- [ ] Comparar memory usage entre reportes
- [ ] Identificar threshold donde se degrada

### Al Reportar Problema:
- [ ] Adjuntar JSON completo
- [ ] Describir acciones realizadas durante los 5s
- [ ] Indicar cantidad de módulos en pantalla
- [ ] Mencionar browser y versión
- [ ] Incluir screenshot del dashboard

---

## 📚 Referencias

- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Memory API (Chrome)](https://developer.chrome.com/docs/devtools/memory-problems/)
- [getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect)

---

## 🎯 Ejemplo de Flujo Completo

```bash
# PASO 1: Baseline (sin módulos)
1. Borrar todos los módulos
2. Click botón morado
3. Esperar 5s
4. Descargar "baseline.json"

# PASO 2: Estrés test
1. Agregar 10 módulos banner
2. Click botón morado
3. Durante 5s: scroll rápido + agregar 2 módulos más
4. Descargar "stress-test.json"

# PASO 3: Análisis
{
  "baseline": {
    "fps": 60,
    "memory": 25%,
    "nodeCount": 450
  },
  "stress": {
    "fps": 35,      // ⚠️ -41% FPS
    "memory": 68%,  // ⚠️ +172% memoria
    "nodeCount": 1650 // ⚠️ +267% nodos
  }
}

# DIAGNÓSTICO:
- FPS cae significativamente → Problema de rendering
- Memoria sube mucho → Posible memory leak
- Nodos se triplican → DOM muy grande

# SOLUCIÓN:
1. Implementar virtualización (solo renderizar visibles)
2. Agregar React.memo a ModuleCard
3. Limpiar event listeners en unmount
```

---

**Fecha:** 24 de Noviembre, 2025  
**Versión:** 1.0  
**Estado:** ✅ Listo para Usar  
**Ubicación:** Botón morado en esquina inferior derecha del dashboard
