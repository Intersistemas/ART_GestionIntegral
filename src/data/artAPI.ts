import useSWR from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import RefEmpleador from "@/app/inicio/usuarios/interfaces/RefEmpleador";

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
}

const ArtAPI = Object.seal(new ArtAPIClass());

export default ArtAPI;
