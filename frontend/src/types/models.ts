// Book model
export interface Book {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName?: string;
}

// Book creation request (without id and categoryName)
export interface CreateBookRequest {
  name: string;
  description: string;
  price: number;
  categoryId: number;
}

// Category model
export interface Category {
  id: number;
  name: string;
}

// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register request
export interface RegisterRequest {
  email: string;
  userName: string;
  password: string;
}

// API response (generic)
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
} 