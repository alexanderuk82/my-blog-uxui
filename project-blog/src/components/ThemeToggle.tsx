import React, { useEffect, useState, useCallback } from 'react';
import { Sun, Moon } from 'lucide-react';

// Helper function to get the initial theme
const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') {
    return false; // Default to light theme for SSR or build time
  }
  try {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch (error) {
    console.error("Error reading theme from localStorage:", error);
    return false; // Fallback to light theme
  }
};

const ThemeToggle: React.FC = () => {
  // Initialize state directly with the theme preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialTheme());

  // Effect to apply theme class to HTML element and update localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  }, [isDarkMode]); // Re-run effect when isDarkMode changes

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
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