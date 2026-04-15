import { FastifyRequest, FastifyReply } from 'fastify';
import { query } from '../../db/index';
import { invalidateUserFeed } from '../../services/feed.service';

export async function getSaves(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { cursor = '0', limit = '20' } = request.query as { cursor?: string; limit?: string };
  const limitNum = Math.min(50, parseInt(limit, 10) || 20);
  const offset = Math.max(0, parseInt(cursor, 10) || 0);

  const { rows } = await query(
    `SELECT p.*, s.created_at as saved_at
     FROM saves s
     JOIN products p ON p.id = s.product_id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limitNum, offset]
  );

  const nextCursor = rows.length === limitNum ? offset + limitNum : null;
  return reply.send({ items: rows, nextCursor });
}

export async function saveProduct(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { productId } = request.params as { productId: string };

  await query(
    `INSERT INTO saves (user_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING`,
    [userId, productId]
  );

  // Update product stats
  await query(
    `INSERT INTO product_stats (product_id, save_count)
     VALUES ($1, 1)
     ON CONFLICT (product_id) DO UPDATE
     SET save_count = product_stats.save_count + 1, updated_at = NOW()`,
    [productId]
  );

  await invalidateUserFeed(userId);
  return reply.status(201).send({ message: 'Saved' });
}

export async function unsaveProduct(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { productId } = request.params as { productId: string };

  const { rowCount } = await query(
    'DELETE FROM saves WHERE user_id = $1 AND product_id = $2',
    [userId, productId]
  );

  if (!rowCount || rowCount === 0) {
    return reply.status(404).send({ error: 'Save not found' });
  }

  await invalidateUserFeed(userId);
  return reply.send({ message: 'Removed' });
}
