import { useState, useEffect, useCallback, useRef } from 'react';

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timeout to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timeout if the value changes before the delay is over
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
}

export function useDebounceFn<
  Args extends [],
  Fn extends (...args: Args) => void,
>(callback: Fn, delay: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerIdRef = useRef<any>(null);

  const debouncedFn = useCallback(
    (...args: Args) => {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  return debouncedFn;
}
