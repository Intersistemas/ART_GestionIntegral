"use client"
import React from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Grid, Paper, Typography, Box } from '@mui/material';
import { MdExpandMore } from "react-icons/md";
import { SiniestrosContextProvider, useSiniestrosContext } from './context';
import DataTable from '@/utils/ui/table/DataTable';
import CustomButton from '@/utils/ui/button/CustomButton';
import QueryBuilder from '@/utils/ui/queryBuilder/QueryBuilder';

function SiniestrosQueryBuilder() {
  const { fields, query: { state: query, setState: setQuery } } = useSiniestrosContext();
  return <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
}

function SiniestrosTable() {
  const { columns, rows } = useSiniestrosContext();
  return (<DataTable data={rows} columns={columns} />);
}

function Informe() {
  const {
    dialog,
    rows: { length: habilita },
    onAplicaFiltro,
    onLimpiaFiltro,
    onLimpiaTabla,
    onExport
  } = useSiniestrosContext();

  const [filtrosOpen, setFiltrosOpen] = React.useState(true);

  return (
    <Grid container spacing={1} size="grow">
      <Grid size={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Filtros</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SiniestrosQueryBuilder />
          </AccordionDetails>
          <AccordionActions>
            <CustomButton width="auto" onClick={onAplicaFiltro}>Aplica</CustomButton>
            <CustomButton width="auto" onClick={onLimpiaFiltro}>Limpia</CustomButton>
          </AccordionActions>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Exportación</Typography>
          </AccordionSummary>
          <AccordionActions>
            <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
            <CustomButton width="auto" onClick={onLimpiaTabla}>Limpia</CustomButton>
          </AccordionActions>
        </Accordion>
        <Paper>
          <SiniestrosTable />
        </Paper>
      </Grid>
      {dialog}
    </Grid>
  );
 }

export default function Siniestros() { return (<SiniestrosContextProvider><Informe /></SiniestrosContextProvider>); };
