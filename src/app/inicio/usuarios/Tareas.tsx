"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  Collapse,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import CustomModal from '@/utils/ui/form/CustomModal';
import IModulo from './interfaces/IModulo';
import UsuarioRow from './interfaces/UsuarioRow';
import styles from './Usuario.module.css';
import CustomButton from '@/utils/ui/button/CustomButton';

interface TareasProps {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioRow | null;
  onSave: (permisos: PermisosModulo[]) => void;
}

interface PermisosModulo {
  moduloId: number;
  moduloDescripcion: string;
  habilitado: boolean;
}

export default function Tareas({
  open,
  onClose,
  usuario,
  onSave,
}: TareasProps) {
  const [permisosModulos, setPermisosModulos] = useState<Record<number, boolean>>({});
  const [modulosExpandidos, setModulosExpandidos] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (usuario?.modulos) {
      // Filtrar módulos únicos por ID
      const modulosUnicos = usuario.modulos.filter((modulo, index, array) => 
        array.findIndex(m => m.id === modulo.id) === index
      );
      
      // Inicializar permisos y estado de expansión basados en los módulos únicos
      const permisosModulosIniciales: Record<number, boolean> = {};
      const modulosExpandidosIniciales: Record<number, boolean> = {};

      modulosUnicos.forEach((modulo) => {
        // Usar el campo habilitado que viene de la API
        permisosModulosIniciales[modulo.id] = modulo.habilitado;
        modulosExpandidosIniciales[modulo.id] = false; // Inicialmente contraídos
      });

      setPermisosModulos(permisosModulosIniciales);
      setModulosExpandidos(modulosExpandidosIniciales);
    }
  }, [usuario]);

  const handleModuloPermisoChange = (moduloId: number, habilitado: boolean) => {
    setPermisosModulos((prev) => ({
      ...prev,
      [moduloId]: habilitado,
    }));
  };

  const handleToggleModulo = (moduloId: number) => {
    setModulosExpandidos((prev) => ({
      ...prev,
      [moduloId]: !prev[moduloId],
    }));
  };

  const handleGuardarConfiguracion = () => {
    if (!usuario?.modulos) return;

    // Filtrar módulos únicos y crear array de módulos con sus permisos
    const modulosUnicos = usuario.modulos.filter((modulo, index, array) => 
      array.findIndex(m => m.id === modulo.id) === index
    );
    
    const permisosModulosArray: PermisosModulo[] = modulosUnicos.map((modulo) => ({
      moduloId: modulo.id,
      moduloDescripcion: modulo.nombre,
      habilitado: permisosModulos[modulo.id] ?? false,
    }));

    console.log('Permisos módulos a enviar:', permisosModulosArray);
    onSave(permisosModulosArray);
    onClose();
  };

  const handleVolver = () => {
    onClose();
  };

  const handleDarAccesoATodo = () => {
    if (!usuario?.modulos) return;

    // Filtrar módulos únicos
    const modulosUnicos = usuario.modulos.filter((modulo, index, array) => 
      array.findIndex(m => m.id === modulo.id) === index
    );

    const nuevosPermisos: Record<number, boolean> = {};
    modulosUnicos.forEach((modulo) => {
      nuevosPermisos[modulo.id] = true;
    });
    setPermisosModulos(nuevosPermisos);
  };

  const handleQuitarTodosLosAccesos = () => {
    if (!usuario?.modulos) return;

    // Filtrar módulos únicos
    const modulosUnicos = usuario.modulos.filter((modulo, index, array) => 
      array.findIndex(m => m.id === modulo.id) === index
    );

    const nuevosPermisos: Record<number, boolean> = {};
    modulosUnicos.forEach((modulo) => {
      nuevosPermisos[modulo.id] = false;
    });
    setPermisosModulos(nuevosPermisos);
  };

  if (!usuario) {
    return null;
  }

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={`Configuración de Permisos - ${usuario.nombre}`}
      size="large"
    >
      <Box sx={{ p: 2 }}>
        {/* Información del usuario */}
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ mb: 2, fontSize: "1.8rem" }}
        >
          Administración de Usuarios &gt; {usuario.nombre} &gt; Configuración de
          Permisos
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: "1.5rem" }}>
            <strong>Usuario:</strong> {usuario.email}
          </Typography>
          <Typography variant="body2" sx={{ fontSize: "1.5rem" }}>
            <strong>Cargo:</strong> {usuario.cargoDescripcion}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, fontSize: "1.5rem" }}>
          Seleccione a qué módulos tendrá acceso este usuario:
        </Typography>

        {/* Tabla de permisos */}
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 1,
            overflow: "hidden",
            mb: 3,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#f5f5f5",
              borderBottom: "1px solid #ddd",
              p: 1,
            }}
          >
            <Typography
              variant="body2"
              sx={{ flex: 2, fontWeight: "bold", fontSize: "1.3rem" }}
            >
              Opción del Menú
            </Typography>
            <Typography
              variant="body2"
              sx={{
                flex: 1,
                fontWeight: "bold",
                textAlign: "center",
                fontSize: "1.3rem",
              }}
            >
              Acceso (S/N)
            </Typography>
            <Typography
              variant="body2"
              sx={{ flex: 2, fontWeight: "bold", fontSize: "1.3rem" }}
            >
              Información sobre permisos
            </Typography>
          </Box>

          {/* Contenido - Módulos */}
          {usuario.modulos
            ?.filter((modulo, index, array) => 
              array.findIndex(m => m.id === modulo.id) === index
            )
            ?.map((modulo, moduloIndex) => (
            <Box key={`modulo-${modulo.id}`}>
              {/* Header del módulo con control de permisos y expandir/contraer */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#e8f4f8",
                  p: 1,
                  borderBottom: "1px solid #ddd",
                  fontWeight: "bold",
                }}
              >
                <Box sx={{ flex: 2, display: "flex", alignItems: "center" }}>
                  <IconButton
                    size="small"
                    onClick={() => handleToggleModulo(modulo.id)}
                    sx={{ mr: 1 }}
                  >
                    {modulosExpandidos[modulo.id] ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </IconButton>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                  >
                    {modulo.nombre}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: 30,
                      height: 20,
                      borderRadius: "3px",
                      backgroundColor: permisosModulos[modulo.id]
                        ? "#4CAF50"
                        : "#f44336",
                      color: "white",
                      textAlign: "center",
                      lineHeight: "20px",
                      fontSize: "15px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      handleModuloPermisoChange(
                        modulo.id,
                        !permisosModulos[modulo.id]
                      )
                    }
                  >
                    {permisosModulos[modulo.id] ? "S" : "N"}
                  </Box>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ flex: 2, fontSize: "1.2rem", color: "#666" }}
                >
                  {permisosModulos[modulo.id]
                    ? "• Acceso habilitado al módulo"
                    : "• Acceso denegado al módulo"}
                </Typography>
              </Box>

              {/* Tareas del módulo (colapsables) */}
              <Collapse
                in={modulosExpandidos[modulo.id]}
                timeout="auto"
                unmountOnExit
              >
                {modulo.tareas?.map((tarea, tareaIndex) => (
                  <Box
                    key={`${modulo.id}-tarea-${tarea.tareaId}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      borderBottom:
                        tareaIndex === modulo.tareas.length - 1
                          ? "none"
                          : "1px solid #ddd",
                      p: 1,
                      pl: 4, // Indentación para mostrar que son sub-elementos
                      minHeight: 40,
                      backgroundColor: "#f9f9f9",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ flex: 2, pl: 2, fontSize: "1.1rem" }}
                    >
                      {tarea.tareaDescripcion}
                    </Typography>

                    <Box sx={{ flex: 1, textAlign: "center" }}>
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "1.1rem", color: "#666" }}
                      >
                        {permisosModulos[modulo.id]
                          ? "Habilitado"
                          : "Deshabilitado"}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{ flex: 2, fontSize: "1.1rem", color: "#666" }}
                    >
                      • Tarea incluida en el módulo
                    </Typography>
                  </Box>
                ))}
              </Collapse>
            </Box>
          ))}
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2 }}>
            <CustomButton variant="outlined" onClick={handleVolver}>
              Volver
            </CustomButton>

            <CustomButton
              variant="outlined"
              onClick={handleDarAccesoATodo}
              color="secondary"
            >
              Dar acceso a todo
            </CustomButton>

            <CustomButton
              variant="outlined"
              onClick={handleQuitarTodosLosAccesos}
              color="error"
            >
              Quitar todos los accesos
            </CustomButton>
          </Box>

          <CustomButton
            variant="contained"
            onClick={handleGuardarConfiguracion}
            color="primary"
          >
            Guardar Configuración
          </CustomButton>
        </Box>
      </Box>
    </CustomModal>
  );
}