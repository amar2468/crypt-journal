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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const Settings = () => {
    // State variable which represents the menu tab number (account info (0), preferences (1), delete your account (2))
    const [tabNumber, setTabNumber] = useState(0);

    // State variable which represents the timezone
    const [timezone, setTimezone] = useState("Europe/Dublin");

    // State variable which represents the date format
    const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");

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

                            sx={{ mt: 3 }}
                        />

                        <CustomInputField
                            label="Last Name"

                            variant="outlined"

                            type="text"

                            sx={{ mt: 3 }}
                        />

                        <CustomInputField
                            label="Email"

                            variant="outlined"

                            type="email"

                            sx={{ mt: 3 }}
                        />

                        <CustomInputField
                            label="Phone Number"

                            variant="outlined"

                            type="tel"

                            sx={{ mt: 3 }}
                        />

                        <FormControlLabel control={<Switch />} label="Enable Multi-Factor Authentication (MFA)" sx={{ mt: 3 }} />

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