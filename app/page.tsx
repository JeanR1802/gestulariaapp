// app/page.tsx
"use client";
import React, { useState, useEffect } from "react";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger animations
    setTimeout(() => setIsVisible(true), 200);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white text-gray-900 font-sans antialiased">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrollY > 20 ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-2xl font-bold text-gray-900">Gestularia</h1>
          </div>
          
          <nav className={`hidden md:flex items-center space-x-8 transition-all duration-700 delay-100 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            {['Inicio', 'Funciones', 'Precios', 'Contacto'].map((item, i) => (
              <a key={item} href={i === 0 ? "#" : `#${item.toLowerCase()}`} 
                 className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {item}
              </a>
            ))}
          </nav>
          
          <div className={`flex items-center gap-4 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <a href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Iniciar sesión
            </a>
            <a href="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all">
              Empezar gratis
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto">
              <div className={`transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-600 mb-8">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Nuevo: Módulos de IA disponibles
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                  Gestiona tu negocio
                  <br />
                  <span className="text-blue-600">sin complicaciones</span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                  La plataforma SaaS modular que crece contigo. Solo paga por lo que necesitas, 
                  cuando lo necesitas.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg">
                    Prueba gratuita de 14 días
                  </a>
                  <a href="#demo" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Ver demo
                  </a>
                </div>
              </div>
              
              {/* --- INICIO DE LA SECCIÓN MODIFICADA --- */}
              {/* Dashboard Preview Modular */}
              <div className={`mt-16 transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10"></div>
                  <div className="bg-gray-50 rounded-2xl p-6 shadow-2xl border">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>
                          <div className="text-sm font-medium text-gray-600">Tu Dashboard Modular</div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {[
                            {
                              icon: "🌐",
                              title: "Gestor de Sitios",
                              desc: "Crea y edita tus páginas."
                            },
                            {
                              icon: "👥",
                              title: "Clientes (CRM)",
                              desc: "Gestiona tus contactos."
                            },
                            {
                              icon: "📋",
                              title: "Proyectos",
                              desc: "Organiza tus tareas."
                            },
                          ].map((module, i) => (
                            <div key={i} className="bg-gray-50 rounded-lg p-4 text-left">
                               <div className="text-2xl mb-2">{module.icon}</div>
                               <h4 className="font-semibold text-gray-800">{module.title}</h4>
                               <p className="text-sm text-gray-500">{module.desc}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-center text-gray-500 text-xs mt-6">...y activa más módulos cuando los necesites.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
               {/* --- FIN DE LA SECCIÓN MODIFICADA --- */}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Todo lo que necesitas, nada que no
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Módulos independientes que se integran perfectamente
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "👥",
                  title: "CRM Inteligente",
                  desc: "Gestiona clientes, leads y ventas desde un solo lugar"
                },
                {
                  icon: "📊",
                  title: "Analytics en Tiempo Real",
                  desc: "Métricas y reportes que importan para tu negocio"
                },
                {
                  icon: "💰",
                  title: "Facturación Automática",
                  desc: "Genera facturas, controla pagos y gestiona finanzas"
                },
                {
                  icon: "📋",
                  title: "Gestión de Proyectos",
                  desc: "Organiza tareas, tiempos y recursos eficientemente"
                },
                {
                  icon: "🔒",
                  title: "Seguridad Bancaria",
                  desc: "Encriptación de grado militar para tus datos"
                },
                {
                  icon: "🚀",
                  title: "API Abierta",
                  desc: "Integra con tus herramientas favoritas fácilmente"
                }
              ].map((feature, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-500 mb-8">
                Más de 2,500 empresas confían en Gestularia
              </p>
              <div className="flex items-center justify-center gap-12 opacity-40">
                {['Empresa A', 'Startup B', 'Corp C', 'Tech D', 'Biz E'].map((company, i) => (
                  <div key={i} className="text-lg font-bold text-gray-400">{company}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 bg-blue-600">
          <div className="max-w-4xl mx-auto px-6 text-center">
          <blockquote className="text-3xl font-medium text-white mb-8 leading-relaxed">
          &quot;Gestularia eliminó el caos de nuestras operaciones. 
          Ahora nos enfocamos en crecer, no en administrar herramientas.&quot;
          </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                M
              </div>
              <div className="text-left text-white">
                <div className="font-semibold">María Fernández</div>
                <div className="text-blue-200 text-sm">CEO, TechStart</div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing CTA */}
        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Comienza hoy mismo
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              14 días gratis. Sin tarjeta de crédito. Cancela cuando quieras.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all hover:scale-105">
                Empezar prueba gratuita
              </a>
              <a href="/precios" className="text-gray-600 hover:text-gray-900 font-medium">
                Ver planes y precios →
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Sin compromisos
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Soporte incluido
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Migración gratuita
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Gestularia</h3>
              <p className="text-gray-600 text-sm">
                La plataforma SaaS que simplifica la gestión empresarial
              </p>
            </div>
            
            {[
              {
                title: "Producto",
                links: ["Funciones", "Precios", "Integraciones", "API"]
              },
              {
                title: "Empresa",
                links: ["Sobre nosotros", "Blog", "Carreras", "Contacto"]
              },
              {
                title: "Soporte",
                links: ["Ayuda", "Documentación", "Estado", "Comunidad"]
              }
            ].map((section, i) => (
              <div key={i}>
                <h4 className="font-semibold text-gray-900 mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-gray-600 hover:text-gray-900">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2025 Gestularia. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacidad</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Términos</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}