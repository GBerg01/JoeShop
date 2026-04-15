import { redis } from '../db/redis';
import { query } from '../db/index';
import { Product, ProductStats, UserPreferences } from '../types/models';
import { rankProducts, ScoredProduct } from './ranking.service';

const FEED_TTL_SECONDS = 60 * 30; // 30 minutes
const FEED_SIZE = 200; // Items to rank and cache per user

function feedKey(userId: string) {
  return `feed:${userId}`;
}

async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  const { rows } = await query<UserPreferences>(
    'SELECT * FROM user_preferences WHERE user_id = $1',
    [userId]
  );
  return rows[0] || null;
}

async function getUserSavedIds(userId: string): Promise<Set<string>> {
  const { rows } = await query<{ product_id: string }>(
    'SELECT product_id FROM saves WHERE user_id = $1',
    [userId]
  );
  return new Set(rows.map(r => r.product_id));
}

async function getUserSeenIds(userId: string): Promise<Map<string, number>> {
  const { rows } = await query<{ product_id: string; count: string }>(
    `SELECT product_id, COUNT(*) as count
     FROM interactions
     WHERE user_id = $1
       AND event_type IN ('view', 'click')
       AND created_at > NOW() - INTERVAL '7 days'
     GROUP BY product_id`,
    [userId]
  );
  const map = new Map<string, number>();
  for (const row of rows) {
    map.set(row.product_id, parseInt(row.count, 10));
  }
  return map;
}

async function getActiveProducts(preferences: UserPreferences | null): Promise<Product[]> {
  // Fetch more than FEED_SIZE to have room for filtering + ranking
  let sql = `
    SELECT p.* FROM products p
    WHERE p.is_active = TRUE
  `;
  const params: unknown[] = [];

  // Soft bias: if user has sizes, prefer items with matching sizes (but don't hard-filter)
  if (preferences && preferences.sizes.length > 0) {
    // Include all items but put size-matching ones first via ORDER
    sql += ` ORDER BY
      (p.sizes_available && $1::text[]) DESC,
      p.discount_pct DESC
    LIMIT 300`;
    params.push(preferences.sizes);
  } else {
    sql += ' ORDER BY p.discount_pct DESC LIMIT 300';
  }

  const { rows } = await query<Product>(sql, params);
  return rows;
}

async function getProductStats(productIds: string[]): Promise<Map<string, ProductStats>> {
  if (productIds.length === 0) return new Map();
  const { rows } = await query<ProductStats>(
    'SELECT * FROM product_stats WHERE product_id = ANY($1)',
    [productIds]
  );
  const map = new Map<string, ProductStats>();
  for (const row of rows) {
    map.set(row.product_id, row);
  }
  return map;
}

export async function buildFeed(userId: string): Promise<ScoredProduct[]> {
  const [preferences, savedIds, seenIds] = await Promise.all([
    getUserPreferences(userId),
    getUserSavedIds(userId),
    getUserSeenIds(userId),
  ]);

  const products = await getActiveProducts(preferences);
  const productIds = products.map(p => p.id);
  const statsMap = await getProductStats(productIds);

  const ranked = rankProducts(products, statsMap, preferences, savedIds, seenIds);
  return ranked.slice(0, FEED_SIZE);
}

export async function getCachedFeed(userId: string): Promise<ScoredProduct[]> {
  const key = feedKey(userId);
  const cached = await redis.get(key);

  if (cached) {
    return JSON.parse(cached) as ScoredProduct[];
  }

  const feed = await buildFeed(userId);
  await redis.setex(key, FEED_TTL_SECONDS, JSON.stringify(feed));
  return feed;
}

export async function invalidateUserFeed(userId: string): Promise<void> {
  await redis.del(feedKey(userId));
}

export async function invalidateAllFeeds(): Promise<void> {
  const keys = await redis.keys('feed:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export function paginateFeed(
  feed: ScoredProduct[],
  cursor: number,
  limit: number
): { items: ScoredProduct[]; nextCursor: number | null } {
  const start = cursor;
  const items = feed.slice(start, start + limit);
  const nextCursor = start + limit < feed.length ? start + limit : null;
  return { items, nextCursor };
}
