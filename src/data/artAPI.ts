import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI } from "./api";
import RefEmpleador from "@/app/inicio/usuarios/interfaces/RefEmpleador";

export class ArtAPIClass extends ExternalAPI {
  basePath = "http://arttest.intersistemas.ar:8302"; ///ToDo: debo agregarlo al env.

  //#region RefEmpleadores
  private refEmpleadoresBase = this.getURL({ path: "/api/Empresas" }).toString();
  getRefEmpleadores = async () =>
    axios
      .get<RefEmpleador[]>(
        this.refEmpleadoresBase
      )
      .then(({ data }) => data);

  useGetRefEmpleadores = () => {
    return useSWR({ path: this.refEmpleadoresBase }, () => this.getRefEmpleadores());
  };  

  //#endregion
}

const ArtAPI = Object.seal(new ArtAPIClass());

export default ArtAPI;
