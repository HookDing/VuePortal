import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { authenticate, requireAdmin } from '../middleware/auth';
import { userStore } from '../storage/userStore';

const router = Router();

const profileSchema = z.object({
  name: z.string().min(2).max(60),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

const adminPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

const adminUpdateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  role: z.enum(['admin', 'member']).optional(),
});

router.use(authenticate);

router.patch('/me', (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const updated = userStore.updateProfile(res.locals.user.id, { name: parsed.data.name });
  if (!updated) {
    return res.status(404).json({ message: '用户不存在' });
  }
  res.locals.user = updated;
  return res.json(updated);
});

router.patch('/me/password', async (req, res) => {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const record = userStore.findById(res.locals.user.id);
  if (!record) {
    return res.status(404).json({ message: '用户不存在' });
  }
  const match = await bcrypt.compare(parsed.data.currentPassword, record.passwordHash);
  if (!match) {
    return res.status(400).json({ message: '当前密码不正确' });
  }
  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  userStore.updatePassword(record.id, hash);
  return res.json({ ok: true });
});

router.get('/', requireAdmin, (_req, res) => {
  const users = userStore.list();
  return res.json(users);
});

router.patch('/:id/password', requireAdmin, async (req, res) => {
  const parsed = adminPasswordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  const user = userStore.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }
  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  userStore.updatePassword(user.id, hash);
  return res.json({ ok: true });
});

router.patch('/:id', requireAdmin, (req, res) => {
  const parsed = adminUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.message });
  }
  if (!parsed.data.name && !parsed.data.role) {
    return res.status(400).json({ message: '请提供需要更新的字段' });
  }
  const user = userStore.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: '用户不存在' });
  }
  if (parsed.data.name) {
    userStore.updateProfile(user.id, { name: parsed.data.name });
  }
  if (parsed.data.role && parsed.data.role !== user.role) {
    userStore.updateRole(user.id, parsed.data.role);
  }
  const updated = userStore.findById(user.id);
  return res.json(updated ? userStore.toSafeUser(updated) : null);
});

export default router;

