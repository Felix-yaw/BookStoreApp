import axios from 'axios';
import { Category } from '../types/models';
import { API_BASE_URL } from '../constants/api';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Setting Authorization header for categories:', `Bearer ${token.substring(0, 20)}...`); // Debug log
  } else {
    console.log('No token found in localStorage for categories'); // Debug log
  }
  return config;
});

export const getAllCategories = async (): Promise<Category[]> => {
  try {
    const response = await api.get('/api/Categories');
    console.log('Categories response:', response.data); // Debug log
    
    // Handle the backend response structure: {success: true, message: "...", data: [...]}
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch categories');
    }
  } catch (error: any) {
    console.error('Categories API error:', error.response?.status, error.response?.data); // Debug log
    throw new Error(error.response?.data?.message || 'Failed to fetch categories');
  }
};

export const getCategory = async (id: number): Promise<Category> => {
  try {
    const response = await api.get(`/api/Categories/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch category');
  }
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  try {
    const response = await api.post('/api/Categories', category);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create category');
    }
  } catch (error: any) {
    console.error('Create category error:', error.response?.status, error.response?.data); // Debug log
    throw new Error(error.response?.data?.message || 'Failed to create category');
  }
};

export const updateCategory = async (id: number, category: Partial<Category>): Promise<Category> => {
  try {
    const response = await api.put(`/api/Categories/${id}`, category);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update category');
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    const response = await api.delete(`/api/Categories/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete category');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete category');
  }
}; 
