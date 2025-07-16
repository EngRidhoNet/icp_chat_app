import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth'; // Add useAuth import
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OTPVerification from './components/Auth/OTPVerification';
import ChatContainer from './components/Chat/ChatContainer';
import './styles/globals.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <>
            <Route path="/chat" element={<ChatContainer />} />
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/login" element={<Navigate to="/chat" replace />} />
            <Route path="/register" element={<Navigate to="/chat" replace />} />
            <Route path="/verify-otp" element={<Navigate to="/chat" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<OTPVerification />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/chat" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;