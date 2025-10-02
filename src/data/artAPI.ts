import useSWR from "swr";
import axios from "axios";
import { ExternalAPI } from "./api";
import RefEmpleador from "@/app/inicio/usuarios/interfaces/RefEmpleador";

export class ArtAPIClass extends ExternalAPI {
  readonly basePath = "http://arttest.intersistemas.ar:8302"; ///ToDo: debo agregarlo al env.
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
