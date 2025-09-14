"use client";

import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import styles from './ClientSessionWrapper.module.css';
import Providers from "./Providers";

interface Props {
  children: React.ReactNode;
}

export default function ClientSessionWrapper({ children }: Props) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSigninPage = pathname === "/login" || pathname === "/register";

  if (status === "loading") {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Cargando...</p>
      </div>
    );
  }

  return (
    <Providers>
      {!isSigninPage && <Navbar />}
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
    </Providers>
  );
}