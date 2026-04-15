import { Product, ProductStats, UserPreferences } from '../types/models';

export interface ScoredProduct extends Product {
  score: number;
  is_trending: boolean;
  is_saved: boolean;
}

interface RankInput {
  product: Product;
  stats: ProductStats;
  preferences: UserPreferences | null;
  savedIds: Set<string>;
  seenIds: Map<string, number>; // productId -> times seen
  maxViews: number;
  maxSaveRate: number;
  maxCtr: number;
}

const WEIGHTS = {
  discount: 0.35,
  preference: 0.30,
  engagement: 0.20,
  popularity: 0.10,
  freshness: 0.05,
};

const SEEN_PENALTY = 0.40;

export function scoreProduct(input: RankInput): ScoredProduct {
  const { product, stats, preferences, savedIds, seenIds, maxViews, maxSaveRate, maxCtr } = input;

  // --- Discount score (0..1) ---
  const normalizedDiscount = product.discount_pct / 100;

  // --- Preference match (0..1) ---
  let preferenceMatch = 0.5; // neutral if no prefs
  if (preferences && (preferences.sizes.length > 0 || preferences.brands.length > 0 || preferences.categories.length > 0)) {
    const sizeMatch = preferences.sizes.length > 0
      ? (product.sizes_available.some(s => preferences.sizes.includes(s)) ? 1 : 0)
      : 0.5;
    const brandMatch = preferences.brands.length > 0
      ? (preferences.brands.includes(product.brand) ? 1 : 0)
      : 0.5;
    const categoryMatch = preferences.categories.length > 0
      ? (preferences.categories.includes(product.category) ? 1 : 0)
      : 0.5;
    preferenceMatch = (sizeMatch * 0.5) + (brandMatch * 0.3) + (categoryMatch * 0.2);
  }

  // --- Engagement score (0..1) ---
  const saveRate = stats.view_count > 0 ? stats.save_count / stats.view_count : 0;
  const ctr = stats.view_count > 0 ? stats.click_count / stats.view_count : 0;
  const normalizedSaveRate = maxSaveRate > 0 ? Math.min(saveRate / maxSaveRate, 1) : 0;
  const normalizedCtr = maxCtr > 0 ? Math.min(ctr / maxCtr, 1) : 0;
  const engagementScore = (normalizedSaveRate * 0.6) + (normalizedCtr * 0.4);

  // --- Popularity score (logarithmic, 0..1) ---
  const popularityScore = maxViews > 0
    ? Math.log(1 + stats.view_count) / Math.log(1 + maxViews)
    : 0;

  // --- Freshness score (exponential decay, 0..1) ---
  const ageHours = (Date.now() - new Date(product.created_at).getTime()) / (1000 * 3600);
  const freshnessScore = Math.exp(-ageHours / 72);

  // --- Seen penalty ---
  const timesSeen = seenIds.get(product.id) || 0;
  const seenPenalty = Math.min(timesSeen * SEEN_PENALTY, 1.0);

  // --- Composite score ---
  const score = Math.max(0,
    (WEIGHTS.discount * normalizedDiscount) +
    (WEIGHTS.preference * preferenceMatch) +
    (WEIGHTS.engagement * engagementScore) +
    (WEIGHTS.popularity * popularityScore) +
    (WEIGHTS.freshness * freshnessScore) -
    seenPenalty
  );

  // --- Badges ---
  const is_trending = saveRate > 0.08 && stats.view_count > 50;

  return {
    ...product,
    score,
    is_trending,
    is_saved: savedIds.has(product.id),
  };
}

export function rankProducts(
  products: Product[],
  statsMap: Map<string, ProductStats>,
  preferences: UserPreferences | null,
  savedIds: Set<string>,
  seenIds: Map<string, number>
): ScoredProduct[] {
  if (products.length === 0) return [];

  // Compute normalization values across pool
  let maxViews = 0;
  let maxSaveRate = 0;
  let maxCtr = 0;

  for (const p of products) {
    const s = statsMap.get(p.id);
    if (!s) continue;
    if (s.view_count > maxViews) maxViews = s.view_count;
    if (s.view_count > 0) {
      const sr = s.save_count / s.view_count;
      const ct = s.click_count / s.view_count;
      if (sr > maxSaveRate) maxSaveRate = sr;
      if (ct > maxCtr) maxCtr = ct;
    }
  }

  const scored = products.map(product => {
    const stats = statsMap.get(product.id) || {
      product_id: product.id,
      view_count: 0,
      save_count: 0,
      click_count: 0,
      ctr: 0,
      updated_at: new Date(),
    };
    return scoreProduct({ product, stats, preferences, savedIds, seenIds, maxViews, maxSaveRate, maxCtr });
  });

  return scored.sort((a, b) => b.score - a.score);
}
