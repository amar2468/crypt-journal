import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import Paragraph from '../components/Paragraph';
import CustomInputField from '../components/CustomInputField';
import CustomButton from '../components/CustomButton';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from '@mui/material/ToggleButton';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const Login = ( { mode, switchForms } ) => {
    const navigate = useNavigate();

    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setLoginFormData({
            ...loginFormData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post('http://localhost:4000/api/auth/login', loginFormData);
            console.log(res);
        }

        catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <Navbar />

            <Box display="flex" justifyContent="center" sx={{ mt: 5 }}>
                <ToggleButtonGroup
                    value={mode}

                    exclusive={true}

                    onChange={switchForms}

                    aria-label="Sign Up/Login toggle"

                    align="center"
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
                text="Sign Into My Account"

                variant="h4"

                align="center"

                sx={{ mt: 5 }}
            />

            <Paragraph
                variant="body1"

                align="center"

                sx={{ mt: 5 }}
            >
                Fill in the fields below to sign into your account.
            </Paragraph>

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 5, mx: "auto" }}>
                <CustomInputField
                    label="Email"

                    variant="outlined"

                    type="email"

                    name="email"

                    value={loginFormData.email}

                    onChange={handleChange}

                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Password"

                    variant="outlined"

                    type="password"

                    name="password"

                    value={loginFormData.password}

                    onChange={handleChange}

                    sx={{ mt: 3 }}
                />

                <CustomButton
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 3 }}
                    onClick={handleSubmit}
                >
                    Sign In
                </CustomButton>

                <Link
                    component={RouterLink}
                    to="/forgot_password"
                    color="primary"
                    align="center"   
                    sx={{ mt: 3 }}
                >
                    Forgot Your Password?
                </Link>

                
                <Box display="flex" justifyContent="center">
                    <Paragraph
                        variant="body1"

                        align="center"

                        sx={{ mt: 3 }}
                    >
                        Don't have An Account Yet? {' '}
                        <Link
                            component={RouterLink}
                            to="/auth?mode=sign_up"
                            color="primary"
                        >
                            Sign Up Here
                        </Link>
                    </Paragraph>
                    
                </Box>
            </Box>

            <Footer />

        </div>
    );
};

export default Login;