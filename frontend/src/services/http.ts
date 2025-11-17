import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { getApiBaseUrl } from '@/config/env';

const http = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 8000,
});

http.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

export default http;


