// Types for the application
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
}
