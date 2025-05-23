import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import Paragraph from '../components/Paragraph';
import CustomInputField from '../components/CustomInputField';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CustomButton from '../components/CustomButton';
import Footer from '../components/Footer';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import ArrowBack from '@mui/icons-material/ArrowBack';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from '@mui/material/ToggleButton';


const SignUp = ( { mode, switchForms } ) => {
    return (
        <div>
            <Navbar />

            <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
                <ToggleButtonGroup
                    value={mode}

                    exclusive={true}

                    onChange={switchForms}

                    aria-label="Sign Up/Login toggle"
                >
                    <ToggleButton value="sign_up">
                        Sign Up
                    </ToggleButton>

                    <ToggleButton value="sign_in">
                        Login
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
            
            <Box sx={{ position: "relative", height: "auto" }}>
                <CustomButton
                    variant="outlined"

                    startIcon={<ArrowBack />}

                    color="primary"

                    sx={{ ml: 15, position: "absolute", mt: 5 }}

                    redirect_to={-1}
                >

                    Back
                </CustomButton>
            </Box>

            <Heading
                text="Create My Account"

                variant="h4"

                align="center"

                sx={{ mt: 5 }}
            />

            <Paragraph
                variant="body1"

                align="center"

                sx={{ mt: 5 }}
            >
                Sign up for a free account - with unlimited possibilities!
            </Paragraph>

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 5, mx: "auto" }}>
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
                    label="Password"
                    variant="outlined"
                    type="password"
                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    sx={{ mt: 3 }}
                />

                <FormControlLabel
                    control={<Checkbox />}

                    label={
                        <span>
                            I agree to the {' '}
                            <Link
                                component={RouterLink}
                                to="/terms_and_conditions"
                                color="primary"
                            >
                                Terms & Conditions
                            </Link>
                            {' '}

                            and {' '}
                            <Link
                                component={RouterLink}
                                to="/privacy_policy"
                                color="primary"
                            >
                                Privacy Policy
                            </Link>
                        </span>
                    }
                    
                    sx={{ mt: 3 }} 
                />

                <CustomButton variant="contained" color="primary" size="large" sx={{ mt: 3}}>
                    Sign Up
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default SignUp;