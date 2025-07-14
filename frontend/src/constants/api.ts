// API Configuration
export const API_BASE_URL = 'https://bookstoreapp-5ksy.onrender.com';

// Common API headers
export const getApiHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}; 
