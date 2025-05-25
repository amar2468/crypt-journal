import TextField from '@mui/material/TextField';

const CustomInputField = ({ label, variant, type, name, value, onChange, sx }) => {
    return (
        <TextField
            label={label}

            variant={variant}

            type={type}

            name={name}

            value={value}

            onChange={onChange}

            sx={sx}
        />
    );
}

export default CustomInputField;