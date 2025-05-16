import Typography from '@mui/material/Typography';

const Paragraph = ({ text, variant, align, sx }) => {
    return (
        <Typography variant={variant} align={align} sx={sx}>
            { text }
        </Typography>
    );
};

export default Paragraph;