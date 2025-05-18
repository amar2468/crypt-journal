import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const FeatureDescriptionCard = ({ title, description, image }) => {
    return (
        <Card sx={{ backgroundColor: "#f8f8f8", maxWidth: 350 }}>
            <CardMedia 
                component="img"

                alt={title}

                image={image}
            />

            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>

                <Typography variant="body1">
                    {description}
                </Typography>
            </CardContent>


        </Card>
    );
};

export default FeatureDescriptionCard;