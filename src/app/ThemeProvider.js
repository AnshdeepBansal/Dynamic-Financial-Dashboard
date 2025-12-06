'use client';

import { useEffect } from 'react';
import useWidgetStore from '@/store/widgetStore';

export default function ThemeProvider({ children }) {
  const { theme } = useWidgetStore();

  useEffect(() => {
    // Apply theme on mount and when it changes
    const root = document.documentElement;
    const currentTheme = theme || 'dark';
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}
