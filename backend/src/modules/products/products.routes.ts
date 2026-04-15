import { FastifyInstance } from 'fastify';
import { getProduct, listProducts } from './products.handler';

export async function productsRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', fastify.authenticate);

  fastify.get('/', listProducts);
  fastify.get('/:id', getProduct);
}
