import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI } from "./api";
import UsuarioRow from "@/app/inicio/usuarios/interfaces/UsuarioRow";
import TokenConfigurator from "@/types/TokenConfigurator";
import { toURLSearch } from "@/utils/utils";

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
export type TablasSWRKey = [url: string, token: string];
//#endregion /api/Tablas types
//#region /api/Tablas/Usuario/{usuarioId}
export type TablasUsuarioParams = { usuarioId: string };
export type TablasUsuarioSWRKey = [url: string, token: string, params: string];
//#endregion /api/Tablas/Usuario/{usuarioId}
//#endregion Types

//#region token
export const token = Object.seal(new TokenConfigurator());
//#endregion token

const tokenizable = token.configure();

export class UsuarioAPIClass extends ExternalAPI {

  readonly basePath = process.env.NEXT_PUBLIC_API_SEGURIDAD_URL || 'http://fallback-prod.url'; 
  //#region login
  readonly loginURL = () => this.getURL({ path: "/api/Usuario/Login" }).toString();
  login = async (login: LoginCommand) => axios.post<UsuarioVm>(
    this.loginURL(), login
  ).then(
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
  useLogin = (login: LoginCommand) => useSWR(
    [this.loginURL()], () => this.login(login)
  );
  //#endregion login
  //#region getAll
  readonly getAllURL = (params: UsuarioGetAllParams = {}) =>
    this.getURL({ path: "/api/Usuario/GetAll", search: toURLSearch(params) }).toString();
  getAll = async (params: UsuarioGetAllParams = {}) => tokenizable.get<UsuarioGetAllResult>(
    this.getAllURL(params)
  ).then(async (response) => {
    if (response.status === 200) return response.data;
    return Promise.reject(
      new AxiosError(`Error en la petición: ${response.data}`)
    );
  });
  useGetAll = (params: UsuarioGetAllParams = {}) => useSWR(
    [this.getAllURL(params), token.getToken()], () => this.getAll(params)
  );
  //#endregion getAll
  //#region getRoles
  readonly getRolesURL = () => this.getURL({ path: "/api/Roles" }).toString();
  getRoles = async (query: any = {}) => tokenizable.get<RolesInterface[]>(
    this.getRolesURL(), { data: query }
  ).then(async (response) => {
    if (response.status === 200) return response.data;
    return Promise.reject(
      new AxiosError(`Error en la petición: ${response.data}`)
    );
  });
  useGetRoles = (query: any = {}) => useSWR(
    [this.getRolesURL(), token.getToken()], () => this.getRoles(query)
  );
  //#endregion getRoles
  //#region registrar
  readonly registrarURL = () => this.getURL({ path: "/api/Usuario/Registrar" }).toString();
  registrar = async (data: any) => axios.post(
    this.registrarURL(), data
  ).then(async (response) => {
    if (response.status === 200) return response.data;
    return Promise.reject(
      new AxiosError(`Error en la petición: ${response.data}`)
    );
  });
  useRegistrar = (data: any) => useSWR(
    [this.registrarURL()], () => this.registrar(data)
  );
  //#endregion registrar
  //#region tablas
  readonly tablasURL = this.getURL({ path: "/api/Tablas" }).toString();
  tablas = async () => tokenizable.get<Tabla[]>(
    this.tablasURL
  ).then(({ data }) => data);
  swrTablas = Object.freeze({
    Key: [this.tablasURL, token.getToken()],
    Fetcher: this.tablas,
  });
  useTablas = () => useSWR(this.swrTablas.Key, this.swrTablas.Fetcher);
  //#endregion tablas
  //#region tablasUsuario
  readonly tablasUsuarioURL = ({ usuarioId }: TablasUsuarioParams) =>
    this.getURL({ path: `/api/Tablas/Usuario/${usuarioId}` }).toString();
  tablasUsuario = async (params: TablasUsuarioParams) => tokenizable.get<Tabla[]>(
    this.tablasUsuarioURL(params)
  ).then(({ data }) => data);
  swrTablasUsuario = Object.freeze({
    Key: (params: TablasUsuarioParams): TablasUsuarioSWRKey => [this.tablasUsuarioURL(params), token.getToken(), JSON.stringify(params)],
    Fetcher: (key: TablasUsuarioSWRKey) => this.tablasUsuario(JSON.parse(key[2])),
  });
  useTablasUsuario = (params: TablasUsuarioParams) => useSWR(this.swrTablasUsuario.Key(params), this.swrTablasUsuario.Fetcher);
  //#endregion tablasUsuario
  //#region actualizarTareas
  readonly tareasUpdateURL = (usuarioId: string) => this.getURL({ path: `/api/Usuario/Tareas/${usuarioId}` }).toString();
  tareasUpdate = async (
    usuarioId: string,
    data: Array<{ tareaId: number; habilitada: boolean }>
  ) => tokenizable.put(
    this.tareasUpdateURL(usuarioId),
    data, // Solo los datos van en el body
  ).then(async (response) => {
    if (response.status === 200) return response.data;
    return Promise.reject(new AxiosError(`Error en la petición: ${response.data}`));
  });
  useTareasUpdate = (usuarioId: string, data: Array<{ tareaId: number; habilitada: boolean }>) => useSWR(
    [this.tareasUpdateURL(usuarioId), token.getToken(), JSON.stringify(data)],
    () => this.tareasUpdate(usuarioId, data)
  );
  //#endregion actualizarTareas
}

const UsuarioAPI = Object.seal(new UsuarioAPIClass());

export default UsuarioAPI;