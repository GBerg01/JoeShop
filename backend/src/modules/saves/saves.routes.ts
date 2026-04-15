import { FastifyInstance } from 'fastify';
import { getSaves, saveProduct, unsaveProduct } from './saves.handler';

export async function savesRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/', getSaves);
  fastify.post('/:productId', saveProduct);
  fastify.delete('/:productId', unsaveProduct);
}
