'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const hasAuthToken = document.cookie.includes('auth_token=');
      console.log('Cookie string:', document.cookie); // Debug log
      setIsAuthenticated(hasAuthToken);
    };

    // Initial check
    checkAuth();

    // Check whenever the window gains focus
    window.addEventListener('focus', checkAuth);
    
    // Check periodically (every 5 seconds)
    const interval = setInterval(checkAuth, 5000);

    return () => {
      window.removeEventListener('focus', checkAuth);
      clearInterval(interval);
    };
  }, []);

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      setIsAuthenticated(false);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return { isAuthenticated, signOut };
} 