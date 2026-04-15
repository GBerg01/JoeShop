import { FastifyRequest, FastifyReply } from 'fastify';
import { query } from '../../db/index';
import { Product } from '../../types/models';

export async function getProduct(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };

  const { rows } = await query<Product>(
    'SELECT * FROM products WHERE id = $1 AND is_active = TRUE',
    [id]
  );

  if (rows.length === 0) {
    return reply.status(404).send({ error: 'Product not found' });
  }

  return reply.send(rows[0]);
}

export async function listProducts(request: FastifyRequest, reply: FastifyReply) {
  const {
    category,
    brand,
    minDiscount,
    size,
    cursor = '0',
    limit = '20',
  } = request.query as {
    category?: string;
    brand?: string;
    minDiscount?: string;
    size?: string;
    cursor?: string;
    limit?: string;
  };

  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
  const offset = Math.max(0, parseInt(cursor, 10) || 0);

  const conditions: string[] = ['p.is_active = TRUE'];
  const params: unknown[] = [];

  if (category) {
    params.push(category);
    conditions.push(`p.category = $${params.length}`);
  }
  if (brand) {
    params.push(brand);
    conditions.push(`p.brand = $${params.length}`);
  }
  if (minDiscount) {
    params.push(parseFloat(minDiscount));
    conditions.push(`p.discount_pct >= $${params.length}`);
  }
  if (size) {
    params.push([size]);
    conditions.push(`p.sizes_available && $${params.length}::text[]`);
  }

  params.push(limitNum, offset);
  const sql = `
    SELECT p.* FROM products p
    WHERE ${conditions.join(' AND ')}
    ORDER BY p.discount_pct DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const { rows } = await query<Product>(sql, params);
  const nextCursor = rows.length === limitNum ? offset + limitNum : null;

  return reply.send({ items: rows, nextCursor });
}
