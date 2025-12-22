import useSWR, { Fetcher, SWRConfiguration } from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import { toURLSearch } from "@/utils/utils";
import { AxiosError } from "axios";

const tokenizable = token.configure();

//#region Types

//#region Types Validaciones
export type CotizacionesDTO = {
  idCotizacion: number;
  cuit: number;
  artSellosIIBBInterno: number;
  ciiu1: number;
  ciiu2: number;
  ciiu3: number;
  trabajadoresDeclarados: number;
  masaSalarial: number;
  estado: string;
  alicuotaFinal: number;
  alicuotaFinalEstadisticas: number;
  ciiuManual?: string | null;
  ciiuCotizacion: number;
};

export type EmpleadoresPadronDTO = {
  idEmpleadorPadron: number;
  cuit: number;
  denominacion: string;
  localidad: string;
  codigoPostal: number;
  provincia: string;
  ciiuPrincipal: number;
  ciiuSecundario1: number;
  ciiuSecundario2: number;
  aseguradora: string;
  numeroContrato: number;
  principioVigencia: string;
  origenContrato: string;
  fechaRescicion: string;
  tipoRescicion: string;
  ciiu: number;
  nivel: number;
  promedioTrabajadores: number;
  artSellosIIBBInterno: number;
  alicuota: number;
  juicios: number;
  muertes: number;
  ipt: number;
  conIncapacidad: number;
  cotizaciones: CotizacionesDTO;
  idEmpleadoresPESE: number;
};

export type ValidacionesDTO = {
  cuit: number;
  estado: string;
  observaciones: string;
  empleadoresPadron?: EmpleadoresPadronDTO | null;
};

export type ValidacionesParams = {
  CUIT: number;
};

export type ValidacionesSWRKey = [url: string, token: string, params: string];
export type ValidacionesOptions = SWRConfiguration<ValidacionesDTO, AxiosError, Fetcher<ValidacionesDTO, ValidacionesSWRKey>>;
//#endregion Types Validaciones

//#region Types EmpleadoresPESE
export type EmpleadoresPESEDTO = {
  idEmpleadorPESE: number;
  cuit: number;
  denominacion: string;
  domicilio: string;
  provincia: string;
  afiliacionVigente: string;
};

export type EmpleadoresPESEParams = {
  CUIT: number;
};

export type EmpleadoresPESESWRKey = [url: string, token: string, params: string];
export type EmpleadoresPESEOptions = SWRConfiguration<EmpleadoresPESEDTO[], AxiosError, Fetcher<EmpleadoresPESEDTO[], EmpleadoresPESESWRKey>>;
//#endregion Types EmpleadoresPESE

//#region Types EmpleadoresSiniestros
export type EmpleadoresSiniestrosDTO = {
  idEmpleadorSiniestro: number;
  cuit: number;
  indiceSiniestralidad: number;
};

export type EmpleadoresSiniestrosParams = {
  CUIT: number;
};

export type EmpleadoresSiniestrosSWRKey = [url: string, token: string, params: string];
export type EmpleadoresSiniestrosOptions = SWRConfiguration<EmpleadoresSiniestrosDTO[], AxiosError, Fetcher<EmpleadoresSiniestrosDTO[], EmpleadoresSiniestrosSWRKey>>;
//#endregion Types EmpleadoresSiniestros

//#region Types CIIUIndices
export type CIIUIndicesDTO = {
  ciiu: number;
  descripcion: string;
  trabajadoresCubiertos: number;
  totalCasosNotificados: number;
  casosDiasBaja: number;
  trabajadoresFallecidos: number;
  indiceIncidencia: number;
  indiceIncidenciaFallecidos: number;
  utilizadoPorArt: boolean;
  altaSiniestralidad: boolean;
};

export type CIIUIndicesParams = {
  CUIT: number;
};

export type CIIUIndicesSWRKey = [url: string, token: string, params: string];
export type CIIUIndicesOptions = SWRConfiguration<CIIUIndicesDTO[], AxiosError, Fetcher<CIIUIndicesDTO[], CIIUIndicesSWRKey>>;
//#endregion Types CIIUIndices

//#region Types ARTSellosIIBB
export type ARTSellosIIBBDTO = {
  interno: number;
  jurisdiccion: number;
  provincia: string;
  alicuota: number;
  iibb: number;
};

export type ARTSellosIIBBParams = {
  CUIT: number;
};

export type ARTSellosIIBBSWRKey = [url: string, token: string, params: string];
export type ARTSellosIIBBOptions = SWRConfiguration<ARTSellosIIBBDTO[], AxiosError, Fetcher<ARTSellosIIBBDTO[], ARTSellosIIBBSWRKey>>;
//#endregion Types ARTSellosIIBB

//#region Types CotizacionGenerar
export type DatosContactoDTO = {
  nombre: string;
  tipoTelefono: string;
  numeroTelefono: string;
  email: string;
};

export type CotizacionGenerarDTO = {
  cuit: number;
  artSellosIIBBInterno: number;
  ciiu1: number;
  ciiu2: number;
  ciiu3: number;
  trabajadoresDeclarados: number;
  masaSalarial: number;
  alicuotaActual: number;
  alicuotaIngresada: number;
  fechaResicicion?: string | null;
  estado: number;
  datosContacto: DatosContactoDTO;
  ciiuManual?: string | null;
  ciiuCotizacion: number;
};
//#endregion Types CotizacionGenerar

//#endregion Types

export class CotizadorAPIClass extends ExternalAPI {
  readonly basePath = process.env.NEXT_PUBLIC_API_COTIZADOR_URL || 'http://arttest.intersistemas.ar:8686';

  //#region Validaciones
  readonly validarCuitURL = (params: ValidacionesParams) => {
    return this.getURL({ 
      path: "/api/Validaciones/ValidarCuit", 
      search: toURLSearch(params) 
    }).toString();
  };

  validarCuit = async (params: ValidacionesParams) => 
    tokenizable.get<ValidacionesDTO>(
      this.validarCuitURL(params)
    ).then(({ data }) => data);

  swrValidarCuit = Object.freeze({
    key: (params: ValidacionesParams): ValidacionesSWRKey => [
      this.validarCuitURL(params), 
      token.getToken(), 
      JSON.stringify(params)
    ],
    fetcher: (key: ValidacionesSWRKey) => this.validarCuit(JSON.parse(key[2])),
  });

  useValidarCuit = (params?: ValidacionesParams, options?: ValidacionesOptions) =>
    useSWR<ValidacionesDTO, AxiosError>(
      params ? this.swrValidarCuit.key(params) : null,
      this.swrValidarCuit.fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  //#endregion Validaciones

  //#region EmpleadoresPESE
  readonly getEmpleadoresPESEURL = (params: EmpleadoresPESEParams) => {
    return this.getURL({ 
      path: "/api/EmpleadoresPESE", 
      search: toURLSearch(params) 
    }).toString();
  };

  getEmpleadoresPESE = async (params: EmpleadoresPESEParams) => 
    tokenizable.get<EmpleadoresPESEDTO[]>(
      this.getEmpleadoresPESEURL(params)
    ).then(({ data }) => data);

  swrEmpleadoresPESE = Object.freeze({
    key: (params: EmpleadoresPESEParams): EmpleadoresPESESWRKey => [
      this.getEmpleadoresPESEURL(params), 
      token.getToken(), 
      JSON.stringify(params)
    ],
    fetcher: (key: EmpleadoresPESESWRKey) => this.getEmpleadoresPESE(JSON.parse(key[2])),
  });

  useGetEmpleadoresPESE = (params?: EmpleadoresPESEParams, options?: EmpleadoresPESEOptions) =>
    useSWR<EmpleadoresPESEDTO[], AxiosError>(
      params ? this.swrEmpleadoresPESE.key(params) : null,
      this.swrEmpleadoresPESE.fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  //#endregion EmpleadoresPESE

  //#region EmpleadoresSiniestros
  readonly getEmpleadoresSiniestrosURL = (params: EmpleadoresSiniestrosParams) => {
    return this.getURL({ 
      path: "/api/EmpleadoresSiniestros", 
      search: toURLSearch(params) 
    }).toString();
  };

  getEmpleadoresSiniestros = async (params: EmpleadoresSiniestrosParams) => 
    tokenizable.get<EmpleadoresSiniestrosDTO[]>(
      this.getEmpleadoresSiniestrosURL(params)
    ).then(({ data }) => data);

  swrEmpleadoresSiniestros = Object.freeze({
    key: (params: EmpleadoresSiniestrosParams): EmpleadoresSiniestrosSWRKey => [
      this.getEmpleadoresSiniestrosURL(params), 
      token.getToken(), 
      JSON.stringify(params)
    ],
    fetcher: (key: EmpleadoresSiniestrosSWRKey) => this.getEmpleadoresSiniestros(JSON.parse(key[2])),
  });

  useGetEmpleadoresSiniestros = (params?: EmpleadoresSiniestrosParams, options?: EmpleadoresSiniestrosOptions) =>
    useSWR<EmpleadoresSiniestrosDTO[], AxiosError>(
      params ? this.swrEmpleadoresSiniestros.key(params) : null,
      this.swrEmpleadoresSiniestros.fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  //#endregion EmpleadoresSiniestros

  //#region CIIUIndices
  readonly getCIIUIndicesURL = (params: CIIUIndicesParams) => {
    return this.getURL({ 
      path: "/api/CIIUIndices", 
      search: toURLSearch(params) 
    }).toString();
  };

  getCIIUIndices = async (params: CIIUIndicesParams) => 
    tokenizable.get<CIIUIndicesDTO[]>(
      this.getCIIUIndicesURL(params)
    ).then(({ data }) => data);

  swrCIIUIndices = Object.freeze({
    key: (params: CIIUIndicesParams): CIIUIndicesSWRKey => [
      this.getCIIUIndicesURL(params), 
      token.getToken(), 
      JSON.stringify(params)
    ],
    fetcher: (key: CIIUIndicesSWRKey) => this.getCIIUIndices(JSON.parse(key[2])),
  });

  useGetCIIUIndices = (params?: CIIUIndicesParams, options?: CIIUIndicesOptions) =>
    useSWR<CIIUIndicesDTO[], AxiosError>(
      params ? this.swrCIIUIndices.key(params) : null,
      this.swrCIIUIndices.fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  //#endregion CIIUIndices

  //#region ARTSellosIIBB
  readonly getARTSellosIIBBURL = (params: ARTSellosIIBBParams) => {
    return this.getURL({ 
      path: "/api/ARTSellosIIBB", 
      search: toURLSearch(params) 
    }).toString();
  };

  getARTSellosIIBB = async (params: ARTSellosIIBBParams) => 
    tokenizable.get<ARTSellosIIBBDTO[]>(
      this.getARTSellosIIBBURL(params)
    ).then(({ data }) => data);

  swrARTSellosIIBB = Object.freeze({
    key: (params: ARTSellosIIBBParams): ARTSellosIIBBSWRKey => [
      this.getARTSellosIIBBURL(params), 
      token.getToken(), 
      JSON.stringify(params)
    ],
    fetcher: (key: ARTSellosIIBBSWRKey) => this.getARTSellosIIBB(JSON.parse(key[2])),
  });

  useGetARTSellosIIBB = (params?: ARTSellosIIBBParams, options?: ARTSellosIIBBOptions) =>
    useSWR<ARTSellosIIBBDTO[], AxiosError>(
      params ? this.swrARTSellosIIBB.key(params) : null,
      this.swrARTSellosIIBB.fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        ...options,
      }
    );
  //#endregion ARTSellosIIBB

  //#region Cotizaciones
  readonly generarCotizacionURL = () => {
    return this.getURL({ 
      path: "/api/Cotizaciones/Generar"
    }).toString();
  };

  generarCotizacion = async (data: CotizacionGenerarDTO) => 
    tokenizable.post<CotizacionesDTO>(
      this.generarCotizacionURL(),
      data
    ).then(({ data }) => data);
  //#endregion Cotizaciones
}

const cotizadorAPI = Object.seal(new CotizadorAPIClass());

export default cotizadorAPI;

