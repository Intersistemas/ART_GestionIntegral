"use client"
import React from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Grid, Paper, Typography, Box } from '@mui/material';
import { MdExpandMore } from "react-icons/md";
import { SiniestrosContextProvider, useSiniestrosContext } from './context';
import DataTable from '@/utils/ui/table/DataTable';
import CustomButton from '@/utils/ui/button/CustomButton';
import QueryBuilder from '@/utils/ui/queryBuilder/QueryBuilder';
import styles from '../informes.module.css';
import { BsSliders } from "react-icons/bs";

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
          <AccordionSummary expandIcon={<MdExpandMore className={styles.accordionIcon} />} aria-controls="panel1-content" id="panel1-header">
            <Grid container spacing={1} alignItems="center">
              <BsSliders size={20}/>
              <Typography component="span" className={styles.accordionTitle} >Configuración de Filtros</Typography>
            </Grid>
          </AccordionSummary>

          <AccordionDetails>
            <Grid container spacing={3} size="grow" >
              <Grid size={12}>
                <SiniestrosQueryBuilder />
              </Grid>
              <Grid container size={12} spacing={2} justifyContent="space-between">
                <Grid container spacing={2}>
                  <CustomButton onClick={onAplicaFiltro}>Aplicar Filtro</CustomButton>
                  <CustomButton onClick={onLimpiaFiltro}>Limpiar Filtro</CustomButton>
                </Grid>
                <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
              </Grid>
            </Grid>
          </AccordionDetails>
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
