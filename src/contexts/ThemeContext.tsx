import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const deviceColorScheme = useColorScheme() || 'light';
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(deviceColorScheme);

  // Load saved theme mode on app start
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem('themeMode');
        if (savedMode !== null) {
          setThemeMode(savedMode as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
      }
    };
    
    loadThemeMode();
  }, []);

  // Update color scheme when theme mode changes
  useEffect(() => {
    const updateColorScheme = async () => {
      try {
        await AsyncStorage.setItem('themeMode', themeMode);
        
        if (themeMode === 'system') {
          setColorScheme(deviceColorScheme);
        } else {
          setColorScheme(themeMode);
        }
      } catch (error) {
        console.error('Error saving theme mode:', error);
      }
    };
    
    updateColorScheme();
  }, [themeMode, deviceColorScheme]);

  const value = {
    colorScheme,
    themeMode,
    setThemeMode,
    isDarkMode: colorScheme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};