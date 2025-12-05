import useSWR from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import RefEmpleador from "@/app/inicio/usuarios/interfaces/RefEmpleador";
import FormularioRAR, { ParametersFormularioRar } from "@/app/inicio/empleador/formularioRAR/types/TformularioRar";
import { useAuth } from '@/data/AuthContext';
import { toURLSearch } from "@/utils/utils";

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
