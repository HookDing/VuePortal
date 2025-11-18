import type { StringValue } from 'ms';

const tokenExpiresIn: StringValue = (process.env.TOKEN_EXPIRES_IN as StringValue | undefined) ?? '12h';

export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'demo-secret',
  tokenExpiresIn,
};


