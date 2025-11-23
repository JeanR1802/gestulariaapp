# 📊 Herramienta de Diagnóstico JSON - Header Editor

## ✅ Implementado

Se ha agregado un botón **"📊 Diagnóstico JSON"** en el editor de header que genera un reporte completo con todas las medidas, espacios y cálculos del sistema.

---

## 🎯 Propósito

Esta herramienta permite:
- **Debugging preciso** del sistema de verificación de espacio
- **Análisis de casos de borde** y comportamientos inesperados
- **Validación de la lógica** de modo fijo vs dinámico
- **Documentación** de estados específicos del header

---

## 🚀 Cómo Usar

### Paso 1: Configurar el Escenario
```
1. Abre el editor avanzado de un bloque header
2. Selecciona el modo (Fijo o Dinámico)
3. Agrega elementos a las zonas (izquierda, centro, derecha)
4. Reproduce el escenario que quieres analizar
```

### Paso 2: Generar Diagnóstico
```
1. Haz clic en el botón "📊 Diagnóstico JSON"
2. El sistema:
   ✅ Copia el JSON al clipboard
   ✅ Muestra el reporte en la consola del navegador
   ✅ Descarga un archivo JSON automáticamente
```

### Paso 3: Analizar el Reporte
```
1. Pega el JSON desde el clipboard (Ctrl+V)
2. O abre el archivo descargado
3. O revisa la consola del navegador (F12 → Console)
```

---

## 📋 Estructura del Reporte JSON

### Ejemplo de Salida

```json
{
  "timestamp": "2025-11-23T10:30:45.123Z",
  "modo": "fijo",
  
  "dimensiones": {
    "anchoTotalHeader": 1000,
    "gap": 10,
    "anchoLogo": 148
  },
  
  "elementos": {
    "izquierda": {
      "cantidad": 2,
      "anchoTotal": 296,
      "elementos": ["elem-001", "elem-002"]
    },
    "centro": {
      "cantidad": 0,
      "anchoTotal": 0,
      "posicionInicio": 500,
      "posicionFin": 500,
      "elementos": []
    },
    "derecha": {
      "cantidad": 2,
      "anchoTotal": 296,
      "posicionInicio": 704,
      "elementos": ["elem-003", "elem-004"]
    }
  },
  
  "espaciosLibres": {
    "izquierda": {
      "pixeles": 194,
      "logosQueCaben": 1,
      "porcentaje": "19.40%"
    },
    "derecha": {
      "pixeles": 194,
      "logosQueCaben": 1,
      "porcentaje": "19.40%"
    },
    "centro": {
      "nota": "En modo fijo, el centro acepta elementos si no toca los lados",
      "logosQueCabenAproximado": 1,
      "espacioMinimoRequerido": 148
    }
  },
  
  "verificacionModoFijo": {
    "izquierdaPuedeCrecer": true,
    "derechaPuedeCrecer": true,
    "centroPuedeCrecer": true,
    "limiteIzquierda": 490,
    "limiteDerecha": 510
  },
  
  "resumen": {
    "totalElementos": 4,
    "espacioUsado": 592,
    "espacioUsadoPorcentaje": "59.20%",
    "espacioLibreTotal": 388
  }
}
```

---

## 🔍 Campos Explicados

### 1. **timestamp**
- Momento exacto en que se generó el reporte
- Útil para comparar múltiples reportes

### 2. **modo**
- `"fijo"`: Centro permanece centrado
- `"dinamico"`: Centro se mueve con empuje

### 3. **dimensiones**
- `anchoTotalHeader`: Ancho total del header en píxeles
- `gap`: Espacio de separación entre zonas (10px)
- `anchoLogo`: Ancho de cada logo incluido gap (148px)

### 4. **elementos**
Para cada zona (izquierda, centro, derecha):
- `cantidad`: Número de elementos en la zona
- `anchoTotal`: Ancho ocupado por la zona en píxeles
- `posicionInicio/Fin`: Coordenadas X de la zona
- `elementos`: Array con IDs de los elementos

### 5. **espaciosLibres**
Para cada zona:
- `pixeles`: Espacio libre en píxeles
- `logosQueCaben`: Cuántos logos más cabrían
- `porcentaje`: Porcentaje del header que representa

### 6. **verificacionModoFijo** (solo en modo fijo)
- `izquierdaPuedeCrecer`: ¿Puede agregar más a la izquierda?
- `derechaPuedeCrecer`: ¿Puede agregar más a la derecha?
- `centroPuedeCrecer`: ¿Puede agregar más al centro?
- `limiteIzquierda`: Coordenada X donde termina el espacio izquierdo
- `limiteDerecha`: Coordenada X donde empieza el espacio derecho

### 7. **verificacionModoDinamico** (solo en modo dinámico)
- `espacioOcupado`: Total de espacio usado
- `espacioDisponible`: Total de espacio del header
- `espacioLibreTotal`: Espacio que sobra
- `logosQueCabenTotal`: Cuántos logos más cabrían en total

### 8. **resumen**
- `totalElementos`: Cantidad total de elementos
- `espacioUsado`: Píxeles totales ocupados
- `espacioUsadoPorcentaje`: % del header ocupado
- `espacioLibreTotal`: Espacio total disponible

---

## 🧪 Escenarios de Prueba para el Bug

### Escenario A: El Bug Original
```
Pasos:
1. Modo: FIJO
2. Agregar 2 logos a la izquierda
3. Agregar 2 logos a la derecha
4. Generar diagnóstico → diagnostico-A.json
5. Intentar agregar 1 logo al centro
   - Si rechaza: Anotar el mensaje
6. Generar diagnóstico → diagnostico-A-rechazado.json
```

**Análisis:**
- Comparar `espaciosLibres.centro` en ambos archivos
- Verificar `verificacionModoFijo.centroPuedeCrecer`
- Revisar `espaciosLibres.izquierda.pixeles` y `derecha.pixeles`

### Escenario B: La Solución Temporal
```
Pasos:
1. Modo: FIJO
2. Agregar 2 logos a la izquierda
3. Agregar 2 logos a la derecha
4. Generar diagnóstico → diagnostico-B1.json
5. Quitar 1 logo de la izquierda
6. Generar diagnóstico → diagnostico-B2.json
7. Agregar 1 logo al centro
8. Generar diagnóstico → diagnostico-B3.json
9. Agregar 1 logo a la izquierda
10. Generar diagnóstico → diagnostico-B4.json
```

**Análisis:**
- Comparar `elementos` en cada paso
- Ver cómo cambian `espaciosLibres` en cada transición
- Verificar si `diagnostico-A-rechazado` y `diagnostico-B4` tienen mismos elementos pero diferentes resultados

### Escenario C: Modo Dinámico
```
Pasos:
1. Modo: DINÁMICO
2. Agregar 5 logos a la izquierda
3. Generar diagnóstico → diagnostico-C1.json
4. Agregar 3 logos al centro
5. Generar diagnóstico → diagnostico-C2.json
6. Agregar 2 logos a la derecha
7. Generar diagnóstico → diagnostico-C3.json
```

**Análisis:**
- Ver `verificacionModoDinamico.espacioLibreTotal`
- Verificar cómo se calcula `logosQueCabenTotal`
- Comprobar que el empuje funciona correctamente

---

## 📊 Comparación de Diagnósticos

### Usando un Diff Tool
```bash
# En la terminal (con archivos descargados):
diff diagnostico-A-rechazado.json diagnostico-B4.json

# O usando una herramienta online:
# https://www.jsondiff.com/
```

### Puntos Clave a Comparar
```json
// ¿Son iguales estas secciones?
{
  "elementos.izquierda.cantidad": 2,
  "elementos.centro.cantidad": 1,
  "elementos.derecha.cantidad": 2,
  "espaciosLibres.izquierda.pixeles": ???,
  "espaciosLibres.derecha.pixeles": ???,
  "verificacionModoFijo.centroPuedeCrecer": ???
}
```

---

## 🐛 Detectando el Bug

### Síntomas del Bug
Si hay un bug en la verificación de espacio, verás:

```json
// Diagnóstico cuando RECHAZA:
{
  "espaciosLibres": {
    "izquierda": { "pixeles": 200 },  // ← Hay espacio!
    "centro": { "logosQueCabenAproximado": 1 },  // ← Dice que cabe!
    "derecha": { "pixeles": 200 }  // ← Hay espacio!
  },
  "verificacionModoFijo": {
    "centroPuedeCrecer": false  // ← Pero dice que NO puede crecer ❌
  }
}

// Diagnóstico cuando ACEPTA (después del workaround):
{
  "espaciosLibres": {
    "izquierda": { "pixeles": 348 },  // ← Más espacio que antes!
    "centro": { "logosQueCabenAproximado": 2 },
    "derecha": { "pixeles": 200 }
  },
  "verificacionModoFijo": {
    "centroPuedeCrecer": true  // ← Ahora SÍ puede crecer ✅
  }
}
```

**Conclusión**: Si el segundo tiene MÁS espacio pero es el que acepta, hay un bug lógico.

---

## 💾 Archivos Generados

Los diagnósticos se descargan con este formato:
```
diagnostico-header-[modo]-[timestamp].json

Ejemplos:
- diagnostico-header-fijo-1700745045123.json
- diagnostico-header-dinamico-1700745123456.json
```

**Ubicación**: Carpeta de descargas del navegador

---

## 🎨 Ubicación del Botón

```
┌─────────────────────────────────────────┐
│ [🔒 Modo Fijo Activo] [📊 Diagnóstico JSON] │
├─────────────────────────────────────────┤
│ 🔒 Modo Fijo: El centro permanece...   │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │  [Header con zonas]                 │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Color**: Morado (purple-600)
**Posición**: Esquina superior derecha del editor

---

## ✅ Checklist de Pruebas

- [ ] Generar diagnóstico en modo fijo sin elementos
- [ ] Generar diagnóstico en modo fijo con elementos
- [ ] Generar diagnóstico en modo dinámico sin elementos
- [ ] Generar diagnóstico en modo dinámico con elementos
- [ ] Reproducir Escenario A (el bug)
- [ ] Reproducir Escenario B (el workaround)
- [ ] Comparar JSONs de A vs B
- [ ] Identificar discrepancias en `espaciosLibres`
- [ ] Verificar logs de consola
- [ ] Descargar y analizar archivos JSON

---

## 📝 Formato de Reporte de Bug

Cuando encuentres un bug, usa este formato:

```markdown
### Bug Report

**Escenario**: [Descripción]
**Modo**: fijo/dinamico
**Pasos**: 
1. ...
2. ...

**Diagnóstico A** (rechazado):
```json
{
  "elementos": {...},
  "espaciosLibres": {...}
}
```

**Diagnóstico B** (aceptado después del workaround):
```json
{
  "elementos": {...},
  "espaciosLibres": {...}
}
```

**Problema Detectado**:
- Campo X en A: [valor]
- Campo X en B: [valor]
- Esperado: [valor]
- Observación: [descripción]
```

---

**Archivo modificado**: `SimpleHeaderEditor.tsx`
**Función agregada**: `generarDiagnostico()`
**Botón**: "📊 Diagnóstico JSON" (morado, esquina superior derecha)
**Estado**: ✅ LISTO PARA PRUEBAS
