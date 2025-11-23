import { StackElement } from '@/app/components/editor/blocks/CustomStackElements';

export const MAX_ELEMENTS_PER_SLOT = 5;

export interface SlotMapType {
    left: StackElement[];
    center: StackElement[];
    right: StackElement[];
}

export interface ActiveSlotsResult {
    slotMap: SlotMapType;
    activeZones: string[];
}

/**
 * Agrupa los elementos por zona y devuelve las zonas activas
 */
export function getActiveSlots(customElements: StackElement[]): ActiveSlotsResult {
    const zones = ['left', 'center', 'right'];
    
    const slotMap: SlotMapType = {
        left: [],
        center: [],
        right: []
    };
    
    customElements.forEach(el => {
        const zone = (el.data as any)?.zone || 'center';
        if (slotMap[zone as keyof SlotMapType]) {
            slotMap[zone as keyof SlotMapType].push(el);
        }
    });
    
    const activeZones = zones.filter(z => slotMap[z as keyof SlotMapType].length > 0);
    
    return { slotMap, activeZones };
}

/**
 * Agrupa los elementos por fila (row) y por zona dentro de cada fila.
 * Devuelve un array de filas ordenadas: { row, slotMap }
 */
export function getHeaderRows(customElements: StackElement[]) {
    const rowsSet = new Set<number>();
    // Always ensure the first row (0) exists so the header can never be fully deleted
    rowsSet.add(0);

    customElements.forEach(el => {
        const r = (el.data as any)?.row ?? 0;
        rowsSet.add(r);
    });

    const rows = Array.from(rowsSet).sort((a, b) => a - b);

    const result: Array<{ row: number; slotMap: SlotMapType; activeZones: string[] }> = rows.map(row => {
        const slotMap: SlotMapType = { left: [], center: [], right: [] };
        customElements.forEach(el => {
            const r = (el.data as any)?.row ?? 0;
            if (r !== row) return;
            const zone = (el.data as any)?.zone || 'center';
            if (slotMap[zone as keyof SlotMapType]) {
                slotMap[zone as keyof SlotMapType].push(el);
            }
        });
        const activeZones = ['left', 'center', 'right'].filter(z => slotMap[z as keyof SlotMapType].length > 0);
        return { row, slotMap, activeZones };
    });

    return result;
}

/**
 * Calcula la clase CSS para una zona según el número de zonas activas
 */
export function getSlotClass(zone: 'left' | 'center' | 'right', zonesToShow: Array<'left' | 'center' | 'right'>): string {
    // Antes se centralizaba siempre cuando había 1 o 2 zonas activas.
    // Ahora preservamos la alineación según la zona incluso si es la única activa.
    if (zonesToShow.length === 1) {
        if (zone === 'left') return 'flex-1 justify-start';
        if (zone === 'center') return 'flex-1 justify-center';
        if (zone === 'right') return 'flex-1 justify-end';
    }

    if (zonesToShow.length === 2) {
        // Para dos zonas activas, mantenemos la alineación natural por zona
        if (zone === 'left') return 'flex-1 justify-start';
        if (zone === 'center') return 'flex-1 justify-center';
        if (zone === 'right') return 'flex-1 justify-end';
    }

    if (zonesToShow.length === 3) {
        if (zone === 'left') return 'flex-1 justify-start';
        if (zone === 'center') return 'flex-1 justify-center';
        if (zone === 'right') return 'flex-1 justify-end';
    }
    return 'flex-1 justify-center';
}
