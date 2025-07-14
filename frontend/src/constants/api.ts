// API Configuration
export const API_BASE_URL = 'http://localhost:5285';

// Common API headers
export const getApiHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}; 