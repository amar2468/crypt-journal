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
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';


const SignUp = ( { mode, switchForms } ) => {
    const navigate = useNavigate();

    // State variable which tracks whether the token check was completed, eliminating the issue of the page flashing up before the
    // token check is done
    const [authChecked, setAuthChecked] = useState(false);

    // State object that will hold the values from the "sign up" form.
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreedToTerms: false
    });

    // State variable that will store the error message, when the form is submitted.
    const [errorMessage, setErrorMessage] = useState('');

    // State variable that will store the success message, when the form is submitted.
    const [submitFormSuccessMessage, setSubmitFormSuccessMessage] = useState('');

    // Creating a variable to enable/disable the sign up button. It will be disabled when the user clicks the button and the
    // request is being processed.
    const [disableSignUpButton, setDisableSignupButton] = useState(false);

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

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        const isChecked = event.target.checked;

        if (event.target.type === "checkbox") {
            setFormData(prev => ({
                ...prev,
                [name]: isChecked,
            }));
        }
        
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async () => {
        setErrorMessage('');
        setSubmitFormSuccessMessage('');

        // If the terms & conditions and the privacy terms were NOT accepted, we will inform the user about it and stop the form submission.
        if (formData.agreedToTerms === false) {
            setErrorMessage("You must agree to the terms.")

            return;
        }

        // If the password entered does not match the re-entered password, the form will not be submitted.
        if (formData.password !== formData.confirmPassword) {
                
            setErrorMessage("The passwords entered do not match. Make sure the passwords match.")

            return;
        }

        // Removing leading and trailing spaces from the "first name".
        const trimmedFirstName = formData.firstName.trim();

        // If the "first name" field is empty, we will stop the form submission.
        if (!trimmedFirstName) {
            setErrorMessage("First name cannot be empty! Enter a valid first name.");

            return;
        }

        // If the "first name" length is less than 2 or greater than 50, we will stop the form submission.
        if (trimmedFirstName.length < 2 || trimmedFirstName.length > 50) {
            setErrorMessage("First name needs to be between 2-50 characters long.");

            return;
        }

        // Regex which only allows letters, spaces, apostrophes, or hypens
        const firstNameRegex = /^[a-zA-ZÀ-ÿ'-\s]+$/;

        // If the "first name" contains something other than letters, spaces, apostrophes, or hypens, the form will not be submitted.
        if (!(firstNameRegex.test(trimmedFirstName))) {
            setErrorMessage("First name can only contain letters, spaces, apostrophes, or hyphens.");

            return;
        }
        
        // Updating the "first name" form field with the trimmed version of it.
        setFormData(prev => ({
            ...prev,
            firstName: trimmedFirstName
        }));

        // Removing leading and trailing spaces from the "last name".
        const trimmedLastName = formData.lastName.trim();

        // If the "last name" field is empty, we will stop the form submission.
        if (!(trimmedLastName)) {
            setErrorMessage("Last name cannot be empty! Enter a valid last name.");

            return;
        }

        // If the "last name" length is less than 2 or greater than 50, we will stop the form submission.
        if (trimmedLastName.length < 2 || trimmedLastName.length > 50 ) {
            setErrorMessage("Last name needs to be between 2-50 characters long.");

            return;
        }

        // Regex which only allows letters, spaces, apostrophes, or hypens
        const lastNameRegex = /^[a-zA-ZÀ-ÿ'-\s]+$/;

        // If the "last name" contains something other than letters, spaces, apostrophes, or hypens, the form will not be submitted.
        if (!(lastNameRegex.test(trimmedLastName))) {
            setErrorMessage("Last name can only contain letters, spaces, apostrophes, or hyphens.");

            return;
        }

        // Updating the "last name" form field with the trimmed version of it.
        setFormData(prev => ({
            ...prev,
            lastName: trimmedLastName
        }));

        // Removing leading and trailing spaces from the "email".
        const trimmedEmail = formData.email.trim();

        // If the "email" field is empty, we will stop the form submission
        if (!(trimmedEmail)) {
            setErrorMessage("Email cannot be empty! Enter a valid email address.");

            return;
        }

        // Basic email format regex: ensures one "@" and at least one "." after it, with no spaces
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // If the email entered by the user is NOT compliant with the email format, the user will be prompted to enter a valid
        // email address and the form will not be submitted.
        if (!(emailRegex.test(trimmedEmail))) {
            setErrorMessage("Please enter a valid email address.");

            return;
        }

        // Updating the "email" form field with the trimmed version of it.
        setFormData(prev => ({
            ...prev,
            email: trimmedEmail
        }));

        // Check if the password is less than 8 characters. If so, don't submit the form and present error message on the page.
        if ((formData.password).length < 8) {
            setErrorMessage("The password has to be at least 8 characters long.");

            return;
        }

        // If the password contains more than 64 characters, the form will not be submitted and an error message will be shown on the page.
        if ((formData.password).length > 64) {
            setErrorMessage("The password cannot contain more than 64 characters.");

            return;
        }

        // Creating a regex which will check if the password contains at least one uppercase letter, one lowercase letter, one number,
        // and one special character.
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/;

        // If the password is not compliant with this regex, the form will not be submitted and an error will be presented on the page
        // displayed on the screen.
        if (!(passwordRegex.test(formData.password))) {
            setErrorMessage("The password needs to contain at least one uppercase letter, one lowercase letter, one number, and one special character.");

            return;
        }

        // Attempt to make an API call to the backend "sign_up" route, passing the form data, so that the user can be added to the
        // table. Success message displayed if the user is added to the table.
        try {
            const res = await axios.post('http://localhost:4000/api/auth/sign_up', formData);
            
            // If the server returns a 201 response, display the success message on the page.
            if (res && res.status === 201) {
                setSubmitFormSuccessMessage("Your account has been created successfully. Welcome!");

                // Disable the sign up button, to prevent the user from submitting multiple forms at the same time.
                setDisableSignupButton(true);

                localStorage.setItem("token", res.data.token);

                // Once the user gets the message that their account creation was successful, wait 1 second and redirect to the dashboard.
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1000);

                return;
            }
        }

        // If there was an issue with adding the user record to the table, the error will be presented on the page.
        catch (err) {
            // If the server returns a 400 error, we will display that error message on the page.
            if (err.response && err.response.status === 400) {
                setErrorMessage(err.response.data.message);
                return;
            }

            // If the server returns a 500 error, we will display that error message on the page.
            else if (err.response && err.response.status === 500) {
                setErrorMessage(err.response.data.message);
                return;
            }
        }
    };

    let errorAlert;

    // If an error message was detected, it will be displayed in the form of an alert message.
    if(errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { errorMessage }
            </Alert>
        );
    }

    let successAlert;

    // If a success message was detected, it will be displayed in the form of an alert message.
    if (submitFormSuccessMessage) {
        successAlert = (
            <Alert variant="filled" severity="success" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { submitFormSuccessMessage }
            </Alert>
        );
    }

    return (
        <div>
            <Navbar />

            <Box display="flex" alignItems="center" sx={{ width: "100%", mt: 15 }}>
                <Box>
                    <CustomButton
                        variant="outlined"

                        startIcon={<ArrowBack />}

                        color="primary"

                        onClick={() => navigate(-1)}
                    >

                        Back
                    </CustomButton>
                </Box>
                
                <Box display="flex" justifyContent="center" sx={{ flexGrow: 1 }}>
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

            {successAlert}

            <Box display="flex" justifyContent="center" flexDirection="column" sx={{ mt: 5, mx: "auto", width: { xs: "90%", lg: "60%" } }}>
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
                    control={<Checkbox name="agreedToTerms" value={formData.agreedToTerms} onChange={handleChange} />}

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
                    disabled={disableSignUpButton}
                >
                    Sign Up
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default SignUp;