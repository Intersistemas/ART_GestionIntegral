import useSWR from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import Persona, { Parameters } from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";
import { toURLSearch } from "@/utils/utils";
import { useAuth } from '@/data/AuthContext';

const tokenizable = token.configure();

const getCurrentPeriodo = (): number => {
    return Number(dayjs().subtract(2, 'month').format('YYYYMM'));
};

export interface UsuarioGetAllParams {
  CUIT?: number;
  Sort?: string;
  Page?: string;
}

export class GestionEmpleadorAPIClass extends ExternalAPI {

  readonly basePath = process.env.NEXT_PUBLIC_API_EMPLEADOR_URL || 'http://fallback-prod.url'; 

  //#region AfiliadoCuentaCorriente
  readonly getPersonalURL = (params: Parameters = {}) => {
      
    params.CUIT ??= useAuth().user?.empresaCUIT ?? 0;
    params.periodo ??= getCurrentPeriodo();
    params.page ??= "1,1";
    return this.getURL({ path: "/api/AfiliadoCuentaCorriente/", search: toURLSearch(params) }).toString();
  };
  getPersonal = async (params: Parameters = {}) => tokenizable.get<Persona[]>(
    this.getPersonalURL(params),
  ).then(({ data }) => data);

  useGetPersonal = (params: Parameters = {}) => useSWR(
    [this.getPersonalURL(params), token.getToken()], () => this.getPersonal(params),
     {
      revalidateOnFocus: false,// No volver a revalidar al volver al foco, reconectar o al montar si ya hay cache
      revalidateOnReconnect: false,
      //revalidateOnMount: false,
      //dedupingInterval: // Tiempo en ms durante el cual SWR deduplica solicitudes iguales (evita re-fetch frecuente) 1000 * 60 * 60, // 1 hora (ajusta si hace falta)
      // Si quieres que la clave no dispare fetch hasta que exista token, puedes usar: (token.getToken() ? key : null)
    }    
  );
  //#endregion

  //#region Persona
  readonly getPolizaURL = (params: Parameters = {}) => {
    return this.getURL({ path: "/api/SRTPoliza", search: toURLSearch(params) }).toString();
  };
  getPoliza = async (params: Parameters = {}) => tokenizable.get(
    this.getPolizaURL(params),
  ).then(({ data }) => data[0]);
  useGetPoliza = (params: Parameters = {}) => useSWR(
    [this.getPolizaURL(params), token.getToken()], () => this.getPoliza(params),
     {
      revalidateOnFocus: false,// No volver a revalidar al volver al foco, reconectar o al montar si ya hay cache
      revalidateOnReconnect: false,
      //revalidateOnMount: false,
      //dedupingInterval: // Tiempo en ms durante el cual SWR deduplica solicitudes iguales (evita re-fetch frecuente) 1000 * 60 * 60, // 1 hora (ajusta si hace falta)
      // Si quieres que la clave no dispare fetch hasta que exista token, puedes usar: (token.getToken() ? key : null)
    }  
  );
  //#endregion

  //#region SiniestrosEmpleador
  readonly getVEmpleadorSiniestrosURL = (params: Parameters = {}) => {
    return this.getURL({ path: "/api/VEmpleadorSiniestros", search: toURLSearch(params) }).toString();
  };
  getVEmpleadorSiniestros = async (params: Parameters = {}) => tokenizable.get(
    this.getVEmpleadorSiniestrosURL(params),
  ).then(({ data }) => data);
  useGetVEmpleadorSiniestros = (params: Parameters = {}) => useSWR(
    [this.getVEmpleadorSiniestrosURL(params), token.getToken()], () => this.getVEmpleadorSiniestros(params) 
  );
  //#endregion

  //#region CtaCTe y DDJJ
  readonly getVEmpleadorDDJJURL = (params: Parameters = {}) => {
    params.CUIT ??= useAuth().user?.empresaCUIT ?? 0;
    return this.getURL({ path: "/api/VEmpleadorDDJJ/?Sort=-Periodo&Page=0,1000", search: toURLSearch(params) }).toString();
  };
  getVEmpleadorDDJJ = async (params: Parameters = {}) => tokenizable.get(
    this.getVEmpleadorDDJJURL(params),
  ).then(({ data }) => data);
  useGetVEmpleadorDDJJ = (params: Parameters = {}) => useSWR(
    [this.getVEmpleadorDDJJURL(params), token.getToken()], () => this.getVEmpleadorDDJJ(params),
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

  //#region SiniestrosEmpleador
  readonly getVEmpleadorSiniestrosInstanciasURL = (params: Parameters = {}) => {
    params.CUIT ??= useAuth().user?.empresaCUIT ?? 0;
    return this.getURL({ path: "/api/VEmpleadorSiniestrosInstancias", search: toURLSearch(params) }).toString();
  };
  getVEmpleadorSiniestrosInstancias = async (params: Parameters = {}) => tokenizable.get(
    this.getVEmpleadorSiniestrosInstanciasURL(params),
  ).then(({ data }) => data);
  useGetVEmpleadorSiniestrosInstancias = (params: Parameters = {}) => useSWR(
    [this.getVEmpleadorSiniestrosInstanciasURL(params), token.getToken()], () => this.getVEmpleadorSiniestrosInstancias(params),
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

  //#region AvisoObra
  readonly getAvisoObraURL = (params: UsuarioGetAllParams = {}) => {
    params.CUIT ??= useAuth().user?.empresaCUIT ?? 0;
    return this.getURL({ path: "/api/AvisoObra/ultimos/?Sort=-ObraNumero&Page=0,1000", search: toURLSearch(params) }).toString();
  };
  getAvisoObra = async (params: UsuarioGetAllParams = {}) => tokenizable.get(
    this.getAvisoObraURL(params),
  ).then(({ data }) => data);
  useGetAvisoObra = (params: UsuarioGetAllParams = {}) => useSWR(
    [this.getAvisoObraURL(params), token.getToken()], () => this.getAvisoObra(params),
      {
      // No volver a revalidar al volver al foco, reconectar o al montar si ya hay cache
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      
      }
  );
  //#endregion
  
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
