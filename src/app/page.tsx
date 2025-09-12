"use client";
import React from 'react';
import Card from '@/components/Card';
import { 
  BsCash, 
  BsFileEarmarkText, 
  BsLock, 
  BsTruck, 
  BsCreditCard, 
  BsTelephone, 
  BsExclamationTriangle, 
  BsGear, 
  BsBarChart 
} from 'react-icons/bs';
import styles from './page.module.css';

const InicioPage = () => {
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.mainTitle}>PANEL PRINCIPAL</h1>
        <h1 className={styles.welcomeText}>Bienvenido, Juan Pérez de las Nieves</h1>
      </div>
      
      <div className={styles.cardsGrid}>
        <Card
          quantity={34}
          description="Cotizaciones activas"
          borderColorClass="border-blue"
        />
        <Card
          quantity={34}
          description="Cotizaciones activas"
          borderColorClass="border-pink"
        />
        <Card
          quantity={34}
          description="Cotizaciones activas"
          borderColorClass="border-purple"
        />
        <Card
          quantity={34}
          description="Cotizaciones activas"
          borderColorClass="border-yellow"
        />
        <Card
          quantity={34}
          description="Cotizaciones activas"
          borderColorClass="border-red"
        />
        <Card
          quantity={34}
          description="Cotizaciones activas"
          borderColorClass="border-green"
        />
      </div>

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
            <span className={styles.activityDate}>5/01/2025</span> - Comisión liquidada
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InicioPage;