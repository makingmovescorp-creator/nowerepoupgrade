'use client';
import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSwapState } from '@/lib/state';

type PairData = {
  mark: number;
  change24h: number;
  volume24h: number;
};

// Mock data for different pairs
const MOCK_PAIR_DATA: Record<string, PairData> = {
  'plsx-wpls': {
    mark: 0.00095,
    change24h: 2.45,
    volume24h: 1250000
  },
  'weth-wpls': {
    mark: 95.2,
    change24h: -1.23,
    volume24h: 850000
  },
  'hex-wpls': {
    mark: 0.0508,
    change24h: 5.67,
    volume24h: 2100000
  }
};

export default function PairInfo() {
  const sp = useSearchParams();
  const { selectedKey } = useSwapState();
  
  const pairKey = sp.get('pair') || selectedKey || 'plsx-wpls';
  const pairData = MOCK_PAIR_DATA[pairKey] || MOCK_PAIR_DATA['plsx-wpls'];

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(2);
    }
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `${(volume / 1000000).toFixed(1)}M`;
    } else if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`;
    }
    return volume.toString();
  };

  const changeColor = pairData.change24h >= 0 ? 'text-emerald-400' : 'text-red-400';
  const changeBg = pairData.change24h >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10';

  return (
    <div className="flex items-center gap-12">
      {/* Mark (Current Price) */}
      <div className="flex flex-col">
        <div className="text-xs text-neutral-400">Mark</div>
        <div className="text-xs font-light text-white">
          ${formatPrice(pairData.mark)}
        </div>
      </div>

      {/* 24h Change */}
      <div className="flex flex-col">
        <div className="text-xs text-neutral-400">24h Change</div>
        <div className={`text-xs font-light ${changeColor}`}>
          {pairData.change24h >= 0 ? '+' : ''}{pairData.change24h.toFixed(2)}%
        </div>
      </div>

      {/* 24h Volume */}
      <div className="flex flex-col">
        <div className="text-xs text-neutral-400">24h Volume</div>
        <div className="text-xs font-light text-white">
          ${formatVolume(pairData.volume24h)}
        </div>
      </div>
    </div>
  );
}
