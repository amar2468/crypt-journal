import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useState } from 'react';

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
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Button color="inherit" onClick={() => navigate('/')}>
                            Crypt Journal
                        </Button>
                    </Typography>

                    <Button color="inherit">
                        Customer Support
                    </Button>

                    {!isLoggedIn && (
                        <>
                            <Button color="inherit" onClick={() => navigate('/auth?mode=sign_up')}>
                                Sign Up
                            </Button>

                            <Button color="inherit" onClick={() => navigate('/auth?mode=sign_in')}>
                                Login
                            </Button>
                        </>
                    )}

                    {isLoggedIn && (
                        <Button color="inherit" onClick={() => {
                            localStorage.removeItem("token");
                            navigate('/auth?mode=sign_in');
                        }}>
                            LogOut
                        </Button>
                    )}

                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;