import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { useUser } from '../contexts/EnhancedUserContext';

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { currentUser, updateUserPreferences } = useUser();
  const [mounted, setMounted] = useState(false);

  // Only execute on client side
  useEffect(() => {
    setMounted(true);
    
    // Check if user has a preferred theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
    
    // Also check system preference if no stored theme
    if (!storedTheme) {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Update user preferences if logged in
    if (currentUser) {
      updateUserPreferences({
        ...currentUser.preferences
      });
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
      <Button
        onClick={toggleTheme}
        variant="outline"
        size="icon"
        className="rounded-full h-12 w-12 shadow-lg border bg-background/90 backdrop-blur-sm hover:scale-110 transition-all duration-300"
        aria-label={theme === 'light' ? 'Schakel naar donkere modus' : 'Schakel naar lichte modus'}
      >
        {theme === 'light' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
            />
          </svg>
        )}
      </Button>
      
      {/* A subtle animation to draw attention to the theme switcher when the app loads */}
      <div className="absolute inset-0 rounded-full animate-ping-slow bg-primary/10 z-[-1]"></div>
    </div>
  );
};