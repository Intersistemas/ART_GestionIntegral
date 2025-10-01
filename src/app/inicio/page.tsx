// src/app/page.tsx
"use client";

import { useSession} from "next-auth/react";
import React from 'react';
import Card from '@/components/Card';
import styles from './page.module.css';
import CustomButton from '@/utils/ui/button/CustomButton';
import { 
  BsBellFill,
  BsFileEarmarkLock,
  BsTruck
} from 'react-icons/bs';


const InicioPage = () => {
  const { data: session, status } = useSession();

  const { nombre } = session?.user as any || " ";

  return (
      <div className={styles.inicioContainer}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>Bienvenido, {nombre}</h1>
      </div>

      <div className={styles.cardsGrid}>
        {/* Tarjeta de Siniestros Pendientes */}
        <Card
          title="Siniestros Pendientes"
          quantity={34}
          description="Siniestros"
          lastUpdated="15/01/2025"
          link="/siniestros"
          borderColorClass="border-blue"
        />

        {/* Tarjeta de Pólizas Activas */}
        <Card
          title="Pólizas Activas"
          quantity={34}
          description="Pólizas"
          lastUpdated="15/01/2025"
          link="/polizas"
          borderColorClass="border-pink"
        />
        
        {/* Tarjeta de Alertas CCM */}
        <Card
          title="Alertas CCM"
          quantity={34}
          description="Alertas"
          lastUpdated="15/01/2025"
          link="/alertas-ccm"
          borderColorClass="border-purple"
        />
        {/* Tarjeta de Siniestros Pendientes */}
        <Card
          title="Siniestros Pendientes"
          quantity={34}
          description="Siniestros"
          lastUpdated="15/01/2025"
          link="/siniestros"
          borderColorClass="border-blue"
        />

        {/* Tarjeta de Pólizas Activas */}
        <Card
          title="Pólizas Activas"
          quantity={34}
          description="Pólizas"
          lastUpdated="15/01/2025"
          link="/polizas"
          borderColorClass="border-pink"
        />
        
        {/* Tarjeta de Alertas CCM */}
        <Card
          title="Alertas CCM"
          quantity={34}
          description="Alertas"
          lastUpdated="15/01/2025"
          link="/alertas-ccm"
          borderColorClass="border-purple"
        />
      </div>

    <div className={styles.infoSection}>
        <div className={styles.recentActivity}>
          <h2 className={styles.activityTitle}>Actividad Reciente</h2>
          <ul className={styles.activityList}>
            <li className={styles.activityItem}>
              <span className={styles.activityDate}>25/09/2025</span> - Nueva cotización creada a la empresa SOLES
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityDate}>01/09/2025</span> - Póliza emitida
            </li>
            <li className={styles.activityItem}>
              <span className={styles.activityDate}>05/01/2025</span> - Comisión liquidada
            </li>
          </ul>
          <a href="#" className={styles.viewAllLink}>
            Ver todas las actividades →
          </a>
        </div>
        
        <div className={styles.quickAccess}>
          <h2 className={styles.accessTitle}>Accesos Rápidos</h2>
          <div className={styles.accessButtons}>
            {/* Uso del componente CustomButton */}
            <CustomButton width="60%" >Consultar Siniestro</CustomButton>
            <CustomButton width="60%">DDJJ</CustomButton>
            <CustomButton width="60%">Informes</CustomButton>
            <CustomButton width="60%">Denuncia</CustomButton>
          </div>
        </div>
      </div>
      

    </div>
  );
};

export default InicioPage;
