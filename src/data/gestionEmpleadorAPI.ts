import useSWR from "swr";
import axios from "axios";
import { ExternalAPI } from "./api";
import Personal, { Parameters} from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";
import { stringifyValues } from "@/utils/utils";
import { getSession } from "next-auth/react";

//const getCurrentPeriodo = (): number => Number(dayjs().format('YYYYMM'));

const getCurrentPeriodo = (): number => {
    return Number(dayjs().subtract(2, 'month').format('YYYYMM'));
};

export class GestionEmpleadorAPIClass extends ExternalAPI {
  readonly basePath = process.env.NEXT_PUBLIC_API_EMPLEADOR_URL || 'http://fallback-prod.url'; 
  //#region Personal
  readonly getPersonalPath = "/api/AfiliadoCuentaCorriente/";
  private getPersonalToken = "";
  getPersonal = async (params: Parameters = {}) => {
    params.periodo ??= getCurrentPeriodo();
    params.page ??= "1,1";
    const token = (await getSession())?.accessToken ?? "";
    if (token !== this.getPersonalToken) this.getPersonalToken = token;
    return axios.get<Personal[]>(
      this.getURL({ path: this.getPersonalPath, search: stringifyValues(params) }).toString(),
      { headers: { Authorization: `Bearer ${token}` } }
    ).then(({ data }) => data);
  }
  useGetPersonal = (params: Parameters = {}) => useSWR(
    [this.basePath, this.getPersonalPath, this.getPersonalToken, JSON.stringify(params)], () => this.getPersonal(params)
  );
  //#endregion
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
