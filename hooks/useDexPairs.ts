// hooks/useDexPairs.ts
import { useEffect, useMemo, useRef, useState } from 'react';
import { searchPairs, type DexPair } from '@/lib/dexscreener';

export function useDexPairs(query: string, refreshMs = 15000) {
  const [data, setData] = useState<DexPair[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | null>(null);

  const load = useMemo(() => async (q: string, signal?: AbortSignal) => {
    try {
      setLoading(true);
      const pairs = await searchPairs(q, signal);
      setData(pairs);
      setError(null);
    } catch (e: any) {
      if (e.name !== 'AbortError') setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    void load(query, ctrl.signal);
    if (refreshMs > 0) {
      timer.current = window.setInterval(() => void load(query), refreshMs);
    }
    return () => {
      ctrl.abort();
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [query, refreshMs, load]);

  return { data, error, loading };
}
