import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRouter from './routes/auth';
import usersRouter from './routes/users';
import { config } from './config';
import swaggerUi from 'swagger-ui-express';
import { openApiSpec } from './docs/openapi';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.get('/', (_req, res) => {
  res.redirect('/docs');
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.listen(config.port, () => {
  console.log(`API server running on http://localhost:${config.port}`);
});


