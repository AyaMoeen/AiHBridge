
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import "./index.css";

import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, useSidebar } from "./components/ui/sidebar";

import LoginPage from "./features/auth/pages/LoginPage";
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage";
import VerificationPage from "./features/auth/pages/VerificationPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./components/ui/button";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { Input } from "./components/ui/input";

const HomePage = () => (
  <div className="text-center">
    <h1 className="text-2xl font-bold">AiHBridge - Home Page</h1>
    <p className="mt-4">Welcome to the AI tools platform!</p>
  </div>
);

const RegisterPage = () => (
  <div className="text-center">
    <h1 className="text-2xl font-bold">Register Page</h1>
    <p className="mt-4">Registration form coming soon...</p>
  </div>
);

// ✅ Header Component
function Header() {
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Left: Sidebar Toggle & Search */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
        <Input
          type="text"
          placeholder="Search..."
          className="w-64"
        />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Icon */}
        <Button variant="ghost" size="icon">
          <Bell className="h-6 w-6" />
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 rounded-full">
              <img
                src={"https://via.placeholder.com/40"}
                alt="User"
                className="h-8 w-8 rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// ✅ Layout that shows Sidebar if logged in + Header + Centered Content
function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex min-h-screen w-full">
      { <AppSidebar />}
      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        { <Header />} {/* ✅ Show header only if logged in */}
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">{children}</div>
        </main>
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
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-code" element={<VerificationPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<HomePage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </SidebarProvider>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
