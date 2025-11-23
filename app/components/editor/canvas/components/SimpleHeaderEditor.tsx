"use client";
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { StackElement, StackElementType } from '@/app/components/editor/blocks/CustomStackElements';

interface SimpleHeaderEditorProps {
    elements: StackElement[];
    onAddElement: (zone: 'left' | 'center' | 'right') => void;
    onRemoveElement: (id: string) => void;
    mode?: 'fijo' | 'dinamico';
    insertingType?: StackElementType | null;
    onOpenProperties?: () => void;
}

export function SimpleHeaderEditor({ 
    elements, 
    onAddElement, 
    onRemoveElement,
    mode = 'fijo',
    insertingType = null,
    onOpenProperties
}: SimpleHeaderEditorProps) {
    
    // =========================================
    // CONFIGeURACIeÓN (Del HTML)
    // =========================================
    const GAP = 10;
    const PADDING_CAJA = 20;
    
    // =========================================
    // REFS
    // =========================================
    const headerRef = useRef<HTMLDivElement>(null);
    const grupoIzqRef = useRef<HTMLDivElement>(null);
    const grupoCenRef = useRef<HTMLDivElement>(null);
    const grupoDerRef = useRef<HTMLDivElement>(null);
    
    // =========================================
    // ESTADO
    // =========================================
    const [message, setMessage] = useState<string>('Haz clic en una zona para insertar un logo');
    const [messageType, setMessageType] = useState<'info' | 'error' | 'success'>('info');
    
    // Actualizar mensaje cuando cambie el modo
    useEffect(() => {
        if (mode === 'fijo') {
            setMessage('🔒 Modo Fijo: El centro permanece centrado. Los laterales no pueden tocarlo.');
        } else {
            setMessage('↔️ Modo Dinámico: El centro se mueve si los laterales lo empujan.');
        }
        setMessageType('info');
    }, [mode]);
    
    // Agrupar elementos por zona
    const leftElements = elements.filter(el => (el.data as any)?.zone === 'left');
    const centerElements = elements.filter(el => (el.data as any)?.zone === 'center');
    const rightElements = elements.filter(el => (el.data as any)?.zone === 'right');
    
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
        const W_Izq_Actual = grupoIzqRef.current.offsetWidth;
        let W_Cen_Actual = grupoCenRef.current.offsetWidth;
        const W_Der_Actual = grupoDerRef.current.offsetWidth;
        
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
    const intentarInsertar = (zona: 'left' | 'center' | 'right') => {
        const anchoNuevo = estimateWidthForType('logo');
        
        if (!puedeInsertar(zona, anchoNuevo)) {
            setMessage(`🚫 No hay espacio suficiente en zona ${zona.toUpperCase()}.`);
            setMessageType('error');
            return;
        }
        
        onAddElement(zona);
        setMessage('✅ Elemento agregado correctamente.');
        setMessageType('success');
        
        // Recalcular layout después de insertar
        setTimeout(() => actualizarLayout(), 50);
    };
    
    // =========================================
    // DIAGNÓSTICO: Generar reporte JSON
    // =========================================
    const generarDiagnostico = () => {
        if (!headerRef.current || !grupoIzqRef.current || !grupoCenRef.current || !grupoDerRef.current) {
            alert('⚠️ Referencias no disponibles. Espera un momento e intenta de nuevo.');
            return;
        }
        
        const W_Total = headerRef.current.clientWidth;
        const W_Izq_Actual = grupoIzqRef.current.offsetWidth;
        const W_Cen_DOM = grupoCenRef.current.offsetWidth; // Ancho real del DOM (con padding)
        let W_Cen_Actual = W_Cen_DOM;
        const W_Der_Actual = grupoDerRef.current.offsetWidth;
        
        // Ajustar ancho del centro si está vacío (mismo ajuste que en puedeInsertar)
        if (centerElements.length === 0) {
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
        
        const diagnostico = {
            timestamp: new Date().toISOString(),
            modo: mode,
            dimensiones: {
                anchoTotalHeader: W_Total,
                gap: GAP,
                anchoLogo: anchoLogo
            },
            elementos: {
                izquierda: {
                    cantidad: leftElements.length,
                    anchoTotal: W_Izq_Actual,
                    elementos: leftElements.map(el => el.id)
                },
                centro: {
                    cantidad: centerElements.length,
                    anchoTotal: W_Cen_Actual,
                    anchoDOM: W_Cen_DOM,
                    ajustado: centerElements.length === 0,
                    nota: centerElements.length === 0 
                        ? `El ancho DOM era ${W_Cen_DOM}px (padding+placeholder) pero se ajustó a 0px para cálculos`
                        : 'Ancho real de los elementos',
                    posicionInicio: Inicio_Centro,
                    posicionFin: Fin_Centro,
                    elementos: centerElements.map(el => el.id)
                },
                derecha: {
                    cantidad: rightElements.length,
                    anchoTotal: W_Der_Actual,
                    posicionInicio: W_Total - W_Der_Actual,
                    elementos: rightElements.map(el => el.id)
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
                totalElementos: elements.length,
                espacioUsado: W_Izq_Actual + W_Cen_Actual + W_Der_Actual,
                espacioUsadoPorcentaje: (((W_Izq_Actual + W_Cen_Actual + W_Der_Actual) / W_Total) * 100).toFixed(2) + '%',
                espacioLibreTotal: mode === 'fijo' 
                    ? Espacio_Libre_Izq + Espacio_Libre_Der
                    : W_Total - (W_Izq_Actual + W_Cen_Actual + W_Der_Actual + (GAP * 2))
            }
        };
        
        // Copiar al clipboard y descargar
        const json = JSON.stringify(diagnostico, null, 2);
        navigator.clipboard.writeText(json).then(() => {
            console.log('📋 Diagnóstico copiado al clipboard:', diagnostico);
            alert('✅ Diagnóstico copiado al clipboard y mostrado en consola!\n\nRevisa la consola del navegador para ver el reporte completo.');
        }).catch(() => {
            console.log('📋 Diagnóstico generado:', diagnostico);
            alert('📋 Diagnóstico mostrado en consola del navegador.');
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
    // EFFECT: Actualizar layout en cambios
    // =========================================
    useEffect(() => {
        // Forzar actualización cuando cambie el modo o los elementos
        const timer = setTimeout(() => {
            actualizarLayout();
        }, 10);
        
        const handleResize = () => actualizarLayout();
        window.addEventListener('resize', handleResize);
        
        // Observer para detectar cambios en el DOM
        const observer = new MutationObserver(() => {
            actualizarLayout();
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
    }, [elements, mode]);
    
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
            
            {/* Header Container (El Lienzo) */}
            <div 
                ref={headerRef}
                className="relative w-full bg-white border border-slate-300 rounded-lg shadow-sm overflow-hidden"
                style={{ height: '90px' }}
            >
                {/* Grupo Izquierdo */}
                <div
                    ref={grupoIzqRef}
                    className="absolute left-0 h-full flex items-center gap-2 transition-all"
                    style={{
                        padding: '0 10px',
                        background: 'linear-gradient(90deg, rgba(37, 99, 235, 0.05), transparent)',
                        borderRight: '2px solid rgba(37, 99, 235, 0.2)',
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
                        <div 
                            key={el.id}
                            className="h-11 w-[140px] bg-blue-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md relative group"
                        >
                            Logo {idx + 1}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveElement(el.id);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {leftElements.length === 0 && (
                        <div className="text-xs text-blue-400 font-medium">Zona Izquierda</div>
                    )}
                </div>
                
                {/* Grupo Centro */}
                <div
                    ref={grupoCenRef}
                    className="absolute h-full flex items-center gap-2 justify-center transition-all duration-300 ease-out"
                    style={{
                        padding: '0 10px',
                        background: mode === 'dinamico' 
                            ? 'rgba(220, 38, 38, 0.08)' 
                            : 'rgba(220, 38, 38, 0.05)',
                        borderLeft: mode === 'dinamico'
                            ? '2px solid rgba(220, 38, 38, 0.4)'
                            : '2px solid rgba(220, 38, 38, 0.2)',
                        borderRight: mode === 'dinamico'
                            ? '2px solid rgba(220, 38, 38, 0.4)'
                            : '2px solid rgba(220, 38, 38, 0.2)',
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
                        <div 
                            key={el.id}
                            className="h-11 w-[140px] bg-red-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md relative group"
                        >
                            Logo {idx + 1}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveElement(el.id);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {centerElements.length === 0 && (
                        <div className="text-xs text-red-400 font-medium">Zona Centro</div>
                    )}
                </div>
                
                {/* Grupo Derecho */}
                <div
                    ref={grupoDerRef}
                    className="absolute right-0 h-full flex items-center gap-2 flex-row-reverse transition-all"
                    style={{
                        padding: '0 10px',
                        background: 'linear-gradient(-90deg, rgba(22, 163, 74, 0.05), transparent)',
                        borderLeft: '2px solid rgba(22, 163, 74, 0.2)',
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
                        <div 
                            key={el.id}
                            className="h-11 w-[140px] bg-green-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm shadow-md relative group"
                        >
                            Logo {idx + 1}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveElement(el.id);
                                }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {rightElements.length === 0 && (
                        <div className="text-xs text-green-400 font-medium">Zona Derecha</div>
                    )}
                </div>
            </div>
            
            {/* Debug Info */}
            <div className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded">
                Modo: <span className="font-bold">{mode.toUpperCase()}</span> | 
                Elementos: {elements.length} (Izq: {leftElements.length}, Cen: {centerElements.length}, Der: {rightElements.length})
            </div>
        </div>
    );
}
