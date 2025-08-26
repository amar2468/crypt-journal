import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import frontPicture from '../assets/landing_page_img.jpg';
import FeatureOnePicture from '../assets/feature_one_image.jpg';
import FeatureTwoPicture from '../assets/padlock_diary.jpg';
import FeatureThreePicture from '../assets/infinite_entries.jpg';
import DefaultProfilePicture from '../assets/default_profile_pic.jpg';
import CustomButton from '../components/CustomButton';
import Divider from '@mui/material/Divider';
import Paragraph from '../components/Paragraph';
import Box from "@mui/material/Box";
import FeatureDescriptionCard from '../components/FeatureDescriptionCard';
import CustomerReviewCard from '../components/CustomerReviewCard';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';

const Home = () => {
    const navigate = useNavigate();

    // State variable which tracks whether the token check was completed, eliminating the issue of the page flashing up before the
    // token check is done
    const [authChecked, setAuthChecked] = useState(false);

    // Checking whether the token is present - if it is there, it means that the user is logged in, so they should be redirected
    // away from the page. If there is no token, we will set the auth check to true, meaning that the page can be safely displayed.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard");
        }

        else {
            setAuthChecked(true);
        }

    }, [navigate]);

    // If the token check indicates that there is no token, we will not allow the displaying of the page.
    if (!authChecked) {
        return null;
    }
    
    return (
        <div>
            <Navbar />

            <Heading 
                text="Crypt Journal - A Free, Secure Space for Your Mind" 
                variant="h5" 
                align="center" 
                sx={{ mt: 15 }}
            />

            <img 
                src={frontPicture} 
                alt="Crypt Journal Landing Page img" 
                height="400" 
                width="400" 
                align="center" 
                style={{ display: "block", margin: "0 auto" }} 
            />

            <CustomButton
                variant="contained"
                color="transparent"
                size="large"
                onClick={() => navigate("/auth?mode=sign_up")}
                sx={{
                    display: "block", mx: "auto", mb: 5, border: 3, borderRadius: "25px", transition: "transform 0.2s ease-in-out",
                    '&:hover':{
                        color: "#0000FF",
                        borderColor: "primary.main",
                        transform: "scale(1.1)"
                    }
                }}
            >
                Create Your Secret Diary Now!
            </CustomButton>

            <Divider />

            <Box sx={{ maxWidth: 600, mx: "auto", marginTop: 5 }}>
                <Paragraph
                    variant="body1"

                    align="center"

                    sx={{ mt: 2 }}
                >
                    Presenting to you - a completely secret & free online diary!  
                    You can finally jot down all your thoughts/ideas using this diary online
                    and not worry about paying for anything or about the security aspect.
                </Paragraph>

                <Paragraph
                    variant="body1"

                    align="center"

                    sx={{ mt: 5, mb: 5 }}
                
                >
                    Just a few reasons to use this secret diary web app...
                </Paragraph>

            </Box>

            <Box display="flex" justifyContent="center" alignItems="center" flexDirection={{ xs:"column", lg: "row" }} gap={4} sx={{ mx: "auto", marginBottom: 6 }}>
                <FeatureDescriptionCard 
                    title="Customise Diary"
                    description="Give your diary a name & add fancy colours and designs, and much more..."
                    image={FeatureOnePicture}
                    sx={{ flex: 1 }}
                />

                <FeatureDescriptionCard 
                    title="Password Lock Diary"

                    description="Worried that someone may get into your account and view your secret diary?
                    Password lock it!"

                    image={FeatureTwoPicture}

                    sx={{ flex: 1 }}

                />

                <FeatureDescriptionCard 
                    title="Unlimited Entries"

                    description="Never have to worry about having limited entries. Enjoy unlimited entries!"

                    image={FeatureThreePicture}

                    sx={{ flex: 1 }}
                />
            </Box>

            <Divider />
            
            <Heading 
                text="Here are just a few reviews..."

                variant="h5"

                align="center"

                sx= {{ mt: 5 }}
            />

            <Box display="flex" justifyContent="center" gap={4} sx={{ marginBottom: 15 }}>

                <CustomerReviewCard
                    reviewer_name="Amar Plakalo"
                    
                    reviewer_description="This is Amar's description."

                    image={DefaultProfilePicture}

                    reviewer_rating={3}
                />

                <CustomerReviewCard 
                    reviewer_name="James Jones"

                    reviewer_description="This is James's description."

                    image={DefaultProfilePicture}

                    reviewer_rating={4}

                />

                <CustomerReviewCard
                    reviewer_name="Lucy Evans"

                    reviewer_description="This is Lucy's description."

                    image={DefaultProfilePicture}

                    reviewer_rating={5}

                />
            
            </Box>

            <Divider />

            <Footer />

        </div>
    );
}

export default Home;