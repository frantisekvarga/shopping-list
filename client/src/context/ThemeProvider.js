import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('isDarkMode');
    return savedMode === 'true'; 
  });

  useEffect(() => {
    localStorage.setItem('isDarkMode', isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode); 


    if (isDarkMode) {
      document.documentElement.style.setProperty('--background-color', '#000');
      document.documentElement.style.setProperty('--text-color', '#FFF');
      document.documentElement.style.setProperty('--button-bg-color', '#FFF');
      document.documentElement.style.setProperty('--button-text-color', '#000');
    } else {
      document.documentElement.style.setProperty('--background-color', '#FFF');
      document.documentElement.style.setProperty('--text-color', '#000');
      document.documentElement.style.setProperty('--button-bg-color', '#000');
      document.documentElement.style.setProperty('--button-text-color', '#FFF');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
