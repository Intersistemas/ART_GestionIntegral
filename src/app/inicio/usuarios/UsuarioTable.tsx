"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DataTable from "@/utils/ui/table/DataTable";
import UsuarioRow from "./interfaces/UsuarioRow";

interface Props {
  data: UsuarioRow[];
  onEdit: (row: UsuarioRow) => void;
  isLoading: boolean;
}

export default function UsuarioTable({ data, onEdit, isLoading }: Props) {
  const columns = useMemo<ColumnDef<UsuarioRow>[]>(
    () => [
      { accessorKey: "cuit", header: "CUIT" },
      { accessorKey: "nombre", header: "Nombre" },
      { accessorKey: "tipo", header: "Tipo" },
      { accessorKey: "userName", header: "Usuario" },
      { accessorKey: "email", header: "Email" },
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
          <IconButton onClick={() => onEdit(row.original)} color="warning">
            <EditIcon />
          </IconButton>
        ),
      },
    ],
    [onEdit]
  );

  return <DataTable data={data} columns={columns} size="mid"/>;
}