import useSWR from "swr";
import { ExternalAPI, ExternalAPIError } from "./api";

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
//#endregion Types

export class QueriesAPI extends ExternalAPI {
  basePath = process.env.NEXT_PUBLIC_QUERYAPI_URL!;
  //#region execute
  execute = async (query: Query): Promise<QueryResult> => fetch(
    this.getURL({ path: "/api/queries/execute" }),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    }
  ).then(
    async (response: Response) => {
      if (response.ok) return { count: 0, ...await response.json() };
      const detail = await response.text();
      return Promise.reject(new ExternalAPIError({ code: response.status, detail, message: detail }));
    }
  );
  public useExecute(query: Query) {
    const { data, error, isLoading } = useSWR<QueryResult>(query, () => this.execute(query));
    return { data, error, isLoading };
  }
  //#endregion execute
  //#region analyze
  analyze = async (query: Query): Promise<QueryAnalysis> => fetch(
    this.getURL({ path: "/api/queries/analyze" }),
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    }
  ).then(
    async (response: Response) => {
      if (response.ok) return { count: 0, ...await response.json() };
      const detail = await response.text();
      return Promise.reject(new ExternalAPIError({ code: response.status, detail, message: detail }));
    }
  );
  public useAnalyze(query: Query) {
    const { data, error, isLoading } = useSWR<QueryResult>(query, () => this.analyze(query));
    return { data, error, isLoading };
  }
  //#endregion analyze
}