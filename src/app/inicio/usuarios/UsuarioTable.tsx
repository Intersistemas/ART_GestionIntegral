"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IconButton, Box, Tooltip } from "@mui/material"; 
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility"; 
import SecurityIcon from "@mui/icons-material/Security";
import DataTable from "@/utils/ui/table/DataTable";
import UsuarioRow from "./interfaces/UsuarioRow";
import { useAuth } from "@/data/AuthContext";
import { Delete, GroupAdd, GroupRemove } from "@mui/icons-material";
import Formato from "@/utils/Formato";

interface Props {
  data: UsuarioRow[];
  onEdit: (row: UsuarioRow) => void;
  onDelete: (row: UsuarioRow) => void; 
  onView: (row: UsuarioRow) => void;
  onPermisos: (row: UsuarioRow) => void;
  onActivate: (row: UsuarioRow) => void;
  onRemove: (row: UsuarioRow) => void;
  isLoading: boolean;
}

export default function UsuarioTable({ data, onEdit, onDelete, onView, onActivate, onRemove, onPermisos, isLoading }: Props) {
  const { user } = useAuth();  
  const isAdmin = user?.rol?.toLowerCase() === "administrador";
  
  const columns = useMemo<ColumnDef<UsuarioRow>[]>(
    () => [
      { accessorKey: "cuit", header: "CUIT", cell: (info: any) => Formato.CUIP(info.getValue()), meta: { align: 'center'} },
      { accessorKey: "nombre", header: "Nombre", meta: { align: 'center'} },
      { accessorKey: "email", header: "Email", meta: { align: 'center'} },
      { accessorKey: "rol", header: "Rol", meta: { align: 'center'} },
      { accessorKey: "cargoDescripcion", header: "Cargo/Función", meta: { align: 'center'} },
      { accessorKey: "estado", header: "Estado", meta: { align: 'center'} },
      { accessorKey: "phoneNumber", header: "Teléfono", meta: { align: 'center'} },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const isRowUserAdmin = row.original.rol?.toLowerCase() === "administrador";
          
          return (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {isAdmin &&
                isRowUserAdmin &&
                row.original.estado === "Activo" && (
                  <>
                    <Tooltip
                      title="Editar usuario"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.2rem",
                            fontWeight: 500,
                          },
                        },
                      }}
                    >
                      <IconButton
                        onClick={() => onEdit(row.original)}
                        color="warning"
                        size="small"
                      >
                        <EditIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title="Ver detalles"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.2rem",
                            fontWeight: 500,
                          },
                        },
                      }}
                    >
                      <IconButton
                        onClick={() => onView(row.original)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>                    
                  </>
                )}
              {isAdmin &&
                !isRowUserAdmin &&
                row.original.estado === "Activo" && (
                  <>
                    <Tooltip
                      title="Editar usuario"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.2rem",
                            fontWeight: 500,
                          },
                        },
                      }}
                    >
                      <IconButton
                        onClick={() => onEdit(row.original)}
                        color="warning"
                        size="small"
                      >
                        <EditIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title="Ver detalles"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.2rem",
                            fontWeight: 500,
                          },
                        },
                      }}
                    >
                      <IconButton
                        onClick={() => onView(row.original)}
                        color="primary"
                        size="small"
                      >
                        <VisibilityIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title="Configurar permisos"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.2rem",
                            fontWeight: 500,
                          },
                        },
                      }}
                    >
                      <IconButton
                        onClick={() => onPermisos(row.original)}
                        color="success"
                        size="small"
                      >
                        <SecurityIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title="Desactivar usuario"
                      arrow
                      slotProps={{
                        tooltip: {
                          sx: {
                            fontSize: "1.2rem",
                            fontWeight: 500,
                          },
                        },
                      }}
                    >
                      <IconButton
                        onClick={() => onDelete(row.original)}
                        color="error"
                        size="small"
                      >
                        <GroupRemove fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              {isAdmin && row.original.estado === "Inactivo" && (
                <>
                  <Tooltip
                    title="Activar usuario"
                    arrow
                    slotProps={{
                      tooltip: {
                        sx: {
                          fontSize: "1.2rem",
                          fontWeight: 500,
                        },
                      },
                    }}
                  >
                    <IconButton
                      onClick={() => onActivate(row.original)}
                      color="primary"
                      size="small"
                    >
                      <GroupAdd fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </>
              )}
            </Box>
          );
        },
        size: 150,
      meta: { align: 'center'} },
    ],
    [onEdit, onDelete, onView, onPermisos, onActivate, isAdmin]
  );

  return <DataTable data={data} columns={columns}  isLoading={isLoading} />;
}