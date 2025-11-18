import type { StringValue } from 'ms';

const tokenExpiresIn: StringValue = (process.env.TOKEN_EXPIRES_IN as StringValue | undefined) ?? '12h';

const parseOrigins = () => {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw) {
    return ['http://localhost:5173'];
  }
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'demo-secret',
  tokenExpiresIn,
  allowedOrigins: parseOrigins(),
};


