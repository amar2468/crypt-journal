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

const Settings = () => {
    const navigate = useNavigate();

    // State variable which represents the menu tab number (account info (0), preferences (1), delete your account (2))
    const [tabNumber, setTabNumber] = useState(0);

    // State variable representing if the user is authorised to view this page.
    const [authChecked, setAuthChecked] = useState(false);

    // State variable which represents the timezone
    const [timezone, setTimezone] = useState("Europe/Dublin");

    // State variable which represents the date format
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

    // State variable for the account information form, which will change depending on the specific user info.
    const [accountInfoForm, setAccountInfoForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        mfaEnabled: false
    });

    // State variable that shows success alerts
    const [successMessage, setSuccessMessage] = useState("");

    // State variable that shows error alerts, if something isn't right.
    const [errorMessage, setErrorMessage] = useState("");

    // State variable that holds the state of the "Account Information" button, to see if it is enabled or disabled.
    const [isAccInfoBtnDisabled, setIsAccInfoBtnDisabled] = useState(true);

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
            
            // Make an API GET call to retrieve the user details, passing the token to the backend.
            const getUserData = async () => {
                const userDetails = await axios.get("http://localhost:4000/api/profileManagement/getUserAccountInfo", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

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

                // If the user couldn't be found, we will display that message to the user
                else if (userDetails.status === 404) {
                    setErrorMessage("Your user account information couldn't be found. Please raise this request with our support team.");
                    
                    return;
                }

                // If there was an internal server error, we will display that message to the user.
                else if (userDetails.status === 500) {
                    setErrorMessage("Internal server error - Please raise this request with our support team.");

                    return;
                }
            };

            // After we check to see that the user is authorised, we will call the function above that makes the API call.
            getUserData();
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

        // If the change was made to everything excluding the MFA, we will update it with the new info.
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
        if ((trimmedPhoneNumber.length !== 0) && !(sameDigitRegex.test(trimmedPhoneNumber))) {
            setErrorMessage("Phone number cannot be all the same digit.");

            return;
        }

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
            // Set the success message
            setErrorMessage(err.response.message);

            // After 1 second, clear the success message, as the user knows that the account information has been updated.
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
            <Box position="absolute" display="flex">
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

            {tabNumber === 0 && (
                <>
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

                    { errorAlert }

                    { successAlert }

                    <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 3, mx: "auto" }}>
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

                            value={accountInfoForm.mfaEnabled}

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

                    <Footer />
                </>
            )}

            {tabNumber === 1 && (
                <>
                    <Navbar />

                    <Heading
                        text="Preferences"

                        variant="h5"

                        align="center"

                        sx={{ mt: 15 }}
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

                    <Box display="flex" justifyContent="center" flexDirection="column" width="30%" sx={{ mt: 3, mx: "auto" }}>
                        <Select
                            value={timezone}

                            onChange={(e) => setTimezone(e.target.value)}

                            sx={{ mt: 3 }}
                        >
                            {timezones.map((tz) => (
                                <MenuItem key={tz} value={tz}>
                                    {tz}
                                </MenuItem>
                            ))}
                        </Select>

                        <Select value={dateFormat} onChange={(event) => setDateFormat(event.target.value)} sx={{ mt: 3 }}>
                            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                        </Select>
                        
                        <FormControlLabel control={<Switch />} label="Enable Autosave" sx={{ mt: 3 }} />

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
                </>
            )}

            {tabNumber === 2 && (
                <>
                    <Navbar />
                    
                    <Heading
                        text="Delete Your Account"
                        
                        variant="h5"

                        align="center"

                        sx={{ mt: 15 }}
                    />

                    <Paragraph
                        variant="body1"

                        align="center"

                        sx={{ mt: 5 }}
                    >
                        Deleting your account will delete all the existing entries that you have.
                        <br /> Please be aware that we cannot recover anything, if you decide to delete this account.
                    </Paragraph>

                    <Box display="flex" alignContent="center" flexDirection="column" width="30%" sx={{ mt: 3, mx: "auto" }}>
                        <CustomButton
                            variant="contained"

                            color="secondary"

                            size="large"

                            sx={{ mt: 3 }}
                        >
                            Delete Your Account
                        </CustomButton>
                    </Box>

                    <Footer />
                </>
            )}

        </div>
    );
};

export default Settings;