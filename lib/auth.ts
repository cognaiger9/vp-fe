"use client"

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from './api';

interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthState(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data and token on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('access_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    } else if (storedUser && !storedToken) {
      // User data exists but no token, clear user data
      localStorage.removeItem('user');
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await auth.login({ username, password });
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
      // access_token is stored by auth.login()
    }
  };

  const logout = async () => {
    await auth.logout(); // This clears both access_token and user from localStorage
    setUser(null);
  };

  return {
    user,
    isLoading,
    login,
    logout,
  };
}

// Hook to protect routes
export function useRequireAuth() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  return { user, isLoading };
} 