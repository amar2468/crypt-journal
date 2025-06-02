import Navbar from "../components/Navbar";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import Box from "@mui/material/Box";
import CustomInputField from "../components/CustomInputField";
import CustomButton from "../components/CustomButton";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
    const { token } = useParams();

    console.log(token);

    return (
        <div>
            <Navbar />

            <Heading 
                text="Reset Password"

                variant="h4"

                align="center"

                sx={{ mt: 5 }}
            />

            <Paragraph
                variant="body1"
                align="center"
                sx={{ mt: 5 }}
            >
                Enter the new password, making sure it contains at least 8 characters.
                There must be at least one uppercase letter, one lowercase letter, one number, and one special character.
            </Paragraph>

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 5, mx: "auto" }}>               
                <CustomInputField
                    label="New Password"

                    variant="outlined"

                    type="password"

                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Confirm New Password"

                    variant="outlined"

                    type="password"

                    sx={{ mt: 3 }}
                />

                <CustomButton
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3 }}
                >
                    Reset Password
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default ResetPassword;