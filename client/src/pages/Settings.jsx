import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import CustomInputField from '../components/CustomInputField';
import CustomButton from '../components/CustomButton';
import Box from '@mui/material/Box';
import Footer from '../components/Footer';
import Switch from '@mui/material/Switch';
import { FormControlLabel } from '@mui/material';
import Paragraph from '../components/Paragraph';

const Settings = () => {
    return (
        <div>
            <Navbar />

            <Heading
                text="Account Information"

                variant="h5"

                align="center"

                sx={{ mt: 15 }}
            />

            <Paragraph
                variant="body1"

                align="center"

                sx={{ mt: 5 }}
            >
                Update your account information below to keep your profile accurate and up to date.
            </Paragraph>

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 3, mx: "auto" }}>
                <CustomInputField
                    label="First Name"

                    variant="outlined"

                    type="text"

                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Last Name"

                    variant="outlined"

                    type="text"

                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Email"

                    variant="outlined"

                    type="email"

                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Phone Number"

                    variant="outlined"

                    type="tel"

                    sx={{ mt: 3 }}
                />

                <FormControlLabel control={<Switch />} label="Enable Multi-Factor Authentication (MFA)" sx={{ mt: 3 }} />

                <CustomButton
                    variant="contained"

                    color="secondary"

                    size="large"

                    sx={{ mt: 3 }}
                >
                    Save
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default Settings;