import { FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { MedidaPreventivaDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import { TMedidasPreventivas_Array } from "@/data/SVCC/constants";

export const MedidaPreventivaForm: Form<MedidaPreventivaDTO> = ({
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
        error={errors.idMedidaPreventivaDeclarado}
        disabled={disabled.idMedidaPreventivaDeclarado}
      >
        <InputLabel>Medida preventiva</InputLabel>
        <Select
          name="idMedidaPreventivaDeclarado"
          value={data.idMedidaPreventivaDeclarado}
          label="Medida preventiva"
          onChange={({ target: { value } }) => onChange({ idMedidaPreventivaDeclarado: value === undefined ? undefined : Number(value) })}
          displayEmpty
        >
          {TMedidasPreventivas_Array.map((e, i) => (<MenuItem key={i} value={e.codigo}>{e.descripcion}</MenuItem>))}
        </Select>
        {helpers.idMedidaPreventivaDeclarado && (
          <Typography
            variant="caption"
            color={errors.idMedidaPreventivaDeclarado ? "error" : "info"}
            sx={{ ml: 2, mt: 0.5 }}
          >
            {helpers.idMedidaPreventivaDeclarado}
          </Typography>
        )}
      </FormControl>
    </Grid>
  </Grid>
);

export default MedidaPreventivaForm;
