// src/app/dashboard/ClientLayoutWrapper.tsx
"use client";

import { useState } from 'react';
import { Session } from 'next-auth';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './ClientLayoutWrapper.module.css';

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
    session: Session | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
}

export default function ClientLayoutWrapper({ children, session, status }: ClientLayoutWrapperProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (status === "loading") {
        return (
            <div style={{ textAlign: 'center', marginTop: '200px' }}>
                <h1>Cargando...</h1>
                <p>Verificando su sesión...</p>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className={styles.mainLayout}>
                <div className={styles.breadcrumbsContainer}>
                    <Breadcrumbs />
                </div>
                <div className={`${styles.contentWrapper} ${isSidebarOpen ? styles.contentOpen : styles.contentClosed}`}>
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                    <div className={styles.mainContentArea}>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}