import React from 'react';
import { User } from '../contexts/EnhancedUserContext';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { UserAvatar } from './UserAvatar';

type EnhancedNavigationHeaderProps = {
  title: string;
  subtitle?: string;
  onSettingsClick: () => void;
  onLogout: () => void;
  user: User;
};

export const EnhancedNavigationHeader = ({
  title,
  subtitle,
  onSettingsClick,
  onLogout,
  user
}: EnhancedNavigationHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-5xl mx-auto py-3 px-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Logo */}
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M8 2V5"></path>
              <path d="M16 2V5"></path>
              <path d="M3.5 9.09H20.5"></path>
              <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z"></path>
              <path d="M11.995 13.7H12.005"></path>
              <path d="M8.295 13.7H8.305"></path>
              <path d="M8.295 16.7H8.305"></path>
            </svg>
          </div>
          
          {/* Title and subtitle */}
          <div>
            <h1 className="text-lg font-medium">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        
        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-auto py-2 px-2">
              <div className="flex items-center">
                <div className="flex flex-col items-end mr-3 text-right">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {Object.values(user.disabilities).filter(Boolean).length > 0 
                      ? 'Ondersteuningsprofiel actief' 
                      : 'Geen ondersteuning'}
                  </span>
                </div>
                <UserAvatar user={user} size="md" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start p-2">
              <UserAvatar user={user} size="sm" className="mr-2" />
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground">Bewoner</p>
              </div>
            </div>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem className="cursor-pointer" onClick={onSettingsClick}>
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Toegankelijkheid</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive" onClick={onLogout}>
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Uitloggen</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};