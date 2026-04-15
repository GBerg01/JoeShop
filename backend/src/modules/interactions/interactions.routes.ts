import { FastifyInstance } from 'fastify';
import { batchInteractions } from './interactions.handler';

export async function interactionsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.post('/batch', {
    schema: {
      body: {
        type: 'object',
        required: ['events'],
        properties: {
          events: {
            type: 'array',
            maxItems: 100,
            items: {
              type: 'object',
              required: ['product_id', 'event_type'],
              properties: {
                product_id: { type: 'string' },
                event_type: { type: 'string', enum: ['view', 'click', 'save', 'unsave', 'scroll_past'] },
                duration_ms: { type: 'integer' },
                scroll_depth: { type: 'number' },
                session_id: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, batchInteractions);
}
