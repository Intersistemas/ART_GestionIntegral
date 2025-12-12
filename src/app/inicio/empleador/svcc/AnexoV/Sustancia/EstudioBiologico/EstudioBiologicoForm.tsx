import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { EstudioBiologicoDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import { TFrecuencia_Array } from "@/data/SVCC/constants";

export const EstudioBiologicoForm: Form<EstudioBiologicoDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={6}>
      <TextField
        name="cantidadFrecuencia"
        type="number"
        label="Cantidad frecuencia"
        value={data.cantidadFrecuencia}
        disabled={disabled.cantidadFrecuencia}
        onChange={({ target: { value } }) => onChange({ cantidadFrecuencia: Number(value) })}
        error={errors.cantidadFrecuencia}
        helperText={helpers.cantidadFrecuencia}
        fullWidth
      />
    </Grid>
    <Grid size={6}>
      <FormControl
        fullWidth
        error={errors.idUnidadFrecuencia}
        disabled={disabled.idUnidadFrecuencia}
      >
        <InputLabel>Unidad frecuencia</InputLabel>
        <Select
          name="idUnidadFrecuencia"
          value={data.idUnidadFrecuencia ?? ""}
          label="Unidad frecuencia"
          onChange={({ target: { value } }) => onChange({ idUnidadFrecuencia: value === undefined ? undefined : Number(value) })}
          displayEmpty
        >
          {TFrecuencia_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.idUnidadFrecuencia && (
          <Typography
            variant="caption"
            color={errors.idUnidadFrecuencia ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.idUnidadFrecuencia}
          </Typography>
        )}
      </FormControl>
    </Grid>
    <Grid size={12}>
      <TextField
        name="analisisEstudiosComplementacion"
        label="Analisis estudios complementacion"
        value={data.analisisEstudiosComplementacion}
        disabled={disabled.analisisEstudiosComplementacion}
        onChange={({ target: { value } }) => onChange({ analisisEstudiosComplementacion: value })}
        error={errors.analisisEstudiosComplementacion}
        helperText={helpers.analisisEstudiosComplementacion}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default EstudioBiologicoForm;
