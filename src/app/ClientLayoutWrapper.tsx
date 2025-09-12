"use client";

import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import React, { useState } from "react";
import styles from './ClientLayoutWrapper.module.css';

interface Props {
  children: React.ReactNode;
}

export default function ClientLayoutWrapper({ children }: Props) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Cargando...</p>
      </div>
    );
  }

  // La lógica principal del layout ahora vive aquí, dentro del SessionProvider
  return (
    <>
      {session && (
        <>
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
      )}
      {!session && (
        <div>
          {children}
        </div>
      )}
    </>
  );
}