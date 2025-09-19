"use client"
import React from 'react';
import QueryBuilder from 'react-querybuilder';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Grid, Paper, Typography } from '@mui/material';
import { MdExpandMore } from "react-icons/md";
import { defaultCombinatorsExtended, defaultOperators, defaultTranslations } from "@/utils/QueryBuilderDefaults"
import { DataContextProvider, useDataContext } from './dataContext';
import DataTable from '@/utils/ui/table/DataTable';
import CustomButton from '@/utils/ui/CustomButton';


function CCMMQueryBuilder() {
  const { fields, query: { state: query, setState: setQuery } } = useDataContext();
  return (
    <QueryBuilder
      fields={fields}
      combinators={defaultCombinatorsExtended}
      operators={defaultOperators}
      translations={defaultTranslations}
      query={query}
      onQueryChange={setQuery}
      showNotToggle
      listsAsArrays
    />
  );
}

function CCMMTable() {
  const { columns, rows } = useDataContext();
  return (<DataTable data={rows} columns={columns} variant="compact" />);
}

function Informe() {
  const {
    dialog,
    rows: { length: habilita },
    onAplicaFiltro,
    onLimpiaFiltro,
    onLimpiaTabla,
    onExport
  } = useDataContext();

  return (
    <Grid container spacing={1} size="grow">
      <Grid size={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Filtros</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CCMMQueryBuilder />
          </AccordionDetails>
          <AccordionActions>
            <CustomButton width="auto" onClick={onAplicaFiltro}>Aplica</CustomButton>
            <CustomButton width="auto" onClick={onLimpiaFiltro}>Limpia</CustomButton>
          </AccordionActions>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Resultados</Typography>
          </AccordionSummary>
          <AccordionActions>
            <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
            <CustomButton width="auto" onClick={onLimpiaTabla}>Limpia</CustomButton>
          </AccordionActions>
        </Accordion>
        <Paper>
          <CCMMTable />
        </Paper>
      </Grid>
      {dialog}
    </Grid>
  );
}

export default function ComisionesMedicas() { return (<DataContextProvider><Informe /></DataContextProvider>); };