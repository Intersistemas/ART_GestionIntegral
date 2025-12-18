import { Grid, TextField } from "@mui/material";
import { ResponsableUsoDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import Formato from "@/utils/Formato";

const date_SlotProps = { inputLabel: { shrink: true } };
export const ResponsableUsoForm: Form<ResponsableUsoDTO> = ({
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
        name="autorizacionIndividual"
        label="Autorizacion individual"
        value={data.autorizacionIndividual ?? ""}
        disabled={disabled.autorizacionIndividual}
        onChange={({ target: { value } }) => onChange({ autorizacionIndividual: value })}
        error={errors.autorizacionIndividual}
        helperText={helpers.autorizacionIndividual}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="nroPermisoHabilitante"
        label="Nro. permiso habilitante"
        value={data.nroPermisoHabilitante ?? ""}
        disabled={disabled.nroPermisoHabilitante}
        onChange={({ target: { value } }) => onChange({ nroPermisoHabilitante: value })}
        error={errors.nroPermisoHabilitante}
        helperText={helpers.nroPermisoHabilitante}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="matriculaProfesional"
        label="Matricula profesional"
        value={data.matriculaProfesional ?? ""}
        disabled={disabled.matriculaProfesional}
        onChange={({ target: { value } }) => onChange({ matriculaProfesional: value })}
        error={errors.matriculaProfesional}
        helperText={helpers.matriculaProfesional}
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
  </Grid>
);

export default ResponsableUsoForm;
