import { randomUUID } from 'node:crypto';
import type { SafeUser, UserRecord } from '../types';
import { db } from './database';

type DbUser = UserRecord;

const mapRow = (row?: DbUser | null): UserRecord | null => {
  if (!row) return null;
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    passwordHash: row.passwordHash,
    role: row.role,
    createdAt: row.createdAt,
  };
};

const toSafeUser = (user: UserRecord): SafeUser => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
};

const seedAdmin = () => {
  const total = db.prepare(`SELECT COUNT(1) as total FROM users`).get() as { total: number };
  if (total.total === 0) {
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO users (id, email, name, passwordHash, role, createdAt)
       VALUES (@id, @email, @name, @passwordHash, @role, @createdAt)`,
    ).run({
      id: randomUUID(),
      email: 'demo@vue.dev',
      name: 'Vue Demo',
      passwordHash: '$2a$10$V6FghDUZtnYzhdXCkfzOY.KIk3VzBkYOPxfN3E3xaQa58aeGeq/Qq', // 123456
      role: 'admin',
      createdAt: now,
    });
  }
};

seedAdmin();

const findByEmail = (email: string): UserRecord | null => {
  const row = db.prepare<unknown[], DbUser>('SELECT * FROM users WHERE email = ?').get(email);
  return mapRow(row);
};

const findById = (id: string): UserRecord | null => {
  const row = db.prepare<unknown[], DbUser>('SELECT * FROM users WHERE id = ?').get(id);
  return mapRow(row);
};

const list = (): SafeUser[] => {
  const rows = db.prepare<unknown[], DbUser>(`SELECT * FROM users ORDER BY datetime(createdAt) DESC`).all();
  return rows.map((row) => toSafeUser(row));
};

const create = (payload: { email: string; name: string; passwordHash: string }): SafeUser => {
  const total = db.prepare(`SELECT COUNT(1) as total FROM users`).get() as { total: number };
  const now = new Date().toISOString();
  const record: UserRecord = {
    id: randomUUID(),
    email: payload.email,
    name: payload.name,
    passwordHash: payload.passwordHash,
    role: total.total === 0 ? 'admin' : 'member',
    createdAt: now,
  };

  db.prepare(
    `INSERT INTO users (id, email, name, passwordHash, role, createdAt)
     VALUES (@id, @email, @name, @passwordHash, @role, @createdAt)`,
  ).run(record);

  return toSafeUser(record);
};

const updateProfile = (id: string, payload: { name?: string }) => {
  if (payload.name) {
    db.prepare(`UPDATE users SET name = @name WHERE id = @id`).run({ id, name: payload.name });
  }
  const updated = findById(id);
  return updated ? toSafeUser(updated) : null;
};

const updatePassword = (id: string, passwordHash: string) => {
  db.prepare(`UPDATE users SET passwordHash = @passwordHash WHERE id = @id`).run({ id, passwordHash });
};

const updateRole = (id: string, role: 'admin' | 'member') => {
  db.prepare(`UPDATE users SET role = @role WHERE id = @id`).run({ id, role });
};

export const userStore = {
  findByEmail,
  findById,
  list,
  create,
  updateProfile,
  updatePassword,
  updateRole,
  toSafeUser,
};
