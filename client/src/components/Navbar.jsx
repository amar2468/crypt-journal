import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import HomeIcon from '@mui/icons-material/Home';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

const Navbar = () => {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsLoggedIn(true);
        }
        else {
            setIsLoggedIn(false);
        }
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" color="transparent" sx={{ backgroundColor: "#FAF9F6" }}>
                <Toolbar display="flex">
                    <Box>
                        <Tooltip title="Home">
                            <Button color="inherit" onClick={() => navigate('/')}>
                                <HomeIcon />
                            </Button>
                        </Tooltip>
                    </Box>

                    <Typography variant="h5" align="center" component="div" sx={{ flexGrow: 1, display: { xs: "none", sm: "block"} }}>
                        Crypt Journal
                    </Typography>

                    <Box>
                        <Tooltip title="Customer Support">
                            <Button color="inherit">
                                <SupportAgentIcon />
                            </Button>
                        </Tooltip>

                        {!isLoggedIn && (
                            <> 
                                <Tooltip title="Sign Up/Register">
                                    <Button color="inherit" onClick={() => navigate('/auth?mode=sign_up')}>
                                        <PersonAddIcon />
                                    </Button>
                                </Tooltip>

                                <Tooltip title="Login">
                                    <Button color="inherit" onClick={() => navigate('/auth?mode=sign_in')}>
                                        <LoginIcon />
                                    </Button>
                                </Tooltip>
                            </>
                        )}

                        {isLoggedIn && (
                            <>
                            <Tooltip title="Logout">
                                <Button color="inherit" onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate('/auth?mode=sign_in');
                                }}>
                                    <LogoutIcon />
                                </Button>
                            </Tooltip>
                            
                            <Tooltip title="Account Settings">
                                <Button color="inherit" onClick={() => navigate('/settings')}>
                                    <SettingsIcon />
                                </Button>
                            </Tooltip>
                            
                            </>
                        )}
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;