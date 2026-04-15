import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';
import { config } from './config';
import { pool } from './db/index';
import { redis } from './db/redis';
import authPlugin from './plugins/auth';
import { authRoutes } from './modules/auth/auth.routes';
import { usersRoutes } from './modules/users/users.routes';
import { onboardingRoutes } from './modules/onboarding/onboarding.routes';
import { feedRoutes } from './modules/feed/feed.routes';
import { productsRoutes } from './modules/products/products.routes';
import { savesRoutes } from './modules/saves/saves.routes';
import { interactionsRoutes } from './modules/interactions/interactions.routes';
import { startScheduler } from './jobs/scheduler';

const fastify = Fastify({
  logger: {
    level: config.NODE_ENV === 'development' ? 'info' : 'warn',
    transport: config.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

async function build() {
  // Plugins
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });
  await fastify.register(helmet, { global: true });
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
  await fastify.register(authPlugin);

  // Health endpoint
  fastify.get('/health', async () => {
    const dbOk = await pool.query('SELECT 1').then(() => true).catch(() => false);
    const redisOk = await redis.ping().then(r => r === 'PONG').catch(() => false);
    return {
      status: dbOk && redisOk ? 'ok' : 'degraded',
      db: dbOk,
      redis: redisOk,
      timestamp: new Date().toISOString(),
    };
  });

  // API routes
  const API_PREFIX = '/api/v1';
  fastify.register(authRoutes, { prefix: `${API_PREFIX}/auth` });
  fastify.register(usersRoutes, { prefix: `${API_PREFIX}/users` });
  fastify.register(onboardingRoutes, { prefix: `${API_PREFIX}/onboarding` });
  fastify.register(feedRoutes, { prefix: `${API_PREFIX}/feed` });
  fastify.register(productsRoutes, { prefix: `${API_PREFIX}/products` });
  fastify.register(savesRoutes, { prefix: `${API_PREFIX}/saves` });
  fastify.register(interactionsRoutes, { prefix: `${API_PREFIX}/interactions` });

  return fastify;
}

async function start() {
  try {
    const app = await build();
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    console.log(`ThreadDrop API running on port ${config.PORT}`);
    startScheduler();
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
