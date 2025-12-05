import useSWR from "swr";
import { ExternalAPI, ExternalAPIGetURLParams } from "./api";
import { token } from "./usuarioAPI";
import RefEmpleador from "@/app/inicio/usuarios/interfaces/RefEmpleador";
import FormularioRAR, { ParametersFormularioRar } from "@/app/inicio/empleador/formularioRAR/types/TformularioRar";
import { useAuth } from '@/data/AuthContext';
import { toURLSearch } from "@/utils/utils";
import type { ApiFormularioRGRL, ApiEstablecimientoEmpresa } from "@/app/inicio/empleador/formularioRGRL/types/rgrl";

const tokenizable = token.configure();

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

  //#region Establecimientos
  readonly getEstablecimientosURL = (params: { CUIT?: number | string } = {}) => {
    // params.CUIT ??= useAuth().user?.empresaCUIT ?? 0; // se pasa desde el componente
    const cuit = params.CUIT ?? 0;
    return this.getURL({ path: `/api/Establecimientos/Empresa/${cuit}` }).toString();
  };
  getEstablecimientos = async (params: { CUIT?: number | string } = {}) => tokenizable.get(
    this.getEstablecimientosURL(params),
  ).then(({ data }) => data);
  useGetEstablecimientos = (params: { CUIT?: number | string } = {}) => useSWR(
    [this.getEstablecimientosURL(params), token.getToken()], () => this.getEstablecimientos(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  


    readonly getEstablecimientoByIdURL = (id: number) => {
    return this.getURL({ path: `/api/Establecimientos/${id}` }).toString();
  };
  getEstablecimientoById = async (id: number) => tokenizable.get(
    this.getEstablecimientoByIdURL(id),
  ).then(({ data }) => data);
  useGetEstablecimientoById = (id?: number) => useSWR(
    id && token.getToken() ? [this.getEstablecimientoByIdURL(id), token.getToken()] : null, () => this.getEstablecimientoById(id as number),
     {

      revalidateOnFocus: false,
      revalidateOnReconnect: false,

    }     
  );


  



  //#endregion

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

 //  Formulario RAR por interno (/api/FormulariosRAR/{id})
 readonly getFormularioRARByIdURL = (id: number) => this.getURL({ path: `/api/FormulariosRAR/${id}` }).toString();
 getFormularioRARById = async (id: number) => tokenizable.get(
   this.getFormularioRARByIdURL(id),
 ).then(({ data }) => data);
 useGetFormularioRARById = (id?: number) => useSWR(
   id && token.getToken() ? [this.getFormularioRARByIdURL(id), token.getToken()] : null,
   () => this.getFormularioRARById(id as number),
   {
     revalidateOnFocus: false,
     revalidateOnReconnect: false,
   }
 );
  //#endregion

  //#region FormulariosRGRL
  getFormulariosRGRL = async (cuit: number, all: boolean = false): Promise<ApiFormularioRGRL[]> => {
    const search: Record<string, string | number> = { CUIT: String(cuit) };
    if (all) search.pageSize = 99999;
    const url = this.getURL({
      path: "/api/FormulariosRGRL",
      search: toURLSearch(search),
    });
    const res = await fetch(url.toString(), { cache: "no-store", headers: { Accept: "application/json" } });
    if (res.status === 404) return [];
    if (!res.ok) {
      const raw = await res.text().catch(() => "");
      throw new Error(`GET ${url} -> ${res.status} ${raw}`);
    }
    const body = await res.json().catch(() => null);
    const arr = Array.isArray(body?.DATA)
      ? body.DATA
      : Array.isArray(body?.data)
        ? body.data
        : Array.isArray(body)
          ? body
          : [];
    return arr as ApiFormularioRGRL[];
  };
  getEstablecimientosEmpresa = async (cuit: number): Promise<ApiEstablecimientoEmpresa[]> => {
    const url = this.getURL({
      path: `/api/Establecimientos/Empresa/${encodeURIComponent(cuit)}`,
    });
    const res = await fetch(url.toString(), { cache: "no-store", headers: { Accept: "application/json" } });
    if (res.status === 404) return [];
    if (!res.ok) {
      const raw = await res.text().catch(() => "");
      throw new Error(`GET ${url} -> ${res.status} ${raw}`);
    }
    return (await res.json()) as ApiEstablecimientoEmpresa[];
  };
  //#endregion
    //#region Empresas por CUIT
  readonly getEmpresaByCUITURL = (params: { CUIT?: number | string } = {}) => {
    return this.getURL({ path: "/api/Empresas/CUIT", search: toURLSearch(params) }).toString();
  };

  getEmpresaByCUIT = async (params: { CUIT?: number | string } = {}) =>
    tokenizable.get(this.getEmpresaByCUITURL(params))
      .then(({ data }) => data);

  useGetEmpresaByCUIT = (params: { CUIT?: number | string } = {}) => useSWR(
    [this.getEmpresaByCUITURL(params), token.getToken()],
    () => this.getEmpresaByCUIT(params),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  //#endregion


}

const ArtAPI = Object.seal(new ArtAPIClass());

export default ArtAPI;

export const formatEstablecimientoLabel = (est?: Partial<ApiEstablecimientoEmpresa> | null): string => {
  if (!est) return "";
  const nroSucursal =
    (est as any).nroSucursal ?? (est as any).NroSucursal ?? (est as any).nroSucursalEmpresa ?? (est as any).sucursal ?? "";
  const domicilioCalle =
    (est as any).domicilioCalle ?? (est as any).domicilio ?? (est as any).calle ?? (est as any).direccion ?? "";
  const domicilioNro =
    (est as any).domicilioNro ?? (est as any).domicilioNroEmpresa ?? (est as any).domicilioNroString ?? (est as any).domicilioNroStr ?? (est as any).domicilioNumero ?? "";

  const domicilio = `${String(domicilioCalle || "").trim()} ${String(domicilioNro || "").trim()}`.trim();

  const parts: string[] = [];
  parts.push(String(nroSucursal));
  parts.push(domicilio);

  const filled = parts.map(p => (p && p !== "undefined" && p !== "null" ? p : "")).filter(p => p && p.trim().length > 0);
  if (filled.length === 0) return "";
  return `Sucursal: ${filled.join(" - ")}`;
};
