import { useEffect } from 'react';
import { useLatest } from './use-latest';

export const useEsc = (callback: () => void) => {
  const refFree = useLatest(callback);
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        refFree.current();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [refFree]);
};
