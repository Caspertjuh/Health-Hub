/**
 * Storage utilities for Figma preview
 * These functions handle local data persistence
 */

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Save data to storage
export function saveToStorage<T>(key: string, data: T): void {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  } else {
    console.warn('localStorage is not available. Data will not persist between sessions.');
  }
}

// Load data from storage
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (isLocalStorageAvailable()) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading from localStorage (${key}):`, error);
      return defaultValue;
    }
  } else {
    console.warn('localStorage is not available. Using default values.');
    return defaultValue;
  }
}

// Remove data from storage
export function removeFromStorage(key: string): void {
  if (isLocalStorageAvailable()) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  }
}

// Clear all app-related data from storage
export function clearAppStorage(prefix: string = 'app_'): void {
  if (isLocalStorageAvailable()) {
    try {
      Object.keys(localStorage)
        .filter(key => key.startsWith(prefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing app storage:', error);
    }
  }
}

export default {
  save: saveToStorage,
  load: loadFromStorage,
  remove: removeFromStorage,
  clear: clearAppStorage
};