"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import UsuarioForm, { UsuarioFormFields } from "./UsuarioForm";
import UsuarioTable from "./UsuarioTable";
import useUsuarios from "./useUsuarios";
import styles from './Usuario.module.css';
import CustomButton from "@/utils/ui/button/CustomButton";
import UsuarioRow from "./interfaces/UsuarioRow";
import { useAuth } from "@/data/AuthContext";

type RequestMethod = 'create' | 'edit' | 'view' | 'delete';

interface RequestState {
    method: RequestMethod | null;
    userData: UsuarioFormFields | null; 
}

export default function UsuariosPage() {
  const { user } = useAuth();

  const initialForm: UsuarioFormFields = { 
    cuit: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: "",
    tipo: "",
    phoneNumber: "",
    nombre: "",
    userName: "",
    // Usamos el `|| 1` como valor por defecto, aunque es mejor que el backend lo maneje si no existe
    empresaId: user?.empresaId || 1, 
    cargo: "",
  };

  const { usuarios, roles, refEmpleadores, loading, error, registrarUsuario } = useUsuarios();
  const [formError, setFormError] = useState<string | null>(null);  

  const [requestState, setRequestState] = useState<RequestState>({
        method: null,
        userData: null
  });
    
  // Determina si el modal debe estar visible
  const showModal = requestState.method !== null;


  const handleOpenModal = (method: RequestMethod, row?: UsuarioRow) => {

      // CORRECCIÓN 2: Mapeamos la fila (UsuarioRow) a datos del formulario (UsuarioFormFields)
      const dataToForm: UsuarioFormFields = row ? {
          cuit: row.cuit,
          email: row.email,
          // La contraseña y su confirmación deben ir vacías
          password: "", 
          confirmPassword: "",
          rol: row.rol,
          tipo: row.tipo,
          phoneNumber: row.phoneNumber,
          nombre: row.nombre,
          userName: row.userName,
          cargo: row.cargo,
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

  const handleSubmit = async (data: UsuarioFormFields) => {
    // Aquí se crea el objeto completo para la API, añadiendo empresaId
    // La lógica de envío debe considerar el modo (create, edit, delete)
        const method = requestState.method;

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
        const result = await registrarUsuario(dataToSubmit); 

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
  console.log("UsuariosPage render - refEmpleadores:", refEmpleadores);


  // AHORA currentInitialData siempre será UsuarioFormFields o initialForm
  // Lo cual satisface la prop initialData de UsuarioForm
  const currentInitialData = requestState.userData || initialForm; // LÍNEA 144
  
  return (
    <Box className={styles.usuariosPageContainer}>

      
      <CustomButton
        onClick={() => handleOpenModal('create')}
        style={{float: 'right'}}
      >
        Crear usuario
      </CustomButton>


      <UsuarioTable
          data={usuarios}
          onEdit={(row) => handleOpenModal('edit', row)} 
          onView={(row) => handleOpenModal('view', row)} 
          onDelete={(row) => handleOpenModal('delete', row)}
          isLoading={loading}
      />

      <UsuarioForm
        open={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        roles={roles}
        refEmpleadores={refEmpleadores}
        initialData={currentInitialData}
        errorMsg={formError}
        method={requestState.method || 'create'}
      />
    </Box>
  );
}