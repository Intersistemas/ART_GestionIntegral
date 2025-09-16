import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI, ExternalAPIGetURLParams } from "./api";

//#region Types
export interface UsuarioRow {
  id: number;
  cuit: string;
  nombre: string;
  tipo: string;
  userName: string;
  email: string;
  emailConfirmed: boolean;
  phoneNumber: string;
  phoneNumberConfirmed: boolean;
  // Add other fields if needed
}
//#region /api/Usuario/GetAll types
export interface UsuarioGetAllParams {
  empresaId?: number;
  sort?: string;
  pageIndex?: number;
  pageSize?: number;
}
export interface UsuarioGetAllResult {
  data: UsuarioRow[];
}
//#endregion /api/Usuario/GetAll types
//#region /api/Roles types
export interface RolesInterface {
  id: string;
  nombre: string;
  nombreNormalizado: string
}
//#endregion /api/Roles types
//#endregion Types

export class UsuarioAPIClass extends ExternalAPI {
  basePath = "http://arttest.intersistemas.ar:8301"; ///ToDo: debo agregarlo al env.
  //#region getAll
  getAll = async ({ empresaId, sort, pageIndex, pageSize }: UsuarioGetAllParams = {}) => {
    const getURL: ExternalAPIGetURLParams = { path: "/api/Usuario/GetAll" };
    const search: Record<string, string> = {};
    if (empresaId !== undefined) setSearch({ empresaId });
    if (sort !== undefined) setSearch({ sort });
    if (pageIndex !== undefined) setSearch({ pageIndex });
    if (pageSize !== undefined) setSearch({ pageSize });
    return axios.get<UsuarioGetAllResult>(
      this.getURL(getURL).toString()
    ).then(
      async (response) => {
        if (response.status === 200) return response.data;
        return Promise.reject(new AxiosError(`Error en la petición: ${response.data}`));
      }
    );
    function setSearch(props: Record<string, any>) {
      getURL.search ??= search;
      Object.entries(props).forEach(([k, v]) => search[k] = `${v}`);
    }
  }
  useGetAll = (params: UsuarioGetAllParams = {}) => useSWR(params, () => this.getAll(params));
  //#endregion getAll
  //#region getRoles
  getRoles = async (query: any = {}) => axios.get<RolesInterface[]>
  (
    this.getURL({ path: "/api/Roles" }).toString(),
    { data: query }
  ).then(
    async (response) => {
      if (response.status === 200) return response.data;
      return Promise.reject(new AxiosError(`Error en la petición: ${response.data}`));
    }
  );
  useGetRoles = (query: any = {}) => useSWR(query, () => this.getRoles(query));
  //#endregion getRoles
  //#region registrar
  registrar = async (data: any) => axios.post
  (
    this.getURL({ path: "/api/Usuario/Registrar" }).toString(),
    data
  ).then(
    async (response) => {
      if (response.status === 200) return response.data;
      return Promise.reject(new AxiosError(`Error en la petición: ${response.data}`));
    }
  );
  useRegistrar = (data: any) => useSWR(data, () => this.registrar(data));
  //#endregion registrar
}

const UsuarioAPI = Object.seal(new UsuarioAPIClass());

export default UsuarioAPI;