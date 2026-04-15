import { FastifyInstance } from 'fastify';
import { register, login, refresh, logout } from './auth.handler';
import { registerSchema, loginSchema, refreshSchema } from './auth.schema';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', { schema: registerSchema }, register);
  fastify.post('/login', { schema: loginSchema }, login);
  fastify.post('/refresh', { schema: refreshSchema }, refresh);
  fastify.post('/logout', { preHandler: [fastify.authenticate] }, logout);
}
