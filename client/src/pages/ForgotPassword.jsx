import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import Paragraph from '../components/Paragraph';
import Box from '@mui/material/Box';
import CustomInputField from '../components/CustomInputField';
import CustomButton from '../components/CustomButton';
import Footer from '../components/Footer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Alert from '@mui/material/Alert';
import axios from 'axios';

const ForgotPassword = () => {
    const navigate = useNavigate();

    // State variable which tracks whether the token check was completed, eliminating the issue of the page flashing up before the
    // token check is done
    const [authChecked, setAuthChecked] = useState(false);

    // State object that stores the form field values (email) from the forgot password form.
    const [forgotPasswordForm, setForgotPasswordForm] = useState({
        userEmail: ''
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

        // Attempt to make an API call to the backend "forgot password" route, passing the form data.
        // If successful, present the success message on the page.
        try {
            const res = await axios.post('http://localhost:4000/api/auth/forgot_password', forgotPasswordForm);

            if (res.status === 201) {
                setSuccessMessage(res.data.message);
                return;
            }
        }

        // If there was an issue with the submission of the "forgot password" form, the error will be presented on the page.
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

            console.error(err);
        }
    };

    let errorAlert;

    // If an error message was detected, it will be displayed in the form of an alert message.
    if (errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { errorMessage }
            </Alert>
        );
    }

    let successAlert;

    // If a success message was detected, it will be displayed in the form of an alert message.
    if (successMessage) {
        successAlert = (
            <Alert variant="filled" severity="success" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { successMessage }
            </Alert>
        );
    }

    return (
        <div>
            <Navbar />

            <Heading
                text="Forgot My Password"

                variant="h4"

                align="center"

                sx={{ mt: 15 }}
            />

            <Paragraph
                variant="body1"

                align="center"

                sx={{ mt: 5 }}
            >
                Enter your email address below, so that we can send the password reset link to it.
            </Paragraph>

            {errorAlert}
            {successAlert}

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