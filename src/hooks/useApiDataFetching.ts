import useSWR from 'swr';
import axios, { AxiosError, Method } from 'axios';

//#region Declaraciones de tipos públicos
export type APIEndpoints = {
  QueryAPI: "execute" | "analyze",
  UsuarioAPI: "getAll" | "getRoles" | "registrar",
};
//#endregion Declaraciones de tipos públicos

//#region Declaraciones de tipos privados
type APINames = keyof typeof APIConfig;
interface APIConfigureOptions {
  data?: any;
  params?: any;
}
type APIConfigure = (options?: APIConfigureOptions) => APIConfigureOptions | undefined;
type APIConfiguration = {
  [APIName in keyof APIEndpoints]: {
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
export const APIConfig = {
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

async function getOptions(
  apiConfigure?: APIConfigure,
  endpointConfigure?: APIConfigure,
  options?: APIConfigureOptions
) {
  let finalOptions = options;
  if (apiConfigure) {
    finalOptions = apiConfigure(finalOptions);
  }
  if (endpointConfigure) {
    finalOptions = endpointConfigure(finalOptions);
  }
  return finalOptions;
}

export async function fetcher<T, A extends keyof APIEndpoints, E extends APIEndpoints[A]>(
  apiName: A,
  apiEndpoint: E,
  options?: APIConfigureOptions
): Promise<T> {
  const api = APIConfig[apiName];
  const endpoint = api.endpoints[apiEndpoint as keyof typeof api.endpoints];

  const method = endpoint.method;
  const url = new URL(endpoint.path ?? "", api.baseUrl).toString();
  
  const finalOptions = await getOptions(api.configure, endpoint.configure, options);

  try {
    const response = await axios({
      method,
      url,
      data: finalOptions?.data,
      params: finalOptions?.params,
    });
    return response.data;
  } catch (error) {
    throw new AxiosError('Error en la petición: ' + (error as AxiosError).message);
  }
};

/**
 * Hook personalizado para la obtención de datos.
 * @param api Nombre del API registrado
 * @param endpoint Nombre del endpoint registrado para api
 * @param options Las opciones para la petición, incluyendo 'data' (body) y 'params'.
 */
export default function useApiDataFetching<Data, A extends keyof APIEndpoints, E extends APIEndpoints[A]>(
  api: A,
  endpoint: E,
  options?: APIConfigureOptions
) {
  const swrKey = options ? [api, endpoint, options.data, options.params] : [api, endpoint];
  const { data, error, isLoading, mutate } = useSWR<Data>(swrKey, () => fetcher<Data, A, E>(api, endpoint, options));
  return { data, error, isLoading, mutate };
};