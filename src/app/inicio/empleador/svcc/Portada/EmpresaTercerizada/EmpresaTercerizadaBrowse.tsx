import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { EmpresaTercerizadaDTO, Pagination } from "@/data/gestionEmpleadorAPI";
import Formato from "@/utils/Formato";
import DataTable from "@/utils/ui/table/DataTable";

export type EmpresaTercerizadaBrowseActions = {
  onCreate?: () => void;
  onRead?: (record: EmpresaTercerizadaDTO, index: number) => void;
  onUpdate?: (record: EmpresaTercerizadaDTO, index: number) => void;
  onDelete?: (record: EmpresaTercerizadaDTO, index: number) => void;
  onSelect?: (record: EmpresaTercerizadaDTO, index: number) => void;
}
export type EmpresaTercerizadaBrowseProps = {
  isLoading: boolean;
  data: Pagination<EmpresaTercerizadaDTO>;
  onPageIndexChange: (index: number) => void;
  onPageSizeChange: (size: number) => void;
} & EmpresaTercerizadaBrowseActions;

const slotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };

export default function EmpresaTercerizadaBrowse(props: EmpresaTercerizadaBrowseProps) {
  const actions: EmpresaTercerizadaBrowseActions = props;
  const { isLoading, data: { data, index, size, pages }, onPageIndexChange, onPageSizeChange } = props;
  const { columns } = useMemo(() => {
    const columns: ColumnDef<EmpresaTercerizadaDTO>[] = [
      { accessorKey: "idEstablecimientoEmpresa", header: "Establ. Empresa" },
      { accessorKey: "cuit", header: "CUIT", cell: ({ getValue }) => Formato.CUIP(getValue()) },
      { accessorKey: "ciiu", header: "CIIU" },
      { accessorKey: "cantidadTrabajadores", header: "Cant. Trab." },
    ];
    const isCRUD = !!actions.onCreate || !!actions.onRead || !!actions.onUpdate || !!actions.onDelete;
    if (isCRUD || !!actions.onSelect) {
      const {
        onCreate = () => {},
        onRead = () => {},
        onUpdate = () => {},
        onDelete = () => {},
        onSelect = () => {},
      } = actions;
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
              ? <Tooltip title="Agrega" arrow slotProps={slotProps}>
                  <IconButton
                    color="primary"
                    size="small"
                    disabled={!actions.onCreate}
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
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              paddingRight: "6px",
            }}
          >
            {!!actions.onSelect
              ? <Tooltip title="Elige" arrow slotProps={slotProps}>
                  <IconButton
                    color="primary"
                    size="small"
                    disabled={!actions.onSelect}
                    onClick={() => onSelect(row.original, row.index)}
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
                      disabled={!actions.onRead}
                      onClick={() => onRead(row.original, row.index)}
                    >
                      <InfoIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar" arrow slotProps={slotProps} >
                    <IconButton
                      color="primary"
                      size="small"
                      disabled={!actions.onUpdate}
                      onClick={() => onUpdate(row.original, row.index)}
                    >
                      <ChangeCircleIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Borrar" arrow slotProps={slotProps} >
                    <IconButton
                      color="primary"
                      size="small"
                      disabled={!actions.onDelete}
                      onClick={() => onDelete(row.original, row.index)}
                    >
                      <RemoveCircleIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </>
              : null
            }
          </div>
        )
      });
    }
    return { columns };
  }, [actions]);
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