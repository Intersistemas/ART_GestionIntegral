import React, { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { type Field, formatQuery, type RuleGroupType, type ValueEditorType, type DefaultOperators, defaultOperators } from 'react-querybuilder';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { type GridColType } from '@mui/x-data-grid';
import QueriesAPI, { type Query } from '@/data/queryAPI';
import UsuarioAPI from '@/data/usuarioAPI';
import Formato from '@/utils/Formato';
import propositionFormat from '@/utils/PropositionFormatQuery';
import { type ColumnDef } from '@tanstack/react-table';
import moment from 'moment';
import { saveTable, type TableColumn, type AddTableOptions } from '@/utils/excelUtils';
import useSWR from 'swr';

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
type Tables = Partial<Record<TablesName, TablesField[]>>;
type OptionsFormatter = (options: any) => Formatter;
type OptionsValues = (options: any) => { name: string, label: any }[];
type Headers = { columns: Record<string, TableColumn>, options: AddTableOptions };
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
//#endregion types

//#region globales
const { execute, swrExecute, analyze } = QueriesAPI;
const { swrTablas } = UsuarioAPI;
const defaultQuery: RuleGroupType = { combinator: 'and', rules: [] };

const numeroSiniestroFormatter: Formatter = (v) => Formato.Mascara(v, "####-######-##");
const fechaHoraFormatter: Formatter = (v) => Formato.FechaHora(v);
const fechaFormatter: Formatter = (v) => Formato.Fecha(v);
const numeroFormatter: Formatter = (v) => Formato.Numero(v);
const cuipFormatter: Formatter = (v) => Formato.CUIP(v);
const valueOptionsFormatter: OptionsFormatter = (options) => ((v: string) => (options[v] ?? v));
const blankOptionsFormatter: OptionsFormatter = (options) => ((v: string) => (options[v] ?? ""));

const optionsValues: OptionsValues = (options) => Object.entries<string>(options).map(([name, label]) => ({ name, label }))
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

const CCMMContext = createContext<DataContextType | undefined>(undefined);
//#endregion globales

export function CCMMContextProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<Tables>({});
  const { isLoading: isLoadingTablas } = useSWR(swrTablas.Key, swrTablas.Fetcher, {
    revalidateOnFocus: false,
    onSuccess(tablas) {
      const tables: Tables = {};
      addTable("RefCCMMMotivos", (addField) => {
        addField({ name: "Codigo" });
        addField({ name: "Descripcion" });
      });
      addTable("RefCCMMTipos", (addField) => {
        addField({ name: "Codigo" });
        addField({ name: "Descripcion" });
      });
      addTable("View_ConsultaCCMM", (addField) => {
        addField({ name: "CCMMCas_Interno", label: "Interno", type: "number" });
        addField({ name: "Den_SiniestroNro", label: "Siniestro", type: "number", formatter: numeroSiniestroFormatter });
        addField({ name: "CCMMCas_MotivoCodigo", label: "Motivo Expediente", type: "number" });
        addField({ name: "CCMMCas_TipoCodigo", label: "Tipo Expediente", type: "number" });
        addField({ name: "CCMMCas_Estado", label: "Estado Actual", type: "number", ...optionsSelect(estadoOptions, blankOptionsFormatter) });
        addField({ name: "SiniestroTipo", label: "Tipo Siniestro", ...optionsSelect(tipoSiniestroOptions) });
        addField({ name: "SiniestroFechaHora", label: "Fecha denuncia", type: "dateTime", formatter: fechaHoraFormatter });
        addField({ name: "Den_AfiCUIL", label: "Cuil", type: "number", formatter: cuipFormatter });
        addField({ name: "Den_AfiNombre", label: "Apellido Nombre" });
        addField({ name: "Den_EmpCuit", label: "Cuit", type: "number", formatter: cuipFormatter });
        addField({ name: "Den_EmpRazonSocial", label: "Razon Social" });
        addField({ name: "SRTPol_Numero", label: "Poliza", type: "number", formatter: numeroFormatter });
        addField({ name: "CCMMCasTipValDan_JunMediFecha", label: "Fecha Junta Medica", type: "date", formatter: fechaFormatter });
        addField({ name: "CCMMCasTipValDan_JunMediAcuerdo", label: "Acuerdo Resultado", ...optionsSelect(SNOptions) });
        addField({ name: "CCMMCasTipValDan_JunMediLetrado", label: "Letrado Interviniente" });
        addField({ name: "CCMMCasTipValDan_AudHomoFechaHora", label: "Fecha Homologacion", type: "date", formatter: fechaHoraFormatter });
        addField({ name: "CCMMCasTipValDan_AudHomoMontoHomologado", label: "Monto Homologado", type: "number", formatter: numeroFormatter });
        addField({ name: "CCMMCasTipValDan_AcuHomoNotificacionFecha", label: "Fecha Acuerdo", type: "date", formatter: fechaFormatter });
        addField({ name: "CCMMCasTipValDan_AcuHomoPagoFecha", label: "Fecha Pago", type: "date", formatter: fechaFormatter });
      });
      setTables(tables);
      function addTable(table: TablesName, addFieldsCallback?: (addField: (field: TablesField) => boolean) => void) {
        let tabla = tablas.find(r => r.nombre === table);
        if (!tablas.find(r => r.nombre === table)) return false;
        let campos: TablesField[] = [];
        if (addFieldsCallback) addFieldsCallback(addField);
        tables[table] = campos;
        return true;
        function addField(campo: TablesField) {
          if (!(tabla?.campos?.find(r => r.nombre === campo.name))) return false;
          campos.push(campo);
          return true;
        }
      };
    },
  });
  //#region RefCCMMMotivos
  useSWR(
    !isLoadingTablas && tables.RefCCMMMotivos && tables.View_ConsultaCCMM ?
      swrExecute.Key({
        select: tables.RefCCMMMotivos.map(f => ({ value: f.name })),
        from: [{ table: "RefCCMMMotivos" }],
        order: { by: ["Codigo"] },
      }) : null,
    swrExecute.Fetcher,
    {
      revalidateOnFocus: false,
      onSuccess(motivos) {
        if (!motivos?.data) return;
        const options = Object.fromEntries(motivos.data.map(e => [e["Codigo"], e["Descripcion"]]));
        setTables((o) => {
          const fieldIx = o.View_ConsultaCCMM!.findIndex(r => r.name === "CCMMCas_MotivoCodigo");
          if (fieldIx < 0) return o;
          const tables = { ...o, View_ConsultaCCMM: [...o.View_ConsultaCCMM!] };
          tables.View_ConsultaCCMM[fieldIx] = { ...tables.View_ConsultaCCMM[fieldIx], ...optionsSelect(options) };
          return tables;
        });
      },
    }
  );
  //#endregion RefCCMMMotivos
  //#region RefCCMMTipos
  useSWR(
    !isLoadingTablas && tables.RefCCMMTipos && tables.View_ConsultaCCMM ?
      swrExecute.Key({
        select: tables.RefCCMMTipos.map(f => ({ value: f.name })),
        from: [{ table: "RefCCMMTipos" }],
        order: { by: ["Codigo"] },
      }) : null,
    swrExecute.Fetcher,
    {
      revalidateOnFocus: false,
      onSuccess(tipos) {
        if (!tipos?.data) return;
        const options = Object.fromEntries(tipos.data.map(e => [e["Codigo"], e["Descripcion"]]));
        setTables((o) => {
          const fieldIx = o.View_ConsultaCCMM!.findIndex(r => r.name === "CCMMCas_TipoCodigo");
          if (fieldIx < 0) return o;
          const tables = { ...o, View_ConsultaCCMM: [...o.View_ConsultaCCMM!] };
          tables.View_ConsultaCCMM[fieldIx] = { ...tables.View_ConsultaCCMM[fieldIx], ...optionsSelect(options, blankOptionsFormatter) };
          return tables;
        });
      }
    }
  );
  //#endregion RefCCMMTipos
  const { columns, fields, headers } = useMemo(() => {
    const columns: ColumnDef<Row>[] = [];
    const headers: Headers = { columns: {}, options: { formatters: { row: {} } } };
    const fields: Field[] = tables.View_ConsultaCCMM?.filter(f => !["CCMMCas_Interno"].includes(f.name)).map(column => {
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
    }) ?? [];
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
    if (!tables[table]) return;
    const apiQuery: Query = {
      select: tables[table].map(c => ({ value: c.name })),
      from: [{ table }],
      order: { by: ["CCMMCas_Interno"] }
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

  const value: DataContextType = {
    fields, columns, rows, dialog,
    query: { state: query, setState: setQuery },
    onAplicaFiltro, onLimpiaFiltro, onLimpiaTabla, onExport
  };
  return <CCMMContext.Provider value={value}>{children}</CCMMContext.Provider>
}

export function useCCMMContext() {
  const context = useContext(CCMMContext)
  if (context === undefined) throw new Error('useCCMMContext must be used within a CCMMContextProvider');
  return context
}
