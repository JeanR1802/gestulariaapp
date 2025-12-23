'use client';

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-4 relative overflow-hidden">
      
      {/* Fondo de Ruido */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      
      {/* Elemento de fondo decorativo */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* VERSIÓN MÓVIL: Tarjeta simple */}
      <div className="md:hidden w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">
        
        {/* Logo con imagen */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <div className="flex items-center gap-2">
              <Image src="/lgc.png" alt="Gestularia Logo" width={32} height={32} className="object-contain" />
              <span className="text-lg font-bold tracking-tight text-white">Gestularia</span>
            </div>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h1>
          <p className="text-slate-400 text-sm">Ingresa tus datos para acceder al panel.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Correo */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Correo Electrónico</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Contraseña</label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">¿Olvidaste tu contraseña?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
              />
            </div>
          </div>

          {/* Botón */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>

        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            ¿No tienes cuenta? <Link href="/register" className="text-white font-semibold hover:underline">Regístrate gratis</Link>
          </p>
        </div>
      </div>

      {/* VERSIÓN DESKTOP: Panel lateral con gradientes */}
      <div className="hidden md:flex w-full max-w-[1050px] h-[650px] md:h-[600px] bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        
        {/* SECCIÓN IZQUIERDA: FORMULARIO */}
        <div className="w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-between relative z-20 bg-[#0a0a0a]">
            
            {/* Logo */}
            <div className="mb-8">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit">
                    <ArrowLeft className="w-4 h-4 text-slate-500" />
                    <div className="flex items-center gap-2">
                      <Image src="/lgc.png" alt="Gestularia Logo" width={32} height={32} className="object-contain" />
                      <span className="text-xl font-bold tracking-tight text-white">Gestularia</span>
                    </div>
                </Link>
            </div>

            <div className="flex flex-col justify-center flex-grow">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">Bienvenido de nuevo</h1>
                    <p className="text-slate-400 text-sm">Ingresa tus datos para acceder al panel.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Input Correo */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Correo Electrónico</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="tu@correo.com"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Input Contraseña */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">Contraseña</label>
                            <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">¿Olvidaste tu contraseña?</a>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
                            />
                        </div>
                    </div>

                    {/* Botón */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                    </button>

                </form>
            </div>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500">
                    ¿No tienes cuenta? <Link href="/register" className="text-white font-semibold hover:underline">Regístrate gratis</Link>
                </p>
            </div>
        </div>

        {/* SECCIÓN DERECHA: ARTE / VISUAL CON GRADIENTES */}
        <div className="hidden md:flex w-[55%] relative overflow-hidden bg-slate-900">
            
            {/* Gradiente de fondo en lugar de imagen */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-900 z-10"></div>
            
            {/* Contenido flotante */}
            <div className="relative z-20 h-full flex flex-col justify-end p-12">
                <div className="mb-8">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/10">
                        <ArrowRight className="text-white w-6 h-6 -rotate-45" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                        Tu negocio, <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
                            en piloto automático.
                        </span>
                    </h2>
                    <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                        Gestiona ventas, inventario y clientes desde un solo lugar. La herramienta definitiva para el comercio moderno.
                    </p>
                </div>
                
                {/* Indicadores de slide (decorativos) */}
                <div className="flex gap-2">
                    <div className="w-8 h-1 bg-white rounded-full"></div>
                    <div className="w-2 h-1 bg-white/20 rounded-full"></div>
                    <div className="w-2 h-1 bg-white/20 rounded-full"></div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
