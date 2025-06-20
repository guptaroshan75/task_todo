import { FormControl, FormHelperText, InputLabel, } from "@mui/material";
import { Box, TextField, Typography, OutlinedInput } from "@mui/material";
import { red } from "@mui/material/colors";
import { useField } from "formik";
import { Fragment, memo, type FC, type ReactNode } from "react";
import { CircleAlert } from "lucide-react";
import { CONSTANTS } from "../utils/staticData";
import FormikErrorFocus from "formik-error-focus";

interface MyInputProps {
    formikProps: any;
    label?: string;
    countryCode?: string;
    isRequired?: boolean;
    customType?: string;
    inputStyle?: object;
    containerStyle?: object;
    rightElement?: ReactNode;
    leftElement?: ReactNode;
    min?: number;
    max?: number;
    quilHeight?: string;
    helperText?: string;
    allowMultipleFile?: boolean;
    [key: string]: any;
}

const MyInput: FC<MyInputProps> = ({
    formikProps,
    label,
    countryCode,
    isRequired = false,
    customType,
    inputStyle,
    containerStyle,
    rightElement,
    min,
    max,
    quilHeight = "100px",
    helperText = "",
    leftElement,
    allowMultipleFile = false,
    ...props
}) => {
    const [field, meta] = useField(props);
    const error = meta.touched && meta.error;

    const renderComponent = () => {
        switch (customType) {
            case "number":
                return (
                    <OutlinedInput placeholder="" type="number" inputProps={{ min: min, max: max }}
                        error={Boolean(error)} sx={inputStyle} size="small"
                        {...field} {...props} endAdornment={Boolean(error) ? (
                            <CircleAlert color="red" size={18} />
                        ) : (
                            rightElement
                        )}
                    />
                );
            case "textarea":
                return (
                    <TextField variant="outlined" multiline minRows={props.minRows || 3}
                        maxRows={props.maxRows || 10} className={isRequired ? "error-line" : ""}
                        placeholder={"Type Here..."} error={Boolean(error)}
                        sx={inputStyle} size="small" helperText={helperText}
                        {...field}  {...props}
                    />
                );
            default:
                return (
                    <OutlinedInput placeholder="" error={Boolean(error)}
                        size="small" sx={{
                            ...inputStyle, fontSize: CONSTANTS.fontSize,
                            minHeight: "40px", height: "40px"
                        }}
                        startAdornment={leftElement} endAdornment={
                            Boolean(error) ? (
                                <CircleAlert color="red" size={18} />
                            ) : (
                                rightElement
                            )
                        }
                        inputProps={{ min: 1, }} {...field}   {...props}
                    />
                );
        }
    };

    return (
        <Fragment>
            <Box sx={containerStyle}>
                <InputLabel sx={{
                    marginBottom: 0.5, textTransform: "capitalize", fontSize: CONSTANTS.fontSize,
                }}>
                    {label && label}{" "}

                    {isRequired && (
                        <Typography component={"span"} color="error"> * </Typography>
                    )}
                </InputLabel>

                <FormControl fullWidth>
                    {renderComponent()}

                    {helperText && (
                        <FormHelperText sx={{ marginLeft: 0 }}>
                            {helperText}
                        </FormHelperText>
                    )}

                    {error && (
                        <FormHelperText sx={{ color: red[500], marginLeft: 0 }}>
                            {error}
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>

            <FormikErrorFocus offset={50} align="top" formik={formikProps}
                focusDelay={200} ease="linear" duration={300}
            />
        </Fragment>
    );
};

export default memo(MyInput);