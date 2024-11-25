import { useCallback, useEffect, useRef } from 'react';

export const TIMER_L = 5000;
export const TIMER_S = 3000;
export const TIMER_XS = 1000;

export const useTimer = (ms: number) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const start = useCallback(
    (cb: () => void) => {
      timerRef.current = setTimeout(cb, ms);
    },
    [ms],
  );

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return [start, stop] as const;
};
