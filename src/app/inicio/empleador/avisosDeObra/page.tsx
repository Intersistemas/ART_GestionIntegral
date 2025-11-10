"use client"
// AvisosObraHandler.tsx
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios"; 
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, Grid,
    CircularProgress // Para mostrar el estado de carga
} from "@mui/material";
import { AddCircleOutline } from "@mui/icons-material";
import AvisosObraList from "./AvisosObraList";
import AvisoObraForm from "./AvisoObraForm";
import { createForm } from "./PDForm"; // Asumo que esto es para generar PDF
import { 
    AvisoObraRecord, 
    Request, 
    Response, 
    ApiQueryState, 
    ApiError, 
    FormDataState 
} from "./types";
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";
import CustomButton from "@/utils/ui/button/CustomButton";

const { useGetAvisoObra } = gestionEmpleadorAPI;

// ==========================================================
// 1. FUNCIÓN DE INICIALIZACIÓN DE REGISTRO
// ==========================================================

const getNewAvisoObraRecord = (): AvisoObraRecord => ({
    interno: null,
    obraNumero: null,
    obraSecuencia: null,
    empleadorCUIT: null,
    
    // Campos obligatorios inicializados
    obraTipo: "", // String vacío para seleccionar el tipo
    direccionCalleRuta: "",
    direccionNumero: "",
    direccionLocalidad: "",
    direccionDeptoPartido: "",
    direccionPciaCodigo: "", // Usamos string para estado inicial si es un campo de selección
    direccionCPA: "",

    recepcionFecha: null,
    
    superficie: "",
    plantas: "",

    actividadInicioFecha: null,
    actividadFinFecha: null,

    suspensionFecha: null,
    reinicioFecha: null,

    excavacionInicioFecha: null,
    excavacionFinFecha: null,

    demolicionInicioFecha: null,
    demolicionFinFecha: null,
    
    // Checkbox (Todos inician en 'N')
    ingCivCaminos: "N", ingCivCalles: "N", ingCivAutopistas: "N", ingCivPuentes: "N",
    ingCivTuneles: "N", ingCivObrFerroviarias: "N", ingCivObrHidraulicas: "N",
    ingCivAlcantarillas: "N", ingCivPuertos: "N", ingCivAeropuertos: "N", ingCivOtros: "N",

    monIndDestileria: "N", monIndGenElectrica: "N", monIndMineria: "N",
    monIndManufUrbana: "N", monIndOtros: "N",

    ductosTuberias: "N", ductosEstaciones: "N", ductosOtros: "N",

    redesTransElectAV: "N", redesTransElectBV: "N", redesComunicaciones: "N",
    redesOtros: "N",

    otrasConstExcavaciones: "N", otrasConstInstHidrGas: "N", otrasConstInstElectro: "N",
    otrasConstInstAireAcon: "N", otrasConstReparaciones: "N", otrasConstOtros: "N",

    arqViviendas: "N", arqEdifPisosMultiples: "N", arqUrbanizacion: "N",
    arqEdifComerciales: "N", arqEdifOficinas: "N", arqEscuelas: "N",
    arqHospitales: "N", arqOtros: "N",

    actExcavacion: "N", actDemolicion: "N", actAlbanileria: "N", actHA: "N",
    actMontajesElectro: "N", actInstalaciones: "N", actEstructMetalicas: "N",
    actElectricidad: "N", actAscensores: "N", actPintura: "N",
    actMayorMilSupCubierta: "N", actSilletas: "N", actMediosIzaje: "N",
    actAltaMediaTension: "N", actOtros: "", // Campo de texto libre

    operacionTipo: "A", // 'A'gregar
    confirmacionFecha: null,
}); 


const AvisosObraHandler: React.FC = () => {

    const { 
        data: avisoObraRawData, 
        isLoading: isDataLoading, 
        error: fetchError,
        mutate: refetchAvisos // Función de SWR para forzar la recarga
    } = useGetAvisoObra(); 

    // ESTADOS
    const [avisosObrasArray, setAvisosObrasArray] = useState<AvisoObraRecord[]>([]);
    const [formData, setFormData] = useState<FormDataState>({ request: null });
    const [dialogPDF, setDialogPDF] = useState<React.ReactNode | null>(null);
    const [dialogError, setDialogError] = useState<React.ReactNode | null>(null);

    // apiQuery solo se usa para disparar mutaciones (Insert/Change/Delete)
    const [apiQuery, setApiQuery] = useState<ApiQueryState>({
        action: "Fetch", // Valor inicial inofensivo
        timeStamp: new Date(),
    });

    // ==========================================================
    // 2. EFECTO DE SINCRONIZACIÓN DE DATOS (SWR -> ESTADO LOCAL)
    // ==========================================================
    useEffect(() => {
        // ✅ Protección clave: Usa Array.isArray()
        if (avisoObraRawData && Array.isArray(avisoObraRawData.data)) {
            setAvisosObrasArray(avisoObraRawData.data);
        }
        
        if (fetchError) {
             abrirError(fetchError);
        }
    }, [avisoObraRawData, fetchError]);

    // ----------------------------------------------------------
    // HANDLERS
    // ----------------------------------------------------------

    const handleFormOpen = (request: Request, record: AvisoObraRecord) => {
        let currentRecord: AvisoObraRecord = { ...record }; 
        
        switch (request) {
            case Request.Change:
                // Lógica de modificación (si ya está confirmado, debe ser una nueva inserción 'M')
                if (currentRecord.confirmacionFecha) {
                    request = Request.Insert;
                    currentRecord.operacionTipo = "M";
                    currentRecord.confirmacionFecha = null;
                }
                break;
            case Request.Delete:
                // Lógica de borrado (si ya está confirmado, debe ser una nueva inserción 'B')
                if (currentRecord.confirmacionFecha) {
                    request = Request.Insert;
                    currentRecord.operacionTipo = "B";
                    currentRecord.confirmacionFecha = null;
                }
                break;
            default:
                break;
        }
        // ✅ La interfaz FormDataState tipa esto correctamente
        setFormData({ request: request, data: currentRecord });
    };

    const abrirError = (error: ApiError | any) => {
        let title: string | undefined = error.title;
        let message: string | React.ReactNode | React.ReactNode[] = error.message;

        if (axios.isAxiosError(error)) { 
            title = "Error de Petición HTTP";
            message = error.response?.data?.message || error.message;
        }

        title ??= [error.code, error.type].filter((e: any) => e).join();
        
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

    const handleFormClose = (request: Request, response: Response, record: AvisoObraRecord) => {
        if (
            ![Request.Insert, Request.Change, Request.Delete].includes(request) ||
            response !== Response.Completed
        ) {
            setFormData({ request: null }); 
            return;
        }

        // Validación básica de campos obligatorios
        const error: ApiError = {
            title: "Formulario incompleto.",
            message: [],
        };
        
        if (record.obraTipo === "") {
            (error.message as React.ReactNode[]).push(<Grid>Debe especificar el tipo de aviso de obra.</Grid>);
        }
        // El campo direccionPciaCodigo puede ser string o number, verificamos si es inválido
        if (!record.direccionPciaCodigo || record.direccionPciaCodigo === "") {
            (error.message as React.ReactNode[]).push(<Grid>Debe especificar una provincia.</Grid>);
        }
        
        if ((error.message as React.ReactNode[]).length) {
            abrirError(error);
            return;
        }

        if (record.operacionTipo === "A")
            record.recepcionFecha = record.confirmacionFecha;
            
        setApiQuery({
            data: record,
            timeStamp: new Date(),
            action: request,
        });
    };

    // ==========================================================
    // 3. EFECTO DE MUTACIÓN (Insert/Change/Delete)
    // ==========================================================

    useEffect(() => {
        const cerrarFormulario = (recarga: boolean) => {
            if (recarga) {
                // Forzamos la revalidación de SWR para recargar la lista
                refetchAvisos(); 
            }
            setFormData({ request: null });
        };
        
        const abrirPDF = async (pdfData: any) => { 
            const handleClosePDF = () => setDialogPDF(null);
            const src: string = await createForm({ data: pdfData }); 
            
            setDialogPDF(
                <Dialog open fullScreen onClose={handleClosePDF}>
                    <DialogContent dividers style={{ display: "flex" }}>
                        <iframe style={{ flexGrow: 1 }} src={src} title="PDF Viewer" />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="success" onClick={handleClosePDF}>
                            Cierra
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        };
        
        // Evitamos acceder a .data si action es "Fetch" y aún no hay data
        if (apiQuery.action === "Fetch" || !apiQuery.data) return;

        const data = { ...apiQuery.data } as AvisoObraRecord; 

        switch (apiQuery.action) {
            case Request.Insert:
            case Request.Change:
            case Request.Delete:
                const method = apiQuery.action === Request.Insert ? "post" : apiQuery.action === Request.Change ? "put" : "delete";
                const urlSuffix = apiQuery.action === Request.Insert ? "AvisoObra" : `AvisoObra/${data.interno}`;
                
                
                axios.request({
                    method: method,
                    url: `http://arttest.intersistemas.ar:8670/api/${urlSuffix}`,
                    headers: {
                        "Content-Type": "application/json",
                        // IMPORTANTE: Aquí se debería inyectar el Authorization Bearer
                    },
                    data: data, 
                })
                .then(async (response) => {
                    // Si se confirmó la fecha, asumimos que debe imprimir
                    if (data.confirmacionFecha != null) await abrirPDF(response.data);
                    cerrarFormulario(true);
                })
                .catch(async (error: AxiosError | any) => {
                    abrirError(error);
                });
                break;

            default:
                break;
        }
    }, [apiQuery, refetchAvisos]); 

    // ----------------------------------------------------------
    // RENDERIZADO
    // ----------------------------------------------------------
    
    // Muestra spinner de carga
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
                <Grid container rowSpacing={2} columnSpacing={2}>
                    <Grid  style={{ marginBottom: '16px' }}>
                        {/* ✅ Botón de Agregar Registro */}
                        <CustomButton
                            variant="contained"
                            color="primary"
                            startIcon={<AddCircleOutline />}
                            onClick={() => handleFormOpen(Request.Insert, getNewAvisoObraRecord())}
                            disabled={isDataLoading} 
                        >
                            Agregar Aviso
                        </CustomButton>
                    </Grid>
                    <Grid >
                        <AvisosObraList
                            // En este punto, avisosObrasArray es un array (vacío o con datos)
                            data={avisosObrasArray} 
                            onInsert={(r) => handleFormOpen(Request.Insert, r)}
                            onChange={(r) => handleFormOpen(Request.Change, r)}
                            onDelete={(r) => handleFormOpen(Request.Delete, r)}
                            onView={(r) => handleFormOpen(Request.View, r)}
                        />
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
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default AvisosObraHandler;