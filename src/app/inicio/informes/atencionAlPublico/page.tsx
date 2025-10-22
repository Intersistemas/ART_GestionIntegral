 "use client"
 import React from "react";
 import {
   Accordion,
   AccordionActions,
   AccordionDetails,
   AccordionSummary,
   Grid,
   Paper,
   Typography,
 } from "@mui/material";
 import { MdExpandMore } from "react-icons/md";
 import {
   combinatorsExtended,
   operators,
   translations,
 } from "@/utils/ui/QueryBuilderDefaults";
 import { DataContextProvider, useDataContext } from "./dataContext";
 import DataTable from "@/utils/ui/table/DataTable";
 import CustomButton from '../../../../utils/ui/button/CustomButton';
 import QueryBuilder from '@/utils/ui/QueryBuilder';

 function AtencionAlPublicoQueryBuilder() {
   const { fields, query: { state: query, setState: setQuery } } = useDataContext();
   return <QueryBuilder fields={fields} query={query} onQueryChange={setQuery} />
 }

 function SiniestrosTable() {
   const { columns, rows } = useDataContext();
   return <DataTable data={rows} columns={columns} />;
 }

 function SiniestrosPageInner() {
   const { dialog, onAplica, onLimpia } = useDataContext();
   return (
     <Grid container spacing={1} size="grow">
       <Grid size={12}>
         <Accordion defaultExpanded>
           <AccordionSummary expandIcon={<MdExpandMore />}>
             <Typography component="span">Filtros</Typography>
           </AccordionSummary>
           <AccordionDetails>
             <AtencionAlPublicoQueryBuilder />
           </AccordionDetails>
           <AccordionActions>
             <CustomButton width="auto" onClick={onAplica}>
               Aplica
             </CustomButton>
             <CustomButton width="auto" onClick={onLimpia}>
               Limpia
             </CustomButton>
           </AccordionActions>
         </Accordion>
       </Grid>
       <Grid size={12}>
         <Paper>
           <SiniestrosTable />
         </Paper>
       </Grid>
       {dialog}
     </Grid>
   );
 }

 export default function SiniestrosPage() {
   return (
     <DataContextProvider>
       <SiniestrosPageInner />
     </DataContextProvider>
   );
 }