import React from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { User } from '../contexts/EnhancedUserContext';

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 'md', 
  className = ''
}) => {
  const sizeMap = {
    sm: {
      container: 'w-8 h-8',
      icon: 16,
      imgSize: 32
    },
    md: {
      container: 'w-10 h-10',
      icon: 20,
      imgSize: 40
    },
    lg: {
      container: 'w-16 h-16',
      icon: 32,
      imgSize: 64
    },
    xl: {
      container: 'w-24 h-24',
      icon: 40,
      imgSize: 96
    }
  };

  const { container, icon, imgSize } = sizeMap[size];
  
  // Fixed/absolute URLs for user avatars to ensure they load properly
  const getAvatarSrc = (avatarPath?: string) => {
    if (!avatarPath) return undefined;
    
    // If the avatar path is already a full URL, return it
    if (avatarPath.startsWith('http')) {
      return avatarPath;
    }
    
    // Otherwise ensure it's properly formatted for the public directory
    if (avatarPath.startsWith('/')) {
      return avatarPath; // Path already starts with /, e.g. "/avatars/user1.png"
    }
    
    // Add leading slash if missing
    return `/${avatarPath}`;
  };

  return (
    <div className={`rounded-full overflow-hidden bg-muted flex-shrink-0 ${container} ${className}`}>
      {user.avatar ? (
        <ImageWithFallback
          src={getAvatarSrc(user.avatar)}
          alt={user.name}
          width={imgSize}
          height={imgSize}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={icon}
            height={icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
      )}
    </div>
  );
};