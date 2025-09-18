"use client"
import React from 'react';
import QueryBuilder from 'react-querybuilder';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Grid, Paper, Typography } from '@mui/material';
import { MdExpandMore } from "react-icons/md";
import { defaultCombinatorsExtended, defaultOperators, defaultTranslations } from "@/utils/QueryBuilderDefaults"
import { DataContextProvider, useDataContext } from './dataContext';
import DataTable from '@/utils/ui/table/DataTable';
import CustomButton from '@/utils/ui/CustomButton';


function ConsultaCCMMQueryBuilder() {
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

function ConsultaCCMMTable() {
  const { columns, rows } = useDataContext();
  return (<DataTable data={rows} columns={columns} />);
}

function ConsultaCCM() {
  const { dialog, rows: { length: habilita }, onAplica, onLimpia, onExport } = useDataContext();

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
            <CustomButton width="auto" onClick={onAplica}>Aplica</CustomButton>
            <CustomButton width="auto" onClick={onLimpia}>Limpia</CustomButton>
            <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
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