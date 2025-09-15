import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI } from "./api";

export interface Query {
  select: Select[];
  from: Source[];
  where?: string;
  group?: Group;
  order?: Order;
}
export interface Source {
  name?: string;
  table?: string;
  values?: Record<string, (string | null)[]>
  query?: Query;
  join?: Join;
}
export interface Join {
  left?: string;
  right?: string;
  inner?: string;
  full?: string;
}
export interface Select {
  value?: string;
  name?: string;
}
export interface Group {
  by: string[];
  having?: string;
}
export interface Order {
  by: string[];
  page?: Page;
}
export interface Page {
  index: number;
  size?: number;
}
export interface QueryResult {
  count: number;
  data?: Record<string, any>[];
  page?: QueryResultPage;
}
export interface QueryResultPage {
  index: number;
  size: number;
  count: number;
}
export interface QueryAnalysis {
  count: number;
  pages?: number;
  tables?: Record<string, string[]>;
}

export class QueriesAPIClass extends ExternalAPI {
  basePath = process.env.NEXT_PUBLIC_QUERYAPI_URL!;
  //#region execute
  execute = async (query: Query) => axios.post<QueryResult>
  (
    this.getURL({ path: "/api/queries/execute" }).toString(),
    query
  ).then(
    async (response) => {
      if (response.status === 200) return response.data;
      return Promise.reject(new AxiosError(`Error en la petición: ${response.data}`));
    }
  );
  useExecute = (query: Query) => useSWR<QueryResult>(query, () => this.execute(query));
  //#endregion execute
  //#region analyze
  analyze = async (query: Query) => axios.post<QueryAnalysis>
  (
    this.getURL({ path: "/api/queries/analyze" }).toString(),
    query
  ).then(
    async (response) => {
      if (response.status === 200) return response.data;
      return Promise.reject(new AxiosError(`Error en la petición: ${response.data}`));
    }
  );
  useAnalyze = (query: Query) => useSWR<QueryResult>(query, () => this.analyze(query));
  //#endregion analyze
}

const QueriesAPI = Object.seal(new QueriesAPIClass());

export default QueriesAPI;