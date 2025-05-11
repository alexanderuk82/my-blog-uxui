import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Theme Context
 * Provides theme state and toggle functionality throughout the application
 */
const ThemeContext = createContext();

/**
 * Theme Provider Component
 * Manages theme state and provides theme context to children
 */
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or system preference
  const [theme, setTheme] = useState(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('ui-hub-theme');
    if (storedTheme) {
      return storedTheme;
    }
    
    // If not in localStorage, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // Default to light theme
    return 'light';
  });

  // Update theme class and data attribute when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('ui-hub-theme', theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const systemTheme = e.matches ? 'dark' : 'light';
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem('ui-hub-theme')) {
        setTheme(systemTheme);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Set theme to specific value
  const setThemeValue = (value) => {
    if (value === 'light' || value === 'dark' || value === 'system') {
      if (value === 'system') {
        // Remove from localStorage to follow system
        localStorage.removeItem('ui-hub-theme');
        // Set based on system preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(systemTheme);
      } else {
        setTheme(value);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeValue }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

export default ThemeContext;
