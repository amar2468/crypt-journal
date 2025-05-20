import Button from '@mui/material/Button';

const CustomButton = ({ children, variant, color="", size="", sx={}, startIcon=null }) => {
    return (
        <Button variant={variant} color={color} size={size} sx={sx} startIcon={startIcon} >
            {children}
        </Button>
    );
};

export default CustomButton;