import { ExternalAPI, ExternalAPIError } from "./api";

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

export class QueriesAPI extends ExternalAPI {
  basePath = `${process.env.API_SEGURIDAD_URL}/queries/`;

  execute = async (query: Query): Promise<QueryResult> => fetch(
    this.getURL({ path: "execute" }),
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

  analyze = async (query: Query): Promise<QueryAnalysis> => fetch(
    this.getURL({ path: "analyze" }),
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
}