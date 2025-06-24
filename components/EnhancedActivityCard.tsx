import React from 'react';
import { Activity, RequiredSupport } from '../contexts/EnhancedScheduleContext';
import { Disability, Preferences } from '../contexts/EnhancedUserContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

type EnhancedActivityCardProps = {
  activity: Activity;
  onComplete: (completed: boolean) => void;
  userDisabilities: Disability;
  userPreferences: Preferences;
};

// Icon mapping with improved SVG icons
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'hygiene':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 21h10V10H7z"></path>
          <path d="M7 10V3h10v7"></path>
          <path d="M12 3v7"></path>
          <path d="M12 14.5a2 2 0 0 1 2 2"></path>
        </svg>
      );
    case 'meal':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
          <path d="M5 8h10v8H5z"></path>
          <path d="M5 12h5"></path>
          <path d="M2 8h3"></path>
          <path d="M2 16h3"></path>
        </svg>
      );
    case 'medication':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 21 6-6.5"></path>
          <path d="M4.5 13.5 11 7l4 4-6.5 6.5z"></path>
          <path d="m11 7 4 4"></path>
          <path d="m9 4 3 3"></path>
          <path d="M5 8 3 6"></path>
          <path d="M6 15c-1.5 1.5-3 3-3 5"></path>
        </svg>
      );
    case 'therapy':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z"></path>
          <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1"></path>
        </svg>
      );
    case 'exercise':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20V10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"></path>
          <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
          <path d="M12 13v7"></path>
        </svg>
      );
    case 'social':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      );
    case 'entertainment':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      );
    case 'creative':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <circle cx="8" cy="8" r="1"></circle>
          <circle cx="16" cy="8" r="1"></circle>
          <path d="M9.5 15a3.5 3.5 0 0 0 5 0"></path>
        </svg>
      );
    case 'education':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      );
    default:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
          <line x1="9" y1="9" x2="15" y2="15"></line>
          <line x1="15" y1="9" x2="9" y2="15"></line>
        </svg>
      );
  }
};

// Support icons with improved tooltips
const SupportIcon = ({ type, needed, userHas }: { type: string, needed: boolean, userHas: boolean }) => {
  if (!needed) return null;
  
  let icon;
  let label;
  
  switch (type) {
    case 'language':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      );
      label = "Taalondersteuning nodig";
      break;
    case 'planning':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      );
      label = "Planningsondersteuning nodig";
      break;
    case 'sensory':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"></path>
        </svg>
      );
      label = "Zintuiglijke ondersteuning nodig";
      break;
    case 'motor':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="m4.93 4.93 4.24 4.24"></path>
          <path d="m14.83 9.17 4.24-4.24"></path>
          <path d="m14.83 14.83 4.24 4.24"></path>
          <path d="m9.17 14.83-4.24 4.24"></path>
          <circle cx="12" cy="12" r="4"></circle>
        </svg>
      );
      label = "Motorische ondersteuning nodig";
      break;
    case 'social':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-6-6 6 6 0 0 0-6 6 8 8 0 0 0 9 7.5"></path>
          <path d="M13.5 14.4V18"></path>
          <path d="M12 16h3"></path>
          <path d="M21.29 17.3A2.43 2.43 0 0 0 18.82 16H18a2.4 2.4 0 0 0-2.4 2.4v.8h8v-.8c0-.36-.1-.7-.31-1.1Z"></path>
          <path d="M7 12.5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 0 0-9 0Z"></path>
        </svg>
      );
      label = "Sociale ondersteuning nodig";
      break;
    case 'cognitive':
      icon = (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 14a8 8 0 0 1-8 8"></path>
          <path d="M18 11V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v1.5"></path>
          <path d="M14 10V8a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
          <path d="M10 9.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"></path>
          <path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
        </svg>
      );
      label = "Cognitieve ondersteuning nodig";
      break;
    default:
      return null;
  }
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`w-6 h-6 flex items-center justify-center rounded-full ${userHas ? 'bg-amber-100 text-amber-800 dark:bg-amber-800 dark:text-amber-100' : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'}`}>
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{label}</p>
          {userHas && <p className="text-xs text-amber-500 dark:text-amber-400">Jij hebt hier ondersteuning bij nodig</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const EnhancedActivityCard = ({ 
  activity, 
  onComplete, 
  userDisabilities,
  userPreferences 
}: EnhancedActivityCardProps) => {
  // Format time
  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '';
    return timeString;
  };

  // Check if the activity requires support that the user needs
  const matchesUserNeeds = (activitySupport: RequiredSupport, userNeeds: Disability) => {
    return Object.entries(activitySupport).some(([key, value]) => {
      return value && userNeeds[key];
    });
  };

  const needsUserSupport = matchesUserNeeds(activity.requiredSupport, userDisabilities);
  
  // Enhance visuals for users with disabilities
  const enhancedVisuals = userPreferences.enhancedVisualSupport;
  const simplifiedLanguage = userPreferences.simplifiedLanguage;

  return (
    <Card 
      className={`overflow-hidden border-0 shadow-md transition-all duration-300 
        ${activity.completed ? 'bg-muted/50 dark:bg-muted/20' : 'bg-white dark:bg-gray-800'}
        ${needsUserSupport ? 'border-l-4 border-l-amber-500' : ''}
        ${enhancedVisuals ? 'shadow-lg hover:shadow-xl' : ''}
      `}
    >
      <div className="grid grid-cols-[auto_1fr_auto] p-4 gap-4">
        {/* Left: Icon */}
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center" 
          style={{ 
            backgroundColor: `${activity.color}20`, 
            color: activity.color 
          }}
        >
          <div className="w-6 h-6">{getActivityIcon(activity.type)}</div>
        </div>
        
        {/* Middle: Content */}
        <div className={`${activity.completed ? 'opacity-70' : ''}`}>
          <h3 className={`font-medium ${enhancedVisuals ? 'text-lg' : ''} ${activity.completed ? 'line-through decoration-1' : ''}`}>
            {activity.title}
          </h3>
          
          {activity.description && (
            <p className={`text-muted-foreground mt-1 ${simplifiedLanguage ? 'text-base' : 'text-sm'}`}>
              {activity.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-3 mt-3">
            {/* Time */}
            {activity.startTime && (
              <div className={`flex items-center ${enhancedVisuals ? 'bg-primary/10 px-2 py-1 rounded-md' : ''}`}>
                <svg className="w-4 h-4 mr-1 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span className="text-sm">
                  {formatTime(activity.startTime)} 
                  {activity.endTime && ` - ${formatTime(activity.endTime)}`}
                </span>
              </div>
            )}
            
            {/* Location */}
            {activity.location && (
              <div className={`flex items-center ${enhancedVisuals ? 'bg-primary/10 px-2 py-1 rounded-md' : ''}`}>
                <svg className="w-4 h-4 mr-1 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span className="text-sm">{activity.location}</span>
              </div>
            )}
            
            {/* Difficulty */}
            {activity.difficulty && (
              <div className={`flex items-center ${enhancedVisuals ? 'bg-primary/10 px-2 py-1 rounded-md' : ''}`}>
                <svg className="w-4 h-4 mr-1 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
                </svg>
                <span className="text-sm capitalize">
                  {activity.difficulty === 'easy' && 'Makkelijk'}
                  {activity.difficulty === 'medium' && 'Gemiddeld'}
                  {activity.difficulty === 'hard' && 'Moeilijk'}
                </span>
              </div>
            )}
          </div>
          
          {/* Support icons */}
          <div className="flex gap-2 mt-3">
            {Object.entries(activity.requiredSupport).map(([key, value]) => (
              value && (
                <SupportIcon 
                  key={key} 
                  type={key} 
                  needed={value} 
                  userHas={userDisabilities[key]} 
                />
              )
            ))}
          </div>
        </div>
        
        {/* Right: Actions */}
        <div className="flex flex-col items-center justify-center">
          <Checkbox
            id={`complete-${activity.id}`}
            checked={activity.completed}
            onCheckedChange={onComplete}
            className={`w-6 h-6 ${enhancedVisuals ? 'w-8 h-8' : ''}`}
          />
          <label htmlFor={`complete-${activity.id}`} className="sr-only">
            Markeer als voltooid
          </label>
        </div>
      </div>
    </Card>
  );
};