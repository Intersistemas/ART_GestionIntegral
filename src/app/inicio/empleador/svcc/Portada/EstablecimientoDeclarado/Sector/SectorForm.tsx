import { SectorDTO } from "@/data/gestionEmpleadorAPI";
import { MoreHoriz } from "@mui/icons-material";
import { Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { Form } from "@/utils/ui/form/Form";

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const SectorForm: Form<SectorDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => (
  <Grid container size={12} spacing={2} maxHeight="fit-content">
    <Grid size={3}>
      <TextField
        name="ciiu"
        type="number"
        label="CIUO"
        value={data.ciiu}
        disabled={disabled.ciiu}
        onChange={({ target: { value } }) => onChange({ ciiu: Number(value) })}
        error={errors.ciiu}
        helperText={helpers.ciiu}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip
                  title="Buscar CIIU"
                  arrow
                  slotProps={tooltip_SlotProps}
                >
                  <div>
                    <IconButton
                      color="primary"
                      size="large"
                      disabled={disabled.ciiu}
                    // onClick={() => onLookup()}
                    >
                      <MoreHoriz />
                    </IconButton>
                  </div>
                </Tooltip>
              </InputAdornment>
            ),
          }
        }}
        fullWidth
      />
    </Grid>
    <Grid size={9}>
      <TextField
        name="nombre"
        label="Nombre"
        value={data.nombre}
        disabled={disabled.nombre}
        onChange={({ target: { value } }) => onChange({ nombre: value })}
        error={errors.nombre}
        helperText={helpers.nombre}
        fullWidth
      />
    </Grid>
  </Grid>
);

export default SectorForm;