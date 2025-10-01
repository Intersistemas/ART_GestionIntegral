import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI } from "./api";
import Personal from "@/app/inicio/empleador/cobertura/types/persona";
import dayjs from "dayjs";

const getCurrentPeriodo = (): string => {
    return dayjs().format('YYYYMM');
};

export class GestionEmpleadorAPIClass extends ExternalAPI {
  basePath = "http://arttest.intersistemas.ar:8670"; ///ToDo: debo agregarlo al env.

  private currentPeriodo = getCurrentPeriodo();
  //#region RefEmpleadores
  private personalBase = this.getURL({ path: `/api/AfiliadoCuentaCorriente/?Periodo=${this.currentPeriodo}&Page=1,1` }).toString();
  getPersonal = async () =>
    axios
      .get<Personal[]>(
        this.personalBase
      )
      .then(({ data }) => data);

  useGetRefEmpleadores = () => {
    return useSWR({ path: this.personalBase }, () => this.getPersonal());
  };  

  //#endregion
}

const gestionEmpleadorAPI = Object.seal(new GestionEmpleadorAPIClass());

export default gestionEmpleadorAPI;
