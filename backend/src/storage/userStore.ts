import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { UserRecord, SafeUser } from '../types';

const DATA_DIR = join(process.cwd(), 'data');
const USER_FILE = join(DATA_DIR, 'users.json');

const ensureStore = () => {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!existsSync(USER_FILE)) {
    const seed: UserRecord[] = [
      {
        id: randomUUID(),
        email: 'demo@vue.dev',
        name: 'Vue Demo',
        passwordHash: '$2a$10$V6FghDUZtnYzhdXCkfzOY.KIk3VzBkYOPxfN3E3xaQa58aeGeq/Qq', // 123456
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];
    writeFileSync(USER_FILE, JSON.stringify(seed, null, 2), 'utf-8');
  }
};

const readUsers = (): UserRecord[] => {
  ensureStore();
  const data = readFileSync(USER_FILE, 'utf-8');
  return JSON.parse(data) as UserRecord[];
};

const writeUsers = (users: UserRecord[]) => {
  writeFileSync(USER_FILE, JSON.stringify(users, null, 2), 'utf-8');
};

const toSafeUser = (user: UserRecord): SafeUser => {
  const { passwordHash, ...safe } = user;
  return safe;
};

export const userStore = {
  findByEmail: (email: string) => readUsers().find((user) => user.email === email),
  findById: (id: string) => readUsers().find((user) => user.id === id),
  list: (): SafeUser[] => readUsers().map((user) => toSafeUser(user)),
  create: (payload: { email: string; name: string; passwordHash: string }): SafeUser => {
    const users = readUsers();
    const record: UserRecord = {
      id: randomUUID(),
      email: payload.email,
      name: payload.name,
      passwordHash: payload.passwordHash,
      role: users.length === 0 ? 'admin' : 'member',
      createdAt: new Date().toISOString(),
    };
    users.push(record);
    writeUsers(users);
    return toSafeUser(record);
  },
  updateProfile: (id: string, payload: { name?: string }) => {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    if (payload.name) {
      users[index].name = payload.name;
    }
    writeUsers(users);
    return toSafeUser(users[index]);
  },
  updatePassword: (id: string, passwordHash: string) => {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return;
    users[index].passwordHash = passwordHash;
    writeUsers(users);
  },
  updateRole: (id: string, role: 'admin' | 'member') => {
    const users = readUsers();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return;
    users[index].role = role;
    writeUsers(users);
  },
  toSafeUser,
};


