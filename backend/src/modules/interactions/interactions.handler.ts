import { FastifyRequest, FastifyReply } from 'fastify';
import { query } from '../../db/index';

interface InteractionEvent {
  product_id: string;
  event_type: 'view' | 'click' | 'save' | 'unsave' | 'scroll_past';
  duration_ms?: number;
  scroll_depth?: number;
  session_id?: string;
}

export async function batchInteractions(request: FastifyRequest, reply: FastifyReply) {
  const userId = request.user.sub;
  const { events } = request.body as { events: InteractionEvent[] };

  if (!events || events.length === 0) {
    return reply.send({ processed: 0 });
  }

  // Process in batch
  const insertPromises = events.map(event =>
    query(
      `INSERT INTO interactions (user_id, product_id, event_type, duration_ms, scroll_depth, session_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, event.product_id, event.event_type, event.duration_ms || null, event.scroll_depth || null, event.session_id || null]
    )
  );

  // Update view counts for 'view' and 'click' events
  const viewUpdates = events
    .filter(e => e.event_type === 'view')
    .map(e => query(
      `INSERT INTO product_stats (product_id, view_count)
       VALUES ($1, 1)
       ON CONFLICT (product_id) DO UPDATE
       SET view_count = product_stats.view_count + 1, updated_at = NOW()`,
      [e.product_id]
    ));

  const clickUpdates = events
    .filter(e => e.event_type === 'click')
    .map(e => query(
      `INSERT INTO product_stats (product_id, click_count)
       VALUES ($1, 1)
       ON CONFLICT (product_id) DO UPDATE
       SET click_count = product_stats.click_count + 1, updated_at = NOW()`,
      [e.product_id]
    ));

  await Promise.all([...insertPromises, ...viewUpdates, ...clickUpdates]);

  return reply.send({ processed: events.length });
}
