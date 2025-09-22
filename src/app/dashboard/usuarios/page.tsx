"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import UsuarioForm, { UsuarioFormFields } from "./UsuarioForm";
import UsuarioTable from "./UsuarioTable";
import useUsuarios, { UsuarioRow } from "./useUsuarios";
import styles from './Usuario.module.css';
import CustomButton from "@/utils/ui/button/CustomButton";

const initialForm = {
  cuit: "",
  email: "",
  password: "",
  confirmPassword: "",
  rol: "",
  tipo: "",
  phoneNumber: "",
  nombre: "",
  userName: "",
  empresaId: 1,
};

export default function UsuariosPage() {
  const { usuarios, roles, loading, error, registrarUsuario } = useUsuarios();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [formError, setFormError] = useState<string | null>(null);

  const handleOpenModal = (row?: UsuarioRow) => {
    const dataToForm = row ? {
        cuit: row.cuit,
        email: row.email,
        password: "",
        confirmPassword: "",
        rol: "",
        tipo: row.tipo,
        phoneNumber: row.phoneNumber,
        nombre: row.nombre,
        userName: row.userName,
        empresaId: initialForm.empresaId, // <-- Aseguramos que la propiedad empresaId esté presente
    } : initialForm;

    setFormData(dataToForm);
    setFormError(null);
    setShowModal(true);
    };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (data: UsuarioFormFields) => {
    // Aquí se crea el objeto completo para la API, añadiendo empresaId
    const dataToSubmit = {
      ...data,
      empresaId: initialForm.empresaId,
    };
    
    const result = await registrarUsuario(dataToSubmit);
    if (result.success) {
      handleCloseModal();
    } else {
      setFormError(result.error || "Error al registrar el usuario.");
    }
  };

  if (loading) {
    return <Typography variant="h6">Cargando...</Typography>;
  }

  if (error) {
    return <Typography color="error">Error: {error instanceof Error ? error.message : "Un error inesperado ha ocurrido."}</Typography>;
  }

  return (
    <Box className={styles.usuariosPageContainer}>
      <CustomButton
        onClick={() => handleOpenModal()}
        width="20%"
      >
        Crear usuario
      </CustomButton>
      <UsuarioTable data={usuarios} onEdit={handleOpenModal} isLoading={loading}/>
      <UsuarioForm
        open={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        roles={roles}
        initialData={formData}
        errorMsg={formError}
      />
    </Box>
  );
}