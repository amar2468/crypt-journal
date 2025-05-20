import Typography from '@mui/material/Typography';

const Paragraph = ({ children, variant, align, sx }) => {
    return (
        <Typography variant={variant} align={align} sx={sx}>
            { children }
        </Typography>
    );
};

export default Paragraph;