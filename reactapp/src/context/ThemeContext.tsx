// src/context/ThemeContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    actualTheme: 'light' | 'dark'; // The actual theme being applied (resolved from system)
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
    storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'system',
    storageKey = 'aihbridge-theme',
}) => {
    const [theme, setThemeState] = useState<Theme>(() => {
        // Try to get theme from localStorage on initialization
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem(storageKey) as Theme;
            return storedTheme || defaultTheme;
        }
        return defaultTheme;
    });

    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

    // Function to get system theme preference
    const getSystemTheme = (): 'light' | 'dark' => {
        if (typeof window === 'undefined') return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Function to resolve the actual theme to be applied
    const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
        if (currentTheme === 'system') {
            return getSystemTheme();
        }
        return currentTheme;
    };

    // Update the actual theme whenever theme changes or system preference changes
    useEffect(() => {
        const resolvedTheme = resolveTheme(theme);
        setActualTheme(resolvedTheme);

        // Apply theme to document root
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolvedTheme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content',
                resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
            );
        }
    }, [theme]);

    // Listen for system theme changes
    useEffect(() => {
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            const newSystemTheme = e.matches ? 'dark' : 'light';
            setActualTheme(newSystemTheme);

            // Apply theme to document root
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(newSystemTheme);
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, [theme]);

    // Set theme and persist to localStorage
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
        localStorage.setItem(storageKey, newTheme);
    };

    // Toggle between light and dark (skip system)
    const toggleTheme = () => {
        if (theme === 'light') {
            setTheme('dark');
        } else if (theme === 'dark') {
            setTheme('light');
        } else {
            // If system, toggle to opposite of current system theme
            const systemTheme = getSystemTheme();
            setTheme(systemTheme === 'light' ? 'dark' : 'light');
        }
    };

    const value: ThemeContextType = {
        theme,
        actualTheme,
        setTheme,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};