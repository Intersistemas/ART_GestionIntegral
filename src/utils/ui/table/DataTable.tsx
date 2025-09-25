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
} from "@tanstack/react-table";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Box, IconButton, TextField, CircularProgress } from "@mui/material";
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

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
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
                    onClick={resolvedProps.enableSorting ? header.column.getToggleSortingHandler() : undefined}
                    sx={{
                      cursor: resolvedProps.enableSorting ? 'pointer' : 'default',
                      width: header.getSize() === 150 ? 'auto' : header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className={styles.loadingCell}>
                  <CircularProgress color="primary" />
                  <Box mt={2}>Cargando...</Box>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={styles.tableRow}
                  onClick={() => {
                    onRowClick?.(row.original);
                    setSelectedRowId(row.id);
                  }}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      // Aplica la clase `selectedCell` a cada celda si la fila está seleccionada.
                      className={`${styles.tableBodyCell} ${cellPaddingClass} ${row.id === selectedRowId ? styles.selectedCell : ''}`}
                      sx={{
                        width: cell.column.getSize() === 150 ? 'auto' : cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className={styles.noDataCell}>
                  No se encontraron datos.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className={styles.paginationContainer}>
        <Box>
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