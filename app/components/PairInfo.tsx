'use client';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSwapState } from '@/lib/state';
import { useFeaturedPairs } from '@/hooks/useFeaturedPairsData';
import { fmtUsd, fmtPct } from '@/lib/format';
import { FEATURED_PAIRS, type FeaturedKey } from '@/data/pairs';

export default function PairInfo() {
  const sp = useSearchParams();
  const { selectedKey } = useSwapState();
  const { data: pairsData, loading } = useFeaturedPairs();
  const [hasInitialData, setHasInitialData] = useState(false);

  const pairKey = (selectedKey || sp.get('pair') || 'plsx-wpls') as FeaturedKey;

  // Track initial data load
  useEffect(() => {
    if (!loading && pairsData && pairsData[pairKey] !== undefined) {
      setHasInitialData(true);
    }
  }, [loading, pairsData, pairKey]);

  // Get data for the selected pair from context
  const dexPair = pairsData[pairKey];

  const change24h = dexPair?.priceChange?.h24 ?? undefined;

  return (
    <div className="flex items-center gap-12">
      {/* Mark (Current Price) */}
      <div className="flex flex-col">
        <div className="text-xs text-neutral-400">Mark</div>
        <div className="text-xs font-light text-white">
          {!hasInitialData && loading ? '...' : fmtUsd(dexPair?.priceUsd)}
        </div>
      </div>

      {/* 24h Change */}
      <div className="flex flex-col">
        <div className="text-xs text-neutral-400">24h Change</div>
        <div className={`text-xs font-light change-value ${change24h == null ? 'change-null' : change24h > 0 ? 'change-positive' : change24h < 0 ? 'change-negative' : 'change-zero'}`}>
          {!hasInitialData && loading ? '...' : fmtPct(change24h)}
        </div>
      </div>

      {/* 24h Volume */}
      <div className="flex flex-col">
        <div className="text-xs text-neutral-400">24h Volume</div>
        <div className="text-xs font-light text-white">
          {!hasInitialData && loading ? '...' : fmtUsd(dexPair?.volume?.h24)}
        </div>
      </div>
    </div>
  );
}
