import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import http from '@/services/http';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  createdAt: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
  reused?: boolean;
};

const TOKEN_KEY = 'vue-portal-token';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null);
  const user = ref<AuthUser | null>(null);
  const initialized = ref(false);
  const loading = ref(false);

  const isAuthenticated = computed(() => Boolean(token.value && user.value));

  const refreshUser = async () => {
    const { data } = await http.get<AuthUser>('/auth/me');
    user.value = data;
    return data;
  };

  const bootstrap = async () => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      initialized.value = true;
      return;
    }

    token.value = stored;
    try {
      await refreshUser();
    } catch (error) {
      console.warn('token invalid', error);
      localStorage.removeItem(TOKEN_KEY);
      token.value = null;
      user.value = null;
    } finally {
      initialized.value = true;
    }
  };

  const handleAuthSuccess = (payload: AuthResponse) => {
    token.value = payload.token;
    user.value = payload.user;
    localStorage.setItem(TOKEN_KEY, payload.token);
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    try {
      const { data } = await http.post<AuthResponse>('/auth/login', { email, password });
      handleAuthSuccess(data);
    } finally {
      loading.value = false;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    loading.value = true;
    try {
      const { data } = await http.post<AuthResponse>('/auth/register', { email, password, name });
      handleAuthSuccess(data);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
  };

  const updateProfile = async (payload: { name: string }) => {
    const { data } = await http.patch<AuthUser>('/users/me', payload);
    user.value = data;
    return data;
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await http.patch('/users/me/password', { currentPassword, newPassword });
  };

  return {
    token,
    user,
    loading,
    initialized,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    updatePassword,
    bootstrap,
  };
});


