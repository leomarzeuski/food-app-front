import api from './api';

export interface OrderItem {
  itemId: string;
  quantidade: number;
  precoUnit: number;
  itemName: string;
  restauranteId?: string;
  restauranteName?: string;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  status: 'novo' | 'preparando' | 'pronto' | 'entregando' | 'entregue' | 'cancelado';
  items: OrderItem[];
  createdAt: string;
  userName: string;
}

export interface CreateOrderDto {
  userId: string;
  userName: string;
  restaurantId: string;
  status: 'novo' | 'preparando' | 'pronto' | 'entregando' | 'entregue' | 'cancelado';
  items: OrderItem[];
  addressId?: string;
}

const orderService = {
  createOrder: async (orderData: CreateOrderDto): Promise<Order> => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/user/${userId}`);
    return response.data;
  },

  getOrdersByRestaurant: async (restaurantId: string): Promise<Order[]> => {
    const response = await api.get<Order[]>(`/orders/restaurant/${restaurantId}`);
    return response.data;
  },

  updateOrder: async (id: string, orderData: Partial<Order>): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}`, orderData);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  deleteOrder: async (id: string): Promise<void> => {
    await api.delete(`/orders/${id}`);
  }
};

export default orderService; 