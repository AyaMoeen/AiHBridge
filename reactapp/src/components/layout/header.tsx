import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { Bell, Menu, Moon, Sun } from "lucide-react";
import { Input } from "../ui/input";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useSidebar } from "../ui/sidebar";

// ✅ Header Component
export default function Header() {

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
};