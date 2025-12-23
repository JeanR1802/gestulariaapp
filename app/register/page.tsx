'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        setError(data.error || 'Error al registrarse');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020202] p-4 relative overflow-hidden">
      
      {/* Fondo simple con gradiente */}
      <div className="absolute inset-0 opacity-30" style={{
        background: 'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.15) 0%, transparent 50%)'
      }} />

      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-8 md:p-12 relative z-10">
        
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
          <h1 className="text-3xl font-bold text-white mb-2">Crear cuenta</h1>
          <p className="text-slate-400 text-sm">Únete a los emprendedores que ya venden más.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Input Nombre */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nombre Completo</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
              />
            </div>
          </div>

          {/* Input Correo */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correo Electrónico</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hola@miempresa.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
              />
            </div>
          </div>

          {/* Input Contraseña */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contraseña</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
                minLength={8}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-indigo-500/5 transition-all text-sm"
              />
            </div>
          </div>

          {/* Botón */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2"
          >
            {loading ? 'Creando cuenta...' : 'Empezar Prueba Gratis'}
          </button>

          <p className="text-xs text-slate-500 text-center mt-4">
            Al registrarte, aceptas nuestros <a href="#" className="underline hover:text-white">Términos</a> y <a href="#" className="underline hover:text-white">Privacidad</a>.
          </p>

        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <p className="text-sm text-slate-500">
            ¿Ya tienes cuenta? <Link href="/login" className="text-white font-semibold hover:underline">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
