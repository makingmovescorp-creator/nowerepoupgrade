'use client';
import { useMemo, useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { FEATURED_PAIRS, type FeaturedKey } from '@/data/pairs';
import { getPairsById, type DexPair } from '@/lib/dexscreener';

// Typ dla mapowania par
export type FeaturedPairsData = Record<FeaturedKey, DexPair | null>;

// Kontekst dla danych par
const FeaturedPairsContext = createContext<{
  data: FeaturedPairsData;
  loading: boolean;
  error: Error | null;
}>({
  data: {} as FeaturedPairsData,
  loading: false,
  error: null,
});

// Hook do pobierania danych dla pojedynczej pary po adresie
function usePairData(pairAddress: string, refreshMs = 15000) {
  const [data, setData] = useState<DexPair | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const load = async () => {
      try {
        setLoading(true);
        const pairs = await getPairsById('pulsechain', pairAddress);
        setData(pairs[0] || null);
        setError(null);
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    void load();

    if (refreshMs > 0) {
      intervalId = setInterval(load, refreshMs);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pairAddress, refreshMs]);

  return { data, error, loading };
}

// Hook do pobierania danych dla wszystkich featured pairs
export function useFeaturedPairsData() {
  // Pobieramy dane dla każdej pary osobno
  const pairDataResults = FEATURED_PAIRS.map(pair =>
    usePairData(pair.pool, 15000)
  );

  // Łączymy wyniki
  const featuredPairsData = useMemo(() => {
    const result: FeaturedPairsData = {} as FeaturedPairsData;

    FEATURED_PAIRS.forEach((pair, index) => {
      const { data } = pairDataResults[index];
      result[pair.key] = data;
    });

    return result;
  }, [pairDataResults]);

  // Sprawdzamy czy którekolwiek się ładuje lub ma błąd
  const loading = pairDataResults.some(result => result.loading);
  const error = pairDataResults.find(result => result.error)?.error || null;

  return {
    data: featuredPairsData,
    loading,
    error,
  };
}

// Provider kontekstu
export function FeaturedPairsProvider({ children }: { children: ReactNode }) {
  const featuredPairsData = useFeaturedPairsData();

  return (
    <FeaturedPairsContext.Provider value={featuredPairsData}>
      {children}
    </FeaturedPairsContext.Provider>
  );
}

// Hook do konsumowania danych z kontekstu
export function useFeaturedPairs() {
  const context = useContext(FeaturedPairsContext);
  if (!context) {
    throw new Error('useFeaturedPairs must be used within a FeaturedPairsProvider');
  }
  return context;
}
