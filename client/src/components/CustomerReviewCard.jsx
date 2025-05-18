import { CardContent } from '@mui/material';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import Rating from '@mui/material/Rating';

const CustomerReviewCard = ({ reviewer_name, reviewer_description, image, reviewer_rating }) => {
    return (
        <Card sx={{ backgroundColor: "#f9f9f9", mt: 5 }}>
            <CardContent>

                <CardMedia 
                    component="img"

                    alt={reviewer_name}

                    image={image}

                    height="150"
                />

                <Typography variant="body1" align="center" sx={{ mb: 5 }}>
                    {reviewer_name}
                </Typography>

                <Typography variant="body2" component="div">
                    {reviewer_description}
                </Typography>

                <Rating 
                    name="read-only"
                    value={reviewer_rating}
                    readOnly
                />

            </CardContent>
        </Card>
    );
};

export default CustomerReviewCard;