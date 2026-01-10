import { useState, useEffect } from 'react';

export type ThemeName = 'space' | 'ocean' | 'aurora' | 'sunset' | 'matrix' | 'nebula';

interface Theme {
  name: ThemeName;
  label: string;
  colors: {
    background: string;
    foreground: string;
    card: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    border: string;
    destructive: string;
    warning: string;
    success: string;
  };
}

export const themes: Theme[] = [
  {
    name: 'space',
    label: '🚀 Space',
    colors: {
      background: '222 47% 4%',
      foreground: '210 40% 96%',
      card: '222 47% 6%',
      primary: '192 95% 55%',
      secondary: '222 47% 12%',
      accent: '192 80% 45%',
      muted: '222 30% 15%',
      border: '222 30% 18%',
      destructive: '0 72% 51%',
      warning: '38 92% 50%',
      success: '142 76% 45%',
    },
  },
  {
    name: 'ocean',
    label: '🌊 Ocean',
    colors: {
      background: '200 60% 5%',
      foreground: '195 40% 96%',
      card: '200 55% 8%',
      primary: '180 70% 45%',
      secondary: '200 50% 15%',
      accent: '170 60% 40%',
      muted: '200 40% 18%',
      border: '200 35% 20%',
      destructive: '0 65% 50%',
      warning: '35 85% 50%',
      success: '160 70% 40%',
    },
  },
  {
    name: 'aurora',
    label: '🌌 Aurora',
    colors: {
      background: '240 30% 6%',
      foreground: '220 40% 96%',
      card: '240 35% 9%',
      primary: '280 70% 60%',
      secondary: '240 40% 15%',
      accent: '320 60% 50%',
      muted: '240 30% 18%',
      border: '240 30% 22%',
      destructive: '0 70% 55%',
      warning: '45 90% 50%',
      success: '120 60% 45%',
    },
  },
  {
    name: 'sunset',
    label: '🌅 Sunset',
    colors: {
      background: '15 40% 5%',
      foreground: '30 40% 96%',
      card: '15 45% 8%',
      primary: '25 95% 55%',
      secondary: '15 50% 12%',
      accent: '350 70% 55%',
      muted: '15 30% 18%',
      border: '15 30% 20%',
      destructive: '0 80% 55%',
      warning: '45 95% 55%',
      success: '100 65% 45%',
    },
  },
  {
    name: 'matrix',
    label: '💚 Matrix',
    colors: {
      background: '120 30% 3%',
      foreground: '120 50% 90%',
      card: '120 35% 6%',
      primary: '120 100% 45%',
      secondary: '120 40% 10%',
      accent: '140 80% 40%',
      muted: '120 25% 15%',
      border: '120 30% 18%',
      destructive: '0 70% 50%',
      warning: '60 90% 45%',
      success: '120 80% 45%',
    },
  },
  {
    name: 'nebula',
    label: '✨ Nebula',
    colors: {
      background: '270 40% 5%',
      foreground: '260 40% 96%',
      card: '270 45% 8%',
      primary: '290 80% 60%',
      secondary: '270 45% 15%',
      accent: '200 70% 55%',
      muted: '270 30% 18%',
      border: '270 30% 22%',
      destructive: '0 75% 55%',
      warning: '40 90% 50%',
      success: '150 70% 45%',
    },
  },
];

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('spaceshield-theme') as ThemeName) || 'space';
    }
    return 'space';
  });

  useEffect(() => {
    const theme = themes.find(t => t.name === currentTheme);
    if (theme) {
      const root = document.documentElement;
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}`, value);
        if (key === 'card') {
          root.style.setProperty('--card-foreground', theme.colors.foreground);
          root.style.setProperty('--popover', value);
          root.style.setProperty('--popover-foreground', theme.colors.foreground);
        }
        if (key === 'primary') {
          root.style.setProperty('--primary-foreground', theme.colors.background);
          root.style.setProperty('--ring', value);
        }
        if (key === 'secondary') {
          root.style.setProperty('--secondary-foreground', theme.colors.foreground);
        }
        if (key === 'accent') {
          root.style.setProperty('--accent-foreground', theme.colors.foreground);
        }
        if (key === 'muted') {
          root.style.setProperty('--muted-foreground', '215 20% 55%');
        }
        if (key === 'destructive') {
          root.style.setProperty('--destructive-foreground', theme.colors.foreground);
        }
        if (key === 'border') {
          root.style.setProperty('--input', value);
        }
      });
      
      // Update sidebar colors
      root.style.setProperty('--sidebar-background', theme.colors.card);
      root.style.setProperty('--sidebar-foreground', theme.colors.foreground);
      root.style.setProperty('--sidebar-primary', theme.colors.primary);
      root.style.setProperty('--sidebar-primary-foreground', theme.colors.background);
      root.style.setProperty('--sidebar-accent', theme.colors.secondary);
      root.style.setProperty('--sidebar-accent-foreground', theme.colors.foreground);
      root.style.setProperty('--sidebar-border', theme.colors.border);
      root.style.setProperty('--sidebar-ring', theme.colors.primary);
      
      localStorage.setItem('spaceshield-theme', currentTheme);
    }
  }, [currentTheme]);

  return {
    currentTheme,
    setTheme: setCurrentTheme,
    themes,
  };
};
