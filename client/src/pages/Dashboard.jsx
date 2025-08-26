import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import Heading from '../components/Heading';
import axios from 'axios';
import Alert from '@mui/material/Alert';

const Dashboard = () => {

    const navigate = useNavigate();

    // State variable which tracks whether the token check was completed, eliminating the issue of the page flashing up before the
    // token check is done
    const [authChecked, setAuthChecked] = useState(false);

    // State variable that shows error alerts, if something isn't right.
    const [errorMessage, setErrorMessage] = useState("");

    // State variable that stores the user's first name
    const [userFirstName, setUserFirstName] = useState("");

    // Checking whether the token is present - if it is there a token, we set authChecked to true, meaning that the page can
    // be displayed. If no token is present, we will redirect to the homepage, as the user is not logged in and shouldn't be
    // able to access the dashboard.
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setAuthChecked(true);

            // Make an API GET call to retrieve the user's first name, passing the token to the backend. This is needed so we can
            // personalise the heading by using the user's first name.
            const getUserFirstName = async () => {

                // Attempt to make a GET request to retrieve the user's first name from the backend (supplying the user token)
                try {
                    // Making a GET request (passing the user token for authentication) and retrieving the user's first name
                    const userFirstName = await axios.get("http://localhost:4000/api/profileManagement/getUserFirstName", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    // Clearing any previous alert messages from the page.
                    setErrorMessage("");

                    // If the user's first name was successfully retrieved, we will populate the heading with the user's first name
                    if (userFirstName.status === 200) {
                        setUserFirstName(userFirstName.data.data.first_name);
                    }
                }

                // If an error was encountered when retrieving the user details, we will display the relevant error message
                // on the page.
                catch (error) {
                    // If the error was either 404 or 500, it will show the specific error in question
                    if (error.status === 400 || error.status === 500) {
                        setErrorMessage(error.response.data.message);

                        return;
                    }

                    // If it is a unknown error, we will just display a generic error message on the page.
                    else {
                        setErrorMessage("Error encountered.")

                        return;
                    }
                }
            };

            // Calling the function to retrieve the user's first name
            getUserFirstName();

        }

        else {
            navigate("/");
        }
    }, [navigate]);

    // If the token check indicates that there is no token, we will not allow the displaying of the dashboard.
    if (!authChecked) {
        return null;
    }

    let errorAlert;

    // If the backend returns a failure message, we will display the error alert.
    if (errorMessage) {
        errorAlert = (
            <Alert variant="filled" severity="error" sx={{ width: "50%", margin: "0 auto", mt: 5 }}>
                { errorMessage }
            </Alert>
        );
    }

    return (
        <div>
            <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
                <Navbar />

                { errorAlert }

                <Heading
                    text={`Good morning, ${userFirstName}`}

                    variant="h6"

                    align="center"

                    sx={{ mt: 5 }}
                />

                <Box>
                </Box>
            </Box>
        </div>
    );
}

export default Dashboard;