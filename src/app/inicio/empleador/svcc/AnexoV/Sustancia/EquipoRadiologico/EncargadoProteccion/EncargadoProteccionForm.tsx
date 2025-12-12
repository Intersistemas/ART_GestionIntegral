import { Grid, TextField } from "@mui/material";
import { EncargadoProteccionDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import Formato from "@/utils/Formato";

export const EncargadoProteccionForm: Form<EncargadoProteccionDTO> = ({
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
        name="matriculaProfesional"
        label="Matricula profesional"
        value={data.matriculaProfesional}
        disabled={disabled.matriculaProfesional}
        onChange={({ target: { value } }) => onChange({ matriculaProfesional: value })}
        error={errors.matriculaProfesional}
        helperText={helpers.matriculaProfesional}
        fullWidth
      />
    </Grid>
    <Grid size={4}>
      <TextField
        name="nroHabilitacion"
        label="Nro. habilitacion"
        value={data.nroHabilitacion}
        disabled={disabled.nroHabilitacion}
        onChange={({ target: { value } }) => onChange({ nroHabilitacion: value })}
        error={errors.nroHabilitacion}
        helperText={helpers.nroHabilitacion}
        fullWidth
      />
    </Grid>
    <Grid size={12}>
      <TextField
        name="tituloProfesional"
        label="Titulo profesional"
        value={data.tituloProfesional}
        disabled={disabled.tituloProfesional}
        onChange={({ target: { value } }) => onChange({ tituloProfesional: value })}
        error={errors.tituloProfesional}
        helperText={helpers.tituloProfesional}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default EncargadoProteccionForm;
