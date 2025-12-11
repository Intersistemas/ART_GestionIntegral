import { Card, Grid, Typography } from "@mui/material";
import TrabajadorHandler from "./Trabajador/TrabajadorHandler";
import { NominaContextProvider } from "./context";

export default function NominaHandler() {
  return (
    <NominaContextProvider>
      <Card variant="outlined">
        <Grid container spacing={2} padding={1.5}>
          <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Trabajadores</Typography></Grid>
          <Grid size={12}><TrabajadorHandler /></Grid>
        </Grid>
      </Card>
    </NominaContextProvider>
  );
}
