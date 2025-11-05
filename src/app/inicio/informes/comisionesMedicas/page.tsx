"use client"
import React from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Grid, Paper, Typography } from '@mui/material';
import { MdExpandMore } from "react-icons/md";
import { CCMMContextProvider, useCCMMContext } from './context';
import DataTable from '@/utils/ui/table/DataTable';
import CustomButton from '@/utils/ui/button/CustomButton';
import QueryBuilder from '@/utils/ui/QueryBuilder';

function CCMMQueryBuilder() {
  const { fields, query: { state: query, setState: setQuery } } = useCCMMContext();
  return <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
}

function CCMMTable() {
  const { columns, rows } = useCCMMContext();
  return (<DataTable data={rows} columns={columns} />);
}

function Informe() {
  const {
    dialog, rows: { length: habilita }, proposition, filtro,
    onLookupFiltro, onGuardaFiltro, onEliminaFiltro, onAplicaFiltro, onLimpiaFiltro,
    onLimpiaTabla, onExport
  } = useCCMMContext();

  return (
    <Grid container spacing={1} size="grow">
      <Grid size={12}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Filtros</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1} size="grow">
              <Grid size={12}>
                <Typography variant="h6" color={filtro == null ? "info" : "success"}>{filtro?.nombre ?? "Sin filtro seleccionado"}</Typography>
              </Grid>
              <Grid size={12}>
                <CCMMQueryBuilder />
              </Grid>
              <Grid container size={12} spacing={2} justifyContent="space-between">
                <Grid container spacing={2}>
                  <CustomButton onClick={onLookupFiltro}>Carga</CustomButton>
                  <CustomButton onClick={onGuardaFiltro} disabled={!proposition}>Guarda</CustomButton>
                  <CustomButton onClick={onEliminaFiltro} disabled={filtro == null}>Elimina</CustomButton>
                </Grid>
                <Grid container spacing={2}>
                  <CustomButton onClick={onAplicaFiltro}>Aplica</CustomButton>
                  <CustomButton onClick={onLimpiaFiltro}>Limpia</CustomButton>
                </Grid>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Resultados</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container size={12} spacing={2} justifyContent="end">
              <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
              <CustomButton width="auto" onClick={onLimpiaTabla}>Limpia</CustomButton>
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Paper>
          <CCMMTable />
        </Paper>
      </Grid>
      {dialog}
    </Grid>
  );
}

export default function ComisionesMedicas() { return (<CCMMContextProvider><Informe /></CCMMContextProvider>); };
