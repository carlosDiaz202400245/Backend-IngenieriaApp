import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (academicId: string, password: string) => boolean;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => boolean;
  resetPassword: (academicId: string, email: string) => boolean;
  updateProfile: (userData: Partial<User>) => void;
  users: User[];
  findUserByAcademicId: (academicId: string) => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  const login = (academicId: string, password: string): boolean => {
    const user = users.find(u => u.academicId === academicId && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    const existingUser = users.find(u => u.academicId === userData.academicId || u.email === userData.email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: (users.length + 1).toString(),
      createdAt: new Date()
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const resetPassword = (academicId: string, email: string): boolean => {
    const user = users.find(u => u.academicId === academicId && u.email === email);
    if (user) {
      console.log('Password reset email sent to:', email);
      return true;
    }
    return false;
  };

  const updateProfile = (userData: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      setCurrentUser(updatedUser);
      setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    }
  };

  const findUserByAcademicId = (academicId: string): User | null => {
    return users.find(u => u.academicId === academicId) || null;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      logout,
      register,
      resetPassword,
      updateProfile,
      users,
      findUserByAcademicId
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usada dentro de un AuthProvider');
  }
  return context;
}