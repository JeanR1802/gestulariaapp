# Guía para la Creación de Nuevos Bloques

Esta guía detalla el patrón para crear un nuevo bloque de contenido para el editor, asegurando que se integre correctamente con el resto del sistema.

Seguir estos pasos te permitirá añadir nuevas funcionalidades de forma consistente y sin errores de conexión.

---

### Resumen de la Arquitectura de un Bloque

Cada bloque está compuesto principalmente por 4 partes que deben funcionar en sintonía:

1.  **Definición del Bloque (Componentes de React)**: Define la estructura de datos del bloque, cómo se ve y se edita dentro del editor.
2.  **Registro del Bloque**: Un índice central donde se "registra" el nuevo bloque para que el editor lo reconozca.
3.  **Renderizador del Editor (`BlockRenderer.tsx`)**: Un componente que renderiza dinámicamente el bloque correcto dentro del editor.
4.  **Renderizador HTML (Servidor)**: Una función del lado del servidor que convierte los datos del bloque en HTML puro para la página pública final.

---

### Paso 1: Crear el Archivo de Definición del Bloque

Crea un nuevo archivo `.tsx` en `app/components/editor/blocks/`. Por ejemplo, `UserProfileBlock.tsx`.

Este archivo debe exportar 4 componentes principales: La Interfaz de Datos, el Componente de Renderizado, el Editor de Contenido y el Editor de Estilos. (Consulta la guía anterior para ver los detalles de cada uno).

### Paso 2: Registrar el Nuevo Bloque

Abre el archivo `app/components/editor/blocks/index.tsx`.

1.  **Importa** los componentes que creaste (el renderizador, los editores y el tipo de datos).
2.  **Añade tu tipo de datos** a la unión `BlockData`.
3.  **Añade tu bloque** a la interfaz `BlocksConfig`.
4.  **Añade la configuración** completa de tu bloque al objeto `BLOCKS`.

(Consulta la guía anterior para ver el ejemplo detallado).

### Paso 3: Añadir el Bloque al Renderizador del Editor

Este es un paso crucial para que el bloque se muestre correctamente dentro del área de edición.

Abre el archivo `app/components/editor/BlockRenderer.tsx`.

1.  **Importa el tipo de datos** de tu nuevo bloque en la parte superior del archivo.
    *Ejemplo:*
    ```typescript
    import { GalleryData } from './blocks/GalleryBlock';
    ```

2.  **Añade un `case`** al `switch (block.type)` dentro de la función `renderBlockContent`.
    *Ejemplo:*
    ```typescript
    case 'gallery': {
      const Component = BLOCKS.gallery.renderer;
      return <Component data={block.data as GalleryData} isEditing={isEditing} onUpdate={onUpdate} />;
    }
    ```
    Esto asegura que el componente correcto se renderice con los tipos de datos correctos.

### Paso 4: Implementar el Renderizado en el Servidor

Este paso es para que tu bloque se muestre en la página pública final. Abre el archivo `app/lib/render-blocks-to-html.js`.

1.  **Añade un `case`** para el `type` de tu nuevo bloque dentro del `switch (type)`.
2.  **Escribe la lógica** para generar el HTML. Esta lógica debe replicar la estructura y clases de tu componente de React del Paso 1.

(Consulta la guía anterior para ver el ejemplo detallado).


### Conclusión

Al seguir estos cuatro pasos, habrás integrado un nuevo bloque de forma completa y correcta. El patrón es:

1.  **Crear componentes** en `app/components/editor/blocks/NewBlock.tsx`.
2.  **Registrar** en `app/components/editor/blocks/index.tsx`.
3.  **Renderizar en el editor** en `app/components/editor/BlockRenderer.tsx`.
4.  **Renderizar HTML final** en `app/lib/render-blocks-to-html.js`.

Este enfoque mantiene una clara separación de responsabilidades y asegura que el sistema sea escalable y fácil de mantener.