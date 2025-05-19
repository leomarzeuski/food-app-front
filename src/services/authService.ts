import api from './api';
import Cookies from 'js-cookie';
import { User } from './userService';

export interface LoginDto {
  email: string;
  senha: string;
}

export interface RegisterDto {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  tipo: "cliente" | "restaurante";
}

export interface AuthResponse {
  user: User;
  token: string;
}

const authService = {
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    
    Cookies.set('token', response.data.token, { path: '/' });
    Cookies.set('userData', JSON.stringify(response.data.user), { path: '/' });
    
    return response.data;
  },
  
  register: async (userData: RegisterDto): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    
    Cookies.set('token', response.data.token, { path: '/' });
    Cookies.set('userData', JSON.stringify(response.data.user), { path: '/' });
    
    return response.data;
  },
  
  logout: (): void => {
    Cookies.remove('token', { path: '/' });
    Cookies.remove('userData', { path: '/' });
  },
  
  getCurrentUser: (): User | null => {
    const userData = Cookies.get('userData');
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  },
  
  isAuthenticated: (): boolean => {
    return !!Cookies.get('token');
  }
};

export default authService;