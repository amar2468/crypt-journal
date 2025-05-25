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
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';


const SignUp = ( { mode, switchForms } ) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async () => {
        if (formData.password !== formData.confirmPassword) {
                
            setErrorMessage("The passwords entered do not match. Make sure the passwords match.")

            return;
        }

        try {
            const res = await axios.post('http://localhost:4000/api/auth/sign_up', formData);
            console.log(res.data);
            setErrorMessage('');
        }

        catch (err) {
            console.log(err);
        }
    };

    let errorAlert;

    if(errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { errorMessage }
            </Alert>
        );
    }

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

                    onClick={() => navigate(-1)}
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

            {errorAlert}

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 5, mx: "auto" }}>
                <CustomInputField
                    label="First Name"
                    variant="outlined"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Last Name"
                    variant="outlined"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Email"
                    variant="outlined"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Password"
                    variant="outlined"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Confirm Password"
                    variant="outlined"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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

                <CustomButton
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3}}
                    onClick={handleSubmit}
                >
                    Sign Up
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default SignUp;