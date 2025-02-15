'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 1. Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id?: string;
    role?: string;
    name?: string;
  } | null;
  login: (token: string) => void;
  logout: () => void;
}

// 2. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType['user']>(null);

  // Check if user is logged in when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const role = localStorage.getItem('role');
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      
      setUser({
        id: userId || undefined,
        role: role || undefined,
        name: userName || undefined
      });
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = (token: string) => {
    try {
      // Store token
      localStorage.setItem('token', token);
      
      // Decode token and set user data
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('role', decodedToken.role);
      localStorage.setItem('userId', decodedToken.userId);
      localStorage.setItem('userName', decodedToken.name);
      
      setUser({
        id: decodedToken.userId,
        role: decodedToken.role,
        name: decodedToken.name
      });
      
      setIsAuthenticated(true);
      router.replace('/dashboard'); // Redirect to dashboard after login
    } catch (error) {
      console.error('Login error:', error);
      logout();
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 4. Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
