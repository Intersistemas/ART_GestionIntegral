// src/app/inicio/empleador/avisosDeObra/page.tsx
"use client"
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios"; 
import {Button,Card,CardContent,Dialog,DialogActions, DialogContent,DialogTitle, Grid,CircularProgress } from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
// Importaciones de módulos y tipos locales
import AvisosObraList from "./AvisosObraList";
import AvisoObraForm from "./AvisoObraForm";
import {AvisoObraRecord,Request,Response,ApiQueryState,ApiError,FormDataState } from "./types/types";
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";
import CustomButton from "@/utils/ui/button/CustomButton";
import { useAuth } from "@/data/AuthContext";
const { useGetAvisoObra } = gestionEmpleadorAPI;
import { getDefaultAvisoObra } from "./data/defaultAvisoObra";
import AvisosObraPdfGenerator from "./AvisoObraPdfGenerator";

const AvisosObraHandler: React.FC = () => {
    // Obtención de datos con SWR
    const { 
        data: avisoObraRawData, 
        isLoading: isDataLoading, 
        error: fetchError,
        mutate: refetchAvisos // Función de SWR para forzar la recarga
    } = useGetAvisoObra(); 

    const { user } = useAuth(); 
    const empresaCUIT = user?.empresaCUIT;
    const empresaRazonSocial = user?.empresaRazonSocial;
    const [avisosObrasArray, setAvisosObrasArray] = useState<AvisoObraRecord[]>([]);
    const [formData, setFormData] = useState<FormDataState>({ request: null });
    const [dialogPDF, setDialogPDF] = useState<React.ReactNode | null>(null);
    const [dialogError, setDialogError] = useState<React.ReactNode | null>(null);

    // apiQuery solo se usa para disparar mutaciones (Insert/Change/Delete)
    const [apiQuery, setApiQuery] = useState<ApiQueryState>({
        action: "Fetch", 
        timeStamp: new Date(),
    });
    // Sincronización de datos (SWR -> ESTADO LOCAL)
    useEffect(() => {
        if (avisoObraRawData && Array.isArray(avisoObraRawData.data)) {
            setAvisosObrasArray(avisoObraRawData.data);
        }
        
        if (fetchError) {
            abrirError(fetchError);
        }
    }, [avisoObraRawData, fetchError]);

    // Efecto de MUTACIÓN (Insert/Change/Delete)
    useEffect(() => {
        const cerrarFormulario = (recarga: boolean) => {
            if (recarga) {
                refetchAvisos(); 
            }
            setFormData({ request: null });
        };
        
        // Evitamos ejecutar si es "Fetch" o no hay data
        if (apiQuery.action === "Fetch" || !apiQuery.data) return;

        const data = { ...apiQuery.data } as AvisoObraRecord; 
        const { action } = apiQuery;

        if ([Request.Insert, Request.Change, Request.Delete].includes(action as Request)) {
            const isInsert = action === Request.Insert;
            const method = isInsert ? "post" : action === Request.Change ? "put" : "delete";
            const urlSuffix = isInsert ? "AvisoObra" : `AvisoObra/${data.interno}`;
            
            // Preparar payload: NO enviar 'interno' en INSERT
            const payload: Partial<AvisoObraRecord> = { ...data };
            if (isInsert) {
                 // El casting a any permite eliminar la propiedad opcional
                delete (payload as any).interno;
            }
            // Lógica de Petición HTTP
            axios.request({
                method: method,
                url: `http://arttest.intersistemas.ar:8670/api/${urlSuffix}`,
                headers: {
                    "Content-Type": "application/json",
                    // Aquí va el Authorization Bearer si fuera necesario
                },
                data: action === Request.Delete ? undefined : payload,
            })
            .then(async (response) => {
                // Si hay confirmación (la fecha no es null), abrimos el PDF
                if (data.confirmacionFecha != null) await abrirPDFAvisoDeObra(response.data);
                cerrarFormulario(true);
            })
            .catch(async (error: AxiosError | any) => {
                abrirError(error);
            });
        }
        
    }, [apiQuery, refetchAvisos]); // Dependencias: apiQuery y la función de recarga de SWR


    // 4. HANDLERS (EVENTOS)
    const abrirError = (error: ApiError | any) => {
        let title: string | undefined = error.title;
        let message: string | React.ReactNode | React.ReactNode[] = error.message;

        if (axios.isAxiosError(error)) { 
            title = "Error de Petición HTTP";
            message = error.response?.data?.message || error.message || "Error desconocido en la API.";
        }

        title ??= [error.code, error.type].filter((e: any) => e).join();
        title = title || "Error Desconocido";
        
        const handleCloseError = () => setDialogError(null);
        
        setDialogError(
            <Dialog open onClose={handleCloseError}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent dividers style={{ display: "flex" }}>
                    <Grid>{message}</Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleCloseError}>
                        Cierra
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    const abrirPDFAvisoDeObra = (record: AvisoObraRecord) => {
        setDialogPDF(
            <Dialog open  maxWidth={"md"} onClose={() => setDialogPDF(null)}>
                <DialogContent dividers style={{ display: "flex" }}>    
                    <AvisosObraPdfGenerator data={record} />
                </DialogContent>
                <DialogActions >
                    <CustomButton onClick={() => setDialogPDF(null)}>Cerrar</CustomButton>
                </DialogActions>
            </Dialog>
        );
    };

    /* Abre el formulario modal con la data del registro.*/
    const handleFormOpen = (request: Request, record: AvisoObraRecord) => {
        let currentRecord: AvisoObraRecord = { ...record }; 
        
        switch (request) {
            case Request.Change:
                if (currentRecord.confirmacionFecha) {
                    request = Request.Insert;
                    currentRecord.operacionTipo = "M"; // Modificación post-confirmación
                    currentRecord.confirmacionFecha = null;
                }
                break;
            case Request.Delete:
                if (currentRecord.confirmacionFecha) {
                    request = Request.Insert;
                    currentRecord.operacionTipo = "B"; // Baja post-confirmación
                    currentRecord.confirmacionFecha = null;
                }
                break;
            default:
                break;
        }

        // Rellenar datos estáticos del empleador (si no existen)
        currentRecord.empleadorCUIT = empresaCUIT ?? currentRecord.empleadorCUIT ?? null;
        currentRecord.empleadorRazonSocial = empresaRazonSocial ?? currentRecord.empleadorRazonSocial ?? null;
        
        setFormData({ request: request, data: currentRecord });
    };

    /* Cierra el formulario modal y dispara la mutación si la respuesta es Completed.*/
    const handleFormClose = (request: Request, response: Response, record: AvisoObraRecord) => {
        // 1. Cancelado o respuesta no relevante para mutación
        if (
            ![Request.Insert, Request.Change, Request.Delete].includes(request) ||
            response !== Response.Completed
        ) {
            setFormData({ request: null }); 
            return;
        }

        // 2. Validación de campos obligatorios
        const validationError: ApiError = {
            title: "Formulario incompleto.",
            message: [],
        };
        
        if (record.obraTipo === "") {
            (validationError.message as React.ReactNode[]).push(<Grid key="tipo">Debe especificar el tipo de aviso de obra.</Grid>);
        }
        if (!record.direccionPciaCodigo || record.direccionPciaCodigo === "") {
            (validationError.message as React.ReactNode[]).push(<Grid key="provincia">Debe especificar una provincia.</Grid>);
        }
        
        if ((validationError.message as React.ReactNode[]).length) {
            abrirError(validationError);
            return;
        }

        // 3. Pre-procesamiento de datos antes de la mutación
        if (record.operacionTipo === "A")
            record.recepcionFecha = record.confirmacionFecha;
            
        // 4. Disparar el efecto de mutación
        setApiQuery({
            data: record,
            timeStamp: new Date(),
            action: request,
        });

        // Opcional: Cerrar inmediatamente el formulario para evitar doble envío
        setFormData({ request: null });
    };
    
    // 5. RENDERIZADO PRINCIPAL
    
    // Muestra spinner de carga (solo si es la carga inicial)
    if (isDataLoading && avisosObrasArray.length === 0) {
        return (
            <Card variant="outlined">
                <CardContent style={{ textAlign: 'center', padding: '50px' }}>
                    <CircularProgress />
                    <p>Cargando avisos de obra...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card variant="outlined">
            <CardContent>
                <Grid container direction="column" rowSpacing={2}>
                    <Grid  style={{ marginBottom: '16px' }}>
                        <CustomButton
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutline />}
                            onClick={() => handleFormOpen(Request.Insert, getDefaultAvisoObra())}
                            disabled={isDataLoading} 
                        >
                            Agregar Aviso
                        </CustomButton>
                    </Grid>
                    <Grid >
                        <AvisosObraList
                            data={avisosObrasArray} 
                            onInsert={() => handleFormOpen(Request.Insert, getDefaultAvisoObra())}
                            onChange={(r) => handleFormOpen(Request.Change, r)}
                            onDelete={(r) => handleFormOpen(Request.Delete, r)}
                            onView={(r) => handleFormOpen(Request.View, r)}
                            onPdf={(record) => abrirPDFAvisoDeObra(record)}
                        />
                    </Grid>
                </Grid>
                {/* Modales (Formulario, PDF y Error) */}
                {formData.request && formData.data && (
                    <AvisoObraForm
                        request={formData.request} 
                        data={formData.data} 
                        onClose={handleFormClose}
                        open={true} 
                    />
                )}
                {dialogPDF}
                {dialogError}
            </CardContent>
        </Card>
    );
};

export default AvisosObraHandler;