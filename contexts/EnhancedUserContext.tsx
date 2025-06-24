import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToStorage, loadFromStorage } from '../utils/storage';

// Define types
export type Disability = {
  language: boolean;
  planning: boolean;
  sensory: boolean;
  motor: boolean;
  social: boolean;
  cognitive: boolean;
};

export type Preferences = {
  simplifiedLanguage: boolean;
  enhancedVisualSupport: boolean;
  highContrast: boolean;
  largerText: boolean;
};

export type User = {
  id: string;
  name: string;
  avatar?: string;
  disabilities: Disability;
  preferences: Preferences;
};

// Mock users data for Figma preview
const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Jan Jansen",
    avatar: "/avatars/user1.png",
    disabilities: {
      language: true,
      planning: false,
      sensory: false,
      motor: true,
      social: false,
      cognitive: false
    },
    preferences: {
      simplifiedLanguage: true,
      enhancedVisualSupport: true,
      highContrast: false,
      largerText: true
    }
  },
  {
    id: "user-2",
    name: "Petra Peters",
    avatar: "/avatars/user2.png",
    disabilities: {
      language: false,
      planning: true,
      sensory: true,
      motor: false,
      social: false,
      cognitive: true
    },
    preferences: {
      simplifiedLanguage: false,
      enhancedVisualSupport: true,
      highContrast: true,
      largerText: true
    }
  },
  {
    id: "user-3",
    name: "Thomas Thomassen",
    avatar: "/avatars/user3.png",
    disabilities: {
      language: false,
      planning: false,
      sensory: false,
      motor: false,
      social: true,
      cognitive: false
    },
    preferences: {
      simplifiedLanguage: false,
      enhancedVisualSupport: false,
      highContrast: false,
      largerText: false
    }
  },
  {
    id: "user-4",
    name: "Sanne Sanders",
    avatar: "/avatars/user4.png",
    disabilities: {
      language: true,
      planning: true,
      sensory: false,
      motor: false,
      social: true,
      cognitive: true
    },
    preferences: {
      simplifiedLanguage: true,
      enhancedVisualSupport: true,
      highContrast: true,
      largerText: true
    }
  },
  {
    id: "user-5",
    name: "Kees Klaasen",
    avatar: "/avatars/user5.png",
    disabilities: {
      language: false,
      planning: false,
      sensory: true,
      motor: true,
      social: false,
      cognitive: false
    },
    preferences: {
      simplifiedLanguage: false,
      enhancedVisualSupport: true,
      highContrast: false,
      largerText: false
    }
  }
];

// Define the context type
type UserContextType = {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateUserPreferences: (preferences: Partial<Preferences>) => void;
  loadUsers: () => void;
  persistUserData: () => void;
  addUser: (user: Omit<User, 'id'>) => User;
  updateUser: (id: string, userData: Partial<User>) => void;
  deleteUser: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  // Admin-related functions
  authenticateAdmin: (password: string) => boolean;
  toggleAdminMode: () => void;
  isAdmin: boolean;
};

// Create the context with default values
const UserContext = createContext<UserContextType>({
  users: [],
  currentUser: null,
  setCurrentUser: () => {},
  updateUserPreferences: () => {},
  loadUsers: () => {},
  persistUserData: () => {},
  addUser: () => ({ 
    id: "", 
    name: "", 
    disabilities: { language: false, planning: false, sensory: false, motor: false, social: false, cognitive: false },
    preferences: { simplifiedLanguage: false, enhancedVisualSupport: false, highContrast: false, largerText: false }
  }),
  updateUser: () => {},
  deleteUser: () => {},
  isLoading: false,
  error: null,
  authenticateAdmin: () => false,
  toggleAdminMode: () => {},
  isAdmin: false
});

// Create the provider component
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load users from mock data for Figma
  const loadUsers = () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In Figma, we'll just use our mock data
      setUsers(MOCK_USERS);
      setIsLoading(false);
    } catch (err) {
      setError('Fout bij het laden van gebruikers');
      setIsLoading(false);
      console.error('Error loading users:', err);
    }
  };

  // Load users on initial render
  useEffect(() => {
    loadUsers();
    
    // Check for saved current user
    const savedUserId = localStorage.getItem('currentUserId');
    if (savedUserId) {
      // Simulate a slight delay for loading effect
      setTimeout(() => {
        const foundUser = MOCK_USERS.find(user => user.id === savedUserId);
        if (foundUser) {
          setCurrentUser(foundUser);
        }
      }, 300);
    }
  }, []);

  // Update user preferences
  const updateUserPreferences = (preferences: Partial<Preferences>) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        preferences: {
          ...currentUser.preferences,
          ...preferences
        }
      };
      
      setCurrentUser(updatedUser);
      
      // Update in users array
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === currentUser.id ? updatedUser : user
        )
      );
      
      // Apply preferences to document if needed
      if (preferences.highContrast !== undefined) {
        document.documentElement.classList.toggle('high-contrast', preferences.highContrast);
      }
      if (preferences.simplifiedLanguage !== undefined) {
        document.documentElement.classList.toggle('simplified', preferences.simplifiedLanguage);
      }
      if (preferences.largerText !== undefined) {
        document.documentElement.style.setProperty(
          '--font-size', 
          preferences.largerText ? '18px' : '16px'
        );
      }
    }
  };

  // Persist user data (mock implementation for Figma)
  const persistUserData = () => {
    if (currentUser) {
      // Save current user ID to localStorage
      localStorage.setItem('currentUserId', currentUser.id);
    }
  };

  // Add a new user (mock implementation for Figma)
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `user-${users.length + 1}`
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    return newUser;
  };

  // Update a user (mock implementation for Figma)
  const updateUser = (id: string, userData: Partial<User>) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, ...userData } : user
      )
    );
    
    // If updating current user, update currentUser state too
    if (currentUser && currentUser.id === id) {
      setCurrentUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  // Delete a user (mock implementation for Figma)
  const deleteUser = (id: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    
    // If deleting current user, clear currentUser state
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }
  };

  // Authenticate admin
  const authenticateAdmin = (password: string): boolean => {
    // Simple mock authentication for Figma preview
    const success = password === "admin123";
    if (success) {
      setIsAdmin(true);
    }
    return success;
  };

  // Toggle admin mode
  const toggleAdminMode = () => {
    setIsAdmin(prev => !prev);
  };

  // Context value
  const value = {
    users,
    currentUser,
    setCurrentUser,
    updateUserPreferences,
    loadUsers,
    persistUserData,
    addUser,
    updateUser,
    deleteUser,
    isLoading,
    error,
    authenticateAdmin,
    toggleAdminMode,
    isAdmin
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}