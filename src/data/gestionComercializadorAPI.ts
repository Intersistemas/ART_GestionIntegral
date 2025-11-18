import useSWR from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import dayjs from "dayjs";
import { toURLSearch } from "@/utils/utils";
import { useAuth } from '@/data/AuthContext';

const tokenizable = token.configure();


export type Parameters = {
  CUIL?: number;
  periodo?: number;
  page?: string;
  sort?: string;
};

export class GestionComercializadorAPIClass extends ExternalAPI {

  readonly basePath = process.env.NEXT_PUBLIC_API_COMERCIALIZADOR_URL || 'http://fallback-prod.url'; 

  //#region VComercializadorCuentaCorriente
  readonly getViewCtaCteURL = (params: Parameters = {}) => {
    return this.getURL({ path: "/api/VComercializadorCuentaCorriente/resumen/", search: toURLSearch(params) }).toString();
  };
  getViewCtaCte = async (params: Parameters = {}) => tokenizable.get(
    this.getViewCtaCteURL(params),
  ).then(({ data }) => data);

  useGetViewCtaCte = (params: Parameters = {}) => useSWR(
    [this.getViewCtaCteURL(params), token.getToken()], () => this.getViewCtaCte(params),
     {
      revalidateOnFocus: false,// No volver a revalidar al volver al foco, reconectar o al montar si ya hay cache
      revalidateOnReconnect: false,
    }    
  );
  //#endregion

    //#region VComercializadorCuentaCorriente Detalle
  readonly getViewCtaCteDetalleURL = (params: Parameters = {}) => {
    return this.getURL({ path: "/api/VComercializadorCuentaCorriente/", search: toURLSearch(params) }).toString();
  };
  getViewCtaCteDetalle = async (params: Parameters = {}) => tokenizable.get(
    this.getViewCtaCteDetalleURL(params),
  ).then(({ data }) => data);

  useGetViewCtaCteDetalle = (params: Parameters = {}) => useSWR(
    [this.getViewCtaCteDetalleURL(params), token.getToken()], () => this.getViewCtaCteDetalle(params),
     {
      revalidateOnFocus: false,// No volver a revalidar al volver al foco, reconectar o al montar si ya hay cache
      revalidateOnReconnect: false,
    }    
  );
  //#endregion
  
}

const gestionComercializadorAPI = Object.seal(new GestionComercializadorAPIClass());

export default gestionComercializadorAPI;
