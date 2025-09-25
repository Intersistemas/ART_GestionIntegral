"use client";

import { useState, useEffect } from "react";
import { TextField, Typography, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import RolesInterface from "./interfaces/RolesInterface";
import styles from './Usuario.module.css';
import { SelectChangeEvent } from '@mui/material/Select';
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";

export interface UsuarioFormFields {
  cuit: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  rol: string;
  tipo: string;
  phoneNumber: string;
  nombre: string;
  userName: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: UsuarioFormFields) => void;
  roles: RolesInterface[];
  initialData?: UsuarioFormFields;
  errorMsg?: string | null;
}

const initialFormState: UsuarioFormFields = {
  cuit: "",
  email: "",
  password: "",
  confirmPassword: "",
  rol: "",
  tipo: "",
  phoneNumber: "",
  nombre: "",
  userName: "",
};

export default function UsuarioForm({ open, onClose, onSubmit, roles, initialData, errorMsg }: Props) {
  const [form, setForm] = useState<UsuarioFormFields>(initialFormState);

  useEffect(() => {
    setForm(initialData || initialFormState);
  }, [initialData, open]);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev: UsuarioFormFields) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev: UsuarioFormFields) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title="Agregar Usuario"
      size="mid"
    >
      {errorMsg && <Typography color="error" className={styles.errorMessage}>{errorMsg}</Typography>}
      <div className={styles.formGrid}>
        <TextField label="Usuario" name="userName" value={form.userName} onChange={handleTextFieldChange} fullWidth />
        <TextField label="Email" name="email" value={form.email} onChange={handleTextFieldChange} fullWidth />
        <TextField label="Password" name="password" type="password" value={form.password} onChange={handleTextFieldChange} fullWidth />
        <TextField label="Confirmar Password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleTextFieldChange} fullWidth />
        <TextField label="Nombre" name="nombre" value={form.nombre} onChange={handleTextFieldChange} fullWidth />
        <TextField label="CUIT" name="cuit" value={form.cuit} onChange={handleTextFieldChange} fullWidth />
        <TextField label="Teléfono" name="phoneNumber" value={form.phoneNumber} onChange={handleTextFieldChange} fullWidth />
        <TextField label="Tipo" name="tipo" value={form.tipo} onChange={handleTextFieldChange} fullWidth />
        <FormControl fullWidth>
          <InputLabel>Rol</InputLabel>
          <Select name="rol" value={form.rol} label="Rol" onChange={handleSelectChange}>
            {roles.map((rol) => (
              <MenuItem key={rol.id} value={rol.nombre}>{rol.nombre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className={styles.formActions}>
        <CustomButton type="submit" width="30%">Guardar</CustomButton>
        <CustomButton onClick={onClose} exit width="30%">Cancelar</CustomButton>
      </div>
    </CustomModal>
  );
}