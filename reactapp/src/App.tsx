import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./components/ui/sidebar";

import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerificationPage from "./features/auth/pages/VerificationPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";

import HomePage from "./pages/HomePage";
import PostDetails from "./pages/PostDetails";
import MyPost from "./pages/MyPost";
import { SearchProvider } from "./context/SearchContext";
import SearchResults from "./pages/SearchResults";

import AboutUsPage from "./pages/AboutusPage";
import ContactUsPage from "./pages/ContactusPage";
import ProfilePage from "./pages/ProfilePages";
import CreatePostPage from "./pages/CreatePostPage";
import AuthLayout from "./components/layout/AuthLayout";
import MainLayout from "./components/layout/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import SignupPage from "./features/auth/pages/SignUpPage";
import SavedPage from "./pages/SavedPage";
import MySavedPost from "./pages/MySavedPost";
import { SavedProvider } from "@/context/SavedContext";
import { PostProvider } from "@/context/PostContext";
import UserProfilePage from "./pages/UserProfilePage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <SidebarProvider>
            <SearchProvider>
              <PostProvider>
                <SavedProvider>
                  <Routes>
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

                    <Route
                      path="/"
                      element={
                        <MainLayout>
                          <HomePage />
                        </MainLayout>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <MainLayout>
                          <SearchResults />
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
                      path="/otherProfile/:id"
                      element={
                        <ProtectedRoute>
                          <MainLayout>
                            <UserProfilePage />
                          </MainLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/posts/:id"
                      element={
                        <MainLayout>
                          <PostDetails />
                        </MainLayout>
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
                            <SavedPage />
                          </MainLayout>
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/saved/:id"
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

                    <Route
                      path="*"
                      element={
                        <MainLayout>
                          <HomePage />
                        </MainLayout>
                      }
                    />
                  </Routes>
                </SavedProvider>
              </PostProvider>
            </SearchProvider>
          </SidebarProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
