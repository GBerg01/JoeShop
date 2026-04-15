import { apiClient } from './client';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    display_name: string | null;
    onboarded: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  register: (email: string, password: string, displayName?: string) =>
    apiClient.post<AuthResponse>('/auth/register', { email, password, display_name: displayName }).then(r => r.data),

  login: (email: string, password: string) =>
    apiClient.post<AuthResponse>('/auth/login', { email, password }).then(r => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then(r => r.data),
};
