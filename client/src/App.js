import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ForgotPassword from './pages/ForgotPassword';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/terms_and_conditions" element={<TermsAndConditions />} />
        <Route path="/privacy_policy" element={<PrivacyPolicy />} />
        <Route path="/reset_password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
