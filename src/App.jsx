import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Login from './components/Login';
import VerificationCode from './components/VerificationCode';
import ProtectedRoute from './components/ProtectedRoute';

import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col h-screen">
          <Toaster
            position="top-center"
            toastOptions={{
              success: {
                style: {
                  background: '#4CAF50',
                  color: 'white',
                },
              },
              error: {
                style: {
                  background: '#EF4444',
                  color: 'white',
                },
              },
              duration: 3000,
            }}
          />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/password-reset" element={<VerificationCode />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
