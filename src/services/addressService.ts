// services/addressService.ts
import { Address } from '@/context/userContext';
import api from './api';

export interface CreateAddressDto {
  entityId: string;
  entityType: 'user' | 'restaurant';
  apelido?: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  principal?: boolean;
}

const addressService = {
  createAddress: async (addressData: CreateAddressDto): Promise<Address> => {
    const response = await api.post<Address>('/addresses', addressData);
    return response.data;
  },

  getAddressesByEntity: async (entityId: string, entityType: 'user' | 'restaurant'): Promise<Address[]> => {
    const response = await api.get<Address[]>(`/addresses?entityId=${entityId}&entityType=${entityType}`);
    return response.data;
  },

  getAddressById: async (id: string): Promise<Address> => {
    const response = await api.get<Address>(`/addresses/${id}`);
    return response.data;
  },

  updateAddress: async (id: string, addressData: Partial<CreateAddressDto>): Promise<Address> => {
    const response = await api.put<Address>(`/addresses/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },
  
  setAddressAsPrimary: async (id: string, entityId: string, entityType: 'user' | 'restaurant'): Promise<void> => {
    await api.put(`/addresses/${id}/primary`, { entityId, entityType });
  }
};

export default addressService;