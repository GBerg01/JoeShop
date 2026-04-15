import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/auth.api';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, clearAuth, markOnboarded } = useAuthStore();

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    await setUser(data.user, data.accessToken, data.refreshToken);
    return data;
  };

  const register = async (email: string, password: string, displayName?: string) => {
    const data = await authApi.register(email, password, displayName);
    await setUser(data.user, data.accessToken, data.refreshToken);
    return data;
  };

  const logout = async () => {
    try { await authApi.logout(); } catch { /* Ignore */ }
    await clearAuth();
  };

  return { user, isAuthenticated, isLoading, login, register, logout, markOnboarded };
}
