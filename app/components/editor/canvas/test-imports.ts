// Test file to verify all imports work correctly
import { AdvancedEditorCanvas } from './AdvancedEditorCanvas';
import { EditorSidebar } from './components/EditorSidebar';
import { HeaderPreview } from './components/HeaderPreview';
import { HeaderSlotZone } from './components/HeaderSlotZone';
import { HeaderElementRenderer } from './components/HeaderElementRenderer';
import { NormalBlockPreview } from './components/NormalBlockPreview';
import { AdvancedMobileToolbar } from './components/AdvancedMobileToolbar';
import { useEditorElements } from './hooks/useEditorElements';
import { getActiveSlots, getSlotClass, MAX_ELEMENTS_PER_SLOT } from './utils/headerHelpers';
import { getDefaultDataForType, generateElementId, ELEMENT_TYPES } from './utils/elementHelpers';

console.log('✅ All imports successful!');
console.log('Components:', { 
    AdvancedEditorCanvas, 
    EditorSidebar, 
    HeaderPreview, 
    HeaderSlotZone, 
    HeaderElementRenderer,
    NormalBlockPreview,
    AdvancedMobileToolbar
});
console.log('Hooks:', { useEditorElements });
console.log('Utils:', { 
    getActiveSlots, 
    getSlotClass, 
    MAX_ELEMENTS_PER_SLOT,
    getDefaultDataForType,
    generateElementId,
    ELEMENT_TYPES
});

export {};
