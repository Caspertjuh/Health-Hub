
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser, DisabilityType } from "./UserContext";

// Define types for our activities
export type ActivityCategory = "fixed" | "flexible" | "free" | "suggestion" | "group";
export type ActivityType = 
  "eat" | "shower" | "rest" | "medication" | "exercise" | "hobby" | 
  "chore" | "entertainment" | "other" | "craft" | "game" | "social" | 
  "learning" | "therapy" | "outing";

// Interface for activity disability requirements
export interface ActivityDisabilityRequirements {
  // Whether the activity is not suitable for people with this disability
  notSuitableFor?: DisabilityType[];
  
  // Whether the activity requires special adaptations for this disability
  requiresAdaptationFor?: DisabilityType[];
  
  // Whether the activity is specifically designed for people with this disability
  recommendedFor?: DisabilityType[];
  
  // Intensity level of sensory stimuli (1-5, with 5 being most intense)
  stimuliIntensity?: {
    visual?: number;
    auditory?: number;
    tactile?: number;
  };
  
  // Complexity level (1-5, with 5 being most complex)
  complexityLevel?: number;
  
  // Required attention span in minutes
  requiredAttentionSpan?: number;
}

export interface Activity {
  id: string;
  title: string;
  description?: string;
  startTime: string; // format: "HH:MM"
  endTime: string; // format: "HH:MM"
  category: ActivityCategory;
  type: ActivityType;
  icon: string;
  color: string;
  location?: string;
  completed?: boolean;
  userId?: string; // Optional: to assign activities to specific users
  maxParticipants?: number; // For group activities
  participants?: string[]; // List of user IDs for group activities
  dayOfWeek?: number[]; // 0-6 for days of the week (0 = Sunday)
  date?: string; // For specific dates
  
  // Disability-specific properties
  disabilityRequirements?: ActivityDisabilityRequirements;
}

// Sample activities data
const defaultActivities: Activity[] = [
  {
    id: "1",
    title: "Ontbijt",
    description: "Ontbijt in de gemeenschappelijke ruimte",
    startTime: "08:00",
    endTime: "08:30",
    category: "fixed",
    type: "eat",
    icon: "utensils",
    color: "#FFD700", // gold color for meals
    location: "Keuken",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
  },
  {
    id: "2",
    title: "Douchen",
    startTime: "08:45",
    endTime: "09:15",
    category: "fixed",
    type: "shower",
    icon: "shower",
    color: "#87CEEB", // sky blue for hygiene
    location: "Badkamer",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
  },
  {
    id: "3",
    title: "Vrije tijd",
    startTime: "09:30",
    endTime: "10:30",
    category: "free",
    type: "hobby",
    icon: "smile",
    color: "#98FB98", // pale green for free time
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
  },
  {
    id: "4",
    title: "Medicatie",
    startTime: "11:00",
    endTime: "11:15",
    category: "fixed",
    type: "medication",
    icon: "pills",
    color: "#FF6347", // tomato for medication
    location: "Woonkamer",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
  },
  {
    id: "5",
    title: "Lunch",
    startTime: "12:00",
    endTime: "12:45",
    category: "fixed",
    type: "eat",
    icon: "utensils",
    color: "#FFD700", // gold color for meals
    location: "Keuken",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
  },
  {
    id: "6",
    title: "Rusttijd",
    startTime: "13:00",
    endTime: "14:00",
    category: "fixed",
    type: "rest",
    icon: "bed",
    color: "#DDA0DD", // plum for rest
    location: "Slaapkamer",
    dayOfWeek: [1, 3, 5], // Monday, Wednesday, Friday
    disabilityRequirements: {
      recommendedFor: ["sensory_sensitivity", "limited_attention_span"],
      stimuliIntensity: {
        visual: 1,
        auditory: 1,
        tactile: 1
      }
    }
  },
  {
    id: "7",
    title: "Wandelen",
    startTime: "14:30",
    endTime: "15:30",
    category: "group",
    type: "exercise",
    icon: "walking",
    color: "#20B2AA", // light sea green for exercise
    location: "Buiten",
    maxParticipants: 6,
    participants: [],
    dayOfWeek: [1, 4], // Monday, Thursday
    disabilityRequirements: {
      stimuliIntensity: {
        visual: 3,
        auditory: 3,
        tactile: 2
      },
      complexityLevel: 2
    }
  },
  {
    id: "8",
    title: "Avondeten",
    startTime: "18:00",
    endTime: "19:00",
    category: "fixed",
    type: "eat",
    icon: "utensils",
    color: "#FFD700", // gold color for meals
    location: "Keuken",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
  },
  {
    id: "9",
    title: "TV kijken",
    startTime: "19:30",
    endTime: "21:00",
    category: "flexible",
    type: "entertainment",
    icon: "tv",
    color: "#98FB98", // pale green for entertainment
    location: "Woonkamer",
    dayOfWeek: [0, 1, 2, 3, 4, 5, 6], // Every day
    disabilityRequirements: {
      notSuitableFor: ["sensory_sensitivity"],
      stimuliIntensity: {
        visual: 4,
        auditory: 4,
        tactile: 1
      }
    }
  },
  {
    id: "10",
    title: "Zwemmen",
    startTime: "10:00",
    endTime: "11:30",
    category: "group",
    type: "exercise",
    icon: "walking",
    color: "#20B2AA", // light sea green for exercise
    location: "Zwembad",
    maxParticipants: 8,
    participants: [],
    dayOfWeek: [2], // Tuesday
    disabilityRequirements: {
      notSuitableFor: ["anxiety_confusion"],
      stimuliIntensity: {
        visual: 3,
        auditory: 4,
        tactile: 5
      },
      complexityLevel: 3
    }
  },
  {
    id: "11",
    title: "Knutselen",
    startTime: "14:00",
    endTime: "15:30",
    category: "group",
    type: "craft",
    icon: "paint-brush",
    color: "#DDA0DD", // plum
    location: "Activiteitenruimte",
    maxParticipants: 10,
    participants: [],
    dayOfWeek: [3], // Wednesday
    disabilityRequirements: {
      recommendedFor: ["visual_support_need"],
      requiresAdaptationFor: ["abstract_thinking"],
      stimuliIntensity: {
        visual: 2,
        auditory: 2,
        tactile: 4
      },
      complexityLevel: 3,
      requiredAttentionSpan: 20
    }
  },
  {
    id: "12",
    title: "Spelletjesmiddag",
    startTime: "15:00",
    endTime: "16:30",
    category: "group",
    type: "game",
    icon: "puzzle-piece",
    color: "#98FB98", // pale green
    location: "Woonkamer",
    maxParticipants: 12,
    participants: [],
    dayOfWeek: [5], // Friday
    disabilityRequirements: {
      requiresAdaptationFor: ["abstract_thinking", "language_comprehension"],
      stimuliIntensity: {
        visual: 2,
        auditory: 3,
        tactile: 2
      },
      complexityLevel: 3
    }
  },
  {
    id: "13",
    title: "Muziek Workshop",
    startTime: "13:30",
    endTime: "15:00",
    category: "group",
    type: "hobby",
    icon: "music",
    color: "#87CEEB", // sky blue
    location: "Muziekkamer",
    maxParticipants: 8,
    participants: [],
    dayOfWeek: [2], // Tuesday
    disabilityRequirements: {
      notSuitableFor: ["sensory_sensitivity"],
      stimuliIntensity: {
        visual: 2,
        auditory: 5,
        tactile: 3
      },
      requiredAttentionSpan: 15
    }
  },
  {
    id: "14",
    title: "Boodschappen",
    startTime: "10:30",
    endTime: "12:00",
    category: "group",
    type: "chore",
    icon: "briefcase",
    color: "#6B7280", // gray
    location: "Supermarkt",
    maxParticipants: 4,
    participants: [],
    dayOfWeek: [4], // Thursday
    disabilityRequirements: {
      notSuitableFor: ["anxiety_confusion", "sensory_sensitivity"],
      requiresAdaptationFor: ["planning_organization"],
      stimuliIntensity: {
        visual: 5,
        auditory: 4,
        tactile: 3
      },
      complexityLevel: 4
    }
  },
  {
    id: "15",
    title: "Tuinieren",
    startTime: "14:00",
    endTime: "15:30",
    category: "group",
    type: "hobby",
    icon: "smile",
    color: "#98FB98", // pale green
    location: "Tuin",
    maxParticipants: 6,
    participants: [],
    dayOfWeek: [0, 6], // Sunday, Saturday
    disabilityRequirements: {
      recommendedFor: ["low_frustration_tolerance"],
      stimuliIntensity: {
        visual: 3,
        auditory: 2,
        tactile: 5
      },
      complexityLevel: 2
    }
  },
];

// Suggestions for free time
export const activitySuggestions: Activity[] = [
  {
    id: "s1",
    title: "Tekenen",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "hobby",
    icon: "paint-brush",
    color: "#DDA0DD", // plum
    disabilityRequirements: {
      recommendedFor: ["visual_support_need", "anxiety_confusion"],
      stimuliIntensity: {
        visual: 2,
        auditory: 1,
        tactile: 3
      }
    }
  },
  {
    id: "s2",
    title: "Puzzel maken",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "hobby",
    icon: "puzzle-piece",
    color: "#20B2AA", // light sea green
    disabilityRequirements: {
      requiresAdaptationFor: ["abstract_thinking"],
      stimuliIntensity: {
        visual: 3,
        auditory: 1,
        tactile: 2
      },
      complexityLevel: 3
    }
  },
  {
    id: "s3",
    title: "Muziek luisteren",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "entertainment",
    icon: "music",
    color: "#87CEEB", // sky blue
    disabilityRequirements: {
      notSuitableFor: ["sensory_sensitivity"],
      stimuliIntensity: {
        visual: 1,
        auditory: 4,
        tactile: 1
      }
    }
  },
  {
    id: "s4",
    title: "Boek lezen",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "hobby",
    icon: "book",
    color: "#FFD700", // gold
    disabilityRequirements: {
      notSuitableFor: ["language_comprehension"],
      requiresAdaptationFor: ["limited_attention_span"],
      stimuliIntensity: {
        visual: 2,
        auditory: 1,
        tactile: 1
      },
      complexityLevel: 4
    }
  },
  {
    id: "s5",
    title: "Wandelen",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "exercise",
    icon: "walking",
    color: "#20B2AA", // light sea green
    disabilityRequirements: {
      stimuliIntensity: {
        visual: 3,
        auditory: 3,
        tactile: 2
      }
    }
  },
  {
    id: "s6",
    title: "Telefoneren met familie",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "social",
    icon: "smile",
    color: "#87CEEB", // sky blue
    disabilityRequirements: {
      notSuitableFor: ["language_comprehension"],
      stimuliIntensity: {
        visual: 1,
        auditory: 4,
        tactile: 1
      }
    }
  },
  {
    id: "s7",
    title: "Kaarten",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "game",
    icon: "puzzle-piece",
    color: "#98FB98", // pale green
    disabilityRequirements: {
      requiresAdaptationFor: ["abstract_thinking"],
      stimuliIntensity: {
        visual: 2,
        auditory: 2,
        tactile: 3
      },
      complexityLevel: 3
    }
  },
  {
    id: "s8",
    title: "Rusten",
    startTime: "",
    endTime: "",
    category: "suggestion",
    type: "rest",
    icon: "bed",
    color: "#DDA0DD", // plum
    disabilityRequirements: {
      recommendedFor: ["sensory_sensitivity", "limited_attention_span", "low_frustration_tolerance"],
      stimuliIntensity: {
        visual: 1,
        auditory: 1,
        tactile: 1
      },
      complexityLevel: 1
    }
  },
];

// Store user-specific activities (for a real app, this would be in a database)
interface UserActivities {
  [userId: string]: Activity[];
}

// Create the schedule context
interface ScheduleContextType {
  activities: Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  suggestions: Activity[];
  setSuggestions: React.Dispatch<React.SetStateAction<Activity[]>>;
  toggleActivityCompletion: (id: string) => void;
  addActivity: (activity: Omit<Activity, "id">) => Activity;
  updateActivity: (id: string, activity: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  resetToDefaultActivities: () => void;
  joinGroupActivity: (activityId: string, userId: string) => boolean;
  leaveGroupActivity: (activityId: string, userId: string) => void;
  getFilteredActivities: () => Activity[];
  getGroupActivities: () => Activity[];
  addSuggestionToSchedule: (suggestion: Activity, startTime: string, endTime: string) => void;
  getDisabilityFilteredActivities: () => Activity[];
  getDisabilityFilteredSuggestions: () => Activity[];
  updateActivityDisabilityRequirements: (activityId: string, requirements: ActivityDisabilityRequirements) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [activities, setActivities] = useState<Activity[]>(defaultActivities);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [suggestions, setSuggestions] = useState<Activity[]>(activitySuggestions);
  const { currentUser } = useUser();
  const [userActivities, setUserActivities] = useState<UserActivities>({});

  // Reset or customize activities when user changes
  useEffect(() => {
    if (currentUser) {
      // Set the flag to indicate we're about to update activities due to user change
      isUpdatingFromUserChange.current = true;
      
      // Check if we have stored activities for this user
      if (userActivities[currentUser.id]) {
        setActivities(userActivities[currentUser.id]);
      } else {
        // Otherwise use default activities
        setActivities(defaultActivities);
      }
    }
  }, [currentUser, userActivities]);

  // Store activities when they change
  // We use a ref to keep track of if the change to activities was made by the first useEffect
  const isUpdatingFromUserChange = React.useRef(false);
  
  useEffect(() => {
    // Only update userActivities if we're not in the middle of updating from user change
    if (currentUser && !isUpdatingFromUserChange.current) {
      setUserActivities(prev => ({
        ...prev,
        [currentUser.id]: activities
      }));
    }
    // Reset the flag
    isUpdatingFromUserChange.current = false;
  }, [activities, currentUser]);

  // Filter activities based on the current day of the week and date
  const getFilteredActivities = (): Activity[] => {
    const dayOfWeek = currentDate.getDay(); // 0 is Sunday, 6 is Saturday
    const dateString = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
    
    return activities.filter(activity => {
      // Check if the activity should be shown on this day
      if (activity.date && activity.date !== dateString) {
        return false;
      }
      
      if (activity.dayOfWeek && !activity.dayOfWeek.includes(dayOfWeek)) {
        return false;
      }
      
      return true;
    });
  };

  // Helper function to check if two time ranges overlap
  const hasTimeConflict = (activity1: Activity, activity2: Activity): boolean => {
    // If either activity doesn't have both start and end times, there's no conflict
    if (!activity1.startTime || !activity1.endTime || !activity2.startTime || !activity2.endTime) {
      return false;
    }

    // Convert time strings to minutes for easier comparison
    const getMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const start1 = getMinutes(activity1.startTime);
    const end1 = getMinutes(activity1.endTime);
    const start2 = getMinutes(activity2.startTime);
    const end2 = getMinutes(activity2.endTime);

    // Check for overlap - if one activity starts during the other activity
    return (start1 < end2 && start2 < end1);
  };

  // Check if an activity is suitable for a user based on their disabilities
  const isActivitySuitableForUser = (activity: Activity): boolean => {
    if (!currentUser || !currentUser.disabilities || !activity.disabilityRequirements) {
      return true; // If no disability info, assume it's suitable
    }

    const { disabilities } = currentUser;
    const { disabilityRequirements } = activity;

    // Check if user has any disabilities that make them unsuitable for this activity
    if (disabilityRequirements.notSuitableFor) {
      for (const disability of disabilityRequirements.notSuitableFor) {
        if (disabilities[disability]) {
          return false;
        }
      }
    }

    // Check sensory sensitivity compatibility
    if (disabilities.sensory_sensitivity && disabilityRequirements.stimuliIntensity) {
      const { stimuliIntensity } = disabilityRequirements;
      // If any stimuli is too intense (level 4-5) for someone with sensory issues
      if ((stimuliIntensity.visual && stimuliIntensity.visual > 3) ||
          (stimuliIntensity.auditory && stimuliIntensity.auditory > 3) ||
          (stimuliIntensity.tactile && stimuliIntensity.tactile > 3)) {
        return false;
      }
    }

    // Check attention span compatibility
    if (disabilities.limited_attention_span && 
        disabilityRequirements.requiredAttentionSpan && 
        disabilityRequirements.requiredAttentionSpan > 20) {
      return false;
    }

    // Check complexity level compatibility
    if (disabilities.abstract_thinking && 
        disabilityRequirements.complexityLevel && 
        disabilityRequirements.complexityLevel > 3) {
      return false;
    }

    return true;
  };

  // Get activities filtered by disability compatibility
  const getDisabilityFilteredActivities = (): Activity[] => {
    const dayActivities = getFilteredActivities();
    
    // If no user or no disabilities, return all activities
    if (!currentUser || !currentUser.disabilities) {
      return dayActivities;
    }
    
    return dayActivities.filter(isActivitySuitableForUser);
  };

  // Get suggestions filtered by disability compatibility
  const getDisabilityFilteredSuggestions = (): Activity[] => {
    // If no user or no disabilities, return all suggestions
    if (!currentUser || !currentUser.disabilities) {
      return suggestions;
    }
    
    return suggestions.filter(isActivitySuitableForUser);
  };

  // Get group activities for the current day that the user can join
  const getGroupActivities = (): Activity[] => {
    if (!currentUser) return [];

    const dayOfWeek = currentDate.getDay();
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Get all activities the user is already enrolled in for the current day
    const userEnrolledActivities = activities.filter(activity => {
      // Check if it's for today
      if (activity.date && activity.date !== dateString) return false;
      if (activity.dayOfWeek && !activity.dayOfWeek.includes(dayOfWeek)) return false;
      
      // Check if user is enrolled
      return activity.participants?.includes(currentUser.id) || 
             activity.userId === currentUser.id || 
             activity.category === 'fixed';
    });

    return activities.filter(activity => {
      // Must be a group activity
      if (activity.category !== 'group') return false;
      
      // Check date/day constraints
      if (activity.date && activity.date !== dateString) return false;
      if (activity.dayOfWeek && !activity.dayOfWeek.includes(dayOfWeek)) return false;
      
      // Check if the user is already a participant
      if (activity.participants?.includes(currentUser.id)) return false;
      
      // Check if there's space available
      if (activity.maxParticipants && 
          activity.participants && 
          activity.participants.length >= activity.maxParticipants) {
        return false;
      }
      
      // Check for time conflicts with other activities the user is already enrolled in
      for (const enrolledActivity of userEnrolledActivities) {
        if (hasTimeConflict(activity, enrolledActivity)) {
          return false;
        }
      }
      
      // Check if activity is suitable based on disabilities
      if (!isActivitySuitableForUser(activity)) {
        return false;
      }
      
      return true;
    });
  };

  // Join a group activity
  const joinGroupActivity = (activityId: string, userId: string): boolean => {
    let success = false;
    
    setActivities(prev => {
      const updatedActivities = prev.map(activity => {
        if (activity.id === activityId) {
          // Check if activity is full
          if (activity.maxParticipants && 
              activity.participants && 
              activity.participants.length >= activity.maxParticipants) {
            return activity;
          }
          
          // Check if user is already in the activity
          if (activity.participants?.includes(userId)) {
            return activity;
          }
          
          success = true;
          return {
            ...activity,
            participants: [...(activity.participants || []), userId]
          };
        }
        return activity;
      });
      
      return updatedActivities;
    });
    
    return success;
  };

  // Leave a group activity
  const leaveGroupActivity = (activityId: string, userId: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === activityId && activity.participants) {
          return {
            ...activity,
            participants: activity.participants.filter(id => id !== userId)
          };
        }
        return activity;
      })
    );
  };

  // Update activity disability requirements
  const updateActivityDisabilityRequirements = (activityId: string, requirements: ActivityDisabilityRequirements) => {
    setActivities(prev =>
      prev.map(activity => {
        if (activity.id === activityId) {
          return {
            ...activity,
            disabilityRequirements: {
              ...activity.disabilityRequirements,
              ...requirements
            }
          };
        }
        return activity;
      })
    );
  };

  // Add a suggestion to the user's schedule
  const addSuggestionToSchedule = (suggestion: Activity, startTime: string, endTime: string) => {
    if (!currentUser) return;
    
    const newActivity: Omit<Activity, "id"> = {
      ...suggestion,
      startTime,
      endTime,
      category: "free",
      date: currentDate.toISOString().split('T')[0],
    };
    
    addActivity(newActivity);
  };

  const toggleActivityCompletion = (id: string) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id
          ? { ...activity, completed: !activity.completed }
          : activity
      )
    );
  };

  const addActivity = (activity: Omit<Activity, "id">) => {
    const newActivity = {
      ...activity,
      id: `activity-${Date.now()}`,
    };
    setActivities([...activities, newActivity]);
    return newActivity;
  };

  const updateActivity = (id: string, activityData: Partial<Activity>) => {
    setActivities(
      activities.map((activity) =>
        activity.id === id ? { ...activity, ...activityData } : activity
      )
    );
  };

  const deleteActivity = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
  };

  const resetToDefaultActivities = () => {
    setActivities(defaultActivities);
    setSuggestions(activitySuggestions);
    setUserActivities({});
  };

  return (
    <ScheduleContext.Provider
      value={{
        activities,
        setActivities,
        currentDate,
        setCurrentDate,
        suggestions,
        setSuggestions,
        toggleActivityCompletion,
        addActivity,
        updateActivity,
        deleteActivity,
        resetToDefaultActivities,
        joinGroupActivity,
        leaveGroupActivity,
        getFilteredActivities,
        getGroupActivities,
        addSuggestionToSchedule,
        getDisabilityFilteredActivities,
        getDisabilityFilteredSuggestions,
        updateActivityDisabilityRequirements,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = (): ScheduleContextType => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};
