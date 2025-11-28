import { DependencyList, useMemo } from "react";
import DataTable from "@/utils/ui/table/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { IconButton, Tooltip } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export type Data<T> = {
  index?: number;
  size?: number;
  pages?: number;
  count?: number;
  data: T[];
};
export type ActionCallback = () => void;
export type Actions = {}
export type CRUDActions<T> = Actions & {
  onCreate?: ActionCallback;
  onRead?: (record: T, index: number) => ActionCallback | undefined;
  onUpdate?: (record: T, index: number) => ActionCallback | undefined;
  onDelete?: (record: T, index: number) => ActionCallback | undefined;
}
export type CRUDSActions<T> = CRUDActions<T> & {
  onSelect?: (record: T, index: number) => ActionCallback | undefined;
}
export type BrowseProps<T extends object, A extends Actions = CRUDSActions<T>> = {
  data: Data<T>;
  isLoading?: boolean;
  manualPagination?: boolean;
  onPageIndexChange?: (index: number) => void;
  onPageSizeChange?: (size: number) => void;
} & A;
export type ColumnsBuilderCallback<T extends object, A extends Actions = CRUDSActions<T>, P extends BrowseProps<T, A> = BrowseProps<T, A>> = (props: P) => ColumnDef<T>[];

const slotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export function defaultActionsColumns<T extends object, A extends Actions = CRUDSActions<T>>(actions: A): ColumnDef<T>[] {
  const columns: ColumnDef<T>[] = [];
  const cruds: CRUDSActions<T> = actions;
  const isCRUD = !!cruds.onCreate || !!cruds.onRead || !!cruds.onUpdate || !!cruds.onDelete;
  if (isCRUD || !!cruds.onSelect) {
    const onCreate = cruds.onCreate;
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
                disabled={!onCreate}
                onClick={() => { if (onCreate) onCreate(); }}
              >
                <AddCircleIcon fontSize="large" />
              </IconButton>
            </Tooltip>
            : null
          }
        </div>
      ),
      cell: ({ row }) => {
        const onSelect = cruds.onSelect ? cruds.onSelect(row.original, row.index) : undefined;
        const onRead = cruds.onRead ? cruds.onRead(row.original, row.index) : undefined;
        const onUpdate = cruds.onUpdate ? cruds.onUpdate(row.original, row.index) : undefined;
        const onDelete = cruds.onDelete ? cruds.onDelete(row.original, row.index) : undefined;
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              paddingRight: "6px",
            }}
          >
            {!!cruds.onSelect
              ? <Tooltip title="Elige" arrow slotProps={slotProps}>
                <IconButton
                  color="primary"
                  size="small"
                  disabled={!onSelect}
                  onClick={() => { if (onSelect) onSelect(); }}
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
                    disabled={!onRead}
                    onClick={() => { if (onRead) onRead(); }}
                  >
                    <InfoIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Editar" arrow slotProps={slotProps} >
                  <IconButton
                    color="primary"
                    size="small"
                    disabled={!onUpdate}
                    onClick={() => { if (onUpdate) onUpdate(); }}
                  >
                    <ChangeCircleIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Borrar" arrow slotProps={slotProps} >
                  <IconButton
                    color="primary"
                    size="small"
                    disabled={!onDelete}
                    onClick={() => { if (onDelete) onDelete(); }}
                  >
                    <RemoveCircleIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </>
              : null
            }
          </div>
        );
      }
    });
  }
  return columns;
}

export default function Browse<
  T extends object,
  A extends Actions = CRUDSActions<T>,
  P extends BrowseProps<T, A> = BrowseProps<T, A>,
>(
  columnsBuilder: ColumnsBuilderCallback<T, A, P> = (props: P) => defaultActionsColumns<T, A>(props)
) {
  function BrowseComponent(props: P) {
    const { isLoading, data: { data, index, size, pages }, onPageIndexChange, onPageSizeChange } = props;
    const manualPagination = props.manualPagination
      ?? ((index !== undefined && onPageIndexChange !== undefined) || (size !== undefined && onPageSizeChange !== undefined));

    return (
      <DataTable
        columns={columnsBuilder({ ...props, manualPagination })}
        isLoading={isLoading}
        data={data}
        manualPagination={manualPagination}
        pageIndex={index}
        pageSize={size}
        pageCount={pages}
        onPageChange={onPageIndexChange}
        onPageSizeChange={onPageSizeChange}
      />
    );
  }
  return BrowseComponent;
}