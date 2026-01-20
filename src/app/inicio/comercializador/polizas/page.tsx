"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from '@/data/AuthContext';
import DataTable from '@/utils/ui/table/DataTable';
import type { ColumnDef } from '@tanstack/react-table';
import ArtAPI from '@/data/artAPI';
import Formato from '@/utils/Formato';
import styles from './poliza.module.css';
import { Box } from "@mui/material";
import CustomSelectSearch from "@/utils/ui/form/CustomSelectSearch";
import { BsFileText, BsCardChecklist, BsGraphUpArrow, BsCalendar2Plus } from 'react-icons/bs';
import Link from 'next/link';
import type { Poliza, EmpresaOption } from "./types/poliza";

const columns: ColumnDef<Poliza>[] = [
  { accessorKey: 'numero', header: 'Nro. Poliza', meta: { align: 'left' } },
  {
    accessorKey: 'CUIT',
    header: 'CUIT',
    meta: { align: 'left' },
    cell: (info: any) => {
      const v = info.getValue();
      const vDigits = digits(v);
      return Formato.CUIP(vDigits) || String(v ?? '');
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

  {
    id: 'accion',
    header: 'Acción',
    meta: { align: 'center' },
    cell: ({ row }: any) => {
      const cuitDigits = digits(row?.original?.CUIT);
      return (
        <div className={styles.iconActions}>
          <Link
            href={{ pathname: '/inicio/empleador/poliza', query: { cuit: cuitDigits } }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Ver póliza del empleador"
          >
            <BsFileText title="Poliza" className={styles.iconButton} />
          </Link>

          <Link
            href={{ pathname: '/inicio/empleador/cobertura', query: { cuit: cuitDigits } }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Ver coberturas del empleador"
          >
          <BsCardChecklist title="Cobertura" className={styles.iconButton} />
          </Link>

          <Link
            href={{ pathname: '/inicio/empleador/cuentaCorriente', query: { cuit: cuitDigits } }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Ver CtaCte del empleador"
          >
          <BsGraphUpArrow title="CuentaCorriente" className={styles.iconButton} />
          </Link>

          <Link
            href={{ pathname: '/inicio/empleador/siniestros', query: { cuit: cuitDigits } }}
            onClick={(e) => e.stopPropagation()}
            aria-label="Ver póliza del empleador"
          >
          <BsCalendar2Plus title="Siniestros" className={styles.iconButton} />
          </Link>


        </div>
      );
    },
    enableHiding: true,
  },
];

function digits(value: unknown) {
  return String(value ?? '').replace(/\D/g, '');
}

function arr(data: any): any[] {
  if (Array.isArray(data?.DATA)) return data.DATA;
  if (Array.isArray(data?.data)) return data.data;
  return Array.isArray(data) ? data : [];
}

function firstInterno(data: any): number | undefined {
  const first = arr(data)[0];
  const n = Number(first?.interno ?? first?.Interno);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

function uniqueInternosCsv(data: any): string | undefined {
  const set = new Set<number>();
  for (const x of arr(data)) {
    const n = Number(x?.interno ?? x?.Interno);
    if (Number.isFinite(n) && n > 0) set.add(n);
  }
  return set.size ? Array.from(set).join(',') : undefined;
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

function PolizasListado({ params }: { params: any }) {
  const { data: apiData, error, isLoading } = ArtAPI.useGetPolizaComercializadorURL(params);
  const rows = useMemo(() => mapPolizasToRows(apiData), [apiData]);

  const empresas = useMemo(() => {
    const map = new Map<string, EmpresaOption>();
    for (const r of rows) {
      const razon = String(r?.Empleador_Denominacion ?? '').trim();
      const cuit = digits(r?.CUIT);
      const key = cuit || razon.toLowerCase();
      if (!key) continue;
      if (!map.has(key)) map.set(key, { razonSocial: razon || cuit, cuit: cuit || undefined });
    }
    return Array.from(map.values()).sort((a, b) =>
      a.razonSocial.localeCompare(b.razonSocial, 'es', { sensitivity: 'base' })
    );
  }, [rows]);

  const [empresa, setEmpresa] = useState<EmpresaOption | null>(null);

  const filteredRows = useMemo(() => {
    if (!empresa) return rows;
    if (empresa.cuit) return rows.filter((r) => digits(r?.CUIT) === empresa.cuit);
    const rs = empresa.razonSocial.trim().toLowerCase();
    return rows.filter((r) => String(r?.Empleador_Denominacion ?? '').trim().toLowerCase() === rs);
  }, [rows, empresa]);

  if (error) {
    return (
      <div className={styles.container}>
        <p>No se pudieron cargar las pólizas.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Box sx={{ maxWidth: 650, marginBottom: 2 }}>
        <CustomSelectSearch<EmpresaOption>
          options={empresas}
          getOptionLabel={(e) => String(e?.razonSocial ?? '')}
          value={empresa}
          onChange={(_event, newValue) => {
            setEmpresa(newValue);
          }}
          label="Empresa"
          placeholder="Filtrar por razón social..."
          loading={isLoading}
          loadingText="Cargando..."
          noOptionsText={isLoading ? "Cargando..." : "No se encontraron empresas"}
          disabled={isLoading || empresas.length === 0}
        />
      </Box>

      <DataTable
        columns={columns}
        data={filteredRows}
        pageSizeOptions={[5, 10, 20]}
        isLoading={isLoading}
      />
    </div>
  );
}

function PolizasComercializador() {
  const { user } = useAuth();
  const userRol = String((user as any)?.rol ?? '');
  const isComercializador = userRol.toLowerCase() === 'comercializador';
  const userCUIL = Number(
    digits((user as any)?.cuit ?? (user as any)?.CUIL ?? (user as any)?.cuil ?? 0)
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
    return firstInterno(comercializadorData);
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
    <PolizasListado
      params={{
        ComercializadoresInternos: String(comercializadorInterno),
      } as any}
    />
  );
}

function PolizasOrganizadorComercializador() {
  const { user } = useAuth();
  const userCUIL = Number(digits((user as any)?.cuit ?? (user as any)?.CUIL ?? (user as any)?.cuil ?? 0));
  const userCUILValid = Number.isFinite(userCUIL) && userCUIL > 0 ? userCUIL : undefined;

  const { data: organizadorData, error: organizadorError, isLoading: isLoadingOrganizador } =
    ArtAPI.useGetOrganizadorURL(userCUILValid ? ({ CUIL: userCUILValid } as any) : ({} as any));

  const organizadorInterno = useMemo(() => firstInterno(organizadorData), [organizadorData]);

  const { data: comercializadoresData, error: comercializadoresError, isLoading: isLoadingComercializadores } =
    ArtAPI.useGetComercializadorURL(
      organizadorInterno
        ? ({ ComercializadoresOrganizadoresInternos: organizadorInterno } as any)
        : ({} as any)
    );

  const comercializadoresInternos = useMemo(
    () => uniqueInternosCsv(comercializadoresData),
    [comercializadoresData]
  );

  if (!userCUILValid) return <div className={styles.container}><p>Falta el CUIL del usuario.</p></div>;

  if (isLoadingOrganizador || isLoadingComercializadores) {
    return <DataTable columns={columns} data={[]} pageSizeOptions={[5, 10, 20]} isLoading={true} />;
  }

  if (organizadorError || comercializadoresError || !organizadorInterno || !comercializadoresInternos) {
    return <div className={styles.container}><p>No se pudieron resolver las pólizas del organizador.</p></div>;
  }

  return (
    <PolizasListado
      params={{
        ComercializadoresInternos: comercializadoresInternos,
      } as any}
    />
  );
}


function PolizasGrupoOrganizador() {
  const { user } = useAuth();
  const userCUIL = Number(digits((user as any)?.cuit ?? (user as any)?.CUIL ?? (user as any)?.cuil ?? 0));
  const userCUILValid = Number.isFinite(userCUIL) && userCUIL > 0 ? userCUIL : undefined;

  const { data: gOrgData, error: gOrgError, isLoading: isLoadingGOrg } =
    ArtAPI.useGetGOrganizadorURL(userCUILValid ? ({ CUIL: userCUILValid } as any) : ({} as any));

  const gOrganizadorInterno = useMemo(() => firstInterno(gOrgData), [gOrgData]);

  const { data: organizadoresData, error: organizadoresError, isLoading: isLoadingOrganizadores } =
    ArtAPI.useGetOrganizadorURL(
      gOrganizadorInterno
        ? ({ SRTComercializadorGOrganizadorInterno: gOrganizadorInterno } as any)
        : ({} as any)
    );

  const organizadoresInternos = useMemo(() => uniqueInternosCsv(organizadoresData), [organizadoresData]);

  const { data: comercializadoresData, error: comercializadoresError, isLoading: isLoadingComercializadores } =
    ArtAPI.useGetComercializadorURL(
      organizadoresInternos
        ? ({ ComercializadoresOrganizadoresInternos: organizadoresInternos } as any)
        : ({} as any)
    );

  const comercializadoresInternos = useMemo(
    () => uniqueInternosCsv(comercializadoresData),
    [comercializadoresData]
  );

  if (!userCUILValid) return <div className={styles.container}><p>Falta el CUIL del usuario.</p></div>;

  if (isLoadingGOrg || isLoadingOrganizadores || isLoadingComercializadores) {
    return <DataTable columns={columns} data={[]} pageSizeOptions={[5, 10, 20]} isLoading={true} />;
  }

  if (gOrgError || organizadoresError || comercializadoresError || !gOrganizadorInterno || !comercializadoresInternos) {
    return <div className={styles.container}><p>No se pudieron resolver las pólizas del Grupo Organizador.</p></div>;
  }

  return (
    <PolizasListado
      params={{
        ComercializadoresInternos: comercializadoresInternos,
      } as any}
    />
  );
}

function PolizasDefault() {
  const { user } = useAuth();
  const role = String((user as any)?.rol ?? '').toLowerCase();
  const isAdmin = role === 'administrador';

  const userEmpresaCuit = Number(digits((user as any)?.empresaCUIT ?? (user as any)?.cuit ?? 0));
  const params = useMemo(() => {
    if (isAdmin) return {} as any;
    return Number.isFinite(userEmpresaCuit) && userEmpresaCuit > 0 ? ({ CUIT: userEmpresaCuit } as any) : ({} as any);
  }, [isAdmin, userEmpresaCuit]);

  return <PolizasListado params={params} />;
}

function PolizasPage() {
  const { user } = useAuth();
  const userRol = String((user as any)?.rol ?? '').toLowerCase();
  const isComercializador = userRol === 'comercializador';
  const isOrganizadorComercializador = userRol === 'organizadorcomercializador';
  const isGrupoOrganizador = userRol === 'grupoorganizador';

  if (isComercializador) return <PolizasComercializador />;
  if (isOrganizadorComercializador) return <PolizasOrganizadorComercializador />;
  if (isGrupoOrganizador) return <PolizasGrupoOrganizador />;

  return <PolizasDefault />;
}

export default PolizasPage;