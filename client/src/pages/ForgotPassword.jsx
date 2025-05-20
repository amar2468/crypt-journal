import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import Paragraph from '../components/Paragraph';
import Box from '@mui/material/Box';
import CustomInputField from '../components/CustomInputField';
import CustomButton from '../components/CustomButton';
import Footer from '../components/Footer';

const ForgotPassword = () => {
    return (
        <div>
            <Navbar />

            <Heading
                text="Forgot My Password"

                variant="h4"

                align="center"

                sx={{ mt: 5 }}
            />

            <Paragraph
                text="Enter your email address below, so that we can send the password reset link to it."

                variant="body1"

                align="center"

                sx={{ mt: 5 }}
            />

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 5, mx: "auto" }}>
                <CustomInputField
                    label="Email"

                    variant="outlined"

                    type="email"

                    sx={{ mt: 3 }}
                />

                <CustomButton
                    variant="contained"

                    color="primary"

                    size="large"

                    sx={{ mt: 3 }}
                >
                    Submit
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default ForgotPassword;