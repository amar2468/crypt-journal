import Button from '@mui/material/Button';

const CustomButton = ({ children, variant, color="", size="", sx={}, startIcon=null, onClick={} }) => {

    return (
        <Button variant={variant} color={color} size={size} sx={sx} startIcon={startIcon} onClick={onClick}>
            {children}
        </Button>
    );
};

export default CustomButton;