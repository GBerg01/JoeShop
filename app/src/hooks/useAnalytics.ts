import { useRef, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import { interactionsApi, InteractionEvent } from '../api/interactions.api';

const FLUSH_INTERVAL_MS = 5000;

export function useAnalytics() {
  const queue = useRef<InteractionEvent[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const flush = useCallback(async () => {
    if (queue.current.length === 0) return;
    const events = [...queue.current];
    queue.current = [];
    try {
      await interactionsApi.batchEvents(events);
    } catch {
      // Re-queue failed events (up to 50 to prevent unbounded growth)
      queue.current = [...events, ...queue.current].slice(0, 50);
    }
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(flush, FLUSH_INTERVAL_MS);

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background' || state === 'inactive') {
        flush();
      }
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      subscription.remove();
      flush();
    };
  }, [flush]);

  const track = useCallback((event: InteractionEvent) => {
    queue.current.push(event);
  }, []);

  return { track };
}
