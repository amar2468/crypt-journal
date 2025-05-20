import TextField from '@mui/material/TextField';

const CustomInputField = ({ label, variant, type, sx }) => {
    return (
        <TextField
            label={label}

            variant={variant}

            type={type}

            sx={sx}
        />
    );
}

export default CustomInputField;