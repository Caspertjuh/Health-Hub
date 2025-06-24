
import React from "react";
import { Activity } from "../contexts/EnhancedScheduleContext";
import { useUser } from "../contexts/EnhancedUserContext";
import { CheckCircle, Circle, MapPin, Users, Clock } from "lucide-react";
import { Badge } from "./ui/badge";

// Import icons - simplified set to reduce errors
import { 
  HelpCircle,
  Utensils, 
  Smile, 
  Book, 
  Music
} from "lucide-react";

// Default activity to use as fallback for missing data
const DEFAULT_ACTIVITY: Partial<Activity> = {
  title: "Onbekende activiteit",
  description: "",
  color: "#6B7280",
  icon: "help-circle",
  category: "fixed",
  completed: false
};

interface ActivityCardProps {
  activity: Activity | Partial<Activity>;
  onClick?: () => void;
  showTime?: boolean;
  isCompact?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  onClick,
  showTime = true,
  isCompact = false,
}) => {
  // Safe activity - combine with defaults
  const safeActivity = !activity 
    ? DEFAULT_ACTIVITY 
    : { ...DEFAULT_ACTIVITY, ...activity };
  
  // Get user context
  const userContext = useUser();
  const currentUser = userContext?.currentUser;
  
  // Default user preferences 
  const userPreferences = {
    useText: true, 
    usePictograms: true,
    useColors: true,
    ...(currentUser?.preferences || {})
  };
  
  // Should we show text and icons
  const showText = userPreferences.useText;
  const showIcons = userPreferences.usePictograms;

  // Get icon based on activity type - simplified version
  const getActivityIcon = () => {
    const iconSize = isCompact ? 24 : 32;
    
    if (!safeActivity.icon) return <HelpCircle size={iconSize} />;
    
    // Simplified set of icons to reduce errors
    switch (safeActivity.icon) {
      case "utensils":
        return <Utensils size={iconSize} />;
      case "smile":
        return <Smile size={iconSize} />;
      case "book":
        return <Book size={iconSize} />;
      case "music":
        return <Music size={iconSize} />;
      default:
        return <HelpCircle size={iconSize} />;
    }
  };

  // Format time for display
  const formatTimeRange = () => {
    if (!showTime) return "";
    if (!safeActivity.startTime && !safeActivity.endTime) return "";
    
    if (safeActivity.startTime && safeActivity.endTime) {
      return `${safeActivity.startTime} - ${safeActivity.endTime}`;
    }
    return safeActivity.startTime || safeActivity.endTime || "";
  };

  // Safely get activity color
  const activityColor = safeActivity.color || "#6B7280";

  return (
    <div
      className={`rounded-lg p-5 flex ${isCompact ? 'gap-3' : 'gap-4'} items-center cursor-pointer transition-all hover:shadow-md`}
      style={{ 
        backgroundColor: `${activityColor}40`, 
        borderLeft: `8px solid ${activityColor}` 
      }}
      onClick={onClick}
    >
      {/* Completion status indicator for fixed/flexible activities */}
      {(safeActivity.category === "fixed" || safeActivity.category === "flexible") && (
        <div className="flex-shrink-0">
          {safeActivity.completed ? (
            <CheckCircle className="text-green-500" size={isCompact ? 24 : 28} />
          ) : (
            <Circle className="text-gray-300" size={isCompact ? 24 : 28} />
          )}
        </div>
      )}
      
      {/* Activity icon */}
      {showIcons && (
        <div 
          className="flex-shrink-0 flex items-center justify-center rounded-full p-3" 
          style={{ backgroundColor: activityColor }}
        >
          {getActivityIcon()}
        </div>
      )}
      
      {/* Activity details */}
      <div className="flex-1">
        {showText && (
          <>
            <h3 className={`${isCompact ? 'text-xl' : 'text-2xl'} font-medium`}>
              {safeActivity.title || "Onbenoemde activiteit"}
            </h3>
            
            {!isCompact && safeActivity.description && (
              <p className="text-lg mt-1">{safeActivity.description}</p>
            )}
            
            {showTime && formatTimeRange() && (
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <Clock size={isCompact ? 18 : 20} />
                <p className={isCompact ? 'text-lg' : 'text-lg'}>{formatTimeRange()}</p>
              </div>
            )}
            
            {!isCompact && safeActivity.location && (
              <div className="flex items-center gap-2 text-muted-foreground mt-2">
                <MapPin size={20} />
                <p className="text-lg">{safeActivity.location}</p>
              </div>
            )}
            
            {/* Group activity info */}
            {!isCompact && safeActivity.category === "group" && (
              <div className="flex items-center gap-2 mt-3">
                <Users size={20} />
                <Badge variant="outline" className="text-base px-3 py-1">
                  {(safeActivity.participants?.length || 0)}/
                  {safeActivity.maxParticipants || "∞"} deelnemers
                </Badge>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
