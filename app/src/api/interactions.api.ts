import { apiClient } from './client';

export interface InteractionEvent {
  product_id: string;
  event_type: 'view' | 'click' | 'save' | 'unsave' | 'scroll_past';
  duration_ms?: number;
  scroll_depth?: number;
  session_id?: string;
}

export const interactionsApi = {
  batchEvents: (events: InteractionEvent[]) =>
    apiClient.post('/interactions/batch', { events }).then(r => r.data),
};
