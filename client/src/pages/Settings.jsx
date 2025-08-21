import Navbar from '../components/Navbar';
import Heading from '../components/Heading';
import CustomInputField from '../components/CustomInputField';
import CustomButton from '../components/CustomButton';
import Box from '@mui/material/Box';
import Footer from '../components/Footer';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paragraph from '../components/Paragraph';
import { useState } from 'react';
import { useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import { jwtDecode } from "jwt-decode";
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';

const Settings = () => {
    const navigate = useNavigate();

    // State variable which represents the menu tab number (account info (0), preferences (1), delete your account (2))
    const [tabNumber, setTabNumber] = useState(0);

    // State variable representing if the user is authorised to view this page.
    const [authChecked, setAuthChecked] = useState(false);

    // State variable for the account information form, which will change depending on the specific user info.
    const [accountInfoForm, setAccountInfoForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        mfaEnabled: false
    });

    // State variable for user preferences form, which will change depending on the specific user info
    const [userPreferencesForm, setUserPreferencesForm] = useState({
        timezone: '',
        dateFormat: '',
        enableAutosave: false
    });

    // Variable that will indicate whether the "delete account" modal is presented or not.
    const [deleteAccountPrompt, setDeleteAccountPrompt] = useState(false);

    // If the initial button to delete the account is clicked, this will change the value of the "deleteAccountPrompt" state variable,
    // indicating that the modal should be displayed, which will ask the user to confirm the deletion.
    const openDeleteAccountPrompt = () => {
        setDeleteAccountPrompt(true);
    }

    // If the user clicks the "cancel" button in the modal, it will just change the value of the "deleteAccountPrompt" state variable,
    // indicating that the modal should be closed.
    const closeDeleteAccountPrompt = () => {
        setDeleteAccountPrompt(false);
    }

    // If the user confirms the deletion of the account (by clicking on the delete button in the modal), we will make a DELETE request
    // and display the outcome of the operation to the user.
    const deleteAccount = async () => {
        // Try to make a DELETE call to the node.js route, in order to delete the account
        try {
            // Retrieving the current user token
            const token = localStorage.getItem("token");

            // Make a DELETE request, passing the node.js route, which will attempt to delete the user account.
            const deleteAccountRequest = await axios.delete("http://localhost:4000/api/profileManagement/deleteAccount", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Clearing any previous alert messages from the page.
            setErrorMessage("");
            setSuccessMessage("");

            // If the user record was deleted, we will inform the user about it.
            if (deleteAccountRequest.status === 200) {
                setSuccessMessage(deleteAccountRequest.data.message);

                // Disabling the "delete" and "cancel" buttons that appear in the modal, as the request is being processed.
                setDisableModalButtons(true);

                // After deleting the account and display the message to the user, wait 1 second and redirect to the homepage.
                setTimeout(() => {
                    localStorage.removeItem("token");
                    navigate('/');
                }, 1000);

                return;
            }

        }

        // If there was issue when deleting the user account, display the message in the form of an alert.
        catch (error) {
            if (error.status === 500) {
                setErrorMessage(error.response.data.message);

                // Re-enabling the "delete" and "cancel" buttons that appear in the modal, as there was an issue with the request.
                setDisableModalButtons(false);

                return;
            }
        }
    }

    // State variable that shows success alerts
    const [successMessage, setSuccessMessage] = useState("");

    // State variable that shows error alerts, if something isn't right.
    const [errorMessage, setErrorMessage] = useState("");

    // State variable that holds the state of the "Account Information" button, to see if it is enabled or disabled.
    const [isAccInfoBtnDisabled, setIsAccInfoBtnDisabled] = useState(true);

    // State variable that holds the state of the "Preferences" button, to see if it is enabled or disabled.
    const [isPreferencesBtnDisabled, setIsPreferencesBtnDisabled] = useState(true);

    // State variable that holds the state of the modal buttons, to see if they are enabled or disabled.
    const [disableModalButtons, setDisableModalButtons] = useState(false);

    // When the page is loaded, we will retrieve the user's token and make an API call to the backend,
    // to retrieve the user's information and populate the settings page with those details.
    useEffect(() => {

        // Function checks if the token has expired by comparing the token expiry date with the current date.
        const isTokenExpired = (token) => {
            try {
                const decoded = jwtDecode(token);

                const currentTime = Date.now() / 1000;

                return decoded.exp < currentTime;
            }

            // If the token has expired, return true.
            catch {
                return true;
            }
        };

        // Retrieve the token from localStorage (set after login)
        const token = localStorage.getItem("token");

        // If the token has expired, we will display an error message and remove the token. Finally, the user will be
        // redirected to the login page.
        if (isTokenExpired(token)) {
            setErrorMessage("Session expired. You have been logged out automatically. Please log on again.");

            localStorage.removeItem("token");

            // After 2 seconds, navigate to the login page.
            setTimeout(() => {
                navigate("/auth?mode=sign_in");
            }, 2000);
        }
        
        // If the token exists for this user, proceed with the needful.
        if (token) {
            // Setting this to true means that we can show the contents of this page to the user (user is authorised.)
            setAuthChecked(true);
            
            // Make an API GET call to retrieve the user details, passing the token to the backend. Once user details are retrieved,
            // we will populate the account information with the current user information.
            const getUserData = async () => {

                // Attempt to make a GET request to retrieve the user details from the backend (supplying the user token), and 
                // populate the current user account information in the form
                try {
                    // Making a GET request (passing the user token for authentication) and retrieving the user details
                    const userDetails = await axios.get("http://localhost:4000/api/profileManagement/getUserAccountInfo", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // Clearing any previous alert messages from the page.
                    setErrorMessage("");

                    // If the user information was successfully retrieved, we will update the form with those details
                    if (userDetails.status === 200) {
                        // Populate the account information form with the details for this specific user (retrieved from the API call above.)
                        setAccountInfoForm(prev => ({
                            ...prev,
                            firstName: userDetails.data.data.first_name,
                            lastName: userDetails.data.data.last_name,
                            email: userDetails.data.data.email,
                            phoneNumber: userDetails.data.data.phone_number,
                            mfaEnabled: userDetails.data.data.mfa_enabled
                        }));
                    }
                }

                // If an error was encountered when retrieving the user details, we will display the relevant error message on the page.
                catch (error) {

                    // If the error was either 404 or 500, it will show the specific error in question
                    if (error.status === 404 || error.status === 500) {
                        setErrorMessage(error.response.data.message);

                        return;
                    }

                    // If it is a unknown error, we will just display a generic error message on the page.
                    else {
                        setErrorMessage("Error encountered.");

                        return;
                    }
                }
            };

            // Attempt to get the user preferences information and populate the form with the current user preferences.
            const getUserPreferencesData = async() => {
                // Try to make a GET request to get the user preferences. If successful, we will populate the user preferences
                // form with the latest user preferences.
                try {
                    // Performing a GET request to retrieve the user preferences from the backend, passing the user token in the request
                    const userPreferences = await axios.get("http://localhost:4000/api/profileManagement/getUserPreferences", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    
                    // If the user preferences were retrieved successfully, we will populate the user preferences form with the
                    // current user preferences
                    if (userPreferences.status === 200) {
                        setUserPreferencesForm(prev => ({
                            ...prev,
                            timezone: userPreferences.data.data.timezone,
                            dateFormat: userPreferences.data.data.date_format,
                            enableAutosave: userPreferences.data.data.enable_autosave
                        }));
                    }
                }

                // If there was an error when retrieving the user preferences, we will display the relevant error message on the page
                catch (error) {
                    // If the error was either 404 or 500, it will show the specific error in question
                    if (error.status === 401 || error.status === 404 || error.status === 500) {
                        setErrorMessage(error.response.data.message);

                        return;
                    }

                    // If it is a unknown error, we will just display a generic error message on the page.
                    else {
                        setErrorMessage("Error encountered.");

                        return;
                    }
                }
            };

            // Calling the user data function to retrieve the current user account details
            getUserData();

            // Calling the user preferences function to retrieve the current user preferences
            getUserPreferencesData();
        }

    }, [navigate]);

    // If the user is not authorised, do not show anything on the page.
    if (!authChecked) {
        return null;
    }

    // When an update is made to the account information form, this will be executed.
    const updateAccountInfoForm = (event) => {
        // Getting the field name that was updated
        const name = event.target.name;

        // Getting the field value that was updated.
        const value = event.target.value;
        
        // Checking to see if MFA is enabled
        const mfaIsEnabled = event.target.checked;

        // If the change was to the MFA, we will update the MFA toggle with the new info.
        if (event.target.type === "checkbox") {
            setAccountInfoForm(prev => ({
                ...prev,
                [name]: mfaIsEnabled
            }));
        }

        // If the change was made to anything excluding the MFA, we will update it with the new info.
        else {
            setAccountInfoForm(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Re-enable the button, as a change was made to the account information.
        setIsAccInfoBtnDisabled(false);
    };

    // Function that checks the "Account Information" form and submits it to the backend, if all the checks pass successfully.
    const submitAccountInfoForm = async () => {
        // Clearing any error alerts that may be shown on the page.
        setErrorMessage("");

        // Removing leading and trailing spaces from the "first name".
        const trimmedFirstName = accountInfoForm.firstName.trim();

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
        setAccountInfoForm(prev => ({
            ...prev,
            firstName: trimmedFirstName
        }));

        // Removing leading and trailing spaces from the "last name".
        const trimmedLastName = accountInfoForm.lastName.trim();

        // If the "last name" field is empty, we will stop the form submission.
        if (!(trimmedLastName)) {
            setErrorMessage("Last name cannot be empty! Enter a valid last name.");

            return;
        }

        // If the "last name" length is less than 2 or greater than 50, we will stop the form submission.
        if (trimmedLastName.length < 2 || trimmedLastName.length > 50) {
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
        setAccountInfoForm(prev => ({
            ...prev,
            lastName: trimmedLastName
        }));

        // Removing leading and trailing spaces from the "email".
        const trimmedEmail = accountInfoForm.email.trim();

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
        setAccountInfoForm(prev => ({
            ...prev,
            email: trimmedEmail
        }));

        // Removing leading and trailing spaces from the "phone number"
        const trimmedPhoneNumber = accountInfoForm.phoneNumber.trim();

        // If the "phone number" length is less than or equal to 7 or greater than 15, we will stop the form submission.
        // It allows the phone number to be blank.
        if ((trimmedPhoneNumber.length !== 0) && (trimmedPhoneNumber.length <= 7 || trimmedPhoneNumber.length > 15)) {
            setErrorMessage("Phone number must be between 8 and 15 characters, or left blank");

            return;
        }

        // Basic "phone number" format regex: Allows digits, plus sign, dashes, and brackets
        const validCharactersPhone = /^[+]?[\d\s\-()]+$/;

        // If the phone number is not compliant with the above regex
        if ((trimmedPhoneNumber.length !== 0) && !(validCharactersPhone.test(trimmedPhoneNumber))) {
            setErrorMessage("Please enter a valid phone number.");

            return;
        }

        // Regex that will detect if all the digits are the same e.g. 11111 or 22222
        const sameDigitRegex = /^(\d)\1+$/;

        // If the phone number consists of the same digit, we will stop the form submission.
        if ((trimmedPhoneNumber.length !== 0) && (sameDigitRegex.test(trimmedPhoneNumber))) {
            setErrorMessage("Phone number cannot be all the same digit.");

            return;
        }

        // Updating the "phone number" form field with the trimmed version of it.
        setAccountInfoForm(prev => ({
            ...prev,
            phoneNumber: trimmedPhoneNumber
        }));

        // Retrieve the current value of the "MFA" toggle, to see if it has been enabled or disabled.
        const mfa_enabled = accountInfoForm.mfaEnabled;

        // If "MFA" has been enabled, but the phone number is empty, we will stop the form submission. The phone number is required,
        // in order to set the MFA.
        if (mfa_enabled === true && !(trimmedPhoneNumber)) {
            setErrorMessage("You must enter your phone number, if you want to enable MFA.");

            return;
        }

        // Attempt to make an API call to the backend "editAccountInformation" route, passing the form data
        // This will attempt to update the user account information.
        try {
            const token = localStorage.getItem("token");

            const res = await axios.post("http://localhost:4000/api/profileManagement/editAccountInformation", accountInfoForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Clearing success and error alerts, as we want the new ones to be displayed.
            setSuccessMessage("");
            setErrorMessage("");

            // If the account information updated successfully, we will inform the user about it using a success alert.
            if (res && res.status === 200) {
                // Set the success message
                setSuccessMessage(res.data.message);

                // After 1 second, clear the success message, as the user knows that the account information has been updated.
                setTimeout(() => {
                    setSuccessMessage("");
                }, 1000);

                return;
            }
        }

        // If we encounter an error when updating the account information, we will display the error alert.
        catch (err) {
            // Set the error message
            setErrorMessage(err.response.message);

            // After 1 second, clear the error message, as the user knows that the account information has been updated.
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);

            return;
        }

    };

    // When an update is made to the user preferences form, this will be executed.
    const updateUserPreferencesForm = (event) => {
        // Getting the field name that was updated
        const name = event.target.name;

        // Getting the field value that was updated.
        const value = event.target.value;

        // Checking to see if autosave is enabled
        const autosaveIsEnabled = event.target.checked;

        // If the change was to the autosave, we will update the autosave toggle with the new info.
        if (event.target.type === "checkbox") {
            setUserPreferencesForm(prev => ({
                ...prev,
                [name]: autosaveIsEnabled
            }));
        }

        // If the change was made to anything excluding the autosave, we will update it with the new info.
        else {
            setUserPreferencesForm(prev => ({
                ...prev,
                [name]: value
            }))
        }

        // Re-enabling the preferences button
        setIsPreferencesBtnDisabled(false);
    };

    // Function that submits the "User Preferences" data to the backend. If it is successful, a success alert will be displayed
    const submitUserPreferences = async() => {
        // Attempt to make an API call to the backend "editUserPreferences" route, passing the form data
        // This will attempt to update the user preferences
        try {
            // Retrieving the current user token, so that it can be passed to the backend, in order to verify that the
            // user is authenticated.
            const token = localStorage.getItem("token");

            // Making a POST request to submit the updated user preferences. The user token is passed in the request.
            const res = await axios.post("http://localhost:4000/api/profileManagement/editUserPreferences", userPreferencesForm, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Clearing success and error alerts, as we want the new ones to be displayed.
            setSuccessMessage("");
            setErrorMessage("");

            // If the request was successful, we will display the success alert and clear it after 1 second.
            if (res && res.status === 200) {
                // Set the success alert
                setSuccessMessage(res.data.message);

                // After 1 second, clear the success alert, as the user knows that the user preferences have been updated.
                setTimeout(() => {
                    setSuccessMessage("");
                }, 1000);

                return;
            }
        }

        // If we encounter an error when updating the user preferences, we will display the error alert and clear it after 1 second
        catch (err) {
            // Set the error alert
            setErrorMessage(err.response.message);

            // After 1 second, clear the error alert, as the user knows that an error was encountered.
            setTimeout(() => {
                setErrorMessage("");
            }, 1000);

            return;
        }
    };

    // Most common timezones added into the list
    const timezones = [
        'UTC',
        'GMT',
        'Europe/London',
        'Europe/Dublin',
        'Europe/Berlin',
        'America/New_York',
        'America/Los_Angeles',
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Australia/Sydney',
    ];

    // Function that will update the tab number state variable, when we move to a different tab.
    const handleChange = (event, newTabNumber) => {
        setTabNumber(newTabNumber);
    };

    // Generates accessibility (a11y) props for each tab,
    // assigning unique IDs and ARIA controls for screen readers.
    const a11yProps = (tabIndex) => {
        return {
            id: `vertical-tab-${tabIndex}`,
            'aria-controls': `vertical-tabpanel-${tabIndex}`,
        };
    };

    let errorAlert;

    // If the backend returns a failure message, we will display the error alert.
    if (errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { errorMessage }
            </Alert>
        );
    }

    let successAlert;

    // If the backend returns a success message, we will display the success alert.
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

            <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", mt: 10 }}>

                <Box
                    sx={{
                        display: "flex",
                        flex: 1
                    }}
                >

                    <Box
                        sx={{
                            width: 240,
                            p: 2,
                            borderRight: "1px solid #ddd",
                            flexShrink: 0
                        }}
                    >
                        <Tabs
                            orientation="vertical"

                            value={tabNumber}

                            onChange={handleChange}

                            aria-label="User settings - options"
                        >
                            <Tab label="Account Information" {...a11yProps(0)}></Tab>
                            <Tab label="Preferences" {...a11yProps(1)}></Tab>
                            <Tab label="Delete Your Account" {...a11yProps(2)}></Tab>
                        </Tabs>
                    </Box>

                    <Box 
                        sx={{
                            flex: 1,
                            p: 2
                        }}
                    >

                        {tabNumber === 0 && (
                            <>
                                <Heading
                                    text="Account Information"

                                    variant="h5"

                                    align="center"
                                />

                                <Paragraph
                                    variant="body1"

                                    align="center"

                                    sx={{ mt: 5 }}
                                >
                                    Update your account information below to keep your profile accurate and up to date.
                                </Paragraph>

                                { errorAlert }

                                { successAlert }

                                <Box display="flex" justifyContent="center" flexDirection="column" sx={{ mt: 3, mx: "auto" }}>
                                    <CustomInputField
                                        label="First Name"

                                        variant="outlined"

                                        type="text"

                                        name="firstName"

                                        value={accountInfoForm.firstName}

                                        onChange={updateAccountInfoForm}

                                        sx={{ mt: 3 }}
                                    />

                                    <CustomInputField
                                        label="Last Name"

                                        variant="outlined"

                                        type="text"

                                        name="lastName"

                                        value={accountInfoForm.lastName}

                                        onChange={updateAccountInfoForm}

                                        sx={{ mt: 3 }}
                                    />

                                    <CustomInputField
                                        label="Email"

                                        variant="outlined"

                                        type="email"

                                        name="email"

                                        value={accountInfoForm.email}

                                        onChange={updateAccountInfoForm}

                                        sx={{ mt: 3 }}
                                    />

                                    <CustomInputField
                                        label="Phone Number"

                                        variant="outlined"

                                        type="tel"

                                        name="phoneNumber"

                                        value={accountInfoForm.phoneNumber}

                                        onChange={updateAccountInfoForm}

                                        sx={{ mt: 3 }}
                                    />

                                    <FormControlLabel
                                    
                                        control={<Switch />}
                                        
                                        label="Enable Multi-Factor Authentication (MFA)"

                                        name="mfaEnabled"

                                        checked={accountInfoForm.mfaEnabled}

                                        onChange={updateAccountInfoForm}
                                        
                                        sx={{ mt: 3 }}
                                        
                                    />

                                    <CustomButton
                                        variant="contained"

                                        color="secondary"

                                        size="large"

                                        sx={{ mt: 3 }}

                                        onClick={submitAccountInfoForm}

                                        disabled = {isAccInfoBtnDisabled}
                                    >
                                        Save
                                    </CustomButton>
                                
                                </Box>
                            </>
                        )}

                        {tabNumber === 1 && (
                            <>

                                <Heading
                                    text="Preferences"

                                    variant="h5"

                                    align="center"
                                />

                                <Paragraph
                                    variant="body1"

                                    align="center"

                                    sx={{ mt: 5 }}
                                >
                                    Adjust your preferences to personalise how the application behaves
                                    and displays information.
                                    
                                    <br /> These settings help create a more tailored
                                    and efficient user experience.
                                </Paragraph>

                                { errorAlert }

                                { successAlert }

                                <Box display="flex" justifyContent="center" flexDirection="column" sx={{ mt: 3, mx: "auto" }}>
                                    <Select
                                        name="timezone"

                                        value={userPreferencesForm.timezone}

                                        onChange={updateUserPreferencesForm}

                                        sx={{ mt: 3 }}
                                    >
                                        {timezones.map((tz) => (
                                            <MenuItem key={tz} value={tz}>
                                                {tz}
                                            </MenuItem>
                                        ))}
                                    </Select>

                                    <Select
                                        name="dateFormat"

                                        value={userPreferencesForm.dateFormat}
                                        
                                        onChange={updateUserPreferencesForm}
                                        
                                        sx={{ mt: 3 }}
                                    >
                                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                                    </Select>
                                    
                                    <FormControlLabel
                                        control={<Switch />}

                                        name="enableAutosave"

                                        checked={userPreferencesForm.enableAutosave}

                                        onChange={updateUserPreferencesForm}
                                        
                                        label="Enable Autosave"
                                        
                                        sx={{ mt: 3 }}    
                                    />

                                    <CustomButton
                                        variant="contained"

                                        color="secondary"

                                        size="large"

                                        onClick={submitUserPreferences}

                                        disabled={isPreferencesBtnDisabled}

                                        sx={{ mt: 3 }}
                                    >
                                        Save
                                    </CustomButton>
                                </Box>
                            </>
                        )}

                        {tabNumber === 2 && (
                            <>
                                <Heading
                                    text="Delete Your Account"
                                    
                                    variant="h5"

                                    align="center"
                                />

                                <Paragraph
                                    variant="body1"

                                    align="center"

                                    sx={{ mt: 5 }}
                                >
                                    Deleting your account will delete all the existing entries that you have.
                                    <br /> Please be aware that we cannot recover anything, if you decide to delete this account.
                                </Paragraph>

                                <Box display="flex" alignContent="center" flexDirection="column" sx={{ mt: 3, mx: "auto", width: {xs: "100%", md: "60%"} }}>
                                    <CustomButton
                                        variant="contained"

                                        color="secondary"

                                        size="large"

                                        sx={{ mt: 3 }}

                                        onClick={openDeleteAccountPrompt}
                                    >
                                        Delete Your Account
                                    </CustomButton>

                                    <Modal
                                        open={deleteAccountPrompt}

                                        onClose={closeDeleteAccountPrompt}

                                        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}

                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box 
                                            sx={{
                                                bgcolor: "#ffffff",
                                                border: "2px solid #000000",
                                                boxShadow: 24,
                                                borderRadius: 2, 
                                                width: "auto",
                                                maxWidth: "50%",
                                                display: "flex",
                                                flexDirection: "column",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <Box sx={{ p: 3, flexGrow: 1}}>
                                                <Typography id="modal-modal-description" variant="h6" component="h2" sx={{ mt: 2 }}>
                                                    Are you sure that you wish to delete your account? Please be aware that we cannot recover anything, if you decide to delete this account.
                                                </Typography>

                                                { errorAlert }

                                                { successAlert }
                                            </Box>

                                            <Box
                                                sx={{
                                                    p: 2,
                                                    display: "flex",
                                                    justifyContent: "flex-start",
                                                    gap: 2,
                                                    borderTop: "1px solid #000000"
                                                }}
                                            >
                                                <CustomButton
                                                    variant="contained"

                                                    color="error"

                                                    size="large"

                                                    onClick={deleteAccount}

                                                    disabled={disableModalButtons}
                                                >
                                                    Delete Account
                                                </CustomButton>

                                                <CustomButton
                                                    variant="contained"

                                                    color="secondary"

                                                    size="large"

                                                    onClick={closeDeleteAccountPrompt}

                                                    disabled={disableModalButtons}
                                                    
                                                >
                                                    Cancel
                                                </CustomButton>
                                            </Box>
                                        </Box>

                                    </Modal>
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>

                
                <Footer />
                
            </Box>

        </div>
    );
};

export default Settings;