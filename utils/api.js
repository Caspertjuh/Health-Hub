/**
 * API client utilities for the Day Planning Application
 * Provides functions to interact with the backend API
 */

// Base URL for API requests
const API_BASE_URL = '/api';

// Helper to handle fetch requests with proper error handling
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    // Set default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // If we have a token in localStorage, add it to the headers
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Make the fetch request
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse the response
    const data = await response.json();

    // If response is not ok, throw an error
    if (!response.ok) {
      throw new Error(data.error || `Error: ${response.statusText}`);
    }

    // Return the data
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Authentication API
export const authApi = {
  // Login
  login: async (username, password) => {
    const data = await fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    // Save token in localStorage
    if (data.token) {
      localStorage.setItem('auth_token', data.token);
    }

    return data;
  },

  // Get current user info
  getCurrentUser: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/auth/me`);
  },

  // Logout
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Users API
export const usersApi = {
  // Get all users
  getAllUsers: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/users`);
  },

  // Get user by ID
  getUserById: async (id) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/users/${id}`);
  },

  // Create user
  createUser: async (userData) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Update user
  updateUser: async (id, userData) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (id) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Activities API
export const activitiesApi = {
  // Get activities for user and date
  getUserActivities: async (userId, date) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/user/${userId}/date/${date}`);
  },

  // Get all activity templates
  getAllTemplates: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/templates`);
  },

  // Get template by ID
  getTemplateById: async (id) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/templates/${id}`);
  },

  // Create activity template
  createTemplate: async (templateData) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/templates`, {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  // Update activity template
  updateTemplate: async (id, templateData) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  },

  // Create activity from template
  createActivityFromTemplate: async (templateId, activityData) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/from-template/${templateId}`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },

  // Update activity completion status
  updateActivityCompletion: async (id, completed) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/${id}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  },

  // Join group activity
  joinGroupActivity: async (activityId, userId) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/${activityId}/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Leave group activity
  leaveGroupActivity: async (activityId, userId) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/${activityId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  // Generate activities for user
  generateActivities: async (userId, date) => {
    return fetchWithErrorHandling(`${API_BASE_URL}/activities/generate/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ date }),
    });
  },
};

// Health check API
export const healthApi = {
  // Check if API is running
  checkHealth: async () => {
    return fetchWithErrorHandling(`${API_BASE_URL}/health`);
  },
};

// Export all APIs
export default {
  auth: authApi,
  users: usersApi,
  activities: activitiesApi,
  health: healthApi,
};