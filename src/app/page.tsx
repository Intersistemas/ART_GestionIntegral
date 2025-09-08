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

const DashboardPage = () => {
  return (
    <div className={styles.dashboardGrid}>
      <Card
        title="Cuentas Corrientes"
        icon={BsCash}
        link="/cuentas-corrientes"
        borderColorClass="border-blue" // Aquí se especifica la clase del borde
      />
      <Card
        title="Gestión de Contratos"
        icon={BsFileEarmarkText}
        link="/gestion-contratos"
        borderColorClass="border-green"
      />
      <Card
        title="Gestión de Pólizas"
        icon={BsLock}
        link="/gestion-polizas"
        borderColorClass="border-yellow"
      />
      <Card
        title="Siniestros"
        icon={BsTruck}
        link="/siniestros"
        borderColorClass="border-red"
      />
      <Card
        title="Prestaciones Dinerarias"
        icon={BsCreditCard}
        link="/prestaciones-dinerarias"
        borderColorClass="border-purple"
      />
      <Card
        title="Consultas y Reclamos"
        icon={BsTelephone}
        link="/consultas-reclamos"
        borderColorClass="border-blue"
      />
      <Card
        title="Prevención"
        icon={BsExclamationTriangle}
        link="/prevencion"
        borderColorClass="border-yellow"
      />
      <Card
        title="Parametrización"
        icon={BsGear}
        link="/parametrizacion"
        borderColorClass="border-green"
      />
      <Card
        title="Reportes"
        icon={BsBarChart}
        link="/reportes"
        borderColorClass="border-purple"
      />
       <Card
        title="CCMM"
        icon={BsBarChart}
        link="/ccmm"
        borderColorClass="border-blue"
      />
       <Card
        title="INTRANET"
        icon={BsBarChart}
        link="/intranet"
        borderColorClass="border-blue"
      />
       <Card
        title="Capacitaciones"
        icon={BsBarChart}
        link="/intranet"
        borderColorClass="border-blue"
      />
    </div>
  );
};

export default DashboardPage;