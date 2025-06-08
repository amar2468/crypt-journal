import Navbar from "../components/Navbar";
import Heading from "../components/Heading";
import Paragraph from "../components/Paragraph";
import Box from "@mui/material/Box";
import CustomInputField from "../components/CustomInputField";
import CustomButton from "../components/CustomButton";
import Footer from "../components/Footer";
import Alert from '@mui/material/Alert';
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const ResetPassword = () => {
    const { token } = useParams();

    const navigate = useNavigate();

    const [authChecked, setAuthChecked] = useState(false);

    // State variable that will store the error message, when the form is submitted.
    const [errorMessage, setErrorMessage] = useState('');

    // State variable that will store the success message, when the form is submitted.
    const [successMessage, setSuccessMessage] = useState('');

    // State object that will hold the values of the "new_password", "confirm_new_password", and "token" fields from the form below.
    const [resetPasswordForm, setResetPasswordForm] = useState({
        new_password: '',
        confirm_new_password: '',
        token: token
    });

    // Checking whether the token is present - if it is there, it means that the user is logged in, so they should be redirected
    // away from the page. If there is no token, we will set the auth check to true, meaning that the page can be safely displayed.
    useEffect(() => {
        const logged_in = localStorage.getItem("token");

        if (logged_in) {
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

    // Function that will update the values in the state object for the "new_password" and "confirm_new_password" fields.
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        
        setResetPasswordForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    // Function which will check the input from the password reset form & make an API request to the backend, passing the form fields.
    const handleSubmit = async () => {
        // Resetting the error messages and success messages, every time the form is submitted.
        setErrorMessage("");
        setSuccessMessage("");

        // If the password entered does not match the re-entered password, the form will not be submitted.
        if (resetPasswordForm.new_password !== resetPasswordForm.confirm_new_password) {
            setErrorMessage("The passwords don't match. Make sure that the passwords match before submitting the form.");
            return;
        }

        // Check if the password is less than 8 characters. If so, don't submit the form and present error message on the page.
        if ((resetPasswordForm.new_password).length < 8) {
            setErrorMessage("The password has to be at least 8 characters long.");
            return;
        }

        // If the password contains more than 64 characters, the form will not be submitted and an error message will be shown on the page.
        if ((resetPasswordForm.new_password).length > 64) {
            setErrorMessage("The password cannot contain more than 64 characters.");

            return;
        }

        // Creating a regex which will check if the password contains at least one uppercase letter, one lowercase letter, one number,
        // and one special character.
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,64}$/;

        // If the password is not compliant with this regex, the form will not be submitted and an error will be presented on the page
        // displayed on the screen.
        if (!(passwordRegex.test(resetPasswordForm.new_password))) {
            setErrorMessage("The password needs to contain at least one uppercase letter, one lowercase letter, one number, and one special character.");
            return;
        }

        // Attempt to make an API call to the backend "change_password" route, passing the form data. If successful,
        // present the success message on the page.
        try {
            // Making a "POST" API request to "change_password" route, passing the form data.
            const res = await axios.post("http://localhost:4000/api/auth/change_password", resetPasswordForm);

            // If the server returns a 201 response, display the success message on the page.
            if (res && res.status === 201) {
                setSuccessMessage(res.data.message);
                return;
            }
        }

        // If there was an issue with changing the password, the error will be presented on the page.
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

            // If the server returns a different error (not 400/500), we will display that error message in the console.
            else {
                console.error(err);
            }
        }

    };

    let errorAlert;

    // If an error message was detected, it will be displayed in the form of an alert message.
    if (errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                {errorMessage}
            </Alert>
        );
    }

    let successAlert;

    // If a success message was detected, it will be displayed in the form of an alert message.
    if (successMessage) {
        successAlert = (
            <Alert variant="filled" severity="success" sx={{ width:"50%", margin: "0 auto", mt: 5 }}>
                {successMessage}
            </Alert>
        );
    }

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

            {errorAlert}
            {successAlert}

            <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 5, mx: "auto" }}>               
                <CustomInputField
                    label="New Password"

                    variant="outlined"

                    type="password"

                    name="new_password"

                    value={resetPasswordForm.new_password}

                    onChange={handleChange}

                    sx={{ mt: 3 }}
                />

                <CustomInputField
                    label="Confirm New Password"

                    variant="outlined"

                    type="password"

                    name="confirm_new_password"

                    value={resetPasswordForm.confirm_new_password}

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
                    Reset Password
                </CustomButton>
            </Box>

            <Footer />
        </div>
    );
};

export default ResetPassword;