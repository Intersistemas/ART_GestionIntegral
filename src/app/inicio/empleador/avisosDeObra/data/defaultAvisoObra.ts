//src/app/inicio/empleador/avisodeobra/types/defaultAvisoObra.ts
import { AvisoObraRecord } from "../types/types";

export const getDefaultAvisoObra = (
  initialData: Partial<AvisoObraRecord> = {}
): AvisoObraRecord => {

  const base: AvisoObraRecord = {
    interno: null,
    obraNumero: null,
    obraSecuencia: null,
    empleadorCUIT: null,
    empleadorRazonSocial: "",

    // Campos obligatorios inicializados
    obraTipo: "",
    direccionCalleRuta: "",
    direccionNumero: "",
    direccionLocalidad: "",
    direccionDeptoPartido: "",
    direccionPciaCodigo: "",
    direccionCPA: "",
    recepcionFecha: null,
    superficie: null,
    plantas: null,

    // Fechas
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

    redesTransElectAV: "N", redesTransElectBV: "N", redesComunicaciones: "N", redesOtros: "N",

    otrasConstExcavaciones: "N", otrasConstInstHidrGas: "N", otrasConstInstElectro: "N",
    otrasConstInstAireAcon: "N", otrasConstReparaciones: "N", otrasConstOtros: "N",

    arqViviendas: "N", arqEdifPisosMultiples: "N", arqUrbanizacion: "N",
    arqEdifComerciales: "N", arqEdifOficinas: "N", arqEscuelas: "N",
    arqHospitales: "N", arqOtros: "N",

    actExcavacion: "N", actDemolicion: "N", actAlbanileria: "N", actHA: "N",
    actMontajesElectro: "N", actInstalaciones: "N", actEstructMetalicas: "N",
    actElectricidad: "N", actAscensores: "N", actPintura: "N",
    actMayorMilSupCubierta: "N", actSilletas: "N", actMediosIzaje: "N",
    actAltaMediaTension: "N", actOtros: "",

    operacionTipo: "A",
    confirmacionFecha: null
  };
  
  return { ...base, ...initialData };
};

