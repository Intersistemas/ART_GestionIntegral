//RefCIIUForm
import { Grid, TextField } from "@mui/material";
import { RefCIIU } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";

export const RefCIIUForm: Form<RefCIIU> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={3}>
      <TextField
        name="ciiuRev4"
        type="number"
        label="Cod. CIIU v4"
        value={data.ciiuRev4}
        disabled={disabled.ciiuRev4}
        onChange={({ target: { value } }) => onChange({ ciiuRev4: Number(value) })}
        error={errors.ciiuRev4}
        helperText={helpers.ciiuRev4}
        fullWidth
      />
    </Grid>
    <Grid size={9}>
      <TextField
        name="descripcionRev4"
        label="Descripción CIIU v4"
        value={data.descripcionRev4}
        disabled={disabled.descripcionRev4}
        onChange={({ target: { value } }) => onChange({ descripcionRev4: value })}
        error={errors.descripcionRev4}
        helperText={helpers.descripcionRev4}
        fullWidth
      />
    </Grid>
    <Grid size={12}>
      <TextField
        name="descripcionEquivalencia4"
        label="Descripcion equivalencia"
        value={data.descripcionEquivalencia4}
        disabled={disabled.descripcionEquivalencia4}
        onChange={({ target: { value } }) => onChange({ descripcionEquivalencia4: value })}
        error={errors.descripcionEquivalencia4}
        helperText={helpers.descripcionEquivalencia4}
        fullWidth
      />
    </Grid>
    <Grid size={3}>
      <TextField
        name="ciiuRev2"
        type="number"
        label="Cod. CIIU v2"
        value={data.ciiuRev2}
        disabled={disabled.ciiuRev2}
        onChange={({ target: { value } }) => onChange({ ciiuRev2: Number(value) })}
        error={errors.ciiuRev2}
        helperText={helpers.ciiuRev2}
        fullWidth
      />
    </Grid>
    <Grid size={9}>
      <TextField
        name="descripcionRev2"
        label="Descripción CIIU v2"
        value={data.descripcionRev2}
        disabled={disabled.descripcionRev2}
        onChange={({ target: { value } }) => onChange({ descripcionRev2: value })}
        error={errors.descripcionRev2}
        helperText={helpers.descripcionRev2}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default RefCIIUForm;