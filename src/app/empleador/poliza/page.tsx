// components/poliza/poliza.tsx
"use client";

import React from 'react';
import { useSession } from "next-auth/react"; // Importa el hook useSession
import styles from './poliza.module.css';

const Poliza = () => {
  const { data: session, status } = useSession();

  // Muestra un estado de carga mientras se verifica la sesión
  if (status === "loading") {
    return <div className={styles.loading}>Cargando datos de póliza...</div>;
  }

  console.log('session?.user',session?.user);
  const { email, nombre, cuit } = session?.user as any;

  return (
    <div>
      {/* Sección de Razón Social */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.title}>Razón Social</h2>
        <p className={styles.data}>{nombre}</p>
      </div>
      
      {/* Sección de Datos de la Aseguradora */}
      <h3 className={styles.sectionTitle}>Datos de la Aseguradora</h3>
      <div className={styles.dataGrid}>
        <div className={styles.dataItem}>
          <p className={styles.label}>CUIT:</p>
          <p className={styles.value}>30716211432</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Domicilio:</p>
          <p className={styles.value}>Reconquista 630 Piso:6 - C.A.B.A. - CAPITAL FEDERAL - CP:1003</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Teléfono:</p>
          <p className={styles.value}>(011)(37546700)</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Email:</p>
          <p className={styles.value}>info@artmutualrural.org.ar</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Reclamos y Consultas:</p>
          <p className={styles.value}>08003332786</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Denominación:</p>
          <p className={styles.value}>ART MUTUAL RURAL DE SEGUROS DE RIESGOS DEL TRABAJO</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>FAX:</p>
          <p className={styles.value}>(011)(37546700)</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Página web:</p>
          <p className={styles.value}>www.artmutualrural.org.ar</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Denuncias y Accidentes:</p>
          <p className={styles.value}>08003336888</p>
        </div>
      </div>
      
      {/* Sección de Canal Comercial */}
      <h3 className={styles.sectionTitle}>Canal Comercial</h3>
      <div className={styles.dataGrid}>
        <div className={styles.dataItem}>
          <p className={styles.label}>CUIT/CUIL:</p>
          <p className={styles.value}>xxxxxx</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Matricula:</p>
          <p className={styles.value}>0000000</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Apellido y Nombre/Denominación:</p>
          <p className={styles.value}>xxxxxx</p>
        </div>
      </div>

      {/* Sección de Datos del Empleador */}
      <h3 className={styles.sectionTitle}>Datos del Empleador</h3>
      <div className={styles.dataGrid}>
        <div className={styles.dataItem}>
          <p className={styles.label}>Nº Póliza Digital:</p>
          <p className={styles.value}>5013033</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Nº CUIT:</p>
          <p className={styles.value}>{cuit}</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Vigencia Desde:</p>
          <p className={styles.value}>2020-10-01T00:00:00</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Vigencia Hasta:</p>
          <p className={styles.value}>2025-09-30T00:00:00</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Localidad:</p>
          <p className={styles.value}>CAPITAL FEDERAL - CP:1003</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Provincia:</p>
          <p className={styles.value}>C.A.B.A.</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Calle:</p>
          <p className={styles.value}>reconquista6306</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Email:</p>
          <p className={styles.value}>{email}</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Telefono:</p>
          <p className={styles.value}>(011)43155800</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Móvil:</p>
          <p className={styles.value}>(011)1550602474</p>
        </div>
      </div>
      
      {/* Sección de Condiciones Comerciales */}
      <h3 className={styles.sectionTitle}>Condiciones Comerciales</h3>
      <div className={styles.dataGrid}>
        <div className={styles.dataItem}>
          <p className={styles.label}>CIIU:</p>
          <p className={styles.value}>942000</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Alicuota</p>
          <p className={styles.value}>
            <span className={styles.smallText}>ILT: 1</span><br />
            <span className={styles.smallText}>Valor Fijo: $0</span><br />
            <span className={styles.smallText}>Valor Variable: %2.1</span>
          </p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Alicuota</p>
          <p className={styles.value}>
            <span className={styles.smallText}>Nivel: 2</span><br />
            <span className={styles.smallText}>FFE: 928</span>
          </p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Nº Solicitud:</p>
          <p className={styles.value}>265112</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Codigo Operacion:</p>
          <p className={styles.value}>44</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Codigo Motivo Sorteo:</p>
          <p className={styles.value}>0</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Referencia ART</p>
          <p className={styles.value}>Cuota Resultante: 38734824.34</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Cantidad de Trabajadores:</p>
          <p className={styles.value}>1345</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Masa Salarial</p>
          <p className={styles.value}>785079254.09</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Bonificación</p>
          <p className={styles.value}>no plica</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Clausula Penal:</p>
          <p className={styles.value}>Por incumplimiento de denuncias del empleador, consistente en límite mínimo de la base imponible para el cálculo de los aportes y contribuciones al SIPA, establecidos en el art 9 de la ley 24241 y sus modif.</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Unico Establecimiento:</p>
          <p className={styles.value}>0</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Prestador Medico</p>
          <p className={styles.value}>0</p>
        </div>
        <div className={styles.dataItem}>
          <p className={styles.label}>Bonificación</p>
          <p className={styles.value}>no plica</p>
        </div>
      </div>
    </div>
  );
};

export default Poliza;