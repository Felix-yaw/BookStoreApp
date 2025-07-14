import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoginRequest, RegisterRequest } from '../types/models';
import { loginApi, registerApi } from '../services/authService';

interface AuthContextType {
  token: string | null;
  user: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  register: (data: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('user'));

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
    if (user) localStorage.setItem('user', user);
    else localStorage.removeItem('user');
  }, [token, user]);

  const login = async (data: LoginRequest) => {
    const res = await loginApi(data);
    console.log('AuthContext login response:', res);
    
    if (res.error) {
      throw new Error(res.error);
    }
    
    if (res.success && res.data) {
      // Handle the actual response structure from backend
      const userData = res.data;
      console.log('User data from login:', userData);
      
      // Try different possible token field names
      const authToken = userData.token || userData.accessToken || userData.jwtToken || userData.access_token || userData.jwt_token;
      const userName = userData.userName || userData.email || data.email;
      
      console.log('Extracted token:', authToken);
      console.log('Extracted user:', userName);
      
      if (authToken) {
        setToken(authToken);
        setUser(userName);
      } else {
        // If no token in response, but success, we need to check what's actually returned
        console.error('No token found in response:', userData);
        throw new Error('No authentication token received from server');
      }
    } else {
      throw new Error('Login failed - invalid response');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const register = async (data: RegisterRequest) => {
    const res = await registerApi(data);
    console.log('AuthContext register response:', res);
    
    if (res.error) {
      throw new Error(res.error);
    }
    
    if (res.success) {
      // Registration successful, but we don't automatically log in
      // User needs to login separately
      return;
    } else {
      throw new Error('Registration failed - invalid response');
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}; 
