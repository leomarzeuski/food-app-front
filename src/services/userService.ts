import api from './api';
import { Address } from '@/context/userContext';

export interface User {
  id: string;
  nome: string;
  email: string;
  tipo: 'cliente' | 'entregador';
  telefone?: string;
  enderecos?: Address[];
}

export interface RegisterUserDto {
  nome: string;
  email: string;
  tipo: 'cliente' | 'entregador';
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

  
  removeAddress: async (userId: string, addressId: string): Promise<User> => {
    const response = await api.delete<User>(`/users/${userId}/addresses/${addressId}`);
    return response.data;
  },

  addAddress: async (userId: string, addressData: CreateAddressDto): Promise<User> => {
    const response = await api.post<User>(`/users/${userId}/addresses`, addressData);
    return response.data;
  },

  getUserAddresses: async (userId: string): Promise<Address[]> => {
    const response = await api.get<Address[]>(`/users/${userId}/addresses`);
    return response.data;
  },

  updateAddress: async (
    userId: string, 
    addressId: string, 
    addressData: Partial<CreateAddressDto>
  ): Promise<User> => {
    const response = await api.put<User>(
      `/users/${userId}/addresses/${addressId}`, 
      addressData
    );
    return response.data;
  },

  deleteAddress: async (userId: string, addressId: string): Promise<User> => {
    const response = await api.delete<User>(`/users/${userId}/addresses/${addressId}`);
    return response.data;
  }

};

export default userService; 