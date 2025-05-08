import React, { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

// Helper function to get the initial theme
const getInitialTheme = (): boolean => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return false; // Default to light theme for SSR or build time
  }
  
  try {
    // Check localStorage first
    const storedTheme = window.localStorage.getItem('theme');
    
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    
    // If no theme in localStorage, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
    return false; // Fallback to light theme
  }
};

const ThemeToggle: React.FC = () => {
  // Initialize state with a function to ensure it only runs once on mount
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getInitialTheme());

  // Effect to apply theme class to HTML element and update localStorage
  useEffect(() => {
    // Skip if we're not in a browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      // Apply theme to document
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        window.localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        window.localStorage.setItem('theme', 'light');
      }
      
      // Verify the theme was stored correctly
      const storedTheme = window.localStorage.getItem('theme');
      console.log('Theme stored successfully:', storedTheme);
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  }, [isDarkMode]); // Re-run effect when isDarkMode changes
  
  // Add a one-time initialization effect
  useEffect(() => {
    // Apply the initial theme on component mount
    const initialTheme = getInitialTheme();
    setIsDarkMode(initialTheme);
    console.log('Initial theme applied:', initialTheme ? 'dark' : 'light');
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      console.log('Toggling theme to:', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full hover:bg-surface transition-colors"
      aria-label="Toggle dark mode"
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;