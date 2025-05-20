import Heading from "./Heading";
import Paragraph from "./Paragraph";
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';


const Footer = () => {
    return (
        <Box width="100%" sx={{ backgroundColor: "#343a40", color: "#ffffff", mt: 10 }}>

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

                <Link href="#" color="#ffffff">
                    Privacy Policy
                </Link>

                <Link href="#" color="#ffffff">
                    Terms & Conditions
                </Link>
            </Box>

            <Paragraph 
                text="@ 2025 Crypt Journal. All rights reserved."
                
                variant="body1"

                align="center"

                sx={{ mt: 3 }}
            />

            <br />

        </Box>
    );
};

export default Footer;