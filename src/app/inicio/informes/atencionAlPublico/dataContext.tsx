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
import QueriesAPI, { type Query } from "@/data/queryAPI";
import Formato from "@/utils/Formato";
import propositionFormat from "@/utils/PropositionFormatQuery";
import { operators } from "@/utils/ui/QueryBuilderDefaults";
import { ColumnDef } from "@tanstack/react-table";

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
  query: { state: RuleGroupType; setState: React.Dispatch<React.SetStateAction<RuleGroupType>> };
  dialog?: React.ReactNode;
  onAplica: () => void;
  onLimpia: () => void;
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

  // map de operadores por tipo, usando tu defaults locales si existen
  const pickOperatorsByType = (t?: TablesField["type"]): DefaultOperators | undefined => {
    // si el archivo "@/utils/ui/QueryBuilderDefaults" define por tipo, usarlos
    if (t && operators && typeof operators === "object" && operators[t]) return operators[t];
    // fallback: undefined => RQB usará sus defaults
    return undefined;
  };

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
      operators: colOps ?? pickOperatorsByType(type),
      valueEditorType,
      values,
      inputType: type ? (type === "dateTime" ? "datetime-local" : type) : undefined,
    }));

    return { columns, fields };
  }, [tables.vw_AtencionAlPublico]);

  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState(defaultQuery);
  const [dialog, setDialog] = useState<React.ReactNode>();

  const onCloseDialog = () => setDialog(null);
  const errorDialog = (prop: { title?: string; message: any }) =>
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
    );

  const onAplica = useCallback(() => {
    const proposition = formatQuery(query, propositionFormat({ fields }));

    return (async function procesar() {
      const table = "vw_AtencionAlPublico" as const;

      const q: Query = {
        // alias = nombre exacto (como en tu componente de referencia)
        select: tables[table].map((c) => ({ value: c.name, name: c.name })),
        from: [{ table }],
        order: { by: [tables[table][0].name] }, // orden por primera columna: Interno
      };

      if (proposition) q.where = proposition;

      async function onConfirm() {
        await execute<Row>(q)
          .then((ok) => {
            const data = ok.data ?? [];
            setRows(data);

            // Diagnóstico: aviso de columnas faltantes, si aplica
            try {
              const first = data[0];
              if (first) {
                const got = Object.keys(first);
                const expected = tables[table].map((c) => c.name);
                const missing = expected.filter(
                  (n) => !got.some((k) => normalizeKey(k) === normalizeKey(n))
                );
                if (missing.length) {
                  console.warn("[atencion-publico] columnas no presentes en la respuesta:", missing);
                  errorDialog({
                    title: "Aviso de columnas faltantes",
                    message:
                      `Estas columnas no vienen en la respuesta del API (o llegan nulas):\n\n` +
                      missing.join(", "),
                  });
                }
              }
            } catch {}

            onCloseDialog();
          })
          .catch((error) =>
            errorDialog({
              message:
                typeof error === "string"
                  ? error
                  : error?.detail ?? error?.message ?? JSON.stringify(error),
            })
          );
      }

      await analyze(q)
        .then(async (ok) =>
          ok.count > 90
            ? setDialog(
                <Dialog open scroll="paper" onClose={onCloseDialog}>
                  <DialogTitle>Consulta con muchos registros</DialogTitle>
                  <DialogContent dividers>
                    <DialogContentText tabIndex={-1}>
                      La consulta generará {ok.count} registros.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={onCloseDialog}>Cancela</Button>
                    <Button onClick={onConfirm}>Continúa</Button>
                  </DialogActions>
                </Dialog>
              )
            : onConfirm()
        )
        .catch((error) =>
          errorDialog({
            message:
              typeof error === "string"
                ? error
                : error?.detail ?? error?.message ?? JSON.stringify(error),
          })
        );
    })();
  }, [query, fields, tables]);

  const onLimpia = useCallback(() => {
    setQuery(defaultQuery);
    setRows([]);
  }, []);

  const value: DataContextType = {
    fields,
    columns,
    rows,
    dialog,
    query: { state: query, setState: setQuery },
    onAplica,
    onLimpia,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// ===== Hook =====
export function useDataContext() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataContextProvider");
  }
  return context;
}
