"use client";
import React, { useMemo } from 'react';
import DataTable from '@/utils/ui/table/DataTable'; // ⚠️ Asegúrate que esta ruta es correcta
import { ColumnDef } from '@tanstack/react-table';
import { BsPencilSquare } from 'react-icons/bs'; // Para el ícono de 'Evoluciones'
import { Box, Typography, TextField, InputAdornment } from '@mui/material';

// ⚠️ Define una interfaz para los datos de siniestros
interface Siniestro {
    cuil: number;
    apellidoNombre: string;
    establecimiento: string;
    nroSiniestro: string;
    tipoSiniestro: string;
    fechaSiniestroPMI: string;
    diagnostico: string;
    categoria: string;
    proximoControlMedico: string;
    prestadorInicial: string;
    fechaAltaMedica: string;
    evoluciones: string; // Se usará para el botón/ícono
}

// ----------------------------------------------------
// 2. DATOS DE EJEMPLO (GENERADOS A PARTIR DE LA IMAGEN)
// ----------------------------------------------------
const siniestrosData: Siniestro[] = [
    {
        cuil: 20391913200,
        apellidoNombre: 'MONTERO, PABLO EMANUEL',
        establecimiento: 'TRES MARIAS S.A - BONPLAND - CTES.',
        nroSiniestro: '202200009800',
        tipoSiniestro: 'AccidenteTrabajo',
        fechaSiniestroPMI: '18-03-2022, 18:30 pm',
        diagnostico: 'CONTUSION DE LA RODILLA',
        categoria: 'CB',
        proximoControlMedico: '18-04-2022',
        prestadorInicial: 'CLINICA MADARIAGA S R L - BARTOLOME MITRE 876 - PASO DE LOS LIBRES - CTES.',
        fechaAltaMedica: '18-04-2022',
        evoluciones: 'Ver',
    },
    {
        cuil: 26321154809,
        apellidoNombre: 'MIYO, RAMON FORTUNATO',
        establecimiento: 'TRES MARIAS S.A - BONPLAND - CTES.',
        nroSiniestro: '202200009900',
        tipoSiniestro: 'AccidenteTrabajo',
        fechaSiniestroPMI: '12-10-2022, 10:10 am',
        diagnostico: 'CONTUSION DE DEDO(S) DE LA MANO, SIN DAÑO DE UÑA(S), UÑA(S)',
        categoria: 'CB',
        proximoControlMedico: '20-01-2023',
        prestadorInicial: 'CLINICA MADARIAGA S R L - BARTOLOME MITRE 876 - PASO DE LOS LIBRES - CTES.',
        fechaAltaMedica: '20-01-2023',
        evoluciones: 'Ver',
    },
    {
        cuil: 20181642859,
        apellidoNombre: 'ZARATE, RAMON ANDRES',
        establecimiento: 'TRES MARIAS S.A - BONPLAND - CTES.',
        nroSiniestro: '202300009500',
        tipoSiniestro: 'AccidenteTrabajo',
        fechaSiniestroPMI: '24-05-2023, 16:00 pm',
        diagnostico: 'ESGUINCES Y TORCEDURAS DE OTRAS PARTES Y DE LAS NO ESPECIFICADAS DE LA RODILLA',
        categoria: 'CB',
        proximoControlMedico: '03-07-2023',
        prestadorInicial: 'CLINICA MADARIAGA S R L - BARTOLOME MITRE 876 - PASO DE LOS LIBRES - CTES.',
        fechaAltaMedica: '03-07-2023',
        evoluciones: 'Ver',
    },
    {
        cuil: 20391913200,
        apellidoNombre: 'MONTERO, PABLO EMANUEL',
        establecimiento: 'TRES MARIAS S.A - BONPLAND - CTES.',
        nroSiniestro: '202300010900',
        tipoSiniestro: 'AccidenteTrabajo',
        fechaSiniestroPMI: '07-06-2023, 16:00 pm',
        diagnostico: 'ESGUINCES Y TORCEDURAS DE LA COLUMNA LUMBAR',
        categoria: 'CB',
        proximoControlMedico: '03-07-2023',
        prestadorInicial: 'CLINICA MADARIAGA S R L - BARTOLOME MITRE 876 - PASO DE LOS LIBRES - CTES.',
        fechaAltaMedica: '03-07-2023',
        evoluciones: 'Ver',
    },
];

// ----------------------------------------------------
// 3. DEFINICIÓN DE COLUMNAS
// ----------------------------------------------------
function SiniestrosPage() {

    // ⚠️ Estado para la búsqueda (opcional, pero útil)
    const [searchTerm, setSearchTerm] = React.useState(''); 

    const columns: ColumnDef<Siniestro>[] = useMemo(() => [
        { header: 'CUIL', accessorKey: 'cuil', cell: info => info.getValue() },
        { header: 'Apellido_Nombre', accessorKey: 'apellidoNombre' },
        { header: 'Establecimiento', accessorKey: 'establecimiento' },
        { header: 'Nro. Siniestro', accessorKey: 'nroSiniestro' },
        { header: 'Tipo de Siniestro', accessorKey: 'tipoSiniestro' },
        { header: 'Fecha Siniestro PMI', accessorKey: 'fechaSiniestroPMI' },
        { header: 'Diagnóstico', accessorKey: 'diagnostico' },
        { header: 'Categoría', accessorKey: 'categoria' },
        { header: 'Próximo Control Médico', accessorKey: 'proximoControlMedico' },
        { header: 'Prestador Inicial', accessorKey: 'prestadorInicial' },
        { header: 'Fecha Alta Médica', accessorKey: 'fechaAltaMedica' },
        { 
            header: 'Evoluciones', 
            accessorKey: 'evoluciones',
            // 🟢 Renderizado de celda para mostrar un botón/ícono
            cell: () => (
                <button 
                    title="Ver Evoluciones"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => alert("Mostrando evoluciones...")}
                >
                    <BsPencilSquare style={{ fontSize: '1.2rem', color: 'var(--naranja)' }} />
                </button>
            ),
            enableSorting: false,
            size: 50, // Columna más angosta
        },
    ], []);

    return (
        <div style={{ padding: '20px' }}>
            <Typography variant="h3" component="h1" gutterBottom style={{ fontWeight: 'bold' }}>
                Control de Siniestros
            </Typography>

            {/* -------------------- TABLA DE SINIESTROS -------------------- */}
            <DataTable
                data={siniestrosData} 
                columns={columns} 
                size="mid"
                isLoading={false}
                // Aquí podrías agregar lógica para filtrar los datos con searchTerm
                // filterCriteria={searchTerm} 
            />
        </div>
    )
}

export default SiniestrosPage;