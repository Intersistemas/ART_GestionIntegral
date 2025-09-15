import useApiDataFetching, { fetcher } from "@/hooks/useApiDataFetching"; // Importa el fetcher
import UsuarioRow from "./interfaces/UsuarioRow";
import RolesInterface from "./interfaces/RolesInterface";
import { AxiosError } from "axios";

export const useUsuarios = () => {
  const { data: usuariosData, error: usuariosError, isLoading: usuariosLoading, mutate: mutateUsuarios } = useApiDataFetching<{ data: UsuarioRow[] }, "UsuarioAPI">(
    "UsuarioAPI", "getAll", { params: { EmpresaId: 1 } }
);

  const { data: roles, error: rolesError, isLoading: rolesLoading } = useApiDataFetching<RolesInterface[], "UsuarioAPI">(
  "UsuarioAPI", "getRoles"
);

  const registrarUsuario = async (formData: any) => {
    try {
      // Usa el fetcher importado para la petición POST, especificando los tipos genéricos
      await fetcher("UsuarioAPI", "registrar", { data: formData });
      
      // Con SWR, usa mutate para revalidar automáticamente los datos.
      await mutateUsuarios();
      return { success: true };
    } catch (err) {
      const error = (err instanceof AxiosError) ? err : new AxiosError("Error desconocido al registrar usuario");
      console.error("Error al registrar el usuario:", error.message);
      return { success: false, error: "Ocurrió un error al guardar el usuario." };
    }
  };

  return {
    usuarios: usuariosData?.data || [],
    roles: roles || [],
    loading: usuariosLoading || rolesLoading,
    error: usuariosError || rolesError,
    registrarUsuario,
  };
};