import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI, ExternalAPIGetURLParams } from "./api";
import RefEmpleador from "@/app/dashboard/usuarios/interfaces/RefEmpleador";
import UsuarioRow from "@/app/dashboard/usuarios/interfaces/UsuarioRow";

//#region Types
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
  nombreNormalizado: string;
}
//#endregion /api/Roles types
//#endregion Types

export class ArtAPIClass extends ExternalAPI {
  basePath = "http://localhost:5005"; ///ToDo: debo agregarlo al env.  

  //#region RefEmpleadores
  getRefEmpleadores = async (query: any = {}) =>
    axios
      .get<RefEmpleador[]>(
        this.getURL({ path: "/api/RefEmpleadores" }).toString(),
        {
          data: query,
        }
      )
      .then(async (response) => {
        console.log("getRefEmpleadores response:", response);
        if (response.status === 200) return response.data;
        return Promise.reject(
          new AxiosError(`Error en la petición: ${response.data}`)
        );
      });
  useGetRefEmpleadores = (query: any = {}) =>
    useSWR(query, () => this.getRefEmpleadores(query));
  //#endregion
}

const ArtAPI = Object.seal(new ArtAPIClass());

export default ArtAPI;
