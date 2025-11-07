//src/utils/ui/table/DataTable.tsx

"use client";
import React, { useState, useEffect, useMemo } from "react";
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
    HeaderContext,
    CellContext,
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

// TIPO PARA ACCEDER A LA PROPIEDAD 'meta' CON ALINEACIÓN
type ColumnMeta = {
    align?: 'left' | 'center' | 'right' | 'justify';
};


interface DataTableProps<TData extends object> {
    data: TData[];
    columns: ColumnDef<TData, any>[];
    pageSizeOptions?: number[];
    enableSorting?: boolean;
    enableFiltering?: boolean;
    size?: 'mid' | 'small';
    isLoading?: boolean;
    onRowClick?: (rowData: TData) => void;

    enableRowSelection?: boolean;
    initialRowSelection?: RowSelectionState;
    onRowSelectionChange?: (selectedRows: TData[]) => void;

    // Server-side / controlled pagination
    manualPagination?: boolean;
    pageIndex?: number;
    pageSize?: number;
    pageCount?: number;
    onPageChange?: (newPageIndex: number) => void;
    onPageSizeChange?: (newPageSize: number) => void;
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
    enableRowSelection = false,
    initialRowSelection = {},
    onRowSelectionChange,

     // pagination props
    manualPagination = false,
    pageIndex: pageIndexProp,
    pageSize: pageSizeProp,
    pageCount: pageCountProp,
    onPageChange,
    onPageSizeChange,
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

       // Estado local de paginación (sin controlar o sincronizado cuando viene prop)
    const [localPagination, setLocalPagination] = useState({
        pageIndex: pageIndexProp ?? 0,
        pageSize: pageSizeProp ?? (resolvedProps.pageSizeOptions?.[0] ?? 10),
    });

    // Sincronizar props controladas hacia estado local
    useEffect(() => {
        if (typeof pageIndexProp === "number" && pageIndexProp !== localPagination.pageIndex) {
            setLocalPagination(p => ({ ...p, pageIndex: pageIndexProp! }));
        }
    }, [pageIndexProp]);

    useEffect(() => {
        if (typeof pageSizeProp === "number" && pageSizeProp !== localPagination.pageSize) {
            setLocalPagination(p => ({ ...p, pageSize: pageSizeProp! }));
        }
    }, [pageSizeProp]);

    // Cuando la paginación local cambia, notificar al padre si corresponde
    const handlePaginationChange = (updater: any) => {
        const next = typeof updater === "function" ? updater(localPagination) : updater;
        setLocalPagination(next);
        if (typeof next.pageIndex === "number" && onPageChange) onPageChange(next.pageIndex);
        if (typeof next.pageSize === "number" && onPageSizeChange) onPageSizeChange(next.pageSize);
    };

    const handleRowSelectionChange = (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
        setRowSelection(updater);
    };
    
    // Columna de selección con la alineación definida en meta
    const selectionColumn: ColumnDef<TData, unknown> = {
        id: 'select',
        header: ({ table }: HeaderContext<TData, unknown>) => ( 
            <Checkbox
                checked={table.getIsAllRowsSelected()} 
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    table.toggleAllRowsSelected(e.target.checked); 
                }}
                className={styles.selectionCheckbox}
            />
        ),
        cell: ({ row }: CellContext<TData, unknown>) => ( 
            <Checkbox
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                indeterminate={row.getIsSomeSelected()}
                className={styles.selectionCheckbox}
                onClick={(e) => {
                    e.stopPropagation(); 
                }}
            />
        ),
        size: 50,
        minSize: 50,
        maxSize: 50,
        enableSorting: false, 
        enableHiding: true, 
    };

    const finalColumns = useMemo(() => enableRowSelection
        ? [selectionColumn, ...columns]
        : columns, [enableRowSelection, columns]);

   const table = useReactTable({
        data,
        columns: finalColumns as ColumnDef<TData, any>[],
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
            rowSelection,
            pagination: localPagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: handleRowSelectionChange,
        onPaginationChange: handlePaginationChange,
        getCoreRowModel: getCoreRowModel(),
        // Usar paginación real del motor (si manualPagination true, le pasamos pageCount)
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: enableRowSelection,
        manualPagination: manualPagination, // tanstack v8 prop to indicate server-side paging
        pageCount: manualPagination ? (pageCountProp ?? Math.ceil(data.length / localPagination.pageSize)) : undefined,
        initialState: {
            pagination: {
                pageIndex: localPagination.pageIndex,
                pageSize: localPagination.pageSize,
            }
        }
    });

    // #1. useEffect para notificar al padre (solo depende de rowSelection y el callback estabilizado)
    useEffect(() => {
        if (onRowSelectionChange) {
            const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
            console.log('USE EFFECT (CALLBACK): Filas seleccionadas (Callback al padre):', selectedRows.length);
            onRowSelectionChange(selectedRows);
        }
    }, [rowSelection, onRowSelectionChange, data.length]);


    // #2. useEffect para manejar la visibilidad de la columna 'select'
    useEffect(() => {
        const selectColumn = table.getColumn('select');
        if (selectColumn) {
            selectColumn.toggleVisibility(enableRowSelection);
        }
    }, [enableRowSelection]);

    // Determinación de clases CSS
    const cellPaddingClass = size === 'small' ? styles.smallCell : styles.midCell;
    const headerPaddingClass = size === 'small' ? styles.smallHeader : styles.midHeader;

    return (
        <Box className={styles.tableContainer}>

            {resolvedProps.enableFiltering && (
                <TextField
                    label="Buscar en la tabla:"
                    variant="outlined"
                    value={globalFilter ?? ''}
                    onChange={(e) => setGlobalFilter(String(e.target.value))}
                    className={styles.filterInput}
                />
            )}
            <TableContainer component={Paper} className={styles.paper}>
                <Table className={styles.table} size={size === 'small' ? 'small' : undefined}>
                    <TableHead className={`${styles.tableHead}`}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    // 1. Obtener la alineación y crear la clase dinámica
                                    const meta = header.column.columnDef.meta as ColumnMeta | undefined;
                                    const align = meta?.align || 'left';
                                    const alignClass = styles[`align-${align}`] || styles['align-left'];

                                    return (
                                        <TableCell
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className={`${styles.tableHeaderCell} ${headerPaddingClass} ${alignClass}`}
                                            onClick={resolvedProps.enableSorting && header.id !== 'select' ? header.column.getToggleSortingHandler() : undefined}
                                            style={{ cursor: (resolvedProps.enableSorting && header.id !== 'select') || onRowClick || enableRowSelection ? 'pointer' : 'default' }} 
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
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody>
                        {isLoading ? ( 
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
                                    // Aplicación de clases CSS modular
                                    className={`${styles.tableRow} ${row.getIsSelected() ? styles.selectedRow : ''}`}
                                    onClick={() => {
                                        // Si la selección de fila está habilitada, la fila entera actúa como toggle
                                        if (enableRowSelection) {
                                            row.toggleSelected(!row.getIsSelected());
                                        }
                                        
                                        // Manejo de resaltado simple y callback
                                        setSelectedRowId(row.id);
                                        onRowClick?.(row.original);
                                    }}
                                    // ELIMINAMOS EL SX Y USAMOS STYLE PARA EL CURSOR
                                    style={{ cursor: onRowClick || enableRowSelection ? 'pointer' : 'default' }}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        // 1. Obtener la alineación y crear la clase dinámica
                                        const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
                                        const align = meta?.align || 'left';
                                        const alignClass = styles[`align-${align}`] || styles['align-left'];

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                // APLICAR CLASE DE ALINEACIÓN
                                                className={`${styles.tableBodyCell} ${cellPaddingClass} ${row.id === selectedRowId ? styles.selectedCell : ''} ${alignClass}`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
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

            {/* Controles de paginación */}
            <Box className={styles.paginationContainer}>
                <Box className={styles.paginationIcons}>
                    <IconButton
                        onClick={() => {
                            const target = 0;
                            table.setPageIndex(target);
                            if (onPageChange) onPageChange(target);
                        }}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="primera-página"
                    >
                        <FirstPage />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            const current = table.getState().pagination.pageIndex ?? 0;
                            const target = Math.max(0, current - 1);
                            table.setPageIndex(target);
                            if (onPageChange) onPageChange(target);
                        }}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="página-anterior"
                    >
                        <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            const current = table.getState().pagination.pageIndex ?? 0;
                            const last = table.getPageCount() > 0 ? table.getPageCount() - 1 : 0;
                            const target = Math.min(last, current + 1);
                            table.setPageIndex(target);
                            if (onPageChange) onPageChange(target);
                        }}
                        disabled={!table.getCanNextPage()}
                        aria-label="página-siguiente"
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            const target = table.getPageCount() > 0 ? table.getPageCount() - 1 : 0;
                            table.setPageIndex(target);
                            if (onPageChange) onPageChange(target);
                        }}
                        disabled={!table.getCanNextPage()}
                        aria-label="última-página"
                    >
                        <LastPage />
                    </IconButton>
                </Box>
                <Box>
                    <span>
                        Página{" "}
                        <strong>
                            { (table.getState().pagination.pageIndex ?? 0) + 1 } de { manualPagination ? (pageCountProp ?? table.getPageCount()) : table.getPageCount() }
                        </strong>
                    </span>
                </Box>
            </Box>
        </Box>
    );
}

export default DataTable;