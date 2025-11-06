import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type ThemeMode = 'light' | 'dark';
type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';

interface ThemeContextType {
  theme: ThemeMode;
  colorBlindMode: ColorBlindMode;
  toggleTheme: () => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [colorBlindMode, setColorBlindModeState] = useState<ColorBlindMode>('none');

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    } else {
      loadLocalPreferences();
    }
  }, [user]);

  useEffect(() => {
    applyTheme();
  }, [theme, colorBlindMode]);

  const loadUserPreferences = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('users')
      .select('theme_preference, colorblind_mode')
      .eq('id', user.id)
      .maybeSingle();

    if (data) {
      setTheme(data.theme_preference || 'light');
      setColorBlindModeState(data.colorblind_mode || 'none');
    }
  };

  const loadLocalPreferences = () => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode;
    const savedColorBlindMode = localStorage.getItem('colorBlindMode') as ColorBlindMode;

    if (savedTheme) setTheme(savedTheme);
    if (savedColorBlindMode) setColorBlindModeState(savedColorBlindMode);
  };

  const applyTheme = () => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-colorblind-mode', colorBlindMode);
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (user) {
      await supabase
        .from('users')
        .update({ theme_preference: newTheme })
        .eq('id', user.id);
    }
  };

  const setColorBlindMode = async (mode: ColorBlindMode) => {
    setColorBlindModeState(mode);
    localStorage.setItem('colorBlindMode', mode);

    if (user) {
      await supabase
        .from('users')
        .update({ colorblind_mode: mode })
        .eq('id', user.id);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, colorBlindMode, toggleTheme, setColorBlindMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
