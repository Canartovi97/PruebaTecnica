import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import requestRoutes from './modules/requests/request.routes';
import userRoutes from './modules/users/user.routes';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api/users', userRoutes);
  app.use('/api/requests', requestRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
