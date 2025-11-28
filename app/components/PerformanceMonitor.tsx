// app/components/PerformanceMonitor.tsx
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { ChartBarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface PerformanceMetrics {
  timestamp: string;
  duration: number;
  
  // Métricas de memoria
  memory: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    usedPercentage: number;
  } | null;
  
  // Métricas de FPS
  fps: {
    average: number;
    min: number;
    max: number;
    samples: number[];
  };
  
  // Métricas del DOM
  dom: {
    nodeCount: number;
    eventListeners: number;
    styleRecalcs: number;
    layouts: number;
  };
  
  // Métricas de la página
  page: {
    scrollHeight: number;
    scrollTop: number;
    moduleCount: number;
    visibleModules: number;
  };
  
  // Métricas de rendimiento
  performance: {
    firstContentfulPaint: number | null;
    largestContentfulPaint: number | null;
    cumulativeLayoutShift: number | null;
    totalBlockingTime: number | null;
  };
  
  // Actividad durante la medición
  activity: {
    scrollEvents: number;
    clickEvents: number;
    mouseEvents: number;
    resizeEvents: number;
  };
  
  // Advertencias
  warnings: string[];
}

export function PerformanceMonitor() {
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastMetrics, setLastMetrics] = useState<PerformanceMetrics | null>(null);
  
  const recordingRef = useRef<{
    startTime: number;
    frameCount: number;
    frameTimes: number[];
    lastFrameTime: number;
    activity: PerformanceMetrics['activity'];
    rafId: number | null;
  }>({
    startTime: 0,
    frameCount: 0,
    frameTimes: [],
    lastFrameTime: 0,
    activity: {
      scrollEvents: 0,
      clickEvents: 0,
      mouseEvents: 0,
      resizeEvents: 0,
    },
    rafId: null,
  });

  // Medir FPS usando requestAnimationFrame
  const measureFrame = useCallback((currentTime: number) => {
    const ref = recordingRef.current;
    
    if (ref.lastFrameTime > 0) {
      const frameDuration = currentTime - ref.lastFrameTime;
      const fps = 1000 / frameDuration;
      ref.frameTimes.push(fps);
      ref.frameCount++;
    }
    
    ref.lastFrameTime = currentTime;
    
    // Continuar midiendo si aún estamos grabando
    if (isRecording) {
      ref.rafId = requestAnimationFrame(measureFrame);
    }
  }, [isRecording]);

  // Capturar eventos de actividad
  const setupEventListeners = useCallback(() => {
    const ref = recordingRef.current;
    
    const handleScroll = () => ref.activity.scrollEvents++;
    const handleClick = () => ref.activity.clickEvents++;
    const handleMouseMove = () => ref.activity.mouseEvents++;
    const handleResize = () => ref.activity.resizeEvents++;
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Obtener métricas de memoria
  const getMemoryMetrics = (): PerformanceMetrics['memory'] => {
    if ('memory' in performance && (performance as any).memory) {
      const mem = (performance as any).memory;
      return {
        usedJSHeapSize: mem.usedJSHeapSize,
        totalJSHeapSize: mem.totalJSHeapSize,
        jsHeapSizeLimit: mem.jsHeapSizeLimit,
        usedPercentage: (mem.usedJSHeapSize / mem.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  };

  // Obtener métricas del DOM
  const getDOMMetrics = (): PerformanceMetrics['dom'] => {
    const nodeCount = document.getElementsByTagName('*').length;
    
    // Estimar event listeners (aproximación)
    const eventListeners = Array.from(document.querySelectorAll('[onclick], button, a, input')).length;
    
    // Obtener performance entries
    const perfEntries = performance.getEntriesByType('measure');
    
    return {
      nodeCount,
      eventListeners,
      styleRecalcs: perfEntries.filter(e => e.name.includes('style')).length,
      layouts: perfEntries.filter(e => e.name.includes('layout')).length,
    };
  };

  // Obtener métricas de la página
  const getPageMetrics = (): PerformanceMetrics['page'] => {
    const moduleCount = document.querySelectorAll('.module').length;
    
    // Calcular módulos visibles en viewport
    const modules = Array.from(document.querySelectorAll('.module'));
    const visibleModules = modules.filter(el => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
      );
    }).length;
    
    return {
      scrollHeight: document.documentElement.scrollHeight,
      scrollTop: window.scrollY,
      moduleCount,
      visibleModules,
    };
  };

  // Obtener métricas de performance API
  const getPerformanceMetrics = (): PerformanceMetrics['performance'] => {
    const perfEntries = performance.getEntriesByType('paint');
    const navigationEntries = performance.getEntriesByType('navigation');
    
    const fcp = perfEntries.find(e => e.name === 'first-contentful-paint');
    
    return {
      firstContentfulPaint: fcp ? fcp.startTime : null,
      largestContentfulPaint: null, // Requiere PerformanceObserver
      cumulativeLayoutShift: null, // Requiere PerformanceObserver
      totalBlockingTime: null, // Requiere PerformanceObserver
    };
  };

  // Generar advertencias basadas en métricas
  const generateWarnings = (metrics: Partial<PerformanceMetrics>): string[] => {
    const warnings: string[] = [];
    
    // Advertencias de FPS
    if (metrics.fps && metrics.fps.average < 30) {
      warnings.push(`⚠️ FPS muy bajo: ${metrics.fps.average.toFixed(1)} (objetivo: 60)`);
    } else if (metrics.fps && metrics.fps.average < 50) {
      warnings.push(`⚡ FPS bajo: ${metrics.fps.average.toFixed(1)} (objetivo: 60)`);
    }
    
    // Advertencias de memoria
    if (metrics.memory && metrics.memory.usedPercentage > 80) {
      warnings.push(`🔴 Memoria crítica: ${metrics.memory.usedPercentage.toFixed(1)}% usado`);
    } else if (metrics.memory && metrics.memory.usedPercentage > 60) {
      warnings.push(`🟡 Memoria alta: ${metrics.memory.usedPercentage.toFixed(1)}% usado`);
    }
    
    // Advertencias de DOM
    if (metrics.dom && metrics.dom.nodeCount > 1500) {
      warnings.push(`📦 DOM grande: ${metrics.dom.nodeCount} nodos (considerar virtualización)`);
    }
    
    // Advertencias de módulos
    if (metrics.page && metrics.page.moduleCount > 20) {
      warnings.push(`📊 Muchos módulos: ${metrics.page.moduleCount} (considerar lazy loading)`);
    }
    
    // Advertencias de actividad
    if (metrics.activity && metrics.activity.scrollEvents > 100) {
      warnings.push(`📜 Muchos scroll events: ${metrics.activity.scrollEvents} (usar throttle)`);
    }
    
    if (metrics.activity && metrics.activity.mouseEvents > 500) {
      warnings.push(`🖱️ Muchos mouse events: ${metrics.activity.mouseEvents} (usar throttle)`);
    }
    
    return warnings;
  };

  // Iniciar grabación
  const startRecording = useCallback(() => {
    setIsRecording(true);
    
    // Reset
    recordingRef.current = {
      startTime: performance.now(),
      frameCount: 0,
      frameTimes: [],
      lastFrameTime: 0,
      activity: {
        scrollEvents: 0,
        clickEvents: 0,
        mouseEvents: 0,
        resizeEvents: 0,
      },
      rafId: null,
    };
    
    // Iniciar medición de FPS
    recordingRef.current.rafId = requestAnimationFrame(measureFrame);
    
    // Configurar event listeners
    const cleanup = setupEventListeners();
    
    // Detener después de 5 segundos
    setTimeout(() => {
      stopRecording();
      cleanup();
    }, 5000);
  }, [measureFrame, setupEventListeners]);

  // Detener grabación y generar reporte
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    const ref = recordingRef.current;
    
    // Cancelar RAF
    if (ref.rafId) {
      cancelAnimationFrame(ref.rafId);
    }
    
    // Calcular duración
    const duration = performance.now() - ref.startTime;
    
    // Calcular FPS
    const fpsSamples = ref.frameTimes;
    const avgFps = fpsSamples.length > 0 
      ? fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length 
      : 0;
    const minFps = fpsSamples.length > 0 ? Math.min(...fpsSamples) : 0;
    const maxFps = fpsSamples.length > 0 ? Math.max(...fpsSamples) : 0;
    
    // Construir métricas completas
    const metrics: PerformanceMetrics = {
      timestamp: new Date().toISOString(),
      duration,
      memory: getMemoryMetrics(),
      fps: {
        average: avgFps,
        min: minFps,
        max: maxFps,
        samples: fpsSamples,
      },
      dom: getDOMMetrics(),
      page: getPageMetrics(),
      performance: getPerformanceMetrics(),
      activity: ref.activity,
      warnings: [],
    };
    
    // Generar advertencias
    metrics.warnings = generateWarnings(metrics);
    
    setLastMetrics(metrics);
    setIsOpen(true);
  }, []);

  // Exportar JSON
  const exportJSON = () => {
    if (!lastMetrics) return;
    
    const json = JSON.stringify(lastMetrics, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copiar al portapapeles
  const copyToClipboard = () => {
    if (!lastMetrics) return;
    
    const json = JSON.stringify(lastMetrics, null, 2);
    navigator.clipboard.writeText(json);
  };

  // Formatear bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <>
      {/* Botón flotante de Performance */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={cn(
          "fixed bottom-24 right-8 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50",
          isRecording 
            ? "bg-red-500 animate-pulse" 
            : "bg-purple-600 hover:bg-purple-700 hover:scale-110"
        )}
        title={isRecording ? "Grabando... (click para detener)" : "Iniciar análisis de 5s"}
      >
        <ChartBarIcon className="w-6 h-6 text-white" />
      </button>

      {/* Panel de resultados */}
      {isOpen && lastMetrics && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0D1222] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Performance Report</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Duración: {(lastMetrics.duration / 1000).toFixed(2)}s
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Advertencias */}
              {lastMetrics.warnings.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h3 className="font-semibold text-red-400 mb-2">⚠️ Advertencias</h3>
                  <ul className="space-y-1">
                    {lastMetrics.warnings.map((warning, i) => (
                      <li key={i} className="text-sm text-red-300">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* FPS */}
              <MetricCard
                title="📊 Frames por Segundo (FPS)"
                data={[
                  { label: 'Promedio', value: lastMetrics.fps.average.toFixed(1), suffix: 'fps', status: lastMetrics.fps.average >= 50 ? 'good' : lastMetrics.fps.average >= 30 ? 'warning' : 'bad' },
                  { label: 'Mínimo', value: lastMetrics.fps.min.toFixed(1), suffix: 'fps' },
                  { label: 'Máximo', value: lastMetrics.fps.max.toFixed(1), suffix: 'fps' },
                  { label: 'Samples', value: lastMetrics.fps.samples.length.toString() },
                ]}
              />

              {/* Memoria */}
              {lastMetrics.memory && (
                <MetricCard
                  title="💾 Memoria JavaScript"
                  data={[
                    { label: 'Usado', value: formatBytes(lastMetrics.memory.usedJSHeapSize) },
                    { label: 'Total', value: formatBytes(lastMetrics.memory.totalJSHeapSize) },
                    { label: 'Límite', value: formatBytes(lastMetrics.memory.jsHeapSizeLimit) },
                    { label: 'Porcentaje', value: lastMetrics.memory.usedPercentage.toFixed(1), suffix: '%', status: lastMetrics.memory.usedPercentage < 60 ? 'good' : lastMetrics.memory.usedPercentage < 80 ? 'warning' : 'bad' },
                  ]}
                />
              )}

              {/* DOM */}
              <MetricCard
                title="🌳 Árbol DOM"
                data={[
                  { label: 'Nodos', value: lastMetrics.dom.nodeCount.toString(), status: lastMetrics.dom.nodeCount < 1500 ? 'good' : 'warning' },
                  { label: 'Event Listeners', value: lastMetrics.dom.eventListeners.toString() },
                  { label: 'Style Recalcs', value: lastMetrics.dom.styleRecalcs.toString() },
                  { label: 'Layouts', value: lastMetrics.dom.layouts.toString() },
                ]}
              />

              {/* Página */}
              <MetricCard
                title="📄 Página"
                data={[
                  { label: 'Módulos Totales', value: lastMetrics.page.moduleCount.toString(), status: lastMetrics.page.moduleCount < 20 ? 'good' : 'warning' },
                  { label: 'Módulos Visibles', value: lastMetrics.page.visibleModules.toString() },
                  { label: 'Altura Scroll', value: lastMetrics.page.scrollHeight.toString(), suffix: 'px' },
                  { label: 'Posición Scroll', value: lastMetrics.page.scrollTop.toString(), suffix: 'px' },
                ]}
              />

              {/* Actividad */}
              <MetricCard
                title="🎯 Actividad del Usuario"
                data={[
                  { label: 'Scroll Events', value: lastMetrics.activity.scrollEvents.toString(), status: lastMetrics.activity.scrollEvents < 100 ? 'good' : 'warning' },
                  { label: 'Click Events', value: lastMetrics.activity.clickEvents.toString() },
                  { label: 'Mouse Events', value: lastMetrics.activity.mouseEvents.toString(), status: lastMetrics.activity.mouseEvents < 500 ? 'good' : 'warning' },
                  { label: 'Resize Events', value: lastMetrics.activity.resizeEvents.toString() },
                ]}
              />
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={exportJSON}
                className="flex-1 px-4 py-2 bg-[#14B8A6] text-[#001A33] font-semibold rounded-lg hover:bg-[#0F766E] transition"
              >
                💾 Descargar JSON
              </button>
              <button
                onClick={copyToClipboard}
                className="flex-1 px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition"
              >
                📋 Copiar al Portapapeles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Componente auxiliar para tarjetas de métricas
function MetricCard({ title, data }: { 
  title: string; 
  data: Array<{ 
    label: string; 
    value: string; 
    suffix?: string; 
    status?: 'good' | 'warning' | 'bad' 
  }> 
}) {
  return (
    <div className="bg-[#111827] border border-white/5 rounded-xl p-4">
      <h3 className="font-semibold text-white mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {data.map((item, i) => (
          <div key={i} className="space-y-1">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className={cn(
              "text-lg font-bold",
              item.status === 'good' && "text-green-400",
              item.status === 'warning' && "text-yellow-400",
              item.status === 'bad' && "text-red-400",
              !item.status && "text-white"
            )}>
              {item.value}{item.suffix && <span className="text-sm ml-1">{item.suffix}</span>}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
