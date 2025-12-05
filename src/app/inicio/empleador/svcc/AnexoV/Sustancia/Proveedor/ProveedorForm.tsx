import { Grid, TextField } from "@mui/material";
import { ProveedorDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import Formato from "@/utils/Formato";

export const ProveedorForm: Form<ProveedorDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={4}>
      <TextField
        name="cuit"
        label="CUIT"
        value={Formato.CUIP(data.cuit)}
        disabled={disabled.cuit}
        onChange={({ target: { value } }) => onChange({ cuit: value ? Number((value || '').replace(/[^0-9]/g, '')) : undefined })}
        error={errors.cuit}
        helperText={helpers.cuit}
        fullWidth
      />
    </Grid>
    <Grid size={8}>
      <TextField
        name="nombreComercial"
        label="Nombre comercial"
        value={data.nombreComercial}
        disabled={disabled.nombreComercial}
        onChange={({ target: { value } }) => onChange({ nombreComercial: value })}
        error={errors.nombreComercial}
        helperText={helpers.nombreComercial}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default ProveedorForm;
