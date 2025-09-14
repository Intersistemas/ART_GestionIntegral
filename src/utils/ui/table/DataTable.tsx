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
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper, Box, IconButton, TextField } from "@mui/material";
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
}

export function DataTable<TData extends object>({
  data,
  columns,
  pageSizeOptions = [10, 20, 30, 40, 50],
  enableSorting = true,
  enableFiltering = true,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState('');

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
  });

  return (
    <Box className={styles.tableContainer}>
      {enableFiltering && (
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
          <TableHead className={styles.tableHead}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    colSpan={header.colSpan}
                    className={styles.tableHeaderCell}
                    onClick={enableSorting ? header.column.getToggleSortingHandler() : undefined}
                    sx={{ cursor: enableSorting ? 'pointer' : 'default' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {header.isPlaceholder ? null : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                      {enableSorting && header.column.getIsSorted() && (
                        header.column.getIsSorted() === 'asc' ? <ArrowUpward className={styles.sortIcon} /> : <ArrowDownward className={styles.sortIcon} />
                      )}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={styles.tableRow}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={styles.tableBodyCell}>
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