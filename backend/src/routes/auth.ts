import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { userStore } from '../storage/userStore';
import { config } from '../config';
import type { SafeUser } from '../types';
import { authenticate } from '../middleware/auth';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().min(2),
});

const signToken = (user: SafeUser) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.tokenExpiresIn },
  );

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }

  const { email, password, name } = parsed.data;
  const existing = userStore.findByEmail(email);
  if (existing) {
    const match = await bcrypt.compare(password, existing.passwordHash);
    if (match) {
      const token = signToken(userStore.toSafeUser(existing));
      return res.json({ token, user: userStore.toSafeUser(existing), reused: true });
    }
    return res.status(409).json({ message: '邮箱已存在' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = userStore.create({ email, name, passwordHash });
  const token = signToken(user);
  return res.json({ token, user });
});

router.post('/login', async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }

  const record = userStore.findByEmail(parsed.data.email);
  if (!record) {
    return res.status(401).json({ message: '邮箱或密码错误' });
  }

  const match = await bcrypt.compare(parsed.data.password, record.passwordHash);
  if (!match) {
    return res.status(401).json({ message: '邮箱或密码错误' });
  }

  const user = userStore.toSafeUser(record);
  const token = signToken(user);
  return res.json({ token, user });
});

router.get('/me', authenticate, (req, res) => {
  return res.json(res.locals.user);
});

export default router;


