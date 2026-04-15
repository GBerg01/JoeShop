import { FastifyInstance } from 'fastify';
import { getMe, updateMe } from './users.handler';

export async function usersRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/me', getMe);
  fastify.patch('/me', {
    schema: {
      body: {
        type: 'object',
        properties: {
          display_name: { type: 'string', maxLength: 50 },
          avatar_url: { type: 'string', format: 'uri' },
        },
      },
    },
  }, updateMe);
}
