'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md flex flex-col gap-4 border border-gray-200 p-6 rounded">
        <h1 className="text-2xl font-semibold">Crear cuenta</h1>

        {error && (
          <div>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>Nombre Completo</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Pérez"
            required
            className="border border-gray-300 rounded p-2 w-full"
          />

          <label>Correo Electrónico</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="hola@miempresa.com"
            required
            className="border border-gray-300 rounded p-2 w-full"
          />

          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mínimo 8 caracteres"
            required
            minLength={8}
            className="border border-gray-300 rounded p-2 w-full"
          />

          <button type="submit" disabled={loading} className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
            {loading ? 'Creando cuenta...' : 'Empezar Prueba Gratis'}
          </button>
        </form>

        <div className="text-sm">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-700">Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
