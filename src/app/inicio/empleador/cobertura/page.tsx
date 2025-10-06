"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react'; 
import { useAuth } from '@/data/AuthContext'; 
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";
import Persona from './types/persona';
import DataTable from '@/utils/ui/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import styles from "./cobertura.module.css";
import CustomButton from '@/utils/ui/button/CustomButton';
import { BsBoxArrowInLeft, BsBoxArrowInRight } from "react-icons/bs";
import { Box, TextField } from '@mui/material';

const { useGetPersonal } = gestionEmpleadorAPI;

export default function CoberturaPage() {

    const { data: personalRawData, isLoading: isPersonalLoading } = useGetPersonal(); 
    
    // Estados para las dos tablas: Pendiente (Origen) y Cubierto (Destino)
    const [personalPendiente, setPersonalPendiente] = useState<Persona[]>([]);
    const [personalCubierto, setPersonalCubierto] = useState<Persona[]>([]);

    // Estados para las selecciones de filas en cada tabla
    const [selectedPendiente, setSelectedPendiente] = useState<Persona[]>([]);
    const [selectedCubierto, setSelectedCubierto] = useState<Persona[]>([]);
    
    // ESTADOS PARA LOS NUEVOS CAMPOS DE ENTRADA (newCuil es number | null)
    const [newCuil, setNewCuil] = useState<number | null>(null); 
    const [newNombre, setNewNombre] = useState<string>('');

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

    // Handlers para la selección (estabilizados con useCallback)
    const handleSelectionPendiente = useCallback((selectedRows: Persona[]) => {
        setSelectedPendiente(selectedRows);
    }, []); 

    const handleSelectionCubierto = useCallback((selectedRows: Persona[] | null) => {
        setSelectedCubierto(selectedRows || []);
    }, []); 

    // HANDLER PARA EL INPUT DE CUIL: Asegura que el estado sea number o null.
    const handleInputCuil = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        
        // Si el campo está vacío, establece null
        if (value === '') {
            setNewCuil(null);
            return;
        }

        // Si hay texto, valida que sean solo dígitos
        if (/^\d+$/.test(value)) {
            // Convierte a número y almacena en el estado
            setNewCuil(parseInt(value, 10));
        }
        // Si no son dígitos, simplemente ignora la entrada (no actualiza el estado)
    };

    // Función principal: Mover de PENDIENTE a CUBIERTO
    const handleCubrir = () => {
        if (selectedPendiente.length === 0) return;

        const selectedCuils = new Set(selectedPendiente.map(p => p.cuil));

        const newPendiente = personalPendiente.filter(p => !selectedCuils.has(p.cuil));
        const newCubierto = [...personalCubierto, ...selectedPendiente];

        setPersonalPendiente(newPendiente);
        setPersonalCubierto(newCubierto);
        
        setSelectedPendiente([]); 
    };

    // Función secundaria: Mover de CUBIERTO a PENDIENTE
    const handleLiberar = () => {
        if (selectedCubierto.length === 0) return;

        const selectedCuils = new Set(selectedCubierto.map(p => p.cuil));

        const newCubierto = personalCubierto.filter(p => !selectedCuils.has(p.cuil));
        const newPendiente = [...personalPendiente, ...selectedCubierto];

        setPersonalCubierto(newCubierto);
        setPersonalPendiente(newPendiente);
        setSelectedCubierto([]);
    };
    
    // FUNCIÓN PARA AGREGAR FILA A LA TABLA CUBIERTO
    const handleAddFila = () => {
        // Validar que newCuil no sea null (válido) y que newNombre no esté vacío
        if (newCuil === null || !newNombre.trim()) {
            alert("Por favor, ingrese CUIT/CUIL y Nombre válidos.");
            return;
        }

        // Verificar duplicados
        const isDuplicate = personalCubierto.some(p => p.cuil === newCuil) ||
                            personalPendiente.some(p => p.cuil === newCuil);
        
        if (isDuplicate) {
            alert(`El CUIT/CUIL ${newCuil} ya existe en las listas.`);
            return;
        }

        // Crear el nuevo objeto Persona usando newCuil (que ya es number)
        const newPerson: Persona = {
            cuil: newCuil, 
            nombreEmpleador: newNombre.trim(),
            // Se asume que otras propiedades opcionales quedan sin definir
        };

        // Añadir a la lista de cubiertos
        setPersonalCubierto(prev => [...prev, newPerson]);

        // Limpiar campos de entrada
        setNewCuil(null);
        setNewNombre('');
    };

    const isAddButtonDisabled = newCuil === null || newNombre.trim() === '';

    return ( 
        <div className={styles.inicioContainer}>
            <div className={styles.header}>
                <h1 className={styles.mainTitle}>Gestión de Cobertura de Personal</h1>
            </div>

            <div className={styles.dualTableContainer}>
                
                {/* -------------------- TABLA DE PERSONAL PENDIENTE -------------------- */}
                <div className={styles.tablePanel}>
                    <h2 className={styles.tableTitle}>Personal Pendiente ({personalPendiente.length})</h2>
                    <DataTable
                        data={personalPendiente} 
                        columns={columns} 
                        size="mid"
                        isLoading={isPersonalLoading}
                        enableRowSelection={true}
                        onRowSelectionChange={handleSelectionPendiente}
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
                    <BsBoxArrowInLeft style={{fontSize: "2.5rem"}} />QUITAR
                    </CustomButton>
                </div>

                {/* -------------------- TABLA DE PERSONAL CUBIERTO -------------------- */}
                <div className={styles.tablePanel}>
                    <h2 className={styles.tableTitle}>Personal Cubierto ({personalCubierto.length})</h2>
                    <DataTable
                        data={personalCubierto} 
                        columns={columns} 
                        size="mid"
                        isLoading={isPersonalLoading}
                        enableRowSelection={true}
                        onRowSelectionChange={handleSelectionCubierto}
                        key={`cubierto-${personalCubierto.length}`}
                    />

                    {/* NUEVOS CAMPOS DE ENTRADA Y BOTÓN */}
                    <Box className={styles.tableContainer}>
                        <TextField
                            label="CUIL"
                            type="text"
                            placeholder="CUIT/CUIL"
                            // Muestra el número o cadena vacía si es null
                            value={newCuil === null ? '' : newCuil.toString()} 
                            onChange={handleInputCuil} 
                            className={styles.inputField}                  
                        />
                        <TextField
                            label="Nombre"
                            type="text"
                            placeholder="Nombre Trabajador"
                            value={newNombre}
                            onChange={(e) => setNewNombre(e.target.value)}
                            className={styles.inputField}
                        />
                        <CustomButton 
                            onClick={handleAddFila}
                            disabled={isAddButtonDisabled}
                            title="Agregar Trabajador Cubierto"
                        >
                            AGREGAR
                        </CustomButton>
                    </Box>

                    <p className={styles.leyendaLegal}>
                        <strong>Sr. empleador, le recordamos que cualquier modificación a la nómina presentada es considerada una DDJJ.</strong><br/>
                        Los datos se recolectan únicamente para ser utilizados con motivo de la relación comercial que lo vincula con la compañía (art. 6° ley 25.326).
                    </p>
                </div>
            </div>
            
            <div className={styles.detalles}>
                <h3>Detalle de Selecciones</h3>
                <p>Seleccionados en Pendiente: {selectedPendiente.length}</p>
                <p>Seleccionados en Cubierto: {selectedCubierto.length}</p>
            </div>
        </div>
    );
}