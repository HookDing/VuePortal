export const config = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || 'demo-secret',
  tokenExpiresIn: '12h',
};


