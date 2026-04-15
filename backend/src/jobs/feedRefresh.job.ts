import { invalidateAllFeeds } from '../services/feed.service';

export async function feedRefreshJob() {
  console.log('[FeedRefresh] Invalidating all feed caches...');
  await invalidateAllFeeds();
  console.log('[FeedRefresh] Done');
}
