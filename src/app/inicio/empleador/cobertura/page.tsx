"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'; 
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";
import Persona from './types/persona';
import DataTable from '@/utils/ui/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import styles from "./cobertura.module.css";
import CustomButton from '@/utils/ui/button/CustomButton';
import { BsBoxArrowInLeft, BsBoxArrowInRight, BsDownload } from "react-icons/bs";
import { Box, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import Formato from '@/utils/Formato';
import Cobertura_PDF from './Cobertura_PDF';

const { useGetPersonal, useGetPoliza } = gestionEmpleadorAPI;

export default function CoberturaPage() {
   
    const { data: personalRawData, isLoading: isPersonalLoading } = useGetPersonal(); 
    const { data: polizaData, isLoading: isPolizaLoading } = useGetPoliza(); 
    
    // Estados para las dos tablas: Pendiente (Origen) y Cubierto (Destino)
    const [personalPendiente, setPersonalPendiente] = useState<Persona[]>([]);
    const [personalCubierto, setPersonalCubierto] = useState<Persona[]>([]);
    const inputReference = useRef<HTMLInputElement | null>(null);

    const [presentadoA, setPresentadoA] = useState<string>('');
    const [abrirPDF, setAbrirPDF] = useState<boolean>(false);
    const [clausula, setClausula] = useState<boolean>(false);


    // Fecha y hora actuales (formato local es-AR)
    const now = new Date();
    const dia = now.toLocaleDateString('es-AR'); // ej. "07/11/2025"
    const hora = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }); // ej. "14:35"

    // Estados para las selecciones de filas en cada tabla
    const [selectedPendiente, setSelectedPendiente] = useState<Persona[]>([]);
    const [selectedCubierto, setSelectedCubierto] = useState<Persona[]>([]);
    
    // ESTADOS PARA LOS NUEVOS CAMPOS DE ENTRADA (newCuil es number | null)
    const [newCuil, setNewCuil] = useState<number | null>(null); 
    const [newNombre, setNewNombre] = useState<string>('');

    const handleDownload = () => {
        // Si no hay destinatario, poner foco en el campo "Para ser presentado a"
        if (!presentadoA?.trim()) {
            inputReference.current?.focus();
            return;
        }
        // continuar con la descarga / abrir PDF
        setAbrirPDF(true);
    };

    console.log("polizaData",polizaData)
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
            cell: (info: any) => Formato.CUIP(info.getValue())
            
        },
        {
            header: 'Nombre',
            accessorKey: 'nombreEmpleador',
        },
    ], []);


    const handleSelectionPendiente = useCallback((selectedRows: Persona[]) => {
        setSelectedPendiente(selectedRows);
    }, []); 

    const handleSelectionCubierto = useCallback((selectedRows: Persona[] | null) => {
        setSelectedCubierto(selectedRows || []);
    }, []); 


    const handleInputCuil = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
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
        if (newCuil === null || !newNombre.trim()) {
            alert("Por favor, ingrese CUIT/CUIL y Nombre válidos.");
            return;
        }

        // Verificar duplicados
        const isDuplicate = personalCubierto.some(p => p.cuil === newCuil) || personalPendiente.some(p => p.cuil === newCuil);
        
        if (isDuplicate) {
            alert(`El CUIT/CUIL ${newCuil} ya existe en las listas.`);
            return;
        }

        // Crear el nuevo objeto Persona usando newCuil (que ya es number)
        const newPerson: Persona = {
            cuil: newCuil, 
            nombreEmpleador: newNombre.trim(),
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
                    <div className={styles.detalles}>
                        <h2 className={styles.tableTitle}>Personal Pendiente ({personalPendiente.length})</h2>
                        <p>Seleccionados: {selectedPendiente.length}</p>
                    </div>
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
                    <div className={styles.detalles}>
                        <h2 className={styles.tableTitle}>Personal Cubierto ({personalCubierto.length})</h2>
                        <p>Seleccionados: {selectedCubierto.length}</p> 
                    </div>
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
                    <Box className={styles.inputSection}> {/* Usamos Box y el style de la sección de inputs */}
                        <TextField
                            label="CUIL"
                            type="text"
                            placeholder="CUIL"
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
                            icon={<BsBoxArrowInLeft/>}
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
            </div>
            
            {/* -------------------- SECCIÓN DE CERTIFICADO DE COBERTURA -------------------- */}
            
            <div className={styles.downloadButtonContainer}>
                <CustomButton 
                    onClick={handleDownload}
                    variant="contained"
                    color="primary"
                    icon={<BsDownload />}
                    size="large"
                >
                    DESCARGAR CERTIFICADO DE COBERTURA
                </CustomButton>
            </div>
            <div className={styles.certificadoContainer}>
                {/* Contenido del Certificado */}
                <div className={styles.lugarFecha}>
                    Ciudad Autónoma de Buenos Aires, {dia ?? ''}
                </div>
                <div className={styles.certificadoContent}>
                    
                    <h2 className={styles.certificadoTitle}>CERTIFICADO DE COBERTURA</h2>
                    
                    <Image
                        src="/icons/Logo.svg"
                        alt="Logo ART Mutual Rural"
                        width={500}
                        height={500}
                        className={styles.logoWrapper}
                        priority
                    />
                   
                    <div className={styles.certificadoText}>
                        <div className={styles.presentadoA}>
                            <label>
                                Para ser presentado a:
                            </label>
                            <TextField
                                variant="standard"
                                placeholder="Ingrese destinatario"
                                inputRef={inputReference}
                                value={presentadoA}
                                onChange={(e) => setPresentadoA(e.target.value)}
                                className={styles.inputDestinatario}
                            />
                        </div>
                    </div>
                <br/>    

                    <text>
                        Por intermedio del presente <strong>CERTIFICAMOS</strong> que la empresa bajo la denominación de {polizaData?.empleador_Denominacion || ""}
                         con N° de CUIT: {Formato.CUIP(polizaData?.cuit) || ""} ha contratado la cobertura de <strong>ART MUTUAL RURAL DE SEGUROS DE RIESGOS DEL TRABAJO</strong>,
                          según los términos de la Ley Nro. 24.557 por lo que el personal declarado oportunamente por el/la mencionado/a se encuentra cubierto a partir
                           del {polizaData?.vigencia_Desde || ""} hasta el {polizaData?.vigencia_Hasta || ""}.
                    </text>
                    <br/>
                    <text>
                        El N° del contrato es el {polizaData?.nroContrato || ""}.
                    </text>
                     <br/>

                     <div className={styles.clausulaToggle}>
                        <Checkbox size="large" checked={clausula} onChange={(e) => setClausula(e.target.checked)} />
                        Incluir cláusula de no repetición
                    </div>
                    {clausula && 
                    <>
                        <text>
                            Consta por la presente que <strong>ART MUTUAL RURAL DE SEGUROS DE RIESGOS DEL TRABAJO</strong>, renuncia en forma expresa a reclamar o iniciar toda acción de 
                            repetición o de regreso contra: A quien corresponda, sus funcionarios, empleados u obreros; sea con fundamento en el art. 39, ap. 5, de la Ley 
                            N° 24.557, sea en cualquier otra norma jurídica, con motivo de las prestaciones en especie o dinerarias que se vea obligada a abonar, contratar
                            u otorgar al personal dependiente o ex dependiente de {polizaData?.empleador_Denominacion || ""}, amparados por la cobertura del Contrato de
                            Afiliación N° {polizaData?.nroContrato || ""}, por accidentes del trabajo o enfermedades profesionales, ocurridos o contraídos por el hecho 
                            o en ocasión del trabajo. Esta <strong>Cláusula de no repetición</strong> cesará en sus efectos si el empresario comitente a favor de quien 
                            se emite, no cumple estrictamente con las medidas de prevención e higiene y seguridad en el trabajo, o de cualquier manera infringe la Ley 
                            N° 19.587, su Decreto Reglamentario N° 351/79 y las normativas que sobre el particular ha dictado la Superintendencia de Riesgos del Trabajo,
                            las Provincias y la Ciudad Autónoma de la Ciudad de Buenos Aires en el ámbito de su competencia.
                        </text>
                        <br/>
                        <text>
                            Fuera de las causales que expresamente prevé la normativa vigente, el contrato de afiliación no podrá ser modificado o enmendado sin previa
                            notificación fehaciente a quien corresponda, en un plazo no inferior a quince (15) días corridos.
                        </text>
                        <br/>
                        <text>
                            Se deja constancia por la presente que la empresa de referencia se encuentra asegurada en <strong>ART MUTUAL RURAL DE SEGUROS DE RIESGOS DEL TRABAJO</strong>.
                            El presente certificado tiene una validez de 30 días corridos a partir de la fecha de emisión. En ningún caso ART MUTUAL RURAL DE SEGUROS DE RIESGOS
                            DEL TRABAJO será responsable de las consecuencias del uso del certificado una vez vencido el plazo de validez.
                        </text>
                    </>
                    }
                    
                     <br/>
                    <text>
                        Sin otro particular, saludo a Ud. muy atentamente.
                    </text>
                     <br/>
                    <div className={styles.signatureSection}>
                        <div className={styles.signatureLine}>
                             <Image
                                src="/images/FirmaFernanda.png" 
                                alt="Firma de Fernanda Lassalle"
                                width={170}
                                height={200}
                                priority
                            />
                        </div>
                        <p className={styles.signatureText}>
                            Cdra. Ma. Fernanda Lassalle<br/>
                            Gerente de Administración
                        </p>
                    </div>
                </div>
            </div>
            <div>
                {abrirPDF && presentadoA != "" ? (
               <Cobertura_PDF
                    open={abrirPDF}
                    handleVentanaImpresion={(open: boolean) => setAbrirPDF(open)}
                    presentadoA={presentadoA}
                    poliza={polizaData}                     // pasa tu objeto poliza
                    dia={dia}                           // opcional
                    hora={hora}                         // opcional
                    fechaDesde={polizaData?.vigencia_Desde}             // opcional
                    fechaHasta={polizaData?.vigencia_Desde}             // opcional
                    clausula={clausula}       // opcional
                    nominasSeleccionadas={selectedCubierto} // si aplicable
                />
                ) : null}
          </div>
        </div>
    );
}