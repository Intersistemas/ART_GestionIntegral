import useSWR from "swr";
import axios from "axios";
import { ExternalAPI } from "./api";
import Personal, { Parameters as GetPersonalParams} from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";
import { stringifyValues } from "@/utils/utils";
import { getSession } from "next-auth/react";

const getCurrentPeriodo = (): number => Number(dayjs().format('YYYYMM'));

export class GestionEmpleadorAPIClass extends ExternalAPI {
  readonly basePath = "http://arttest.intersistemas.ar:8670"; ///ToDo: debo agregarlo al env.
  //#region Personal
  readonly getPersonalPath = "/api/AfiliadoCuentaCorriente/";
  private getPersonalToken = "";
  getPersonal = async (params: GetPersonalParams = {}) => {
    params.periodo ??= getCurrentPeriodo();
    params.page ??= "1,1";
    const token = (await getSession())?.accessToken ?? "";
    if (token !== this.getPersonalToken) this.getPersonalToken = token;
    return axios.get<Personal[]>(
      this.getURL({ path: this.getPersonalPath, search: stringifyValues(params) }).toString(),
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(({ data }) => data);
  }
  useGetPersonal = (params: GetPersonalParams = {}) => useSWR(
    [this.basePath, this.getPersonalPath, this.getPersonalToken, JSON.stringify(params)], () => this.getPersonal(params)
  );
  //#endregion
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
