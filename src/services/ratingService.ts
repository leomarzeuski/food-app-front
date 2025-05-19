import api from './api';

export interface Rating {
  id: string;
  orderId: string;
  userId: string;
  restaurantId: string; 
  nota: number;
  comentario: string;
  createdAt: string;
}

export interface CreateRatingDto {
  orderId: string;
  userId: string;
  restaurantId: string;  
  nota: number;
  comentario?: string;
}

const ratingService = {
  createRating: async (ratingData: CreateRatingDto): Promise<Rating> => {
    const response = await api.post<Rating>('/ratings', ratingData);
    return response.data;
  },

  getAllRatings: async (): Promise<Rating[]> => {
    const response = await api.get<Rating[]>('/ratings');
    return response.data;
  },

  getRatingById: async (id: string): Promise<Rating> => {
    const response = await api.get<Rating>(`/ratings/${id}`);
    return response.data;
  },

  getRatingsByUser: async (userId: string): Promise<Rating[]> => {
    const response = await api.get<Rating[]>(`/ratings/user/${userId}`);
    return response.data;
  },

  getRatingByOrder: async (orderId: string): Promise<Rating> => {
    const response = await api.get<Rating>(`/ratings/order/${orderId}`);
    return response.data;
  },

  updateRating: async (id: string, ratingData: Partial<Rating>): Promise<Rating> => {
    const response = await api.put<Rating>(`/ratings/${id}`, ratingData);
    return response.data;
  },

  deleteRating: async (id: string): Promise<void> => {
    await api.delete(`/ratings/${id}`);
  }
};

export default ratingService; 