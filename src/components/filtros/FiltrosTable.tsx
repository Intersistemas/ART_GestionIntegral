"use client"
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import QueriesAPI, { FiltroVm, Pagination } from "@/data/queryAPI";
import DataTable from "@/utils/ui/table/DataTable";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useSWR from "swr";

//#region types
export type TableAction = "Create" | "Read" | "Update" | "Delete" | "Select";
export type FiltrosTablePageInfo = {
  index: number;
  size: number;
  count: number;
}
export type FiltrosTableContextType = {
  isLoading: boolean;
  data: Pagination<FiltroVm>;
}
//#endregion types

//#region global
const { swrGetFilters } = QueriesAPI;
const CRUDActions: TableAction[] = ["Create", "Read", "Update", "Delete" ];
const FiltrosTableContext = createContext<FiltrosTableContextType | undefined>(undefined);
const slotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
//#endregion global

export function FiltrosTableContextProvider({
  deleted,
  modulo,
  sort,
  children
}: {
  deleted?: boolean,
  modulo?: string,
  sort?: string,
  children: ReactNode
}) {
  const [data, setData] = useState<Pagination<FiltroVm>>({ index: 0, size: 100, count: 0, pages: 0, data: [] });

  const { isLoading } = useSWR(
    swrGetFilters.key({ deleted, modulo, sort, page: `${data.index},${data.size}`}),
    swrGetFilters.fetcher,
    {
      onSuccess(data) { setData(data); },
    }
  );

  return (
    <FiltrosTableContext.Provider
      value={{ isLoading, data }}
    >
      {children}
    </FiltrosTableContext.Provider>
  );
}

export function useFiltrosTableContext() {
  const context = useContext(FiltrosTableContext)
  if (context === undefined) throw new Error('useFiltrosTableContext must be used within a FiltrosTableContextProvider');
  return context
}

const ambitos = {
  todos: "Todos",
  rol: "Rol",
  usuario: "Usuario",
}
function getAmbitoDescripcion(ambito: any) { return ambitos[`${ambito}`] ?? ambito }
export function FiltrosTable({
  actions = [],
  onCreate = () => {},
  onRead = () => {},
  onUpdate = () => {},
  onDelete = () => {},
  onSelect = () => {},
}: {
  actions?: TableAction[],
  onCreate?: () => void;
  onRead?: (record: FiltroVm) => void;
  onUpdate?: (record: FiltroVm) => void;
  onDelete?: (record: FiltroVm) => void;
  onSelect?: (record: FiltroVm) => void;
}) {
  const { isLoading, data: { data: rows } } = useFiltrosTableContext();
  const { columns } = useMemo(
    () => {
      const columns: ColumnDef<FiltroVm>[] = [
        { accessorKey: "nombre", header: () => <div style={{ width: "756px" }}>Nombre</div> },
        { accessorKey: "ambito", header: "Ámbito", cell: ({ getValue }) => getAmbitoDescripcion(getValue()) },
      ];
      const isCRUD = actions.filter(a => CRUDActions.includes(a)).length > 0;
      if (actions.length) {
        columns.push({
          id: "actions",
          size: 150,
          header: () => (
            <div style={{
              display: "flex",
              width: "-webkit-fill-available",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <>Acciones</>
              {isCRUD
                ? <Tooltip title="Agrega" arrow slotProps={slotProps} >
                    <IconButton
                      color="primary"
                      size="small"
                      disabled={!actions.includes("Create")}
                      onClick={() => onCreate()}
                    >
                      <AddCircleIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                : null
              }
            </div>
          ),
          cell: ({ row }) => (
            <div style={{
              display: "flex",
              justifyContent: "end",
              paddingRight: "6px",
            }}>
              {actions.includes("Select")
                ? <Tooltip title="Elige" arrow slotProps={slotProps} >
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => onSelect(row.original)}
                    >
                      <CheckCircleIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                : null
              }
              {isCRUD
                ? <>
                    <Tooltip title="Ver" arrow slotProps={slotProps} >
                      <IconButton
                        color="primary"
                        size="small"
                        disabled={!actions.includes("Read")}
                        onClick={() => onRead(row.original)}
                      >
                        <InfoIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Editar" arrow slotProps={slotProps} >
                      <IconButton
                        color="warning"
                        size="small"
                        disabled={!actions.includes("Update")}
                        onClick={() => onUpdate(row.original)}
                      >
                        <ChangeCircleIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Desactivar" arrow slotProps={slotProps} >
                      <IconButton
                        color="error"
                        size="small"
                        disabled={!actions.includes("Delete")}
                        onClick={() => onDelete(row.original)}
                      >
                        <RemoveCircleIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </>
                : null
              }
            </div>
          )
        })
      }
      return { columns };
    },
    [onCreate, onRead, onUpdate, onDelete, onSelect]
  );
  return <DataTable data={rows} columns={columns} isLoading={isLoading} />
}
