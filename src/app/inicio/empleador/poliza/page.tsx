// components/poliza/poliza.tsx
"use client"; // Marca el componente como un Componente de Cliente

import React from 'react';
import styles from './poliza.module.css';
import { useAuth } from "@/data/AuthContext";
import {
  Box,
  Input,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";

const Poliza = () => {

  const { user } = useAuth(); 

  if (!user) {
    return <p>Error: Sesión no válida o no encontrada.</p>;
  }

  // Accede a las propiedades de la sesión con seguridad
  const { email, nombre, cuit } = user as any;

  return (
    <div>
      {/* Sección de Razón Social */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.headerTitle}>Razón Social</h2>
        <p className={styles.headerData}>{nombre}</p>
      </div>

      {/* Sección de Datos de la Aseguradora */}
      <h3 className={styles.sectionTitle}>Datos de la Aseguradora</h3>
      <div className={styles.dataGrid}>
  
         <TextField
            label="CUIT:"
            name="CUIT"
            value="30-71.621.143-2"
            fullWidth
            variant='standard'
          />

          <TextField
            label="Domicilio:"
            name="Domicilio"
            value="Reconquista 630 Piso:6 - C.A.B.A. - CAPITAL FEDERAL - CP:1003"
            fullWidth
            variant='standard'
          />

           <TextField
            label="Teléfono:"
            name="Telefono"
            value="(011)(37546700)"
            fullWidth
            variant='standard'
          />
        
         <TextField
            label="Email:"
            name="Email"
            value="info@artmutualrural.org.ar"
            fullWidth
            variant='standard'
          />
           <TextField
            label="Reclamos y Consultas:"
            name="reclamos"
            value="0800-333-2786"
            fullWidth
            variant='standard'
          />
           <TextField
            label="Denominación:"
            name="Denominacion"
            value="ART MUTUAL RURAL DE SEGUROS DE RIESGOS DEL TRABAJO"
            fullWidth
            variant='standard'
          />
           <TextField
            label="FAX:"
            name="FAX"
            value="(011)(37546700)"
            fullWidth
            variant='standard'
          />
           <TextField
            label="Página web:"
            name="web"
            value="www.artmutualrural.org.ar"
            fullWidth
            variant='standard'
          />
           <TextField
            label="Denuncias y Accidentes:"
            name="denuncias"
            value="0800-333-6888"
            fullWidth
            variant='standard'
          />
      </div>

      {/* Sección de Canal Comercial */}
      <h3 className={styles.sectionTitle}>Canal Comercial</h3>
      <div className={styles.dataGrid}>
        <TextField
          label="CUIT/CUIL:"
          name="cuitcuil"
          value="-----------"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Matricula:"
          name="Matricula"
          value="-----------"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Apellido y Nombre/Denominación:"
          name="apellidoynombre"
          value="-----------"
          fullWidth
          variant='standard'
        />
      </div>

      {/* Sección de Datos del Empleador */}
      <h3 className={styles.sectionTitle}>Datos del Empleador</h3>
      <div className={styles.dataGrid}>
        <TextField
          label="Nº Póliza Digital:"
          name="NroPoliza"
          value="5013033"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Nº CUIT:"
          name="CUITEmpleador"
          value={cuit}
          fullWidth
          variant='standard'
        />
        <TextField
          label="Vigencia Desde:"
          name="desde"
          value="2023-10-01"
          fullWidth
          variant='standard'
        />
         <TextField
          label="Vigencia Hasta:"
          name="hasta"
          value="2026-10-01"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Localidad:"
          name="Localidad"
          value="CAPITAL FEDERAL - CP:1003"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Provincia:"
          name="Provincia"
          value="C.A.B.A"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Calle:"
          name="Calle"
          value="Reconquista Nro: 6306"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Email:"
          name="EmailEmpleador"
          value={email}
          fullWidth
          variant='standard'
        />
        <TextField
          label="Telefono:"
          name="TelefonoEmpleador"
          value="(011)43155800"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Movil:"
          name="MovilEmpleador"
          value="(011)1550602474"
          fullWidth
          variant='standard'
        />
      </div>

      {/* Sección de Condiciones Comerciales */}
      <h3 className={styles.sectionTitle}>Condiciones Comerciales</h3>
      <div className={styles.dataGrid}>
        <TextField
          label="CIIU:"
          name="CIIU"
          value="942000"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Alicuota:"
          name="Alicuota"
          value="ILT: 1 - Valor Fijo: $0 - Valor Variable: %2.1"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Alicuota:"
          name="Alicuota"
          value="Nivel: 2 - FFE: 928"
          fullWidth
          variant='standard'
        />
        
        <TextField
          label="Nº Solicitud:"
          name="Solicitud"
          value="265112"
          fullWidth
          variant='standard'
        />
        
        <TextField
          label="Codigo Operación:"
          name="Operacion"
          value="44"
          fullWidth
          variant='standard'
        />
        
        <TextField
          label="Codigo Motivo Sorteo:"
          name="Sorteo"
          value="0"
          fullWidth
          variant='standard'
        />
        
        <TextField
          label="Referencia ART:"
          name="Referencia"
          value="38.734.824,34"
          fullWidth
          variant='standard'
        />
        
        <TextField
          label="Cantidad de Trabajadores:"
          name="CantTrabajadores"
          value="1.345"
          fullWidth
          variant='standard'
        />

        <TextField
          label="Masa Salarial:"
          name="Masa"
          value="785.079.254,09"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Bonificación:"
          name="Bonificacion"
          value="No Aplica"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Clausula Penal"
          name="Clausula"
          value="1345"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Cantidad de Trabajadores:"
          name="CantTrabajadores"
          value="Por incumplimiento de denuncias del empleador, consistente en límite mínimo de la base imponible para el cálculo de los aportes y contribuciones al SIPA, establecidos en el art 9 de la ley 24241 y sus modif."
          fullWidth
          variant='standard'
        />
        <TextField
          label="Unico Establecimiento"
          name="Establecimiento"
          value="0"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Prestador Medico"
          name="Prestador"
          value="0"
          fullWidth
          variant='standard'
        />
        <TextField
          label="Clausula Penal"
          name="Clausula"
          value="1345"
          fullWidth
          variant='standard'
        />
      </div>
    </div>
  );
};

export default Poliza;