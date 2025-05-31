import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import Paragraph from '../components/Paragraph';
import Box from '@mui/material/Box';
import CustomInputField from '../components/CustomInputField';
import CustomButton from '../components/CustomButton';
import Footer from '../components/Footer';
import { useState } from 'react';

const ForgotPassword = () => {

    // State object that stores the form field values (email) from the forgot password form.
    const [forgotPasswordForm, setForgotPasswordForm] = useState({
        userEmail: ''
    });

    // Function that will populate the state object variables with the up-to-date values that the user enters from the input fields.
    const handleChange = (event) => {
        // Get the "name" and "value" of the form field, so we know what needs to be updated.
        const name = event.target.name;
        const value = event.target.value;

        // Update the value of the specified field that was changed with the new value that the user entered.
        setForgotPasswordForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // State variable that will store the error message, when the form is submitted.
    const [errorMessage, setErrorMessage] = useState('');

    // State variable that will store the success message, when the form is submitted.
    const [successMessage, setSuccessMessage] = useState('');

    // Function which will check the input from the forgot password form & make an API request to the backend, passing the form fields.
    const handleSubmit = async() => {
        // Resetting the error messages and success messages, every time the form is submitted.
        setErrorMessage('');
        setSuccessMessage('');

        // Removing leading and trailing spaces from the "userEmail" field.
        const trimmedEmail = forgotPasswordForm.userEmail.trim();

        // If the email is empty, an error message will be on the page and the form will not be submitted.
        if (!(trimmedEmail)) {
            setErrorMessage("Email cannot be empty! Enter a valid email.");
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
        setForgotPasswordForm(prev => ({
            ...prev,
            userEmail: trimmedEmail,
        }));
    };

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
                variant="body1"

                align="center"

                sx={{ mt: 5 }}
            >
                Enter your email address below, so that we can send the password reset link to it.
            </Paragraph>

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 5, mx: "auto" }}>
                <CustomInputField
                    label="Email"

                    variant="outlined"

                    type="email"

                    name="userEmail"

                    value={forgotPasswordForm.userEmail}

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
                    Submit
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default ForgotPassword;