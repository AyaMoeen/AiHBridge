<<<<<<< Updated upstream
<<<<<<< Updated upstream
import "./App.css";
import SingUp from "./pages/SingUp";

function App() {
  return (
    < >
      <SingUp />
    </>
  );
}

export default App;
=======
import { AuthStatus } from './components/common/AuthStatus';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import VerificationPage from './features/auth/pages/VerificationPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';

// Temporary placeholder components until you create them
const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">AiHBridge - Home Page</h1>
      <p className="mt-4">Welcome to the AI tools platform!</p>

      {isAuthenticated && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name}!</h2>
          <AuthStatus />
        </div>
      )}
    </div>
  );
};

const RegisterPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Register Page</h1>
    <p className="mt-4">Registration form coming soon...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-code" element={<VerificationPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
>>>>>>> Stashed changes
=======
import { AuthStatus } from './components/common/AuthStatus';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import VerificationPage from './features/auth/pages/VerificationPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';

// Temporary placeholder components until you create them
const HomePage = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">AiHBridge - Home Page</h1>
      <p className="mt-4">Welcome to the AI tools platform!</p>

      {isAuthenticated && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name}!</h2>
          <AuthStatus />
        </div>
      )}
    </div>
  );
};

const RegisterPage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">Register Page</h1>
    <p className="mt-4">Registration form coming soon...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-code" element={<VerificationPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
>>>>>>> Stashed changes
