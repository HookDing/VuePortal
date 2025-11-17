export type UserRecord = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: 'admin' | 'member';
  createdAt: string;
};

export type SafeUser = Omit<UserRecord, 'passwordHash'>;


