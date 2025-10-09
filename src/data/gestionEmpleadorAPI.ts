import useSWR from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import Persona, { Parameters } from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";
import { toURLSearch } from "@/utils/utils";

//const getCurrentPeriodo = (): number => Number(dayjs().format('YYYYMM'));

const tokenizable = token.configure();

const getCurrentPeriodo = (): number => {
    return Number(dayjs().subtract(2, 'month').format('YYYYMM'));
};

export class GestionEmpleadorAPIClass extends ExternalAPI {
  readonly basePath = process.env.NEXT_PUBLIC_API_EMPLEADOR_URL || 'http://fallback-prod.url'; 
  //#region Persona
  readonly getPersonalURL = (params: Parameters = {}) => {
    params.periodo ??= getCurrentPeriodo();
    params.page ??= "1,1";
    return this.getURL({ path: "/api/AfiliadoCuentaCorriente/", search: toURLSearch(params) }).toString();
  };
  getPersonal = async (params: Parameters = {}) => tokenizable.get<Persona[]>(
    this.getPersonalURL(params),
  ).then(({ data }) => data);
  useGetPersonal = (params: Parameters = {}) => useSWR(
    [this.getPersonalURL(params), token.getToken()], () => this.getPersonal(params) 
  );
  //#endregion


  //#region Persona
  readonly getPolizaURL = (params: Parameters = {}) => {
    return this.getURL({ path: "/api/SRTPoliza", search: toURLSearch(params) }).toString();
  };
  getPoliza = async (params: Parameters = {}) => tokenizable.get(
    this.getPersonalURL(params),
  ).then(({ data }) => data);
  useGetPoliza = (params: Parameters = {}) => useSWR(
    [this.getPolizaURL(params), token.getToken()], () => this.getPoliza(params) 
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


    //#region SiniestrosEmpleador
  readonly getVEmpleadorSiniestrosInstanciasURL = (params: Parameters = {}) => {
    return this.getURL({ path: "/api/VEmpleadorSiniestrosInstancias", search: toURLSearch(params) }).toString();
  };
  getVEmpleadorSiniestrosInstancias = async (params: Parameters = {}) => tokenizable.get(
    this.getVEmpleadorSiniestrosInstanciasURL(params),
  ).then(({ data }) => data);
  useGetVEmpleadorSiniestrosInstancias = (params: Parameters = {}) => useSWR(
    [this.getVEmpleadorSiniestrosInstanciasURL(params), token.getToken()], () => this.getVEmpleadorSiniestrosInstancias(params)
  );
  //#endregion

  
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
