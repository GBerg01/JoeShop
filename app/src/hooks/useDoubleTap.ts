import { useRef, useCallback } from 'react';

const DOUBLE_TAP_DELAY = 300;

export function useDoubleTap(onDoubleTap: () => void, onSingleTap?: () => void) {
  const lastTapRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLast = now - lastTapRef.current;

    if (timeSinceLast < DOUBLE_TAP_DELAY) {
      if (timerRef.current) clearTimeout(timerRef.current);
      lastTapRef.current = 0;
      onDoubleTap();
    } else {
      lastTapRef.current = now;
      if (onSingleTap) {
        timerRef.current = setTimeout(() => {
          onSingleTap();
        }, DOUBLE_TAP_DELAY);
      }
    }
  }, [onDoubleTap, onSingleTap]);

  return handleTap;
}
