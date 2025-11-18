"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Field,
  formatQuery,
  type RuleGroupType,
  type ValueEditorType,
  type DefaultOperators,
} from "react-querybuilder";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import QueriesAPI, { FiltroVm, type Query } from "@/data/queryAPI";
import Formato from "@/utils/Formato";
import propositionFormat from "@/utils/PropositionFormatQuery";
import { operators } from "@/utils/ui/queryBuilder/QueryBuilderDefaults";
import { ColumnDef } from "@tanstack/react-table";
import { saveTable, type TableColumn, type AddTableOptions } from '@/utils/excelUtils';
import moment from 'moment';
import CustomModal from '@/utils/ui/form/CustomModal';
import FiltroForm from '@/components/filtros/FiltroForm';
import { FiltrosTable, FiltrosTableContextProvider } from '@/components/filtros/FiltrosTable';
import parsePropositionGroup from '@/utils/PropositionParseQuery';

// ===== Tipos =====
type Row = Record<string, any>;
type Formatter = (value: any) => any;
type TablesName = "vw_AtencionAlPublico";
interface TablesField {
  name: string;
  label?: string;
  type?: "text" | "number" | "date" | "dateTime";
  operators?: DefaultOperators;
  formatter?: Formatter;
  valueEditorType?: ValueEditorType;
  values?: any[];
}
type Tables = Record<TablesName, TablesField[]>;
interface DataContextType {
  fields: Field[];
  columns: ColumnDef<Row>[];
  rows: Row[];
  isLoadingData: boolean;
  query: { state: RuleGroupType; setState: React.Dispatch<React.SetStateAction<RuleGroupType>> };
  dialog?: React.ReactNode;
  proposition?: string;
  filtro?: FiltroVm;
  onLookupFiltro: () => void;
  onGuardaFiltro: () => void;
  onEliminaFiltro: () => void;
  onAplica: () => void;
  onLimpia: () => void;
  onLimpiaTabla: () => void;
  onExport: () => void;
}

// ===== Helpers / formatters =====
const fechaHoraFormatter = (v: any) => Formato.FechaHora(v);
const fechaFormatter = (v: any) => Formato.Fecha(v);
const numeroFormatter = (v: any) => Formato.Numero(v);
const cuipFormatter = (v: any) => Formato.CUIP(v);

// accessor tolerante (case-insensitive y sin _ ni espacios)
const normalizeKey = (s: string) => (typeof s === "string" ? s.toLowerCase().replace(/[_\s]/g, "") : s);
const tolerantGet = (row: Row, key: string) => {
  if (!row) return undefined;
  if (key in row) return row[key];
  const nk = normalizeKey(key);
  for (const k of Object.keys(row)) {
    if (normalizeKey(k) === nk) return row[k];
  }
  return undefined;
};
// normalizo para mostrar (trim strings)
const display = (v: any) => (typeof v === "string" ? v.trim() : v);

// ===== Globals =====
const { execute, analyze } = QueriesAPI;
const defaultQuery: RuleGroupType = { combinator: "and", rules: [] };
const DataContext = createContext<DataContextType | undefined>(undefined);

// ===== Provider =====
export function DataContextProvider({ children }: { children: ReactNode }) {
  const [tables] = useState<Tables>({
    vw_AtencionAlPublico: [
      // NOTA: Había dos "Interno" duplicados; dejo uno solo
      { name: "Interno", label: "Número de Evento", type: "number", formatter: numeroFormatter },

      { name: "Apertura", label: "Fecha Contacto", type: "date", formatter: fechaFormatter },
      { name: "Cierre", label: "Fecha Último Estado", type: "date", formatter: fechaFormatter },

      { name: "TemaDescripcion", label: "Motivo", type: "text" },
      { name: "CategoriaDescripcion", label: "Categoría", type: "text" },
      { name: "TipoTramiteDescripcion", label: "Tipo Consultante", type: "text" },

      { name: "ContactoNombre", label: "Nombre", type: "text" },
      { name: "ContactoDocNro", label: "Número de Documento", type: "text", formatter: cuipFormatter },
      { name: "MedioDireccion", label: "Email", type: "text" },
      { name: "AfiliadoComentario", label: "Departamento", type: "text" },
    ],
  });



  // Columnas + campos para QB (excluyo Interno del QB, como en tu implementación previa)
  const { columns, fields } = useMemo(() => {
    const all = tables.vw_AtencionAlPublico;
    const fieldsForQB = all.filter(c => c.name !== "Interno");

    const columns: ColumnDef<Row>[] = all.map(({ name, label, formatter }) => ({
      accessorKey: name,
      header: label ?? name,
      cell: (info) => {
        const raw = tolerantGet(info.row.original, name);
        const val = display(raw);
        return formatter ? formatter(val) : (val ?? "");
      },
    }));

    const fields: Field[] = fieldsForQB.map(({ name, label, operators: colOps, valueEditorType, values, type }) => ({
      name,
      label: label ?? name,
      // si el campo trae operators propios, los respeta; sino toma por tipo
      operators: colOps,
      valueEditorType,
      values,
      inputType: type ? (type === "dateTime" ? "datetime-local" : type) : undefined,
    }));

    return { columns, fields };
  }, [tables.vw_AtencionAlPublico]);

  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState(defaultQuery);
  const [dialog, setDialog] = useState<React.ReactNode>();
  const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
  const [filtro, setFiltro] = useState<FiltroVm | undefined>();

  const onCloseDialog = useCallback(() => setDialog(null), []);
  const errorDialog = useCallback((prop: { title?: string; message: any }) =>
    setDialog(
      <Dialog open scroll="paper" onClose={onCloseDialog} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description">
        {prop.title ? <DialogTitle id="scroll-dialog-title">{prop.title}</DialogTitle> : null}
        <DialogContent dividers>
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            {prop.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>Cierra</Button>
        </DialogActions>
      </Dialog>
    ), [onCloseDialog]);

  const proposition = useMemo(() => formatQuery(query, propositionFormat({ fields })), [query, fields]);

  const onAplica = useCallback(async () => {
    const table = "vw_AtencionAlPublico" as const;
    if (!tables[table]) return;
    
    setIsLoadingData(true);
    
    const q: Query = {
      select: tables[table].map(c => ({ value: c.name })),
      from: [{ table }],
      where: proposition,
      order: { by: [tables[table][0].name] }
    };

    await analyze(q).then(
      (ok) => (ok.count > 9000) ? setDialogRegistros(ok.count) : onExecute(),
      (error) => onError(error)
    );

    function onError(error: any) {
      errorDialog({
        message: typeof error === "string" ? error : error.detail ?? error.message ?? JSON.stringify(error)
      });
      setIsLoadingData(false);
    }

    async function onExecute() {
      await execute<Row>(q).then(
        (ok) => {
          setRows(ok.data ?? []);
          onClose();
        },
        (error) => onError(error)
      );
    }

    function onClose() {
      onCloseDialog();
      setIsLoadingData(false);
    }

    function setDialogRegistros(count: number) {
      setDialog(
        <Dialog
          open
          scroll="paper"
          onClose={onClose}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Consulta con muchos registros.</DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
              La consulta generará {count} registros.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancela</Button>
            <Button onClick={onExecute}>Continúa</Button>
          </DialogActions>
        </Dialog>
      );
    }
  }, [proposition, tables, onCloseDialog, errorDialog]);

  const onLookupFiltro = useCallback(() => {
    setDialog(
      <FiltrosLookup
        onClose={onCloseDialog}
        onSelect={(filtro) => {
          setFiltro(filtro);
          setQuery(parsePropositionGroup(filtro.proposition));
          onCloseDialog();
        }}
      />
    );
  }, [onCloseDialog]);

  const onGuardaFiltro = useCallback(() => {
    setDialog(
      <FiltroForm
        action={filtro == null ? "Create" : "Update"}
        title="Guardando filtro"
        init={{
          ...filtro,
          modulo: "Informes_AtencionAlPublico",
          proposition
        }}
        onClose={(completed, filtro) => {
          if (completed) setFiltro(filtro);
          onCloseDialog();
        }}
      />
    );
  }, [filtro, proposition, onCloseDialog]);

  const onEliminaFiltro = useCallback(() => {
    setDialog(
      <FiltroForm
        action="Delete"
        title="Borrando filtro"
        init={filtro}
        disabled={{ nombre: true, ambito: true }}
        onClose={(completed) => {
          if (completed) setFiltro(undefined);
          onCloseDialog();
        }}
      />
    );
  }, [filtro, onCloseDialog]);

  const onLimpia = useCallback(() => {
    setFiltro(undefined);
    setQuery(defaultQuery);
  }, []);

  const onLimpiaTabla = useCallback(() => setRows([]), []);

  const onExport = useCallback(async () => {
    const now = moment();
    const headers: Headers = { columns: {}, options: { formatters: { row: {} } } };
    
    tables.vw_AtencionAlPublico.forEach(column => {
      const { name, label, formatter } = column;
      headers.columns[name] = { key: name, header: label ?? name };
      if (formatter) headers.options.formatters!.row![name] = formatter;
    });

    const options = { sheet: { name: "Atención al Público" }, table: headers.options };
    const fileName = `${options.sheet.name.replaceAll(" ", "_")}-${now.format("YYYYMMDDhhmmssSSS")}.xlsx`;
    options.sheet.name += ` (${now.format("DD-MM-YYYY")})`;

    setDialog(
      <Dialog
        open
        scroll="paper"
        onClose={onCloseDialog}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Exportando a excel.</DialogTitle>
      </Dialog>
    );

    await saveTable(headers.columns, rows, fileName, options).then(
      onCloseDialog,
      (e) => errorDialog({
        title: "Error al generar excel",
        message: e?.message ?? "Ocurrió un error desconocido al generar excel"
      })
    );
  }, [tables.vw_AtencionAlPublico, rows, onCloseDialog, errorDialog]);

  const value: DataContextType = {
    fields,
    columns,
    rows,
    isLoadingData,
    dialog,
    query: { state: query, setState: setQuery },
    proposition,
    filtro,
    onLookupFiltro,
    onGuardaFiltro,
    onEliminaFiltro,
    onAplica,
    onLimpia,
    onLimpiaTabla,
    onExport,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

type Headers = { columns: Record<string, TableColumn>, options: AddTableOptions };

function FiltrosLookup({
  onSelect,
  onClose,
}: {
  onSelect: (filtro: FiltroVm) => void;
  onClose: () => void;
}) {
  return (
    <CustomModal
      open={true}
      onClose={onClose}
      title="Elige filtro"
    >
      <FiltrosTableContextProvider deleted={false} modulo="Informes_AtencionAlPublico" >
        <FiltrosTable onSelect={onSelect} />
      </FiltrosTableContextProvider>
    </CustomModal>
  );
}

// ===== Hook =====
export function useDataContext() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return context;
}
