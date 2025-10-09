// src/data/AuthContext.tsx
"use client";

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { Modulo, Usuario, Tarea } from '@/data/usuarioAPI'; // usa la Interface que declaro rodri
import { useSession } from 'next-auth/react';

interface AuthContextType {
    session: any;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    user: Usuario | null; 
    hasTask: (taskName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();
    
    // Acceso al objeto de usuario (tipado)
    const user = (session?.user as Usuario) || null;
    
    // Verificación de si el usuario está autenticado
    const isAuthenticated = status === 'authenticated';
    const userModules: Modulo[] = user?.modulos || [];
    const userTasks: Tarea[] = userModules.map(m => m?.tareas).flat() || [];


    const hasTask = (taskName: string): boolean => {
            
        if (isAuthenticated && user) {
            const userRol = user.rol || '';
            // Si tiene el rol "Administrador", siempre permite el acceso.
            if (userRol?.toLowerCase() == "administrador") {
                return true;
            }

            // Si no es Administrador, verifica la tarea específica.
            return userTasks.some(tarea => tarea.tareaDescripcion.toLowerCase() === taskName.toLowerCase());
        }

        return false;
    };
    
    // Usamos useMemo para optimizar el valor del contexto
    const value = useMemo(() => ({
        session,
        status,
        user,
        hasTask,
    }), [session, status, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};