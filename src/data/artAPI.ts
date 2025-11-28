import useSWR, { Fetcher, SWRConfiguration } from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import RefEmpleador from "@/app/inicio/usuarios/interfaces/RefEmpleador";
import FormularioRAR, { ParametersFormularioRar } from "@/app/inicio/empleador/formularioRAR/types/TformularioRar";
import { useAuth } from '@/data/AuthContext';
import { toURLSearch } from "@/utils/utils";

const tokenizable = token.configure();

//#region Types
//#region Types Establecimiento
export type EstablecimientoVm = {
  interno: number;
  cuit: number;
  nroSucursal: number;
  nombre?: string;
  domicilioCalle?: string;
  domicilioNro?: string;
  superficie: number;
  cantTrabajadores: number;
  estadoAccion?: string;
  estadoFecha: number;
  estadoSituacion?: string;
  bajaMotivo: number;
  localidad?: string;
  provincia?: string;
  codigo: number;
  numero: number;
  codEstabEmpresa: number;
  ciiu: number;
}
export type EstablecimientoListParams = {
  cuit: number;
}
export type EstablecimientoListSWRKey = [url: string, token: string, params: string];
export type EstablecimientoListOptions = SWRConfiguration<EstablecimientoVm[], any, Fetcher<EstablecimientoVm[], EstablecimientoListSWRKey>>
//#endregion Types Establecimiento
//#endregion Types

export function EstablecimientoVmDescripcion(establecimiento?: EstablecimientoVm) {
  if (establecimiento == null) return "";
  const { nombre, domicilioCalle, domicilioNro, localidad, provincia } = establecimiento;
  return [
    nombre,
    [domicilioCalle, domicilioNro].filter(e => e).join(" "),
    localidad,
    provincia,
  ].filter(e => e).join(" - ");
}

export class ArtAPIClass extends ExternalAPI {
  readonly basePath = process.env.NEXT_PUBLIC_API_ART_URL || 'http://fallback-prod.url'; 

  //#region RefEmpleadores
  readonly refEmpleadoresURL = () => this.getURL({ path: "/api/Empresas" }).toString();
  getRefEmpleadores = async () => tokenizable.get<RefEmpleador[]>(
    this.refEmpleadoresURL()
  ).then(({ data }) => data);
  useGetRefEmpleadores = () => useSWR(
    [this.refEmpleadoresURL(), token.getToken()], () => this.getRefEmpleadores()
  );
  //#endregion

  //#region Establecimiento
  readonly establecimientoListURL = ({ cuit }: EstablecimientoListParams) =>
    this.getURL({ path: `/api/Establecimientos/empresa/${cuit}` }).toString();
  establecimientoList = async (params: EstablecimientoListParams) => tokenizable.get<EstablecimientoVm[]>(
    this.establecimientoListURL(params)
  ).then(({ data }) => data);
  swrEstablecimientoList: {
    key: (params: EstablecimientoListParams) => EstablecimientoListSWRKey,
    fetcher: (key: EstablecimientoListSWRKey) => Promise<EstablecimientoVm[]>
  } = Object.freeze({
    key: (params) => [this.establecimientoListURL(params), token.getToken(), JSON.stringify(params)],
    fetcher: ([_url, _token, params]) => this.establecimientoList(JSON.parse(params)),
  });
  useEstablecimientoList = (params?: EstablecimientoListParams, options?: EstablecimientoListOptions) =>
    useSWR(params ? this.swrEstablecimientoList.key(params) : null, this.swrEstablecimientoList.fetcher, options);
  //#endregion Establecimiento

  //#region FormulariosRAR
  readonly getFormulariosRARURL = (params: ParametersFormularioRar = {}) => {
    //params.CUIT ??= useAuth().user?.empresaCUIT ?? 0; este parametro lo paso desde el componente que lo usa
    return this.getURL({ path: "/api/FormulariosRAR", search: toURLSearch(params) }).toString();
  };
  getFormulariosRAR = async (params: ParametersFormularioRar = {}) => tokenizable.get(
    this.getFormulariosRARURL(params),
  ).then(({ data }) => data);
  useGetFormulariosRARURL = (params: ParametersFormularioRar = {}) => useSWR(
    [this.getFormulariosRARURL(params), token.getToken()], () => this.getFormulariosRAR(params),
     {
      // No volver a revalidar al volver al foco, reconectar o al montar si ya hay cache
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      //revalidateOnMount: false,
      //dedupingInterval: 1000 * 60 * 60, // 1 hora (ajusta si hace falta) // Tiempo en ms durante el cual SWR deduplica solicitudes iguales (evita re-fetch frecuente)
      // Si quieres que la clave no dispare fetch hasta que exista token, puedes usar: (token.getToken() ? key : null)
    }     
  );
  //#endregion
}

const ArtAPI = Object.seal(new ArtAPIClass());

export default ArtAPI;
