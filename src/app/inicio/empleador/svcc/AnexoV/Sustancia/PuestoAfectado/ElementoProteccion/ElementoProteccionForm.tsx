import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { ElementoProteccionDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import { TElementosProteccionPersonal_Array } from "@/data/SVCC/constants";

export const ElementoProteccionForm: Form<ElementoProteccionDTO> = ({
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
        error={errors.idElementoDeProteccionDeclarado}
        disabled={disabled.idElementoDeProteccionDeclarado}
      >
        <InputLabel>Elemento de proteccion</InputLabel>
        <Select
          name="idElementoDeProteccionDeclarado"
          value={data.idElementoDeProteccionDeclarado ?? ""}
          label="Elemento de proteccion"
          onChange={({ target: { value } }) => onChange({ idElementoDeProteccionDeclarado: value === undefined ? undefined : Number(value) })}
          displayEmpty
        >
          {TElementosProteccionPersonal_Array.map((e, i) => (<MenuItem key={i} value={e.interno}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.idElementoDeProteccionDeclarado && (
          <Typography
            variant="caption"
            color={errors.idElementoDeProteccionDeclarado ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.idElementoDeProteccionDeclarado}
          </Typography>
        )}
      </FormControl>
    </Grid>
  </Grid>
);

export default ElementoProteccionForm;
