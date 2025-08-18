import Heading from "./Heading";
import Paragraph from "./Paragraph";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';


const Footer = () => {
    return (
        <Box sx={{ backgroundColor: "#343a40", color: "#ffffff", mt: 20 }}>

            <br />
            
            <Heading 
                text="Crypt Journal"

                variant="h5"

                align="center"

            />
            
            <Box display="flex" justifyContent="center" gap= {6} sx={{ mt: 3 }} >
                <Link href="#" color="#ffffff">
                    Customer Support
                </Link>

                <Link
                    component={RouterLink}
                    to="/privacy_policy"
                    color="#ffffff"
                >
                    Privacy Policy
                </Link>

                <Link
                    component={RouterLink}
                    to="/terms_and_conditions"
                    color="#ffffff"
                >
                    Terms & Conditions
                </Link>
            </Box>

            <Paragraph 
                variant="body1"

                align="center"

                sx={{ mt: 3 }}
            >
                @ 2025 Crypt Journal. All rights reserved.
            </Paragraph>

            <br />

        </Box>
    );
};

export default Footer;