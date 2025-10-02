import useSWR from "swr";
import axios from "axios";
import { ExternalAPI } from "./api";
import Personal, { Parameters as GetPersonalParams} from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";

const getCurrentPeriodo = (): number => Number(dayjs().format('YYYYMM'));

export class GestionEmpleadorAPIClass extends ExternalAPI {
  readonly basePath = "http://arttest.intersistemas.ar:8670"; ///ToDo: debo agregarlo al env.
  //#region RefEmpleadores
  readonly getPersonalPath = "/api/AfiliadoCuentaCorriente/";
  getPersonal = async (
    { periodo: p = getCurrentPeriodo(), page = "1,1" }: GetPersonalParams = {}
  ) => axios.get<Personal[]>(
    this.getURL({ path: this.getPersonalPath, search: { periodo: `${p}`, page } }).toString(),
  ).then(({ data }) => data);
  useGetRefEmpleadores = (params: GetPersonalParams = {}) => useSWR(
    [this.basePath, this.getPersonalPath, JSON.stringify(params)], () => this.getPersonal(params)
  );
  //#endregion
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
