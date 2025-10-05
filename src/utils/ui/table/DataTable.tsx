"use client";
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
} from "@tanstack/react-table";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Box,
  IconButton,
  TextField,
  CircularProgress,
  Checkbox
} from "@mui/material";

import {
  ArrowDownward,
  ArrowUpward,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage,
} from "@mui/icons-material";
import styles from "./DataTable.module.css";


interface DataTableProps<TData extends object> {

  data: TData[];
  columns: ColumnDef<TData, any>[];
  pageSizeOptions?: number[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  size?: 'mid' | 'small';
  isLoading?: boolean;
  onRowClick?: (rowData: TData) => void;

  // 💡 NUEVAS PROPIEDADES PARA SELECCIÓN
  enableRowSelection?: boolean; // Activa la funcionalidad de selección
  initialRowSelection?: RowSelectionState; // Estado inicial de selección
  onRowSelectionChange?: (selectedRows: TData[]) => void; // Callback para filas seleccionadas
}

export function DataTable<TData extends object>({

  data,
  columns,
  pageSizeOptions,
  enableSorting,
  enableFiltering,
  size = 'mid',
  isLoading = false,
  onRowClick,
  enableRowSelection = false, // Valor por defecto
  initialRowSelection = {},
  onRowSelectionChange,
}: DataTableProps<TData>) {

  const defaultProps = {
    mid: {
      pageSizeOptions: [10, 20, 30, 40, 50],
      enableSorting: true,
      enableFiltering: true,
    },

    small: {
      pageSizeOptions: [5, 10, 15],
      enableSorting: true,
      enableFiltering: true,
    }

  };

  const resolvedProps = {
    ...defaultProps[size],
    pageSizeOptions: pageSizeOptions ?? defaultProps[size].pageSizeOptions,
    enableSorting: enableSorting ?? defaultProps[size].enableSorting,
    enableFiltering: enableFiltering ?? defaultProps[size].enableFiltering,
  };



  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialRowSelection);

  // 💡 Función de utilidad para manejar los cambios de selección
  const handleRowSelectionChange = (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {

    setRowSelection(updater);
    // Llamar al callback con las filas seleccionadas
    if (onRowSelectionChange) {
      const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;
      const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
      onRowSelectionChange(selectedRows);
    }
  };

 

  // 💡 NUEVA COLUMNA DE SELECCIÓN

  const selectionColumn: ColumnDef<TData> = {
    id: 'select',

    header: ({ table }) => (
      // Checkbox para seleccionar/deseleccionar todas las filas
      <Checkbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        className={styles.selectionCheckbox}
      />
    ),
    cell: ({ row }) => (
      // Checkbox individual para la fila
      <Checkbox
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        indeterminate={row.getIsSomeSelected()}
        onChange={row.getToggleSelectedHandler()}
        className={styles.selectionCheckbox}
      />
    ),
    size: 50, // Pequeño tamaño para el checkbox
    minSize: 50,
    maxSize: 50,
  };

  // 💡 Ensamblar la lista final de columnas
  const finalColumns: ColumnDef<TData, any>[] = enableRowSelection
    ? [selectionColumn, ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: finalColumns, 
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
      rowSelection, 
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: handleRowSelectionChange, // 💡 NUEVO: Handler de selección
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: enableRowSelection, // 💡 Habilitar/Deshabilitar la selección
    initialState: {
      pagination: {
        pageSize: resolvedProps.pageSizeOptions?.[0] ?? 10
      }
    }
  });

  const cellPaddingClass = size === 'small' ? styles.smallCell : styles.midCell;
  const headerPaddingClass = size === 'small' ? styles.smallHeader : styles.midHeader;

  return (
    <Box className={styles.tableContainer}>

      {resolvedProps.enableFiltering && (
        <TextField
          label="Buscar en la tabla..."
          variant="outlined"
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(String(e.target.value))}
          className={styles.filterInput}
        />
      )}
      <TableContainer component={Paper} className={styles.paper}>
        <Table className={styles.table}>
          <TableHead className={`${styles.tableHead}`}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`${styles.tableHeaderCell} ${headerPaddingClass}`}
                    // 💡 Condición para desactivar sorting en la columna de selección
                    onClick={resolvedProps.enableSorting && header.id !== 'select' ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {header.isPlaceholder ? null : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                      {resolvedProps.enableSorting && header.column.getIsSorted() && (
                        header.column.getIsSorted() === 'asc' ? <ArrowUpward className={styles.sortIcon} /> : <ArrowDownward className={styles.sortIcon} />
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {isLoading ? ( /* ... (Carga/Loading sin cambios) ... */
              <TableRow>
                <TableCell colSpan={finalColumns.length} className={styles.loadingCell}>
                  <CircularProgress color="primary" />
                  <Box mt={2}>Cargando...</Box>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`${styles.tableRow} ${row.getIsSelected() ? styles.selectedRow : ''}`}
                  // 💡 Si hay onRowClick, el click en la fila lo maneja, sino, el checkbox
                  onClick={() => {
                    setSelectedRowId(row.id);
                    onRowClick?.(row.original);
                  }}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={`${styles.tableBodyCell} ${cellPaddingClass} ${row.id === selectedRowId ? styles.selectedCell : ''}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className={styles.noDataCell}>
                  No se encontraron datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className={styles.paginationContainer}>
        <Box className={styles.paginationIcons}>
          <IconButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} aria-label="primera-página">
            <FirstPage />
          </IconButton>
          <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="página-anterior">
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="página-siguiente">
            <KeyboardArrowRight />
          </IconButton>
          <IconButton onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} aria-label="última-página">
            <LastPage />
          </IconButton>
        </Box>
        <Box>
          <span>
            Página{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </strong>
          </span>
        </Box>
      </Box>
    </Box>
  );
}

export default DataTable;