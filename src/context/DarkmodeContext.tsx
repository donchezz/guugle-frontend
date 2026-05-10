/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

interface DarkModeContextType {
  isDarkMode: boolean;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within a DarkModeProvider');
  }
  return context;
};

interface DarkModeProviderProps {
  children: React.ReactNode;
}

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    // Sync document class with system preference
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <DarkModeContext.Provider value={{ isDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};