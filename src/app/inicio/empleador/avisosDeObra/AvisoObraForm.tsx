// AvisoObraForm.tsx
import React, { useState, FC } from "react";
// 🚨 Importar ChangeEvent ya no es necesario
import { Control as UIControl } from "./Control"; // Asumo que UIControl es el componente de input/select
import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
// Asumo que Provincias y AvisosObraTipos son arrays de objetos con campos Codigo y Descripcion
import { AvisosObraTipos } from './avisosObraTipos'; 
import { Provincias } from './provincias';
import CustomModal from "@/utils/ui/form/CustomModal";
import { AvisoObraRecord, AvisoTipo, Provincia, Request, Response } from "./types";
import CustomButton from "@/utils/ui/button/CustomButton";

// El tipo SelectConfig se usa para mapear la descripción a un valor (string o number)
type SelectConfig = Record<string, string | number>;

// Define el tipo para la prop 'type' de los controles, resolviendo el error de asignación de tipo.
type ControlType = "text" | "number" | "date" | "checkbox" | "select" | "textarea";

// 2. Props para el componente AvisoObraForm
interface AvisoObraFormProps {
    request: Request;
    // Hacemos que 'data' sea opcional aquí y manejamos el valor por defecto en initData
    data?: Partial<AvisoObraRecord>; 
    onClose: (request: Request, response: Response, data: AvisoObraRecord) => void;
    action?: string;
    open: boolean; // CustomModal requiere la prop 'open'
    [key: string]: any; // Para el resto de props (...)
}

// 3. Función auxiliar de inicialización de datos con tipado
const initData = (initialData: Partial<AvisoObraRecord> = {}): AvisoObraRecord => {
    // Definición de valores por defecto (se eliminan las redundancias de "" en string/number)
    const defaultData: AvisoObraRecord = {
        obraTipo: "", direccionCalleRuta: "", direccionNumero: "", direccionLocalidad: "",
        direccionDeptoPartido: "", direccionPciaCodigo: "", // string para el select
        direccionCPA: "", superficie: null, plantas: null, actOtros: "", operacionTipo: "A",
        // Campos que deben ser 'null' en lugar de "" si están vacíos
        recepcionFecha: null, actividadInicioFecha: null, actividadFinFecha: null,
        suspensionFecha: null, reinicioFecha: null, excavacionInicioFecha: null,
        excavacionFinFecha: null, demolicionInicioFecha: null, demolicionFinFecha: null,
        confirmacionFecha: null,
        // Campos booleanos (checkboxes) - usando "N" como default
        ingCivCaminos: "N", ingCivCalles: "N", ingCivAutopistas: "N", ingCivPuentes: "N", ingCivTuneles: "N", ingCivObrFerroviarias: "N", ingCivObrHidraulicas: "N",
        ingCivAlcantarillas: "N", ingCivPuertos: "N", ingCivAeropuertos: "N", ingCivOtros: "N",
        monIndDestileria: "N", monIndGenElectrica: "N", monIndMineria: "N", monIndManufUrbana: "N", monIndOtros: "N",
        ductosTuberias: "N", ductosEstaciones: "N", ductosOtros: "N",
        redesTransElectAV: "N", redesTransElectBV: "N", redesComunicaciones: "N", redesOtros: "N",
        otrasConstExcavaciones: "N", otrasConstInstHidrGas: "N", otrasConstInstElectro: "N", otrasConstInstAireAcon: "N",
        otrasConstReparaciones: "N", otrasConstOtros: "N",
        arqViviendas: "N", arqEdifPisosMultiples: "N", arqUrbanizacion: "N", arqEdifComerciales: "N", arqEdifOficinas: "N",
        arqEscuelas: "N", arqHospitales: "N", arqOtros: "N",
        actExcavacion: "N", actDemolicion: "N", actAlbanileria: "N", actHA: "N", actMontajesElectro: "N", actInstalaciones: "N",
        actEstructMetalicas: "N", actElectricidad: "N", actAscensores: "N", actPintura: "N", actMayorMilSupCubierta: "N",
        actSilletas: "N", actMediosIzaje: "N", actAltaMediaTension: "N",
    };

    // Sobrescribe los valores predeterminados con los datos iniciales
    return { ...defaultData, ...initialData } as AvisoObraRecord;
};

const AvisoObraForm: FC<AvisoObraFormProps> = ({
    request,
    data: initialData = {},
    onClose,
    action,
    open, // Desestructuramos 'open'
    ...restProps // Renombramos 'x' a 'restProps' para mayor claridad
}) => {
    const [data, setData] = useState<AvisoObraRecord>(initData(initialData));

    // 4. Mapeos para Selects (Memoizables si el componente fuera complejo, pero OK aquí)
    const avisosObraTipos: SelectConfig = AvisosObraTipos.reduce((acc, r) => {
        acc[r.Descripcion] = r.Codigo;
        return acc;
    }, {} as SelectConfig);

    const provincias: SelectConfig = Provincias.reduce((acc, r) => {
        acc[r.Descripcion] = r.Codigo;
        return acc;
    }, {} as SelectConfig);

    const confirmadoValor = (): string => {
    // Usa el valor existente o genera el timestamp actual
    if (data.confirmacionFecha) {
        if (typeof data.confirmacionFecha === 'string') return data.confirmacionFecha;
        // CORRECCIÓN: Usar 'as any' para permitir el chequeo de instancia de Date,
        // asumiendo que el dato puede venir como objeto Date desde una prop inicial.
        if ((data.confirmacionFecha as any) instanceof Date) { 
            // Si es un objeto Date, lo convertimos a string ISO sin 'Z' ni milisegundos.
            return (data.confirmacionFecha as Date).toISOString().split(".")[0];
        }
    }
    
    // Si no está confirmado o es nulo, generamos la fecha actual en formato string
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
    
    const finalAction = action || (() => {// 6. Título del Modal
        switch (request) {
            case Request.Insert: return "Agrega";
            case Request.View: return "Consulta";
            case Request.Change: return "Modifica";
            case Request.Delete: return "Borra";
            default: return "";
        }
    })();
    const title = [finalAction, "Aviso de obra"].filter(e => e).join(" ");
    
    // 7. Componente de Control tipado y con lógica de manejo de cambios
    // Lo definimos dentro del componente principal para tener acceso a 'data' y 'setData'
    interface ControlProps {
        name: keyof AvisoObraRecord;
        type?: ControlType; // Mantenemos opcional aquí
        config?: Record<string, any>;
        disabled?: boolean;
        label?: string;
        value?: any; 
        [key: string]: any;
    }
    
    const Control: FC<ControlProps> = ({
        name,
        type = "text", // Usamos el valor por defecto
        config = {},
        disabled = false,
        label,
        value: propValue,
        ...p
    }) => {
        const controlConfig = { ...config };

        if (type === "checkbox") {
            controlConfig.trueValue = controlConfig.trueValue ?? "S";
            controlConfig.falseValue = controlConfig.falseValue ?? "N";
        }

        const currentValue = propValue !== undefined 
            ? propValue 
            : data[name] || (type === "checkbox" ? controlConfig.falseValue : "");

        const handleChange = (changes: { [key: string]: any }) => {
            const fieldName = Object.keys(changes)[0] as keyof AvisoObraRecord;
            const fieldValue = changes[fieldName];

            const newData = { ...data, [fieldName]: fieldValue };
            
            // Lógica para resetear confirmacionFecha si la validación falla
            const isConfirmationDisabled = deshabilitaConfirmacionFecha(newData);
            if (isConfirmationDisabled) {
                // Si se deshabilita, se limpia el campo para evitar el envío
                newData.confirmacionFecha = null;
            } else if (fieldName === "confirmacionFecha" && fieldValue !== controlConfig.falseValue) {
                // Si se activa el checkbox, se pone el valor actual de 'confirmadoValor()'
                // Esto maneja el caso de que la fecha sea una string de la fecha actual
                newData.confirmacionFecha = confirmadoValor();
            } else if (fieldName === "confirmacionFecha" && fieldValue === controlConfig.falseValue) {
                // Si se desactiva, se pone null
                newData.confirmacionFecha = null;
            }
            setData(newData);
        };
        
        const controlProps = {
            name: name,
            label: label || name,
            value: currentValue,
            type: type, 
            config: controlConfig,
            disabled: request === Request.View || disabled, 
            onChange: handleChange,
            ...p,
        };
        
        // El componente UIControl debe aceptar props genéricos
       return <UIControl {...controlProps as any} />;
    };

    // 8. Lógica de Cierre y Conversión de Tipos
    const handleOnClose = (req: Request, res: Response) => {
        // Copiamos los datos para la conversión de tipos
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
        // Si es una acción de Inserción/Modificación, chequeamos la bandera de confirmación.
        // El handler padre (AvisosObraHandler) se encargará de la validación final.
        if (
            (request === Request.Insert || request === Request.Change) && 
            !data.confirmacionFecha
        ) {
            // Si el checkbox "Formulario listo para envío" no está marcado, 
            // no lo permitimos (o podríamos abrir un error, pero el handler padre ya lo valida)
            console.error("Debe marcar 'Formulario listo para envío' antes de confirmar.");
            return;
        }
        
        handleOnClose(request, Response.Completed);
    };

    // Determinar si el formulario es solo de lectura
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
            
            {/* El botón Confirmar solo se muestra si NO es solo de lectura */}
            {!isReadOnly && (
                <CustomButton 
                    variant="contained" 
                    onClick={handleConfirm} 
                    color="primary"
                    // Deshabilitado si estamos en Insert/Change y la confirmación no está lista.
                    disabled={request !== Request.Delete && deshabilitaConfirmacionFecha()}
                >
                    {request === Request.Delete ? "Confirmar Eliminación" : "Confirmar Envío"}
                </CustomButton>
            )}
        </Box>
    );

    // 9. Renderizado del componente (JSX)
    return (
        // Se corrigió el uso de la prop 'open'
       <CustomModal 
            title={title} 
            open={open} 
            // Reemplazamos el onClose con nuestro handler de cancelar
            onClose={handleCancel} 
            actions={modalActions} // Pasamos los botones al modal
            size="large"
        >
            <Grid container rowSpacing={2} columnSpacing={2}>
                <Grid >
                    <Control label="Tipo" name="obraTipo" type="select" config={avisosObraTipos} />
                </Grid>
                <Grid >
                    <Control label="Superficie" name="superficie" type="number" />
                </Grid>
                <Grid >
                    <Control label="Plantas" name="plantas" type="number" />
                </Grid>
                
                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid >
                                    <Typography align="left" variant="subtitle1">**Dirección**</Typography>
                                </Grid>
                                <Grid  >
                                    <Control label="Calle/Ruta" name="direccionCalleRuta" />
                                </Grid>
                                <Grid  >
                                    <Control label="Número/Km" name="direccionNumero" />
                                </Grid>
                                <Grid  >
                                    <Control label="Localidad" name="direccionLocalidad" />
                                </Grid>
                                <Grid  >
                                    <Control label="Dpto/Partido" name="direccionDeptoPartido" />
                                </Grid>
                                <Grid  >
                                    <Control label="Provincia" name="direccionPciaCodigo" type="select" config={provincias} />
                                </Grid>
                                <Grid  >
                                    <Control label="C.P.A." name="direccionCPA" />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid  >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" variant="subtitle1">**Fechas de Actividad**</Typography>
                            <Grid container spacing={2}>
                                <Grid  >
                                    <Control label="Inicio" name="actividadInicioFecha" type="date" />
                                </Grid>
                                <Grid  >
                                    <Control label="Fin" name="actividadFinFecha" type="date" />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid  >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" variant="subtitle1">**Fechas de Suspensión**</Typography>
                            <Grid container spacing={2}>
                                <Grid  >
                                    <Control label="Inicio" name="suspensionFecha" type="date" />
                                </Grid>
                                <Grid  >
                                    <Control label="Reinicio" name="reinicioFecha" type="date" />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid  >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1">**Obras de Ingeniería Civil**</Typography>
                            <Grid container spacing={2}>
                                <Grid  ><Control label="Caminos" name="ingCivCaminos" type="checkbox" /></Grid>
                                <Grid  ><Control label="Calles" name="ingCivCalles" type="checkbox" /></Grid>
                                <Grid  ><Control label="Autopistas" name="ingCivAutopistas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Puentes" name="ingCivPuentes" type="checkbox" /></Grid>
                                <Grid  ><Control label="Túneles" name="ingCivTuneles" type="checkbox" /></Grid>
                                <Grid  ><Control label="Ferroviarias" name="ingCivObrFerroviarias" type="checkbox" /></Grid>
                                <Grid  ><Control label="Obras Hidráulicas" name="ingCivObrHidraulicas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Alcantarillados/Trat. Aguas" name="ingCivAlcantarillas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Puertos" name="ingCivPuertos" type="checkbox" /></Grid>
                                <Grid  ><Control label="Aeropuertos" name="ingCivAeropuertos" type="checkbox" /></Grid>
                                <Grid  ><Control label="Otras" name="ingCivOtros" type="checkbox" /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid  >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" variant="subtitle1">**Obras de Arquitectura**</Typography>
                            <Grid container spacing={2}>
                                <Grid  ><Control label="Vivienda Unifamiliares" name="arqViviendas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Hospitales" name="arqHospitales" type="checkbox" /></Grid>
                                <Grid  ><Control label="Edificios Comerciales" name="arqEdifComerciales" type="checkbox" /></Grid>
                                <Grid  ><Control label="Edificios de Oficinas" name="arqEdifOficinas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Edificios Pisos Múltiples" name="arqEdifPisosMultiples" type="checkbox" /></Grid>
                                <Grid  ><Control label="Escuelas" name="arqEscuelas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Obras Urbanización" name="arqUrbanizacion" type="checkbox" /></Grid>
                                <Grid  ><Control label="Otras edificaciones urbanas" name="arqOtros" type="checkbox" /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid  >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" variant="subtitle1">**Obras de Montaje Industrial**</Typography>
                            <Grid container spacing={2}>
                                <Grid  ><Control label="Destilería/Petroquímicas" name="monIndDestileria" type="checkbox" /></Grid>
                                <Grid  ><Control label="Generación Eléctrica" name="monIndGenElectrica" type="checkbox" /></Grid>
                                <Grid  ><Control label="Minería" name="monIndMineria" type="checkbox" /></Grid>
                                <Grid  ><Control label="Industria Manufacturera" name="monIndManufUrbana" type="checkbox" /></Grid>
                                <Grid  ><Control label="Demás Montajes Industriales" name="monIndOtros" type="checkbox" /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid  >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" variant="subtitle1">**Otras Construcciones**</Typography>
                            <Grid container spacing={2}>
                                <Grid  ><Control label="Excavaciones Subterráneas" name="otrasConstExcavaciones" type="checkbox" /></Grid>
                                <Grid  ><Control label="Instalaciones Electromecánicas" name="otrasConstInstElectro" type="checkbox" /></Grid>
                                <Grid  ><Control label="Inst. Hidráulicas/Gas" name="otrasConstInstHidrGas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Inst. Aire Acondicionado" name="otrasConstInstAireAcon" type="checkbox" /></Grid>
                                <Grid  ><Control label="Reparaciones/Refacciones" name="otrasConstReparaciones" type="checkbox" /></Grid>
                                <Grid  ><Control label="Otras obras no especificadas" name="otrasConstOtros" type="checkbox" /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid >
                    <Card variant="outlined">
                        <CardContent>
                            <Typography align="left" variant="subtitle1">**Actividad a Desarrollar**</Typography>
                            <Grid container spacing={2}>
                                {/* Sub-sección Excavación */}
                                <Grid  >
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Control label="Excavación" name="actExcavacion" type="checkbox" />
                                            <Grid container spacing={2}>
                                                <Grid ><Control label="Inicio" name="excavacionInicioFecha" type="date" /></Grid>
                                                <Grid ><Control label="Fin" name="excavacionFinFecha" type="date" /></Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {/* Sub-sección Demolición */}
                                <Grid  >
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Control label="Demolición" name="actDemolicion" type="checkbox" />
                                            <Grid container spacing={2}>
                                                <Grid ><Control label="Inicio" name="demolicionInicioFecha" type="date" /></Grid>
                                                <Grid ><Control label="Fin" name="demolicionFinFecha" type="date" /></Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                {/* Otros Checkboxes */}
                                <Grid ><Control label="Albañilería" name="actAlbanileria" type="checkbox" /></Grid>
                                <Grid ><Control label="H A" name="actHA" type="checkbox" /></Grid>
                                <Grid ><Control label="Montajes electromecánicos" name="actMontajesElectro" type="checkbox" /></Grid>
                                <Grid ><Control label="Instalaciones" name="actInstalaciones" type="checkbox" /></Grid>
                                <Grid ><Control label="Estructuras Metálicas" name="actEstructMetalicas" type="checkbox" /></Grid>
                                <Grid ><Control label="Electricidad" name="actElectricidad" type="checkbox" /></Grid>
                                <Grid ><Control label="Ascensores" name="actAscensores" type="checkbox" /></Grid>
                                <Grid ><Control label="Pintura" name="actPintura" type="checkbox" /></Grid>
                                <Grid ><Control label="Silletas o Andamios colgantes" name="actSilletas" type="checkbox" /></Grid>
                                <Grid  ><Control label="Medios de Izaje" name="actMediosIzaje" type="checkbox" /></Grid>
                                <Grid  ><Control label="Alta y media tensión" name="actAltaMediaTension" type="checkbox" /></Grid>
                                <Grid ><Control label="Mayor de 1000 m2 Sup. Cubierta o más de 4m. de altura" name="actMayorMilSupCubierta" type="checkbox" /></Grid>
                                <Grid ><Control label="Otros (detallar)" name="actOtros" type="textarea" /></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                {/* --- SECCIÓN CONFIRMACIÓN FINAL --- */}
                <Grid >
                    <div style={{ textAlign: "left" }}>
                        <Control
                            label="Formulario listo para envío"
                            name="confirmacionFecha"
                            disabled={deshabilitaConfirmacionFecha()}
                            type="checkbox"
                            // El valor del checkbox se maneja con trueValue/falseValue
                            config={{ 
                                trueValue: confirmadoValor(), 
                                falseValue: null, // Usamos null para que el onChange lo mapee a null o al string de fecha.
                            }}
                            // Forzamos el valor a la fecha si está habilitado y confirmado, o null/"" si no
                            value={data.confirmacionFecha}
                        />
                    </div>
                </Grid>
            </Grid>
        </CustomModal>
    );
};

export default AvisoObraForm;