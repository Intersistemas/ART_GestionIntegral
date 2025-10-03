import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { AxiosError } from "axios";
import { token } from "./usuarioAPI";
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

const tokenizable = token.configure();

function reject<T>(error: AxiosError) {
  return Promise.reject<T>(camelCaseKeys<APIError>(error.response?.data)
    ?? { code: error.status ?? 0, message: error.message, details: error } as APIError<AxiosError>
  );
}

export class QueriesAPIClass extends ExternalAPI {
  readonly basePath = process.env.NEXT_PUBLIC_QUERYAPI_URL!;
  //#region execute
  readonly executeURL = () => this.getURL({ path: "/api/queries/execute" }).toString();
  execute = async <Data = QueryResultData>(query: Query) => tokenizable.post<QueryResult<Data>>(
    this.executeURL(), query
  ).then(({ data }) => data, (error) => reject<QueryResult<Data>>(error));
  useExecute = <Data = QueryResultData>(query: Query) => useSWR<QueryResult<Data>, APIError>(
    [this.executeURL(), token.getToken(), JSON.stringify(query)], () => this.execute<Data>(query)
  );
  //#endregion execute
  //#region analyze
  readonly analyzeURL = () => this.getURL({ path: "/api/queries/analyze" }).toString();
  analyze = async (query: Query) => tokenizable.post<QueryAnalysis>(
    this.analyzeURL(), query
  ).then(({ data }) => data, (error) => reject<QueryAnalysis>(error));
  useAnalyze = (query: Query) => useSWR<QueryAnalysis, AxiosError<APIError>>(
    [this.analyzeURL(), token.getToken(), JSON.stringify(query)], () => this.analyze(query)
  );
  //#endregion analyze
}

const QueriesAPI = Object.seal(new QueriesAPIClass());

export default QueriesAPI;