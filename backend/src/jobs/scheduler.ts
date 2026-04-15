import cron from 'node-cron';
import { feedRefreshJob } from './feedRefresh.job';

export function startScheduler() {
  // Invalidate all feed caches every 20 minutes
  cron.schedule('*/20 * * * *', async () => {
    try {
      await feedRefreshJob();
    } catch (err) {
      console.error('[Scheduler] feedRefreshJob error:', err);
    }
  });

  console.log('[Scheduler] Started');
}
