const DEFAULT_API_BASE_URL = '/api';

export const getApiBaseUrl = () => {
  const value = import.meta.env.VITE_API_BASE_URL;
  return typeof value === 'string' && value.trim().length > 0 ? value : DEFAULT_API_BASE_URL;
};

