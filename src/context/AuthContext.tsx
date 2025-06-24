import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'addresses' | 'orderHistory'>) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    admin: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedAdmin = localStorage.getItem('currentAdmin');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAuthState({
        user,
        admin: null,
        isAuthenticated: true,
        isAdmin: false,
      });
    } else if (savedAdmin) {
      const admin = JSON.parse(savedAdmin);
      setAuthState({
        user: null,
        admin,
        isAuthenticated: true,
        isAdmin: true,
      });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: User) => u.email === email);
    
    if (user && password === 'password123') {
      setAuthState({
        user,
        admin: null,
        isAuthenticated: true,
        isAdmin: false,
      });
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    if (email === 'admin@orderonthego.com' && password === 'admin123') {
      const admin: Admin = {
        id: 'admin-1',
        email: 'admin@orderonthego.com',
        name: 'Admin User',
      };
      setAuthState({
        user: null,
        admin,
        isAuthenticated: true,
        isAdmin: true,
      });
      localStorage.setItem('currentAdmin', JSON.stringify(admin));
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'addresses' | 'orderHistory'>): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u: User) => u.email === userData.email);
    
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      addresses: [],
      orderHistory: [],
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    setAuthState({
      user: newUser,
      admin: null,
      isAuthenticated: true,
      isAdmin: false,
    });
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setAuthState({
      user: null,
      admin: null,
      isAuthenticated: false,
      isAdmin: false,
    });
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentAdmin');
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: User) => u.id === updatedUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};