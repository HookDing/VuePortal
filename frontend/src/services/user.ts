import http from './http';

export type UserSummary = {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'member';
  createdAt: string;
};

export const fetchUsers = async () => {
  const { data } = await http.get<UserSummary[]>('/users');
  return data;
};

export const resetUserPassword = async (id: string, newPassword: string) => {
  await http.patch(`/users/${id}/password`, { newPassword });
};

export const updateUserProfileAsAdmin = async (id: string, payload: { name?: string; role?: 'admin' | 'member' }) => {
  const { data } = await http.patch<UserSummary>(`/users/${id}`, payload);
  return data;
};

