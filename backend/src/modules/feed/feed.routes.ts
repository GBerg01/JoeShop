import { FastifyInstance } from 'fastify';
import { getFeed, refreshFeed } from './feed.handler';

export async function feedRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          cursor: { type: 'string' },
          limit: { type: 'string' },
        },
      },
    },
  }, getFeed);

  fastify.post('/refresh', refreshFeed);
}
