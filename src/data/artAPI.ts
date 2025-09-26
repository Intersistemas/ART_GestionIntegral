import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI, ExternalAPIGetURLParams } from "./api";
import RefEmpleador from "@/app/dashboard/usuarios/interfaces/RefEmpleador";

export class ArtAPIClass extends ExternalAPI {
  basePath = "http://localhost:5005"; ///ToDo: debo agregarlo al env.

  //#region RefEmpleadores
  getRefEmpleadores = async () =>
    axios
      .get<RefEmpleador[]>(
        this.getURL({ path: "/api/RefEmpleadores" }).toString()
      )
      .then(({ data }) => data);
      
  useGetRefEmpleadores = () => {
    return useSWR("/api/RefEmpleadores", () =>
      axios
        .get<RefEmpleador[]>(this.getURL({ path: "/api/RefEmpleadores" }).toString())
        .then(({ data }) => data)
    );
  };
  
    // useSWR({}, () => this.getRefEmpleadores());
    
  //#endregion
}

const ArtAPI = Object.seal(new ArtAPIClass());

export default ArtAPI;
