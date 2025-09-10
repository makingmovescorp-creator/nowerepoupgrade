// components/MarketHeader.tsx
'use client';
import { useMemo } from 'react';
import { useSwapState } from '@/lib/state';

type Props = {
  lastPrice?: number;
  change24hPct?: number;
  loading?: boolean;
};

export default function MarketHeader({ lastPrice, change24hPct, loading }: Props) {
  const { selectedKey } = useSwapState();

  const changeStr = useMemo(() => {
    if (typeof change24hPct !== 'number') return '--';
    const sign = change24hPct >= 0 ? '+' : '';
    return `${sign}${change24hPct.toFixed(2)}%`;
  }, [change24hPct]);

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
      <div className="flex items-baseline gap-3">
        <div className="text-sm text-neutral-400">{(selectedKey ?? 'PAIR').toUpperCase()}</div>
        <div className="text-xl font-semibold text-emerald-300">
          {loading ? <span className="inline-block w-20 h-5 bg-white/10 rounded animate-pulse" /> : (lastPrice ?? '--')}
        </div>
      </div>
      <div className={`text-sm px-2 py-1 rounded-lg ${change24hPct === undefined ? 'bg-white/5 text-neutral-300' : change24hPct >= 0 ? 'bg-emerald-600/20 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
        {loading ? <span className="inline-block w-14 h-4 bg-white/10 rounded animate-pulse" /> : changeStr}
      </div>
    </div>
  );
}


