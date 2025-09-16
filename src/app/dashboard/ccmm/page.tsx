"use client"
import React, { useEffect,useState } from 'react';
import QueryBuilder, { formatQuery, type Classnames } from 'react-querybuilder';
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
import { DataGrid, useGridApiRef, type GridAutosizeOptions, } from '@mui/x-data-grid';
import QueriesAPI, { type Query } from '@/data/queryAPI';
import { defaultCombinatorsExtended, defaultOperators, defaultTranslations } from "@/utils/QueryBuilderDefaults"
import propositionFormat from '@/utils/PropositionFormatQuery';
import { DataContextProvider, useDataContext } from './dataContext';

const qbClassnames: Partial<Classnames> = { queryBuilder: 'queryBuilder-branches' };
const { execute, analyze } = QueriesAPI;
const getRowId = (row: any) => row.CCMMCas_Interno;

function ConsultaCCMMQueryBuilder() {
  const { fields, query: { state: query, setState: setQuery } } = useDataContext();
  return (
    <QueryBuilder
      fields={fields}
      combinators={defaultCombinatorsExtended}
      operators={defaultOperators}
      translations={defaultTranslations}
      controlClassnames={qbClassnames}
      query={query}
      onQueryChange={setQuery}
      showNotToggle
      listsAsArrays
    />
  );
}
function ConsultaCCMMTable() {
  const { columns, rows: { state: rows } } = useDataContext();
  const apiRef = useGridApiRef();

  const autosizeOptions: GridAutosizeOptions = {
    columns: columns.map(c => c.field),
    includeOutliers: true,
    includeHeaders: true,
  }

  useEffect(() => {
    apiRef.current?.autosizeColumns(autosizeOptions);
  }, [rows, columns]);

  return (
    <DataGrid
      density="compact"
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      autosizeOnMount
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      pageSizeOptions={[10, 25, 50, 100, { value: -1, label: "Todos" }]}
    />
  );
}
function ConsultaCCMQueryTable() {
  const { tables, fields,
    rows: { setState: setRows },
    query: { state: query, setState: setQuery, default: defaultQuery }
  } = useDataContext();
  const [dialog, setDialog] = useState<React.JSX.Element | null>(null);

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

  //#region Handlers
  const onAplicaHandler = () => {
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
        await execute(query).then((ok) => {
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
  };
  const onLimpiaHandler = () => {
    setQuery(defaultQuery);
    setRows([]);
  };
  //#endregion Handlers
  return (
    <Grid container spacing={1} size="grow">
      <Grid size={12}>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<MdExpandMore />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="span">Filtros</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <ConsultaCCMMQueryBuilder />
          </AccordionDetails>
          <AccordionActions>
            <Button onClick={onAplicaHandler}>Aplica</Button>
            <Button onClick={onLimpiaHandler}>Limpia</Button>
          </AccordionActions>
        </Accordion>
      </Grid>
      <Grid size={12}>
        <Paper>
          <ConsultaCCMMTable />
        </Paper>
      </Grid>
      {dialog}
    </Grid>
  );
}

export default function CCMM() { return (<DataContextProvider><ConsultaCCMQueryTable /></DataContextProvider>); };