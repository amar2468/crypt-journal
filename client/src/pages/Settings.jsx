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

    const [accountInfoForm, setAccountInfoForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        mfaEnabled: false
    });

    // State variable that shows error alerts, if something isn't right.
    const [errorMessage, setErrorMessage] = useState("");

    // State variable that holds the state of the "Account Information" button, to see if it is enabled or disabled.
    const [isAccInfoBtnDisabled, setIsAccInfoBtnDisabled] = useState(true);

    // When the page is loaded, we will retrieve the user's token and make an API call to the backend,
    // to retrieve the user's information and populate the settings page with those details.
    useEffect(() => {
        // Retrieve the token from localStorage (set after login)
        const token = localStorage.getItem("token");
        
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

        // If the user is not authorised, we will redirect to the main page.
        else {
            navigate("/")
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

    const submitAccountInfoForm = async () => {
        
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

    // If an error message was detected, it will be displayed in the form of an alert message.
    if (errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { errorMessage }
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