// src/components/common/ThemeToggle.tsx
import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';


interface ThemeToggleProps {
    variant?: 'default' | 'ghost' | 'outline';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    variant = 'ghost',
    size = 'icon',
    showLabel = false,
}) => {
    const { theme, actualTheme, setTheme } = useTheme();

    const getThemeIcon = () => {
        if (theme === 'system') {
            return <Monitor className="h-4 w-4" />;
        }
        return actualTheme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
    };

    const getThemeLabel = () => {
        switch (theme) {
            case 'light':
                return 'Light';
            case 'dark':
                return 'Dark';
            case 'system':
                return 'System';
            default:
                return 'Theme';
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant={variant}
                    size={size}
                    className="relative"
                    aria-label="Toggle theme"
                >
                    {getThemeIcon()}
                    {showLabel && <span className="ml-2">{getThemeLabel()}</span>}
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem
                    onClick={() => setTheme('light')}
                    className={`cursor-pointer ${theme === 'light' ? 'bg-accent' : ''}`}
                >
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light</span>
                    {theme === 'light' && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme('dark')}
                    className={`cursor-pointer ${theme === 'dark' ? 'bg-accent' : ''}`}
                >
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark</span>
                    {theme === 'dark' && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                    )}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => setTheme('system')}
                    className={`cursor-pointer ${theme === 'system' ? 'bg-accent' : ''}`}
                >
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>System</span>
                    {theme === 'system' && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary"></div>
                    )}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

// Simple toggle button (just switches between light/dark)
export const SimpleThemeToggle: React.FC<Omit<ThemeToggleProps, 'showLabel'>> = ({
    variant = 'ghost',
    size = 'icon',
}) => {
    const { actualTheme, toggleTheme } = useTheme();

    return (
        <Button
            variant={variant}
            size={size}
            onClick={toggleTheme}
            aria-label={`Switch to ${actualTheme === 'light' ? 'dark' : 'light'} mode`}
            className="relative"
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
};