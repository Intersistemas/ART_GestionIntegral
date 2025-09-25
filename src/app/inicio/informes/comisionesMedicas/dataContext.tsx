import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Field, formatQuery, type RuleGroupType, type ValueEditorType, type DefaultOperators, defaultOperators } from 'react-querybuilder';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { type GridColType } from '@mui/x-data-grid';
import QueriesAPI, { type Query } from '@/data/queryAPI';
import Formato from '@/utils/Formato';
import propositionFormat from '@/utils/PropositionFormatQuery';
import * as rtl from "@/utils/QueryBuilderDefaults"
import { ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { saveTable, TableColumn, type AddTableOptions } from '@/utils/excelUtils';

//#region types
type Row = Record<string, any>;
type Formatter = (value: any) => any;
type TablesName = "RefCCMMMotivos" | "RefCCMMTipos" | "View_ConsultaCCMM";
interface TablesField {
  name: string;
  label?: string;
  type?: GridColType;
  operators?: DefaultOperators;
  formatter?: Formatter;
  valueEditorType?: ValueEditorType;
  values?: any[];
}
type Tables = Record<TablesName, TablesField[]>;
type OptionsFormatter = (options: any) => Formatter;
type OptionsValues = (options: any) => { name: string, label: any }[];
interface DataContextType {
  fields: Field[];
  columns: ColumnDef<Row>[];
  rows: Row[];
  query: { state: RuleGroupType, setState: React.Dispatch<React.SetStateAction<RuleGroupType>> };
  dialog?: ReactNode;
  onAplicaFiltro: () => void;
  onLimpiaFiltro: () => void;
  onLimpiaTabla: () => void;
  onExport: () => void;
}
type Headers = { columns: Record<string, TableColumn>, options: AddTableOptions };
//#endregion types

//#region globales
const { execute, useExecute, analyze } = QueriesAPI;
const defaultQuery: RuleGroupType = { combinator: 'and', rules: [] };

const numeroSiniestroFormatter = (v: any) => Formato.Mascara(v, "####-######-##");
const fechaHoraFormatter = (v: any) => Formato.FechaHora(v);
const fechaFormatter = (v: any) => Formato.Fecha(v);
const numeroFormatter = (v: any) => Formato.Numero(v);
const cuipFormatter = (v: any) => Formato.CUIP(v);
const valueOptionsFormatter: OptionsFormatter = (options: any) => ((v: string) => (options[v] ?? v));
const blankOptionsFormatter: OptionsFormatter = (options: any) => ((v: string) => (options[v] ?? ""));

const optionsValues: OptionsValues = (options: any) => Object.entries<string>(options).map(([name, label]) => ({ name, label }))
const optionsSelect = (options: any, formatter = valueOptionsFormatter, values = optionsValues): {
  operators: DefaultOperators,
  valueEditorType: ValueEditorType,
  formatter: Formatter,
  values: any[],
} => ({
  operators: defaultOperators.filter((op) => op.name === '='),
  valueEditorType: "select",
  formatter: formatter(options),
  values: values(options),
});
const SNOptions = { S: "Si", N: "No" };
const tipoSiniestroOptions = { T: "Accidente Trabajo", P: "Enfermedad Profesional", I: "Accidente In-Itinere", R: "Reingreso" };
const estadoOptions = { 1: "Pendiente", 2: "En gestión", 3: "Archivado" };

const DataContext = createContext<DataContextType | undefined>(undefined);
//#endregion globales

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<Tables>({
    RefCCMMMotivos: [{ name: "Codigo" }, { name: "Descripcion" }],
    RefCCMMTipos: [{ name: "Codigo" }, { name: "Descripcion" }],
    View_ConsultaCCMM: [
      { name: "CCMMCas_Interno", label: "Interno", type: "number" },
      { name: "Den_SiniestroNro", label: "Siniestro", type: "number", formatter: numeroSiniestroFormatter },
      { name: "CCMMCas_MotivoCodigo", label: "Motivo Expediente" },
      { name: "CCMMCas_TipoCodigo", label: "Tipo Expediente" },
      { name: "CCMMCas_Estado", label: "Estado Actual", ...optionsSelect(estadoOptions, blankOptionsFormatter) },
      { name: "SiniestroTipo", label: "Tipo Siniestro", ...optionsSelect(tipoSiniestroOptions) },
      { name: "SiniestroFechaHora", label: "Fecha denuncia", type: "dateTime", formatter: fechaHoraFormatter },
      { name: "Den_AfiCUIL", label: "Cuil", type: "number", formatter: cuipFormatter },
      { name: "Den_AfiNombre", label: "Apellido Nombre" },
      { name: "Den_EmpCuit", label: "Cuit", type: "number", formatter: cuipFormatter },
      { name: "Den_EmpRazonSocial", label: "Razon Social" },
      { name: "SRTPol_Numero", label: "Poliza", type: "number", formatter: numeroFormatter },
      { name: "CCMMCasTipValDan_JunMediFecha", label: "Fecha Junta Medica", type: "date", formatter: fechaFormatter },
      { name: "CCMMCasTipValDan_JunMediAcuerdo", label: "Acuerdo Resultado", ...optionsSelect(SNOptions) },
      { name: "CCMMCasTipValDan_JunMediLetrado", label: "Letrado Interviniente" },
      { name: "CCMMCasTipValDan_AudHomoFechaHora", label: "Fecha Homologacion", type: "date", formatter: fechaHoraFormatter },
      { name: "CCMMCasTipValDan_AudHomoMontoHomologado", label: "Monto Homologado", type: "number", formatter: numeroFormatter },
      { name: "CCMMCasTipValDan_AcuHomoNotificacionFecha", label: "Fecha Acuerdo", type: "date", formatter: fechaFormatter },
      { name: "CCMMCasTipValDan_AcuHomoPagoFecha", label: "Fecha Pago", type: "date", formatter: fechaFormatter },
    ]
  });
  //#region RefCCMMMotivos
  const { data: motivos } = useExecute({
    select: tables.RefCCMMMotivos.map(f => ({ value: f.name })),
    from: [{ table: "RefCCMMMotivos" }],
    order: { by: [tables.RefCCMMMotivos[0].name] },
  });
  useEffect(() => {
    if (!motivos?.data) return;
    const options = Object.fromEntries(motivos.data.map(e => [e[tables.RefCCMMMotivos[0].name], e[tables.RefCCMMMotivos[1].name]]));
    setTables((o) => {
      const fieldIx = o.View_ConsultaCCMM.findIndex(r => r.name === "CCMMCas_MotivoCodigo");
      if (fieldIx < 0) return o;
      const tables = { ...o, View_ConsultaCCMM: [...o.View_ConsultaCCMM] };
      tables.View_ConsultaCCMM[fieldIx] = { ...tables.View_ConsultaCCMM[fieldIx], ...optionsSelect(options) };
      return tables;
    });
  }, [motivos]);
  //#endregion RefCCMMMotivos
  //#region RefCCMMTipos
  const { data: tipos } = useExecute({
    select: tables.RefCCMMTipos.map(f => ({ value: f.name })),
    from: [{ table: "RefCCMMTipos" }],
    order: { by: [tables.RefCCMMTipos[0].name] },
  });
  useEffect(() => {
    if (!tipos?.data) return;
    const options = Object.fromEntries(tipos.data.map(e => [e[tables.RefCCMMTipos[0].name], e[tables.RefCCMMTipos[1].name]]));
    setTables((o) => {
      const fieldIx = o.View_ConsultaCCMM.findIndex(r => r.name === "CCMMCas_TipoCodigo");
      if (fieldIx < 0) return o;
      const tables = { ...o, View_ConsultaCCMM: [...o.View_ConsultaCCMM] };
      tables.View_ConsultaCCMM[fieldIx] = { ...tables.View_ConsultaCCMM[fieldIx], ...optionsSelect(options, blankOptionsFormatter) };
      return tables;
    });
  }, [tipos]);
  //#endregion RefCCMMTipos
  const { columns, fields, headers } = useMemo(() => {
    const columns: ColumnDef<Row>[] = [];
    const headers: Headers = { columns: {}, options: { formatters: { row: {} } } };
    const fields: Field[] = tables.View_ConsultaCCMM.slice(1).map(column => {
      const { name, label, formatter, operators, valueEditorType, values, type } = column;
      columns.push({
        accessorKey: name,
        header: label ?? name,
        cell: formatter ? (info) => formatter(info.getValue()) : undefined
      });
      headers.columns[name] = { key: name, header: label ?? name };
      if (formatter) headers.options.formatters!.row![name] = formatter;
      return ({
        name, label: label ?? name, operators, valueEditorType, values,
        inputType: type ? type === "dateTime" ? "datetime-local" : type : undefined
      });
    });
    return ({ columns, fields, headers });
  }, [tables.View_ConsultaCCMM]);
  const [rows, setRows] = useState<Row[]>([]);
  const [query, setQuery] = useState(defaultQuery);
  const [dialog, setDialog] = useState<ReactNode>();

  const onCloseDialog = useCallback(() => setDialog(null), []);
  const errorDialog = useCallback((prop: { title?: string, message: any }) => setDialog(
    <Dialog
      open
      scroll="paper"
      onClose={onCloseDialog}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      {prop.title === undefined ? (null) : (<DialogTitle id="scroll-dialog-title">{prop.title}</DialogTitle>)}
      <DialogContent dividers>
        <DialogContentText id="scroll-dialog-description" tabIndex={-1}>{prop.message}</DialogContentText>
      </DialogContent>
      <DialogActions><Button onClick={onCloseDialog}>Cierra</Button></DialogActions>
    </Dialog>
  ), []);

  const onAplicaFiltro = useCallback(async () => {
    const proposition = formatQuery(query, propositionFormat({ fields }));
    const table = "View_ConsultaCCMM";
    const apiQuery: Query = {
      select: tables[table].map(c => ({ value: c.name })),
      from: [{ table }],
      order: { by: [tables[table][0].name] }
    };
    if (proposition) apiQuery.where = proposition;
    async function onConfirm() {
      await execute<Row>(apiQuery).then((ok) => {
        setRows(ok.data ?? []);
        onCloseDialog();
      }).catch((error) => errorDialog(
        { message: typeof error === "string" ? error : error.detail ?? error.message ?? JSON.stringify(error) }
      ));
    };
    await analyze(apiQuery).then(async (ok) => (ok.count > 90)
      ? setDialog(
        <Dialog
          open
          scroll="paper"
          onClose={onCloseDialog}
          aria-labelledby="scroll-dialog-title"
          aria-describedby="scroll-dialog-description"
        >
          <DialogTitle id="scroll-dialog-title">Consulta con muchos registros.</DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
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
    ).catch((error) => errorDialog(
      { message: typeof error === "string" ? error : error.detail ?? error.message ?? JSON.stringify(error) }
    ));
  }, [query, fields, onCloseDialog, errorDialog]);

  const onLimpiaFiltro = useCallback(() => setQuery(defaultQuery), []);

  const onLimpiaTabla = useCallback(() => setRows([]), []);

  const onExport = useCallback(async () => {
    const now = moment();
    const options = { sheet: { name: "Comisiones Medicas" }, table: headers.options };
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
  }, [headers, rows, onCloseDialog, errorDialog]);

  const value = {
    fields, columns, rows, dialog,
    query: { state: query, setState: setQuery },
    onAplicaFiltro, onLimpiaFiltro, onLimpiaTabla, onExport
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useDataContext() {
  const context = useContext(DataContext)
  if (context === undefined) throw new Error('useDataContext must be used within a DataContextProvider');
  return context
}
