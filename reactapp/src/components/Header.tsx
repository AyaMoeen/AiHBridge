import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import Notifications from "./Notifications";

export default function Header() {
  const { toggleSidebar } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-secondary-foreground dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && <Notifications />}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? (
            <Sun className="h-6 w-6" />
          ) : (
            <Moon className="h-6 w-6" />
          )}
        </Button>
        <Button className="hover:cursor-pointer  bg-secondary-foreground font-serif text-gray-500 hover:bg-gray-200 rounded">
          <Link to="/aboutUs">About us</Link>
        </Button>
        <Button className="hover:cursor-pointer bg-secondary-foreground font-serif text-gray-500 hover:bg-gray-200 rounded">
          <Link to="/contactUs">Contact us</Link>
        </Button>
        {user ? (
          <Button
            className="flex items-center gap-2 bg-gray-500 dark:bg-gray-700"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        ) : (
          <>
            <Button
              className="hover:cursor-pointer bg-secondary-foreground font-serif text-gray-500 hover:bg-gray-200 rounded"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="hover:cursor-pointer bg-secondary-foreground font-serif text-gray-500 hover:bg-gray-200 rounded"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </Button>
          </>
        )}{" "}
      </div>
    </header>
  );
}