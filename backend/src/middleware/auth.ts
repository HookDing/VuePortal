import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { userStore } from '../storage/userStore';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: '未提供凭证' });
  }

  const token = header.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { sub: string };
    const user = userStore.findById(decoded.sub);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    res.locals.user = userStore.toSafeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ message: '凭证无效' });
  }
};

export const requireAdmin = (_req: Request, res: Response, next: NextFunction) => {
  if (res.locals.user?.role !== 'admin') {
    return res.status(403).json({ message: '需要管理员权限' });
  }
  next();
};


