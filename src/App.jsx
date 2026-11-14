import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import AuthPage from './Pages/AuthPage';
import ChatPage from './Pages/ChatPage';
import PatientInfo from './Pages/PatientInfo';
import MedicationInfo from './Pages/MedicationInfo';
import LabInfo from './Pages/LabInfo';
import ApointmentBooking from './Pages/ApointmentBooking';

function AppContent() {
  const location = useLocation();
  
  // Routes where navbar should be hidden
  const hideNavbarRoutes = ['/chat', '/auth'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);
  
  // Routes where footer should be hidden
  const hideFooterRoutes = ['/chat', '/auth'];
  const shouldShowFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/patient-info" element={<PatientInfo />} />
        <Route path="/medication-info" element={<MedicationInfo />} />
        <Route path='/lab-info' element={<LabInfo/>} />
        <Route path="/appointments" element={<ApointmentBooking />} />
      </Routes>
      {shouldShowFooter && <Footer />}
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;