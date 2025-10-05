"use client";

import React, { useState, useEffect, useMemo } from 'react';
// Asumiendo que estas importaciones son manejadas por el entorno de ejecución
import { useAuth } from '@/data/AuthContext'; 
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";
import Persona from './types/persona';
import DataTable from '@/utils/ui/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import styles from "./cobertura.module.css";
import CustomButton from '@/utils/ui/button/CustomButton';
import { BsBoxArrowInLeft, BsBoxArrowInRight , BsBoxArrowLeft } from "react-icons/bs";


const { useGetPersonal } = gestionEmpleadorAPI;

export default function CoberturaPage() {
    
    // Obtención de datos simulada
    const { data: personalRawData, isLoading: isPersonalLoading } = useGetPersonal(); 
    // const { user, status } = useAuth(); // Asumiendo que useAuth funciona correctamente
    
    // Estados para las dos tablas: Pendiente (Origen) y Cubierto (Destino)
    const [personalPendiente, setPersonalPendiente] = useState<Persona[]>([]);
    const [personalCubierto, setPersonalCubierto] = useState<Persona[]>([]);

    // Estados para las selecciones de filas en cada tabla
    const [selectedPendiente, setSelectedPendiente] = useState<Persona[]>([]);
    const [selectedCubierto, setSelectedCubierto] = useState<Persona[]>([]);

    // Inicializa personalPendiente con los datos crudos cuando se cargan
    useEffect(() => {
        if (personalRawData && personalRawData.length > 0) {
            setPersonalPendiente(personalRawData);
        }
    }, [personalRawData]);

    const columns: ColumnDef<Persona>[] = useMemo(() => [
        {
            header: 'CUIL',
            accessorKey: 'cuil',
        },
        {
            header: 'Nombre',
            accessorKey: 'nombreEmpleador',
        },
    ], []);

    // Handlers para la selección en cada tabla
    const handleSelectionPendiente = (selectedRows: Persona[]) => {
        setSelectedPendiente(selectedRows);
    };

    const handleSelectionCubierto = (selectedRows: Persona[] | null) => {
        // En la lógica de DataTable anterior, se pasa un array de filas seleccionadas.
        setSelectedCubierto(selectedRows || []);
    };

    // Función principal: Mover de PENDIENTE a CUBIERTO
    const handleCubrir = () => {
        if (selectedPendiente.length === 0) return;

        const selectedCuils = new Set(selectedPendiente.map(p => p.cuil));

        // 1. Eliminar los seleccionados de Pendiente
        const newPendiente = personalPendiente.filter(p => !selectedCuils.has(p.cuil));

        // 2. Añadir los seleccionados a Cubierto
        const newCubierto = [...personalCubierto, ...selectedPendiente];

        // 3. Actualizar estados
        setPersonalPendiente(newPendiente);
        setPersonalCubierto(newCubierto);
        
        // 4. Limpiar selección
        setSelectedPendiente([]);
    };

    // Función secundaria: Mover de CUBIERTO a PENDIENTE
    const handleLiberar = () => {
        if (selectedCubierto.length === 0) return;

        const selectedCuils = new Set(selectedCubierto.map(p => p.cuil));

        // 1. Eliminar los seleccionados de Cubierto
        const newCubierto = personalCubierto.filter(p => !selectedCuils.has(p.cuil));

        // 2. Añadir los seleccionados a Pendiente
        const newPendiente = [...personalPendiente, ...selectedCubierto];

        // 3. Actualizar estados
        setPersonalCubierto(newCubierto);
        setPersonalPendiente(newPendiente);
        
        // 4. Limpiar selección
        setSelectedCubierto([]);
    };

    return ( 
        <div className={styles.inicioContainer}>
            <div className={styles.header}>
                <h1 className={styles.mainTitle}>Gestión de Cobertura de Personal</h1>
            </div>

            <div className={styles.dualTableContainer}>
                
                {/* -------------------- TABLA DE PERSONAL PENDIENTE -------------------- */}
                <div className={styles.tablePanel}>
                    <h2>Personal Pendiente ({personalPendiente.length})</h2>
                    <DataTable
                        data={personalPendiente} 
                        columns={columns} 
                        size="mid"
                        isLoading={isPersonalLoading}
                        enableRowSelection={true}
                        onRowSelectionChange={handleSelectionPendiente}
                        // Usamos una clave para forzar la re-inicialización del estado de selección
                        // de la tabla si es necesario (aunque el cambio de 'data' debería bastar)
                        key={`pendiente-${personalPendiente.length}`}
                    />
                </div>

                {/* -------------------- PANEL DE BOTONES DE TRANSFERENCIA -------------------- */}
                <div className={styles.controlsPanel}>
                    <CustomButton 
                        className={`${styles.controlButton} ${styles.cubrirButton}`}
                        onClick={handleCubrir}
                        disabled={selectedPendiente.length === 0}
                        title="Mover personal seleccionado a 'Cubierto'"
                    >
                        CUBRIR <BsBoxArrowInRight style={{fontSize: "2.5rem"}}/>
                    </CustomButton>
                    <CustomButton 
                        onClick={handleLiberar}
                        disabled={selectedCubierto.length === 0}
                        title="Mover personal seleccionado de vuelta a 'Pendiente'"
                    >
                    <BsBoxArrowInLeft style={{fontSize: "2.5rem"}} />LIBERAR
                    </CustomButton>
                </div>

                {/* -------------------- TABLA DE PERSONAL CUBIERTO -------------------- */}
                <div className={styles.tablePanel}>
                    <h2>Personal Cubierto ({personalCubierto.length})</h2>
                    <DataTable
                        data={personalCubierto} 
                        columns={columns} 
                        size="mid"
                        isLoading={isPersonalLoading}
                        enableRowSelection={true}
                        onRowSelectionChange={handleSelectionCubierto}
                        key={`cubierto-${personalCubierto.length}`}
                    />
                </div>
            </div>
            
            <div style={{marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px'}}>
                <h3>Detalle de Selecciones</h3>
                <p>Seleccionados en Pendiente: {selectedPendiente.length}</p>
                <p>Seleccionados en Cubierto: {selectedCubierto.length}</p>
            </div>
        </div>
    );
}
