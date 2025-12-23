'use client';

import React, { useEffect, useState } from 'react';

export const WelcomeLoader = ({ onLoadingComplete }: { onLoadingComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = [
    "Menos clics, más ventas.",
    "Fluido, rápido y bonito.",
    "Empieza a vender como un pro."
  ];

  useEffect(() => {
    const totalTime = 4500; 
    const intervalTime = 100;
    const steps = totalTime / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    const phraseTimer = setInterval(() => {
        setPhraseIndex((prev) => {
            if (prev < phrases.length - 1) {
                return prev + 1;
            }
            return prev; 
        });
    }, 1500);

    return () => {
        clearInterval(timer);
        clearInterval(phraseTimer);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setIsVisible(false);
        setTimeout(onLoadingComplete, 800);
      }, 500); 
    }
  }, [progress, onLoadingComplete]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020202] text-white px-6 transition-opacity duration-800 overflow-hidden w-full h-full"
      style={{ opacity: progress === 100 ? 0 : 1 }}
    >
      <div className="w-full max-w-4xl flex flex-col items-center gap-12">
        
        {/* LOGO DISCRETO */}
        <div className="absolute top-10 left-0 w-full text-center opacity-50">
          <span className="text-sm font-bold tracking-[0.2em] text-slate-500 uppercase">
            Gestularia
          </span>
        </div>

        {/* FRASE PRINCIPAL */}
        <div className="min-h-[120px] flex items-center justify-center px-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-center leading-tight tracking-tight max-w-full break-words">
            {phrases[phraseIndex]}
          </h1>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="w-full max-w-md">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* PORCENTAJE */}
          <div className="mt-4 flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Cargando experiencia...</span>
            <span className="tabular-nums">{Math.round(progress)}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
