import api from './api';
import { Address } from '@/context/userContext';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: "cliente" | "restaurante";
  telefone?: string;
  enderecos?: Address[];
}

export interface RegisterUserDto {
  nome: string;
  email: string;
  tipo: "cliente" | "restaurante";
}

export interface CreateAddressDto {
  nome: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal: boolean;
}

const userService = {
  register: async (userData: RegisterUserDto): Promise<User> => {
    const response = await api.post<User>('/users/register', userData);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export default userService; 