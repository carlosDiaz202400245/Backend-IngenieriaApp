import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  withCredentials: true
});

interface AuthContextType {
  currentUser: User | null;
  login: (academicId: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (academicId: string, email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (userData: Partial<User>) => void;
  users: User[];
  findUserByAcademicId: (academicId: string) => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const login = async (academicId: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        registro_academico: academicId,
        password: password
      });

      if (response.status === 200) {
        const userData = response.data.data;
        const user: User = {
          id: userData.registro_academico,
          academicId: userData.registro_academico,
          firstName: userData.nombres,
          lastName: userData.apellidos,
          email: userData.correo,
          password: userData.password,
          createdAt: new Date()
        };
        setCurrentUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    try {
      const response = await axios.post('http://localhost:8080/api/register', {
        registro_academico: userData.academicId,
        nombres: userData.firstName,
        apellidos: userData.lastName,
        correo: userData.email,
        password: userData.password
      });

      if (response.status === 201) {
        const newUser: User = {
          id: userData.academicId,
          ...userData,
          createdAt: new Date()
        };
        setUsers([...users, newUser]);
        setCurrentUser(newUser);
        return { success: true };
      }
      return { success: false, error: 'Error al registrar usuario' };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al registrar usuario'
      };
    }
  };

  const resetPassword = async (academicId: string, email: string) => {
    try {
      const response = await axiosInstance.post('/lostPassword', {
        registro_academico: academicId,
        correo: email
      });

      if (response.status === 200) {
        return { success: true };
      }
      return { success: false, error: 'Usuario no encontrado' };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al verificar usuario'
      };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const response = await axiosInstance.post('/newPassword', {
        password: newPassword
      });

      if (response.status === 200) {
        return { success: true };
      }
      return { success: false, error: 'Error al actualizar contraseña' };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Error al actualizar contraseña'
      };
    }
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
      updatePassword,
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