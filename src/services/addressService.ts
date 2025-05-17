import api from './api';

export interface Address {
  id: string;
  userId: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface CreateAddressDto {
  userId: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
}

const addressService = {
  createAddress: async (addressData: CreateAddressDto): Promise<Address> => {
    const response = await api.post<Address>('/addresses', addressData);
    return response.data;
  },

  getAllAddresses: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>('/addresses');
    return response.data;
  },

  getAddressById: async (id: string): Promise<Address> => {
    const response = await api.get<Address>(`/addresses/${id}`);
    return response.data;
  },

  getAddressesByUser: async (userId: string): Promise<Address[]> => {
    const response = await api.get<Address[]>(`/addresses/user/${userId}`);
    return response.data;
  },

  updateAddress: async (id: string, addressData: Partial<Address>): Promise<Address> => {
    const response = await api.put<Address>(`/addresses/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  }
};

export default addressService; 