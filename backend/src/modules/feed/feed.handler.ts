import { FastifyRequest, FastifyReply } from 'fastify';
import { getCachedFeed, invalidateUserFeed, paginateFeed } from '../../services/feed.service';

export async function getFeed(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { cursor = '0', limit = '20' } = request.query as { cursor?: string; limit?: string };

  const cursorNum = Math.max(0, parseInt(cursor, 10) || 0);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  const feed = await getCachedFeed(userId);
  const { items, nextCursor } = paginateFeed(feed, cursorNum, limitNum);

  return reply.send({
    items,
    nextCursor,
    total: feed.length,
  });
}

export async function refreshFeed(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  await invalidateUserFeed(userId);
  return reply.send({ message: 'Feed refreshed' });
}
