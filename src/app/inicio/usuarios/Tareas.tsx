"use client";

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Switch, FormControlLabel } from '@mui/material';
import CustomModal from '@/utils/ui/form/CustomModal';
import ITarea from './interfaces/ITarea';
import UsuarioRow from './interfaces/UsuarioRow';
import styles from './Usuario.module.css';
import CustomButton from '@/utils/ui/button/CustomButton';

interface TareasProps {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioRow | null;
  onSave: (permisos: PermisosUsuario[]) => void;
}

interface PermisosUsuario {
  tareaId: number;
  habilitada: boolean;
}

interface TareaAgrupada {
  moduloDescripcion: string;
  tareas: {
    id: number;
    tareaId: number;
    tareaDescripcion: string;
    habilitada: boolean;
  }[];
}

export default function Tareas({ open, onClose, usuario, onSave }: TareasProps) {
  const [tareasAgrupadas, setTareasAgrupadas] = useState<TareaAgrupada[]>([]);
  const [permisos, setPermisos] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (usuario?.tareas) {
      // Agrupar tareas por módulo
      const gruposMap = new Map<string, TareaAgrupada>();
      
      usuario.tareas.forEach(tarea => {
        if (!gruposMap.has(tarea.moduloDescripcion)) {
          gruposMap.set(tarea.moduloDescripcion, {
            moduloDescripcion: tarea.moduloDescripcion,
            tareas: []
          });
        }
        
        gruposMap.get(tarea.moduloDescripcion)!.tareas.push({
          id: tarea.id,
          tareaId: tarea.tareaId,
          tareaDescripcion: tarea.tareaDescripcion,
          habilitada: tarea.habilitada ?? true // Usa el valor de la API o true por defecto
        });
      });

      const grupos = Array.from(gruposMap.values());
      setTareasAgrupadas(grupos);

      // Inicializar permisos con el estado actual de la API
      const permisosIniciales: Record<number, boolean> = {};
      usuario.tareas.forEach(tarea => {
        permisosIniciales[tarea.tareaId] = tarea.habilitada ?? true;
      });
      setPermisos(permisosIniciales);
    }
  }, [usuario]);

  const handlePermisoChange = (tareaId: number, habilitada: boolean) => {
    setPermisos(prev => ({
      ...prev,
      [tareaId]: habilitada
    }));
  };

  const handleGuardarConfiguracion = () => {
    const permisosArray: PermisosUsuario[] = Object.entries(permisos).map(([tareaId, habilitada]) => ({
      tareaId: parseInt(tareaId),
      habilitada
    }));
    
    onSave(permisosArray);
    onClose();
  };

  const handleVolver = () => {
    onClose();
  };

  const handleDarAccesoATodo = () => {
    const nuevosPermisos: Record<number, boolean> = {};
    usuario?.tareas.forEach(tarea => {
      nuevosPermisos[tarea.tareaId] = true;
    });
    setPermisos(nuevosPermisos);
  };

  const handleQuitarTodosLosAccesos = () => {
    const nuevosPermisos: Record<number, boolean> = {};
    usuario?.tareas.forEach(tarea => {
      nuevosPermisos[tarea.tareaId] = false;
    });
    setPermisos(nuevosPermisos);
  };

  if (!usuario) {
    return null;
  }

  console.log("usuario en Tareas:", usuario);
  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={`Configuración de Permisos - ${usuario.nombre}`}
      size="large"
    >
      <Box sx={{ p: 2 }}>
        {/* Información del usuario */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, fontSize: '1.8rem' }}>
          Administración de Usuarios &gt; {usuario.nombre} &gt; Configuración de Permisos
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '1.5rem' }}><strong>Usuario:</strong> {usuario.email}</Typography>
          <Typography variant="body2" sx={{ fontSize: '1.5rem' }}><strong>Cargo:</strong> {usuario.cargo}</Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 3, fontSize: '1.5rem' }}>
          Seleccione a qué módulos tendrá acceso este usuario:
        </Typography>

        {/* Tabla de permisos */}
        <Box sx={{ border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden', mb: 3 }}>
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            backgroundColor: '#f5f5f5', 
            borderBottom: '1px solid #ddd',
            p: 1
          }}>
            <Typography variant="body2" sx={{ flex: 2, fontWeight: 'bold', fontSize: '1.3rem' }}>
              Opción del Menú
            </Typography>
            <Typography variant="body2" sx={{ flex: 1, fontWeight: 'bold', textAlign: 'center', fontSize: '1.3rem' }}>
              Acceso (S/N)
            </Typography>
            <Typography variant="body2" sx={{ flex: 2, fontWeight: 'bold', fontSize: '1.3rem' }}>
              Información sobre permisos
            </Typography>
          </Box>

          {/* Contenido */}
          {tareasAgrupadas.map((grupo, grupoIndex) => (
            <Box key={grupo.moduloDescripcion}>
              {/* Header del grupo/módulo */}
              <Box sx={{ 
                backgroundColor: '#e8f4f8', 
                p: 1, 
                borderBottom: '1px solid #ddd',
                fontWeight: 'bold'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                  {grupo.moduloDescripcion}
                </Typography>
              </Box>
              
              {/* Tareas del grupo */}
              {grupo.tareas.map((tarea, tareaIndex) => (
                <Box 
                  key={tarea.tareaId}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    borderBottom: tareaIndex === grupo.tareas.length - 1 && grupoIndex === tareasAgrupadas.length - 1 
                      ? 'none' 
                      : '1px solid #ddd',
                    p: 1,
                    minHeight: 40
                  }}
                >
                  <Typography variant="body2" sx={{ flex: 2, pl: 2, fontSize: '1.2rem' }}>
                    {tarea.tareaDescripcion}
                  </Typography>
                  
                  <Box sx={{ flex: 1, textAlign: 'center' }}>
                    <Box 
                      sx={{ 
                        display: 'inline-block',
                        width: 30,
                        height: 20,
                        borderRadius: '3px',
                        backgroundColor: permisos[tarea.tareaId] ? '#4CAF50' : '#f44336',
                        color: 'white',
                        textAlign: 'center',
                        lineHeight: '20px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                      onClick={() => handlePermisoChange(tarea.tareaId, !permisos[tarea.tareaId])}
                    >
                      {permisos[tarea.tareaId] ? 'S' : 'N'}
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" sx={{ flex: 2, fontSize: '1.2rem', color: '#666' }}>
                    {permisos[tarea.tareaId] 
                      ? '• Tiene acceso al módulo'
                      : '• No tiene acceso al módulo'}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>

        {/* Botones de acción */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <CustomButton 
              variant="outlined" 
              onClick={handleVolver}
            >
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
