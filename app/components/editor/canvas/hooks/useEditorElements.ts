import { useState, useMemo } from 'react';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { BlockData, Block } from '@/app/components/editor/blocks';
import { getDefaultDataForType, generateElementId } from '../utils/elementHelpers';

export function useEditorElements(block: Block, localData: BlockData, setLocalData: (data: BlockData) => void) {
    const [insertingType, setInsertingType] = useState<StackElementType | null>(null);

    // Default maximum number of real elements allowed per slot/zone
    const DEFAULT_MAX_PER_SLOT = 10;

    // Inicializar customElements a partir de los datos locales — NO crear placeholders automáticos para headers
    const customElements = useMemo(() => {
        const data = localData as BlockData & { customElements?: StackElement[] };
        const existing = data.customElements;
        return existing || [];
    }, [localData]) as StackElement[];

    const setCustomElements = (elements: StackElement[]) => {
        // Ensure every element has a valid zone and row
        const normalized = elements.map(el => ({ ...el, data: { ...(el.data || {}), zone: (el.data as any)?.zone || 'center', row: (el.data as any)?.row ?? 0 } }));
        // Prune empty slot placeholders automatically: remove elements of type 'slot' that are still marked empty
        // If a slot doesn't have explicit isEmpty flag, treat it as empty only when it has no meaningful properties
        const pruned = normalized.filter(el => {
            if (el.type !== 'slot') return true;
            const d = el.data as any;
            // Consider non-empty if it has content or any property other than zone/row/slotType/isEmpty/placeholder/acceptedTypes
            const keys = Object.keys(d || {}).filter(k => !['zone','row','slotType','isEmpty','placeholder','acceptedTypes'].includes(k));
            const hasMeaningful = keys.length > 0;
            return hasMeaningful === true ? true : false;
        });
        console.log('[useEditorElements] setCustomElements - normalized elements', normalized.map(e => ({ id: e.id, type: e.type, zone: (e.data as any)?.zone, row: (e.data as any)?.row })));
        if (pruned.length !== normalized.length) {
            console.log('[useEditorElements] setCustomElements - pruned empty slots', normalized.length - pruned.length);
        }

        // Ensure every row has structural slot placeholders for left/center/right so they can reappear
        // when space becomes available. We'll build a rows map and flatten.
        const rowsMap = new Map<number, { left: StackElement[]; center: StackElement[]; right: StackElement[] }>();
        pruned.forEach(el => {
            const row = (el.data as any)?.row ?? 0;
            const zone = ((el.data as any)?.zone as 'left' | 'center' | 'right') || 'center';
            if (!rowsMap.has(row)) rowsMap.set(row, { left: [], center: [], right: [] });
            const bucket = rowsMap.get(row)!;
            if (zone === 'left') bucket.left.push(el);
            else if (zone === 'right') bucket.right.push(el);
            else bucket.center.push(el);
        });

        // Flatten rows in order (left, center, right per row). Note: do NOT auto-inject slot placeholders for headers.
        const rows = Array.from(rowsMap.keys()).sort((a,b)=>a-b);
        const flattened: StackElement[] = [];
        rows.forEach(r => {
            const b = rowsMap.get(r)!;
            flattened.push(...(b.left || []));
            flattened.push(...(b.center || []));
            flattened.push(...(b.right || []));
        });

        setLocalData({ ...localData, customElements: flattened } as BlockData & { customElements: StackElement[] });
    };

    // Helpers: agrupar por row y por zona
    const splitByRowAndZone = (elements: StackElement[]) => {
        const rowsMap = new Map<number, { left: StackElement[]; center: StackElement[]; right: StackElement[] }>();
        elements.forEach(el => {
            const row = (el.data as any)?.row ?? 0;
            const zone = ((el.data as any)?.zone as 'left' | 'center' | 'right') || 'center';
            if (!rowsMap.has(row)) rowsMap.set(row, { left: [], center: [], right: [] });
            const bucket = rowsMap.get(row)!;
            if (zone === 'left') bucket.left.push(el);
            else if (zone === 'right') bucket.right.push(el);
            else bucket.center.push(el);
        });
        // also return sorted list of rows
        const rows = Array.from(rowsMap.keys()).sort((a, b) => a - b);
        return { rows, rowsMap };
    };

    // Helper: flatten rows in ascending order, and within each row left-center-right
    const flattenRowsByRow = (rows: number[], rowsMap: Map<number, { left: StackElement[]; center: StackElement[]; right: StackElement[] }>) => {
        const out: StackElement[] = [];
        rows.forEach(r => {
            const bucket = rowsMap.get(r)!;
            out.push(...(bucket?.left || []));
            out.push(...(bucket?.center || []));
            out.push(...(bucket?.right || []));
        });
        return out;
    };

    // allow specifying a zone and row when adding (defaults to center,row 0)
    const addElement = (type: StackElementType, zone: 'left' | 'center' | 'right' = 'center', row: number = 0) => {
        console.log('[useEditorElements] addElement requested', { type, zone, row });
        const baseData: any = { ...(getDefaultDataForType(type) as any), zone, row };
        const newElement: StackElement = {
            id: generateElementId(),
            type,
            data: baseData as any
        };

        const { rows, rowsMap } = splitByRowAndZone(customElements);
        // ensure target row exists in map
        if (!rowsMap.has(row)) rowsMap.set(row, { left: [], center: [], right: [] });
        const bucket = rowsMap.get(row)!;
        // Prevent insertion if the target zone already reached max real elements
        const existingRealCount = ((bucket as any)[zone] as StackElement[]).filter(e => e.type !== 'slot').length;
        if (existingRealCount >= DEFAULT_MAX_PER_SLOT) {
            console.log('[useEditorElements] addElement - target zone full by maxPerSlot', { zone, row, existingRealCount, max: DEFAULT_MAX_PER_SLOT });
            return;
        }
        if (zone === 'left') bucket.left.push(newElement);
        else if (zone === 'right') bucket.right.push(newElement);
        else bucket.center.push(newElement);

        const finalRows = Array.from(new Set([...rows, row])).sort((a, b) => a - b);
        const newElements = flattenRowsByRow(finalRows, rowsMap);
        console.log('[useEditorElements] addElement - result rows', finalRows);
        // Also prune any leftover empty slots immediately
        const pruned = newElements.filter(el => !(el.type === 'slot' && (el.data as any)?.isEmpty));
        setCustomElements(pruned);
    };

    // Insert element into specified row and zone (used by header preview)
    const handleInsertElementInRow = (row: number, zone: 'left' | 'center' | 'right' = 'center') => {
        if (!insertingType) return;
        console.log('[useEditorElements] handleInsertElementInRow - insertingType', insertingType, 'zone', zone, 'row', row);
        const baseData: any = { zone, row };
        let newElement: StackElement;
        switch (insertingType) {
            case 'logo':
                newElement = { id: generateElementId(), type: 'logo', data: { ...baseData, content: 'Mi Logo' } as any };
                break;
            case 'link':
                newElement = { id: generateElementId(), type: 'link', data: { ...baseData, content: 'Enlace', href: '#' } as any };
                break;
            case 'actions':
                newElement = { id: generateElementId(), type: 'actions', data: { ...baseData, buttonText: 'Acción', buttonLink: '#' } as any };
                break;
            case 'spacer':
                newElement = { id: generateElementId(), type: 'spacer', data: { ...baseData, height: 20 } as any };
                break;
            case 'heading':
                newElement = { id: generateElementId(), type: 'heading', data: { ...baseData, content: 'Título (H2)', level: 'h2' } as any };
                break;
            case 'paragraph':
                newElement = { id: generateElementId(), type: 'paragraph', data: { ...baseData, content: 'Nuevo párrafo de texto.' } as any };
                break;
            case 'image':
                newElement = { id: generateElementId(), type: 'image', data: { ...baseData, imageUrl: '', alt: 'Imagen' } as any };
                break;
            case 'button':
                newElement = { id: generateElementId(), type: 'button', data: { ...baseData, buttonText: 'Botón', buttonLink: '#' } as any };
                break;
            default:
                return;
        }

        const { rows, rowsMap } = splitByRowAndZone(customElements);
        if (!rowsMap.has(row)) rowsMap.set(row, { left: [], center: [], right: [] });
        const bucket = rowsMap.get(row)!;
        // Remove any empty slot placeholders in the target row before inserting.
        // This ensures that empty left/right slots don't block insertion into the center.
        ['left','center','right'].forEach((z) => {
             const arr = (bucket as any)[z] as StackElement[];
             const filtered = arr.filter(el => !(el.type === 'slot' && (el.data as any)?.isEmpty));
             (bucket as any)[z] = filtered;
         });
         // Prevent insertion if the target zone already reached max real elements
         const existingRealCount2 = (zone === 'left' ? bucket.left : zone === 'right' ? bucket.right : bucket.center).filter(e => e.type !== 'slot').length;
         if (existingRealCount2 >= DEFAULT_MAX_PER_SLOT) {
             console.log('[useEditorElements] handleInsertElementInRow - target zone full by maxPerSlot', { zone, row, existingRealCount2, max: DEFAULT_MAX_PER_SLOT });
             setInsertingType(null);
             return;
         }
         if (zone === 'left') bucket.left.push(newElement);
         else if (zone === 'center') bucket.center.push(newElement);
         else bucket.right.push(newElement);

        const finalRows = Array.from(new Set([...rows, row])).sort((a, b) => a - b);
        const newElements = flattenRowsByRow(finalRows, rowsMap);
        console.log('[useEditorElements] handleInsertElementInRow - result rows', finalRows);
        // Prune empty slot placeholders so they don't block capacity (double safety)
        const pruned = newElements.filter(el => !(el.type === 'slot' && (el.data as any)?.isEmpty));
        setCustomElements(pruned);
        setInsertingType(null);
    };

    const removeElement = (id: string) => {
        console.log('[useEditorElements] removeElement - id', id);
        const newElements = customElements.filter(el => el.id !== id);
        // preserve ordering by rows
        const { rows, rowsMap } = splitByRowAndZone(newElements);
        const finalRows = rows.sort((a,b)=>a-b);
        const flattened = flattenRowsByRow(finalRows, rowsMap);
        console.log('[useEditorElements] removeElement - result rows', finalRows);
        setCustomElements(flattened);
    };

    const moveElement = (id: string, direction: 'up' | 'down') => {
        console.log('[useEditorElements] moveElement - id, direction', id, direction);
        // Move within its zone and row to avoid cross-row/zone reordering unless explicitly changed
        const { rows, rowsMap } = splitByRowAndZone(customElements);
        // find element's row and zone
        let targetRow: number | null = null;
        let targetZone: 'left' | 'center' | 'right' | null = null;
        rows.forEach(r => {
            const bucket = rowsMap.get(r)!;
            if (bucket.left.find(x => x.id === id)) { targetRow = r; targetZone = 'left'; }
            if (bucket.center.find(x => x.id === id)) { targetRow = r; targetZone = 'center'; }
            if (bucket.right.find(x => x.id === id)) { targetRow = r; targetZone = 'right'; }
        });
        if (targetRow === null || !targetZone) return;

        const bucket = rowsMap.get(targetRow)!;
        // handle per-zone explicitly to avoid TS narrowing issues
        if (targetZone === 'left') {
            const arr = bucket.left;
            const idx = arr.findIndex(x => x.id === id);
            if (idx === -1) return;
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= arr.length) return;
            const newArr = [...arr];
            [newArr[idx], newArr[newIdx]] = [newArr[newIdx], newArr[idx]];
            bucket.left = newArr;
        } else if (targetZone === 'center') {
            const arr = bucket.center;
            const idx = arr.findIndex(x => x.id === id);
            if (idx === -1) return;
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= arr.length) return;
            const newArr = [...arr];
            [newArr[idx], newArr[newIdx]] = [newArr[newIdx], newArr[idx]];
            bucket.center = newArr;
        } else {
            const arr = bucket.right;
            const idx = arr.findIndex(x => x.id === id);
            if (idx === -1) return;
            const newIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (newIdx < 0 || newIdx >= arr.length) return;
            const newArr = [...arr];
            [newArr[idx], newArr[newIdx]] = [newArr[newIdx], newArr[idx]];
            bucket.right = newArr;
        }

        const finalRows = rows.slice().sort((a,b)=>a-b);
        const newElements = flattenRowsByRow(finalRows, rowsMap);
        console.log('[useEditorElements] moveElement - result rows', finalRows);
        setCustomElements(newElements);
    };

    const updateElement = (id: string, newData: Partial<StackElement['data']>) => {
        console.log('[useEditorElements] updateElement - id, newData', id, newData);
        // preserve zone and row if not provided
        const newElements = customElements.map(el =>
            el.id === id ? { ...el, data: { ...el.data, ...newData, zone: (newData as any)?.zone || (el.data as any).zone || 'center', row: (newData as any)?.row ?? (el.data as any).row ?? 0 } } : el
        );
        const { rows, rowsMap } = splitByRowAndZone(newElements);
        const finalRows = rows.sort((a,b)=>a-b);
        console.log('[useEditorElements] updateElement - result rows', finalRows);
        setCustomElements(flattenRowsByRow(finalRows, rowsMap));
    };

    const handleFillSlot = (slotId: string) => {
        if (!insertingType) return;

        console.log('[useEditorElements] handleFillSlot - slotId, insertingType', slotId, insertingType);

        let elementData: Record<string, unknown>;

        switch (insertingType) {
            case 'logo':
                elementData = { content: 'Mi Logo' };
                break;
            case 'link':
                elementData = { content: 'Enlace', href: '#' };
                break;
            case 'actions':
                elementData = { buttonText: 'Acción', buttonLink: '#' };
                break;
            case 'heading':
                elementData = { content: 'Título', level: 'h2' };
                break;
            case 'paragraph':
                elementData = { content: 'Texto' };
                break;
            case 'image':
                elementData = { imageUrl: '', alt: 'Imagen' };
                break;
            case 'button':
                elementData = { buttonText: 'Botón', buttonLink: '#' };
                break;
            default:
                return;
        }

        // Update only the targeted slot, preserving its zone and row
        const newElements = customElements.map(el =>
            el.id === slotId
                ? ({
                    ...el,
                    type: insertingType,
                    data: {
                        ...el.data,
                        isEmpty: false,
                        ...elementData
                    }
                } as StackElement)
                : el
        );

        const { rows, rowsMap } = splitByRowAndZone(newElements);
        const finalRows = rows.sort((a,b)=>a-b);
        console.log('[useEditorElements] handleFillSlot - after fill rows', finalRows);

        setCustomElements(flattenRowsByRow(finalRows, rowsMap) as StackElement[]);
        setInsertingType(null);
    };

    // Limpiar todos los elementos
    const clearAllElements = () => {
        console.log('[useEditorElements] clearAllElements - removing all elements');
        setCustomElements([]);
    };

    return {
        customElements,
        insertingType,
        setInsertingType,
        addElement,
        handleInsertElementInRow,
        removeElement,
        moveElement,
        updateElement,
        handleFillSlot,
        clearAllElements,
    };
}
