import api from './api';

export interface MenuItem {
  id: string;
  restauranteId: string;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  disponivel: boolean;
}

export interface CreateMenuItemDto {
  restauranteId: string;
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl?: string;
  disponivel: boolean;
}

const menuItemService = {
  createMenuItem: async (menuItemData: CreateMenuItemDto): Promise<MenuItem> => {
    const response = await api.post<MenuItem>('/menu-items', menuItemData);
    return response.data;
  },

  getAllMenuItems: async (): Promise<MenuItem[]> => {
    const response = await api.get<MenuItem[]>('/menu-items');
    return response.data;
  },

  getMenuItemById: async (id: string): Promise<MenuItem> => {
    const response = await api.get<MenuItem>(`/menu-items/${id}`);
    return response.data;
  },

  getMenuItemsByRestaurant: async (restauranteId: string): Promise<MenuItem[]> => {
    const response = await api.get<MenuItem[]>(`/menu-items/restaurant/${restauranteId}`);
    return response.data;
  },

  updateMenuItem: async (id: string, menuItemData: Partial<MenuItem>): Promise<MenuItem> => {
    const response = await api.put<MenuItem>(`/menu-items/${id}`, menuItemData);
    return response.data;
  },

  updateMenuItemAvailability: async (id: string, disponivel: boolean): Promise<MenuItem> => {
    const response = await api.put<MenuItem>(`/menu-items/${id}/availability`, { disponivel });
    return response.data;
  },

  deleteMenuItem: async (id: string): Promise<void> => {
    await api.delete(`/menu-items/${id}`);
  }
};

export default menuItemService; 