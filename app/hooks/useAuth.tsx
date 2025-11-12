// app/hooks/useAuth.tsx
'use client';

import { useState, useEffect } from 'react';

// Simple hook de ejemplo; adapta según tu autenticación real
export function useAuth() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        setUser({ email: 'user@example.com' });
      } else {
        setUser(null);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(t);
  }, []);

  return { user, loading };
}

export default useAuth;
