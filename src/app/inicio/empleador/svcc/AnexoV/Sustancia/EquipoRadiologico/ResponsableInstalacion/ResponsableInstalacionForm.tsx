import { Grid, TextField } from "@mui/material";
import { ResponsableInstalacionDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import Formato from "@/utils/Formato";

const date_SlotProps = { inputLabel: { shrink: true } };
export const ResponsableInstalacionForm: Form<ResponsableInstalacionDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={4}>
      <TextField
        name="cuil"
        label="CUIL"
        value={Formato.CUIP(data.cuil)}
        disabled={disabled.cuil}
        onChange={({ target: { value } }) => onChange({ cuil: value ? Number((value || '').replace(/[^0-9]/g, '')) : undefined })}
        error={errors.cuil}
        helperText={helpers.cuil}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="fechaExpedicion"
        type="date"
        label="Fecha expedicion"
        value={data.fechaExpedicion?.slice(0, 10) ?? ""}
        disabled={disabled.fechaExpedicion}
        onChange={({ target: { value } }) => onChange({ fechaExpedicion: value })}
        error={errors.fechaExpedicion}
        helperText={helpers.fechaExpedicion}
        slotProps={date_SlotProps}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="fechaVencimiento"
        type="date"
        label="Fecha vencimiento"
        value={data.fechaVencimiento?.slice(0, 10) ?? ""}
        disabled={disabled.fechaVencimiento}
        onChange={({ target: { value } }) => onChange({ fechaVencimiento: value })}
        error={errors.fechaVencimiento}
        helperText={helpers.fechaVencimiento}
        slotProps={date_SlotProps}
        fullWidth
      />
    </Grid>
    <Grid size={6}>
      <TextField
        name="nroLicenciaHabilitante"
        label="Nro. licencia habilitante"
        value={data.nroLicenciaHabilitante ?? ""}
        disabled={disabled.nroLicenciaHabilitante}
        onChange={({ target: { value } }) => onChange({ nroLicenciaHabilitante: value })}
        error={errors.nroLicenciaHabilitante}
        helperText={helpers.nroLicenciaHabilitante}
        fullWidth
      />
    </Grid>
    <Grid size={6}>
      <TextField
        name="domicilioHabilitacion"
        label="Domicilio habilitacion"
        value={data.domicilioHabilitacion ?? ""}
        disabled={disabled.domicilioHabilitacion}
        onChange={({ target: { value } }) => onChange({ domicilioHabilitacion: value })}
        error={errors.domicilioHabilitacion}
        helperText={helpers.domicilioHabilitacion}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default ResponsableInstalacionForm;
