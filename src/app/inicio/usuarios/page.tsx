"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import UsuarioForm, { UsuarioFormFields } from "./UsuarioForm";
import UsuarioTable from "./UsuarioTable";
import Tareas from "./Tareas";
import useUsuarios from "./useUsuarios";
import styles from './Usuario.module.css';
import CustomButton from "@/utils/ui/button/CustomButton";
import UsuarioRow from "./interfaces/UsuarioRow";
import { useAuth } from "@/data/AuthContext";
import IUsuarioDarDeBajaReactivar from "./interfaces/IUsuarioDarDeBajaReactivar";

type RequestMethod = 'create' | 'edit' | 'view' | 'delete' | 'activate' | 'remove';

interface RequestState {
    method: RequestMethod | null;
    userData: UsuarioFormFields | null; 
}

interface PermisosModulo {
  moduloId: number;
  moduloDescripcion: string;
  habilitado: boolean;
}

export default function UsuariosPage() {
  const { user } = useAuth();

  const initialForm: UsuarioFormFields = { 
    cuit: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "",
    // tipo: "",
    phoneNumber: "",
    nombre: "",
    // userName: "",
    // Usamos el `|| 1` como valor por defecto, aunque es mejor que el backend lo maneje si no existe
    empresaId: user?.empresaId || 1, 
    cargoId: undefined,
  };

  const { usuarios, roles, cargos, refEmpleadores, loading, error, registrarUsuario, actualizarPermisosUsuario, usuarioUpdate, usuarioDarDeBaja, usuarioReactivar } = useUsuarios();
  const [formError, setFormError] = useState<string | null>(null);  

  const [requestState, setRequestState] = useState<RequestState>({
        method: null,
        userData: null
  });

  const [permisosModal, setPermisosModal] = useState<{
    open: boolean;
    usuario: UsuarioRow | null;
  }>({
    open: false,
    usuario: null
  });
    
  // Determina si el modal debe estar visible
  const showModal = requestState.method !== null;


  const handleOpenModal = (method: RequestMethod, row?: UsuarioRow) => {

      // CORRECCIÓN 2: Mapeamos la fila (UsuarioRow) a datos del formulario (UsuarioFormFields)
      const dataToForm: UsuarioFormFields = row ? {
          cuit: row.cuit || "",
          email: row.email || "",
          // La contraseña y su confirmación deben ir vacías SIEMPRE en edición
          password: method === 'edit' ? "" : "", 
          confirmPassword: method === 'edit' ? "" : "",
          rol: row.rol || "",
          phoneNumber: row.phoneNumber || "",
          nombre: row.nombre || "",
          cargoId: row.cargoId || 1,
          // Limpiar cargo si está vacío, es null, undefined, o contiene valores no deseados
          // cargo: (row.cargo && row.cargo.trim() !== "" && row.cargo !== "null" && row.cargo !== "undefined") ? row.cargo : "",
          // Mantenemos la empresaId de la fila o del usuario actual
          empresaId: row.empresaId || user?.empresaId || 1, 
          // Es crucial incluir el ID de usuario para edición/eliminación
          id: String(row.id), // <-- Aseguramos que el ID se convierte a string para el formulario
      } : initialForm;

      setRequestState({
          method,
          userData: dataToForm,
      });
      setFormError(null);
  };


  const handleCloseModal = () => {
    setRequestState({ method: null, userData: null });
  };

  const handleOpenPermisos = (usuario: UsuarioRow) => {
    setPermisosModal({
      open: true,
      usuario
    });
  };

  const handleClosePermisos = () => {
    setPermisosModal({
      open: false,
      usuario: null
    });
  };

  const handleSavePermisos = async (permisos: PermisosModulo[]) => {
    if (!permisosModal.usuario?.id) {
      alert('Error: No se pudo identificar el usuario');
      return;
    }

    try {
      const result = await actualizarPermisosUsuario(String(permisosModal.usuario.id), permisos);
      
      if (result.success) {
        alert('Permisos guardados exitosamente');
        handleClosePermisos();
      } else {
        alert(`Error al guardar permisos: ${result.error}`);
      }
    } catch (error) {
      console.error('Error al guardar permisos:', error);
      alert('Ocurrió un error al guardar los permisos');
    }
  };

    const handleSubmit = async (data: UsuarioFormFields) => {
    // Aquí se crea el objeto completo para la API, añadiendo empresaId
    // La lógica de envío debe considerar el modo (create, edit, delete)
        const method = requestState.method;
        console.log("handleSubmit method:", method);
        let result: { success: boolean; error: string | null } = { success: false, error: null };

        if (method === 'view') {
            handleCloseModal();
            return;
        }
        
        // Aquí se crea el objeto completo para la API...
        const dataToSubmit = {
            ...data,
            // EmpresaId ya viene del formulario o de initialForm, aseguramos que se envíe
            empresaId: data.empresaId || initialForm.empresaId, 
            // Si es 'edit' o 'delete', el ID viene en `data`
        };
        
        // TODO: Implementar lógica de API para EDITAR y ELIMINAR
        if (method === 'edit') {
          // Lógica para editar usuario
          {
            const rawResult = await usuarioUpdate(String(data.id), dataToSubmit);
            result = {
              success: rawResult.success,
              error: rawResult.error !== undefined ? rawResult.error : null
            };
          } 
        } else if (method === 'activate') {
          // Lógica para reactivar usuario
          const reactivarBody: IUsuarioDarDeBajaReactivar = {
            id: String(data.id),
            deletedObs: "", // data.deletedObs || ""
          };
          {
            const rawResult = await usuarioReactivar(reactivarBody);
            result = {
              success: rawResult.success,
              error:
                rawResult.error !== undefined ? String(rawResult.error) : null,
            };
          }
        } else if (method === 'delete') {
          // Lógica para eliminar usuario
          const darDeBajaBody: IUsuarioDarDeBajaReactivar = {
            id: String(data.id),
            deletedObs: "" // data.deletedObs || ""
          };
          {
            const rawResult = await usuarioDarDeBaja(darDeBajaBody);
            result = {
              success: rawResult.success,
              error: rawResult.error !== undefined ? String(rawResult.error) : null
            };
          }
        } else if (method === 'create') {
          result = await registrarUsuario(dataToSubmit) as { success: boolean; error: string | null }; 
        }

        if (result.success) {
            handleCloseModal();
        } else {
            setFormError(result.error || `Error al ${method} el usuario.`);
        }
  };

  if (loading) {
    return <Typography variant="h6">Cargando...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error instanceof Error ? error.message : "Un error inesperado ha ocurrido."}</Typography>;
  }
  

  // AHORA currentInitialData siempre será UsuarioFormFields o initialForm
  // Lo cual satisface la prop initialData de UsuarioForm
  const currentInitialData = requestState.userData || initialForm; // LÍNEA 144
  console.log("Usuarios", usuarios);
  return (
    <Box className={styles.usuariosPageContainer}>
      <CustomButton
        onClick={() => handleOpenModal("create")}
        style={{ float: "right" }}
      >
        Crear usuario
      </CustomButton>

      <UsuarioTable
        data={usuarios}
        onEdit={(row) => handleOpenModal("edit", row)}
        onView={(row) => handleOpenModal("view", row)}
        onDelete={(row) => handleOpenModal("delete", row)}
        onActivate={(row) => handleOpenModal("activate", row)}
        onRemove={(row) => handleOpenModal("remove", row)}
        onPermisos={handleOpenPermisos}
        isLoading={loading}
      />

      <UsuarioForm
        open={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        roles={roles}
        cargos={cargos}
        refEmpleadores={refEmpleadores}
        initialData={currentInitialData}
        errorMsg={formError}
        method={requestState.method || "create"}
      />

      <Tareas
        open={permisosModal.open}
        onClose={handleClosePermisos}
        usuario={permisosModal.usuario}
        onSave={handleSavePermisos}
      />
    </Box>
  );
}