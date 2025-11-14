// srrc/app/inicio/empleador/avisosDeObra/types/types.ts

// ==========================================================
// ENUMS DE OPERACIÓN
// ==========================================================

export enum Request {
    Insert = "Insert",
    Change = "Change",
    Delete = "Delete",
    View = "View",
}
export enum Response {
    Completed = "Completed",
    Cancelled = "Cancelled",
}

// ==========================================================
// INTERFACES DE DATOS MAESTROS Y REGISTRO PRINCIPAL
// ==========================================================

export interface AvisoTipo { Codigo: string; Descripcion: string; }
export interface Provincia { Codigo: number; Descripcion: string; }

// 1. Interfaz para el Registro de Aviso de Obra
export interface AvisoObraRecord {
    // Claves y campos de identificación
    interno: number | null;
    obraNumero: number | null;
    obraSecuencia: number | null;
    empleadorCUIT: number | null; 
    empleadorRazonSocial: string | null;

    // Campos del formulario
    obraTipo: string;
    superficie: number | null;
    plantas: number | null;

    // Dirección
    direccionCalleRuta: string;
    direccionNumero: string;
    direccionLocalidad: string;
    direccionDeptoPartido: string;
    direccionPciaCodigo: number | string; // Permite string para el estado inicial vacío
    direccionCPA: string;
    recepcionFecha: string | null; // Fechas pueden ser string (ISO) o null

    // Fechas de Actividad
    actividadInicioFecha: string | null;
    actividadFinFecha: string | null;
    suspensionFecha: string | null;
    reinicioFecha: string | null;
    excavacionInicioFecha: string | null;
    excavacionFinFecha: string | null;
    demolicionInicioFecha: string | null;
    demolicionFinFecha: string | null;

    // Campos Checkbox (string 'S' o 'N') - Se listan juntos para claridad
    // Ingeniería Civil
    ingCivCaminos: "S" | "N"; ingCivCalles: "S" | "N"; ingCivAutopistas: "S" | "N"; ingCivPuentes: "S" | "N";
    ingCivTuneles: "S" | "N"; ingCivObrFerroviarias: "S" | "N"; ingCivObrHidraulicas: "S" | "N";
    ingCivAlcantarillas: "S" | "N"; ingCivPuertos: "S" | "N"; ingCivAeropuertos: "S" | "N"; ingCivOtros: "S" | "N";
    // Montajes Industriales
    monIndDestileria: "S" | "N"; monIndGenElectrica: "S" | "N"; monIndMineria: "S" | "N";
    monIndManufUrbana: "S" | "N"; monIndOtros: "S" | "N";
    // Ductos
    ductosTuberias: "S" | "N"; ductosEstaciones: "S" | "N"; ductosOtros: "S" | "N";
    // Redes
    redesTransElectAV: "S" | "N"; redesTransElectBV: "S" | "N"; redesComunicaciones: "S" | "N";
    redesOtros: "S" | "N";
    // Otras Construcciones
    otrasConstExcavaciones: "S" | "N"; otrasConstInstHidrGas: "S" | "N"; otrasConstInstElectro: "S" | "N";
    otrasConstInstAireAcon: "S" | "N"; otrasConstReparaciones: "S" | "N"; otrasConstOtros: "S" | "N";
    // Arquitectura
    arqViviendas: "S" | "N"; arqEdifPisosMultiples: "S" | "N"; arqUrbanizacion: "S" | "N";
    arqEdifComerciales: "S" | "N"; arqEdifOficinas: "S" | "N"; arqEscuelas: "S" | "N";
    arqHospitales: "S" | "N"; arqOtros: "S" | "N";
    // Actividades
    actExcavacion: "S" | "N"; actDemolicion: "S" | "N"; actAlbanileria: "S" | "N"; actHA: "S" | "N";
    actMontajesElectro: "S" | "N"; actInstalaciones: "S" | "N"; actEstructMetalicas: "S" | "N";
    actElectricidad: "S" | "N"; actAscensores: "S" | "N"; actPintura: "S" | "N";
    actMayorMilSupCubierta: "S" | "N"; actSilletas: "S" | "N"; actMediosIzaje: "S" | "N";
    actAltaMediaTension: "S" | "N"; 
    actOtros: string; // Campo de texto libre para actividades

    // Control de Operación
    operacionTipo: "A" | "M" | "B"; // 'A'gregar, 'M'odificar, 'B'orrar
    confirmacionFecha: string | null;

    [key: string]: any; // Permite el acceso dinámico (data[name])
}

// ==========================================================
// INTERFACES DE ESTADO Y ERROR
// ==========================================================

// Define la estructura del error
export interface ApiError {
    code?: string;
    type?: string;
    title?: string;
    message: string | React.ReactNode | React.ReactNode[];
}

// Define la estructura del estado de la petición (para disparar mutaciones)
export interface ApiQueryState {
    action: "Fetch" | Request;
    timeStamp: Date;
    data?: AvisoObraRecord;
}

// Interfaces para el estado del formulario modal
interface FormClosedState {
    request: null;
    data?: never;
}
interface FormOpenState {
    request: Request;
    data: AvisoObraRecord;
}
export type FormDataState = FormClosedState | FormOpenState;

// ==========================================================
// INTERFACE DE DATOS PARA PDF (si es necesario un mapeo)
// ==========================================================

export interface PdfFormData {
    // Mapeo más detallado (si es necesario) o simplemente usar Partial<AvisoObraRecord>
    obraTipo: string; 
    [key: string]: any; // Índice de firma para permitir el acceso dinámico
}