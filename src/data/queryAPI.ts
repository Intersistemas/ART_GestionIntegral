import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { ExternalAPI } from "./api";
import { camelCaseKeys } from "@/utils/utils";

//#region Types
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
export type QueryResultData = Record<string, any>;
export interface QueryResult<Data = QueryResultData> {
  count: number;
  data?: Data[];
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
export interface APIError<T = Record<string, any>> {
  code: number;
  message: string;
  details?: T;
}
//#endregion Types

function reject<T>(error: AxiosError) {
  return Promise.reject<T>(camelCaseKeys<APIError>(error.response?.data)
    ?? { code: error.status ?? 0, message: error.message, details: error } as APIError<AxiosError>
  );
}

export class QueriesAPIClass extends ExternalAPI {
  basePath = process.env.NEXT_PUBLIC_QUERYAPI_URL!;
  //#region execute
  execute = async <Data = QueryResultData>(query: Query) => axios.post<QueryResult<Data>>(
    this.getURL({ path: "/api/queries/execute" }).toString(), query
  ).then(({ data }) => data, (error) => reject<QueryResult<Data>>(error));
  useExecute = <Data = QueryResultData>(query: Query) => useSWR<QueryResult<Data>, APIError>(
    query, () => this.execute<Data>(query)
  );
  //#endregion execute
  //#region analyze
  analyze = async (query: Query) => axios.post<QueryAnalysis>(
    this.getURL({ path: "/api/queries/analyze" }).toString(), query
  ).then(({ data }) => data, (error) => reject<QueryAnalysis>(error));
  useAnalyze = (query: Query) => useSWR<QueryAnalysis, AxiosError<APIError>>(
    query, () => this.analyze(query)
  );
  //#endregion analyze
}

const QueriesAPI = Object.seal(new QueriesAPIClass());

export default QueriesAPI;