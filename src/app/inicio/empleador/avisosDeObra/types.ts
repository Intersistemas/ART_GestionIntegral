// 1. Interfaz para los datos del formulario (refleja todos los campos de initData)
export interface AvisoObraRecord {
    interno?: number | null;
    obraNumero?: number | null;
    obraSecuencia?: number | null;
    empleadorCUIT?: number | null; 
    empleadorRazonSocial?: string | null;
    
    obraTipo: string;

    direccionCalleRuta: string;
    direccionNumero: string;
    direccionLocalidad: string;
    direccionDeptoPartido: string;
    direccionPciaCodigo: number | string; // Permitimos string para el estado inicial vacío
    direccionCPA: string;

    recepcionFecha: string | null; // Fechas pueden ser string (ISO) o null
    
    superficie: number | string | null;
    plantas: number | string | null;

    actividadInicioFecha: string | null;
    actividadFinFecha: string | null;

    suspensionFecha: string | null;
    reinicioFecha: string | null;

    excavacionInicioFecha: string | null;
    excavacionFinFecha: string | null;

    demolicionInicioFecha: string | null;
    demolicionFinFecha: string | null;

    // Campos Checkbox (string 'S' o 'N')
    ingCivCaminos: "S" | "N";
    ingCivCalles: "S" | "N";
    ingCivAutopistas: "S" | "N";
    ingCivPuentes: "S" | "N";
    ingCivTuneles: "S" | "N";
    ingCivObrFerroviarias: "S" | "N";
    ingCivObrHidraulicas: "S" | "N";
    ingCivAlcantarillas: "S" | "N";
    ingCivPuertos: "S" | "N";
    ingCivAeropuertos: "S" | "N";
    ingCivOtros: "S" | "N";

    monIndDestileria: "S" | "N";
    monIndGenElectrica: "S" | "N";
    monIndMineria: "S" | "N";
    monIndManufUrbana: "S" | "N";
    monIndOtros: "S" | "N";

    ductosTuberias: "S" | "N";
    ductosEstaciones: "S" | "N";
    ductosOtros: "S" | "N";

    redesTransElectAV: "S" | "N";
    redesTransElectBV: "S" | "N";
    redesComunicaciones: "S" | "N";
    redesOtros: "S" | "N";

    otrasConstExcavaciones: "S" | "N";
    otrasConstInstHidrGas: "S" | "N";
    otrasConstInstElectro: "S" | "N";
    otrasConstInstAireAcon: "S" | "N";
    otrasConstReparaciones: "S" | "N";
    otrasConstOtros: "S" | "N";

    arqViviendas: "S" | "N";
    arqEdifPisosMultiples: "S" | "N";
    arqUrbanizacion: "S" | "N";
    arqEdifComerciales: "S" | "N";
    arqEdifOficinas: "S" | "N";
    arqEscuelas: "S" | "N";
    arqHospitales: "S" | "N";
    arqOtros: "S" | "N";

    actExcavacion: "S" | "N";
    actDemolicion: "S" | "N";
    actAlbanileria: "S" | "N";
    actHA: "S" | "N";
    actMontajesElectro: "S" | "N";
    actInstalaciones: "S" | "N";
    actEstructMetalicas: "S" | "N";
    actElectricidad: "S" | "N";
    actAscensores: "S" | "N";
    actPintura: "S" | "N";
    actMayorMilSupCubierta: "S" | "N";
    actSilletas: "S" | "N";
    actMediosIzaje: "S" | "N";
    actAltaMediaTension: "S" | "N";
    actOtros: string; // Campo de texto libre

    operacionTipo: "A" | "M" | "B"; // Asumo 'A'gregar, 'M'odificar, 'B'orrar

    confirmacionFecha: string | null;
    [key: string]: any; // Permite indexar con string, necesario para usar data[name]
}

// Define la estructura del error
export interface ApiError {
    code?: string;
    type?: string;
    title?: string;
    message: string | React.ReactNode | React.ReactNode[];
}

// Define la estructura de la API Query/Estado de la Petición
export interface ApiQueryState {
    action: "Fetch" | Request;
    timeStamp: Date;
    data?: AvisoObraRecord;
}

// Asumiendo que Request y Response son enums
// Debes obtener las definiciones reales de Request y Response de '../UI/Form'
// Ejemplo de cómo podrían ser:
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

export interface AvisoTipo { Codigo: string; Descripcion: string; }
export interface Provincia { Codigo: number; Descripcion: string; }

export interface PdfFormData {
    // Campos de texto / formato
    empleadorCUIT?: string | null;
    empleadorRazonSocial?: string | null;
    direccionCalleRuta?: string | null;
    direccionNumero?: string | null;
    direccionLocalidad?: string | null;
    direccionDeptoPartido?: string | null;
    direccionPciaCodigo?: number | null;
    direccionCPA?: string | null;
    superficie?: string | number | null;
    plantas?: string | number | null;
    actOtros?: string | null;

    // Campos de Fecha
    actividadInicioFecha?: string | null;
    excavacionInicioFecha?: string | null;
    excavacionFinFecha?: string | null;
    demolicionInicioFecha?: string | null;
    demolicionFinFecha?: string | null;
    actividadFinFecha?: string | null;
    suspensionFecha?: string | null;
    reinicioFecha?: string | null;

    // Radio Groups
    obraTipo: string; 
    obraResolucion?: string | null;
    
    // Checkboxes (Todos los campos de actividades/construcción)
    ingCivCaminos?: string | null;
    ingCivCalles?: string | null;
    ingCivAutopistas?: string | null;
    ingCivPuentes?: string | null;
    ingCivTuneles?: string | null;
    ingCivObrFerroviarias?: string | null;
    ingCivObrHidraulicas?: string | null;
    ingCivAlcantarillas?: string | null;
    ingCivPuertos?: string | null;
    ingCivAeropuertos?: string | null;
    ingCivOtros?: string | null;
    arqViviendas?: string | null;
    arqEdifPisosMultiples?: string | null;
    arqEdifComerciales?: string | null;
    arqEdifOficinas?: string | null;
    arqHospitales?: string | null;
    arqOtros?: string | null;
    arqEscuelas?: string | null;
    arqUrbanizacion?: string | null;
    monIndDestileria?: string | null;
    monIndGenElectrica?: string | null;
    monIndMineria?: string | null;
    monIndManufUrbana?: string | null;
    monIndOtros?: string | null;
    ductosTuberias?: string | null;
    ductosEstaciones?: string | null;
    ductosOtros?: string | null;
    redesTransElectAV?: string | null;
    redesComunicaciones?: string | null;
    redesOtros?: string | null;
    redesTransElectBV?: string | null;
    otrasConstExcavaciones?: string | null;
    otrasConstInstHidrGas?: string | null;
    otrasConstInstElectro?: string | null;
    otrasConstInstAireAcon?: string | null;
    otrasConstReparaciones?: string | null;
    otrasConstOtros?: string | null;
    actExcavacion?: string | null;
    actDemolicion?: string | null;
    actAlbanileria?: string | null;
    actHA?: string | null;
    actMontajesElectro?: string | null;
    actInstalaciones?: string | null;
    actEstructMetalicas?: string | null;
    actElectricidad?: string | null;
    actAscensores?: string | null;
    actPintura?: string | null;
    actMayorMilSupCubierta?: string | null;
    actSilletas?: string | null;
    actMediosIzaje?: string | null;
    actAltaMediaTension?: string | null;
    actOtrosCheck?: string | null; 

    // Índice de firma para permitir el acceso dinámico (data[key])
    [key: string]: any; 
}

/*
export interface PdfFormData {
    // ----------------------------------------------------
    // 1. CAMPOS DE TEXTO / FORMATO
    // ----------------------------------------------------
    empleadorCUIT?: string | null;
    empleadorRazonSocial?: string | null;
    
    // Dirección
    direccionCalleRuta?: string | null;
    direccionNumero?: string | null;
    direccionLocalidad?: string | null;
    direccionDeptoPartido?: string | null;
    direccionPciaCodigo?: number | null; // Tipado como number para buscar en Provincias
    direccionCPA?: string | null;
    
    // Dimensiones
    superficie?: string | number | null;
    plantas?: string | number | null;
    
    // Otros (ej. actividad Otros)
    actOtros?: string | null;

    // ----------------------------------------------------
    // 2. CAMPOS DE FECHA
    // ----------------------------------------------------
    actividadInicioFecha?: string | null;
    excavacionInicioFecha?: string | null;
    excavacionFinFecha?: string | null;
    demolicionInicioFecha?: string | null;
    demolicionFinFecha?: string | null;
    actividadFinFecha?: string | null;
    suspensionFecha?: string | null;
    reinicioFecha?: string | null;

    // ----------------------------------------------------
    // 3. RADIO GROUPS (obraTipo, obraResolucion)
    // Los valores posibles son "A", "S", "E", "51/97", "35/98"
    // ----------------------------------------------------
    obraTipo: string; 
    obraResolucion?: string | null;
    
    // ----------------------------------------------------
    // 4. CHECKBOXES (Asumimos string "S" o "N" o potencialmente null/undefined)
    // ----------------------------------------------------
    
    // Ingeniería Civil
    ingCivCaminos?: string | null;
    ingCivCalles?: string | null;
    ingCivAutopistas?: string | null;
    ingCivPuentes?: string | null;
    ingCivTuneles?: string | null;
    ingCivObrFerroviarias?: string | null;
    ingCivObrHidraulicas?: string | null;
    ingCivAlcantarillas?: string | null;
    ingCivPuertos?: string | null;
    ingCivAeropuertos?: string | null;
    ingCivOtros?: string | null;
    
    // Arquitectura
    arqViviendas?: string | null;
    arqEdifPisosMultiples?: string | null;
    arqEdifComerciales?: string | null;
    arqEdifOficinas?: string | null;
    arqHospitales?: string | null;
    arqOtros?: string | null;
    arqEscuelas?: string | null;
    arqUrbanizacion?: string | null;
    
    // Montajes Industriales
    monIndDestileria?: string | null;
    monIndGenElectrica?: string | null;
    monIndMineria?: string | null;
    monIndManufUrbana?: string | null;
    monIndOtros?: string | null;
    
    // Ductos y Tuberías
    ductosTuberias?: string | null;
    ductosEstaciones?: string | null;
    ductosOtros?: string | null;
    
    // Redes
    redesTransElectAV?: string | null;
    redesComunicaciones?: string | null;
    redesOtros?: string | null;
    redesTransElectBV?: string | null;
    
    // Otras Construcciones
    otrasConstExcavaciones?: string | null;
    otrasConstInstHidrGas?: string | null;
    otrasConstInstElectro?: string | null;
    otrasConstInstAireAcon?: string | null;
    otrasConstReparaciones?: string | null;
    otrasConstOtros?: string | null;
    
    // Actividades
    actExcavacion?: string | null;
    actDemolicion?: string | null;
    actAlbanileria?: string | null;
    actHA?: string | null;
    actMontajesElectro?: string | null;
    actInstalaciones?: string | null;
    actEstructMetalicas?: string | null;
    actElectricidad?: string | null;
    actAscensores?: string | null;
    actPintura?: string | null;
    actMayorMilSupCubierta?: string | null;
    actSilletas?: string | null;
    actMediosIzaje?: string | null;
    actAltaMediaTension?: string | null;
    
    // Campo auxiliar creado en la función
    actOtrosCheck?: string | null; 

    // ----------------------------------------------------
    // 5. INDICE DE FIRMA (Necesario para data[name] dinámico)
    // ----------------------------------------------------
    [key: string]: any; 
}*/

interface FormClosedState {
    request: null;
    data?: never; // No debería existir
}

// Interfaz para el estado de "formulario abierto"
interface FormOpenState {
    request: Request; // Ya NO puede ser null
    data: AvisoObraRecord; // Ya NO puede ser opcional
}

// Interfaz Final: Solo uno de los dos estados es posible
export type FormDataState = FormClosedState | FormOpenState;