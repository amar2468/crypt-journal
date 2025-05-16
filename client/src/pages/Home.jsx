import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import frontPicture from '../assets/landing_page_img.jpg';
import CustomButton from '../components/CustomButton';
import Divider from '@mui/material/Divider';
import Paragraph from '../components/Paragraph';
import Box from "@mui/material/Box";

function Home() {
    return (
        <div>
            <Navbar />

            <Heading 
                text="Crypt Journal - A Free, Secure Space for Your Mind" 
                variant="h4" 
                align="center" 
                sx={{ mt: 10 }}
            />

            <img 
                src={frontPicture} 
                alt="Crypt Journal Landing Page img" 
                height="400" 
                width="400" 
                align="center" 
                style={{ display: "block", margin: "0 auto" }} 
            />

            <CustomButton variant="contained" color="primary" size="large" sx={{ display: "block", mx: "auto", mb: 5 }}>
                Create Your Secret Diary Now!
            </CustomButton>

            <Divider />

            <Box sx={{ maxWidth: 600, mx: "auto" }}>
                <Paragraph
                    text="Presenting to you - a completely secret & free online diary!  
                    You can finally jot down all your thoughts/ideas using this diary online
                    and not worry about paying for anything or about the security aspect."

                    variant="body1"

                    align="center"

                    sx={{ mt: 2 }}
                />

                <Paragraph 
                    text="Just a few reasons to use this secret diary web app..."

                    variant="body1"

                    align="center"

                    sx={{ mt: 5, mb: 5 }}
                
                />

            </Box>

        </div>
    );
}

export default Home;