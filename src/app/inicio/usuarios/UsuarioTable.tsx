"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IconButton, Box } from "@mui/material"; 
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility"; 
import DataTable from "@/utils/ui/table/DataTable";
import UsuarioRow from "./interfaces/UsuarioRow";

interface Props {
  data: UsuarioRow[];
  onEdit: (row: UsuarioRow) => void;
  onDelete: (row: UsuarioRow) => void; 
  onView: (row: UsuarioRow) => void;
  isLoading: boolean;
}

export default function UsuarioTable({ data, onEdit, onDelete, onView, isLoading }: Props) {
  const columns = useMemo<ColumnDef<UsuarioRow>[]>(
    () => [
      { accessorKey: "cuit", header: "CUIT" },
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "tipo", header: "Tipo" },
      { accessorKey: "userName", header: "Usuario" },
      { accessorKey: "email", header: "Email" },
      { accessorKey: "rol", header: "Rol" },
      { accessorKey: "cargo", header: "Cargo/Funcion" },
      {
        accessorKey: "emailConfirmed",
        header: "Email Confirmado",
        cell: (info) => (info.getValue() ? "Sí" : "No"),
      },
      { accessorKey: "phoneNumber", header: "Número de Teléfono" },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton onClick={() => onEdit(row.original)} color="warning" size="small">
              <EditIcon fontSize="large"/>
            </IconButton>
            <IconButton onClick={() => onView(row.original)} color="primary" size="small">
              <VisibilityIcon fontSize="large"/>
            </IconButton>
            <IconButton onClick={() => onDelete(row.original)} color="error" size="small">
              <DeleteIcon fontSize="large"/>
            </IconButton>
          </Box>
        ),
        size: 150, 
      },
    ],
    [onEdit, onDelete, onView] 
  );

  return <DataTable data={data} columns={columns}  isLoading={isLoading} />;
}