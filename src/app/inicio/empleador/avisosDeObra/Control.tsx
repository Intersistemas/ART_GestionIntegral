// src/app/inicio/empleador/avisosDeObra/Control.tsx
import React, { FC, ChangeEvent } from "react";
import {
    Checkbox,
    FormControlLabel,
    MenuItem,
    TextField,
    Typography,
    TextFieldProps,
    FormControlLabelProps, 
} from "@mui/material";
import { CSSProperties, ReactNode, SyntheticEvent } from "react"; 

type ControlType = "text" | "select" | "textarea" | "checkbox" | "date" | "time" | "datetime-local" | "datetime" | "number";

interface ControlConfig {
    // Firma de índice para configuraciones
    [key: string]: string | number | boolean | undefined | null;
    rows?: number;
    trueValue?: any;
    falseValue?: any;
}

interface ChangeData {
    [key: string]: any;
}

// Interfaz principal: Agregamos 'maxLength'
interface ControlProps extends Omit<TextFieldProps, 'onChange' | 'value' | 'type'> {
    value?: any; 
    type?: ControlType;
    label?: string;
    config?: ControlConfig;
    onChange?: (changes: ChangeData) => void;
    /** * Limita el número máximo de caracteres o dígitos permitidos en la entrada.
     * Se aplica a 'text', 'textarea', 'date', 'time', 'datetime-local', y 'number'.
     */
    maxLength?: number; 
}

export const Control: FC<ControlProps> = ({
    // Desestructuración y valores por defecto
    value: propValue = "", 
    type = "text",
    label = "",
    config = {},
    onChange = () => {}, 
    maxLength, // Nuevo prop destructuring
    ...rest // Contiene todas las demás props de TextField (name, disabled, id, etc.)
}) => {
    let value = propValue;
    // Normalizar null/undefined a string vacío para el TextField
    value ??= ""; 
    let displayValue = value;

    // myProps es el objeto de props para TextField, inicialmente contiene 'rest'
    const myProps: Partial<TextFieldProps> = { ...rest }; 

    switch (type) {
        // --- CASOS DE FECHAS (TextField) ---
        case "datetime-local":
        case "datetime":
        case "date":
        case "time": { 
            let inputType: string;

            // Determinar el inputType de HTML
            inputType = (type === "datetime-local" || type === "datetime") ? "datetime-local" : type;
            myProps.type = inputType as TextFieldProps['type'];

            // Lógica de conversión de fecha/hora (asumiendo formato ISO o similar)
            let dateValue = value;
            if (dateValue && dateValue.includes("T") && !dateValue.includes("Z")) {
                dateValue = `${dateValue}Z`;
            }
            
            const datetime = new Date(dateValue);
            
            // Si la fecha es inválida (getTime() es NaN), la reseteamos o mostramos vacío
            if (Number.isNaN(datetime.getTime())) {
                displayValue = "";
            } else {
                displayValue = datetime.toISOString();

                // Formateo para los tipos de entrada específicos de HTML
                if (displayValue.split("T")[0] === "1970-01-01") {
                    displayValue = "";
                } else {
                    switch (type) {
                        case "date":
                            displayValue = displayValue.split("T")[0];
                            break;
                        case "time":
                            // Excluir segundos si es posible, o usar el formato de ISO
                            displayValue = displayValue.split("T")[1].split("Z")[0].substring(0, 5); // HH:MM
                            break;
                        default:
                            displayValue = displayValue.split("Z")[0].substring(0, 16); // YYYY-MM-DDTHH:MM
                            break;
                    }
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
                } else {
                    menuItemValue = String(val ?? ""); 
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

        // --- CASO CHECKBOX (FormControlLabel + Checkbox) ---
        case "checkbox":
            const trueValue = config.trueValue ?? true;
            const falseValue = config.falseValue ?? false;
            
            // 1. Separar las props de TextField que son válidas para FormControlLabel
            const { 
                name: controlName,
                disabled,
                className,
                style,
                // Omitir TODAS las props de TextField que no son válidas para FormControlLabel
                defaultValue, multiline, variant, rows, InputProps, InputLabelProps,
                ...restPropsForLabel 
            } = myProps;
            
            const checkboxName = controlName as string | undefined;

            return (
                <FormControlLabel
                    // 2. Definición del Label
                    label={
                        <Typography
                            style={{ color: disabled ? "#bdbdbd" : "black" }}
                        >
                            {label}
                        </Typography>
                    }
                    // 3. Definición del Control (Checkbox)
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
                    // 4. Aplicar las props de FormControlLabel (limpias)
                    name={checkboxName} 
                    disabled={disabled} 
                    className={className}
                    style={style}
                    // Forzar el resto de props para FormControlLabel
                    {...restPropsForLabel as Partial<FormControlLabelProps>} 
                />
            );
        case "number":
            // Establecer el tipo de input para el TextField subyacente
            myProps.type = "number";
            break;
        case "text":
        default:
            myProps.type = type;
            break;
    }

    // Aplicar maxLength SOLO a tipos que lo soportan nativamente (text, date, time)
    // Se excluye 'number' y 'select'
    if (maxLength !== undefined && type !== "select" && type !== "number") {
        myProps.InputProps = {
            // Fusionar InputProps existentes (si las hay)
            ...(myProps.InputProps as any || {}), 
            inputProps: {
                // Fusionar inputProps existentes (si las hay)
                ...((myProps.InputProps as any)?.inputProps || {}), 
                maxLength: maxLength,
            },
        };
    }
    
    // Renderizado del TextField (para todos los tipos excepto 'checkbox')
    return (
        <TextField
            label={label}
            size="small"
            fullWidth
            value={displayValue} 
            onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                let newValue = e.target.value;
                const name = e.target.name;

                // 🚀 LÓGICA DE FILTRADO PARA type="number"
                // Esto limita el número de dígitos (caracteres) ya que maxLength no funciona
                if (type === "number" && maxLength !== undefined) {
                    // 1. Opcionalmente, puedes validar que solo sean números y un posible signo negativo
                    // if (!/^-?\d*$/.test(newValue) && newValue !== '-') return;
                    
                    // Solo permite números positivos/enteros
                    if (!/^\d*$/.test(newValue)) return;


                    // 2. Trunca la cadena si excede la longitud máxima
                    if (newValue.length > maxLength) {
                        newValue = newValue.substring(0, maxLength);
                    }
                }

                onChange({ [name]: newValue });
            }}
            // Asegurar que todas las props (incluyendo 'rest' original y myProps modificadas) lleguen al TextField
            {...myProps}
            {...rest}
        />
    );
};

export default Control;