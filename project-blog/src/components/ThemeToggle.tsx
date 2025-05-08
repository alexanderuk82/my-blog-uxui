import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check initial preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
    
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    setIsDarkMode(!isDarkMode);
  };

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