"use client";
import React, { useMemo, useState, SyntheticEvent } from 'react'; // Importamos SyntheticEvent
import DataTable from '@/utils/ui/table/DataTable'; 
import CustomButton from '@/utils/ui/button/CustomButton';
import { ColumnDef } from '@tanstack/react-table';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CustomTab from '@/utils/ui/tab/CustomTab';
import Formato from '@/utils/Formato';


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

const cuentaCorrienteData: CuentaCorrienteRegistro[] = [
    { periodoCobertura: '2021-10', periodoDDJJ: '2021-11', fechaPresentacion: '2021-11-30', tipo: 'R', masaSalarial: 336200, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 45.98, alicVarDeclarado: 8.4, premioAPagar: 22189, deduccionDevengado: 245.90, totalFFEP: 49.98, totalSRES: 28490, totalCuotaAPagar: 24439, totalPagadoCuota: 28490, saldoMensual: -6051 },
    { periodoCobertura: '2021-12', periodoDDJJ: '2021-12', fechaPresentacion: '2021-12-06', tipo: 'R', masaSalarial: 360332, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 45.98, alicVarDeclarado: 6.66, premioAPagar: 23775, deduccionDevengado: 245.90, totalFFEP: 49.98, totalSRES: 24225, totalCuotaAPagar: 24225, totalPagadoCuota: 24241, saldoMensual: -216.14 },
    { periodoCobertura: '2022-01', periodoDDJJ: '2021-12', fechaPresentacion: '2021-12-29', tipo: 'O', masaSalarial: 503544, cantTrabajadores: 27, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 45.98, alicVarDeclarado: 6.66, premioAPagar: 33233, deduccionDevengado: 245.90, totalFFEP: 49.98, totalSRES: 33483, totalCuotaAPagar: 33483, totalPagadoCuota: 33785, saldoMensual: -302.13 },
    { periodoCobertura: '2022-02', periodoDDJJ: '2022-01', fechaPresentacion: '2022-01-31', tipo: 'O', masaSalarial: 365022, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 100, alicVarDeclarado: 6.66, premioAPagar: 24091, deduccionDevengado: 500.00, totalFFEP: 100, totalSRES: 24591, totalCuotaAPagar: 24591, totalPagadoCuota: 24810, saldoMensual: -219.01 },
    { periodoCobertura: '2022-03', periodoDDJJ: '2022-02', fechaPresentacion: '2022-02-20', tipo: 'O', masaSalarial: 368694, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 100, alicVarDeclarado: 6.66, premioAPagar: 24333, deduccionDevengado: 500.00, totalFFEP: 100, totalSRES: 24833, totalCuotaAPagar: 24833, totalPagadoCuota: 25054, saldoMensual: -221.20 },
    { periodoCobertura: '2022-04', periodoDDJJ: '2022-03', fechaPresentacion: '2022-03-31', tipo: 'O', masaSalarial: 383939, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 100, alicVarDeclarado: 6.66, premioAPagar: 25340, deduccionDevengado: 500.00, totalFFEP: 100, totalSRES: 25840, totalCuotaAPagar: 25840, totalPagadoCuota: 26070, saldoMensual: -230.37 },
    { periodoCobertura: '2022-05', periodoDDJJ: '2022-04', fechaPresentacion: '2022-05-15', tipo: 'O', masaSalarial: 390892, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 111.75, alicVarDeclarado: 6.66, premioAPagar: 25798, deduccionDevengado: 558.75, totalFFEP: 111.75, totalSRES: 26356, totalCuotaAPagar: 26356, totalPagadoCuota: 26591, saldoMensual: -234.53 },
    { periodoCobertura: '2022-06', periodoDDJJ: '2022-05', fechaPresentacion: '2022-05-31', tipo: 'O', masaSalarial: 390892, cantTrabajadores: 5, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 111.75, alicVarDeclarado: 6.66, premioAPagar: 25798, deduccionDevengado: 558.75, totalFFEP: 111.75, totalSRES: 26356, totalCuotaAPagar: 26356, totalPagadoCuota: 26591, saldoMensual: -234.53 },
    { periodoCobertura: '2022-07', periodoDDJJ: '2022-06', fechaPresentacion: '2022-06-28', tipo: 'O', masaSalarial: 592272, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 111.75, alicVarDeclarado: 6.66, premioAPagar: 39090, deduccionDevengado: 639.25, totalFFEP: 127.65, totalSRES: 39729, totalCuotaAPagar: 39729, totalPagadoCuota: 40004, saldoMensual: -275.86 },
    { periodoCobertura: '2022-08', periodoDDJJ: '2022-07', fechaPresentacion: '2022-07-25', tipo: 'O', masaSalarial: 486720, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 133, alicVarDeclarado: 6.66, premioAPagar: 32123, deduccionDevengado: 665.00, totalFFEP: 133, totalSRES: 32788, totalCuotaAPagar: 32788, totalPagadoCuota: 33081, saldoMensual: -293.02 },
    { periodoCobertura: '2022-09', periodoDDJJ: '2022-08', fechaPresentacion: '2022-08-29', tipo: 'O', masaSalarial: 569158, cantTrabajadores: 13, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 133, alicVarDeclarado: 6.66, premioAPagar: 37564, deduccionDevengado: 705.00, totalFFEP: 141.00, totalSRES: 38269, totalCuotaAPagar: 38269, totalPagadoCuota: 38570, saldoMensual: -301.50 },
    { periodoCobertura: '2022-10', periodoDDJJ: '2022-09', fechaPresentacion: '2022-09-29', tipo: 'O', masaSalarial: 567166, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 141, alicVarDeclarado: 6.66, premioAPagar: 37432, deduccionDevengado: 745.00, totalFFEP: 149.00, totalSRES: 38177, totalCuotaAPagar: 38177, totalPagadoCuota: 38478, saldoMensual: -300.31 },
    { periodoCobertura: '2022-11', periodoDDJJ: '2022-10', fechaPresentacion: '2022-10-28', tipo: 'O', masaSalarial: 555663, cantTrabajadores: 6, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 155, alicVarDeclarado: 6.66, premioAPagar: 36673, deduccionDevengado: 775.00, totalFFEP: 155.00, totalSRES: 37448, totalCuotaAPagar: 37448, totalPagadoCuota: 37782, saldoMensual: -333.41 },
    { periodoCobertura: '2022-12', periodoDDJJ: '2022-11', fechaPresentacion: '2022-11-29', tipo: 'O', masaSalarial: 617459, cantTrabajadores: 9, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 155, alicVarDeclarado: 6.66, premioAPagar: 40752, deduccionDevengado: 820.00, totalFFEP: 164.00, totalSRES: 41572, totalCuotaAPagar: 41572, totalPagadoCuota: 41897, saldoMensual: -325.48 },
    { periodoCobertura: '2023-01', periodoDDJJ: '2022-12', fechaPresentacion: '2022-12-29', tipo: 'O', masaSalarial: 938481, cantTrabajadores: 19, alicFija: 0, alicVar: 6.6, alicFijaFFEPDeclarado: 173, alicVarDeclarado: 6.66, premioAPagar: 61939, deduccionDevengado: 865.00, totalFFEP: 173.00, totalSRES: 62804, totalCuotaAPagar: 62804, totalPagadoCuota: 63367, saldoMensual: -563.09 },
];

const ddjjData: DDJJRegistro[] = [
    { periodoDDJJ: '202503', presentacion: '2025-04-10', tipo: 'O', alicFija: '0,00', alicVariable: '3,20', cantTrabajadores: '360', masaSalarial: '405991711,64' },
    { periodoDDJJ: '202504', presentacion: '2025-05-11', tipo: 'O', alicFija: '0,00', alicVariable: '3,20', cantTrabajadores: '360', masaSalarial: '243613956,84' },
    { periodoDDJJ: '202505', presentacion: '2025-06-07', tipo: 'O', alicFija: '0,00', alicVariable: '3,20', cantTrabajadores: '340', masaSalarial: '272474094,31' },
    { periodoDDJJ: '202506', presentacion: '2025-07-11', tipo: 'O', alicFija: '0,00', alicVariable: '3,20', cantTrabajadores: '320', masaSalarial: '343711403,75' },
    { periodoDDJJ: '202507', presentacion: '2025-08-09', tipo: 'R', alicFija: '0,00', alicVariable: '3,20', cantTrabajadores: '290', masaSalarial: '278051489,13' },
    { periodoDDJJ: '202508', presentacion: '2025-09-10', tipo: 'R', alicFija: '0,00', alicVariable: '3,20', cantTrabajadores: '270', masaSalarial: '264725031,59' }
]


// Función auxiliar para formatear a moneda
const formatCurrency = (value: number | string) => {
    // Si el dato es una cadena con comas (como en ddjjData), reemplazar coma por punto
    const cleanValue = typeof value === 'string' ? value.replace(',', '.') : value;
    const num = parseFloat(String(cleanValue)); 

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
    
    // 1. CONTROL DE LA PESTAÑA: Usamos useState para el valor numérico
    // Iniciamos con 0 si queremos 'Estado de Cuenta', o 1 si queremos 'Últimas DDJJ'
    const initialTabIndex = 0; // Queremos que inicie en la primera pestaña (0)
    const [currentTab, setCurrentTab] = useState<number>(initialTabIndex);

    // 2. HANDLER DE CAMBIO: Convertimos el valor (string) que devuelve MUI a number
    const handleTabChange = (event: SyntheticEvent, newTabValue: string | number) => {
        // Tabs de MUI siempre devuelve un string si el valor de la Tab es un string, 
        // o un número si el valor es un número.
        // Como CustomTab usa 'value: number', newTabValue será number.
        setCurrentTab(newTabValue as number); 
    };

 
    const columns: ColumnDef<CuentaCorrienteRegistro>[] = useMemo(() => [
        { header: 'Período Cobertura', accessorKey: 'periodoCobertura', cell: (info: any) => Formato.Fecha(info.getValue(),"MM-YYYY"), meta: { align: 'center'} },
        { header: 'Período DDJJ', accessorKey: 'periodoDDJJ', cell: (info: any) => Formato.Fecha(info.getValue(),"MM-YYYY"), meta: { align: 'center'} },
        { header: 'Fecha de Presentación', accessorKey: 'fechaPresentacion', cell: (info: any) => Formato.Fecha(info.getValue()), meta: { align: 'center'} },
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
                const style = saldo < 0 ? { color: 'red', fontWeight: 'bold' } : {};
                return <span style={style}>{formatCurrency(saldo)}</span>;
            }
        , meta: { align: 'center'} },
    ], []);

    const columnsDDJJ: ColumnDef<DDJJRegistro>[] = useMemo(() => [
        { header: 'Período DDJJ', accessorKey: 'periodoDDJJ', cell: (info: any) => Formato.Fecha(info.getValue(),"MM-YYYY"), meta: { align: 'center'} },
        { header: 'Presentación', accessorKey: 'presentacion', cell: (info: any) => Formato.Fecha(info.getValue()), meta: { align: 'center'} },
        { header: 'Tipo', accessorKey: 'tipo', meta: { align: 'center'} },
        { header: 'Alic. Fija', accessorKey: 'alicFija', meta: { align: 'center'} },
        { header: 'Alic. Variable', accessorKey: 'alicVariable', meta: { align: 'center'} },
        { header: 'Cant. Trabajadores', accessorKey: 'cantTrabajadores', meta: { align: 'center'} },
        { header: 'Masa Salarial', accessorKey: 'masaSalarial', cell: info => formatCurrency(info.getValue() as string), meta: { align: 'center'} },
    ], []);


    const tabItems = [
        {
            label: 'Estado de Cuenta',
            value: 0,
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
            value: 1,
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
            
            <CustomTab 
                tabs={tabItems} 
                currentTab={currentTab} 
                onTabChange={handleTabChange}
            /> 

            {/* Mensaje de Advertencia */}
            <Typography variant="body1" gutterBottom style={{ marginBottom: '20px', fontSize: '0.9rem', marginTop: '16px' }}>
                En caso de presentar deuda tenga en cuenta que la misma se ajustará por intereses al momento de realizar el pago.
            </Typography>

        </div>
    );
}

export default CuentaCorrientePage;