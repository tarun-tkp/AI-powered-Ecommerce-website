import axios from 'axios';

// Base URL for the backend API (using Vite proxy)
const API_BASE_URL = '/api/chat';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Send a message to the AI using GET request
 * @param {string} message - The user's message
 * @returns {Promise} Promise with the AI response
 */
export const sendMessageGet = async (message) => {
  try {
    const response = await api.get('', {
      params: { message },
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Send a message to the AI using POST request
 * @param {string} message - The user's message
 * @returns {Promise} Promise with the AI response
 */
export const sendMessagePost = async (message) => {
  try {
    const response = await api.post('', {
      message,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Handle API errors and return user-friendly error messages
 * @param {Error} error - The error object
 * @returns {Error} Error with user-friendly message
 */
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;
    
    if (status === 400) {
      return new Error(data.message || 'Bad Request: Invalid input');
    } else if (status === 500) {
      return new Error(data.message || 'Server Error: Please try again later');
    } else {
      return new Error(data.message || `Error: ${status}`);
    }
  } else if (error.request) {
    // Request made but no response received
    return new Error('Network Error: No response from server');
  } else {
    // Error in setting up the request
    return new Error('Error: Failed to send request');
  }
};

export default api;
