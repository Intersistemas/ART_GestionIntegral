"use client";
import React, { useMemo, useState } from 'react';
import DataTable from '@/utils/ui/table/DataTable'; 
import CustomButton from '@/utils/ui/button/CustomButton';
import { ColumnDef } from '@tanstack/react-table';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CustomTab from '@/utils/ui/tab/CustomTab';

// ----------------------------------------------------
// 1. INTERFAZ DE DATOS (Basada en la tabla adjunta de Cuenta Corriente y la tabla de DDJJ)
// ----------------------------------------------------
type CuentaCorrienteRegistro = {
    periodoCobertura: string;
    periodoDDJJ: string;
    fechaPresentacion: string;
    tipo: 'R' | 'O';
    masaSalarial: number;
    cantTrabajadores: number;
    alicFija: number;
    alicVar: number;
    alicFijaFFEPDeclarado: number;
    alicVarDeclarado: number;
    premioAPagar: number;
    deduccionDevengado: number;
    totalFFEP: number;
    totalSRES: number;
    totalCuotaAPagar: number;
    totalPagadoCuota: number;
    saldoMensual: number;
}

type DDJJRegistro = {
    periodoDDJJ: string;
    presentacion: string;	
    tipo: string;	
    alicFija: string; 	
    alicVariable: string;
    cantTrabajadores: string;
    masaSalarial: string;
}


// ----------------------------------------------------
// 2. DATOS DE EJEMPLO (GENERADOS A PARTIR DE LA IMAGEN)
// ----------------------------------------------------
const cuentaCorrienteData: CuentaCorrienteRegistro[] = [
    {
        periodoCobertura: '2021-10', periodoDDJJ: '2021-11', fechaPresentacion: '2021-11-30', tipo: 'R', masaSalarial: 336.200, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 45.98, alicVarDeclarado: 8.4, premioAPagar: 22.189, deduccionDevengado: 245.90, totalFFEP: 49.98, totalSRES: 28.490, totalCuotaAPagar: 24.439, totalPagadoCuota: 28.490, saldoMensual: -6.051
    },
    {
        periodoCobertura: '2021-12', periodoDDJJ: '2021-12', fechaPresentacion: '2021-12-06', tipo: 'R', masaSalarial: 360.332, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 45.98, alicVarDeclarado: 6.66, premioAPagar: 23.775, deduccionDevengado: 245.90, totalFFEP: 49.98, totalSRES: 24.225, totalCuotaAPagar: 24.225, totalPagadoCuota: 24.241, saldoMensual: -216.14
    },
    {
        periodoCobertura: '2022-01', periodoDDJJ: '2021-12', fechaPresentacion: '2021-12-29', tipo: 'O', masaSalarial: 503.544, cantTrabajadores: 27, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 45.98, alicVarDeclarado: 6.66, premioAPagar: 33.233, deduccionDevengado: 245.90, totalFFEP: 49.98, totalSRES: 33.483, totalCuotaAPagar: 33.483, totalPagadoCuota: 33.785, saldoMensual: -302.13
    },
    {
        periodoCobertura: '2022-02', periodoDDJJ: '2022-01', fechaPresentacion: '2022-01-31', tipo: 'O', masaSalarial: 365.022, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 100, alicVarDeclarado: 6.66, premioAPagar: 24.091, deduccionDevengado: 500.00, totalFFEP: 100, totalSRES: 24.591, totalCuotaAPagar: 24.591, totalPagadoCuota: 24.810, saldoMensual: -219.01
    },
    {
        periodoCobertura: '2022-03', periodoDDJJ: '2022-02', fechaPresentacion: '2022-02-20', tipo: 'O', masaSalarial: 368.694, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 100, alicVarDeclarado: 6.66, premioAPagar: 24.333, deduccionDevengado: 500.00, totalFFEP: 100, totalSRES: 24.833, totalCuotaAPagar: 24.833, totalPagadoCuota: 25.054, saldoMensual: -221.20
    },
    {
        periodoCobertura: '2022-04', periodoDDJJ: '2022-03', fechaPresentacion: '2022-03-31', tipo: 'O', masaSalarial: 383.939, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 100, alicVarDeclarado: 6.66, premioAPagar: 25.340, deduccionDevengado: 500.00, totalFFEP: 100, totalSRES: 25.840, totalCuotaAPagar: 25.840, totalPagadoCuota: 26.070, saldoMensual: -230.37
    },
    {
        periodoCobertura: '2022-05', periodoDDJJ: '2022-04', fechaPresentacion: '2022-05-15', tipo: 'O', masaSalarial: 390.892, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 111.75, alicVarDeclarado: 6.66, premioAPagar: 25.798, deduccionDevengado: 558.75, totalFFEP: 111.75, totalSRES: 26.356, totalCuotaAPagar: 26.356, totalPagadoCuota: 26.591, saldoMensual: -234.53
    },
    {
        periodoCobertura: '2022-06', periodoDDJJ: '2022-05', fechaPresentacion: '2022-05-31', tipo: 'O', masaSalarial: 390.892, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 111.75, alicVarDeclarado: 6.66, premioAPagar: 25.798, deduccionDevengado: 558.75, totalFFEP: 111.75, totalSRES: 26.356, totalCuotaAPagar: 26.356, totalPagadoCuota: 26.591, saldoMensual: -234.53
    },
    {
        periodoCobertura: '2022-07', periodoDDJJ: '2022-06', fechaPresentacion: '2022-06-28', tipo: 'O', masaSalarial: 592.272, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 111.75, alicVarDeclarado: 6.66, premioAPagar: 39.090, deduccionDevengado: 639.25, totalFFEP: 127.65, totalSRES: 39.729, totalCuotaAPagar: 39.729, totalPagadoCuota: 40.004, saldoMensual: -275.86
    },
    {
        periodoCobertura: '2022-08', periodoDDJJ: '2022-07', fechaPresentacion: '2022-07-25', tipo: 'O', masaSalarial: 486.720, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 133, alicVarDeclarado: 6.66, premioAPagar: 32.123, deduccionDevengado: 665.00, totalFFEP: 133, totalSRES: 32.788, totalCuotaAPagar: 32.788, totalPagadoCuota: 33.081, saldoMensual: -293.02
    },
    {
        periodoCobertura: '2022-09', periodoDDJJ: '2022-08', fechaPresentacion: '2022-08-29', tipo: 'O', masaSalarial: 569.158, cantTrabajadores: 13, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 133, alicVarDeclarado: 6.66, premioAPagar: 37.564, deduccionDevengado: 705.00, totalFFEP: 141.00, totalSRES: 38.269, totalCuotaAPagar: 38.269, totalPagadoCuota: 38.570, saldoMensual: -301.50
    },
    {
        periodoCobertura: '2022-10', periodoDDJJ: '2022-09', fechaPresentacion: '2022-09-29', tipo: 'O', masaSalarial: 567.166, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 141, alicVarDeclarado: 6.66, premioAPagar: 37.432, deduccionDevengado: 745.00, totalFFEP: 149.00, totalSRES: 38.177, totalCuotaAPagar: 38.177, totalPagadoCuota: 38.478, saldoMensual: -300.31
    },
    {
        periodoCobertura: '2022-11', periodoDDJJ: '2022-10', fechaPresentacion: '2022-10-28', tipo: 'O', masaSalarial: 555.663, cantTrabajadores: 6, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 155, alicVarDeclarado: 6.66, premioAPagar: 36.673, deduccionDevengado: 775.00, totalFFEP: 155.00, totalSRES: 37.448, totalCuotaAPagar: 37.448, totalPagadoCuota: 37.782, saldoMensual: -333.41
    },
    {
        periodoCobertura: '2022-12', periodoDDJJ: '2022-11', fechaPresentacion: '2022-11-29', tipo: 'O', masaSalarial: 617.459, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 155, alicVarDeclarado: 6.66, premioAPagar: 40.752, deduccionDevengado: 820.00, totalFFEP: 164.00, totalSRES: 41.572, totalCuotaAPagar: 41.572, totalPagadoCuota: 41.897, saldoMensual: -325.48
    },
    {
        periodoCobertura: '2023-01', periodoDDJJ: '2022-12', fechaPresentacion: '2022-12-29', tipo: 'O', masaSalarial: 938.481, cantTrabajadores: 19, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 173, alicVarDeclarado: 6.66, premioAPagar: 61.939, deduccionDevengado: 865.00, totalFFEP: 173.00, totalSRES: 62.804, totalCuotaAPagar: 62.804, totalPagadoCuota: 63.367, saldoMensual: -563.09
    },
];


const ddjjData: DDJJRegistro[] = [
    {
        periodoDDJJ: '202503',
        presentacion: '2025-04-10',	
        tipo: 'O',	
        alicFija: '0,00', 	
        alicVariable: '3,20',
        cantTrabajadores: '360',
        masaSalarial: '405.991.711,64',
    },
    {
        periodoDDJJ: '202504',
        presentacion: '2025-05-11',	
        tipo: 'O',	
        alicFija: '0,00', 	
        alicVariable: '3,20',
        cantTrabajadores: '360',
        masaSalarial: '243.613.956,84',
    },
    {
        periodoDDJJ: '202505',
        presentacion: '2025-06-07',	
        tipo: 'O',	
        alicFija: '0,00', 	
        alicVariable: '3,20',
        cantTrabajadores: '340',
        masaSalarial: '272.474.094,31',
    },
    {
        periodoDDJJ: '202506',
        presentacion: '2025-07-11',	
        tipo: 'O',	
        alicFija: '0,00', 	
        alicVariable: '3,20',
        cantTrabajadores: '320',
        masaSalarial: '343.711.403,75',
    },
    {
        periodoDDJJ: '202507',
        presentacion: '2025-08-09',	
        tipo: 'R',	
        alicFija: '0,00', 	
        alicVariable: '3,20',
        cantTrabajadores: '290',
        masaSalarial: '278.051.489,13',
    },
    {
        periodoDDJJ: '202508',
        presentacion: '2025-09-10',	
        tipo: 'R',	
        alicFija: '0,00', 	
        alicVariable: '3,20',
        cantTrabajadores: '270',
        masaSalarial: '264.725.031,59',
    }
]

// Función auxiliar para formatear a moneda
const formatCurrency = (value: number | string) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
};

// ----------------------------------------------------
// 3. DEFINICIÓN DE COLUMNAS Y COMPONENTE
// ----------------------------------------------------
function CuentaCorrientePage() {

    const columns: ColumnDef<CuentaCorrienteRegistro>[] = useMemo(() => [
        { header: 'Período Cobertura', accessorKey: 'periodoCobertura', meta: { align: 'center'} },
        { header: 'Período DDJJ', accessorKey: 'periodoDDJJ', meta: { align: 'center'} },
        { header: 'Fecha de Presentación', accessorKey: 'fechaPresentacion', meta: { align: 'center'} },
        { header: 'Tipo', accessorKey: 'tipo', meta: { align: 'center'} },
        { header: 'Masa Salarial', accessorKey: 'masaSalarial', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Cant. Trabajadores', accessorKey: 'cantTrabajadores', meta: { align: 'center'} },
        { header: 'Alic. Fija', accessorKey: 'alicFija', meta: { align: 'center'} },
        { header: 'Alic. Var.', accessorKey: 'alicVar', meta: { align: 'center'} },
        { header: 'Alic. Fija + FFEP Declarado', accessorKey: 'alicFijaFFEPDeclarado', meta: { align: 'center'} },
        { header: 'Alic. Var. Declarada', accessorKey: 'alicVarDeclarado', meta: { align: 'center'} },
        { header: 'Premio A Pagar', accessorKey: 'premioAPagar', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Deducción Devengado', accessorKey: 'deduccionDevengado', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Total FFEP', accessorKey: 'totalFFEP', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Total S/RES', accessorKey: 'totalSRES', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Total Cuota a Pagar', accessorKey: 'totalCuotaAPagar', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Total Pagado Cuota', accessorKey: 'totalPagadoCuota', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Saldo Mensual', accessorKey: 'saldoMensual', 
          cell: info => {
            const saldo = info.getValue() as number;
            // Estilo para destacar saldos negativos (deuda)
            const style = saldo < 0 ? { color: 'red', fontWeight: 'bold' } : {};
            return <span style={style}>{formatCurrency(saldo)}</span>;
          }
        , meta: { align: 'center'} },
    ], []);

    const columnsDDJJ: ColumnDef<DDJJRegistro>[] = useMemo(() => [
        { header: 'Período DDJJ', accessorKey: 'periodoDDJJ', meta: { align: 'center'} },
        { header: 'Presentación', accessorKey: 'presentacion', meta: { align: 'center'} },
        { header: 'Tipo', accessorKey: 'tipo', meta: { align: 'center'} },
        { header: 'Alic. Fija', accessorKey: 'alicFija', meta: { align: 'center'} },
        { header: 'Alic. Variable', accessorKey: 'alicVariable', meta: { align: 'center'} },
        { header: 'Cant. Trabajadores', accessorKey: 'cantTrabajadores', meta: { align: 'center'} },
        { header: 'Masa Salarial', accessorKey: 'masaSalarial', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        
    ], []);

    const tabItems = [
        {
        label: 'Estado de Cuenta',
        content: (
             <DataTable
                data={cuentaCorrienteData} 
                columns={columns} 
                size="mid"
                isLoading={false}
            />
        ),
        },
        {
        label: 'Últimas DDJJ',
        content: (
             <DataTable
                data={ddjjData} 
                columns={columnsDDJJ} 
                size="mid"
                isLoading={false}
            />
        ),
        },
  ];




    return (
        <div style={{ padding: '20px' }}>
            
             <CustomTab tabs={tabItems} initialTabIndex={1} /> 

            {/* Mensaje de Advertencia */}
            <Typography variant="body1" gutterBottom style={{ marginBottom: '20px', fontSize: '0.9rem' }}>
                En caso de presentar deuda tenga en cuenta que la misma se ajustará por intereses al momento de realizar el pago.
            </Typography>

        </div>
    );
}

export default CuentaCorrientePage;