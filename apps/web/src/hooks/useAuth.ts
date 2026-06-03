import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ApiClient } from '@/lib/api-client';

export function useAuth() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          throw new Error('No token');
        }
        
        // Verify token with backend
        const profile = await ApiClient.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('auth_token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((token: string, userData: any) => {
    localStorage.setItem('auth_token', token);
    setUser(userData);
    setIsAuthenticated(true);
    router.push('/dashboard');
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setIsAuthenticated(false);
    router.push('/onboarding');
  }, [router]);

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };
}
