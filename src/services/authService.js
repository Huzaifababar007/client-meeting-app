import { api } from './api';

const API_URL = '/auth';

// Set auth token in localStorage (api service handles headers)
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

// Get token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Login user
export const loginUser = async (email, password) => {
  try {
    const response = await api.post(`${API_URL}/login`, { email, password });
    const { token, user } = response.data;
    setAuthToken(token);
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed' 
    };
  }
};

// Register user
export const registerUser = async (fullName, email, password) => {
  try {
    const response = await api.post(`${API_URL}/register`, { 
      fullName, 
      email, 
      password 
    });
    const { token, user } = response.data;
    setAuthToken(token);
    return { success: true, user };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Registration failed' 
    };
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get(`${API_URL}/profile`);
    return { success: true, user: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to get profile' 
    };
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put(`${API_URL}/profile`, profileData);
    return { success: true, user: response.data.user };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update profile' 
    };
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await api.post(`${API_URL}/forgot-password`, { email });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to send reset email' 
    };
  }
};

// Reset password
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await api.post(`${API_URL}/reset-password`, { 
      email, 
      newPassword 
    });
    return { success: true, message: response.data.message };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to reset password' 
    };
  }
};

// Logout user
export const logoutUser = () => {
  setAuthToken(null);
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};
