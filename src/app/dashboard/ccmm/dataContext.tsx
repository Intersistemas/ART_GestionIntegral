import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Field, formatQuery, type RuleGroupType, type ValueEditorType, type DefaultOperators } from 'react-querybuilder';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { type GridColType } from '@mui/x-data-grid';
import QueriesAPI, { type Query } from '@/data/queryAPI';
import Formato from '@/utils/Formato';
import propositionFormat from '@/utils/PropositionFormatQuery';
import { defaultOperators } from "@/utils/QueryBuilderDefaults"
import { ColumnDef } from '@tanstack/react-table';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { pick } from '@/utils/utils';

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
const optionsSelect = (options: any, formatter: OptionsFormatter = valueOptionsFormatter, values: OptionsValues = optionsValues): {
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
    const options = Object.fromEntries(motivos.data.map(e => [`${e[tables.RefCCMMMotivos[0].name]}`, e[tables.RefCCMMMotivos[1].name]]));
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
    const options = Object.fromEntries(tipos.data.map(e => [`${e[tables.RefCCMMTipos[0].name]}`, e[tables.RefCCMMTipos[1].name]]));
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
    const fields = tables.View_ConsultaCCMM.slice(1);
    return ({
      columns: fields.map<ColumnDef<Row>>(({ name: accessorKey, label: header, formatter }) => (
        { accessorKey, header, cell: formatter ? (info) => formatter(info.getValue()) : undefined }
      )),
      fields: fields.map<Field>((({ name, label, operators, valueEditorType, values, type }) => (
        {
          name, label: label ?? name, operators, valueEditorType, values,
          inputType: type ? type === "dateTime" ? "datetime-local" : type : undefined
        }
      ))),
      headers: Object.fromEntries(fields.map(field => {
        const { name, label, formatter } = field
        const header = label ?? name;
        return [name, { header, formatter, width: header.length + 5 }];
      })),
    });
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

  const onAplicaFiltro = useCallback(() => {
    const proposition = formatQuery(query, propositionFormat({ fields }));
    return procesar();
    async function procesar() {
      const table = "View_ConsultaCCMM";
      const query: Query = {
        select: tables[table].map(c => ({ value: c.name })),
        from: [{ table }],
        order: { by: [tables[table][0].name] }
      };
      if (proposition) query.where = proposition;
      async function onConfirm() {
        await execute<Row>(query).then((ok) => {
          setRows(ok.data ?? []);
          onCloseDialog();
        }).catch((error) => errorDialog(
          { message: typeof error === "string" ? error : error.detail ?? error.message ?? JSON.stringify(error) }
        ));
      };
      await analyze(query).then(async (ok) => (ok.count > 90)
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
    };
  }, [query, fields, onCloseDialog, errorDialog]);

  const onLimpiaFiltro = useCallback(() => setQuery(defaultQuery), []);

  const onLimpiaTabla = useCallback(() => setRows([]), []);

  const onExport = useCallback(async () => {
    const now = moment();
    const name = "Comisiones Medicas";
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`${name} (${now.format("DD-MM-YYYY")})`);
    const columns = { ...headers };
    const lines = rows.map((row) => Object.fromEntries(Object.entries(pick(row, columns)).map(([key, value]) => {
      value = columns[key].formatter ? columns[key].formatter(value) : value;
      const width = `${value}`.length + 5;
      if (width > columns[key].width) columns[key].width = width;
      return [key, value];
    })));

    sheet.columns = Object.entries(columns).map(([key, { header, width }]) => ({ key, header, width }));

    // Estilos para encabezado
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'A8D08D' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    sheet.addRows(lines);

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

    await workbook.xlsx.writeBuffer().then(
      (buffer) => {
        saveAs(new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }), `${name.replaceAll(" ", "_")}-${now.format("YYYYMMDDhhmmssSSS")}.xlsx`);
        onCloseDialog();
      },
      (e) => errorDialog({
        title: "Error al generar excel",
        message: e?.message ?? "Ocurrió un error desconocido al generar excel"
      }));
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
