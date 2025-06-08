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
import Alert from '@mui/material/Alert';
import { useEffect } from 'react';

const Login = ( { mode, switchForms } ) => {
    const navigate = useNavigate();

    // State variable which tracks whether the token check was completed, eliminating the issue of the page flashing up before the
    // token check is done
    const [authChecked, setAuthChecked] = useState(false);

    // State object that will hold the values of the "email" and "password" fields in the "login" form.
    const [loginFormData, setLoginFormData] = useState({
        email: '',
        password: ''
    });

    // State variable that will store the error message, when the form is submitted.
    const [errorMessage, setErrorMessage] = useState('');

    // State variable that will store the success message, when the form is submitted.
    const [successMessage, setSuccessMessage] = useState('');

    // Checking whether the token is present - if it is there, it means that the user is logged in, so they should be redirected
    // away from the page. If there is no token, we will set the auth check to true, meaning that the page can be safely displayed.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/");
        }

        else {
            setAuthChecked(true);
        }
        
    }, [navigate]);

    // If the token check indicates that there is no token, we will not allow the displaying of the page.
    if (!authChecked) {
        return null;
    }
    
    // Function that will update the values in the state object for the "email" and "password" fields.
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setLoginFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Function which will check the input from the sign in form and make an API request to the backend, passing the form fields.
    const handleSubmit = async () => {
        // Resetting the error messages and success messages, every time the form is submitted.
        setErrorMessage("");
        setSuccessMessage("");

        // Removing leading and trailing spaces from the "email".
        const formattedEmail = loginFormData.email.trim();

        // If the email is empty, an error message will be on the page and the form will not be submitted.
        if (!(formattedEmail)) {
            setErrorMessage("Email cannot be empty! Enter a valid email.");
            return;
        }

        // Basic email format regex: ensures one "@" and at least one "." after it, with no spaces
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // If the email entered by the user is NOT compliant with the email format, the user will be prompted to enter a valid
        // email address and the form will not be submitted.
        if (!(emailRegex.test(formattedEmail))) {
            setErrorMessage("Please enter a valid email address.");
            return;
        }

        // Updating the "email" form field with the trimmed version of it.
        setLoginFormData(prev => ({
            ...prev,
            email: formattedEmail,
        }));

        // If the password is empty, an error message will be on the page and the form will not be submitted.
        if (loginFormData.password === "") {
            setErrorMessage("Password cannot be empty! Enter a valid password.");
            return;
        }

        // Attempt to make an API call to the backend "login" route, passing the form data. If successful, present the success
        // message on the page.
        try {
            // Making a "POST" API request to "login" route, passing the form data.
            const res = await axios.post('http://localhost:4000/api/auth/login', loginFormData);
            
            // If the server returns a 201 response, display the success message on the page.
            if (res && res.status === 201) {
                setSuccessMessage(res.data.message);

                localStorage.setItem("token", res.data.token);

                return;
            }
        }

        // If there was an issue with signing in, the error will be presented on the page.
        catch (err) {
            // If the server returns a 400 error, we will display that error message on the page.
            if (err.response && err.response.status === 400) {
                setErrorMessage(err.response.data.message);
                return;
            } 

            // If the server returns a 401 error, we will display that error message on the page.
            if (err.response && err.response.status === 401) {
                setErrorMessage(err.response.data.message);
                return;
            }

            // If the server returns a different error code, display a generic error message on the page.
            else {
                console.error(err);
                setErrorMessage("Invalid email or password. Please try again.");
                return;
            }
        }
    };

    let errorAlert;

    // If an error message was detected, it will be displayed in the form of an alert message.
    if (errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: '50%', margin: '0 auto', mt: 5 }}>
                { errorMessage }
            </Alert>
        );
    }

    let successAlert;

    // If a success message was detected, it will be displayed in the form of an alert message.
    if (successMessage) {
        successAlert = (
            <Alert variant="filled" severity="success" sx={{ width:'50%', margin: '0 auto', mt: 5 }}>
                { successMessage }
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

            { errorAlert }
            { successAlert }

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