import { Card, Grid, Typography } from "@mui/material";
import SustanciaHandler from "./Sustancia/SustanciaHandler";
import { AnexoVContextProvider } from "./context";

export default function AnexoVHandler() {
  return (
    <AnexoVContextProvider>
      <Card variant="outlined">
        <Grid container spacing={2} padding={1.5}>
          <Grid size={12}><Typography fontWeight={700} color="#45661f" fontSize="smaller">Sustancias</Typography></Grid>
          <Grid size={12}><SustanciaHandler /></Grid>
        </Grid>
      </Card>
    </AnexoVContextProvider>
  );
}
