"use client"
import React, { useEffect, useMemo, useState } from 'react';
import QueryBuilder, {
  formatQuery,
  type RuleGroupType,
  type ValueEditorType,
  type DefaultOperators,
  type Classnames,
} from 'react-querybuilder';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography
} from '@mui/material';
import { MdExpandMore } from "react-icons/md";
import {
  DataGrid,
  useGridApiRef,
  type GridAutosizeOptions,
  type GridColType,
  type GridRowsProp,
  type GridValueFormatter
} from '@mui/x-data-grid';
import { QueriesAPI, type Query } from '@/data/queryAPI';
import Formato from '@/utils/Formato';
import { defaultCombinatorsExtended, defaultOperators, defaultTranslations } from "@/utils/QueryBuilderDefaults"
import propositionFormat from '@/utils/PropositionFormatQuery';

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
const qbClassnames: Partial<Classnames> = { queryBuilder: 'queryBuilder-branches' };
const defaultQuery: RuleGroupType = { combinator: 'and', rules: [] };
const queriesApi = new QueriesAPI();
const getRowId = (row: any) => row.CCMMCas_Interno;

export default function CCMM() {
  const [dialog, setDialog] = useState<React.JSX.Element | null>(null);

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

  useEffect(() => {
    let active = true;
    load();
    return () => { active = false };
    async function load() {
      const options = await queriesApi.execute({
        select: tables.RefCCMMMotivos.map(f => ({ value: f.name })),
        from: [{ table: "RefCCMMMotivos" }],
        order: { by: [tables.RefCCMMMotivos[0].name] },
      }).then((ok) => {
        if (ok.count === 0) return;
        return Object.fromEntries(
          ok.data!.map(e => [`${e[tables.RefCCMMMotivos[0].name]}`, e[tables.RefCCMMMotivos[1].name]])
        );
      });
      if (!active || !options) return;
      setTables((o) => {
        const fieldIx = o.View_ConsultaCCMM.findIndex(r => r.name === "CCMMCas_MotivoCodigo");
        if (fieldIx < 0) return o;
        const tables = { ...o, View_ConsultaCCMM: [...o.View_ConsultaCCMM] };
        tables.View_ConsultaCCMM[fieldIx] = { ...tables.View_ConsultaCCMM[fieldIx], ...optionsSelect(options) };
        return tables;
      });
    };
  }, [tables.RefCCMMMotivos]);

  useEffect(() => {
    let active = true;
    load();
    return () => { active = false };
    async function load() {
      const options = await queriesApi.execute({
        select: tables.RefCCMMTipos.map(f => ({ value: f.name })),
        from: [{ table: "RefCCMMTipos" }],
        order: { by: [tables.RefCCMMTipos[0].name] },
      }).then((ok) => {
        if (ok.count === 0) return;
        return Object.fromEntries(
          ok.data!.map(e => [`${e[tables.RefCCMMTipos[0].name]}`, e[tables.RefCCMMTipos[1].name]])
        );
      });
      if (!active || !options) return;
      setTables((o) => {
        const fieldIx = o.View_ConsultaCCMM.findIndex(r => r.name === "CCMMCas_TipoCodigo");
        if (fieldIx < 0) return o;
        const tables = { ...o, View_ConsultaCCMM: [...o.View_ConsultaCCMM] };
        tables.View_ConsultaCCMM[fieldIx] = { ...tables.View_ConsultaCCMM[fieldIx], ...optionsSelect(options, blankOptionsFormatter) };
        return tables;
      });
    };
  }, [tables.RefCCMMTipos]);

  const { columns, qbFields } = useMemo(() => {
    const fields = tables.View_ConsultaCCMM.slice(1);
    return ({
      columns: fields.map(({ name: field, label: headerName, type, formatter: valueFormatter }) => (
        { field, headerName, type, valueFormatter }
      )),
      qbFields: fields.map((({ name, label, operators, valueEditorType, values, type }) => (
        { name, label: label ?? name, operators, valueEditorType, values,
          inputType: type ? type === "dateTime" ? "datetime-local" : type : undefined
        }
      ))),
    });
  }, [tables.View_ConsultaCCMM]);

  const [query, setQuery] = useState(defaultQuery);
  const [rows, setRows] = useState<GridRowsProp>([]);
  const apiRef = useGridApiRef();

  const autosizeOptions: GridAutosizeOptions = {
    columns: columns.map(c => c.field),
    includeOutliers: true,
    includeHeaders: true,
  }

  const onCloseDialog = () => setDialog(null);
  const errorDialog = (prop: { title?: string, message: any }) => setDialog(
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
  );

  const onAplicaHandler = () => {
    const proposition = formatQuery(query, propositionFormat({ fields: qbFields }));
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
        await queriesApi.execute(query).then((ok) => {
          setRows(ok.data ?? []);
          onCloseDialog();
        }).catch((error) => errorDialog(
          { message: error.detail ?? error.message ?? JSON.stringify(error) }
        ));
      }
      await queriesApi.analyze(query).then(async (ok) => (ok.count > 90)
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
        { message: error.detail ?? error.message ?? JSON.stringify(error) }
      ));
    }
  };

  const onLimpiaHandler = () => {
    setQuery(defaultQuery);
    setRows([]);
  };

  useEffect(() => {
    apiRef.current?.autosizeColumns(autosizeOptions);
  }, [rows, columns]);

  return (
    <Grid container spacing={1} size="grow">
      <Grid size={12}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<MdExpandMore  />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Filtros</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <QueryBuilder
              fields={qbFields}
              query={query}
              onQueryChange={setQuery}
              combinators={defaultCombinatorsExtended}
              operators={defaultOperators}
              translations={defaultTranslations}
              controlClassnames={qbClassnames}
              showNotToggle
              listsAsArrays
            />
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={onAplicaHandler}>Aplica</Button>
            <Button onClick={onLimpiaHandler}>Limpia</Button>
          </AccordionActions>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Paper>
          <DataGrid
            density="compact"
            apiRef={apiRef}
            rows={rows}
            columns={columns}
            getRowId={getRowId}
            autosizeOnMount
            autosizeOptions={autosizeOptions}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            pageSizeOptions={[10, 25, 50, 100, { value: -1, label: "Todos" }]}
          />
        </Paper>
      </Grid>
      {dialog}
    </Grid>
  );
};