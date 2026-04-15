import { apiClient } from './client';
import { FeedProduct } from './types';

export const savesApi = {
  getSaves: (cursor = 0, limit = 20) =>
    apiClient.get<{ items: FeedProduct[]; nextCursor: number | null }>('/saves', {
      params: { cursor, limit },
    }).then(r => r.data),

  save: (productId: string) =>
    apiClient.post(`/saves/${productId}`).then(r => r.data),

  unsave: (productId: string) =>
    apiClient.delete(`/saves/${productId}`).then(r => r.data),
};
