// src/app/dashboard/ClientLayoutWrapper.tsx
"use client";

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './ClientLayoutWrapper.module.css';
import { usePathname } from 'next/navigation';

interface ClientLayoutWrapperProps {
    children: React.ReactNode;
    session: Session | null;
    status: 'authenticated' | 'loading' | 'unauthenticated';
}

const formatTitleFromPath = (pathname: string): string => {
    if (pathname === '/dashboard') {
        return 'Dashboard';
    }
    const parts = pathname.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1];
    if (!lastPart) {
        return '';
    }
    const camelCaseToWords = (str: string): string => {
        return str.replace(/([a-z])([A-Z])/g, '$1 $2');
    };
    const formattedString = camelCaseToWords(lastPart);
    return formattedString.charAt(0).toUpperCase() + formattedString.slice(1);
};

export default function ClientLayoutWrapper({ children, session, status }: ClientLayoutWrapperProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const pageTitle = formatTitleFromPath(pathname);

    if (status === "loading") {
        return (
            <div className={styles.loadingContainer}>
                <h1 className={styles.loadingText}>Cargando...</h1>
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
                        {pageTitle && (
                            <div className={styles.pageTitleContainer}>
                                <h1 key={pathname} className={styles.pageTitle}>
                                    {pageTitle}
                                </h1>
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}