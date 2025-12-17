import CustomButton from "@/utils/ui/button/CustomButton";
import { useSVCCPresentacionContext } from "../context";
import { Grid, Typography } from "@mui/material";
import Formato from "@/utils/Formato";

export default function FinalizarHandler() {
  const { ultima, finaliza } = useSVCCPresentacionContext();
  const isWorking = ultima.isLoading || finaliza.isMutating;
  const presentacionFecha = ultima.data?.presentacionFecha;
  const disabled = isWorking
    || (ultima?.data?.interno == null || presentacionFecha != null);
    // ToDo: Revisar si se completaron todos los datos requeridos

  return (
    <Grid container>
      <Grid size={12}>
        <CustomButton
          variant="contained"
          color="primary"
          size="large"
          onClick={() => finaliza.trigger({ ...ultima.data })}
          loading={isWorking}
          disabled={disabled}
        >
          Confirma presentación
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
      {(finaliza.error == null) ? null : (
        <Grid size={12}>
          <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>Error finalizando presentación "{finaliza.error.message}"</Typography>
        </Grid>
      )}
      {presentacionFecha == null ? null : (
        <>
          <Grid size={12}>
            <Typography>Presentación realizada el {Formato.Fecha(presentacionFecha)}</Typography>
          </Grid>
          <Grid size={12}>
            {/* ToDo: constancia de presentación */}
          </Grid>
        </>
      )}
    </Grid>
  );
}