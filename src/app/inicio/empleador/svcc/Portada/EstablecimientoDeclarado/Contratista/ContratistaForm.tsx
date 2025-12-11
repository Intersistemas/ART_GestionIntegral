import { useState } from "react";
import { Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { ContratistaDTO } from "@/data/gestionEmpleadorAPI";
import { Form } from "@/utils/ui/form/Form";
import Formato from "@/utils/Formato";
import { useSVCCPresentacionContext } from "../../../context";
import CustomModal from "@/utils/ui/form/CustomModal";
import CustomButton from "@/utils/ui/button/CustomButton";
import RefCIIUBrowse from "@/components/RefCIIU/RefCIIUBrowse";

const tooltip_SlotProps = { tooltip: { sx: { fontSize: "1.2rem", fontWeight: 500 } } };
export const ContratistaForm: Form<ContratistaDTO> = ({
  data,
  disabled = {},
  errors = {},
  helpers = {},
  onChange = () => { },
}) => {
  const [lookupCIIU, setLookupCIIU] = useState<boolean>(false);
  const { refCIIU } = useSVCCPresentacionContext();

  return (
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
      <Grid size={4}>
        <TextField
          name="ciiu"
          type="number"
          label="CIIU"
          value={data.ciiu || ""}
          disabled={disabled.ciiu}
          onChange={({ target: { value } }) => onChange({ ciiu: Number(value) })}
          error={errors.ciiu}
          helperText={helpers.ciiu}
          slotProps={{
            inputLabel: { shrink: !!data.ciiu },
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
                        onClick={() => setLookupCIIU(true)}
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
        <CustomModal
          open={lookupCIIU}
          onClose={() => setLookupCIIU(false)}
          title="Selección de CIIU"
          size="large"
          actions={(
            <Grid container spacing={2}>
              <CustomButton
                onClick={() => setLookupCIIU(false)}
                color="secondary"
              >
                Cancelar
              </CustomButton>
            </Grid>
          )}
        >
          <Grid container spacing={2} justifyContent="center" minHeight="500px">
            <Grid size={12}>
              <RefCIIUBrowse
                isLoading={refCIIU.isLoading || refCIIU.isValidating}
                data={{ data: refCIIU.data ?? [] }}
                onSelect={(select) => () => {
                  onChange({ ciiu: select.ciiuRev4 });
                  setLookupCIIU(false);
                }}
              />
            </Grid>
          </Grid>
        </CustomModal>
      </Grid>
      <Grid size={4}>
        <TextField
          name="cantidadTrabajadores"
          type="number"
          label="Cant. trabajadores"
          value={data.cantidadTrabajadores}
          disabled={disabled.cantidadTrabajadores}
          onChange={({ target: { value } }) => onChange({ cantidadTrabajadores: Number(value) })}
          error={errors.cantidadTrabajadores}
          helperText={helpers.cantidadTrabajadores}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}

export default ContratistaForm;