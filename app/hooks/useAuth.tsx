// app/hooks/useAuth.tsx
'use client';

import { useState, useEffect } from 'react';

type User = {
  email: string;
  key: string;
} | null;

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateAuth = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Decodificar el JWT para obtener email y key
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        if (payload && payload.email && payload.key) {
          setUser({ 
            email: payload.email,
            key: payload.key 
          });
        } else {
          // Token inválido
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error('Error validando auth:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validateAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, loading, logout };
}

export default useAuth;
