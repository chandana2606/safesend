import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AppProvider } from './context/AppContext';
import BottomNav from './components/BottomNav';
import HomeDashboard from './pages/Home';
import SendMoney from './pages/SendMoney';
import ConfirmPayment from './pages/ConfirmPayment';
import BillPayments from './pages/BillPayments';
import JarSavings from './pages/JarSavings';
import Profile from './pages/Profile';
import ScanAndPay from './pages/ScanAndPay';
import SelfTransfer from './pages/SelfTransfer';
import MobileRecharge from './pages/MobileRecharge';
import History from './pages/History';
import ManageBanks from './pages/ManageBanks';
import SecuritySettings from './pages/SecuritySettings';
import Login from './pages/Login';
import { useAppContext } from './context/AppContext';
import './App.css';

function AppContent() {
  const { isLoggedIn } = useAppContext();

  if (!isLoggedIn) {
    return (
      <div className="app-container">
        <Login />
        <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in">
      <div className="content-area">
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path="/confirm" element={<ConfirmPayment />} />
          <Route path="/jar" element={<JarSavings />} />
          <Route path="/bills" element={<BillPayments />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/scan" element={<ScanAndPay />} />
          <Route path="/transfer/self" element={<SelfTransfer />} />
          <Route path="/recharge" element={<MobileRecharge />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile/banks" element={<ManageBanks />} />
          <Route path="/profile/security" element={<SecuritySettings />} />
        </Routes>
      </div>
      <BottomNav />
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
