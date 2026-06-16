'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md flex flex-col gap-4 border border-gray-200 p-6 rounded">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>

        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            className="border border-gray-300 rounded p-2 w-full"
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="border border-gray-300 rounded p-2 w-full"
          />

          <button type="submit" disabled={loading} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">Regístrate</Link>
        </div>
      </div>
    </div>
  );
}
