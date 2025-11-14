// src 
import React, { useState, FC, useEffect } from "react";
import { Control as UIControl } from "./Control"; // Asumo que UIControl es el componente de input/select
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";

// Importamos mock/tipos necesarios
import { AvisosObraTipos } from './types/avisosObraTipos'; 
import { Provincias } from './types/provincias';
import CustomModal from "@/utils/ui/form/CustomModal";
import { AvisoObraRecord, AvisoTipo, Provincia, Request, Response } from "./types/types";
import CustomButton from "@/utils/ui/button/CustomButton";
import styles from './AvisoObra.module.css';


type SelectConfig = Record<string, string | number>;
type ControlType = "text" | "number" | "date" | "checkbox" | "select" | "textarea";

// 2. Props para el componente AvisoObraForm
interface AvisoObraFormProps {
    request: Request;
    data?: Partial<AvisoObraRecord>; 
    onClose: (request: Request, response: Response, data: AvisoObraRecord) => void;
    action?: string;
    open: boolean; 
    [key: string]: any; 
}

// 3. Función auxiliar de inicialización de datos con tipado (Mantener fuera)
const initData = (initialData: Partial<AvisoObraRecord> = {}): AvisoObraRecord => {
    // Definición de defaultData (completo y correcto)
    const defaultData: AvisoObraRecord = {
        interno: null, obraNumero: null, obraSecuencia: null, empleadorCUIT: null, empleadorRazonSocial: null,
        obraTipo: '', superficie: null, plantas: null, direccionCalleRuta: '', direccionNumero: '', direccionLocalidad: '', direccionDeptoPartido: '',
        direccionPciaCodigo: '', direccionCPA: '', recepcionFecha: null, actividadInicioFecha: null, actividadFinFecha: null,
        suspensionFecha: null, reinicioFecha: null, excavacionInicioFecha: null, excavacionFinFecha: null, demolicionInicioFecha: null, demolicionFinFecha: null,
        ingCivCaminos: "N", ingCivCalles: "N", ingCivAutopistas: "N", ingCivPuentes: "N", ingCivTuneles: "N", ingCivObrFerroviarias: "N", ingCivObrHidraulicas: "N",
        ingCivAlcantarillas: "N", ingCivPuertos: "N", ingCivAeropuertos: "N", ingCivOtros: "N", monIndDestileria: "N", monIndGenElectrica: "N", monIndMineria: "N",
        monIndManufUrbana: "N", monIndOtros: "N", ductosTuberias: "N", ductosEstaciones: "N", ductosOtros: "N", redesTransElectAV: "N", redesTransElectBV: "N",
        redesComunicaciones: "N", redesOtros: "N", otrasConstExcavaciones: "N", otrasConstInstHidrGas: "N", otrasConstInstElectro: "N", otrasConstInstAireAcon: "N",
        otrasConstReparaciones: "N", otrasConstOtros: "N", arqViviendas: "N", arqEdifPisosMultiples: "N", arqUrbanizacion: "N", arqEdifComerciales: "N",
        arqEdifOficinas: "N", arqEscuelas: "N", arqHospitales: "N", arqOtros: "N", actExcavacion: "N", actDemolicion: "N", actAlbanileria: "N", actHA: "N",
        actMontajesElectro: "N", actInstalaciones: "N", actEstructMetalicas: "N", actElectricidad: "N", actAscensores: "N", actPintura: "N",
        actMayorMilSupCubierta: "N", actSilletas: "N", actMediosIzaje: "N", actAltaMediaTension: "N", actOtros: '', operacionTipo: "A", confirmacionFecha: null,
    };
    return { ...defaultData, ...initialData } as AvisoObraRecord;
};

interface ControlProps {
    name: keyof AvisoObraRecord;
    type?: ControlType;
    config?: Record<string, any>;
    disabled?: boolean;
    label?: string;
    value?: any; 
    onChange: (changes: { [key: string]: any }) => void; // Recibe el manejador de cambios
    data: AvisoObraRecord; // Recibe el estado actual (para obtener el valor por defecto)
    maxLength?: number;
    [key: string]: any;
}

const Control: FC<ControlProps> = ({
    name,
    type = "text",
    config = {},
    disabled = false,
    label,
    value: propValue,
    onChange, // Desestructuramos el handler de cambios
    data, // Desestructuramos el estado actual
    maxLength: propMaxLength,
    ...p
}) => {

    const finalMaxLength = propMaxLength ?? (config.maxLength as number | undefined);

    const controlConfig = { ...config };

    if (type === "checkbox") {
        controlConfig.trueValue = controlConfig.trueValue ?? "S";
        controlConfig.falseValue = controlConfig.falseValue ?? "N";
    }

    // Se mantiene la lógica para obtener el valor
    const currentValue = propValue !== undefined 
        ? propValue 
        : data[name] || (type === "checkbox" ? controlConfig.falseValue : "");

    const controlProps = {
        name: name,
        label: label || name,
        value: currentValue,
        type: type, 
        config: controlConfig,
        disabled: disabled, 
        // El onChange de UIControl debe llamar al onChange pasado por props
        maxLength: finalMaxLength,
        onChange: (e: any) => { 
            // Asumo que tu UIControl ya devuelve { [name]: value } o es fácil de adaptar.
            // Si UIControl pasa el valor directamente, ajusta aquí:
            // onChange({ [name]: e.target.value })
            onChange(e); 
        },
        ...p,
    };
    
    return <UIControl {...controlProps as any} />;
};


// ==========================================================
// 5. COMPONENTE PRINCIPAL
// ==========================================================

const AvisoObraForm: FC<AvisoObraFormProps> = ({
    request,
    data: initialData = {},
    onClose,
    action,
    open, 
    ...restProps
}) => {
    const [data, setData] = useState<AvisoObraRecord>(initData(initialData));

    // Mapeos para Selects
    const avisosObraTipos: SelectConfig = AvisosObraTipos.reduce((acc, r: AvisoTipo) => {
        acc[r.Descripcion] = r.Codigo;
        return acc;
    }, {} as SelectConfig);

    const provincias: SelectConfig = Provincias.reduce((acc, r: Provincia) => {
        acc[r.Descripcion] = r.Codigo;
        return acc;
    }, {} as SelectConfig);

    // Funciones auxiliares (mantenerlas fuera de los handlers para evitar re-render innecesario o memoizarlas si fuera necesario)
    const confirmadoValor = (): string => {
        if (data.confirmacionFecha) {
            if (typeof data.confirmacionFecha === 'string') return data.confirmacionFecha;
            if ((data.confirmacionFecha as any) instanceof Date) { 
                return (data.confirmacionFecha as Date).toISOString().split(".")[0];
            }
        }
        const date = new Date();
        return date.toISOString().split(".")[0];
    };

    const deshabilitaConfirmacionFecha = (d: AvisoObraRecord = data): boolean => {
        if (d.direccionCalleRuta === "") return true;
        if (!d.direccionPciaCodigo) return true; 
        if (d.direccionCPA === "") return true;
        if (!d.actividadInicioFecha) return true; 
        if (d.actExcavacion === "S" && (!d.excavacionInicioFecha || !d.excavacionFinFecha)) return true;
        if (d.actDemolicion === "S" && (!d.demolicionInicioFecha || !d.demolicionFinFecha)) return true;
        return false;
    };
    
    // 6. MANEJADOR CENTRAL DE CAMBIOS (Se encarga de actualizar el estado 'data')
    const handleChange = (changes: { [key: string]: any }) => {
        // Obtenemos el campo y el valor del objeto de cambios
        const fieldName = Object.keys(changes)[0] as keyof AvisoObraRecord;
        const fieldValue = changes[fieldName];

        let newData = { ...data, [fieldName]: fieldValue };
        
        // Lógica para resetear confirmacionFecha si la validación falla
        const isConfirmationDisabled = deshabilitaConfirmacionFecha(newData);
        
        // Si el campo cambiado NO es confirmacionFecha:
        if (fieldName !== "confirmacionFecha") {
            // Si la nueva data deshabilita la confirmación, forzamos confirmacionFecha a null
            if (isConfirmationDisabled && newData.confirmacionFecha) {
                newData.confirmacionFecha = null;
            }
        } 
        // Si el campo cambiado ES confirmacionFecha:
        else {
            const trueValue = confirmadoValor();
            const falseValue = null;
            
            // Si el valor entrante no es null (se está marcando)
            if (fieldValue !== falseValue) {
                // Si la confirmación no está deshabilitada por la validación
                if (!isConfirmationDisabled) {
                    newData.confirmacionFecha = trueValue;
                } else {
                    // Si se intenta marcar pero está deshabilitado, lo forzamos a null
                    newData.confirmacionFecha = null;
                }
            } else {
                // Si el valor entrante es null (se está desmarcando)
                newData.confirmacionFecha = null;
            }
        }

        // Finalmente, actualizamos el estado UNA SOLA VEZ.
        setData(newData);
    };

    // Título del Modal
    const finalAction = action || (() => {
        switch (request) {
            case Request.Insert: return "Agrega";
            case Request.View: return "Consulta";
            case Request.Change: return "Modifica";
            case Request.Delete: return "Borra";
            default: return "";
        }
    })();
    const title = [finalAction, "Aviso de Obra"].filter(e => e).join(" ");

    // 7. Lógica de Cierre y Conversión de Tipos (Mantenida sin cambios)
    const handleOnClose = (req: Request, res: Response) => {
        const record: AvisoObraRecord = { ...data };

        // Aplicamos la lógica de conversión a number/null
        (Object.keys(record) as Array<keyof AvisoObraRecord>).forEach((field) => {
            let value = record[field];
            
            switch (field) {
                case "recepcionFecha":
                case "actividadInicioFecha":
                case "actividadFinFecha":
                case "suspensionFecha":
                case "reinicioFecha":
                case "excavacionInicioFecha":
                case "excavacionFinFecha":
                case "demolicionInicioFecha":
                case "demolicionFinFecha":
                case "confirmacionFecha":
                    if (value === "") {
                        (record as any)[field] = null;
                    }
                    break;
                    
                case "obraNumero":
                case "obraSecuencia":
                case "direccionPciaCodigo":
                case "superficie":
                case "plantas":{
                    const v = (record as any)[field];
                    if (v === "" || v === null || v === undefined) {
                        (record as any)[field] = null;
                    } else {
                        const n = Number(v);
                        (record as any)[field] = Number.isNaN(n) ? null : n;
                    }
                    break;
                }
                default:
                    break;
            }
        });
        onClose(req, res, record);
    };

    const handleCancel = () => {
        handleOnClose(request, Response.Cancelled);
    };

    const handleConfirm = () => {
        if (
            (request === Request.Insert || request === Request.Change) && 
            !data.confirmacionFecha
        ) {
            console.error("Debe marcar 'Formulario listo para envío' antes de confirmar.");
            return;
        }
        
        handleOnClose(request, Response.Completed);
    };

    const isReadOnly = request === Request.View;

    const modalActions = (
        <Box sx={{ display: 'flex', gap: 2, padding: 2 }}>
            <CustomButton 
                variant="outlined" 
                onClick={handleCancel} 
                color="secondary"
            >
                Cancelar
            </CustomButton>
            
            {!isReadOnly && (
                <CustomButton 
                    variant="contained" 
                    onClick={handleConfirm} 
                    color="primary"
                    disabled={request !== Request.Delete && deshabilitaConfirmacionFecha()}
                >
                    {request === Request.Delete ? "Confirmar Eliminación" : "Confirmar Envío"}
                </CustomButton>
            )}
        </Box>
    );

    // 8. Renderizado del componente (JSX) con la estructura Grid corregida
    // Nota: Agregamos 'xs={12}' a los Grid para evitar un error de layout
    // y pasamos las props 'data' y 'onChange' al componente 'Control'
    return (
        <CustomModal 
            title={title} 
            open={open} 
            onClose={handleCancel} 
            actions={modalActions} 
            size="large"
        >
            <Grid container rowSpacing={2} columnSpacing={2}>
                
                {/* CAMPOS SUPERIORES DIRECTOS */}
                <Grid width={'20%'}>
                    <Control label="Tipo" name="obraTipo" type="select" config={avisosObraTipos} onChange={handleChange} data={data} disabled={isReadOnly} />
                </Grid>
                <Grid >
                    <Control label="Superficie" maxLength={4}  name="superficie" type="number" onChange={handleChange} data={data} disabled={isReadOnly} />
                </Grid>
                <Grid >
                    <Control label="Plantas" maxLength={4} name="plantas" type="number" onChange={handleChange} data={data} disabled={isReadOnly} />
                </Grid>
                
                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" className={styles.titulo}>Dirección</Typography>

                            <Grid container spacing={2}>
                                <Grid >
                                    <Control label="Calle/Ruta" maxLength={74} name="direccionCalleRuta" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                                <Grid >
                                    <Control label="Número/Km"  maxLength={10} name="direccionNumero" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                                <Grid >
                                    <Control label="Localidad"  maxLength={40} name="direccionLocalidad" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                                <Grid >
                                    <Control label="Dpto/Partido"  maxLength={40}  name="direccionDeptoPartido" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                                <Grid width={"20%"}>
                                    <Control label="Provincia" name="direccionPciaCodigo" type="select" config={provincias} onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                                <Grid >
                                    <Control label="C.P.A." name="direccionCPA"  maxLength={8}  onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" className={styles.titulo}>Fechas de Actividad</Typography>
                            <br />
                            <Grid container spacing={2}>
                                <Grid >
                                    <Control label="Inicio" name="actividadInicioFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                                <Grid >
                                    <Control label="Fin" name="actividadFinFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" className={styles.titulo}>Fechas de Suspensión</Typography>
                            <br />
                            <Grid container spacing={2}>
                                <Grid >
                                    <Control label="Inicio" name="suspensionFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                                <Grid >
                                    <Control label="Reinicio" name="reinicioFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* --- SECCIÓN CLASIFICACIÓN (Múltiples CARDS en filas) --- */}

                <Grid>
                    <Card variant="outlined">
                        <CardContent>
                        <Typography className={styles.titulo}>Obras de Ingeniería Civil</Typography>
                            <Grid container spacing={1}>
                                <Grid ><Control label="Caminos" name="ingCivCaminos" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Calles" name="ingCivCalles" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Autopistas" name="ingCivAutopistas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Puentes" name="ingCivPuentes" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Túneles" name="ingCivTuneles" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Ferroviarias" name="ingCivObrFerroviarias" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Obras Hidráulicas" name="ingCivObrHidraulicas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Alcantarillados/Trat. Aguas" name="ingCivAlcantarillas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Puertos" name="ingCivPuertos" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Aeropuertos" name="ingCivAeropuertos" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Otras" name="ingCivOtros" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" className={styles.titulo}>Obras de Arquitectura</Typography>
                            <Grid container spacing={1}>
                                <Grid ><Control label="Vivienda Unifamiliares" name="arqViviendas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Hospitales" name="arqHospitales" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Edificios Comerciales" name="arqEdifComerciales" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Edificios de Oficinas" name="arqEdifOficinas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Edificios Pisos Múltiples" name="arqEdifPisosMultiples" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Escuelas" name="arqEscuelas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Obras Urbanización" name="arqUrbanizacion" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Otras edificaciones urbanas" name="arqOtros" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" className={styles.titulo}>Montajes y Otras Construcciones</Typography>
                            <Grid container spacing={2}>
                                <Grid sx={{mt: 2}}>
                                    <Grid ><Typography>Montaje Industrial</Typography></Grid>
                                    <Grid ><Control label="Destilería/Petroquímicas" name="monIndDestileria" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Generación Eléctrica" name="monIndGenElectrica" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Minería" name="monIndMineria" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Industria Manufacturera" name="monIndManufUrbana" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Demás Montajes Industriales" name="monIndOtros" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                </Grid>
                                <Grid sx={{mt: 2}}>
                                    <Grid ><Typography>Otras Construcciones</Typography></Grid>
                                    <Grid ><Control label="Excavaciones Subterráneas" name="otrasConstExcavaciones" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Instalaciones Electromecánicas" name="otrasConstInstElectro" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Inst. Hidráulicas/Gas" name="otrasConstInstHidrGas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Inst. Aire Acondicionado" name="otrasConstInstAireAcon" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Reparaciones/Refacciones" name="otrasConstReparaciones" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                    <Grid ><Control label="Otras obras no especificadas" name="otrasConstOtros" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* --- SECCIÓN ACTIVIDAD A DESARROLLAR (CARD GRANDE) --- */}
                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" className={styles.titulo}>Actividad a Desarrollar</Typography>
                            <Grid container spacing={2}>
                                {/* Sub-sección Excavación y Demolición (con sus fechas internas) */}
                                <Grid>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Control label="Excavación" name="actExcavacion" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} />
                                            <Grid container spacing={2}>
                                                <Grid ><Control label="Inicio" name="excavacionInicioFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                                <Grid ><Control label="Fin" name="excavacionFinFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                
                                <Grid>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Control label="Demolición" name="actDemolicion" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} />
                                            <Grid container spacing={2}>
                                                <Grid ><Control label="Inicio" name="demolicionInicioFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                                <Grid ><Control label="Fin" name="demolicionFinFecha" type="date" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>  
                            <Grid container spacing={2} sx={{mt: 1}}>
                                <Grid ><Control label="Albañilería" name="actAlbanileria" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="H A" name="actHA" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Montajes electromecánicos" name="actMontajesElectro" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Instalaciones" name="actInstalaciones" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Estructuras Metálicas" name="actEstructMetalicas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Electricidad" name="actElectricidad" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Ascensores" name="actAscensores" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Pintura" name="actPintura" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Silletas o Andamios colgantes" name="actSilletas" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Medios de Izaje" name="actMediosIzaje" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Alta y media tensión" name="actAltaMediaTension" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                                <Grid ><Control label="Mayor de 1000 m2 Sup. Cubierta o más de 4m. de altura" name="actMayorMilSupCubierta" type="checkbox" onChange={handleChange} data={data} disabled={isReadOnly} /></Grid>
                               
                                <Control label="Otros (detallar)" name="actOtros" maxLength={100} type="textarea" onChange={handleChange} data={data} disabled={isReadOnly} />
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                
                {/* --- SECCIÓN CONFIRMACIÓN FINAL --- */}
                <Grid >
                    <div style={{ textAlign: "left", marginTop: 10 }}>
                        <Control
                            label="Formulario listo para envío"
                            name="confirmacionFecha"
                            disabled={isReadOnly || deshabilitaConfirmacionFecha()}
                            type="checkbox"
                            config={{ 
                                trueValue: confirmadoValor(), 
                                falseValue: null,
                            }}
                            value={data.confirmacionFecha}
                            onChange={handleChange} 
                            data={data}
                        />
                    </div>
                </Grid>
            </Grid>
        </CustomModal>
    );
};

export default AvisoObraForm;