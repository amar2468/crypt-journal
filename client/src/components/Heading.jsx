import Typography from '@mui/material/Typography';

const Heading = ({ text,variant, align, sx={} }) => {
    return (
        <Typography variant={variant} align={align} sx={sx}>
            {text}
        </Typography>
    );
};

export default Heading;