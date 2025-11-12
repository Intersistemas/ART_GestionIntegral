// app/inicio/denuncias/page.tsx

"use client";
import { useState, useMemo } from 'react';
import styles from './denuncias.module.css';
import ArtAPI from '@/data/artAPI';
import { DenunciaGetAll, DenunciaQueryParams } from './types/tDenuncias';
import { useAuth } from '@/data/AuthContext';
import DataTable from '@/utils/ui/table/DataTable';
import Formato from '@/utils/Formato';

// Estado options for the dropdown
const estadoOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 0, label: 'Pendiente' },
  { value: 1, label: 'En proceso' },
  { value: 2, label: 'Completado' },
  { value: 3, label: 'Cancelado' },
];

/* Helpers */
const fechaFormatter = (v: any) => Formato.Fecha(v);
const cuipFormatter = (v: any) => Formato.CUIP(v);

/* Spinner simple */
const Spinner: React.FC = () => (
  <div className={styles.spinner}>
    <span>cargando...</span>
  </div>
);

function DenunciasPage() {
  const { user } = useAuth();
  
  // State for filters and pagination
  const [estado, setEstado] = useState<number | undefined>(undefined);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(0);

  // Build query parameters
  const queryParams: DenunciaQueryParams = useMemo(() => ({
    Estado: estado,
    PageIndex: pageIndex + 1, // API expects 1-based pagination
    PageSize: pageSize,
  }), [estado, pageIndex, pageSize]);

  // API call using SWR
  const { data, error, isLoading } = ArtAPI.useGetDenuncias(queryParams);
  
  // Check if error is 404 (not found) - treat as empty result instead of error
  const is404Error = error?.status === 404 || error?.response?.status === 404;
  
  // Process data and update states
  useMemo(() => {
    if (!data && !error) {
      setLoading(true);
      return;
    }

    if (error && !is404Error) {
      console.error('Error al cargar denuncias:', error);
      setLoading(false);
      return;
    }

    // Calculate page count if total is available
    if (data?.count && pageSize > 0) {
      setPageCount(Math.ceil(data.count / pageSize));
    } else if (data?.data) {
      setPageCount(data.data.length > 0 ? Math.ceil(data.data.length / pageSize) : 1);
    }

    setLoading(false);
  }, [data, error, pageSize, is404Error]);

  // Handle pagination
  const handlePreviousPage = () => {
    setPageIndex(prev => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    if (data?.data && data.data.length === pageSize) {
      setPageIndex(prev => prev + 1);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPageIndex(0); // Reset to first page
  };

  // Handle estado filter change
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setEstado(value === '' ? undefined : Number(value));
    setPageIndex(0); // Reset to first page when filtering
  };
  
  // Table columns definition
  const tableColumns = [
    { 
      accessorKey: 'interno', 
      header: 'Interno',
      size: 80
    },
    { 
      accessorKey: 'denunciaNro', 
      header: 'Nro. Denuncia',
      size: 120
    },
    { 
      accessorKey: 'siniestroNro', 
      header: 'Nro. Siniestro',
      size: 120
    },
    { 
      accessorKey: 'siniestroTipo', 
      header: 'Tipo Siniestro',
      size: 150
    },
    { 
      accessorKey: 'empCuit', 
      header: 'CUIT Empleador',
      cell: (info: any) => cuipFormatter(info.getValue()),
      size: 130
    },
    { 
      accessorKey: 'empPoliza', 
      header: 'Póliza',
      size: 80
    },
    { 
      accessorKey: 'empRazonSocial', 
      header: 'Razón Social',
      cell: (info: any) => {
        const value = info.getValue();
        return value && value.length > 50 ? `${value.substring(0, 50)}...` : value || '—';
      }
    }
  ];

  if (loading) return <Spinner />;

  if (error && !is404Error) {
    return (
      <div className={styles.inicioContainer}>
        <div className={styles.errorMessage}>
          Error al cargar las denuncias: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inicioContainer}>
<<<<<<< HEAD
      Pantalla En Desarrollo...
=======
      {/* <div className={styles.header}>
        <h1 className={styles.title}>Denuncias</h1>
      </div> */}

      {/* Filters */}
      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label htmlFor="estado" className={styles.filterLabel}>
            Estado:
          </label>
          <select
            id="estado"
            value={estado ?? ''}
            onChange={handleEstadoChange}
            className={styles.filterSelect}
          >
            {estadoOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data table */}
      <div className={styles.compactTable}>
        <DataTable
          columns={tableColumns}
          data={data?.data || []}
          isLoading={isLoading}
          manualPagination={true}
          pageIndex={pageIndex}
          pageSize={pageSize}
          pageCount={pageCount}
          onPageChange={setPageIndex}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>

      {/* Empty state for no data */}
      {!isLoading && ((data?.data && data.data.length === 0) || is404Error || (!data && !error)) && (
        <div className={styles.emptyState}>
          <p>No se encontraron denuncias con los filtros seleccionados.</p>
        </div>
      )}
>>>>>>> 0cbd7be (desarrollo browse)
    </div>
  );
}

export default DenunciasPage;

