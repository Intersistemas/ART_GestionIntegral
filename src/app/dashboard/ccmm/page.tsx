"use client"
import React, { useEffect } from 'react';
import QueryBuilder, { type Classnames } from 'react-querybuilder';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Grid, Paper, Typography } from '@mui/material';
import { MdExpandMore } from "react-icons/md";
import { DataGrid, useGridApiRef, type GridAutosizeOptions, } from '@mui/x-data-grid';
import { defaultCombinatorsExtended, defaultOperators, defaultTranslations } from "@/utils/QueryBuilderDefaults"
import { DataContextProvider, useDataContext } from './dataContext';

const qbClassnames: Partial<Classnames> = { queryBuilder: 'queryBuilder-branches' };
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
  const { columns, rows } = useDataContext();
  const apiRef = useGridApiRef();

  const autosizeOptions: GridAutosizeOptions = {
    columns: columns.map(c => c.field),
    includeOutliers: true,
    includeHeaders: true,
  }

  useEffect(() => {
    apiRef.current?.autosizeColumns(autosizeOptions);
  }, [columns, rows]);

  return (
    <DataGrid
      density="compact"
      apiRef={apiRef}
      rows={rows}
      columns={columns}
      getRowId={getRowId}
      autosizeOptions={autosizeOptions}
      autosizeOnMount
      initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
      pageSizeOptions={[10, 25, 50, 100, { value: -1, label: "Todos" }]}
    />
  );
}

function ConsultaCCM() {
  const { dialog, onAplica, onLimpia } = useDataContext();

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
            <Button onClick={onAplica}>Aplica</Button>
            <Button onClick={onLimpia}>Limpia</Button>
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

export default function CCMM() { return (<DataContextProvider><ConsultaCCM /></DataContextProvider>); };