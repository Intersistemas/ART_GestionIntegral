"use client"
import React from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Grid, Paper, Typography, Box } from '@mui/material';
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
  } = useCCMMContext();

  const [filtrosOpen, setFiltrosOpen] = React.useState(true);

  // return (
  //   <Grid container spacing={1} size="grow">
  //     <Grid size={12}>




  //       <Accordion defaultExpanded>
  //         <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
  //           <Typography component="span">Filtros</Typography>
  //         </AccordionSummary>
  //         <AccordionDetails>
  //           <CCMMQueryBuilder />
  //         </AccordionDetails>
  //         <AccordionActions>
  //           <CustomButton width="auto" onClick={onAplicaFiltro}>Aplica</CustomButton>
  //           <CustomButton width="auto" onClick={onLimpiaFiltro}>Limpia</CustomButton>
  //         </AccordionActions>
  //       </Accordion>







  //       <Accordion>
  //         <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
  //           <Typography component="span">Resultados</Typography>
  //         </AccordionSummary>
  //         <AccordionActions>
  //           <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
  //           <CustomButton width="auto" onClick={onLimpiaTabla}>Limpia</CustomButton>
  //         </AccordionActions>
  //       </Accordion>
  //       <Paper>
  //         <CCMMTable />
  //       </Paper>
  //     </Grid>
  //     {dialog}
  //   </Grid>
  // );

  return (
    <Grid container spacing={2}>
      {/* FILA 1: toolbar arriba, botón a la derecha */}
      <Grid size={{ xs: 12 }}>
        {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
<AccordionActions>
            <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
            <CustomButton width="auto" onClick={onLimpiaTabla}>Limpia</CustomButton>
          </AccordionActions>
      </Box> */}

        <Accordion>
          <AccordionSummary expandIcon={<MdExpandMore />} aria-controls="panel1-content" id="panel1-header">
            <Typography component="span">Exportacion</Typography>
          </AccordionSummary>
          <AccordionActions>
            <CustomButton width="auto" onClick={onExport} disabled={!habilita}>Exportar a Excel</CustomButton>
            <CustomButton width="auto" onClick={onLimpiaTabla}>Limpia</CustomButton>
          </AccordionActions>
        </Accordion>


      </Grid>

      {/* FILA 2: filtros (izq) + resultados (der) perfectamente alineados arriba */}
      <Grid size={{ xs: 12, md: 3 }} sx={{ alignSelf: 'stretch' }}>
        <Accordion
          expanded={filtrosOpen}
          onChange={(_, v) => setFiltrosOpen(v)}
          sx={{
            height: filtrosOpen ? '100%' : 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AccordionSummary expandIcon={<MdExpandMore />}>
            <Typography component="span">Filtros</Typography>
          </AccordionSummary>

          {filtrosOpen && (
            <>
              <AccordionDetails sx={{ flexGrow: 1 }}>
                <CCMMQueryBuilder />
              </AccordionDetails>
              <AccordionActions sx={{ gap: 1, px: 2, pb: 2 }}>
                <CustomButton width="auto" onClick={onAplicaFiltro}>
                  Aplica
                </CustomButton>
                <CustomButton width="auto" onClick={onLimpiaFiltro}>
                  Limpia
                </CustomButton>
              </AccordionActions>
            </>
          )}
        </Accordion>
      </Grid>

      <Grid size={{ xs: 12, md: 9 }} sx={{ alignSelf: 'stretch' }}>
        <Paper sx={{ height: '100%' }}>
          <CCMMTable />
        </Paper>
      </Grid>

      {dialog}
    </Grid>
  );

}

export default function ComisionesMedicas() { return (<CCMMContextProvider><Informe /></CCMMContextProvider>); };
