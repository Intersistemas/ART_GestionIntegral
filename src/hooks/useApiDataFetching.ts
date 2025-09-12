import useSWR from 'swr';
import axios, { AxiosError, Method } from 'axios';

//#region Declaraciones de tipos públicos
export type APIEndpoints = {
  QueryAPI: "execute" | "analyze",
};
//#endregion Declaraciones de tipos públicos

//#region Declaraciones de tipos privados
type APINames = keyof APIEndpoints;
interface APIConfigureOptions {
  data?: any;
  params?: any;
}
type APIConfigure = (options?: APIConfigureOptions) => APIConfigureOptions | undefined;
type APIConfiguration = {
  [APIName in APINames]: {
    baseUrl: string | URL;
    endpoints: {
      [APIEndpoint in APIEndpoints[APIName]]: {
        method: Method;
        path?: string | URL;
        configure?: APIConfigure;
      }
    };
    configure?: APIConfigure;
  };
};
//#endregion Declaraciones de tipos privados

//#region Configuracion de APIs
const APIConfig: APIConfiguration = {
  QueryAPI: {
    baseUrl: process.env.NEXT_PUBLIC_QUERYAPI_URL!,
    endpoints: {
      execute: { method: "POST", path: "/api/queries/execute" },
      analyze: { method: "POST", path: "/api/queries/analyze" },
    },
  },
}
//#endregion Configuracion de APIs

async function fetcher(
  apiName: APINames,
  apiEndpoint: APIEndpoints[typeof apiName],
  options?: APIConfigureOptions
) {
  const api = APIConfig[apiName];
  const endpoint = api.endpoints[apiEndpoint];
  const method = endpoint.method;
  const url = new URL(endpoint.path ?? "", api.baseUrl).toString();
  options = getOptions(api.configure);
  const { data, params } = getOptions(endpoint.configure) ?? {};
  try {
    const response = await axios({ method, url, data, params });
    return response.data;
  } catch (error) {
    throw new AxiosError('Error en la petición: ' + (error as AxiosError).message);
  }
  function getOptions(configure?: APIConfigure) { return (configure) ? configure(options) : options; }
};

/**
 * Hook personalizado para la obtención de datos.
 * @param api Nombre del API registrado
 * @param endpoint Nombre del endpoint registrado para api
 * @param options Las opciones para la petición, incluyendo 'data' (body) y 'params'.
 */
export default function useApiDataFetching<Data>(
  api: APINames,
  endpoint: APIEndpoints[typeof api],
  options?: APIConfigureOptions
) {
  // SWR utiliza el primer parámetro como clave de caché.
  // Es importante que la clave sea única para cada petición.
  const swrKey = options ? [api, endpoint, options.data, options.params] : [api, endpoint];
  const { data, error, isLoading } = useSWR<Data>(swrKey, swrFetcher);
  return { data, error, isLoading };
  function swrFetcher() { return fetcher(api, endpoint, options); }
};