import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { UtilizacionDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import { TModoEmpleo_Array, TUsoOrigen_Array } from "@/data/SVCC/constants";

export const UtilizacionForm: Form<UtilizacionDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={6}>
      <FormControl
        fullWidth
        error={errors.usoOrigen}
        disabled={disabled.usoOrigen}
      >
        <InputLabel>Uso origen</InputLabel>
        <Select
          name="usoOrigen"
          value={data.usoOrigen || ""}
          label="Uso origen"
          onChange={({ target: { value } }) => onChange({ usoOrigen: value ? Number(value) : undefined })}
          displayEmpty
        >
          {TUsoOrigen_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.usoOrigen && (
          <Typography
            variant="caption"
            color={errors.usoOrigen ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.usoOrigen}
          </Typography>
        )}
      </FormControl>
    </Grid>
    <Grid size={6}>
      <FormControl
        fullWidth
        error={errors.modoDeEmpleo}
        disabled={disabled.modoDeEmpleo}
      >
        <InputLabel>Modo de empleo</InputLabel>
        <Select
          name="modoDeEmpleo"
          value={data.modoDeEmpleo || ""}
          label="Modo de empleo"
          onChange={({ target: { value } }) => onChange({ modoDeEmpleo: value ? Number(value) : undefined })}
          displayEmpty
        >
          {TModoEmpleo_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.modoDeEmpleo && (
          <Typography
            variant="caption"
            color={errors.modoDeEmpleo ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.modoDeEmpleo}
          </Typography>
        )}
      </FormControl>
    </Grid>
  </Grid>
);

export default UtilizacionForm;