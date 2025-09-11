import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import "./index.css";

import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider } from "./components/ui/sidebar";

import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerificationPage from "./features/auth/pages/VerificationPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import PostDetails from "./pages/PostDetails";
import SingUp from "./pages/SingUp";
import MySavedPost from "./pages/MySavedPost";
import MyPost from "./pages/MyPost";
import Header from "./components/Header";
import Rightbar from "./components/RightBar";
import AboutUsPage from "./pages/AboutusPage";
import ContactUsPage from "./pages/ContactusPage";
import ProfilePage from "./pages/ProfilePages";
import CreatePostPage from "./pages/CreatePostPage";
function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex flex-1 p-4">
          <main className="flex-1 flex justify-center">
            <div className="w-full max-w-4xl flex flex-col items-center">{children}</div>
          </main>
         <Rightbar/>  
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <SidebarProvider>
            <Layout>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<SingUp />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/verify-code" element={<VerificationPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/saved" element={<MySavedPost />} />
                <Route path="/my-posts" element={<MyPost />} />
                <Route path="/aboutUs" element={<AboutUsPage />} />
                <Route path="/contactUs" element={<ContactUsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/create-post" element={<CreatePostPage />} />
              </Routes>
            </Layout>
          </SidebarProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
