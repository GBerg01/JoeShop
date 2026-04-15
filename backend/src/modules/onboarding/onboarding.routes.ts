import { FastifyInstance } from 'fastify';
import { getOptions, completeOnboarding, updatePreferences } from './onboarding.handler';

export async function onboardingRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/options', getOptions);

  fastify.post('/complete', {
    schema: {
      body: {
        type: 'object',
        required: ['sizes'],
        properties: {
          sizes: { type: 'array', items: { type: 'string' }, minItems: 1 },
          brands: { type: 'array', items: { type: 'string' } },
          categories: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  }, completeOnboarding);

  fastify.patch('/preferences', {
    schema: {
      body: {
        type: 'object',
        properties: {
          sizes: { type: 'array', items: { type: 'string' } },
          brands: { type: 'array', items: { type: 'string' } },
          categories: { type: 'array', items: { type: 'string' } },
        },
      },
    },
  }, updatePreferences);
}
