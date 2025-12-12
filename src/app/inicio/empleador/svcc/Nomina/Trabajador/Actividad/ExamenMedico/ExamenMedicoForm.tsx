import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { ExamenMedicoDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import { ExamenMedico_Array } from "@/data/SVCC/constants";

export const ExamenMedicoForm: Form<ExamenMedicoDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={12}>
      <FormControl
        fullWidth
        error={errors.idExamen}
        disabled={disabled.idExamen}
      >
        <InputLabel>Exámen</InputLabel>
        <Select
          name="idExamen"
          value={data.idExamen ?? ""}
          label="Exámen"
          onChange={({ target: { value } }) => onChange({ idExamen: value === undefined ? undefined : Number(value) })}
          displayEmpty
        >
          {ExamenMedico_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.idExamen && (
          <Typography
            variant="caption"
            color={errors.idExamen ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.idExamen}
          </Typography>
        )}
      </FormControl>
    </Grid>
  </Grid>
);

export default ExamenMedicoForm;