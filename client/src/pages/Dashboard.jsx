import Navbar from '../components/Navbar';
import Box from '@mui/material/Box';
import Footer from '../components/Footer';

const Dashboard = () => {

    return (
        <div>
            <Box display="flex" flexDirection="column" sx={{ minHeight: "100vh" }}>
                <Navbar />

                <Box>
                    
                </Box>

                <Footer />
            </Box>
        </div>
    );
}

export default Dashboard;