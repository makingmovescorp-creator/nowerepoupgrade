'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSwapState } from '@/lib/state';
import { FEATURED_PAIRS } from '@/data/pairs';
import type { TF } from '@/lib/url';
import { getTfFromSearch } from '@/lib/url';
import TVChart from './TVChart';

function tfToInterval(tf: TF): string {
  switch (tf) {
    case '1m': return '1';
    case '5m': return '5';
    case '15m': return '15';
    case '1h': return '60';
    case '4h': return '240';
    case '1d': return 'D';
  }
}

export default function ChartWidget() {
  const sp = useSearchParams();
  const { selectedKey } = useSwapState();
  const tf = useMemo<TF>(() => getTfFromSearch(sp), [sp]);

  // Use selectedKey from global state as primary source, fallback to URL
  const currentPairKey = selectedKey || sp.get('pair') || 'plsx-wpls';
  const preset = FEATURED_PAIRS.find(p => p.key === currentPairKey) ?? FEATURED_PAIRS[0];
  const interval = tfToInterval(tf);

  const useTV = process.env.NEXT_PUBLIC_USE_TV === '1' || true;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      {useTV ? (
        <TVChart symbol={preset.tvSymbol} interval={interval} />
      ) : (
        // feature-flag: lokalny CandleChart do włączenia w przyszłości
        <div className="flex items-center justify-center h-full opacity-60 text-xs">
          Local CandleChart disabled (feature-flag)
        </div>
      )}
    </div>
  );
}
