// src/data/AuthProvider.tsx
"use client";

import { createContext, useContext, ReactNode } from 'react';
import { Usuario } from '@/data/usuarioAPI';
import { useSession } from 'next-auth/react'; // O tu método para obtener la sesión

interface AuthContextType {
    session: any; // O el tipo de tu sesión
    status: 'loading' | 'authenticated' | 'unauthenticated';
    hasTask: (taskName: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { data: session, status } = useSession();

    const hasTask = (taskName: string): boolean => {

        /*Si el usuario es Administrador*/
        if (status === 'authenticated' && session?.user) {
            const userRoles = (session.user as Usuario)?.roles || [];
            return userRoles.includes("Administrador");
        }

        if (status === 'authenticated' && session?.user) {
            const userTasks = (session.user as Usuario)?.tareas || [];
            return userTasks.includes(taskName);
        }

        return false;
    };

    const value = { session, status, hasTask };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};