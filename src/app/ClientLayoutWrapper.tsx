// app/ClientLayoutWrapper.tsx
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
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-xl">Cargando...</p>
      </div>
    );
  }

  return (
    <>
      {session && (
        <>
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
          <div className={`pt-16 transition-all duration-300 ${isSidebarOpen ? 'ml-[300px]' : 'ml-[90px]'}`}>
            {/* Contenedor de las migas de pan con un padding inferior para separarlo */}
            <div className="pt-6"> 
              <Breadcrumbs />
            </div>
            {/* Contenedor del contenido principal con los estilos que deseas */}
            <div className={`${styles.mainContentArea}`}>
              {children}
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