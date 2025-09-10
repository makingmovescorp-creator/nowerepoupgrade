'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSwapState } from '@/lib/state';
import { FEATURED_PAIRS } from '@/data/pairs';
import type { TF } from '@/lib/url';
import { getTfFromSearch } from '@/lib/url';
import TimeframeBar from './TimeframeBar';
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

export default function ChartPane() {
  const sp = useSearchParams();
  const { selectedKey } = useSwapState();
  const tf = useMemo<TF>(() => getTfFromSearch(sp), [sp]);

<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const keyFromUrl = sp.get('pair') || selectedKey || 'plsx-wpls';
  const preset = FEATURED_PAIRS.find(p => p.key === keyFromUrl) ?? FEATURED_PAIRS[0];
=======
  // Use selectedKey from global state as primary source, fallback to URL
  const currentPairKey = selectedKey || sp.get('pair') || 'plsx-wpls';
  const preset = FEATURED_PAIRS.find(p => p.key === currentPairKey) ?? FEATURED_PAIRS[0];
>>>>>>> Stashed changes
=======
  // Use selectedKey from global state as primary source, fallback to URL
  const currentPairKey = selectedKey || sp.get('pair') || 'plsx-wpls';
  const preset = FEATURED_PAIRS.find(p => p.key === currentPairKey) ?? FEATURED_PAIRS[0];
>>>>>>> Stashed changes
=======
  // Use selectedKey from global state as primary source, fallback to URL
  const currentPairKey = selectedKey || sp.get('pair') || 'plsx-wpls';
  const preset = FEATURED_PAIRS.find(p => p.key === currentPairKey) ?? FEATURED_PAIRS[0];
>>>>>>> Stashed changes
  const interval = tfToInterval(tf);

  const useTV = process.env.NEXT_PUBLIC_USE_TV === '1' || true;

  return (
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    <div className="rounded-2xl bg-[#131a1f]">
=======
    <div className="rounded-2xl bg-[#0f1923]">
>>>>>>> Stashed changes
=======
    <div className="rounded-2xl bg-[#0f1923]">
>>>>>>> Stashed changes
=======
    <div className="rounded-2xl bg-[#0f1923]">
>>>>>>> Stashed changes
      <div className="flex items-center justify-between px-3 pt-3 text-sm text-neutral-400">
        <span>{preset.label}</span>
        <span className="opacity-60">{useTV ? 'TradingView' : 'Local'}</span>
      </div>
      <div className="p-2">
        {useTV ? (
          <TVChart symbol={preset.tvSymbol} interval={interval} />
        ) : (
          // feature-flag: lokalny CandleChart do włączenia w przyszłości
          <div className="opacity-60 text-xs">Local CandleChart disabled (feature-flag)</div>
        )}
      </div>
    </div>
  );
}


