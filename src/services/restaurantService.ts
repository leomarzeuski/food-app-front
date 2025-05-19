import api from './api';

export interface Localizacao {
  latitude: number
  longitude: number
}

export interface Endereco {
  rua: string
  cidade: string
  estado: string
  cep: string
  numero: string
}

export interface Restaurant {
  id: string;
  nome: string;
  endereco: Endereco;
  categories: string[];
  isOpen: boolean;
  location: Localizacao;
  createdAt: string;
  userId: string;
  imageUrl: string;
}

export interface CreateRestaurantDto {
  nome: string;
  endereco: Endereco;
  categories: string[];
  isOpen: boolean;
  location: Localizacao;
  userId: string;
  imageUrl: string;
}

const restaurantService = {
  createRestaurant: async (restaurantData: CreateRestaurantDto): Promise<Restaurant> => {
    const response = await api.post<Restaurant>('/restaurants', restaurantData);
    return response.data;
  },

  getAllRestaurants: async (): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>('/restaurants');
    return response.data;
  },

  getRestaurantById: async (id: string): Promise<Restaurant> => {
    const response = await api.get<Restaurant>(`/restaurants/${id}`);
    return response.data;
  },

  getRestaurantsByUserId: async (userId: string): Promise<Restaurant[]> => {
    const response = await api.get<Restaurant[]>(`/restaurants/user/${userId}`);
    return response.data;
  },

  updateRestaurant: async (id: string, restaurantData: Partial<Restaurant>): Promise<Restaurant> => {
    const response = await api.put<Restaurant>(`/restaurants/${id}`, restaurantData);
    return response.data;
  },

  deleteRestaurant: async (id: string): Promise<void> => {
    await api.delete(`/restaurants/${id}`);
  }
};

export default restaurantService; 