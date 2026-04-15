import { apiClient } from './client';
import { FeedProduct } from './types';

export interface FeedResponse {
  items: FeedProduct[];
  nextCursor: number | null;
  total: number;
}

export const feedApi = {
  getFeed: (cursor = 0, limit = 20) =>
    apiClient.get<FeedResponse>('/feed', { params: { cursor, limit } }).then(r => r.data),

  refreshFeed: () =>
    apiClient.post('/feed/refresh').then(r => r.data),
};
