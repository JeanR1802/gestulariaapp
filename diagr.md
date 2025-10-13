flowchart TD
    subgraph Fase 1: Selección y Creación del Bloque
        A((Inicio: Usuario en app/dashboard/sites/id/page.tsx)) --> B["Pulsar botón que activa setActiveBlockType('header')"];
        B --> C["El estado activeBlockType se establece en 'header'"];
        C --> D["Se renderiza el componente AddBlockPanel"];
        D --> E["AddBlockPanel lee el objeto BLOCKS desde app/components/editor/blocks/index.tsx"];
        E --> F["Filtra por blockType ('header') para obtener sus variantes y previsualizaciones"];
        F --> G["Renderiza las variantes usando componentes desde app/components/editor/blocks/Header/HeaderPreviews.tsx"];
        G -- Selección de variante --> H["Se llama a la función onAddBlock(blockType, variant.defaultData) en id/page.tsx"];
        H --> I["La función addBlock crea un objeto Block con ID único y los datos por defecto"];
        I --> J["setBlocks([...blocks, newBlock]) actualiza el estado principal de la página"];
    end

    subgraph Fase 2: Renderizado en el Editor
        J --> K["React detecta el cambio de estado y re-renderiza id/page.tsx"];
        K --> L["El componente mapea el array blocks y llama a BlockRenderer.tsx para el nuevo bloque"];
        L --> M["BlockRenderer.tsx recibe el block como prop"];
        M --> N{"Switch en renderBlockContent() evalúa block.type"};
        N -- Es 'header' --> O["Obtiene BLOCKS.header.renderer (que es HeaderBlock) desde index.tsx"];
        O --> P["Renderiza el componente HeaderBlock de HeaderBlock.tsx, pasándole los datos (data)"];
        P --> Q{"HeaderBlock.tsx evalúa data.variant para decidir qué diseño mostrar"};
        Q -- Es 'default', 'centered' o 'withButton' --> R["Renderiza el componente de variante correspondiente (ej: HeaderDefault)"];
        R --> S["El bloque Header es visible, envuelto en BlockWrapper.tsx"];
    end

    subgraph Fase 3: Proceso de Edición
        S --> T{"¿Usuario hace clic sobre el bloque?"};
        T -- Sí --> U["BlockWrapper.tsx (en onClick) llama a la función onEdit() pasada como prop"];
        U --> V["onEdit en id/page.tsx ejecuta setEditingBlockId(block.id)"];
        V --> W["El estado cambia y se renderiza InlineEditorPanel.tsx con el editingBlock"];
        W --> X["InlineEditorPanel.tsx obtiene los componentes de edición desde BLOCKS[block.type] en index.tsx"];
        X --> Y["Carga HeaderContentEditor y HeaderStyleEditor desde HeaderBlock.tsx"];
        Y --> Z["Usuario interactúa con los inputs de los editores (ej: InputField)"];
        Z --> AA["El onChange de un input llama a updateData(key, value) definido en HeaderContentEditor"];
        AA --> AB["updateData llama a la función handleLocalUpdate dentro de InlineEditorPanel.tsx"];
        AB --> AC["handleLocalUpdate actualiza su estado local (localData) con setLocalData()"];
        AC --> AD["Un useEffect en InlineEditorPanel.tsx detecta el cambio en localData y llama a onDataChange"];
        AD --> AE["onDataChange en id/page.tsx ejecuta updateBlockData(editingBlockId, newData)"];
        AE --> J;
        T -- No --> AF((Fin del Flujo));
    end
