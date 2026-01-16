"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import CustomButton from '@/utils/ui/button/CustomButton';
import { useAuth } from '@/data/AuthContext';
import DataTable from '@/utils/ui/table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import ArtAPI from '@/data/artAPI';
import Formato from '@/utils/Formato';
import styles from './poliza.module.css';
import { Box } from "@mui/material";
import { useEmpresasStore } from "@/data/empresasStore";
import type { Empresa } from "@/data/authAPI";
import CustomSelectSearch from "@/utils/ui/form/CustomSelectSearch";

type Poliza = {
  interno: string;
  numero: string;
  NroPoliza: string;
  CUIT: string;
  Empleador_Denominacion: string;
  Vigencia_Desde: string;
  Vigencia_Hasta: string;
  fecha: string;
};

const columns: ColumnDef<Poliza>[] = [
  { accessorKey: 'numero', header: 'Nro. Poliza', meta: { align: 'left' } },
  {
    accessorKey: 'CUIT',
    header: 'CUIT',
    meta: { align: 'left' },
    cell: (info: any) => {
      const v = info.getValue();
      const digits = normalizeDigits(v);
      return Formato.CUIP(digits) || String(v ?? '');
    },
  },
  { accessorKey: 'Empleador_Denominacion', header: 'Empleador', meta: { align: 'left' } },
  {
    accessorKey: 'fecha',
    header: 'Fecha de suscripción',
    meta: { align: 'left' },
    cell: (info: any) => {
      const v = String(info.getValue() ?? '');
      return Formato.Fecha(v) || v;
    },
  },
  {
    accessorKey: 'Vigencia_Desde',
    header: 'Vigencia Desde',
    meta: { align: 'left' },
    cell: (info: any) => {
      const v = String(info.getValue() ?? '');
      return Formato.Fecha(v) || v;
    },
  },
  {
    accessorKey: 'Vigencia_Hasta',
    header: 'Vigencia Hasta',
    meta: { align: 'center' },
    cell: (info: any) => {
      const v = String(info.getValue() ?? '');
      const d = new Date(v);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isExpired = !Number.isNaN(d.getTime()) && d < today;
      const formatted = Formato.Fecha(v) || v;
      return (
        <span className={isExpired ? styles.expired : undefined}>
          {formatted}
        </span>
      );
    },
  },
];

function normalizeDigits(value: unknown) {
  return String(value ?? '').replace(/\D/g, '');
}

function mapPolizasToRows(apiData: any): Poliza[] {
  const arr = Array.isArray(apiData?.DATA)
    ? apiData.DATA
    : Array.isArray(apiData?.data)
      ? apiData.data
      : Array.isArray(apiData)
        ? apiData
        : [];

  return (arr as any[]).map((item, index) => {
    const interno = item?.interno;
    const numero = String(item?.numero ?? '');
    return {
      interno: String(interno),
      numero: String(item?.numero ?? ''),
      NroPoliza: numero,
      CUIT: String(item?.cuit),
      Empleador_Denominacion: String(item?.empleadorDenominacion),
      Vigencia_Desde: String(item?.vigenciaDesde),
      Vigencia_Hasta: String(item?.vigenciaHasta),
      fecha: String(item?.movimientoFecha),
    };
  });
}

function PolizasTable({ params }: { params: any }) {
  const { data: apiData, error, isLoading } = ArtAPI.useGetPolizaComercializadorURL(params);
  const rows = useMemo(() => mapPolizasToRows(apiData), [apiData]);

  if (error) {
    return (
      <div className={styles.container}>
        <p>No se pudieron cargar las pólizas.</p>
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={rows}
      pageSizeOptions={[5, 10, 20]}
      isLoading={isLoading}
    />
  );
}

function PolizasComercializador({ cuitConsulta }: { cuitConsulta?: number }) {
  const { user } = useAuth();
  const userRol = String((user as any)?.rol ?? '');
  const isComercializador = userRol.toLowerCase() === 'comercializador';
  const userCUIL = Number(
    normalizeDigits((user as any)?.cuit ?? (user as any)?.CUIL ?? (user as any)?.cuil ?? 0)
  );

  const {
    data: comercializadorData,
    error: comercializadorError,
    isLoading: isLoadingComercializador,
  } = ArtAPI.useGetComercializadorURL(
    isComercializador && Number.isFinite(userCUIL) && userCUIL > 0
      ? ({ CUIL: userCUIL } as any)
      : ({} as any)
  );

  const comercializadorInterno = useMemo(() => {
    const arr = Array.isArray(comercializadorData?.DATA)
      ? comercializadorData.DATA
      : Array.isArray(comercializadorData?.data)
        ? comercializadorData.data
        : Array.isArray(comercializadorData)
          ? comercializadorData
          : [];
    const first = (arr as any[])[0];
    const interno = first?.interno ?? first?.Interno;
    const n = Number(interno);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [comercializadorData]);

  if (comercializadorError) {
    return (
      <div className={styles.container}>
        <p>No se pudo cargar el comercializador.</p>
      </div>
    );
  }

  if (isLoadingComercializador) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSizeOptions={[5, 10, 20]}
        isLoading={true}
      />
    );
  }

  if (!comercializadorInterno) {
    return (
      <div className={styles.container}>
        <p>No se encontró el comercializador asociado al usuario.</p>
      </div>
    );
  }

  return (
    <PolizasTable
      params={{
        ComercializadorInterno: comercializadorInterno,
        ...(cuitConsulta ? ({ CUIT: cuitConsulta } as any) : {}),
      } as any}
    />
  );
}

function PolizasOrganizadorComercializador({ cuitConsulta }: { cuitConsulta?: number }) {
  const { user } = useAuth();
  const userRol = String((user as any)?.rol ?? '');
  const isOrganizadorComercializador = userRol.toLowerCase() === 'organizadorcomercializador';
  const userCUIL = Number(
    normalizeDigits((user as any)?.cuit ?? (user as any)?.CUIL ?? (user as any)?.cuil ?? 0)
  );

  const {
    data: organizadorData,
    error: organizadorError,
    isLoading: isLoadingOrganizador,
  } = ArtAPI.useGetOrganizadorURL(
    isOrganizadorComercializador && Number.isFinite(userCUIL) && userCUIL > 0
      ? ({ CUIL: userCUIL } as any)
      : ({} as any)
  );

  const organizadorInterno = useMemo(() => {
    const arr = Array.isArray(organizadorData?.DATA)
      ? organizadorData.DATA
      : Array.isArray(organizadorData?.data)
        ? organizadorData.data
        : Array.isArray(organizadorData)
          ? organizadorData
          : [];
    const first = (arr as any[])[0];
    const interno = first?.interno ?? first?.Interno;
    const n = Number(interno);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [organizadorData]);

  if (organizadorError) {
    return (
      <div className={styles.container}>
        <p>No se pudo cargar el organizador comercializador.</p>
      </div>
    );
  }

  if (isLoadingOrganizador) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSizeOptions={[5, 10, 20]}
        isLoading={true}
      />
    );
  }

  if (!organizadorInterno) {
    return (
      <div className={styles.container}>
        <p>No se encontró el organizador comercializador asociado al usuario.</p>
      </div>
    );
  }

  return (
    <PolizasTable
      params={{
        OrganizadorComercializadorInterno: organizadorInterno,
        ...(cuitConsulta ? ({ CUIT: cuitConsulta } as any) : {}),
      } as any}
    />
  );
}

function PolizasGrupoOrganizador({ cuitConsulta }: { cuitConsulta?: number }) {
  const { user } = useAuth();
  const userRol = String((user as any)?.rol ?? '');
  const isGrupoOrganizador = userRol.toLowerCase() === 'grupoorganizador';
  const userCUIL = Number(
    normalizeDigits((user as any)?.cuit ?? (user as any)?.CUIL ?? (user as any)?.cuil ?? 0)
  );

  const {
    data: gOrganizadorData,
    error: gOrganizadorError,
    isLoading: isLoadingGOrganizador,
  } = ArtAPI.useGetGOrganizadorURL(
    isGrupoOrganizador && Number.isFinite(userCUIL) && userCUIL > 0
      ? ({ CUIL: userCUIL } as any)
      : ({} as any)
  );

  const grupoOrganizadorInterno = useMemo(() => {
    const arr = Array.isArray(gOrganizadorData?.DATA)
      ? gOrganizadorData.DATA
      : Array.isArray(gOrganizadorData?.data)
        ? gOrganizadorData.data
        : Array.isArray(gOrganizadorData)
          ? gOrganizadorData
          : [];
    const first = (arr as any[])[0];
    const interno = first?.interno ?? first?.Interno;
    const n = Number(interno);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  }, [gOrganizadorData]);

  if (gOrganizadorError) {
    return (
      <div className={styles.container}>
        <p>No se pudo cargar el grupo organizador.</p>
      </div>
    );
  }

  if (isLoadingGOrganizador) {
    return (
      <DataTable
        columns={columns}
        data={[]}
        pageSizeOptions={[5, 10, 20]}
        isLoading={true}
      />
    );
  }

  if (!grupoOrganizadorInterno) {
    return (
      <div className={styles.container}>
        <p>No se encontró el grupo organizador asociado al usuario.</p>
      </div>
    );
  }

  return (
    <PolizasTable
      params={{
        GrupoOrganizadorInterno: grupoOrganizadorInterno,
        ...(cuitConsulta ? ({ CUIT: cuitConsulta } as any) : {}),
      } as any}
    />
  );
}

function PolizasPage() {

  const { empresas, isLoading: isLoadingEmpresas } = useEmpresasStore();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<Empresa | null>(null);
  const seleccionAutomaticaRef = useRef(false);
  const [cuitBusqueda, setCuitBusqueda] = useState<string>('');
  const [cuitConsulta, setCuitConsulta] = useState<number | undefined>(undefined);



  const { user } = useAuth();
  const empresaCUIT = Number((user as any)?.empresaCUIT ?? 0);
  const userRol = String((user as any)?.rol ?? '');
  const isAdmin = userRol.toLowerCase() === 'administrador';

  const isComercializador = userRol.toLowerCase() === 'comercializador';
  const isOrganizadorComercializador = userRol.toLowerCase() === 'organizadorcomercializador';
  const isGrupoOrganizador = userRol.toLowerCase() === 'grupoorganizador';

  // Seleccionar automáticamente si solo hay una empresa
  useEffect(() => {
    if (!isLoadingEmpresas) {
      if (empresas.length === 1) {
        setEmpresaSeleccionada(empresas[0]);
        seleccionAutomaticaRef.current = true;
      } else if (empresas.length !== 1 && seleccionAutomaticaRef.current) {
        setEmpresaSeleccionada(null);
        seleccionAutomaticaRef.current = false;
      }
    }
  }, [empresas.length, isLoadingEmpresas]);

  // Cuando cambia la empresa seleccionada, actualizo el CUIT de consulta y el input
  useEffect(() => {
    const cuit = empresaSeleccionada?.cuit;
    const digits = normalizeDigits(cuit);
    if (digits) {
      const asNumber = Number(digits);
      if (Number.isFinite(asNumber) && asNumber > 0) {
        setCuitConsulta(asNumber);
        setCuitBusqueda(digits);
        return;
      }
    }
    // Si no hay empresa seleccionada, no piso el comportamiento del admin / fallback,
    // simplemente limpio la búsqueda explícita.
    setCuitConsulta(undefined);
  }, [empresaSeleccionada]);

  const handleEmpresaChange = (_event: React.SyntheticEvent, newValue: Empresa | null) => {
    setEmpresaSeleccionada(newValue);
    seleccionAutomaticaRef.current = false;
  };

  const getEmpresaLabel = (empresa: Empresa | null): string => {
    if (!empresa) return "";
    return `${empresa.razonSocial} - ${Formato.CUIP(empresa.cuit)}`;
  };





  const params = useMemo(() => {
    if (isAdmin) {
      return cuitConsulta ? ({ CUIT: cuitConsulta } as any) : ({} as any);
    }

    const cuitPorDefecto = Number.isFinite(empresaCUIT) && empresaCUIT > 0 ? empresaCUIT : undefined;
    const cuitFinal = cuitConsulta ?? cuitPorDefecto;
    return cuitFinal ? ({ CUIT: cuitFinal } as any) : ({} as any);
  }, [cuitConsulta, empresaCUIT, isAdmin]);

  const onBuscar = () => {
    const q = normalizeDigits(cuitBusqueda);
    if (!q) {
      setCuitConsulta(undefined);
      return;
    }
    const asNumber = Number(q);
    if (Number.isFinite(asNumber) && asNumber > 0) {
      setCuitConsulta(asNumber);
    }
  };

  return (
    <div className={styles.container}>

     {/* Selector de empresa */}
     <Box sx={{ maxWidth: 650, marginBottom: 2 }}>
       <CustomSelectSearch<Empresa>
         options={empresas}
         getOptionLabel={getEmpresaLabel}
         value={empresaSeleccionada}
         onChange={handleEmpresaChange}
         label="Seleccionar Empresa"
         placeholder="Buscar empresa..."
         loading={isLoadingEmpresas}
         loadingText="Cargando empresas..."
         noOptionsText={
           isLoadingEmpresas
             ? "Cargando..."
             : empresas.length === 0
             ? "No hay empresas disponibles"
             : "No se encontraron empresas"
         }
         disabled={isLoadingEmpresas}
       />
     </Box>


      <div className={styles.toolbar}>
        <input
          type="text"
          placeholder="Ingresá CUIT/CUIL (solo números)"
          value={cuitBusqueda}
          onChange={(e) => setCuitBusqueda(e.target.value.replace(/[^\d]/g, ''))}
          onKeyDown={(e) => e.key === 'Enter' && onBuscar()}
          className={styles.input}
        />
        <CustomButton onClick={onBuscar}>BUSCAR</CustomButton>
      </div>

      {isComercializador ? (
        <PolizasComercializador cuitConsulta={cuitConsulta} />
      ) : isOrganizadorComercializador ? (
        <PolizasOrganizadorComercializador cuitConsulta={cuitConsulta} />
      ) : isGrupoOrganizador ? (
        <PolizasGrupoOrganizador cuitConsulta={cuitConsulta} />
      ) : (
        <PolizasTable params={params} />
      )}
    </div>
  );
}

export default PolizasPage;