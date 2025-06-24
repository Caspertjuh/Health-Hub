
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// Define types for our user profiles
export type UserPreference = "text" | "pictograms" | "colors" | "both";

// Define disability types
export type DisabilityType = 
  | "language_comprehension"  // Taalbegrip en communicatieproblemen
  | "planning_organization"   // Moeite met plannen en organiseren
  | "low_frustration_tolerance" // Lage frustratietolerantie
  | "limited_attention_span"  // Beperkte aandachtsspanne
  | "abstract_thinking"       // Moeite met abstract denken of complexe instructies
  | "sensory_sensitivity"     // Overgevoeligheid voor prikkels (auditief/visueel)
  | "anxiety_confusion"       // Angstig of snel verward bij nieuwe situaties
  | "visual_support_need";    // Behoefte aan extra visuele ondersteuning

export interface Disabilities {
  language_comprehension?: boolean;
  planning_organization?: boolean;
  low_frustration_tolerance?: boolean;
  limited_attention_span?: boolean;
  abstract_thinking?: boolean;
  sensory_sensitivity?: boolean;
  anxiety_confusion?: boolean;
  visual_support_need?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar?: string;
  preferences: {
    useText: boolean;
    usePictograms: boolean;
    useColors: boolean;
  };
  disabilities?: Disabilities;
  isAdmin?: boolean;
}

// Settings for UI adaptations based on disabilities
export interface AdaptiveUISettings {
  simplifiedLanguage: boolean;
  enhancedVisualSupport: boolean;
  reducedSteps: boolean;
  largerControls: boolean;
  fewerAnimations: boolean;
  reducedStimuli: boolean;
  structuredLayout: boolean;
  timeIndicators: boolean;
}

// Sample user data with real images
const defaultUsers: UserProfile[] = [
  {
    id: "1",
    name: "Jan",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=250&h=250&auto=format&fit=crop",
    preferences: {
      useText: true,
      usePictograms: true,
      useColors: true,
    },
    disabilities: {
      language_comprehension: true,
      limited_attention_span: true,
      visual_support_need: true,
    }
  },
  {
    id: "2",
    name: "Lisa",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=250&h=250&auto=format&fit=crop",
    preferences: {
      useText: true,
      usePictograms: false,
      useColors: false,
    },
    disabilities: {
      planning_organization: true,
      abstract_thinking: true,
    }
  },
  {
    id: "3",
    name: "Piet",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop",
    preferences: {
      useText: false,
      usePictograms: true,
      useColors: false,
    },
    disabilities: {
      sensory_sensitivity: true,
      anxiety_confusion: true,
    }
  },
  {
    id: "4",
    name: "Emma",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=250&h=250&auto=format&fit=crop",
    preferences: {
      useText: true,
      usePictograms: true,
      useColors: true,
    },
    disabilities: {
      low_frustration_tolerance: true,
      limited_attention_span: true,
    }
  },
  {
    id: "5",
    name: "Thomas",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=250&h=250&auto=format&fit=crop",
    preferences: {
      useText: true,
      usePictograms: true,
      useColors: false,
    },
    disabilities: {
      abstract_thinking: true,
      planning_organization: true,
      language_comprehension: true,
    }
  },
  {
    id: "admin",
    name: "Beheerder",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&h=250&auto=format&fit=crop",
    preferences: {
      useText: true,
      usePictograms: true,
      useColors: true,
    },
    isAdmin: true,
  },
];

// Authentication data for admin
interface AdminAuth {
  username: string;
  password: string;
}

const adminCredentials: AdminAuth = {
  username: "Admin",
  password: "Admin",
};

// Create the user context
interface UserContextType {
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  addUser: (user: Omit<UserProfile, "id">) => UserProfile;
  updateUser: (id: string, user: Partial<UserProfile>) => void;
  deleteUser: (id: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  useLargeText: boolean;
  setUseLargeText: React.Dispatch<React.SetStateAction<boolean>>;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
  isAdminAuthenticated: boolean;
  getAdaptiveUISettings: (user: UserProfile | null) => AdaptiveUISettings;
  updateUserDisabilities: (userId: string, disabilities: Disabilities) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<UserProfile[]>(defaultUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [useLargeText, setUseLargeText] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Apply dark mode and text size effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (useLargeText) {
      root.style.setProperty("--font-size", "18px");
    } else {
      root.style.setProperty("--font-size", "14px");
    }
  }, [useLargeText]);

  // Apply adaptive UI settings based on user disabilities
  useEffect(() => {
    if (currentUser && currentUser.disabilities) {
      // Get adaptive settings based on disabilities
      const settings = getAdaptiveUISettings(currentUser);
      
      // Apply visual adaptations based on settings
      const root = window.document.documentElement;
      
      // Set larger text if needed for language comprehension or visual support
      if (settings.largerControls) {
        root.style.setProperty("--font-size", "18px");
      }
      
      // Other adaptations can be applied here
    }
  }, [currentUser]);

  const toggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      // If not authenticated, this will just show the login screen
      setIsAdminMode(true);
    }
  };

  const adminLogin = (username: string, password: string): boolean => {
    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    setIsAdminMode(false);
  };

  const addUser = (user: Omit<UserProfile, "id">) => {
    const newUser = {
      ...user,
      id: `user-${Date.now()}`,
    };
    setUsers([...users, newUser]);
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<UserProfile>) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      )
    );
    
    // If updating the current user, also update currentUser state
    if (currentUser && currentUser.id === id) {
      setCurrentUser({ ...currentUser, ...userData });
    }
  };

  const deleteUser = (id: string) => {
    // Don't allow deleting the admin user
    if (id === "admin") return;
    
    setUsers(users.filter((user) => user.id !== id));
    
    // If deleting the current user, log out
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }
  };

  // Update disabilities specifically for a user
  const updateUserDisabilities = (userId: string, disabilities: Disabilities) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          disabilities: {
            ...user.disabilities,
            ...disabilities
          }
        };
      }
      return user;
    }));
    
    // If updating the current user, also update currentUser state
    if (currentUser && currentUser.id === userId) {
      setCurrentUser({
        ...currentUser,
        disabilities: {
          ...currentUser.disabilities,
          ...disabilities
        }
      });
    }
  };

  // Generate adaptive UI settings based on disabilities
  const getAdaptiveUISettings = (user: UserProfile | null): AdaptiveUISettings => {
    const defaultSettings: AdaptiveUISettings = {
      simplifiedLanguage: false,
      enhancedVisualSupport: false,
      reducedSteps: false,
      largerControls: false,
      fewerAnimations: false,
      reducedStimuli: false,
      structuredLayout: false,
      timeIndicators: false,
    };

    if (!user || !user.disabilities) return defaultSettings;

    const { disabilities } = user;
    return {
      // Simplified language for those with language comprehension or abstract thinking issues
      simplifiedLanguage: Boolean(disabilities.language_comprehension || disabilities.abstract_thinking),
      
      // Enhanced visual support for those with visual support needs
      enhancedVisualSupport: Boolean(disabilities.visual_support_need),
      
      // Reduced steps/workflow for planning issues or attention span
      reducedSteps: Boolean(disabilities.planning_organization || disabilities.limited_attention_span),
      
      // Larger controls for attention span or visual support
      largerControls: Boolean(disabilities.limited_attention_span || disabilities.visual_support_need),
      
      // Fewer animations for sensory sensitivity
      fewerAnimations: Boolean(disabilities.sensory_sensitivity),
      
      // Reduced stimuli for sensory issues or anxiety
      reducedStimuli: Boolean(disabilities.sensory_sensitivity || disabilities.anxiety_confusion),
      
      // Structured layout for organization or anxiety
      structuredLayout: Boolean(disabilities.planning_organization || disabilities.anxiety_confusion),
      
      // Time indicators for planning or abstract thinking issues
      timeIndicators: Boolean(disabilities.planning_organization || disabilities.abstract_thinking),
    };
  };

  return (
    <UserContext.Provider
      value={{
        users,
        setUsers,
        currentUser,
        setCurrentUser,
        isAdminMode,
        toggleAdminMode,
        addUser,
        updateUser,
        deleteUser,
        isDarkMode,
        setIsDarkMode,
        useLargeText,
        setUseLargeText,
        adminLogin,
        adminLogout,
        isAdminAuthenticated,
        getAdaptiveUISettings,
        updateUserDisabilities,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
