import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./components/ui/sidebar";


import LoginPage from "./features/auth/pages/LoginPage";
import SignupPage from "./features/auth/pages/SignupPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerificationPage from "./features/auth/pages/VerificationPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutusPage";
import ContactUsPage from "./pages/ContactusPage";
import ProfilePage from "./pages/ProfilePages";
import MySavedPost from "./pages/MySavedPost";
import MyPost from "./pages/MyPost";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetails from "./pages/PostDetails";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <SidebarProvider>
            <Routes>
              {/* Public routes with AuthLayout */}
              <Route
                path="/login"
                element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthLayout>
                    <SignupPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <AuthLayout>
                    <ForgotPasswordPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/verify-code"
                element={
                  <AuthLayout>
                    <VerificationPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <AuthLayout>
                    <ResetPasswordPage />
                  </AuthLayout>
                }
              />

              {/* Main routes with MainLayout */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                }
              />
              <Route
                path="/aboutUs"
                element={
                  <MainLayout>
                    <AboutUsPage />
                  </MainLayout>
                }
              />
              <Route
                path="/contactUs"
                element={
                  <MainLayout>
                    <ContactUsPage />
                  </MainLayout>
                }
              />
              {/* Protected routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ProfilePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posts/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PostDetails />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-posts"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MyPost />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <MySavedPost />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-post"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreatePostPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route
                path="*"
                element={
                  <MainLayout>
                    <HomePage />
                  </MainLayout>
                }
              />
            </Routes>
          </SidebarProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
