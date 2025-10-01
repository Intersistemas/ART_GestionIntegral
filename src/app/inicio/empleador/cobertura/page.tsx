export default function CoberturaPage() {
  return (
    <div>Cobertura</div>
  )
};

/*

import { AxiosError } from "axios";
import UsuarioAPI from "@/data/usuarioAPI";
import { useAuth } from '@/data/AuthContext';
import ArtAPI from "@/data/artAPI";

const { useGetAll, useGetRoles, registrar } = UsuarioAPI;
const { useGetRefEmpleadores } = ArtAPI;

export default function useUsuarios() {
  const { data: usuariosData, error: usuariosError, isLoading: usuariosLoading, mutate: mutateUsuarios } = useGetAll({ empresaId: 1 });
  const { data: roles, error: rolesError, isLoading: rolesLoading } = useGetRoles();
  const { user, status } = useAuth();   

  console.log("user**",user)

  const { data: refEmpleadores } = useGetRefEmpleadores();

  const registrarUsuario = async (formData: any) => {
    try {
      // Usa el fetcher importado para la petición POST, especificando los tipos genéricos
      // await fetcher("UsuarioAPI", "registrar", { data: formData });
      await registrar(formData);
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
    refEmpleadores: refEmpleadores || [],
    loading: usuariosLoading || rolesLoading,
    error: usuariosError || rolesError,
    registrarUsuario,
  };
};*/