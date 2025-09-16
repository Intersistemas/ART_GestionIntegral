import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Field, type RuleGroupType, type ValueEditorType, type DefaultOperators, type Classnames, } from 'react-querybuilder';
import { GridColDef, GridValidRowModel, type GridColType, type GridRowsProp, type GridValueFormatter } from '@mui/x-data-grid';
import QueriesAPI, { type Query } from '@/data/queryAPI';
import Formato from '@/utils/Formato';
import { defaultOperators } from "@/utils/QueryBuilderDefaults"

type OptionsFormatter = { (options: any): GridValueFormatter };
type OptionsValues = { (options: any): { name: string, label: any }[] };
const valueOptionsFormatter: OptionsFormatter = (options: any) => ((v: string) => (options[v] ?? v));
const blankOptionsFormatter: OptionsFormatter = (options: any) => ((v: string) => (options[v] ?? ""));
const optionsValues: OptionsValues = (options: any) => Object.entries<string>(options).map(([name, label]) => ({ name, label }))
const optionsSelect = (options: any, formatter: OptionsFormatter = valueOptionsFormatter, values: OptionsValues = optionsValues): {
  operators: DefaultOperators,
  valueEditorType: ValueEditorType,
  formatter: GridValueFormatter,
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
const numeroSiniestroFormatter = (v: any) => Formato.Mascara(v, "####-######-##");
const fechaHoraFormatter = (v: any) => Formato.FechaHora(v);
const fechaFormatter = (v: any) => Formato.Fecha(v);
const numeroFormatter = (v: any) => Formato.Numero(v);
const cuipFormatter = (v: any) => Formato.CUIP(v);
type FieldDef = {
  name: string,
  label?: string,
  type?: GridColType,
  operators?: DefaultOperators,
  formatter?: GridValueFormatter,
  valueEditorType?: ValueEditorType,
  values?: any[],
}
const { useExecute } = QueriesAPI;
const defaultQuery: RuleGroupType = { combinator: 'and', rules: [] };

interface DataContextType {
  tables: Record<string, FieldDef[]>,
  columns: GridColDef<GridValidRowModel>[],
  fields: Field[],
  rows: { state: GridRowsProp, setState: React.Dispatch<GridRowsProp> }
  query: { state: RuleGroupType, setState: React.Dispatch<RuleGroupType>, default: RuleGroupType }
}
const DataContext = createContext<DataContextType | undefined>(undefined);
export function DataContextProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<Record<string, FieldDef[]>>({
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
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [query, setQuery] = useState(defaultQuery);
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

  const { columns, fields } = useMemo(() => {
    const fields = tables.View_ConsultaCCMM.slice(1);
    return ({
      columns: fields.map(({ name: field, label: headerName, type, formatter: valueFormatter }) => (
        { field, headerName, type, valueFormatter }
      )),
      fields: fields.map((({ name, label, operators, valueEditorType, values, type }) => (
        {
          name, label: label ?? name, operators, valueEditorType, values,
          inputType: type ? type === "dateTime" ? "datetime-local" : type : undefined
        }
      ))),
    });
  }, [tables.View_ConsultaCCMM]);
  const value = {
    tables, columns, fields,
    rows: { state: rows, setState: setRows },
    query: { state: query, setState: setQuery, default: defaultQuery },
  };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
export function useDataContext() {
  const context = useContext(DataContext)
  if (context === undefined) throw new Error('useTables must be used within a TablesContextProvider');
  return context
}
