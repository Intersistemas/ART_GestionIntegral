import useSWR from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import Persona, { Parameters } from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";
import { toURLSearch } from "@/utils/utils";

//const getCurrentPeriodo = (): number => Number(dayjs().format('YYYYMM'));

const tokenizable = token.configure();

const getCurrentPeriodo = (): number => {
    return Number(dayjs().subtract(2, 'month').format('YYYYMM'));
};

export class GestionEmpleadorAPIClass extends ExternalAPI {
  readonly basePath = process.env.NEXT_PUBLIC_API_EMPLEADOR_URL || 'http://fallback-prod.url'; 
  //#region Persona
  readonly getPersonalURL = (params: Parameters = {}) => {
    params.periodo ??= getCurrentPeriodo();
    params.page ??= "1,1";
    return this.getURL({ path: "/api/AfiliadoCuentaCorriente/", search: toURLSearch(params) }).toString();
  };
  getPersonal = async (params: Parameters = {}) => tokenizable.get<Persona[]>(
    this.getPersonalURL(params),
  ).then(({ data }) => data);
  useGetPersonal = (params: Parameters = {}) => useSWR(
    [this.getPersonalURL(params), token.getToken()], () => this.getPersonal(params) 
  );
  //#endregion
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
