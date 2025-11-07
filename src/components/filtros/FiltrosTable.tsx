"use client"
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import useSWR from "swr";
import { ColumnDef } from "@tanstack/react-table";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QueriesAPI, { FiltroVm, Pagination } from "@/data/queryAPI";
import DataTable from "@/utils/ui/table/DataTable";
import { getObjectKeys } from "@/utils/utils";

//#region types
type Actions = {
  onCreate?: () => void;
  onRead?: (record: FiltroVm) => void;
  onUpdate?: (record: FiltroVm) => void;
  onDelete?: (record: FiltroVm) => void;
  onSelect?: (record: FiltroVm) => void;
}
export type FiltrosTablePageInfo = {
  index: number;
  size: number;
  count: number;
}
export type FiltrosTableContextType = {
  isLoading: boolean;
  data: Pagination<FiltroVm>;
  onPageIndexChange?: (newPageIndex: number) => void;
  onPageSizeChange?: (newPageSize: number) => void;
}
//#endregion types

//#region global
const CRUDActions: Array<keyof Actions> = ["onCreate", "onRead", "onUpdate", "onDelete"];
const { swrGetFilters } = QueriesAPI;
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
  const [{ index, size }, setPage] = useState({ index: 0, size: 100 });
  const [data, setData] = useState<Pagination<FiltroVm>>({ index, size, count: 0, pages: 0, data: [] });

  const { isLoading } = useSWR(
    swrGetFilters.key({ deleted, modulo, sort, page: `${index},${size}`}),
    swrGetFilters.fetcher,
    {
      onSuccess(data) { setData(data); },
    }
  );

  const onPageIndexChange = useCallback((index: number) => setPage((o) => ({...o, index })), []);
  const onPageSizeChange = useCallback((size: number) => setPage((o) => ({...o, size })), []);

  return (
    <FiltrosTableContext.Provider
      value={{
        isLoading,
        data,
        onPageIndexChange,
        onPageSizeChange
      }}
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

export function FiltrosTable(props: Actions & {}) {
  const {
    onCreate = () => {},
    onRead = () => {},
    onUpdate = () => {},
    onDelete = () => {},
    onSelect = () => {},
  } = props;
  const {
    isLoading,
    data: { data, index, size, pages },
    onPageIndexChange,
    onPageSizeChange
  } = useFiltrosTableContext();
  const { columns } = useMemo(() => {
    const actions = getObjectKeys<Actions>(props);
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
                    disabled={!actions.includes("onCreate")}
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
            {actions.includes("onSelect")
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
                      disabled={!actions.includes("onRead")}
                      onClick={() => onRead(row.original)}
                    >
                      <InfoIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar" arrow slotProps={slotProps} >
                    <IconButton
                      color="warning"
                      size="small"
                      disabled={!actions.includes("onUpdate")}
                      onClick={() => onUpdate(row.original)}
                    >
                      <ChangeCircleIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Desactivar" arrow slotProps={slotProps} >
                    <IconButton
                      color="error"
                      size="small"
                      disabled={!actions.includes("onDelete")}
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
  }, [onCreate, onRead, onUpdate, onDelete, onSelect]);
  return (
    <DataTable
      columns={columns}
      isLoading={isLoading}
      data={data}
      manualPagination={true}
      pageIndex={index}
      pageSize={size}
      pageCount={pages}
      onPageChange={onPageIndexChange}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
