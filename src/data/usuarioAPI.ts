import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI, ExternalAPIGetURLParams } from "./api";
import { getSession } from "next-auth/react";
import UsuarioRow from "@/app/inicio/usuarios/interfaces/UsuarioRow";
import { env } from "process";

//#region Types
export interface Auditable {
  createdDate?: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  deletedDate?: string;
  deletedBy?: string;
  deletedObs?: string;
  guid?: string;
}

//#region /api/Usuario/Login types
export interface LoginCommand {
  usuario?: string;
  password?: string;
}
export interface TokenDTO {
  tokenId?: string;
  validTo: string;
}
export interface UsuarioTareaVm extends Auditable {
  id: number;
  usuarioId?: string;
  tareaId: number;
  rolId?: string;
  rolNombre?: string;
  denegado: boolean;
};
export interface UsuarioExclusionVm {
  id: number;
  createdDate?: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  deletedDate?: string;
  deletedBy?: string;
  deletedObs?: string;
  guid?: string;
  tablaId: number;
  tablaDescripcion?: string;
  campoId: number;
  campoDescripcion?: string;
};
export interface UsuarioVm {
  id?: string;
  cuit: number;
  nombre?: string;
  tipo?: string;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  token: TokenDTO;
  rol?: string;
  empresaId?: number;
  tareas?: Array<UsuarioTareaVm | string>;  //ToDo: verificar el tipo de arreglo
  exclusiones?: UsuarioExclusionVm[];
};
export type Usuario = Omit<UsuarioVm, "token">;
//#endregion /api/Usuario/Login types
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
//#region /api/Tablas types
export interface Campo extends Auditable {
  id: number;
  nombre?: string;
  descripcion?: string;
}
export interface Tabla extends Auditable {
  id: number;
  nombre?: string;
  descripcion?: string;
  campos?: Campo[];
}
//#endregion /api/Tablas types
//#endregion Types

export class UsuarioAPIClass extends ExternalAPI {
  readonly basePath =
    process.env.NODE_ENV === "development"
      ? "http://localhost:7166"
      : "http://arttest.intersistemas.ar:8301"; ///ToDo: debo agregarlo al env.
  //#region login
  readonly loginPath = "/api/Usuario/Login";
  login = async (login: LoginCommand) =>
    axios
      .post<UsuarioVm>(this.getURL({ path: this.loginPath }).toString(), login)
      .then(
        ({ data }) => data,
        (error) => {
          if (axios.isAxiosError(error)) {
            console.error(
              "Authentication failed:",
              error.response?.data || error.message
            );
          } else if (error instanceof Error) {
            console.error("An unexpected error occurred:", error.message);
          } else {
            console.error("An unexpected error occurred:", error);
          }
          return null;
        }
      );
  useLogin = (login: LoginCommand) =>
    useSWR([this.basePath, this.loginPath, JSON.stringify(login)], () =>
      this.login(login)
    );
  //#endregion login
  //#region getAll
  readonly getAllPath = "/api/Usuario/GetAll";
  getAll = async ({
    empresaId,
    sort,
    pageIndex,
    pageSize,
  }: UsuarioGetAllParams = {}) => {
    const getURL: ExternalAPIGetURLParams = { path: this.getAllPath };
    const search: Record<string, string> = {};
    if (empresaId !== undefined) setSearch({ empresaId });
    if (sort !== undefined) setSearch({ sort });
    if (pageIndex !== undefined) setSearch({ pageIndex });
    if (pageSize !== undefined) setSearch({ pageSize });
    return axios
      .get<UsuarioGetAllResult>(this.getURL(getURL).toString())
      .then(async (response) => {
        if (response.status === 200) return response.data;
        return Promise.reject(
          new AxiosError(`Error en la petición: ${response.data}`)
        );
      });
    function setSearch(props: Record<string, any>) {
      getURL.search ??= search;
      Object.entries(props).forEach(([k, v]) => (search[k] = `${v}`));
    }
  };
  useGetAll = (params: UsuarioGetAllParams = {}) =>
    useSWR([this.basePath, this.getAllPath, JSON.stringify(params)], () =>
      this.getAll(params)
    );
  //#endregion getAll
  //#region getRoles
  readonly getRolesPath = "/api/Roles";
  getRoles = async (query: any = {}) =>
    axios
      .get<RolesInterface[]>(
        this.getURL({ path: this.getRolesPath }).toString(),
        { data: query }
      )
      .then(async (response) => {
        if (response.status === 200) return response.data;
        return Promise.reject(
          new AxiosError(`Error en la petición: ${response.data}`)
        );
      });
  useGetRoles = (query: any = {}) =>
    useSWR([this.basePath, this.getRolesPath, JSON.stringify(query)], () =>
      this.getRoles(query)
    );
  //#endregion getRoles
  //#region registrar
  readonly registrarPath = "/api/Usuario/Registrar";
  registrar = async (data: any) =>
    axios
      .post(this.getURL({ path: this.registrarPath }).toString(), data)
      .then(async (response) => {
        if (response.status === 200) return response.data;
        return Promise.reject(
          new AxiosError(`Error en la petición: ${response.data}`)
        );
      });
  useRegistrar = (data: any) =>
    useSWR([this.basePath, this.registrarPath, JSON.stringify(data)], () =>
      this.registrar(data)
    );
  //#endregion registrar
  //#region tablas
  readonly tablasPath = "/api/Tablas";
  private tablasToken = "";
  tablas = async () => {
    const token = (await getSession())?.accessToken ?? "";
    if (token !== this.tablasToken) this.tablasToken = token;
    return axios
      .get<Tabla[]>(this.getURL({ path: this.tablasPath }).toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => data);
  };
  useTablas = () =>
    useSWR([this.basePath, this.tablasPath, this.tablasToken], () =>
      this.tablas()
    );
  //#endregion tablas

  //#region actualizarTareas
  readonly tareasUpdatePath = "/api/Usuario/Tareas";
  tareasUpdate = async (
    usuarioId: string,
    data: Array<{ tareaId: number; habilitada: boolean }>
  ) => {
    const token = (await getSession())?.accessToken ?? "";
    const fullPath = `${this.tareasUpdatePath}/${usuarioId}`;
    
    return axios
      .put(
        this.getURL({ path: fullPath }).toString(),
        data, // Solo los datos van en el body
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(async (response) => {
        if (response.status === 200) return response.data;
        return Promise.reject(
          new AxiosError(`Error en la petición: ${response.data}`)
        );
      });
  };

  useTareasUpdate = (usuarioId:string, data: any) =>
    useSWR([this.basePath, this.tareasUpdatePath, usuarioId, JSON.stringify(data)], () =>
      this.tareasUpdate(usuarioId, data)
    );
  //#endregion actualizarTareas
}

const UsuarioAPI = Object.seal(new UsuarioAPIClass());

export default UsuarioAPI;