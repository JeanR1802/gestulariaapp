"use client";
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';
import { HeaderElementRenderer } from './HeaderElementRenderer';

interface SimpleHeaderEditorProps {
    elements: StackElement[];
    onAddElement: (zone: 'left' | 'center' | 'right') => void;
    onRemoveElement: (id: string) => void;
    mode?: 'fijo' | 'dinamico';
    insertingType?: StackElementType | null;
    onOpenProperties?: (id?: string) => void;
    showPlaceholdersIfNew?: boolean;
    // Header padding (px) controlled from sidebar
    headerPaddingLeft?: number | undefined;
    headerPaddingRight?: number | undefined;
    // Callback when SimpleHeaderEditor clamps padding due to lack of space
    onClampHeaderPadding?: (left: number | null, right: number | null) => void;
    // Callback to report maximum padding available (total and individual limits)
    onMaxPaddingAvailableChange?: (maxPadding: number, maxLeft?: number, maxRight?: number) => void;
}

export function SimpleHeaderEditor({ 
    elements, 
    onAddElement, 
    onRemoveElement,
    mode = 'fijo',
    insertingType = null,
    onOpenProperties,
    showPlaceholdersIfNew = true,
    headerPaddingLeft,
    headerPaddingRight,
    onClampHeaderPadding,
    onMaxPaddingAvailableChange,
}: SimpleHeaderEditorProps) {
    
    // =========================================
    // CONFIGeURACIeÓN (Del HTML)
    // =========================================
    const GAP = 10;
    const PADDING_CAJA = 20;
    const MIN_ELEMENT_WIDTH = 148; // Ancho mínimo para insertar un elemento (140px logo + 8px gap)
    
    // =========================================
    // REFS
    // =========================================
    const headerRef = useRef<HTMLDivElement>(null);
    const grupoIzqRef = useRef<HTMLDivElement>(null);
    const grupoCenRef = useRef<HTMLDivElement>(null);
    const grupoDerRef = useRef<HTMLDivElement>(null);
    
    // Keep last reported max padding to avoid sending transient/stale values
    const lastReportedMaxRef = React.useRef<number | null>(null);
    
    // =========================================
    // ESTADO
    // =========================================
    const [message, setMessage] = useState<string>('Haz clic en una zona para insertar un logo');
    const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');
    const [isInserting, setIsInserting] = useState<boolean>(false);
    // Padding overflow warning
    const [paddingWarning, setPaddingWarning] = useState<string | null>(null);
    // Insertion blocked warning
    const [insertionBlockedWarning, setInsertionBlockedWarning] = useState<string | null>(null);
    // Applied paddings rendered as invisible spacer elements (px)
    const [appliedPaddingLeft, setAppliedPaddingLeft] = useState<number>(headerPaddingLeft ?? 0);
    const [appliedPaddingRight, setAppliedPaddingRight] = useState<number>(headerPaddingRight ?? 0);
    // Track previous requested padding to detect which side changed last
    const prevRequestedRef = useRef<{ left: number; right: number }>({ left: headerPaddingLeft ?? 0, right: headerPaddingRight ?? 0 });
    
    // Sistema de diagnóstico mejorado
    const [insertionLog, setInsertionLog] = useState<Array<{
        timestamp: number;
        zone: 'left' | 'center' | 'right';
        elementType: string;
        elementsBefore: number;
        elementsAfter: number;
        totalElements: number;
    }>>([]);
    
    // Actualizar mensaje cuando cambie el modo
    useEffect(() => {
        if (mode === 'fijo') {
            setMessage('🔒 Modo Fijo: El centro permanece centrado. Los laterales no pueden tocarlo.');
        } else {
            setMessage('↔️ Modo Dinámico: El centro se mueve si los laterales lo empujan.');
        }
        setMessageType('info');
    }, [mode]);
    
    // Filtrar solo elementos reales (excluir 'slot' y elementos marcados como placeholder/isEmpty)
    const isRealElement = (el: StackElement) => {
        // Excluir elementos de tipo slot
        if (el.type === 'slot') return false;
        // Excluir elementos que estén marcados como placeholder o vacíos en sus datos
        const d = el.data as any;
        if (d && (d.isEmpty === true || d.placeholder === true || d.placeholder)) return false;
        return true;
    };

    // Agrupar elementos por zona (solo reales)
    const leftElements = elements.filter(el => (el.data as any)?.zone === 'left' && isRealElement(el));
    const centerElements = elements.filter(el => (el.data as any)?.zone === 'center' && isRealElement(el));
    const rightElements = elements.filter(el => (el.data as any)?.zone === 'right' && isRealElement(el));
    
    // Mostrar placeholders/slots solo cuando el header está completamente vacío (sin *ningún* elemento)
    // —esto cubre headers nuevos— o cuando se está intentando insertar un nuevo elemento (insertingType).
    // Si el header contiene elementos tipo 'slot' o placeholders heredados pero no tiene elementos reales,
    // NO mostraremos los placeholders por defecto (evita mostrar guías en headers antiguos).
    const totalRealElements = elements.filter(isRealElement).length;
    const hasAnyElements = Array.isArray(elements) && elements.length > 0;
    // Show placeholders if inserting OR if block is brand new (flag from parent) and truly empty
    const showPlaceholdersGlobally = (insertingType != null) || (showPlaceholdersIfNew && !hasAnyElements);

    // Keep a ref with the latest elements to avoid stale closures when using setTimeout/logging
    const elementsRef = React.useRef(elements);
    React.useEffect(() => { elementsRef.current = elements; }, [elements]);

    // DEBUG: Log elements prop and actual DOM children to detect visual placeholders (ghosts)
    React.useEffect(() => {
        try {
            console.log('🔎 [SHE INIT] elements prop count =', elements.length, 'elements =', elements.map(e => ({ id: e.id, type: e.type, data: e.data })));
            if (headerRef.current) {
                const children = Array.from(headerRef.current.children);
                console.log('🔎 [SHE INIT] header DOM children count =', children.length);
                children.forEach((ch, i) => {
                    const el = ch as HTMLElement;
                    console.log(`🔎 [SHE INIT] child[${i}] tag=${el.tagName} class="${el.className}" text="${(el.textContent||'').trim().slice(0,60)}" offsetWidth=${el.offsetWidth}`);
                });
            }
        } catch (e) {
            console.warn('🔎 [SHE INIT] error logging DOM children', e);
        }
    }, [elements]);

    // =========================================
    // FUNCIÓN: estimateWidthForType
    // =========================================
    const estimateWidthForType = (type: string): number => {
        switch (type) {
            case 'logo': return 140;
            case 'button': return 100;
            case 'link': return 90;
            default: return 100;
        }
    };
    
    // =========================================
    // MOTOR DE POSICIONAMIENTO (Del HTML)
    // =========================================
    const actualizarLayout = () => {
        if (!headerRef.current || !grupoIzqRef.current || !grupoCenRef.current || !grupoDerRef.current) return;
        
        const W_Total = headerRef.current.clientWidth;
        const W_Izq = grupoIzqRef.current.offsetWidth;
        const W_Cen = grupoCenRef.current.offsetWidth;
        const W_Der = grupoDerRef.current.offsetWidth;
        
        // Posición ideal del centro
        const X_Centro_Ideal = (W_Total / 2) - (W_Cen / 2);
        let X_Centro_Final = X_Centro_Ideal;
        
        if (mode === 'dinamico') {
            const Limite_Izquierdo = W_Izq + GAP;
            const Limite_Derecho = (W_Total - W_Der) - GAP - W_Cen;
            X_Centro_Final = Math.max(Limite_Izquierdo, Math.min(X_Centro_Ideal, Limite_Derecho));
        }
        
        // Aplicar posición
        grupoCenRef.current.style.left = `${X_Centro_Final}px`;
        
        console.log('📊 Layout actualizado:', { W_Total, W_Izq, W_Cen, W_Der, X_Centro_Final });
    };
    
    // =========================================
    // VERIFICACIÓN: puedeInsertar (Del HTML)
    // =========================================
    const puedeInsertar = (zona: 'left' | 'center' | 'right', anchoNuevo: number): boolean => {
        if (!headerRef.current || !grupoIzqRef.current || !grupoCenRef.current || !grupoDerRef.current) {
            return true; // Permitir si refs no están listas
        }

        const W_Total = headerRef.current.clientWidth;
        // Measure group widths EXCLUDING padding spacers
        // Reusable helper to measure widths excluding spacer & placeholder DOM nodes
        const measureGroupWidthExcludingSpacers = (group: HTMLDivElement, spacerClassLeft = 'header-spacer-left', spacerClassRight = 'header-spacer-right', placeholderClass = 'header-placeholder') => {
            const children = Array.from(group.children) as HTMLElement[];
            return children.reduce((sum, ch) => {
                if (!ch.classList) return sum;
                if (ch.classList.contains(spacerClassLeft) || ch.classList.contains(spacerClassRight) || ch.classList.contains(placeholderClass) || ch.classList.contains('ghost-slot')) return sum;
                return sum + ch.offsetWidth;
            }, 0);
        };

        const W_Izq_Actual = measureGroupWidthExcludingSpacers(grupoIzqRef.current);
        let W_Cen_Actual = measureGroupWidthExcludingSpacers(grupoCenRef.current);
        const W_Der_Actual = measureGroupWidthExcludingSpacers(grupoDerRef.current);

        // ⚠️ CORRECCIÓN DEL BUG: Si el centro está vacío, su ancho real debería ser 0
        // El offsetWidth incluye padding (20px) y el texto placeholder (~69px = 89px total)
        // Pero para cálculos de inserción, un centro vacío debe contar como 0px
        if (centerElements.length === 0) {
            W_Cen_Actual = 0;
            console.log('🔧 Centro vacío detectado, ajustando ancho a 0px (era ' + grupoCenRef.current.offsetWidth + 'px con padding/placeholder)');
        }

        const W_Nuevo_Total = anchoNuevo + 8; // ancho del elemento + gap

        // Calcular anchos DESPUÉS de la inserción
        const W_Izq_Futuro = zona === 'left' ? W_Izq_Actual + W_Nuevo_Total : W_Izq_Actual;
        const W_Cen_Futuro = zona === 'center' ? W_Cen_Actual + W_Nuevo_Total : W_Cen_Actual;
        const W_Der_Futuro = zona === 'right' ? W_Der_Actual + W_Nuevo_Total : W_Der_Actual;

        console.log('🔍 Verificando inserción:', { 
            zona, 
            W_Total, 
            actual: { W_Izq_Actual, W_Cen_Actual, W_Der_Actual },
            futuro: { W_Izq_Futuro, W_Cen_Futuro, W_Der_Futuro }
        });
        
        // MODO FIJO
        if (mode === 'fijo') {
            // El centro SIEMPRE está en el medio, basado en su ancho futuro
            const Inicio_Centro = (W_Total / 2) - (W_Cen_Futuro / 2);
            const Fin_Centro = (W_Total / 2) + (W_Cen_Futuro / 2);
            
            console.log('📍 Posición centro (modo fijo):', { Inicio_Centro, Fin_Centro });
            
            // Verificar que izquierda no toque el centro
            const Fin_Izquierda = W_Izq_Futuro;
            if (Fin_Izquierda + GAP > Inicio_Centro) {
                console.log('❌ Bloqueado: Izquierda tocaría el centro', { 
                    Fin_Izquierda, 
                    necesita_hasta: Inicio_Centro - GAP,
                    diferencia: (Inicio_Centro - GAP) - Fin_Izquierda
                });
                return false;
            }
            
            // Verificar que derecha no toque el centro
            const Inicio_Derecha = W_Total - W_Der_Futuro;
            if (Inicio_Derecha - GAP < Fin_Centro) {
                console.log('❌ Bloqueado: Derecha tocaría el centro', { 
                    Inicio_Derecha, 
                    necesita_desde: Fin_Centro + GAP,
                    diferencia: Inicio_Derecha - (Fin_Centro + GAP)
                });
                return false;
            }
            
            console.log('✅ Inserción permitida en modo fijo');
            return true;
        }
        
        // MODO DINÁMICO
        if (mode === 'dinamico') {
            const Espacio_Ocupado = W_Izq_Futuro + W_Cen_Futuro + W_Der_Futuro + (GAP * 2);
            const cabe = Espacio_Ocupado <= W_Total;
            console.log('🔍 Modo dinámico:', { Espacio_Ocupado, W_Total, cabe });
            return cabe;
        }
        
        return false;
    };
    
    // =========================================
    // HANDLER: intentarInsertar
    // =========================================
    const intentarInsertar = async (zona: 'left' | 'center' | 'right') => {
        // Prevenir múltiples clics mientras se procesa una inserción
        if (isInserting) {
            console.log('[SimpleHeaderEditor] intentarInsertar - blocked: insertion already in progress');
            return;
        }

        const anchoNuevo = estimateWidthForType('logo');

        if (!puedeInsertar(zona, anchoNuevo)) {
            // Verificar si el problema es el padding excesivo
            const paddingTotal = (appliedPaddingLeft || 0) + (appliedPaddingRight || 0);
            if (paddingTotal > 100) {
                setMessage(`🚫 No hay espacio para insertar en ${zona.toUpperCase()}. El padding (${paddingTotal}px) está consumiendo demasiado espacio. Reduce el padding para permitir más elementos.`);
            } else {
                setMessage(`🚫 No hay espacio suficiente en zona ${zona.toUpperCase()}.`);
            }
            setMessageType('error');
            return;
        }

        // Registrar estado ANTES de insertar (usando ref para evitar stale closures)
        const elementsBefore = elementsRef.current.filter(isRealElement).length;
        const timestamp = Date.now();

        console.log('🔵 [DIAGNÓSTICO] ANTES de llamar onAddElement:', {
            timestamp,
            zona,
            elementosTotales: elementsBefore,
            left: elementsRef.current.filter(el => (el.data as any)?.zone === 'left' && isRealElement(el)).length,
            center: elementsRef.current.filter(el => (el.data as any)?.zone === 'center' && isRealElement(el)).length,
            right: elementsRef.current.filter(el => (el.data as any)?.zone === 'right' && isRealElement(el)).length
        });

        setIsInserting(true);

        // Llamar al callback onAddElement y esperar la lista resultante si la devuelve
        let resultList = elementsRef.current;
        try {
            if (onAddElement) {
                onAddElement(zona);
            }
        } catch (err) {
            console.error('Error al insertar elemento:', err);
        }

        setMessage('✅ Elemento agregado correctamente.');
        setMessageType('success');

        // Contar solo elementos reales después
        const elementsAfter = elementsRef.current.filter(isRealElement).length;
        const elementsAdded = elementsAfter - elementsBefore;

        console.log('🟢 [DIAGNÓSTICO] DESPUÉS de llamar onAddElement (directo):', {
            timestamp,
            zona,
            elementosTotales: elementsAfter,
            elementosInsertados: elementsAdded,
            left: elementsRef.current.filter(el => (el.data as any)?.zone === 'left' && isRealElement(el)).length,
            center: elementsRef.current.filter(el => (el.data as any)?.zone === 'center' && isRealElement(el)).length,
            right: elementsRef.current.filter(el => (el.data as any)?.zone === 'right' && isRealElement(el)).length
        });

        if (elementsAdded > 1) {
            console.error('🚨 BUG DETECTADO: Se insertaron', elementsAdded, 'elementos en vez de 1!');
        }

        setInsertionLog(prevLog => {
            const nuevoRegistro = {
                timestamp,
                zone: zona,
                elementType: insertingType || 'logo',
                elementsBefore,
                elementsAfter,
                totalElements: elementsAfter
            };
            console.log('📈 Registro guardado:', nuevoRegistro);
            return [...prevLog, nuevoRegistro];
        });

        actualizarLayout();
        setIsInserting(false);
    };
    
    // =========================================
    // DIAGNÓSTICO: Generar reporte JSON MEJORADO
    // =========================================
    const generarDiagnostico = () => {
        if (!headerRef.current || !grupoIzqRef.current || !grupoCenRef.current || !grupoDerRef.current) {
            alert('⚠️ Referencias no disponibles. Espera un momento e intenta de nuevo.');
            return;
        }

        // Use the latest elements via ref to ensure consistency
        const currElements = elementsRef.current;
        // Filtrar solo elementos reales (excluyendo slots/placeholders)
        const left = currElements.filter(el => (el.data as any)?.zone === 'left' && isRealElement(el));
        const center = currElements.filter(el => (el.data as any)?.zone === 'center' && isRealElement(el));
        const right = currElements.filter(el => (el.data as any)?.zone === 'right' && isRealElement(el));

        const W_Total = headerRef.current.clientWidth;
        // Measure widths excluding spacers
        const measureGroupWidthExcludingSpacers = (group: HTMLDivElement, spacerClassLeft = 'header-spacer-left', spacerClassRight = 'header-spacer-right') => {
            const children = Array.from(group.children) as HTMLElement[];
            return children.reduce((sum, ch) => {
                if (ch.classList && (ch.classList.contains(spacerClassLeft) || ch.classList.contains(spacerClassRight))) return sum;
                return sum + ch.offsetWidth;
            }, 0);
        };

        const W_Izq_Actual = measureGroupWidthExcludingSpacers(grupoIzqRef.current);
        const W_Cen_DOM = grupoCenRef.current.offsetWidth; // Ancho real del DOM (con padding)
        let W_Cen_Actual = W_Cen_DOM;
        const W_Der_Actual = measureGroupWidthExcludingSpacers(grupoDerRef.current);
        
        // Ajustar ancho del centro si está vacío (mismo ajuste que en puedeInsertar)
        if (center.length === 0) {
            W_Cen_Actual = 0;
        }

        // Calcular posición del centro
        const Inicio_Centro = (W_Total / 2) - (W_Cen_Actual / 2);
        const Fin_Centro = (W_Total / 2) + (W_Cen_Actual / 2);

        // Calcular espacios libres
        const Espacio_Libre_Izq = Inicio_Centro - W_Izq_Actual - GAP;
        const Espacio_Libre_Der = (W_Total - W_Der_Actual) - Fin_Centro - GAP;

        // Calcular cuántos logos más cabrían
        const anchoLogo = 148; // 140 + 8 de gap
        const logosCabenIzq = Math.floor(Espacio_Libre_Izq / anchoLogo);
        const logosCabenDer = Math.floor(Espacio_Libre_Der / anchoLogo);
        const logosCabenCen = Math.floor(Math.min(Espacio_Libre_Izq, Espacio_Libre_Der) / anchoLogo);

        // 🆕 ANÁLISIS DE INSERCIONES - CLAVE PARA DETECTAR EL BUG
        const insertionAnalysis = {
            totalInsertionAttempts: insertionLog.length,
            insertionsByZone: {
                left: insertionLog.filter(i => i.zone === 'left').length,
                center: insertionLog.filter(i => i.zone === 'center').length,
                right: insertionLog.filter(i => i.zone === 'right').length
            },
            detailedLog: insertionLog.map((log: any) => ({
                time: new Date(log.timestamp).toLocaleTimeString(),
                zone: log.zone,
                elementsBefore: log.elementsBefore ?? 0,
                elementsAfter: log.elementsAfter ?? 0,
                elementsAdded: (log.elementsAfter ?? 0) - (log.elementsBefore ?? 0)
            })),
            suspiciousInsertions: insertionLog.filter((log: any) => 
                ((log.elementsAfter ?? 0) - (log.elementsBefore ?? 0)) > 1
            ).length,
            warning: insertionLog.some((log: any) => ((log.elementsAfter ?? 0) - (log.elementsBefore ?? 0)) > 1)
                ? '⚠️ SE DETECTARON INSERCIONES MÚLTIPLES! Más de 1 elemento añadido en un solo clic'
                : '✅ No se detectaron inserciones múltiples'
        };

        const diagnostico = {
            timestamp: new Date().toISOString(),
            modo: mode,
            insertionAnalysis,
            dimensiones: {
                anchoTotalHeader: W_Total,
                gap: GAP,
                anchoLogo: anchoLogo
            },
            elementos: {
                izquierda: {
                    cantidad: left.length,
                    anchoTotal: W_Izq_Actual,
                    elementos: left.map(el => el.id)
                },
                centro: {
                    cantidad: center.length,
                    anchoTotal: W_Cen_Actual,
                    anchoDOM: W_Cen_DOM,
                    ajustado: center.length === 0,
                    nota: center.length === 0 
                        ? `El ancho DOM era ${W_Cen_DOM}px (padding+placeholder) pero se ajustó a 0px para cálculos`
                        : 'Ancho real de los elementos',
                    posicionInicio: Inicio_Centro,
                    posicionFin: Fin_Centro,
                    elementos: center.map(el => el.id)
                },
                derecha: {
                    cantidad: right.length,
                    anchoTotal: W_Der_Actual,
                    posicionInicio: W_Total - W_Der_Actual,
                    elementos: right.map(el => el.id)
                }
            },
            espaciosLibres: {
                izquierda: {
                    pixeles: Espacio_Libre_Izq,
                    logosQueCaben: logosCabenIzq,
                    porcentaje: ((Espacio_Libre_Izq / W_Total) * 100).toFixed(2) + '%'
                },
                derecha: {
                    pixeles: Espacio_Libre_Der,
                    logosQueCaben: logosCabenDer,
                    porcentaje: ((Espacio_Libre_Der / W_Total) * 100).toFixed(2) + '%'
                },
                centro: {
                    nota: mode === 'fijo' 
                        ? 'En modo fijo, el centro acepta elementos si no toca los lados'
                        : 'En modo dinámico, el centro acepta elementos si hay espacio total',
                    logosQueCabenAproximado: mode === 'fijo' ? logosCabenCen : '∞ (se empuja)',
                    espacioMinimoRequerido: anchoLogo
                }
            },
            verificacionModoFijo: mode === 'fijo' ? {
                izquierdaPuedeCrecer: Espacio_Libre_Izq > 0,
                derechaPuedeCrecer: Espacio_Libre_Der > 0,
                centroPuedeCrecer: W_Cen_Actual < W_Total - W_Izq_Actual - W_Der_Actual - (GAP * 2),
                limiteIzquierda: Inicio_Centro - GAP,
                limiteDerecha: Fin_Centro + GAP
            } : null,
            verificacionModoDinamico: mode === 'dinamico' ? {
                espacioOcupado: W_Izq_Actual + W_Cen_Actual + W_Der_Actual + (GAP * 2),
                espacioDisponible: W_Total,
                espacioLibreTotal: W_Total - (W_Izq_Actual + W_Cen_Actual + W_Der_Actual + (GAP * 2)),
                logosQueCabenTotal: Math.floor((W_Total - (W_Izq_Actual + W_Cen_Actual + W_Der_Actual + (GAP * 2))) / anchoLogo)
            } : null,
            resumen: {
                totalElementos: left.length + center.length + right.length,
                espacioUsado: W_Izq_Actual + W_Cen_Actual + W_Der_Actual,
                espacioUsadoPorcentaje: (((W_Izq_Actual + W_Cen_Actual + W_Der_Actual) / W_Total) * 100).toFixed(2) + '%',
                espacioLibreTotal: mode === 'fijo' 
                    ? Espacio_Libre_Izq + Espacio_Libre_Der
                    : W_Total - (W_Izq_Actual + W_Cen_Actual + W_Der_Actual + (GAP * 2))
            }
        };
        
        // Copiar al clipboard y descargar (con fallback para entornos donde clipboard API no está disponible)
        const json = JSON.stringify(diagnostico, null, 2);

        const fallbackCopyToClipboard = (text: string) => {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                // Evitar scroll al añadir textarea
                ta.style.position = 'fixed';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                const ok = document.execCommand('copy');
                document.body.removeChild(ta);
                return ok;
            } catch (e) {
                console.warn('Fallback copy failed', e);
                return false;
            }
        };

        const tryCopy = async () => {
            if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
                try {
                    await navigator.clipboard.writeText(json);
                    console.log('📋 Diagnóstico copiado al clipboard:', diagnostico);
                    alert('✅ Diagnóstico copiado al clipboard y mostrado en consola!\n\nRevisa la consola del navegador para ver el reporte completo.');
                } catch (err) {
                    console.warn('navigator.clipboard.writeText falló:', err);
                    const ok = fallbackCopyToClipboard(json);
                    if (ok) {
                        console.log('📋 Diagnóstico copiado al clipboard mediante fallback:', diagnostico);
                        alert('✅ Diagnóstico copiado al clipboard mediante fallback y mostrado en consola!\n\nRevisa la consola del navegador para ver el reporte completo.');
                    } else {
                        console.log('📋 Diagnóstico generado (no se pudo copiar):', diagnostico);
                        alert('📋 Diagnóstico mostrado en consola del navegador. No se pudo copiar al portapapeles.');
                    }
                }
            } else {
                // Fallback cuando no hay navigator.clipboard
                const ok = fallbackCopyToClipboard(json);
                if (ok) {
                    console.log('📋 Diagnóstico copiado al clipboard mediante fallback:', diagnostico);
                    alert('✅ Diagnóstico copiado al clipboard mediante fallback y mostrado en consola!\n\nRevisa la consola del navegador para ver el reporte completo.');
                } else {
                    console.log('📋 Diagnóstico generado (no se pudo copiar):', diagnostico);
                    alert('📋 Diagnóstico mostrado en consola del navegador. No se pudo copiar al portapapeles.');
                }
            }
        };

        tryCopy().catch((e) => {
            console.warn('Error al intentar copiar diagnóstico:', e);
        });

        // También crear descarga
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagnostico-header-${mode}-${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }; 

    // =========================================
    // Reusable: clamp and report padding based on real DOM slot boundaries
    // =========================================
    const clampAndReportPadding = React.useCallback(() => {
        if (!headerRef.current || !grupoIzqRef.current || !grupoCenRef.current || !grupoDerRef.current) return;
        try {
            const padL = typeof headerPaddingLeft === 'number' ? headerPaddingLeft : 0;
            const padR = typeof headerPaddingRight === 'number' ? headerPaddingRight : 0;

            const W_Total = headerRef.current.clientWidth;

            // NUEVO ENFOQUE: Medir anchos reales de contenido (excluyendo spacers y placeholders)
            // Esto evita bugs con posiciones absolutas del DOM
            const measureGroupContentWidth = (group: HTMLDivElement) => {
                const children = Array.from(group.children) as HTMLElement[];
                return children.reduce((sum, ch) => {
                    if (!ch.classList) return sum;
                    // Excluir spacers de padding
                    if (ch.classList.contains('header-spacer-left') || ch.classList.contains('header-spacer-right')) return sum;
                    // Excluir placeholders (no son elementos reales)
                    if (ch.classList.contains('header-placeholder') || ch.classList.contains('ghost-slot')) return sum;
                    // Contar solo elementos reales
                    return sum + ch.offsetWidth;
                }, 0);
            };

            // Medir anchos reales de cada grupo (sin spacers ni placeholders)
            const W_Left_Content = measureGroupContentWidth(grupoIzqRef.current);
            const W_Center_Content = measureGroupContentWidth(grupoCenRef.current);
            const W_Right_Content = measureGroupContentWidth(grupoDerRef.current);

            // Si el centro está vacío, su ancho debe ser 0 para cálculos
            const W_Center_Effective = centerElements.length === 0 ? 0 : W_Center_Content;

            console.log('📏 [Padding Calculation - content-based]', {
                W_Total,
                W_Left_Content,
                W_Center_Content,
                W_Right_Content,
                W_Center_Effective,
                centerElementsCount: centerElements.length,
                leftElementsCount: leftElements.length,
                rightElementsCount: rightElements.length
            });

            // CÁLCULO CORRECTO DE LÍMITES:
            // En modo fijo, el centro está siempre centrado
            // Left padding disponible = distancia desde el borde izquierdo hasta donde termina el grupo izquierdo y comienza el centro
            // Right padding disponible = distancia desde donde termina el centro hasta donde comienza el grupo derecho
            
            let availableLeft: number;
            let availableRight: number;

            if (mode === 'fijo') {
                // En modo fijo, el centro está centrado en W_Total / 2
                const Center_Start = (W_Total / 2) - (W_Center_Effective / 2);
                const Center_End = (W_Total / 2) + (W_Center_Effective / 2);
                
                // Espacio disponible para padding (sin reservas forzadas)
                // El usuario puede usar TODO el espacio si lo desea
                // Si esto bloquea inserciones, se le advertirá pero no se le impedirá
                availableLeft = Math.max(0, Center_Start - W_Left_Content - GAP);
                availableRight = Math.max(0, W_Total - Center_End - W_Right_Content - GAP);
                
                console.log('📐 [Fixed Mode Limits]', {
                    Center_Start,
                    Center_End,
                    leftContentEndsAt: W_Left_Content,
                    rightContentStartsAt: W_Total - W_Right_Content,
                    availableLeft,
                    availableRight
                });
            } else {
                // En modo dinámico, el espacio disponible es simplemente lo que sobra
                const totalContentWidth = W_Left_Content + W_Center_Effective + W_Right_Content + (GAP * 2);
                const totalAvailable = Math.max(0, W_Total - totalContentWidth);
                
                // En modo dinámico, ambos lados pueden usar todo el espacio disponible
                // (el centro se mueve según sea necesario)
                availableLeft = totalAvailable;
                availableRight = totalAvailable;
                
                console.log('📐 [Dynamic Mode Limits]', {
                    totalContentWidth,
                    totalAvailable,
                    availableLeft,
                    availableRight
                });
            }

            // Maximum total padding (sin reservas, el usuario tiene control total)
            let maxTotalPadding = Math.max(0, availableLeft + availableRight);

            console.log('📏 [Padding Validation - content-based]', {
                mode,
                W_Total,
                contentWidths: {
                    left: W_Left_Content,
                    center: W_Center_Effective,
                    right: W_Right_Content
                },
                availableLeft,
                availableRight,
                requestedPaddingLeft: padL,
                requestedPaddingRight: padR,
                maxTotalPadding
            });

            // Notify parent about the maximum padding available (rounded to integer)
            // Also report individual limits for each side
            const roundedMaxTotalPadding = Math.max(0, Math.floor(maxTotalPadding));
            const roundedMaxLeft = Math.max(0, Math.floor(availableLeft));
            const roundedMaxRight = Math.max(0, Math.floor(availableRight));
            if (typeof onMaxPaddingAvailableChange === 'function') {
                if (lastReportedMaxRef.current !== roundedMaxTotalPadding) {
                    lastReportedMaxRef.current = roundedMaxTotalPadding;
                    onMaxPaddingAvailableChange(roundedMaxTotalPadding, roundedMaxLeft, roundedMaxRight);
                }
            }
            
            let clampedL = padL;
            let clampedR = padR;
            let wasClamped = false;
            let clampReason = '';

            // Detect which side was changed most recently
            const prev = prevRequestedRef.current || { left: 0, right: 0 };
            const lastChangedSide: 'left' | 'right' | null = (prev.left !== padL && prev.right === padR) ? 'left' : (prev.right !== padR && prev.left === padL) ? 'right' : null;

            // Check if padding exceeds total available OR if individual sides exceed their limits
            const leftExceedsLimit = padL > availableLeft;
            const rightExceedsLimit = padR > availableRight;
            const totalExceedsLimit = padL + padR > maxTotalPadding;

            if (leftExceedsLimit || rightExceedsLimit || totalExceedsLimit) {
                wasClamped = true;
                const deficit = (padL + padR) - maxTotalPadding;

                // Small tolerance: if user overshoots by 1px or less, treat as clamped
                // to improve UX (avoid resetting or aggressive warnings for tiny overshoots).
                const SOFT_TOLERANCE_PX = 1;
                const softClamp = deficit > 0 && deficit <= SOFT_TOLERANCE_PX;

                // STRICT CLAMPING: Each side MUST respect its individual limit first
                // This prevents slots from overlapping even if total space would allow it
                
                if (lastChangedSide === 'right') {
                    // User changed right padding - clamp it to its limit first
                    clampedR = Math.min(padR, availableRight);
                    // Then clamp left to remaining available space (respecting its own limit too)
                    clampedL = Math.min(padL, availableLeft, Math.max(0, maxTotalPadding - clampedR));
                } else if (lastChangedSide === 'left') {
                    // User changed left padding - clamp it to its limit first
                    clampedL = Math.min(padL, availableLeft);
                    // Then clamp right to remaining available space (respecting its own limit too)
                    clampedR = Math.min(padR, availableRight, Math.max(0, maxTotalPadding - clampedL));
                } else {
                    // Both changed or initial load - respect both individual limits
                    clampedL = Math.min(padL, availableLeft);
                    clampedR = Math.min(padR, availableRight);
                    
                    // Double-check total doesn't exceed (shouldn't happen with proper limits)
                    if (clampedL + clampedR > maxTotalPadding) {
                        const totalRequested = padL + padR;
                        if (totalRequested > 0) {
                            const ratioL = padL / totalRequested;
                            clampedL = Math.min(availableLeft, Math.floor(maxTotalPadding * ratioL));
                            clampedR = Math.min(availableRight, Math.max(0, Math.floor(maxTotalPadding - clampedL)));
                        }
                    }
                }

                // If softClamp, ensure clamped sums exactly match maxTotalPadding where possible
                // BUT never exceed individual limits
                if (softClamp) {
                    const totalClamped = clampedL + clampedR;
                    if (totalClamped < maxTotalPadding) {
                        // Distribute remaining 1px to the side that the user last changed (or left by default)
                        if (lastChangedSide === 'right' && clampedR < availableRight) {
                            clampedR += Math.min(1, availableRight - clampedR, maxTotalPadding - totalClamped);
                        } else if (clampedL < availableLeft) {
                            clampedL += Math.min(1, availableLeft - clampedL, maxTotalPadding - totalClamped);
                        }
                    }
                }
                
                clampReason = `Límite izquierdo: ${availableLeft}px, derecho: ${availableRight}px (total: ${maxTotalPadding}px). Los slots no pueden sobreponerse.`;
                console.warn('⚠️ [Padding Clamped - strict slot boundaries]', { 
                    requested: { left: padL, right: padR }, 
                    clamped: { left: clampedL, right: clampedR }, 
                    limits: { left: availableLeft, right: availableRight, total: maxTotalPadding },
                    exceeded: { left: leftExceedsLimit, right: rightExceedsLimit, total: totalExceedsLimit }
                });
            }

            // Apply clamped values
            setAppliedPaddingLeft(clampedL);
            setAppliedPaddingRight(clampedR);

            if (wasClamped) {
                setPaddingWarning(`⚠️ Padding reducido automáticamente de ${Math.floor(padL + padR)}px a ${Math.floor(clampedL + clampedR)}px. ${clampReason}`);
            } else {
                setPaddingWarning(null);
            }

            // Verificar si el padding aplicado está bloqueando la posibilidad de insertar elementos
            // Calculamos cuánto espacio queda disponible para insertar después de aplicar el padding
            let spaceForInsertion = 0;

            if (mode === 'fijo') {
                const Center_Start = (W_Total / 2) - (W_Center_Effective / 2);
                const Center_End = (W_Total / 2) + (W_Center_Effective / 2);
                const spaceLeftSide = Math.max(0, Center_Start - W_Left_Content - clampedL - GAP);
                const spaceRightSide = Math.max(0, W_Total - Center_End - W_Right_Content - clampedR - GAP);
                const spaceCenterSide = Math.max(0, Center_End - Center_Start - W_Center_Effective);
                spaceForInsertion = Math.max(spaceLeftSide, spaceRightSide, spaceCenterSide);
            } else {
                const totalContentWidth = W_Left_Content + W_Center_Effective + W_Right_Content + (GAP * 2);
                spaceForInsertion = Math.max(0, W_Total - totalContentWidth - clampedL - clampedR);
            }

            if (spaceForInsertion < MIN_ELEMENT_WIDTH) {
                const paddingTotalApplied = clampedL + clampedR;
                if (paddingTotalApplied > 50) {
                    setInsertionBlockedWarning(
                        `⚠️ ADVERTENCIA: El padding actual (${Math.floor(paddingTotalApplied)}px) está bloqueando la inserción de nuevos elementos. ` +
                        `Solo quedan ${Math.floor(spaceForInsertion)}px disponibles (se necesitan al menos ${MIN_ELEMENT_WIDTH}px). ` +
                        (mode === 'fijo' 
                            ? `Reduce el padding para poder insertar más elementos.`
                            : `Reduce el padding o elimina elementos para poder insertar más.`)
                    );
                } else {
                    setInsertionBlockedWarning(
                        `ℹ️ Espacio limitado: Solo quedan ${Math.floor(spaceForInsertion)}px disponibles para nuevos elementos (se necesitan ${MIN_ELEMENT_WIDTH}px mínimo).`
                    );
                }
            } else {
                setInsertionBlockedWarning(null);
            }

            // Notify parent if clamped
            if ((clampedL !== padL) || (clampedR !== padR)) {
                // Report exact clamped numeric values (including 0) so the parent
                // preserves the user's intent at the clamped limit instead of
                // resetting to undefined/null which is jarring when overshooting by 1px.
                if (onClampHeaderPadding) onClampHeaderPadding(clampedL, clampedR);
            }

            // If we did a soft clamp, update prevRequestedRef to clamped values so
            // subsequent detection treats it as user's chosen value and avoids oscillation.
            if (wasClamped) {
                prevRequestedRef.current = { left: clampedL, right: clampedR };
            }

            // Update layout after applying paddings
            setTimeout(() => actualizarLayout(), 10);
         } catch (e) {
             console.warn('[SimpleHeaderEditor] error while clamping/applying padding', e);
         }
    }, [headerPaddingLeft, headerPaddingRight, elements, actualizarLayout, onClampHeaderPadding, onMaxPaddingAvailableChange]);

    // =========================================
    // EFFECT: Actualizar layout en cambios
    // =========================================
    useEffect(() => {
        // Forzar actualización cuando cambie el modo o los elementos
        const timer = setTimeout(() => {
            actualizarLayout();
            // also recalc padding in case DOM changed (images loaded, elements resized)
            clampAndReportPadding();
        }, 10);
        
        const handleResize = () => {
            actualizarLayout();
            clampAndReportPadding();
        };
        window.addEventListener('resize', handleResize);
        
        // Observer para detectar cambios en el DOM
        const observer = new MutationObserver(() => {
            actualizarLayout();
            clampAndReportPadding();
        });
        
        if (headerRef.current) {
            observer.observe(headerRef.current, {
                childList: true,
                subtree: true,
                attributes: true
            });
        }
        
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
        };
    }, [elements, mode, actualizarLayout, clampAndReportPadding]);
    
    // =========================================
    // EFFECT: clamp header padding to available space and re-run layout
    // =========================================
    React.useEffect(() => {
        // Delegate to reusable function
        clampAndReportPadding();
     }, [headerPaddingLeft, headerPaddingRight, elements, appliedPaddingLeft, appliedPaddingRight]);

    // =========================================
    // RENDER
    // =========================================
    return (
        <div className="space-y-4">
            {/* Badge del Modo Actual (clicable para abrir Propiedades) y Botón de Diagnóstico */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => onOpenProperties && onOpenProperties()}
                    className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold focus:outline-none transition-shadow",
                        mode === 'fijo'
                            ? "bg-blue-100 text-blue-700 border border-blue-300 hover:shadow"
                            : "bg-green-100 text-green-700 border border-green-300 hover:shadow"
                    )}
                    title="Abrir Propiedades del Header"
                >
                    <span>{mode === 'fijo' ? '🔒' : '↔️'}</span>
                    <span>Modo {mode === 'fijo' ? 'Fijo' : 'Dinámico'} Activo</span>
                </button>
                
                <button
                    onClick={generarDiagnostico}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                    title="Generar reporte JSON con medidas y espacios"
                >
                    <span>📊</span>
                    <span>Diagnóstico JSON</span>
                </button>
            </div>

            {/* Mensaje del sistema */}
            <div className={`text-center p-3 rounded-lg transition-all ${
                messageType === 'error' ? 'bg-red-50 text-red-700 border border-red-200' :
                messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
                'bg-blue-50 text-blue-700 border border-blue-200'
            }`}>
                <p className="text-sm font-medium">{message}</p>
            </div>
            
            {/* Padding warning */}
            {paddingWarning && (
                <div className="text-center p-3 rounded-lg transition-all bg-yellow-50 text-yellow-700 border border-yellow-200">
                    <p className="text-sm font-medium">{paddingWarning}</p>
                </div>
            )}
            
            {/* Insertion blocked warning */}
            {insertionBlockedWarning && (
                <div className={`text-center p-3 rounded-lg transition-all ${
                    insertionBlockedWarning.startsWith('⚠️') 
                        ? 'bg-orange-50 text-orange-700 border border-orange-300'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                }`}>
                    <p className="text-sm font-medium">{insertionBlockedWarning}</p>
                </div>
            )}
            
            {/* Header Container (El Lienzo) */}
            <div 
                ref={headerRef}
                className="relative w-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden"
                style={{ height: '90px' }}
            >
                {/* Independent padding spacers: occupy space and push groups by adjusting group offsets */}
                {appliedPaddingLeft > 0 && (
                    <div className="absolute left-0 top-0 h-full header-spacer-left" style={{ width: appliedPaddingLeft, pointerEvents: 'none' }} />
                )}
                {appliedPaddingRight > 0 && (
                    <div className="absolute right-0 top-0 h-full header-spacer-right" style={{ width: appliedPaddingRight, pointerEvents: 'none' }} />
                )}

                {/* Grupo Izquierdo */}
                <div
                    ref={grupoIzqRef}
                    className="absolute h-full flex items-center gap-0 transition-all"
                    style={{
                        left: appliedPaddingLeft,
                        padding: '0',
                        background: showPlaceholdersGlobally ? 'linear-gradient(90deg, rgba(37, 99, 235, 0.05), transparent)' : 'transparent',
                        borderRight: showPlaceholdersGlobally ? '2px solid rgba(37, 99, 235, 0.2)' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        // UX change: sólo permitir insertar si hay un tipo seleccionado desde la bandeja
                        if (!insertingType) {
                            setMessage('⚠️ Selecciona un elemento desde la bandeja antes de insertar.');
                            setMessageType('error');
                            setTimeout(() => {
                                setMessageType('info');
                                if (mode === 'fijo') {
                                    setMessage('🔒 Modo Fijo: El centro permanece centrado. Los laterales no pueden tocarlo.');
                                } else {
                                    setMessage('↔️ Modo Dinámico: El centro se mueve si los laterales lo empujan.');
                                }
                            }, 1600);
                            return;
                        }
                        intentarInsertar('left');
                    }}
                >
                    {leftElements.map((el, idx) => (
                        <div key={el.id} className="h-11 flex items-center justify-center text-sm relative px-0 mx-0 min-w-0">
                            <HeaderElementRenderer element={el} onRemove={onRemoveElement} onOpenProperties={(id) => onOpenProperties && onOpenProperties(id)} disableInteractions={!!insertingType} />
                        </div>
                    ))}
                    {leftElements.length === 0 && showPlaceholdersGlobally && (
                        <div className="text-xs text-blue-400 font-medium header-placeholder">Zona Izquierda</div>
                    )}
                </div>
                
                {/* Grupo Centro */}
                <div
                    ref={grupoCenRef}
                    className="absolute h-full flex items-center gap-0 justify-center transition-all duration-300 ease-out"
                    style={{
                        padding: '0',
                        background: showPlaceholdersGlobally ? (mode === 'dinamico' ? 'rgba(220, 38, 38, 0.08)' : 'rgba(220, 38, 38, 0.05)') : 'transparent',
                        borderLeft: showPlaceholdersGlobally ? (mode === 'dinamico' ? '2px solid rgba(220, 38, 38, 0.4)' : '2px solid rgba(220, 38, 38, 0.2)') : 'none',
                        borderRight: showPlaceholdersGlobally ? (mode === 'dinamico' ? '2px solid rgba(220, 38, 38, 0.4)' : '2px solid rgba(220, 38, 38, 0.2)') : 'none',
                        cursor: 'pointer',
                        boxShadow: mode === 'dinamico' ? '0 0 12px rgba(220, 38, 38, 0.15)' : 'none'
                    }}
                    onClick={() => {
                        if (!insertingType) {
                            setMessage('⚠️ Selecciona un elemento desde la bandeja antes de insertar.');
                            setMessageType('error');
                            setTimeout(() => {
                                setMessageType('info');
                                if (mode === 'fijo') {
                                    setMessage('🔒 Modo Fijo: El centro permanece centrado. Los laterales no pueden tocarlo.');
                                } else {
                                    setMessage('↔️ Modo Dinámico: El centro se mueve si los laterales lo empujan.');
                                }
                            }, 1600);
                            return;
                        }
                        intentarInsertar('center');
                    }}
                >
                    {centerElements.map((el, idx) => (
                        <div key={el.id} className="h-11 flex items-center justify-center text-sm relative px-0 mx-0 min-w-0">
                            <HeaderElementRenderer element={el} onRemove={onRemoveElement} onOpenProperties={(id) => onOpenProperties && onOpenProperties(id)} disableInteractions={!!insertingType} />
                        </div>
                    ))}
                    {centerElements.length === 0 && showPlaceholdersGlobally && (
                        <div className="text-xs text-red-400 font-medium header-placeholder">Zona Centro</div>
                    )}
                </div>
                
                {/* Grupo Derecho */}
                <div
                    ref={grupoDerRef}
                    className="absolute h-full flex items-center gap-0 flex-row-reverse transition-all"
                    style={{
                        right: appliedPaddingRight,
                        padding: '0',
                        background: showPlaceholdersGlobally ? 'linear-gradient(-90deg, rgba(22,163,74,0.05), transparent)' : 'transparent',
                        borderLeft: showPlaceholdersGlobally ? '2px solid rgba(22,163,74,0.2)' : 'none',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        if (!insertingType) {
                            setMessage('⚠️ Selecciona un elemento desde la bandeja antes de insertar.');
                            setMessageType('error');
                            setTimeout(() => {
                                setMessageType('info');
                                if (mode === 'fijo') {
                                    setMessage('🔒 Modo Fijo: El centro permanece centrado. Los laterales no pueden tocarlo.');
                                } else {
                                    setMessage('↔️ Modo Dinámico: El centro se mueve si los laterales lo empujan.');
                                }
                            }, 1600);
                            return;
                        }
                        intentarInsertar('right');
                    }}
                >
                    {rightElements.map((el, idx) => (
                        <div key={el.id} className="h-11 flex items-center justify-center text-sm relative px-0 mx-0 min-w-0">
                            <HeaderElementRenderer element={el} onRemove={onRemoveElement} onOpenProperties={(id) => onOpenProperties && onOpenProperties(id)} disableInteractions={!!insertingType} />
                        </div>
                    ))}
                    {rightElements.length === 0 && showPlaceholdersGlobally && (
                        <div className="text-xs text-green-400 font-medium header-placeholder">Zona Derecha</div>
                    )}
                </div>
            </div>
            
            {/* Debug Info */}
            <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded">
                Modo: <span className="font-bold">{mode.toUpperCase()}</span> | 
                Elementos: {elements.filter(isRealElement).length} (Izq: {leftElements.length}, Cen: {centerElements.length}, Der: {rightElements.length})
            </div>
        </div>
    );
}
