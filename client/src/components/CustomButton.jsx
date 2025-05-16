import Button from '@mui/material/Button';

const CustomButton = ({ children, variant, color, size, sx }) => {
    return (
        <Button variant={variant} color={color} size={size} sx={sx}>
            {children}
        </Button>
    );
};

export default CustomButton;