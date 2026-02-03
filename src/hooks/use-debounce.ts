import { useEffect, useState } from 'react';

/**
 * Returns a debounced value. Updates after `ms` of no changes.
 */
export function useDebounce<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);

  return debounced;
}
