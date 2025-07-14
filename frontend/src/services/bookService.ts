import axios from 'axios';
import { Book, CreateBookRequest } from '../types/models';
import { API_BASE_URL } from '../constants/api';
import { getAllCategories } from './categoryService';

// Create axios instance with auth interceptor
const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Setting Authorization header:', `Bearer ${token.substring(0, 20)}...`); // Debug log
  } else {
    console.log('No token found in localStorage'); // Debug log
  }
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data // Log the request body
  }); // Debug log
  return config;
});

export const getAllBooks = async (): Promise<Book[]> => {
  try {
    const response = await api.get('/api/Books');
    console.log('Books response:', response.data); // Debug log
    
    // Handle the backend response structure: {success: true, message: "...", data: [...]}
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch books');
    }
  } catch (error: any) {
    console.error('Books API error:', error.response?.status, error.response?.data); // Debug log
    throw new Error(error.response?.data?.message || 'Failed to fetch books');
  }
};

export const getBook = async (id: number): Promise<Book> => {
  try {
    const response = await api.get(`/api/Books/${id}`);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to fetch book');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch book');
  }
};

export const createBook = async (book: CreateBookRequest): Promise<Book> => {
  try {
    // Fetch categories to get the category name
    const categories = await getAllCategories();
    const category = categories.find(cat => cat.id === book.categoryId);
    
    if (!category) {
      throw new Error(`Category with ID ${book.categoryId} not found`);
    }
    
    // Send both categoryId and categoryName as the backend expects
    const bookData = {
      name: book.name,
      description: book.description,
      price: Number(book.price), // Ensure price is a number
      categoryId: Number(book.categoryId), // Ensure categoryId is a number
      categoryName: category.name // Include the category name
    };
    
    console.log('Creating book with data:', bookData); // Debug log
    
    const response = await api.post('/api/Books', bookData);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to create book');
    }
  } catch (error: any) {
    console.error('Create book error:', error.response?.status, error.response?.data); // Debug log
    
    // Log detailed validation errors
    if (error.response?.data?.errors) {
      console.error('Validation errors:', error.response.data.errors);
      const errorMessages = Object.entries(error.response.data.errors)
        .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
        .join('; ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    throw new Error(error.response?.data?.message || error.response?.data?.title || 'Failed to create book');
  }
};

export const updateBook = async (id: number, book: Partial<Book>): Promise<Book> => {
  try {
    const response = await api.put(`/api/Books/${id}`, book);
    
    if (response.data.success && response.data.data) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to update book');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update book');
  }
};

export const deleteBook = async (id: number): Promise<void> => {
  try {
    const response = await api.delete(`/api/Books/${id}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to delete book');
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete book');
  }
}; 
