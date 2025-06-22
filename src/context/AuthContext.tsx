import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { createContext } from 'react';

const API_BASE_URL = 'http://localhost:5000/api';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('boltToken');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Authentication failed');
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('boltToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('boltToken', token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, { username, email, password });
    const { token, user } = response.data;

    // Save token to localStorage
    localStorage.setItem('boltToken', token);

    // Set user state
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('boltToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};