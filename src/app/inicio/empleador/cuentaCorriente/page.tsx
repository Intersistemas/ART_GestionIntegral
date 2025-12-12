"use client";
import React, { useMemo, useState, SyntheticEvent } from 'react'; // Importamos SyntheticEvent
import DataTable from '@/utils/ui/table/DataTable'; 
import CustomButton from '@/utils/ui/button/CustomButton';
import { ColumnDef } from '@tanstack/react-table';
import { Box, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CustomTab from '@/utils/ui/tab/CustomTab';
import Formato from '@/utils/Formato';
import gestionEmpleadorAPI from "@/data/gestionEmpleadorAPI";
import type { CuentaCorrienteRegistro, DDJJRegistro } from './types/cuentaCorriente';



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
    
    const { data: CtaCteRawData, isLoading: isCtaCteLoading } = gestionEmpleadorAPI.useGetVEmpleadorDDJJ(); 
    
    // 1. CONTROL DE LA PESTAÑA: Usamos useState para el valor numérico
    // Iniciamos con 0 si queremos 'Estado de Cuenta', o 1 si queremos 'Últimas DDJJ'
    const initialTabIndex = 0; // Queremos que inicie en la primera pestaña (0)
    const [currentTab, setCurrentTab] = useState<number>(initialTabIndex);

    // 2. HANDLER DE CAMBIO: Convertimos el valor (string) que devuelve MUI a number
    const handleTabChange = (event: SyntheticEvent, newTabValue: string | number) => {
        setCurrentTab(newTabValue as number); 
    };

    const sumarleUnMesAlPeriodo = (periodo: string | number | null | undefined) => {
        const periodoStr = String(periodo ?? '');

        if (periodoStr.length < 6) {
            console.error("El periodo no tiene el formato AAAAMM válido.");
            return null; // O devuelve un valor por defecto o lanza un error
        }

        const anio = parseInt(periodoStr.substring(0, 4), 10);
        const mes = parseInt(periodoStr.substring(4, 6), 10);
        
        // El resto de la lógica permanece igual
        const fecha = new Date(anio, mes - 1, 1);
        fecha.setMonth(fecha.getMonth() + 1);
        const nuevoAnio = fecha.getFullYear();
        const nuevoMes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        
        return `${nuevoAnio}${nuevoMes}`;
    }

    const columns: ColumnDef<CuentaCorrienteRegistro>[] = useMemo(() => [
        { id: 'periodoCobertura', header: 'Período Cobertura', accessorKey: 'periodo', cell: (info: any) => Formato.Fecha(sumarleUnMesAlPeriodo(info.getValue()),"MM-YYYY"), meta: { align: 'center'} }, //DEBO RESTAR UN MES AL VALOR
        { id: 'periodoDDJJ', header: 'Período DDJJ', accessorKey: 'periodo', cell: (info: any) => Formato.Fecha(info.getValue(),"MM-YYYY"), meta: { align: 'center'} },
        { header: 'Fecha de Presentación', accessorKey: 'presentacion', cell: (info: any) => Formato.Fecha(info.getValue()), meta: { align: 'center'} },
        { header: 'Tipo', accessorKey: 'origenDDJJ', meta: { align: 'center'} },
        { header: 'Masa Salarial', accessorKey: 'masaSalarial', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Cant. Trabajadores', accessorKey: 'cantidadTrabajadores', meta: { align: 'center'} },
        { header: 'Alic. Fija', accessorKey: 'alicuotaFijaVigenteTrabajador', meta: { align: 'center'} },
        { header: 'Alic. Var.', accessorKey: 'alicuotaVariableVigenteSobreMasaSalarial', meta: { align: 'center'} },
        { header: 'Alic. Fija + FFEP Declarado', accessorKey: 'alicuotaFijaDeclaradaTrabajador', meta: { align: 'center'} },
        { header: 'Alic. Var. Declarada', accessorKey: 'alicuotaVariableDeclaradaMasaSalarial', meta: { align: 'center'} },
        { header: 'Premio A Pagar', accessorKey: 'primaAPagar', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Total Devengado FFEP', accessorKey: 'totalDevengadoFFEP', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'FFEP S/Res', accessorKey: 'ffep', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Total Cuota a Pagar', accessorKey: 'totalCuota', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Total Pagado Cuota', accessorKey: 'totalPagadoCuota', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
        { header: 'Saldo Mensual', accessorKey: 'saldo', 
            cell: info => {
                const saldo = info.getValue() as number;
                const style = saldo < 0 ? { color: 'red', fontWeight: 'bold' } : {};
                return <span style={style}>{formatCurrency(saldo)}</span>;
            }
            , meta: { align: 'center'} },
        { header: 'Saldo Acumulado', accessorKey: 'saldoAcumulado', cell: info => formatCurrency(info.getValue() as number), meta: { align: 'center'} },
    ], []);

    const columnsDDJJ: ColumnDef<DDJJRegistro>[] = useMemo(() => [
        { header: 'Período DDJJ', accessorKey: 'periodo', cell: (info: any) => Formato.Fecha(info.getValue(),"MM-YYYY"), meta: { align: 'center'} },
        { header: 'Presentación', accessorKey: 'presentacion', cell: (info: any) => Formato.Fecha(info.getValue()), meta: { align: 'center'} },
        { header: 'Tipo', accessorKey: 'origenDDJJ', meta: { align: 'center'} },
        { header: 'Alic. Fija', accessorKey: 'alicuotaFijaDeclaradaTrabajador', meta: { align: 'center'} },
        { header: 'Alic. Variable', accessorKey: 'alicuotaVariableDeclaradaMasaSalarial', meta: { align: 'center'} },
        { header: 'Cant. Trabajadores', accessorKey: 'cantidadTrabajadores', meta: { align: 'center'} },
        { header: 'Masa Salarial', accessorKey: 'masaSalarial', cell: info => formatCurrency(info.getValue() as string), meta: { align: 'center'} },
    ], []);


    const tabItems = [
        {
            label: 'Estado de Cuenta',
            value: 0,
            content: (
                <DataTable
                    data={CtaCteRawData?.data || []} 
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
                    data={CtaCteRawData?.data || []} 
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