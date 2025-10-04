import useSWR from "swr";
import axios from "axios";
import { ExternalAPI } from "./api";
import RefEmpleador from "@/app/inicio/usuarios/interfaces/RefEmpleador";

export class ArtAPIClass extends ExternalAPI {
  readonly basePath = process.env.NEXT_PUBLIC_API_ART_URL || 'http://fallback-prod.url'; 
  //#region RefEmpleadores
  readonly refEmpleadoresPath = "/api/Empresas";
  getRefEmpleadores = async () => axios.get<RefEmpleador[]>(
    this.getURL({ path: this.refEmpleadoresPath }).toString()
  ).then(({ data }) => data);
  useGetRefEmpleadores = () => useSWR(
    [this.basePath, this.refEmpleadoresPath], () => this.getRefEmpleadores()
  );
  //#endregion
}

const ArtAPI = Object.seal(new ArtAPIClass());

export default ArtAPI;
