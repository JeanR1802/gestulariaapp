// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const [showHeavyComponents, setShowHeavyComponents] = useState(false);

  useEffect(() => {
    // Ya no necesitamos bloquear el body manualmente porque lo hicimos por CSS global
    if (!loading) {
      setTimeout(() => setShowHeavyComponents(true), 200);
    }
  }, [loading]);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <main className="min-h-screen w-full bg-white text-black">
      <header className="w-full border-b border-gray-200 py-4">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="font-semibold">Gestularia</div>
          <nav className="flex items-center gap-4">
            <a href="#features" className="text-sm">Características</a>
            <a href="#pricing" className="text-sm">Precios</a>
            <a href="/login" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Entrar</a>
          </nav>
        </div>
      </header>

      <div
        id="main-scroll-container"
        className="app-scroll-container"
        style={{ opacity: loading ? 0 : 1 }}
      >
        <section className="py-12 border-b border-gray-200 flex flex-col items-center">
          <div className="max-w-3xl w-full px-4 flex flex-col items-center gap-4">
            <h1 className="text-3xl font-semibold text-center">Gestiona tu negocio en un solo lugar</h1>
            <p className="text-center">Panel simple para ventas, clientes e inventario.</p>
            <div className="flex gap-3">
              <a href="/register" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">Crear cuenta</a>
              <a href="#pricing" className="bg-gray-100 text-black px-4 py-2 rounded hover:bg-gray-200">Ver planes</a>
            </div>
          </div>
        </section>

        {showHeavyComponents && (
          <>
            <section id="features" className="py-12 border-b border-gray-200 flex flex-col items-center">
              <div className="max-w-4xl w-full px-4">
                <h2 className="text-xl font-semibold mb-4">Características</h2>
                <ul className="list-disc pl-6">
                  <li>Gestión de ventas</li>
                  <li>Control de inventario</li>
                  <li>Reportes básicos</li>
                </ul>
              </div>
            </section>

            <section className="py-12 border-b border-gray-200 flex flex-col items-center">
              <div className="max-w-4xl w-full px-4">
                <h2 className="text-xl font-semibold mb-4">Demostración</h2>
                <p>Vista general del panel y herramientas principales.</p>
              </div>
            </section>

            <section id="pricing" className="py-12 border-b border-gray-200 flex flex-col items-center">
              <div className="max-w-4xl w-full px-4">
                <h2 className="text-xl font-semibold mb-4">Precios</h2>
                <ul className="list-disc pl-6">
                  <li>Plan Básico</li>
                  <li>Plan Pro</li>
                  <li>Plan Empresa</li>
                </ul>
              </div>
            </section>

            <section className="py-12 border-b border-gray-200 flex flex-col items-center">
              <div className="max-w-4xl w-full px-4">
                <h2 className="text-xl font-semibold mb-4">Sobre Gestularia</h2>
                <p>Solución simple para negocios que necesitan control y visibilidad.</p>
              </div>
            </section>

            <footer className="py-8 text-center">
              © {new Date().getFullYear()} Gestularia
            </footer>
          </>
        )}
      </div>
    </main>
  );
}