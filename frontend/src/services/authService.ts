import axios from 'axios';
import { LoginRequest, RegisterRequest } from '../types/models';
import { API_BASE_URL } from '../constants/api';

const API_URL = `${API_BASE_URL}/api/Account`;

export const loginApi = async (data: LoginRequest) => {
  try {
    const res = await axios.post(`${API_URL}/login`, data);
    console.log('Login response:', res.data); // Debug log
    console.log('Login response headers:', res.headers); // Debug log
    console.log('Full login response:', res); // Debug log
    return res.data;
  } catch (err: any) {
    console.error('Login error:', err.response?.data || err.message); // Debug log
    return { error: err.response?.data?.message || err.response?.data || 'Login failed' };
  }
};

export const registerApi = async (data: RegisterRequest) => {
  try {
    const res = await axios.post(`${API_URL}/register`, data);
    console.log('Register response:', res.data); // Debug log
    console.log('Register response headers:', res.headers); // Debug log
    return res.data;
  } catch (err: any) {
    console.error('Register error:', err.response?.data || err.message); // Debug log
    return { error: err.response?.data?.message || err.response?.data || 'Registration failed' };
  }
}; 