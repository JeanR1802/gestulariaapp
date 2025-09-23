# Banner Block: Integración y Convenciones

## 1. Estructura de Archivos

```
app/components/editor/blocks/Banner.tsx                # Archivo principal del bloque Banner
app/components/editor/blocks/Banner/BannerPreviews.tsx # Previsualización del bloque Banner
```

## 2. Descripción y Objetivo

El bloque **Banner** permite mostrar un mensaje destacado con imagen, color de fondo y texto personalizado. Es ideal para encabezados, anuncios o llamadas a la acción. Cumple con la modularidad y separación de lógica/UI del sistema.

## 3. Conexión y Flujo de Archivos

- **Banner.tsx**: Define la estructura, props y lógica del bloque Banner. Expone las propiedades editables (color, texto, imagen) y utiliza los controles existentes del editor para modificarlas.
- **BannerPreviews.tsx**: Muestra variantes visuales del bloque Banner en el editor, facilitando la selección y previsualización.
- **BlockRenderer.tsx**: Importa y renderiza el bloque Banner cuando el usuario lo agrega a la página. Detecta el tipo de bloque y pasa los datos y controles correspondientes.
- **Controles**: Los componentes de `/controls/` (ColorPicker, InlineEditorPanel, etc.) permiten editar las propiedades del Banner desde la UI del editor.
- **Utilidades de /lib/**: Si se requiere manipulación de datos, validación o helpers, se importan desde `/lib/utils.ts` u otros archivos de utilidades.

## 4. Ejemplo de Conexión

1. El usuario agrega un Banner desde el editor visual.
2. `BlockRenderer.tsx` detecta el tipo `Banner` y renderiza `<Banner {...props} />`.
3. El usuario edita color, texto o imagen usando los controles existentes.
4. Los cambios se reflejan en tiempo real y pueden verse en la previsualización (`BannerPreviews.tsx`).
5. Los datos editados se guardan y procesan igual que otros bloques.

## 5. Convenciones y Patrones

- **Nomenclatura:**
  - Archivo principal: `Banner.tsx`
  - Previsualización: `BannerPreviews.tsx` en subcarpeta `/Banner/`
- **Modularidad:**
  - El bloque es independiente y reutilizable.
- **Separación UI/lógica:**
  - Lógica mínima en el componente, UI clara y controlada por props.
- **Compatibilidad:**
  - Usa los mismos controles y utilidades que otros bloques para mantener coherencia.

## 6. Ejemplo de Código (esqueleto)

### Banner.tsx
```tsx
import React from 'react';
import { ColorPicker, InlineEditorPanel } from '../controls';

export interface BannerData {
  text: string;
  bgColor: string;
  imageUrl?: string;
}

export function Banner({ data, onChange }: { data: BannerData; onChange: (data: BannerData) => void }) {
  // ...lógica de renderizado y controles...
  return (
    <div style={{ background: data.bgColor }} className="rounded p-6 flex items-center gap-4">
      {data.imageUrl && <img src={data.imageUrl} alt="Banner" className="h-16 w-16 object-cover rounded" />}
      <InlineEditorPanel value={data.text} onChange={text => onChange({ ...data, text })} />
      <ColorPicker value={data.bgColor} onChange={bgColor => onChange({ ...data, bgColor })} />
    </div>
  );
}
```

### BannerPreviews.tsx
```tsx
import React from 'react';
import { BannerData } from '../Banner';

export function BannerPreviewDefault({ data }: { data: BannerData }) {
  return (
    <div style={{ background: data.bgColor }} className="rounded p-4 flex items-center gap-2">
      {data.imageUrl && <div className="h-10 w-10 bg-slate-200 rounded" />}
      <div className="text-lg font-bold">{data.text || 'Texto de ejemplo'}</div>
    </div>
  );
}
```

---

> Para agregar el bloque Banner al editor, importa y registra el componente en `BlockRenderer.tsx` siguiendo el patrón de los demás bloques. Los controles existentes permiten editar sus propiedades sin necesidad de crear nuevos componentes de edición.

> Si necesitas lógica adicional (por ejemplo, validación de color o URL), utiliza helpers de `/lib/utils.ts` para mantener la coherencia y reutilización.
