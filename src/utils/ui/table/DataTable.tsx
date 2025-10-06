"use client";
import React, { useState, useEffect, useMemo } from "react"; // Añadido useMemo
import {
    // ... imports de TanStack/React-Table
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
// ... imports de Material UI y estilos ...
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

    enableRowSelection?: boolean;
    initialRowSelection?: RowSelectionState;
    onRowSelectionChange?: (selectedRows: TData[]) => void;
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
}: DataTableProps<TData>) {

    // ... (Inicialización de props resueltas y useStates) ...
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
    // Usar initialRowSelection solo al montar:
    const [rowSelection, setRowSelection] = useState<RowSelectionState>(initialRowSelection);


    const handleRowSelectionChange = (updater: RowSelectionState | ((old: RowSelectionState) => RowSelectionState)) => {
        setRowSelection(updater);
        // Descomenta si necesitas depuración de estado:
        // console.log('HANDLER CHANGE: Estado de rowSelection actualizado.');
    };
    
    // Columna de selección con el manejo manual del header (mantenido)
    const selectionColumn: ColumnDef<TData> = {
        id: 'select',
        header: ({ table }: HeaderContext<TData, unknown>) => ( 
            <Checkbox
                checked={table.getIsAllRowsSelected()} 
                indeterminate={table.getIsSomeRowsSelected()}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    // console.log('HEADER CHECKBOX: Clic en el header. Nuevo estado:', e.target.checked);
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
        : columns, [enableRowSelection, columns]); // Estabilizar finalColumns

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
        onRowSelectionChange: handleRowSelectionChange, 
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        enableRowSelection: enableRowSelection,
        initialState: {
            pagination: {
                pageSize: resolvedProps.pageSizeOptions?.[0] ?? 10
            }
        }
    });

    // #1. useEffect para notificar al padre (solo depende de rowSelection y el callback estabilizado)
    useEffect(() => {
        if (onRowSelectionChange) {
            // Obtenemos las filas seleccionadas *sincrónicamente* del modelo de la tabla
            const selectedRows = table.getSelectedRowModel().flatRows.map(row => row.original);
            console.log('USE EFFECT (CALLBACK): Filas seleccionadas (Callback al padre):', selectedRows.length);
            onRowSelectionChange(selectedRows);
        }
    }, [rowSelection, onRowSelectionChange, data.length]); // Añadimos data.length como una dependencia proxy estable.


    // #2. useEffect para manejar la visibilidad de la columna 'select'
    useEffect(() => {
        const selectColumn = table.getColumn('select');
        if (selectColumn) {
            // Utilizamos el método seguro toggleVisibility
            selectColumn.toggleVisibility(enableRowSelection);
        }
    }, [enableRowSelection]); // Dependencia más limpia


    // ... (Resto del JSX de la tabla) ...
    // Determinación de clases CSS
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
                <Table className={styles.table} size={size === 'small' ? 'small' : undefined}>
                    <TableHead className={`${styles.tableHead}`}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className={`${styles.tableHeaderCell} ${headerPaddingClass}`}
                                        // Clic para sorting (excluyendo la columna de selección)
                                        onClick={resolvedProps.enableSorting && header.id !== 'select' ? header.column.getToggleSortingHandler() : undefined}
                                        // Estilo de cursor condicional usando sx para el cursor
                                        sx={{ cursor: (resolvedProps.enableSorting && header.id !== 'select') ? 'pointer' : 'default' }} 
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
                                    sx={{ cursor: 'pointer' }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            // Aplicación de clases CSS modular
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

            {/* Controles de paginación */}
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