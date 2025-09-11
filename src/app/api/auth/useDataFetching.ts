// hooks/useDataFetching.ts
import useSWR from 'swr';
import axios, { AxiosRequestConfig, AxiosError, Method } from 'axios';

// Definición de las interfaces para los tipos
interface FetcherOptions {
  url: string;
  method: Method;
  data?: any;
  params?: any;
}

interface ApiConfig {
  baseUrl: string;
}

// Configuración de las URL base para cada entorno
const apiConfig: Record<string, ApiConfig> = {
  development: {
    baseUrl: 'http://localhost:3000/api/',
  },
  production: {
    baseUrl: 'https://api.tudominio.com/api/',
  },
  test: {
    baseUrl: 'https://test-api.tudominio.com/api/',
  },
};

// Función fetcher que SWR utilizará para obtener los datos
const fetcher = async ({ url, method, data, params }: FetcherOptions) => {
  const env = process.env.NODE_ENV || 'development';
  const config = apiConfig[env] || apiConfig.development;

  const axiosConfig: AxiosRequestConfig = {
    method,
    url: `${config.baseUrl}${url}`,
    data,
    params,
  };

  try {
    const response = await axios(axiosConfig);
    return response.data;
  } catch (error) {
    throw new AxiosError('Error en la petición: ' + (error as AxiosError).message);
  }
};

/**
 * Hook personalizado para la obtención de datos.
 * @param url La ruta de la API, por ejemplo: 'usuarios/123'.
 * @param method El método HTTP, por ejemplo: 'get', 'post', 'put', 'delete'.
 * @param options Las opciones para la petición, incluyendo 'data' (body) y 'params'.
 */
const useDataFetching = <T,>(
  url: string,
  method: Method,
  options?: { data?: any; params?: any }
) => {
  // SWR utiliza el primer parámetro como clave de caché.
  // Es importante que la clave sea única para cada petición.
  const swrKey = options ? [url, method, options.data, options.params] : [url, method];

  const { data, error, isLoading } = useSWR<T>(
    swrKey,
    () => fetcher({ url, method, data: options?.data, params: options?.params })
  );

  return {
    data,
    error,
    isLoading,
  };
};

export default useDataFetching;