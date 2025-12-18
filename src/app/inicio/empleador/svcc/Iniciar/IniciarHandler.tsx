import CustomButton from "@/utils/ui/button/CustomButton";
import { useSVCCPresentacionContext } from "../context";
import { Grid, Typography } from "@mui/material";

export default function IniciarHandler() {
  const { ultima, nueva } = useSVCCPresentacionContext();
  const isWorking = ultima.isLoading || nueva.isMutating;
  const presentacionFecha = ultima.data?.presentacionFecha;
  const disabled = isWorking
    || (ultima?.data?.interno != null && presentacionFecha == null);

  return (
    <Grid container>
      <Grid size={12}>
        <CustomButton
          variant="contained"
          color="primary"
          size="large"
          onClick={() => nueva.trigger({ idMotivo: 1 })}
          loading={isWorking}
          disabled={disabled}
        >
          Iniciar Nueva Presentación
        </CustomButton>
      </Grid>
      {(ultima.error == null) ? null : (
        <Grid size={12}>
          {
            (ultima.error.status === 404)
              ? (<Typography variant="caption" color="info" sx={{ ml: 2, mt: 0.5 }}>No se realizaron presentaciones anteriormente</Typography>)
              : (ultima.error.status === 403)
                ? (<Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>No tiene permisos para consultar la última presentación</Typography>)
                : (<Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>Error consultando última presentación "{ultima.error.message}"</Typography>)
          }
        </Grid>
      )}
      {(nueva.error == null) ? null : (
        <Grid size={12}>
          <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>Error generando nueva presentación "{nueva.error.message}"</Typography>
        </Grid>
      )}
    </Grid>
  );
}