import useSWR from 'swr';
import axios, { AxiosError, Method } from 'axios';

//#region Declaraciones de tipos públicos
export type APIEndpoints = {
  QueryAPI: "execute" | "analyze",
  UsuarioAPI: "getAll" | "getRoles" | "registrar",
};
//#endregion Declaraciones de tipos públicos

//#region Declaraciones de tipos privados
type APINames = keyof APIEndpoints;
interface APIConfigureOptions<Data = any> {
  data?: Data;
  params?: any;
}
type APIConfigure = <Data>(options?: APIConfigureOptions<Data>) => APIConfigureOptions<Data> | undefined;
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
const APIConfig = {
  QueryAPI: {
    baseUrl: process.env.NEXT_PUBLIC_QUERYAPI_URL!,
    endpoints: {
      execute: { method: "POST", path: "/api/queries/execute" },
      analyze: { method: "POST", path: "/api/queries/analyze" },
    },
  },
  UsuarioAPI: {
    baseUrl: "http://arttest.intersistemas.ar:8301/api", //debo agregarlo al env.
    endpoints: {
      getAll: { method: "GET", path: "/api/Usuario/GetAll" },
      getRoles: { method: "GET", path: "/api/Roles" },
      registrar: { method: "POST", path: "/api/Usuario/Registrar" },
    },
  },
} as APIConfiguration;
//#endregion Configuracion de APIs

export async function fetcher<Data = any, API extends APINames = APINames, OptionsData = any>(
  apiName: API,
  apiEndpoint: APIEndpoints[API],
  options?: APIConfigureOptions<OptionsData>
) {
  const api = APIConfig[apiName];
  const endpoint = api.endpoints[apiEndpoint];
  const method = endpoint.method;
  const url = new URL(endpoint.path ?? "", api.baseUrl).toString();
  options = getOptions(api.configure);
  const { data, params } = getOptions(endpoint.configure) ?? {};
  try {
    const response = await axios<Data>({ method, url, data, params });
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
export default function useApiDataFetching<Data = any, API extends APINames = APINames, OptionsData = any>(
  api: API,
  endpoint: APIEndpoints[API],
  options?: APIConfigureOptions<OptionsData>,
) {
  const swrKey = options ? [api, endpoint, options.data, options.params] : [api, endpoint];
  const { data, error, isLoading, mutate } = useSWR<Data>(swrKey, () => fetcher(api, endpoint, options));
  return { data, error, isLoading, mutate };
};