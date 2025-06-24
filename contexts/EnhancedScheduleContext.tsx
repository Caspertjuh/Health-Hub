import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, useUser } from './EnhancedUserContext';
import { saveToStorage, loadFromStorage } from '../utils/storage';

// Activity types
export type ActivityType = 
  | 'hygiene' 
  | 'meal' 
  | 'medication' 
  | 'therapy' 
  | 'exercise' 
  | 'social' 
  | 'entertainment' 
  | 'creative' 
  | 'education' 
  | 'other';

export type ActivityCategory = 'fixed' | 'flexible' | 'group';

export type RequiredSupport = {
  language: boolean;
  planning: boolean;
  sensory: boolean;
  motor: boolean;
  social: boolean;
  cognitive: boolean;
};

export type Participant = {
  id: string;
  name: string;
};

export type Activity = {
  id: string;
  templateId?: string;
  userId?: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  date: string;
  location?: string;
  category: ActivityCategory;
  type: ActivityType;
  icon: string;
  color: string;
  completed: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  requiredSupport: RequiredSupport;
  maxParticipants?: number;
  participants?: Participant[];
};

export type ActivityTemplate = {
  id: string;
  title: string;
  description?: string;
  category: ActivityCategory;
  type: ActivityType;
  icon: string;
  color: string;
  location?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  requiredSupport: RequiredSupport;
};

// Mock data for Figma preview
const MOCK_TEMPLATES: ActivityTemplate[] = [
  {
    id: "template-fixed-1",
    title: "Ontbijt",
    description: "Ontbijt in de gemeenschappelijke ruimte",
    category: "fixed",
    type: "meal",
    icon: "utensils",
    color: "#FF9F1C",
    location: "Eetzaal",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: false,
      sensory: false,
      motor: false,
      social: false,
      cognitive: false
    }
  },
  {
    id: "template-fixed-2",
    title: "Medicatie",
    description: "Ochtendmedicatie innemen",
    category: "fixed",
    type: "medication",
    icon: "pill",
    color: "#2EC4B6",
    location: "Zorgpost",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: true,
      sensory: false,
      motor: false,
      social: false,
      cognitive: false
    }
  },
  {
    id: "template-flex-1",
    title: "Wandelen",
    description: "Een rustige wandeling buiten",
    category: "flexible",
    type: "exercise",
    icon: "walking",
    color: "#98FB98",
    location: "Buiten",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: false,
      sensory: false,
      motor: true,
      social: false,
      cognitive: false
    }
  },
  {
    id: "template-group-1",
    title: "Spelletjesmiddag",
    description: "Gezellig samen bordspellen spelen",
    category: "group",
    type: "social",
    icon: "puzzle-piece",
    color: "#B0E0E6",
    location: "Activiteitenruimte",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: false,
      sensory: false,
      motor: false,
      social: true,
      cognitive: false
    }
  },
  // Added more templates for afternoon and evening activities
  {
    id: "template-fixed-lunch",
    title: "Lunch",
    description: "Lunch in de gemeenschappelijke ruimte",
    category: "fixed",
    type: "meal",
    icon: "utensils",
    color: "#F4A261",
    location: "Eetzaal",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: false,
      sensory: false,
      motor: false,
      social: false,
      cognitive: false
    }
  },
  {
    id: "template-fixed-dinner",
    title: "Avondeten",
    description: "Avondmaaltijd in de gemeenschappelijke ruimte",
    category: "fixed",
    type: "meal",
    icon: "utensils",
    color: "#E76F51",
    location: "Eetzaal",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: false,
      sensory: false,
      motor: false,
      social: false,
      cognitive: false
    }
  },
  {
    id: "template-evening-med",
    title: "Avondmedicatie",
    description: "Avondmedicatie innemen",
    category: "fixed",
    type: "medication",
    icon: "pill",
    color: "#2A9D8F",
    location: "Zorgpost",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: true,
      sensory: false,
      motor: false,
      social: false,
      cognitive: false
    }
  },
  {
    id: "template-creative",
    title: "Creatieve Workshop",
    description: "Tekenen en schilderen",
    category: "flexible",
    type: "creative",
    icon: "palette",
    color: "#9370DB",
    location: "Activiteitenruimte",
    difficulty: "medium",
    requiredSupport: {
      language: false,
      planning: false,
      sensory: true,
      motor: true,
      social: false,
      cognitive: false
    }
  },
  {
    id: "template-movie",
    title: "Filmavond",
    description: "Gezamenlijk film kijken",
    category: "group",
    type: "entertainment",
    icon: "film",
    color: "#8A2BE2",
    location: "Gemeenschapsruimte",
    difficulty: "easy",
    requiredSupport: {
      language: false,
      planning: false,
      sensory: true,
      motor: false,
      social: true,
      cognitive: false
    }
  }
];

// Generate mock activities for today's date
const generateMockActivities = (userId: string): Activity[] => {
  const today = new Date().toISOString().split('T')[0];
  
  return [
    // Morning activities
    {
      id: `activity-fixed-1-${userId}-${today}`,
      templateId: "template-fixed-1",
      userId: userId,
      title: "Ontbijt",
      description: "Ontbijt in de gemeenschappelijke ruimte",
      startTime: "08:00",
      endTime: "09:00",
      date: today,
      location: "Eetzaal",
      category: "fixed",
      type: "meal",
      icon: "utensils",
      color: "#FF9F1C",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: false,
        sensory: false,
        motor: false,
        social: false,
        cognitive: false
      }
    },
    {
      id: `activity-fixed-2-${userId}-${today}`,
      templateId: "template-fixed-2",
      userId: userId,
      title: "Medicatie",
      description: "Ochtendmedicatie innemen",
      startTime: "09:30",
      endTime: "09:45",
      date: today,
      location: "Zorgpost",
      category: "fixed",
      type: "medication",
      icon: "pill",
      color: "#2EC4B6",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: true,
        sensory: false,
        motor: false,
        social: false,
        cognitive: false
      }
    },
    {
      id: `activity-flex-1-${userId}-${today}`,
      templateId: "template-flex-1",
      userId: userId,
      title: "Wandelen",
      description: "Een rustige wandeling buiten",
      startTime: "10:00",
      endTime: "11:00",
      date: today,
      location: "Buiten",
      category: "flexible",
      type: "exercise",
      icon: "walking",
      color: "#98FB98",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: false,
        sensory: false,
        motor: true,
        social: false,
        cognitive: false
      }
    },
    
    // Afternoon activities
    {
      id: `activity-fixed-lunch-${userId}-${today}`,
      templateId: "template-fixed-lunch",
      userId: userId,
      title: "Lunch",
      description: "Lunch in de gemeenschappelijke ruimte",
      startTime: "12:30",
      endTime: "13:30",
      date: today,
      location: "Eetzaal",
      category: "fixed",
      type: "meal",
      icon: "utensils",
      color: "#F4A261",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: false,
        sensory: false,
        motor: false,
        social: false,
        cognitive: false
      }
    },
    {
      id: `activity-creative-${userId}-${today}`,
      templateId: "template-creative",
      userId: userId,
      title: "Creatieve Workshop",
      description: "Tekenen en schilderen",
      startTime: "14:00",
      endTime: "15:00",
      date: today,
      location: "Activiteitenruimte",
      category: "flexible",
      type: "creative",
      icon: "palette",
      color: "#9370DB",
      completed: false,
      difficulty: "medium",
      requiredSupport: {
        language: false,
        planning: false,
        sensory: true,
        motor: true,
        social: false,
        cognitive: false
      }
    },
    {
      id: `activity-group-1-${today}`,
      templateId: "template-group-1",
      title: "Spelletjesmiddag",
      description: "Gezellig samen bordspellen spelen",
      startTime: "15:30",
      endTime: "17:00",
      date: today,
      location: "Activiteitenruimte",
      category: "group",
      type: "social",
      icon: "puzzle-piece",
      color: "#B0E0E6",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: false,
        sensory: false,
        motor: false,
        social: true,
        cognitive: false
      },
      maxParticipants: 8,
      participants: [
        { id: userId, name: "User" }
      ]
    },
    
    // Evening activities
    {
      id: `activity-fixed-dinner-${userId}-${today}`,
      templateId: "template-fixed-dinner",
      userId: userId,
      title: "Avondeten",
      description: "Avondmaaltijd in de gemeenschappelijke ruimte",
      startTime: "18:00",
      endTime: "19:00",
      date: today,
      location: "Eetzaal",
      category: "fixed",
      type: "meal",
      icon: "utensils",
      color: "#E76F51",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: false,
        sensory: false,
        motor: false,
        social: false,
        cognitive: false
      }
    },
    {
      id: `activity-evening-med-${userId}-${today}`,
      templateId: "template-evening-med",
      userId: userId,
      title: "Avondmedicatie",
      description: "Avondmedicatie innemen",
      startTime: "19:30",
      endTime: "19:45",
      date: today,
      location: "Zorgpost",
      category: "fixed",
      type: "medication",
      icon: "pill",
      color: "#2A9D8F",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: true,
        sensory: false,
        motor: false,
        social: false,
        cognitive: false
      }
    },
    {
      id: `activity-movie-${today}`,
      templateId: "template-movie",
      title: "Filmavond",
      description: "Gezamenlijk film kijken",
      startTime: "20:00",
      endTime: "22:00",
      date: today,
      location: "Gemeenschapsruimte",
      category: "group",
      type: "entertainment",
      icon: "film",
      color: "#8A2BE2",
      completed: false,
      difficulty: "easy",
      requiredSupport: {
        language: false,
        planning: false,
        sensory: true,
        motor: false,
        social: true,
        cognitive: false
      },
      maxParticipants: 12,
      participants: []
    }
  ];
};

// Context type
type ScheduleContextType = {
  activities: Activity[];
  loadActivities: (userId: string, date: string) => void;
  addActivity: (activity: Omit<Activity, 'id'>) => Activity;
  updateActivity: (id: string, activityData: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
  templates: ActivityTemplate[];
  loadTemplates: () => void;
  addTemplate: (template: Omit<ActivityTemplate, 'id'>) => ActivityTemplate;
  updateTemplate: (id: string, templateData: Partial<ActivityTemplate>) => void;
  deleteTemplate: (id: string) => void;
  generateSchedule: (userId: string, date: string) => void;
  markActivityCompleted: (id: string, completed: boolean) => void;
  joinGroupActivity: (activityId: string, userId: string) => boolean;
  leaveGroupActivity: (activityId: string, userId: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  isLoading: boolean;
  error: string | null;
  persistScheduleData: () => void;
};

// Create context with default values
const ScheduleContext = createContext<ScheduleContextType>({
  activities: [],
  loadActivities: () => {},
  addActivity: () => ({
    id: '',
    title: '',
    date: '',
    category: 'fixed',
    type: 'other',
    icon: '',
    color: '',
    completed: false,
    requiredSupport: {
      language: false,
      planning: false,
      sensory: false,
      motor: false,
      social: false,
      cognitive: false
    }
  }),
  updateActivity: () => {},
  deleteActivity: () => {},
  templates: [],
  loadTemplates: () => {},
  addTemplate: () => ({
    id: '',
    title: '',
    category: 'fixed',
    type: 'other',
    icon: '',
    color: '',
    requiredSupport: {
      language: false,
      planning: false,
      sensory: false,
      motor: false,
      social: false,
      cognitive: false
    }
  }),
  updateTemplate: () => {},
  deleteTemplate: () => {},
  generateSchedule: () => {},
  markActivityCompleted: () => {},
  joinGroupActivity: () => false,
  leaveGroupActivity: () => {},
  selectedDate: new Date().toISOString().split('T')[0],
  setSelectedDate: () => {},
  isLoading: false,
  error: null,
  persistScheduleData: () => {}
});

// Provider component
export function ScheduleProvider({ children }: { children: React.ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useUser();

  // Load activity templates
  const loadTemplates = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In Figma, we'll just use our mock data
      setTemplates(MOCK_TEMPLATES);
      setIsLoading(false);
    } catch (err) {
      setError('Fout bij het laden van activiteit templates');
      setIsLoading(false);
      console.error('Error loading templates:', err);
    }
  };

  // Load activities for a user and date
  const loadActivities = (userId: string, date: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In Figma, generate mock activities
      const mockActivities = generateMockActivities(userId);
      setActivities(mockActivities);
      setIsLoading(false);
    } catch (err) {
      setError('Fout bij het laden van activiteiten');
      setIsLoading(false);
      console.error('Error loading activities:', err);
    }
  };

  // Add activity
  const addActivity = (activityData: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: `activity-${Date.now()}`
    };
    
    setActivities(prev => [...prev, newActivity]);
    return newActivity;
  };

  // Update activity
  const updateActivity = (id: string, activityData: Partial<Activity>) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, ...activityData } : activity
      )
    );
  };

  // Delete activity
  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id));
  };

  // Add template
  const addTemplate = (templateData: Omit<ActivityTemplate, 'id'>) => {
    const newTemplate: ActivityTemplate = {
      ...templateData,
      id: `template-${Date.now()}`
    };
    
    setTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  };

  // Update template
  const updateTemplate = (id: string, templateData: Partial<ActivityTemplate>) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === id ? { ...template, ...templateData } : template
      )
    );
  };

  // Delete template
  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(template => template.id !== id));
  };

  // Generate schedule for a user
  const generateSchedule = (userId: string, date: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In Figma, generate mock activities
      const mockActivities = generateMockActivities(userId);
      setActivities(mockActivities);
      setIsLoading(false);
    } catch (err) {
      setError('Fout bij het genereren van schema');
      setIsLoading(false);
      console.error('Error generating schedule:', err);
    }
  };

  // Mark activity as completed
  const markActivityCompleted = (id: string, completed: boolean) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.id === id ? { ...activity, completed } : activity
      )
    );
  };

  // Join group activity
  const joinGroupActivity = (activityId: string, userId: string): boolean => {
    let success = false;
    
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === activityId && activity.category === 'group') {
          const participants = activity.participants || [];
          
          // Check if user is already in the activity
          if (participants.some(p => p.id === userId)) {
            return activity;
          }
          
          // Check if activity is full
          if (activity.maxParticipants && participants.length >= activity.maxParticipants) {
            return activity;
          }
          
          // Add user to participants
          success = true;
          const userName = currentUser?.name || 'Unknown User';
          return {
            ...activity,
            participants: [...participants, { id: userId, name: userName }]
          };
        }
        return activity;
      })
    );
    
    return success;
  };

  // Leave group activity
  const leaveGroupActivity = (activityId: string, userId: string) => {
    setActivities(prev => 
      prev.map(activity => {
        if (activity.id === activityId && activity.category === 'group' && activity.participants) {
          return {
            ...activity,
            participants: activity.participants.filter(p => p.id !== userId)
          };
        }
        return activity;
      })
    );
  };

  // Persist schedule data
  const persistScheduleData = () => {
    // Mock function for Figma preview
    // In a real app, this would save to the backend or localStorage
    console.log('Persisting schedule data (mock function)');
  };

  // Load templates on initial render
  useEffect(() => {
    loadTemplates();
  }, []);

  // Load activities when user or date changes
  useEffect(() => {
    if (currentUser) {
      loadActivities(currentUser.id, selectedDate);
    }
  }, [currentUser, selectedDate]);

  // Context value
  const value = {
    activities,
    loadActivities,
    addActivity,
    updateActivity,
    deleteActivity,
    templates,
    loadTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    generateSchedule,
    markActivityCompleted,
    joinGroupActivity,
    leaveGroupActivity,
    selectedDate,
    setSelectedDate,
    isLoading,
    error,
    persistScheduleData
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
}

// Custom hook to use the context
export function useSchedule() {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
}