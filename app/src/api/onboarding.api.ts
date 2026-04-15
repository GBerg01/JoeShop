import { apiClient } from './client';

export const onboardingApi = {
  getOptions: () =>
    apiClient.get('/onboarding/options').then(r => r.data),

  complete: (sizes: string[], brands: string[], categories: string[]) =>
    apiClient.post('/onboarding/complete', { sizes, brands, categories }).then(r => r.data),

  updatePreferences: (data: { sizes?: string[]; brands?: string[]; categories?: string[] }) =>
    apiClient.patch('/onboarding/preferences', data).then(r => r.data),
};
