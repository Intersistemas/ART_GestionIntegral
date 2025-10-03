import useSWR from "swr";
import { ExternalAPI } from "./api";
import { token } from "./usuarioAPI";
import Personal, { Parameters as GetPersonalParams} from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";
import { toURLSearch } from "@/utils/utils";

const getCurrentPeriodo = (): number => Number(dayjs().format('YYYYMM'));

const tokenizable = token.configure();

export class GestionEmpleadorAPIClass extends ExternalAPI {
  readonly basePath = "http://arttest.intersistemas.ar:8670"; ///ToDo: debo agregarlo al env.
  //#region Personal
  readonly getPersonalURL = (params: GetPersonalParams = {}) => {
    params.periodo ??= getCurrentPeriodo();
    params.page ??= "1,1";
    return this.getURL({ path: "/api/AfiliadoCuentaCorriente/", search: toURLSearch(params) }).toString();
  };
  getPersonal = async (params: GetPersonalParams = {}) => tokenizable.get<Personal[]>(
    this.getPersonalURL(params),
  ).then(({ data }) => data);
  useGetPersonal = (params: GetPersonalParams = {}) => useSWR(
    [this.getPersonalURL(params), token.getToken()], () => this.getPersonal(params)
  );
  //#endregion
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
