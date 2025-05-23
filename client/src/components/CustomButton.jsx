import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const CustomButton = ({ children, variant, color="", size="", sx={}, startIcon=null, redirect_to="" }) => {

    const navigate = useNavigate();

    return (
        <Button variant={variant} color={color} size={size} sx={sx} startIcon={startIcon} onClick={() => navigate(redirect_to)}>
            {children}
        </Button>
    );
};

export default CustomButton;