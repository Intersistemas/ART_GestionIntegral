import React, { FC, ChangeEvent } from "react";
import {
    Checkbox,
    FormControlLabel,
    MenuItem,
    TextField,
    Typography,
    TextFieldProps,
    FormControlLabelProps, // Importación útil para claridad, aunque no se use directamente.
} from "@mui/material";
import { CSSProperties, ReactNode, SyntheticEvent } from "react"; // Tipos de React necesarios para el control de props

// ==========================================================
// 1. DEFINICIÓN DE TIPOS
// ==========================================================

type ControlType = "text" | "select" | "textarea" | "checkbox" | "date" | "time" | "datetime-local" | "datetime";

interface ControlConfig {
    // Firma de índice corregida para incluir undefined/null
    [key: string]: string | number | boolean | undefined | null;
    rows?: number;
    trueValue?: any;
    falseValue?: any;
}

interface ChangeData {
    [key: string]: any;
}

// Interfaz principal: omitimos 'onChange', 'value', y 'type' de TextFieldProps 
// para definirlos de forma más flexible en nuestro componente.
interface ControlProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'type'> {
    value?: any; 
    type?: ControlType;
    label?: string;
    config?: ControlConfig;
    onChange?: (changes: ChangeData) => void;
}


// ==========================================================
// 2. COMPONENTE FUNCIONAL CON TIPADO
// ==========================================================

export const Control: FC<ControlProps> = ({
    // SOLUCIÓN CLAVE: Desestructuramos value y onChange para que no contaminen 'rest'
    value: propValue = "", 
    type = "text",
    label = "",
    config = {},
    onChange = () => {}, 
    ...rest // Contiene todas las demás props de TextField (name, disabled, id, etc.)
}) => {
    let value = propValue;
    value ??= ""; 
    let displayValue = value;

    // myProps es un objeto limpio sin 'value' ni 'onChange'
    const myProps: Partial<TextFieldProps> = { ...rest }; 

    switch (type) {
        case "datetime-local":
        case "datetime":
        case "date":
        case "time": { 
            let inputType: string;

            switch (type) {
                case "datetime-local":
                case "datetime":
                    inputType = "datetime-local";
                    break;
                default:
                    inputType = type;
                    break;
            }
            myProps.type = inputType as TextFieldProps['type'];

            let dateValue = value;
            if (dateValue && dateValue.includes("T") && !dateValue.includes("Z")) {
                dateValue = `${dateValue}Z`;
            }
            
            const datetime = new Date(dateValue);
            
            if (Number.isNaN(datetime.getTime())) {
                datetime.setTime(0);
            }
            
            displayValue = datetime.toISOString();

            if (displayValue.split("T")[0] === "1970-01-01") {
                displayValue = "";
            } else {
                switch (type) {
                    case "date":
                        displayValue = displayValue.split("T")[0];
                        break;
                    case "time":
                        displayValue = displayValue.split("T")[1].split("Z")[0];
                        break;
                    default:
                        displayValue = displayValue.split("Z")[0]; 
                        break;
                }
            }

            myProps.InputLabelProps = { shrink: true };
            break;
        }

        case "select":
            myProps.select = true;
            myProps.children = Object.entries(config).map(([opc, val], key) => {
                
                let menuItemValue: string | number = "";
                
                if (typeof val === 'string' || typeof val === 'number') {
                    menuItemValue = val;
                } else if (val === null || val === undefined) {
                    menuItemValue = ""; 
                } else if (typeof val === 'boolean') {
                    menuItemValue = String(val); 
                } else {
                    menuItemValue = String(val); 
                }
                
                return (
                    <MenuItem value={menuItemValue} key={key}>
                        {opc}
                    </MenuItem>
                );
            });
            break;

        case "textarea":
            myProps.multiline = true;
            if (config.rows != null) myProps.rows = config.rows;
            break;

        case "checkbox":
            const trueValue = config.trueValue ?? true;
            const falseValue = config.falseValue ?? false;
            
            // 1. Desestructuramos las props que necesitamos individualmente:
            // Eliminamos las props que NO son válidas para FormControlLabel.
            const { 
                name: controlName,
                disabled,
                className,
                style,
                // Omitimos TODAS las props de TextField que causan conflicto o son irrelevantes:
                defaultValue, 
                multiline,
                variant,
                rows,
                InputProps,
                InputLabelProps,
                // Capturamos el resto de props genéricas:
                ...restPropsForLabel 
            } = myProps;
            
            // NO necesitamos el delete si aplicamos la aserción de tipo en el spread.
            
            const checkboxName = controlName as string | undefined;

            return (
                <FormControlLabel
                    label={
                        <Typography
                            style={{ color: disabled ? "#bdbdbd" : "black" }}
                        >
                            {label}
                        </Typography>
                    }
                    control={
                        <Checkbox
                            checked={displayValue === trueValue}
                            onChange={(e, checked) =>
                                onChange({
                                    [checkboxName || '']: checked ? trueValue : falseValue,
                                })
                            }
                            name={checkboxName} 
                        />
                    }
                    // 2. Aplicamos las props individuales limpias y el objeto final con ASESERCIÓN DE TIPO:
                    name={checkboxName} 
                    disabled={disabled} 
                    className={className}
                    style={style}
                    // ¡CLAVE! Forzamos a TypeScript a tratar 'restPropsForLabel' como FormControlLabelProps.
                    {...restPropsForLabel as Partial<FormControlLabelProps>} 
                />
            );

        case "text":
        default:
            myProps.type = type;
            break;
    }

    // Renderizado del TextField (para todos los tipos excepto 'checkbox')
    return (
        <TextField
            label={label}
            size="small"
            fullWidth
            value={displayValue} // Usamos displayValue para la entrada
            // Usamos el 'onChange' principal del componente
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
                onChange({ [e.target.name]: e.target.value })
            }
            // Spread de myProps y x (rest)
            {...myProps}
            {...rest} // Volvemos a pasar 'rest' para asegurar que todas las props originales lleguen
        />
    );
};

export default Control;